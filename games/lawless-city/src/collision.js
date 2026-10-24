// Colisão 2D (plano XZ) com altura simples. Estáticos ficam numa grade espacial.
import { clamp } from './config.js';

export class World {
  constructor(cell = 8) {
    this.cell = cell;
    this.grid = new Map();
    this.items = [];
    this.stamp = 0;
  }
  _key(ix, iz) { return (ix + 2000) * 8192 + (iz + 2000); }
  add(it) {
    it._s = 0;
    this.items.push(it);
    const c = this.cell;
    for (let ix = Math.floor(it.minX / c); ix <= Math.floor(it.maxX / c); ix++)
      for (let iz = Math.floor(it.minZ / c); iz <= Math.floor(it.maxZ / c); iz++) {
        const k = this._key(ix, iz);
        let a = this.grid.get(k);
        if (!a) this.grid.set(k, (a = []));
        a.push(it);
      }
    return it;
  }
  addBox(minX, minZ, maxX, maxZ, h = 60, kind = 'building') {
    const it = { type: 'box', minX, minZ, maxX, maxZ, h, kind };
    it.obb = { x: (minX + maxX) / 2, z: (minZ + maxZ) / 2, h: 0, hl: (maxZ - minZ) / 2, hw: (maxX - minX) / 2 };
    return this.add(it);
  }
  addCircle(x, z, r, h = 5, kind = 'pole') {
    return this.add({ type: 'circle', x, z, r, h, kind, minX: x - r, maxX: x + r, minZ: z - r, maxZ: z + r });
  }
  query(minX, minZ, maxX, maxZ, out = []) {
    out.length = 0;
    const s = ++this.stamp, c = this.cell;
    for (let ix = Math.floor(minX / c); ix <= Math.floor(maxX / c); ix++)
      for (let iz = Math.floor(minZ / c); iz <= Math.floor(maxZ / c); iz++) {
        const a = this.grid.get(this._key(ix, iz));
        if (!a) continue;
        for (const it of a) if (it._s !== s) { it._s = s; out.push(it); }
      }
    return out;
  }
}

const _q = [];
// Empurra um círculo para fora dos estáticos. Retorna a normal do último contato.
export function resolveCircle(world, p, r) {
  let hit = null;
  const cand = world.query(p.x - r, p.z - r, p.x + r, p.z + r, _q);
  for (const it of cand) {
    if (it.type === 'box') {
      const cx = clamp(p.x, it.minX, it.maxX), cz = clamp(p.z, it.minZ, it.maxZ);
      const dx = p.x - cx, dz = p.z - cz, d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      if (d2 > 1e-9) {
        const d = Math.sqrt(d2), nx = dx / d, nz = dz / d;
        p.x = cx + nx * r; p.z = cz + nz * r;
        hit = { nx, nz, item: it };
      } else {
        const l = p.x - it.minX, rr = it.maxX - p.x, b = p.z - it.minZ, t = it.maxZ - p.z;
        const m = Math.min(l, rr, b, t);
        if (m === l) { p.x = it.minX - r; hit = { nx: -1, nz: 0, item: it }; }
        else if (m === rr) { p.x = it.maxX + r; hit = { nx: 1, nz: 0, item: it }; }
        else if (m === b) { p.z = it.minZ - r; hit = { nx: 0, nz: -1, item: it }; }
        else { p.z = it.maxZ + r; hit = { nx: 0, nz: 1, item: it }; }
      }
    } else {
      const dx = p.x - it.x, dz = p.z - it.z, rr = r + it.r, d2 = dx * dx + dz * dz;
      if (d2 >= rr * rr) continue;
      const d = Math.sqrt(d2) || 1e-4, nx = d2 > 1e-9 ? dx / d : 1, nz = d2 > 1e-9 ? dz / d : 0;
      p.x = it.x + nx * rr; p.z = it.z + nz * rr;
      hit = { nx, nz, item: it };
    }
  }
  return hit;
}

export function obbAxes(o) {
  const s = Math.sin(o.h), c = Math.cos(o.h);
  return { fx: s, fz: c, rx: -c, rz: s };
}

export function obbCorners(o, out) {
  const A = obbAxes(o);
  let k = 0;
  for (const sf of [1, -1]) for (const sr of [1, -1]) {
    out[k++] = o.x + A.fx * o.hl * sf + A.rx * o.hw * sr;
    out[k++] = o.z + A.fz * o.hl * sf + A.rz * o.hw * sr;
  }
  return out;
}

export function pointInObb(px, pz, o, margin = 0) {
  const A = obbAxes(o), dx = px - o.x, dz = pz - o.z;
  return Math.abs(dx * A.fx + dz * A.fz) <= o.hl + margin && Math.abs(dx * A.rx + dz * A.rz) <= o.hw + margin;
}

const _ca = new Array(8), _cb = new Array(8);
// SAT entre dois retângulos orientados. Normal empurra "a" para fora de "b".
export function obbVsObb(a, b) {
  const A = obbAxes(a), B = obbAxes(b);
  const axes = [A.fx, A.fz, A.rx, A.rz, B.fx, B.fz, B.rx, B.rz];
  const dx = a.x - b.x, dz = a.z - b.z;
  let best = Infinity, nx = 0, nz = 0;
  for (let i = 0; i < 8; i += 2) {
    const ax = axes[i], az = axes[i + 1];
    const ra = a.hl * Math.abs(A.fx * ax + A.fz * az) + a.hw * Math.abs(A.rx * ax + A.rz * az);
    const rb = b.hl * Math.abs(B.fx * ax + B.fz * az) + b.hw * Math.abs(B.rx * ax + B.rz * az);
    const dist = dx * ax + dz * az;
    const o = ra + rb - Math.abs(dist);
    if (o <= 0) return null;
    if (o < best) { best = o; const s = dist < 0 ? -1 : 1; nx = ax * s; nz = az * s; }
  }
  // ponto de contato aproximado
  obbCorners(a, _ca); obbCorners(b, _cb);
  let px = 0, pz = 0, n = 0;
  for (let i = 0; i < 8; i += 2) if (pointInObb(_ca[i], _ca[i + 1], b, 0.05)) { px += _ca[i]; pz += _ca[i + 1]; n++; }
  for (let i = 0; i < 8; i += 2) if (pointInObb(_cb[i], _cb[i + 1], a, 0.05)) { px += _cb[i]; pz += _cb[i + 1]; n++; }
  if (n) { px /= n; pz /= n; } else { px = (a.x + b.x) / 2; pz = (a.z + b.z) / 2; }
  return { nx, nz, depth: best, px, pz };
}

// Círculo contra retângulo orientado. Normal empurra o retângulo para longe do círculo.
export function circleVsObb(cx, cz, r, o) {
  const A = obbAxes(o), dx = cx - o.x, dz = cz - o.z;
  const lf = dx * A.fx + dz * A.fz, lr = dx * A.rx + dz * A.rz;
  const qf = clamp(lf, -o.hl, o.hl), qr = clamp(lr, -o.hw, o.hw);
  let ex = lf - qf, er = lr - qr;
  const d2 = ex * ex + er * er;
  let nf, nr, depth;
  if (d2 > 1e-9) {
    if (d2 >= r * r) return null;
    const d = Math.sqrt(d2);
    nf = ex / d; nr = er / d; depth = r - d;
  } else {
    // centro dentro do retângulo
    const pf = o.hl - Math.abs(lf), pr = o.hw - Math.abs(lr);
    if (pf < pr) { nf = Math.sign(lf) || 1; nr = 0; depth = pf + r; }
    else { nr = Math.sign(lr) || 1; nf = 0; depth = pr + r; }
  }
  // normal do retângulo para o círculo, em mundo
  const wx = A.fx * nf + A.rx * nr, wz = A.fz * nf + A.rz * nr;
  const px = o.x + A.fx * qf + A.rx * qr, pz = o.z + A.fz * qf + A.rz * qr;
  return { nx: -wx, nz: -wz, depth, px, pz };
}

// Raio 2D contra caixa alinhada. Retorna {t,nx,nz} ou null.
export function rayBox(ox, oz, dx, dz, minX, minZ, maxX, maxZ, maxT) {
  let tmin = 0, tmax = maxT, nx = 0, nz = 0;
  if (Math.abs(dx) < 1e-9) { if (ox < minX || ox > maxX) return null; }
  else {
    let t1 = (minX - ox) / dx, t2 = (maxX - ox) / dx, n = -1;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; n = 1; }
    if (t1 > tmin) { tmin = t1; nx = n; nz = 0; }
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (Math.abs(dz) < 1e-9) { if (oz < minZ || oz > maxZ) return null; }
  else {
    let t1 = (minZ - oz) / dz, t2 = (maxZ - oz) / dz, n = -1;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; n = 1; }
    if (t1 > tmin) { tmin = t1; nx = 0; nz = n; }
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (tmin <= 0) return null; // origem dentro
  return { t: tmin, nx, nz };
}

export function rayObb(ox, oz, dx, dz, o, maxT) {
  const A = obbAxes(o), rx = ox - o.x, rz = oz - o.z;
  const lu = rx * A.rx + rz * A.rz, lv = rx * A.fx + rz * A.fz;
  const du = dx * A.rx + dz * A.rz, dv = dx * A.fx + dz * A.fz;
  const h = rayBox(lu, lv, du, dv, -o.hw, -o.hl, o.hw, o.hl, maxT);
  if (!h) return null;
  return { t: h.t, nx: A.rx * h.nx + A.fx * h.nz, nz: A.rz * h.nx + A.fz * h.nz };
}

export function rayCircle(ox, oz, dx, dz, cx, cz, r, maxT) {
  const fx = ox - cx, fz = oz - cz;
  const b = fx * dx + fz * dz, c = fx * fx + fz * fz - r * r;
  const disc = b * b - c;
  if (disc < 0) return null;
  const t = -b - Math.sqrt(disc);
  if (t <= 0 || t > maxT) return null;
  const hx = ox + dx * t - cx, hz = oz + dz * t - cz, l = Math.hypot(hx, hz) || 1;
  return { t, nx: hx / l, nz: hz / l };
}

// Raio contra estáticos com teste de altura
export function raycastStatic(world, ox, oy, oz, dx, dy, dz, maxT) {
  const h2 = Math.hypot(dx, dz) || 1e-6;
  const ndx = dx / h2, ndz = dz / h2;
  const ex = ox + ndx * maxT, ez = oz + ndz * maxT;
  const cand = world.query(Math.min(ox, ex), Math.min(oz, ez), Math.max(ox, ex), Math.max(oz, ez), []);
  let best = null;
  for (const it of cand) {
    const h = it.type === 'box'
      ? rayBox(ox, oz, ndx, ndz, it.minX, it.minZ, it.maxX, it.maxZ, maxT)
      : rayCircle(ox, oz, ndx, ndz, it.x, it.z, it.r, maxT);
    if (!h) continue;
    const y = oy + (dy / h2) * h.t;
    if (y < 0 || y > it.h) continue;
    if (!best || h.t < best.t) best = { ...h, item: it };
  }
  return best;
}
