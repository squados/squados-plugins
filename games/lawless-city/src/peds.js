// Pedestres: caminham pelas calçadas, atravessam nas faixas, fogem de tiros, caem e voam.
import * as THREE from 'three';
import { CHAR_KEYS } from './assets.js';
import { CharModel } from './character.js';
import { CFG, clamp, damp, angleDiff, groundHeight, rand, pick } from './config.js';
import { resolveCircle, circleVsObb } from './collision.js';
import { buildPedGraph } from './city.js';

const WALK = 1.45;
const RUN = 5.6;
const R = 0.32;
let ID = 0;

export class Ped {
  constructor(sys, key, x, z) {
    this.sys = sys;
    this.id = ++ID;
    this.cm = new CharModel(key, { scale: rand(0.94, 1.05) });
    this.root = this.cm.root;
    sys.game.scene.add(this.root);
    this.x = x; this.z = z; this.y = groundHeight(x, z); this.h = rand(0, 6.28);
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.state = 'walk';
    this.t = 0;
    this.target = -1;
    this.prev = -1;
    this.speedMul = rand(0.85, 1.15);
    this.lane = rand(-1.3, 1.3);
    this.screamT = 0;
    this.stars = null;
    this.spin = new THREE.Vector3();
    this.cm.play('walk', { fade: 0, timeScale: this.speedMul });
    this.cm.current.time = rand(0, 0.6);
  }
  get standing() { return this.state === 'walk' || this.state === 'flee' || this.state === 'wait'; }
  get hittable() { return this.state !== 'fly' && this.state !== 'down' && this.state !== 'getup'; }
  get vulnerable() { return this.state !== 'fly' && this.state !== 'down'; }

  setFlee(fromX, fromZ, time = rand(5, 8)) {
    if (!this.standing && this.state !== 'yanked') return;
    let ax = this.x - fromX, az = this.z - fromZ;
    const l = Math.hypot(ax, az) || 1;
    this.fleeDir = [ax / l, az / l];
    this.state = 'flee';
    this.t = time;
    this.cm.play('sprint', { fade: 0.1, timeScale: 1.1 });
    if (this.screamT <= 0 && Math.random() < 0.6) {
      this.sys.game.audio.scream(this.x, this.z, this.cm.female);
      this.screamT = rand(2, 4);
    }
  }

  shot(dx, dz) {
    const g = this.sys.game;
    g.audio.hitBody(this.x, this.z);
    g.fx.word(pick(['POW!', 'BAM!', 'AI!']), this.x, this.y + 2.3, this.z, 0.9);
    g.fx.confetti(this.x, this.y + 1.1, this.z, 10);
    // pequeno empurrão e queda
    this.knock(dx * 3, 1.8, dz * 3, false);
    g.audio.scream(this.x, this.z, this.cm.female);
  }

  // derruba (fly=false: tomba no lugar; fly=true: voa girando)
  knock(vx, vy, vz, fly) {
    this.vx = vx; this.vy = vy; this.vz = vz;
    this.h = Math.atan2(-vx, -vz) || this.h; // cai de costas na direção do impulso
    this.state = 'fly';
    this.flyHard = fly;
    const sp = Math.hypot(vx, vz);
    this.spin.set(fly ? rand(-1, 1) * sp * 0.9 : 0, 0, fly ? rand(-1, 1) * sp * 0.5 : 0);
    this.cm.play(fly ? 'fall' : 'die', { once: !fly, fade: 0.05 });
    this.t = 0;
    this.removeStars();
  }

  removeStars() {
    if (this.stars) { this.stars.removeFromParent(); this.stars = null; }
  }

  update(dt) {
    const g = this.sys.game;
    this.screamT -= dt;
    switch (this.state) {
      case 'walk': this.walk(dt); break;
      case 'wait': this.t -= dt; if (this.t <= 0) { this.state = 'walk'; this.cm.play('walk', { timeScale: this.speedMul }); } break;
      case 'flee': this.flee(dt); break;
      case 'yanked': {
        this.t -= dt;
        this.x += this.vx * dt; this.z += this.vz * dt;
        this.vx = damp(this.vx, 0, 4, dt); this.vz = damp(this.vz, 0, 4, dt);
        if (this.t <= 0) this.setFlee(g.player.x, g.player.z, rand(6, 9));
        break;
      }
      case 'fly': this.fly(dt); break;
      case 'down': {
        this.t -= dt;
        if (this.stars) {
          for (const s of this.stars.children) {
            s.userData.a += dt * 4;
            s.position.set(Math.cos(s.userData.a) * 0.45, Math.sin(s.userData.a * 2) * 0.06, Math.sin(s.userData.a) * 0.45);
          }
        }
        if (this.t <= 0) {
          this.removeStars();
          this.state = 'getup';
          this.t = 0.45;
          this.cm.play('die', { once: true, reverse: true, fade: 0.05, timeScale: 0.75 });
        }
        break;
      }
      case 'getup':
        this.t -= dt;
        this.cm.tumble.rotation.x = damp(this.cm.tumble.rotation.x, 0, 12, dt);
        this.cm.tumble.rotation.z = damp(this.cm.tumble.rotation.z, 0, 12, dt);
        if (this.t <= 0) {
          this.cm.tumble.rotation.set(0, 0, 0);
          this.state = 'walk';
          this.setFlee(g.player.x, g.player.z, rand(6, 9));
        }
        break;
    }
    if (this.state !== 'fly') {
      // não atravessa prédios nem o muro
      const p = { x: this.x, z: this.z };
      resolveCircle(g.world, p, R);
      const L = CFG.WALL - 0.5;
      this.x = clamp(p.x, -L, L); this.z = clamp(p.z, -L, L);
      if (this.state !== 'down' && this.state !== 'getup') this.y = damp(this.y, groundHeight(this.x, this.z), 20, dt);
    }
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.y = this.h;
    this.cm.update(dt);
  }

  pickNext() {
    const N = this.sys.graph;
    const n = N[this.target];
    let opts = n.links.filter((k) => k !== this.prev);
    if (!opts.length) opts = n.links;
    // atravessa a rua só às vezes
    const walkOpts = opts.filter((k) => !n.cross.includes(k));
    if (walkOpts.length && Math.random() < 0.7) opts = walkOpts;
    this.prev = this.target;
    this.target = pick(opts);
    // posição lateral própria na calçada
    this.lane = rand(-1.3, 1.3);
  }

  walk(dt) {
    const N = this.sys.graph;
    if (this.target < 0) { this.target = this.sys.nearestNode(this.x, this.z); this.lane = rand(-1.3, 1.3); }
    const n = N[this.target];
    // alvo deslocado lateralmente (cada um anda numa "faixa" da calçada)
    // desloca o alvo para dentro da calçada conforme a "faixa" pessoal (sem invadir a rua)
    const prevN = this.prev >= 0 ? N[this.prev] : null;
    let tx = n.x, tz = n.z;
    if (prevN && !prevN.cross.includes(this.target)) {
      const ax = n.x - prevN.x, az = n.z - prevN.z, al = Math.hypot(ax, az) || 1;
      tx += (-az / al) * this.lane; tz += (ax / al) * this.lane;
    }
    let dx = tx - this.x, dz = tz - this.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.0) {
      // atravessando: espera de vez em quando antes de seguir
      this.pickNext();
      if (N[this.target] && n.cross.includes(this.target) && this.sys.roadBusy(n.x, n.z, N[this.target].x, N[this.target].z)) {
        this.state = 'wait'; this.t = rand(1, 2.5); this.cm.play('idle');
      }
      return;
    }
    dx /= d; dz /= d;
    const sp = WALK * this.speedMul;
    const target = Math.atan2(dx, dz);
    this.h += clamp(angleDiff(this.h, target), -6 * dt, 6 * dt);
    this.x += Math.sin(this.h) * sp * dt;
    this.z += Math.cos(this.h) * sp * dt;
    this.cm.play('walk', { timeScale: this.speedMul * 1.05 });
    // evita carros parados à frente (na travessia)
    this.avoidCars(dt);
  }

  avoidCars() {
    for (const c of this.sys.game.cars) {
      const dx = c.x - this.x, dz = c.z - this.z;
      if (dx * dx + dz * dz > (c.hl + 1.2) ** 2) continue;
      const col = circleVsObb(this.x, this.z, R, c.obb);
      if (col) { this.x -= col.nx * col.depth; this.z -= col.nz * col.depth; }
    }
  }

  flee(dt) {
    this.t -= dt;
    const g = this.sys.game;
    // foge para longe do perigo, desviando de obstáculos
    let [fx, fz] = this.fleeDir;
    // se estiver perto de um prédio, desliza ao longo dele
    const probe = { x: this.x + fx * 1.2, z: this.z + fz * 1.2 };
    const hit = resolveCircle(g.world, probe, R);
    if (hit) {
      const tx = -hit.nz, tz = hit.nx;
      const s = tx * fx + tz * fz >= 0 ? 1 : -1;
      fx = fx * 0.3 + tx * s; fz = fz * 0.3 + tz * s;
      const l = Math.hypot(fx, fz) || 1;
      fx /= l; fz /= l;
      this.fleeDir = [fx * 0.5 + this.fleeDir[0] * 0.5, fz * 0.5 + this.fleeDir[1] * 0.5];
    }
    const target = Math.atan2(fx, fz);
    this.h += clamp(angleDiff(this.h, target), -10 * dt, 10 * dt);
    const sp = RUN * this.speedMul;
    this.x += Math.sin(this.h) * sp * dt;
    this.z += Math.cos(this.h) * sp * dt;
    this.avoidCars(dt);
    if (this.t <= 0) {
      this.state = 'walk';
      this.target = this.sys.nearestNode(this.x, this.z);
      this.prev = -1;
      this.cm.play('walk', { timeScale: this.speedMul });
    }
  }

  fly(dt) {
    const g = this.sys.game;
    this.t += dt;
    this.vy -= 22 * dt;
    this.x += this.vx * dt; this.z += this.vz * dt; this.y += this.vy * dt;
    // bate em prédios
    const p = { x: this.x, z: this.z };
    const hit = resolveCircle(g.world, p, R);
    if (hit) {
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) { this.vx -= 1.6 * vn * hit.nx; this.vz -= 1.6 * vn * hit.nz; if (-vn > 4) { g.audio.thud(this.x, this.z); g.fx.dust(this.x, this.y + 0.5, this.z, hit.nx, hit.nz, 6); } }
    }
    this.x = p.x; this.z = p.z;
    const tb = this.cm.tumble;
    tb.rotation.x += this.spin.x * dt;
    tb.rotation.z += this.spin.z * dt;
    const gh = groundHeight(this.x, this.z);
    if (this.y <= gh) {
      this.y = gh;
      const sp = Math.hypot(this.vx, this.vz);
      if (this.vy < -4 && this.flyHard) {
        // quica
        this.vy = -this.vy * 0.35;
        this.vx *= 0.6; this.vz *= 0.6;
        this.spin.multiplyScalar(0.5);
        g.audio.thud(this.x, this.z);
        g.fx.dust(this.x, this.y + 0.2, this.z, 0, 0, 8);
        return;
      }
      this.vy = 0;
      this.vx = damp(this.vx, 0, 6, dt); this.vz = damp(this.vz, 0, 6, dt);
      if (sp < 1.2 && this.t > 0.25) {
        // deitado
        this.state = 'down';
        this.t = rand(4, 6.5);
        tb.rotation.set(0, 0, 0);
        this.vx = this.vz = 0;
        if (this.cm.currentName !== 'die') this.cm.play('die', { once: true, fade: 0.08 });
        this.stars = g.fx.dizzy(this.root, 0.75);
      }
    }
  }

  dispose() {
    this.removeStars();
    this.cm.dispose();
  }
}

export class PedSystem {
  constructor(game, count) {
    this.game = game;
    this.graph = buildPedGraph();
    this.list = [];
    this.count = count;
    this.checkI = 0;
    this.keys = CHAR_KEYS;
  }
  nearestNode(x, z) {
    let best = 0, bd = Infinity;
    for (let i = 0; i < this.graph.length; i++) {
      const n = this.graph[i], d = (n.x - x) ** 2 + (n.z - z) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  // ponto aleatório numa calçada, longe de prédios
  randomSidewalkPoint(nearX, nearZ, minD, maxD) {
    for (let k = 0; k < 40; k++) {
      const a = this.graph[Math.floor(Math.random() * this.graph.length)];
      const b = this.graph[pick(a.links.filter((l) => !a.cross.includes(l))) ?? a.links[0]];
      const t = Math.random();
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      const d = Math.hypot(x - nearX, z - nearZ);
      if (d >= minD && d <= maxD) return { x, z };
    }
    return null;
  }
  spawnAll(px, pz) {
    for (let i = 0; i < this.count; i++) {
      const p = this.randomSidewalkPoint(px, pz, 4, i < this.count * 0.6 ? 70 : 200) || { x: px + 15, z: pz + 15 };
      this.spawn(this.keys[i % this.keys.length], p.x, p.z);
    }
  }
  spawn(key, x, z) {
    const p = new Ped(this, key, x, z);
    p.target = this.nearestNode(x, z);
    this.list.push(p);
    return p;
  }
  // motorista arrancado do carro
  spawnDriver(key, x, z, awayX, awayZ) {
    const p = new Ped(this, key, x, z);
    p.state = 'yanked';
    p.t = 0.45;
    p.vx = awayX * 4; p.vz = awayZ * 4;
    p.h = Math.atan2(awayX, awayZ);
    p.cm.play('fall', { fade: 0 });
    this.list.push(p);
    this.game.audio.scream(x, z, p.cm.female);
    return p;
  }
  // há carro passando perto da travessia?
  roadBusy(ax, az, bx, bz) {
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    for (const c of this.game.cars) {
      if (c.speed < 2) continue;
      const dx = c.x - mx, dz = c.z - mz;
      if (dx * dx + dz * dz < 18 * 18) return true;
    }
    return false;
  }
  // tiro por perto: todos num raio fogem
  alarm(x, z, radius) {
    for (const p of this.list) {
      const d = Math.hypot(p.x - x, p.z - z);
      if (d < radius && p.standing) p.setFlee(x, z);
    }
  }
  update(dt, cam) {
    for (const p of this.list) p.update(dt);
    // mantém a cidade cheia: recicla pedestres muito longe ou caídos fora de vista
    const g = this.game;
    const n = this.list.length;
    if (!n) return;
    for (let k = 0; k < 2; k++) {
      this.checkI = (this.checkI + 1) % n;
      const p = this.list[this.checkI];
      const d = Math.hypot(p.x - g.player.x, p.z - g.player.z);
      const far = d > 115;
      const extra = this.list.length > this.count;
      if ((far || (extra && d > 50 && !this.visible(p, cam))) && p.state !== 'fly') {
        if (extra) { p.dispose(); this.list.splice(this.checkI, 1); return; }
        const q = this.randomSidewalkPoint(g.player.x, g.player.z, 45, 95);
        if (q && !this.visibleXZ(q.x, q.z, cam)) {
          p.removeStars();
          p.cm.tumble.rotation.set(0, 0, 0);
          p.x = q.x; p.z = q.z; p.y = groundHeight(q.x, q.z);
          p.state = 'walk'; p.target = this.nearestNode(q.x, q.z); p.prev = -1;
          p.cm.play('walk', { fade: 0, timeScale: p.speedMul });
        }
      }
    }
  }
  visible(p, cam) { return this.visibleXZ(p.x, p.z, cam); }
  visibleXZ(x, z, cam) {
    _v.set(x, 1, z).project(cam);
    return _v.z < 1 && Math.abs(_v.x) < 1.1 && Math.abs(_v.y) < 1.1;
  }
}
const _v = new THREE.Vector3();
