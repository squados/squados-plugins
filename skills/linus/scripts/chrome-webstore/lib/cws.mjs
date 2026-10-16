// engine/lib/cws.mjs
import fs from 'node:fs';

const BASE = 'https://chromewebstore.googleapis.com';

export async function uploadDraft({ accessToken, publisherId, itemId, zipPath }) {
  const url = `${BASE}/upload/v2/publishers/${publisherId}/items/${itemId}:upload`;
  const body = fs.readFileSync(zipPath);
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`upload failed (${res.status}): ${text}`);
  return text ? JSON.parse(text) : {};
}

export async function fetchStatus({ accessToken, publisherId, itemId }) {
  const url = `${BASE}/v2/publishers/${publisherId}/items/${itemId}:fetchStatus`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`fetchStatus failed (${res.status}): ${text}`);
  return text ? JSON.parse(text) : {};
}
