// Carro: física arcade, colisões, rodas, carroceria e efeitos.
import * as THREE from 'three';
import { Assets } from './assets.js';
import { CFG, clamp, damp, groundHeight, rand } from './config.js';
import { obbVsObb, circleVsObb } from './collision.js';

const S = CFG.CAR_SCALE;

const SPECS = {
  default: { accel: 8.5, maxV: 33, mass: 1200 },
  'sedan-sports': { accel: 11, maxV: 40, mass: 1100 },
  'hatchback-sports': { accel: 10.5, maxV: 38, mass: 1000 },
  police: { accel: 10, maxV: 38, mass: 1300 },
  suv: { accel: 8, maxV: 31, mass: 1700 },
  'suv-luxury': { accel: 8.5, maxV: 33, mass: 1800 },
  van: { accel: 6.5, maxV: 28, mass: 2000 },
  delivery: { accel: 6, maxV: 26, mass: 2600 },
  truck: { accel: 6.5, maxV: 28, mass: 2300 },
  ambulance: { accel: 7, maxV: 30, mass: 2500 },
};

const _q = [];

export class Car {
  constructor(game, key, x, z, h) {
    this.game = game;
    this.key = key;
    this.root = new THREE.Group();
    const model = Assets.clone(`cars/${key}`);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const cz = (box.min.z + box.max.z) / 2;
    model.scale.setScalar(S);
    model.position.z = -cz * S;
    this.root.add(model);
    this.model = model;
    this.hl = ((box.max.z - box.min.z) / 2) * S * 0.98;
    this.hw = ((box.max.x - box.min.x) / 2) * S * 0.96;
    this.height = box.max.y * S;

    // separa rodas e carroceria
    this.wheels = [];
    this.pivot = new THREE.Group();
    this.pivot.position.y = 0.45;
    const inner = new THREE.Group();
    inner.position.y = -0.45;
    this.pivot.add(inner);
    const kids = [...model.children];
    let fz = 0, rz = 0, wy = 0.3;
    for (const c of kids) {
      if (c.name.startsWith('wheel')) {
        c.rotation.order = 'YXZ';
        const front = c.name.includes('front');
        this.wheels.push({ obj: c, front });
        if (front) fz = c.position.z; else rz = c.position.z;
        wy = c.position.y;
      } else inner.add(c);
    }
    model.add(this.pivot);
    this.wheelR = wy * S;
    this.wheelBase = Math.max(1.5, (fz - rz) * S);
    this.frontZ = (fz - cz) * S;
    this.rearZ = (rz - cz) * S;

    const spec = SPECS[key] || SPECS.default;
    this.accel = spec.accel;
    this.maxV = spec.maxV;
    this.mass = spec.mass;
    this.inertia = this.mass * (this.hl * this.hl + this.hw * this.hw) / 3;

    this.x = x; this.z = z; this.h = h; this.y = 0;
    this.vx = 0; this.vz = 0; this.w = 0;
    this.vF = 0; this.vR = 0;
    this.steer = 0;
    this.input = { throttle: 0, steer: 0, handbrake: true };
    this.obb = { x, z, h, hl: this.hl, hw: this.hw };
    this.wheelSpin = 0;
    this.pitch = 0; this.roll = 0; this.longAcc = 0; this.latAcc = 0; this.yawRate = 0;
    this.engineOn = false;
    this.rpm = 0;
    this.gear = 1;
    this.damage = 0;
    this.driver = null; // 'player' | 'ai' | null
    this.driverModel = null;
    this.ai = null;
    this.lastCrash = 0;
    this.smokeT = 0;
    this.t = Math.random() * 10;
    this.skidding = 0;
    this.root.position.set(x, 0, z);
    this.root.rotation.y = h;
  }

  get speed() { return Math.hypot(this.vx, this.vz); }
  forward() { return [Math.sin(this.h), Math.cos(this.h)]; }
  // lado esquerdo do carro (lado do motorista)
  left() { return [Math.cos(this.h), -Math.sin(this.h)]; }
  toWorld(lx, lz) {
    const s = Math.sin(this.h), c = Math.cos(this.h);
    return [this.x + lx * c + lz * s, this.z - lx * s + lz * c];
  }
  toLocal(wx, wz) {
    const s = Math.sin(this.h), c = Math.cos(this.h), dx = wx - this.x, dz = wz - this.z;
    return [dx * c - dz * s, dx * s + dz * c];
  }

  step(dt) {
    const inp = this.input;
    let s = Math.sin(this.h), c = Math.cos(this.h);
    let vF = this.vx * s + this.vz * c;
    let vR = -this.vx * c + this.vz * s; // componente para a direita

    // direção: menos esterço em alta velocidade
    const steerMax = 0.62 - 0.4 * clamp(Math.abs(vF) / 32, 0, 1);
    this.steer = damp(this.steer, -inp.steer * steerMax, 10, dt);

    const thr = inp.throttle;
    let a = 0;
    let braking = false;
    if (thr > 0.05) {
      if (vF < -0.4) { a = 22 * thr; braking = true; }
      else a = this.accel * thr * (1 - clamp(vF / this.maxV, 0, 1) ** 2) * (1 - this.damage * 0.3);
    } else if (thr < -0.05) {
      if (vF > 0.4) { a = -22 * -thr; braking = true; }
      else a = -6 * -thr * (1 - clamp(-vF / 11, 0, 1));
    }
    const before = vF;
    vF += a * dt;
    if (braking && Math.sign(vF) !== Math.sign(before)) vF = 0;
    // atrito de rolagem + arrasto
    let roll = (Math.abs(thr) < 0.05 ? 1.6 : 0.3) + 0.0012 * vF * vF;
    if (inp.handbrake) roll += 7;
    const dv = Math.min(Math.abs(vF), roll * dt);
    vF -= Math.sign(vF) * dv;

    // aderência lateral (freio de mão = derrapagem)
    const grip = inp.handbrake ? (this.driver ? 1.6 : 4) : 14;
    vR *= Math.exp(-grip * dt);
    this.skidding = Math.abs(vR) > 2.5 || (inp.handbrake && Math.abs(vF) > 6) ? Math.min(1, Math.abs(vR) / 8 + 0.3) : 0;

    // giro
    let yaw = (vF * Math.tan(this.steer)) / this.wheelBase;
    if (inp.handbrake && this.driver) yaw *= 1.5;
    this.h += (yaw + this.w) * dt;
    this.w *= Math.exp(-5 * dt);

    this.longAcc = damp(this.longAcc, (vF - this.vF) / Math.max(dt, 1e-4), 6, dt);
    this.latAcc = damp(this.latAcc, vF * yaw, 6, dt);
    this.vF = vF; this.vR = vR;
    this.vx = s * vF - c * vR;
    this.vz = c * vF + s * vR;
    this.x += this.vx * dt;
    this.z += this.vz * dt;
    this.obb.x = this.x; this.obb.z = this.z; this.obb.h = this.h;
    this.yawRate = yaw;
  }

  collideStatic(world, onHit) {
    const r = Math.max(this.hl, this.hw) + 0.5;
    const cand = world.query(this.x - r, this.z - r, this.x + r, this.z + r, _q);
    for (const it of cand) {
      const col = it.type === 'box' ? obbVsObb(this.obb, it.obb) : circleVsObb(it.x, it.z, it.r, this.obb);
      if (!col) continue;
      this.x += col.nx * col.depth; this.z += col.nz * col.depth;
      this.obb.x = this.x; this.obb.z = this.z;
      const vn = this.vx * col.nx + this.vz * col.nz;
      if (vn < 0) {
        const e = 0.25;
        const j = -(1 + e) * vn * this.mass;
        // fricção tangencial
        const tx = -col.nz, tz = col.nx;
        const vt = this.vx * tx + this.vz * tz;
        this.vx += (j / this.mass) * col.nx - vt * 0.25 * tx;
        this.vz += (j / this.mass) * col.nz - vt * 0.25 * tz;
        const rx = col.px - this.x, rz = col.pz - this.z;
        this.w += clamp(((rz * col.nx - rx * col.nz) * j) / this.inertia, -3, 3);
        onHit && onHit(this, -vn, col.px, col.pz, it);
      }
    }
  }

  updateVisual(dt) {
    this.t += dt;
    // altura conforme o chão sob as rodas (meio-fio)
    const [fx, fz] = this.toWorld(0, this.frontZ);
    const [bx, bz] = this.toWorld(0, this.rearZ);
    const hf = groundHeight(fx, fz), hb = groundHeight(bx, bz);
    this.y = damp(this.y, (hf + hb) / 2, 14, dt);
    const slope = Math.atan2(hf - hb, this.frontZ - this.rearZ);
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.set(0, this.h, 0);
    this.root.rotateX(-slope);
    this.wheelSpin += (this.vF * dt) / this.wheelR;
    for (const w of this.wheels) {
      w.obj.rotation.x = this.wheelSpin;
      if (w.front) w.obj.rotation.y = this.steer;
    }
    // carroceria: inclina ao acelerar/frear e nas curvas
    const tp = clamp(-this.longAcc * 0.006, -0.07, 0.07);
    const tr = clamp(this.latAcc * 0.006, -0.08, 0.08);
    this.pitch = damp(this.pitch, tp, 8, dt);
    this.roll = damp(this.roll, tr, 8, dt);
    // proteção: um valor inválido sumiria com a carroceria
    if (!Number.isFinite(this.pitch)) this.pitch = 0;
    if (!Number.isFinite(this.roll)) this.roll = 0;
    this.pivot.rotation.x = this.pitch;
    this.pivot.rotation.z = this.roll;
    // vibração do motor em marcha lenta
    const idle = this.engineOn ? (0.004 + this.rpm * 0.002) : 0;
    this.pivot.position.y = 0.45 + Math.sin(this.t * 47) * idle / S;
    this.pivot.rotation.z += this.engineOn ? Math.sin(this.t * 31) * 0.004 : 0;
  }

  // rotação do motor e marcha simulada (só para som e efeitos)
  updateEngine(dt) {
    const v = Math.abs(this.vF);
    const gears = [0, 9, 17, 25, 33, 60];
    let g = 1;
    while (g < gears.length - 1 && v > gears[g]) g++;
    this.gear = g;
    const lo = gears[g - 1], hi = gears[g];
    let target = 0.08 + ((v - lo) / (hi - lo)) * 0.75;
    if (g === 1) target = 0.08 + (v / hi) * 0.8;
    const thr = Math.abs(this.input.throttle);
    target += thr * 0.12;
    if (!this.engineOn) target = 0;
    this.rpm = damp(this.rpm, clamp(target, 0, 1), 7, dt);
  }

  effects(dt, fx) {
    this.smokeT -= dt;
    if (this.engineOn && this.smokeT <= 0) {
      this.smokeT = 0.12 + Math.random() * 0.1 - this.rpm * 0.08;
      const [ex, ez] = this.toWorld(-this.hw * 0.45, -this.hl - 0.1);
      const [bx, bz] = this.forward();
      fx.emit(ex, this.y + 0.35, ez, -bx * rand(0.5, 1.2), rand(0.2, 0.6), -bz * rand(0.5, 1.2), { life: 0.9, size: 0.18 + this.rpm * 0.2, color: [0.7, 0.7, 0.72], alpha: 0.35, gravity: 0.4, drag: 2, grow: 2.2 });
    }
    if (this.damage > 0.55 && Math.random() < dt * (6 + this.damage * 10)) {
      const [hx, hz] = this.toWorld(0, this.hl * 0.75);
      const dark = this.damage > 0.8;
      fx.smoke(hx, this.y + this.height * 0.65, hz, { size: 0.5, color: dark ? [0.25, 0.25, 0.27] : [0.85, 0.85, 0.85], alpha: 0.5, rise: 1.6, spread: 0.3 });
    }
  }
}

// Colisão entre dois carros com impulso e giro
export function collideCars(a, b, onHit) {
  const dx = a.x - b.x, dz = a.z - b.z, rr = a.hl + b.hl + 0.5;
  if (dx * dx + dz * dz > rr * rr) return;
  const col = obbVsObb(a.obb, b.obb);
  if (!col) return;
  const { nx, nz, depth, px, pz } = col;
  const ma = a.mass, mb = b.mass, tot = ma + mb;
  a.x += nx * depth * (mb / tot); a.z += nz * depth * (mb / tot);
  b.x -= nx * depth * (ma / tot); b.z -= nz * depth * (ma / tot);
  a.obb.x = a.x; a.obb.z = a.z; b.obb.x = b.x; b.obb.z = b.z;
  const rvx = a.vx - b.vx, rvz = a.vz - b.vz;
  const vn = rvx * nx + rvz * nz;
  if (vn >= 0) return;
  const e = 0.3;
  const j = (-(1 + e) * vn) / (1 / ma + 1 / mb);
  a.vx += (j * nx) / ma; a.vz += (j * nz) / ma;
  b.vx -= (j * nx) / mb; b.vz -= (j * nz) / mb;
  const rax = px - a.x, raz = pz - a.z, rbx = px - b.x, rbz = pz - b.z;
  a.w += clamp(((raz * nx - rax * nz) * j) / a.inertia, -3, 3);
  b.w -= clamp(((rbz * nx - rbx * nz) * j) / b.inertia, -3, 3);
  onHit && onHit(a, b, -vn, px, pz);
}
