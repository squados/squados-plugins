// engine/upload.mjs
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { loadProjectConfig, writeProjectConfig, inferDefaults, loadCentralCreds } from './lib/config.mjs';
import { applyBump } from './lib/manifest.mjs';
import { getAccessToken } from './lib/auth.mjs';
import { uploadDraft, fetchStatus } from './lib/cws.mjs';

function parseArgs(argv) {
  const args = { cwd: process.cwd(), bump: 'patch', dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--cwd') args.cwd = argv[++i];
    else if (a === '--bump') args.bump = argv[++i];
    else if (a === '--version') args.version = argv[++i];
    else if (a === '--item-id') args.itemId = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cwd = path.resolve(args.cwd);

  let cfg = loadProjectConfig(cwd);
  const needsConfig = !cfg;
  if (!cfg) {
    if (!args.itemId) {
      throw new Error(
        'no .chrome-webstore.json found. Ask the user for the extension itemId and re-run with --item-id <id>.',
      );
    }
    cfg = { itemId: args.itemId, ...inferDefaults(cwd) };
  }

  const mode = args.version || args.bump;
  const zipPath = path.resolve(cwd, cfg.zip);
  if (args.dryRun) {
    const { from, to } = applyBump(cwd, mode, { persist: false });
    console.log(JSON.stringify({ dryRun: true, itemId: cfg.itemId, from, to,
      zipPath, packageCommand: cfg.package }, null, 2));
    return;
  }

  const { saKeyPath, publisherId } = loadCentralCreds();

  // Acquire the token BEFORE mutating the manifest or running the (slow)
  // build. A bad/unregistered service account then aborts cleanly without
  // leaving a phantom version bump behind or wasting a build.
  const accessToken = await getAccessToken(saKeyPath);

  if (needsConfig) writeProjectConfig(cwd, cfg);
  const { from, to } = applyBump(cwd, mode, { persist: true });
  console.error(`version ${from} -> ${to}`);

  execSync(cfg.package, { cwd, stdio: 'inherit' });

  if (!fs.existsSync(zipPath)) throw new Error(`zip not found after package: ${zipPath}`);

  const up = await uploadDraft({ accessToken, publisherId, itemId: cfg.itemId, zipPath });
  console.log('UPLOAD RESPONSE:', JSON.stringify(up, null, 2));
  const status = await fetchStatus({ accessToken, publisherId, itemId: cfg.itemId });
  console.log('STATUS RESPONSE:', JSON.stringify(status, null, 2));
  console.log('\nDraft uploaded — publish manually in the Web Store dashboard.');
}

main().catch((err) => {
  console.error(String(err.message || err));
  // Set exitCode instead of process.exit(): a hard exit while an undici
  // (fetch) socket is still closing intermittently trips a libuv teardown
  // assertion on Windows and returns a bogus exit code. Letting the loop
  // drain naturally exits cleanly with code 1.
  process.exitCode = 1;
});
