#!/usr/bin/env node
/**
 * canva-duplicate.mjs
 * Duplicates a Canva design via OAuth 2.0 Authorization Code + PKCE.
 * Saves refresh token to .env for future runs.
 *
 * Usage:
 *   node scripts/canva-duplicate.mjs <source_design_id> [title]
 *
 * Required in .env:
 *   CANVA_CLIENT_ID
 *   CANVA_CLIENT_SECRET
 *
 * Saved automatically after first auth:
 *   CANVA_REFRESH_TOKEN
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash, randomBytes } from 'crypto';
import { execSync } from 'child_process';

const ENV_PATH = resolve(process.cwd(), '.env');

// ── env helpers ──────────────────────────────────────────────────────────────

function loadEnv() {
  if (!existsSync(ENV_PATH)) return;
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}

function saveEnvKey(key, value) {
  let content = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  content = re.test(content) ? content.replace(re, line) : content.trimEnd() + '\n' + line + '\n';
  writeFileSync(ENV_PATH, content);
  process.env[key] = value;
}

loadEnv();

// ── args & config ─────────────────────────────────────────────────────────────

const SOURCE_ID = process.argv[2];
const TITLE = process.argv[3];

if (!SOURCE_ID) {
  console.error('Usage: node scripts/canva-duplicate.mjs <source_design_id> [title]');
  process.exit(1);
}

const CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: set CANVA_CLIENT_ID and CANVA_CLIENT_SECRET in .env');
  process.exit(1);
}

const REDIRECT_URI = process.env.CANVA_REDIRECT_URI ?? 'http://localhost:3000/callback';
const SCOPES = 'design:content:read design:content:write design:meta:read';
const TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';
const AUTH_URL = 'https://www.canva.com/api/oauth/authorize';

// ── PKCE ──────────────────────────────────────────────────────────────────────

function pkce() {
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

// ── OAuth: exchange code ──────────────────────────────────────────────────────

async function exchangeCode(code, verifier) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code_verifier: verifier,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Code exchange failed: ${JSON.stringify(data)}`);
  return data;
}

// ── OAuth: refresh ────────────────────────────────────────────────────────────

async function refreshToken(token) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Refresh failed: ${JSON.stringify(data)}`);
  return data;
}

// ── OAuth: browser flow ───────────────────────────────────────────────────────

function browserAuth() {
  return new Promise((resolve, reject) => {
    const { verifier, challenge } = pkce();
    const state = randomBytes(16).toString('hex');

    const authUrl = new URL(AUTH_URL);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    console.error('Opening Canva authorization in browser…');
    try { execSync(`open "${authUrl.toString()}"`); } catch {
      console.error('Open manually:', authUrl.toString());
    }

    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith('/callback')) return;
      const url = new URL(req.url, 'http://localhost:3000');
      const code = url.searchParams.get('code');
      const retState = url.searchParams.get('state');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Authorized ✓ — you can close this tab.</h2>');
      server.close();

      if (retState !== state) return reject(new Error('State mismatch'));
      if (!code) return reject(new Error('No code in callback'));
      resolve({ code, verifier });
    });

    server.listen(3000, () => console.error('Waiting for Canva callback on :3000 …'));
    server.on('error', reject);
  });
}

// ── Canva: duplicate design ───────────────────────────────────────────────────

async function duplicateDesign(accessToken, sourceId, title) {
  const body = { design_id: sourceId };
  if (title) body.title = title;

  const res = await fetch('https://api.canva.com/rest/v1/designs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Duplicate failed (${res.status}): ${JSON.stringify(data)}`);
  return data.design ?? data;
}

// ── main ──────────────────────────────────────────────────────────────────────

(async () => {
  try {
    let accessToken;

    if (process.env.CANVA_REFRESH_TOKEN) {
      // Try saved refresh token first
      try {
        const tokens = await refreshToken(process.env.CANVA_REFRESH_TOKEN);
        accessToken = tokens.access_token;
        if (tokens.refresh_token) saveEnvKey('CANVA_REFRESH_TOKEN', tokens.refresh_token);
      } catch {
        console.error('Refresh token expired — re-authorizing…');
        process.env.CANVA_REFRESH_TOKEN = '';
      }
    }

    if (!accessToken) {
      // Full browser OAuth flow
      const { code, verifier } = await browserAuth();
      const tokens = await exchangeCode(code, verifier);
      accessToken = tokens.access_token;
      if (tokens.refresh_token) saveEnvKey('CANVA_REFRESH_TOKEN', tokens.refresh_token);
    }

    const design = await duplicateDesign(accessToken, SOURCE_ID, TITLE);

    const id = design.id ?? design.design_id;
    const editUrl = design.urls?.edit_url ?? design.edit_url ?? '(check Canva)';

    console.log(JSON.stringify({ design_id: id, edit_url: editUrl }, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
