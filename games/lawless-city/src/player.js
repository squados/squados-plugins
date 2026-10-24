// Jogador: corre a pé com a pistola, atira, entra e sai de carros.
import * as THREE from 'three';
import { Assets, PLAYER_KEY } from './assets.js';
import { CharModel } from './character.js';
import { CFG, clamp, damp, angleDiff, groundHeight } from './config.js';
import { resolveCircle, circleVsObb, raycastStatic, rayObb, rayCircle } from './collision.js';

const RUN_SPEED = 6.4;
const RADIUS = 0.35;
const FIRE_DELAY = 0.2;
const RANGE = 70;
const _armQ = new THREE.Quaternion();
const _recQ = new THREE.Quaternion();
const _v = new THREE.Vector3();
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

export class Player {
  constructor(game, x, z, h) {
    this.game = game;
    this.cm = new CharModel(PLAYER_KEY, { armless: true });
    this.root = this.cm.root;
    game.scene.add(this.root);
    // pistola presa ao braço direito (o braço aponta para -X local)
    const gun = Assets.clone('weapon/pistol');
    gun.scale.setScalar(0.36);
    gun.rotation.y = -Math.PI / 2;
    gun.position.set(-0.215, -0.058, 0);
    this.cm.armR.add(gun);
    this.gun = gun;
    this.muzzleLocal = new THREE.Vector3(0, 0.17, 0.17);
    this.x = x; this.z = z; this.h = h; this.y = groundHeight(x, z);
    this.vx = 0; this.vz = 0;
    this.car = null;
    this.trans = null; // animação de entrar/sair
    this.cool = 0;
    this.recoil = 0;
    this.stepT = 0;
    this.moving = false;
    this.cm.play('idle');
    this.sync();
  }

  get onFoot() { return !this.car && !this.trans; }

  sync() {
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.y = this.h;
  }

  muzzleWorld(out) {
    this.root.updateMatrixWorld(true);
    return this.gun.localToWorld(out.copy(this.muzzleLocal));
  }

  update(dt, inp) {
    const g = this.game;
    if (this.trans) return this.updateTransition(dt);
    if (this.car) {
      const c = this.car;
      c.input.throttle = (inp.up ? 1 : 0) - (inp.down ? 1 : 0);
      c.input.steer = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      c.input.handbrake = inp.brake;
      this.x = c.x; this.z = c.z;
      return;
    }
    // ---- a pé ----
    const cy = g.cam.yaw;
    const fx = Math.sin(cy), fz = Math.cos(cy);
    const ix = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const iz = (inp.up ? 1 : 0) - (inp.down ? 1 : 0);
    let mx = fx * iz - fz * ix, mz = fz * iz + fx * ix;
    const ml = Math.hypot(mx, mz);
    this.moving = ml > 0.01;
    if (this.moving) {
      mx /= ml; mz /= ml;
      const target = Math.atan2(mx, mz);
      const d = angleDiff(this.h, target);
      this.h += clamp(d, -16 * dt, 16 * dt);
      this.vx = damp(this.vx, mx * RUN_SPEED, 14, dt);
      this.vz = damp(this.vz, mz * RUN_SPEED, 14, dt);
      this.cm.play('sprint', { fade: 0.12, timeScale: 1.05 });
      this.stepT -= dt;
      if (this.stepT <= 0) { this.stepT = 0.25; g.audio.footstep(this.x, this.z); }
    } else {
      this.vx = damp(this.vx, 0, 22, dt);
      this.vz = damp(this.vz, 0, 22, dt);
      if (Math.hypot(this.vx, this.vz) < 0.6) this.cm.play('idle', { fade: 0.15 });
    }
    const p = { x: this.x + this.vx * dt, z: this.z + this.vz * dt };
    // empurra para fora dos carros
    for (const c of g.cars) {
      const dx = c.x - p.x, dz = c.z - p.z;
      if (dx * dx + dz * dz > (c.hl + 1) ** 2) continue;
      const col = circleVsObb(p.x, p.z, RADIUS, c.obb);
      if (col) { p.x -= col.nx * col.depth; p.z -= col.nz * col.depth; }
    }
    resolveCircle(g.world, p, RADIUS);
    const L = CFG.WALL - 0.6;
    this.x = clamp(p.x, -L, L); this.z = clamp(p.z, -L, L);
    this.y = damp(this.y, groundHeight(this.x, this.z), 20, dt);

    // tiro
    this.cool -= dt;
    if (inp.fire && this.cool <= 0) this.shoot();
    this.recoil = damp(this.recoil, 0, 14, dt);
    this.sync();
  }

  // braço estendido para a frente, com coice
  poseArm() {
    if (!this.cm.armR) return;
    _armQ.setFromAxisAngle(AXIS_Y, (84 * Math.PI) / 180);
    _recQ.setFromAxisAngle(AXIS_Z, -this.recoil);
    this.cm.armR.quaternion.copy(_armQ).multiply(_recQ);
  }

  shoot() {
    const g = this.game;
    this.cool = FIRE_DELAY;
    this.recoil = 0.55;
    let dirH = this.h;
    // ajuda leve de mira: puxa para um pedestre quase à frente
    let bestA = 0.12;
    for (const p of g.peds.list) {
      if (!p.standing) continue;
      const dx = p.x - this.x, dz = p.z - this.z, d = Math.hypot(dx, dz);
      if (d > 45 || d < 0.5) continue;
      const a = Math.abs(angleDiff(this.h, Math.atan2(dx, dz)));
      if (a < bestA) { bestA = a; dirH = Math.atan2(dx, dz); }
    }
    const dx = Math.sin(dirH), dz = Math.cos(dirH);
    const m = this.muzzleWorld(_v);
    const oy = m.y;
    let best = { t: RANGE, kind: 'none' };
    const st = raycastStatic(g.world, this.x, oy, this.z, dx, 0, dz, RANGE);
    if (st) best = { t: st.t, kind: 'static', nx: st.nx, nz: st.nz, item: st.item };
    for (const c of g.cars) {
      if (c === this.car) continue;
      const ddx = c.x - this.x, ddz = c.z - this.z;
      if (ddx * ddx + ddz * ddz > (RANGE + 5) ** 2) continue;
      if (oy > c.y + c.height) continue;
      const h = rayObb(this.x, this.z, dx, dz, c.obb, best.t);
      if (h && h.t < best.t) best = { t: h.t, kind: 'car', nx: h.nx, nz: h.nz, car: c };
    }
    for (const p of g.peds.list) {
      if (!p.hittable) continue;
      const h = rayCircle(this.x, this.z, dx, dz, p.x, p.z, 0.42, best.t);
      if (h && h.t < best.t) best = { t: h.t, kind: 'ped', ped: p };
    }
    const hx = this.x + dx * best.t, hz = this.z + dz * best.t;
    g.fx.muzzle(m.x, m.y, m.z, dx, dz);
    g.fx.tracer(m.x + dx * 0.2, m.y, m.z + dz * 0.2, hx, oy, hz);
    g.audio.gunshot(this.x, this.z);
    g.cam.kick(0.06);
    g.peds.alarm(this.x, this.z, 32, this);
    if (best.kind === 'static') {
      const metal = best.item.kind === 'pole';
      if (metal) { g.fx.sparks(hx, oy, hz, best.nx, best.nz, 10); }
      else { g.fx.dust(hx, oy, hz, best.nx, best.nz, 9); g.fx.decal(hx, oy, hz, best.nx, 0, best.nz); }
      g.audio.ricochet(hx, hz, metal);
    } else if (best.kind === 'car') {
      g.fx.sparks(hx, oy, hz, best.nx, best.nz, 12);
      g.audio.ricochet(hx, hz, true);
      best.car.damage = Math.min(1, best.car.damage + 0.03);
      g.traffic.onCarShot(best.car);
    } else if (best.kind === 'ped') {
      best.ped.shot(dx, dz);
    }
  }

  // ---------- entrar e sair do carro ----------
  nearestCar() {
    const g = this.game;
    let best = null, bd = Infinity;
    for (const c of g.cars) {
      if (c.wreck) continue;
      const dx = c.x - this.x, dz = c.z - this.z, d = Math.hypot(dx, dz);
      const reach = c.hl + 1.6;
      if (d > reach) continue;
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  canEnter(c) { return c && c.speed < 4.5; }

  tryEnter() {
    const c = this.nearestCar();
    if (!this.canEnter(c)) return false;
    const g = this.game;
    // porta do motorista (lado esquerdo); se estiver bloqueada, a do passageiro
    let side = 1;
    const [lx, lz] = c.toLocal(this.x, this.z);
    if (lx < -0.2) side = -1;
    const stolenFrom = c.driver === 'ai' ? g.traffic.ejectDriver(c, side) : null;
    c.ai = null;
    c.driver = 'player';
    c.input.handbrake = true;
    c.input.throttle = 0;
    const [dx, dz] = c.toWorld(side * (c.hw + 0.55), Math.min(0.6, c.hl * 0.25));
    this.trans = { kind: 'in', t: 0, dur: stolenFrom ? 0.55 : 0.4, car: c, fromX: this.x, fromZ: this.z, doorX: dx, doorZ: dz, side };
    this.cm.play('sprint', { fade: 0.08 });
    g.audio.door(c.x, c.z, true);
    void lz;
    return true;
  }

  exitCar() {
    const g = this.game, c = this.car;
    if (!c) return;
    // procura um lado livre
    let pos = null;
    for (const side of [1, -1]) {
      const [x, z] = c.toWorld(side * (c.hw + 0.7), 0.3);
      const p = { x, z };
      resolveCircle(g.world, p, RADIUS);
      if (Math.hypot(p.x - x, p.z - z) < 0.3) { pos = p; break; }
    }
    if (!pos) { const [x, z] = c.toWorld(0, c.hl + 1.2); pos = { x, z }; resolveCircle(g.world, pos, RADIUS); }
    c.driver = null;
    c.engineOn = false;
    c.input.throttle = 0; c.input.steer = 0; c.input.handbrake = c.speed < 1;
    g.audio.stopEngine(this.engine); this.engine = null;
    g.audio.door(c.x, c.z, false);
    g.traffic.abandoned(c);
    this.car = null;
    this.x = pos.x; this.z = pos.z; this.h = c.h + Math.PI / 2;
    this.y = groundHeight(this.x, this.z);
    this.vx = c.vx * 0.3; this.vz = c.vz * 0.3;
    this.root.visible = true;
    this.cm.play('idle', { fade: 0 });
    this.sync();
    g.onModeChange();
  }

  updateTransition(dt) {
    const g = this.game, tr = this.trans;
    tr.t += dt;
    const c = tr.car;
    const [dx, dz] = c.toWorld(tr.side * (c.hw + 0.55), Math.min(0.6, c.hl * 0.25));
    const f = clamp(tr.t / tr.dur, 0, 1);
    const e = f * f * (3 - 2 * f);
    this.x = tr.fromX + (dx - tr.fromX) * e;
    this.z = tr.fromZ + (dz - tr.fromZ) * e;
    // vira para o carro
    const face = Math.atan2(c.x - this.x, c.z - this.z);
    this.h += angleDiff(this.h, face) * Math.min(1, dt * 12);
    this.y = damp(this.y, groundHeight(this.x, this.z), 20, dt);
    this.sync();
    if (f >= 1) {
      this.trans = null;
      this.car = c;
      c.engineOn = true;
      c.input.handbrake = false;
      this.root.visible = false;
      g.audio.door(c.x, c.z, false);
      g.audio.startEngineCrank();
      this.engine = g.audio.createEngine(true);
      g.onModeChange();
    }
  }
}
