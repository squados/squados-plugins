import fs from 'node:fs';
import path from 'node:path';

const CONFIG_NAME = '.chrome-webstore.json';

export function loadProjectConfig(cwd) {
  const p = path.join(cwd, CONFIG_NAME);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function writeProjectConfig(cwd, cfg) {
  const p = path.join(cwd, CONFIG_NAME);
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
}

export function inferDefaults(cwd) {
  return { package: 'npm run package', zip: `${path.basename(cwd)}.zip` };
}

export function loadCentralCreds() {
  const env = process.env;
  const saKeyPath = env.CHROME_WEBSTORE_SA_KEY_PATH;
  const publisherId = env.CHROME_WEBSTORE_PUBLISHER_ID;
  if (!saKeyPath || !publisherId) {
    throw new Error(
      'runtime must supply CHROME_WEBSTORE_SA_KEY_PATH and CHROME_WEBSTORE_PUBLISHER_ID',
    );
  }
  return { saKeyPath, publisherId };
}
