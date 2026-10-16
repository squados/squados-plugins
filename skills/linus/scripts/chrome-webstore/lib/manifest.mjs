import fs from 'node:fs';
import path from 'node:path';
import { bumpVersion } from './version.mjs';

export function readVersion(cwd) {
  const p = path.join(cwd, 'manifest.json');
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (typeof m.version !== 'string') throw new Error(`no string "version" in ${p}`);
  return m.version;
}

// Replace only the "version" value in-place, preserving every other byte of
// formatting (compact arrays, key order, indentation). A full JSON.stringify
// round-trip would reformat the whole file and produce noisy diffs.
function replaceVersion(text, from, to) {
  const re = new RegExp(`("version"\\s*:\\s*")${from.replace(/\./g, '\\.')}(")`);
  if (!re.test(text)) throw new Error(`could not locate "version": "${from}" to replace`);
  return text.replace(re, `$1${to}$2`);
}

export function applyBump(cwd, mode, { persist }) {
  const manifestPath = path.join(cwd, 'manifest.json');
  const manifestText = fs.readFileSync(manifestPath, 'utf8');
  const from = JSON.parse(manifestText).version;
  const to = bumpVersion(from, mode);
  if (persist) {
    fs.writeFileSync(manifestPath, replaceVersion(manifestText, from, to));
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkgText = fs.readFileSync(pkgPath, 'utf8');
      if (JSON.parse(pkgText).version === from) {
        fs.writeFileSync(pkgPath, replaceVersion(pkgText, from, to));
      }
    }
  }
  return { from, to };
}
