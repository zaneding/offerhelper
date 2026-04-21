#!/usr/bin/env node
/**
 * setup.mjs — one-time OAuth flow to get & save refresh token
 * Run once: node mcp/canva-tools/setup.mjs
 */

import { createServer } from 'http';
import { createHash, randomBytes } from 'crypto';
import { execSync } from 'child_process';
import { loadEnv, saveEnvKey } from './auth.mjs';

loadEnv();

const CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.CANVA_REDIRECT_URI ?? 'http://localhost:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set CANVA_CLIENT_ID and CANVA_CLIENT_SECRET in .env first');
  process.exit(1);
}

const AUTH_URL = 'https://www.canva.com/api/oauth/authorize';
const TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';
const SCOPES = 'design:content:read design:content:write design:meta:read';

function pkce() {
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

const { verifier, challenge } = pkce();
const state = randomBytes(16).toString('hex');

const url = new URL(AUTH_URL);
url.searchParams.set('response_type', 'code');
url.searchParams.set('client_id', CLIENT_ID);
url.searchParams.set('redirect_uri', REDIRECT_URI);
url.searchParams.set('scope', SCOPES);
url.searchParams.set('state', state);
url.searchParams.set('code_challenge', challenge);
url.searchParams.set('code_challenge_method', 'S256');

console.log('\nOpening Canva authorization…');
console.log('If browser does not open, visit:\n', url.toString(), '\n');
try { execSync(`open "${url.toString()}"`); } catch {}

// Listen on localhost regardless — ngrok forwards to here
const localPort = new URL(REDIRECT_URI.replace(/^https?:\/\/[^/]+/, 'http://localhost')).port || 3000;

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) return;

  const params = new URL(req.url, `http://localhost:${localPort}`).searchParams;
  const code = params.get('code');
  const retState = params.get('state');

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>Setup complete ✓ — you can close this tab.</h2>');
  server.close();

  if (retState !== state) { console.error('State mismatch'); process.exit(1); }
  if (!code) { console.error('No code in callback'); process.exit(1); }

  const tokenRes = await fetch(TOKEN_URL, {
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
  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    console.error('Token exchange failed:', JSON.stringify(tokens));
    process.exit(1);
  }

  if (tokens.refresh_token) {
    saveEnvKey('CANVA_REFRESH_TOKEN', tokens.refresh_token);
    console.log('✓ CANVA_REFRESH_TOKEN saved to .env');
  } else {
    console.warn('No refresh_token returned — check Canva app offline_access scope');
  }

  console.log('Setup complete. MCP server is ready to use.');
  process.exit(0);
});

server.listen(localPort, () => console.log(`Waiting for callback on :${localPort} …`));
