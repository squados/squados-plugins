export function parseVersion(str) {
  if (typeof str !== 'string' || str.length === 0) {
    throw new Error(`invalid version: ${JSON.stringify(str)}`);
  }
  const segs = str.split('.');
  if (segs.length < 1 || segs.length > 4) {
    throw new Error(`version must have 1-4 segments: ${str}`);
  }
  return segs.map((s) => {
    if (!/^\d+$/.test(s)) throw new Error(`non-integer version segment in ${str}`);
    return Number(s);
  });
}

export function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

export function bumpVersion(current, mode) {
  const segs = parseVersion(current);
  if (mode === 'patch') {
    segs[segs.length - 1] += 1;
    return segs.join('.');
  }
  if (mode === 'minor') {
    const out = [segs[0] ?? 0, (segs[1] ?? 0) + 1];
    return out.join('.');
  }
  if (mode === 'major') {
    return String((segs[0] ?? 0) + 1);
  }
  // explicit version
  parseVersion(mode); // throws if malformed
  if (compareVersions(mode, current) !== 1) {
    throw new Error(`explicit version ${mode} must be greater than ${current}`);
  }
  return mode;
}
