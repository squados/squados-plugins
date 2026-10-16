// engine/lib/auth.mjs
import fs from 'node:fs';
import crypto from 'node:crypto';

const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';

function b64url(objOrBuf) {
  const buf = Buffer.isBuffer(objOrBuf) ? objOrBuf : Buffer.from(JSON.stringify(objOrBuf));
  return buf.toString('base64url');
}

export async function getAccessToken(saKeyPath) {
  const key = JSON.parse(fs.readFileSync(saKeyPath, 'utf8'));
  if (!key.client_email || !key.private_key) {
    throw new Error(`SA key at ${saKeyPath} missing client_email/private_key`);
  }
  const tokenUri = key.token_uri || 'https://oauth2.googleapis.com/token';
  if (tokenUri !== 'https://oauth2.googleapis.com/token') {
    throw new Error('unsupported token endpoint in service account credential');
  }
  const iat = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = { iss: key.client_email, scope: SCOPE, aud: tokenUri, iat, exp: iat + 3600 };
  const signingInput = `${b64url(header)}.${b64url(claim)}`;
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(key.private_key);
  const jwt = `${signingInput}.${b64url(signature)}`;

  const res = await fetch(tokenUri, {
    method: 'POST',
    redirect: 'error',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`token exchange failed (${res.status})`);
  }
  const json = JSON.parse(text);
  if (!json.access_token) throw new Error('no access_token in token response');
  return json.access_token;
}
