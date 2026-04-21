/**
 * auth.mjs — Canva OAuth token management
 * Reads/writes tokens from the project root .env
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ENV_PATH = resolve(ROOT, '.env');

export function loadEnv() {
  if (!existsSync(ENV_PATH)) return;
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}

export function saveEnvKey(key, value) {
  let content = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  content = re.test(content) ? content.replace(re, line) : content.trimEnd() + '\n' + line + '\n';
  writeFileSync(ENV_PATH, content);
  process.env[key] = value;
}

const TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token';

async function refresh(refreshToken) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.CANVA_CLIENT_ID,
      client_secret: process.env.CANVA_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Refresh failed: ${JSON.stringify(data)}`);
  return data;
}

export async function getAccessToken() {
  loadEnv();

  const { CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, CANVA_REFRESH_TOKEN } = process.env;

  if (!CANVA_CLIENT_ID || !CANVA_CLIENT_SECRET) {
    throw new Error('CANVA_CLIENT_ID and CANVA_CLIENT_SECRET must be set in .env');
  }
  if (!CANVA_REFRESH_TOKEN) {
    throw new Error('No CANVA_REFRESH_TOKEN found. Run: npm run setup (in mcp/canva-tools/)');
  }

  const tokens = await refresh(CANVA_REFRESH_TOKEN);
  if (tokens.refresh_token) saveEnvKey('CANVA_REFRESH_TOKEN', tokens.refresh_token);
  return tokens.access_token;
}
