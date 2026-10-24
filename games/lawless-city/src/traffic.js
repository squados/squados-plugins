// Tráfego: carros com motorista seguem as faixas, fazem curvas nos cruzamentos,
// respeitam quem já está no cruzamento e param diante de obstáculos.
import * as THREE from 'three';
import { CHAR_KEYS, TRAFFIC_WEIGHTS } from './assets.js';
import { Car } from './vehicle.js';
import { CFG, NODES, nodeCoord, DIRS, clamp, angleDiff, rand, pick, pickWeighted } from './config.js';
import { parkingSpots } from './city.js';
import { circleVsObb } from './collision.js';

const STEP = 1.0; // espaçamento dos pontos da rota (m)
const _v = new THREE.Vector3();

const inGrid = (i, j) => i >= 0 && j >= 0 && i < NODES && j < NODES;
const rightOf = (d) => { const [fx, fz] = DIRS[d]; return [-fz, fx]; };

// ponto na faixa da direita, a "along" metros do nó (i,j) na direção d
function lanePoint(i, j, d, along) {
  const [fx, fz] = DIRS[d], [rx, rz] = rightOf(d);
  return [nodeCoord(i) + fx * along + rx * CFG.LANE, nodeCoord(j) + fz * along + rz * CFG.LANE];
}

function pushLine(pts, ax, az, bx, bz, flags) {
  const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / STEP));
  for (let k = 1; k <= n; k++) { const t = k / n; pts.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, ...flags }); }
}
function pushQuad(pts, ax, az, cx, cz, bx, bz, flags) {
  const L = Math.hypot(cx - ax, cz - az) + Math.hypot(bx - cx, bz - cz), n = Math.max(2, Math.round(L / STEP));
  for (let k = 1; k <= n; k++) {
    const t = k / n, u = 1 - t;
    pts.push({ x: u * u * ax + 2 * u * t * cx + t * t * bx, z: u * u * az + 2 * u * t * cz + t * t * bz, ...flags });
  }
}

export class Traffic {
  constructor(game, { moving = 18, parked = 26 } = {}) {
    this.game = game;
    this.moving = moving;
    this.parked = parked;
    this.spots = parkingSpots();
    this.engineT = 0;
  }

  makeCar(key, x, z, h) {
    const c = new Car(this.game, key, x, z, h);
    this.game.scene.add(c.root);
    this.game.cars.push(c);
    return c;
  }

  freeAt(x, z, r = 7) {
    for (const c of this.game.cars) if ((c.x - x) ** 2 + (c.z - z) ** 2 < r * r) return false;
    const p = this.game.player;
    if (p && (p.x - x) ** 2 + (p.z - z) ** 2 < r * r) return false;
    return true;
  }

  spawnInitial(px, pz) {
    // estacionados: alguns bem perto do jogador para o primeiro roubo
    const spots = [...this.spots].sort((a, b) => Math.hypot(a.x - px, a.z - pz) - Math.hypot(b.x - px, b.z - pz));
    let n = 0;
    for (let k = 0; k < spots.length && n < this.parked; k++) {
      const s = spots[k];
      const near = Math.hypot(s.x - px, s.z - pz) < 30;
      if (!near && Math.random() < 0.7) continue;
      if (!this.freeAt(s.x, s.z, 5.5)) continue;
      const key = pickWeighted(TRAFFIC_WEIGHTS);
      const c = this.makeCar(key, s.x, s.z, s.h);
      c.input.handbrake = true;
      n++;
    }
    for (let k = 0; k < this.moving; k++) this.spawnMoving(px, pz, k < this.moving / 2 ? 15 : 40, k < this.moving / 2 ? 80 : 200, false);
  }

  // cria um carro com motorista numa faixa aleatória
  spawnMoving(px, pz, minD, maxD, hidden = true) {
    for (let tries = 0; tries < 30; tries++) {
      const d = Math.floor(Math.random() * 4);
      const i = Math.floor(Math.random() * NODES), j = Math.floor(Math.random() * NODES);
      const [fx, fz] = DIRS[d];
      const ai = i - fx, aj = j - fz; // nó anterior
      if (!inGrid(ai, aj)) continue;
      const along = rand(CFG.INTER + 4, CFG.PITCH - CFG.INTER - 8);
      const [x, z] = lanePoint(ai, aj, d, along);
      const dist = Math.hypot(x - px, z - pz);
      if (dist < minD || dist > maxD) continue;
      if (!this.freeAt(x, z, 9)) continue;
      if (hidden && this.game.peds.visibleXZ(x, z, this.game.camera)) continue;
      const key = pickWeighted(TRAFFIC_WEIGHTS);
      const c = this.makeCar(key, x, z, Math.atan2(fx, fz));
      this.setupAI(c, ai, aj, d, along);
      const v = c.ai.cruise * 0.7;
      c.vx = fx * v; c.vz = fz * v;
      return c;
    }
    return null;
  }

  setupAI(c, i, j, d, along) {
    c.driver = 'ai';
    c.driverKey = pick(CHAR_KEYS);
    c.engineOn = true;
    c.input.handbrake = false;
    const [fx, fz] = DIRS[d];
    const ai = { pts: [], idx: 0, ni: i + fx, nj: j + fz, d, cruise: rand(9.5, 12.5), wait: 0, stuck: 0, reverse: 0, panic: 0, hornT: rand(2, 5), yieldT: 0 };
    c.ai = ai;
    const [sx, sz] = lanePoint(i, j, d, along);
    const [ex, ez] = lanePoint(i, j, d, CFG.PITCH - CFG.INTER);
    ai.pts.push({ x: sx, z: sz, node: -1 });
    pushLine(ai.pts, sx, sz, ex, ez, { node: -1 });
    this.appendLeg(ai);
    this.appendLeg(ai);
  }

  // retoma a rota a partir de onde o carro está (após batida ou abandono)
  replan(c) {
    // eixo e sentido mais próximos da direção do carro
    const fx = Math.sin(c.h), fz = Math.cos(c.h);
    let d = 0, best = -2;
    for (let k = 0; k < 4; k++) { const dot = DIRS[k][0] * fx + DIRS[k][1] * fz; if (dot > best) { best = dot; d = k; } }
    const alongX = d === 0 || d === 2;
    const lineCoord = alongX ? c.z : c.x;
    const li = clamp(Math.round((lineCoord - CFG.ORIGIN) / CFG.PITCH), 0, NODES - 1);
    const pos = alongX ? c.x : c.z;
    const [dfx, dfz] = DIRS[d];
    const s = alongX ? dfx : dfz;
    // nó anterior ao longo do sentido
    let k = s > 0 ? Math.floor((pos - CFG.ORIGIN) / CFG.PITCH) : Math.ceil((pos - CFG.ORIGIN) / CFG.PITCH);
    k = clamp(k, 0, NODES - 1);
    let i = alongX ? k : li, j = alongX ? li : k;
    if (!inGrid(i + dfx, j + dfz)) { d = (d + 2) % 4; i += 0; }
    const [gx, gz] = DIRS[d];
    if (!inGrid(i + gx, j + gz)) { i -= gx; j -= gz; }
    if (!inGrid(i, j) || !inGrid(i + gx, j + gz)) return false;
    const along = clamp((alongX ? c.x - nodeCoord(i) : c.z - nodeCoord(j)) * (alongX ? gx : gz), CFG.INTER, CFG.PITCH - CFG.INTER - 2);
    this.setupAI(c, i, j, d, along + 3);
    return true;
  }

  appendLeg(ai) {
    const { ni, nj, d } = ai;
    const back = (d + 2) % 4;
    let opts = [0, 1, 2, 3].filter((k) => k !== back && inGrid(ni + DIRS[k][0], nj + DIRS[k][1]));
    if (!opts.length) opts = [back];
    // prefere seguir reto
    let d2 = opts.includes(d) && Math.random() < 0.5 ? d : pick(opts);
    const node = ni * 100 + nj;
    const [ax, az] = lanePoint(ni, nj, back, CFG.INTER); // ponto de chegada: do lado de quem vem
    // lanePoint com sentido "back" fica na faixa errada; recalcula a partir do nó
    const [fx, fz] = DIRS[d], [rx, rz] = rightOf(d);
    const bx0 = nodeCoord(ni), bz0 = nodeCoord(nj);
    const inX = bx0 - fx * CFG.INTER + rx * CFG.LANE, inZ = bz0 - fz * CFG.INTER + rz * CFG.LANE;
    const [f2x, f2z] = DIRS[d2], [r2x, r2z] = rightOf(d2);
    const outX = bx0 + f2x * CFG.INTER + r2x * CFG.LANE, outZ = bz0 + f2z * CFG.INTER + r2z * CFG.LANE;
    const turn = d2 !== d;
    void ax; void az;
    if (d2 === back) {
      // retorno (só em beco sem saída, que não existe na grade)
      pushQuad(ai.pts, inX, inZ, bx0 + fx * 4, bz0 + fz * 4, outX, outZ, { node, inter: true, turn: true });
    } else if (turn) {
      const cx = bx0 + rx * CFG.LANE + r2x * CFG.LANE, cz = bz0 + rz * CFG.LANE + r2z * CFG.LANE;
      pushQuad(ai.pts, inX, inZ, cx, cz, outX, outZ, { node, inter: true, turn: true });
    } else pushLine(ai.pts, inX, inZ, outX, outZ, { node, inter: true });
    const ni2 = ni + f2x, nj2 = nj + f2z;
    const endX = nodeCoord(ni2) - f2x * CFG.INTER + r2x * CFG.LANE, endZ = nodeCoord(nj2) - f2z * CFG.INTER + r2z * CFG.LANE;
    pushLine(ai.pts, outX, outZ, endX, endZ, { node: -1 });
    ai.ni = ni2; ai.nj = nj2; ai.d = d2;
  }

  ejectDriver(c, side) {
    const g = this.game;
    if (c.driver !== 'ai') return null;
    const [x, z] = c.toWorld(c.hw + 0.7, 0.4);
    const [lx, lz] = c.left();
    const p = g.peds.spawnDriver(c.driverKey, x, z, lx, lz);
    g.fx.word('VUPT!', x, 2.6, z, 0.8);
    g.audio.whoosh(x, z);
    if (c.aiEngine) { g.audio.stopEngine(c.aiEngine); c.aiEngine = null; }
    c.driver = null;
    c.ai = null;
    void side;
    return p;
  }

  abandoned(c) {
    c.ai = null;
    c.engineOn = false;
  }

  onCarShot(c) {
    if (c.driver === 'ai' && c.ai) {
      c.ai.panic = rand(5, 8);
      this.game.audio.horn(c.x, c.z);
    }
  }

  // obstáculo mais próximo ao longo da rota (distância em metros) ou Infinity
  obstacleAhead(c, look) {
    const g = this.game, ai = c.ai;
    const pts = ai.pts;
    const n = Math.min(pts.length - ai.idx, Math.ceil(look / STEP));
    const cand = [];
    const R2 = (look + 8) ** 2;
    for (const o of g.cars) {
      if (o === c) continue;
      if ((o.x - c.x) ** 2 + (o.z - c.z) ** 2 < R2) cand.push(o);
    }
    const bodies = [];
    for (const p of g.peds.list) if (p.state !== 'fly' && (p.x - c.x) ** 2 + (p.z - c.z) ** 2 < R2) bodies.push(p);
    const pl = g.player;
    if (pl.onFoot && (pl.x - c.x) ** 2 + (pl.z - c.z) ** 2 < R2) bodies.push(pl);
    if (!cand.length && !bodies.length) return Infinity;
    // começa na frente do carro
    let start = ai.idx;
    const [fx, fz] = c.forward();
    for (let k = ai.idx; k < ai.idx + 8 && k < pts.length; k++) {
      const p = pts[k];
      if ((p.x - c.x) * fx + (p.z - c.z) * fz > c.hl * 0.6) { start = k; break; }
    }
    const wide = c.hw + 0.35;
    for (let k = start; k < ai.idx + n; k++) {
      const p = pts[k];
      const dist = Math.max(0, (k - start) * STEP);
      for (const o of cand) {
        if (circleVsObb(p.x, p.z, wide, o.obb)) {
          // ignora carros vindo de frente na mesma faixa só se já passaram
          return dist;
        }
      }
      for (const b of bodies) if ((b.x - p.x) ** 2 + (b.z - p.z) ** 2 < (wide + 0.35) ** 2) return dist;
    }
    return Infinity;
  }

  // cruzamento ocupado por outro carro que cruza a minha frente?
  interBusy(c, node) {
    const bx = nodeCoord(Math.floor(node / 100)), bz = nodeCoord(node % 100);
    const R = CFG.INTER + 1;
    for (const o of this.game.cars) {
      if (o === c) continue;
      if (Math.abs(o.x - bx) > R || Math.abs(o.z - bz) > R) continue;
      if (o.speed < 0.5 && !o.ai) continue; // carro largado: tratado como obstáculo
      const dh = Math.abs(angleDiff(c.h, o.h));
      if (dh < 0.5) continue; // mesmo sentido: só segue
      return true;
    }
    return false;
  }

  drive(c, dt) {
    const ai = c.ai;
    const pts = ai.pts;
    // avança o índice para o ponto mais próximo à frente
    let best = ai.idx, bd = Infinity;
    for (let k = ai.idx; k < Math.min(pts.length, ai.idx + 12); k++) {
      const d = (pts[k].x - c.x) ** 2 + (pts[k].z - c.z) ** 2;
      if (d < bd) { bd = d; best = k; }
    }
    ai.idx = best;
    // longe demais da rota (foi empurrado): recalcula
    if (bd > 36) { if (!this.replan(c)) { c.ai = null; c.driver = null; } return; }
    if (pts.length - ai.idx < 40) this.appendLeg(ai);
    if (ai.idx > 60) { pts.splice(0, ai.idx - 5); ai.idx = 5; }

    const v = c.vF;
    // perseguição pura
    const L = clamp(3.2 + Math.abs(v) * 0.45, 3.5, 9);
    const ti = Math.min(pts.length - 1, ai.idx + Math.round(L / STEP));
    const tp = pts[ti];
    const [lx, lz] = c.toLocal(tp.x, tp.z);
    const dist2 = lx * lx + lz * lz;
    const delta = Math.atan((2 * c.wheelBase * lx) / Math.max(dist2, 1));
    const steerMax = 0.62 - 0.4 * clamp(Math.abs(v) / 32, 0, 1);

    // velocidade desejada
    let target = ai.cruise;
    for (let k = ai.idx; k < Math.min(pts.length, ai.idx + 14); k++) if (pts[k].turn) { target = 6.5; break; }
    if (ai.panic > 0) { ai.panic -= dt; target = 19; }
    // cruzamento à frente
    let interNode = -1, interDist = 0;
    if (!pts[ai.idx].inter) {
      for (let k = ai.idx; k < Math.min(pts.length, ai.idx + 9); k++) if (pts[k].inter) { interNode = pts[k].node; interDist = (k - ai.idx) * STEP; break; }
    }
    if (interNode >= 0 && ai.panic <= 0 && this.interBusy(c, interNode)) {
      ai.yieldT += dt;
      if (ai.yieldT < 4) target = Math.min(target, Math.sqrt(Math.max(0, 2 * 6 * (interDist - 1.5))));
    } else ai.yieldT = 0;
    // obstáculo
    const look = 6 + v * v / (2 * 6) + 4;
    const ob = this.obstacleAhead(c, look);
    if (ob < Infinity) {
      const free = ob - 1.8;
      target = Math.min(target, free <= 0 ? 0 : Math.sqrt(2 * 7 * free));
      if (free < 3 && v < 1) {
        ai.hornT -= dt;
        if (ai.hornT <= 0) { this.game.audio.horn(c.x, c.z); ai.hornT = rand(2.5, 6); }
      }
    }

    // ré quando preso contra algo
    if (ai.reverse > 0) {
      ai.reverse -= dt;
      c.input.throttle = -0.8;
      c.input.steer = clamp(delta / steerMax, -1, 1); // ré com volante invertido
      c.input.handbrake = false;
      return;
    }
    const err = target - v;
    let thr = clamp(err * 0.6, -1, 1);
    if (target < 0.3 && v < 0.6) { thr = 0; c.input.handbrake = true; } else c.input.handbrake = false;
    c.input.throttle = thr;
    c.input.steer = clamp(-delta / steerMax, -1, 1);
    // preso: acelera e não sai do lugar sem obstáculo à frente
    if (thr > 0.3 && Math.abs(v) < 0.5 && ob === Infinity) {
      ai.stuck += dt;
      if (ai.stuck > 1.2) { ai.reverse = 1.3; ai.stuck = 0; }
    } else ai.stuck = 0;
  }

  update(dt) {
    const g = this.game;
    for (const c of g.cars) if (c.ai) this.drive(c, dt);
    // reposição: carros com motorista longe do jogador renascem perto
    this.recycleT = (this.recycleT || 0) - dt;
    if (this.recycleT <= 0) {
      this.recycleT = 0.5;
      const px = g.player.x, pz = g.player.z;
      let moving = 0;
      for (let i = g.cars.length - 1; i >= 0; i--) {
        const c = g.cars[i];
        const d = Math.hypot(c.x - px, c.z - pz);
        const vis = g.peds.visibleXZ(c.x, c.z, g.camera);
        if (c.ai) {
          moving++;
          if (d > 125 && !vis) { this.removeCar(i); moving--; }
        } else if (c.driver === null && c !== g.player.car && d > 140 && !vis && g.cars.length > this.parked + this.moving + 6) {
          this.removeCar(i);
        }
      }
      if (moving < this.moving) this.spawnMoving(px, pz, 50, 115, true);
    }
    // sons de motor para os carros com motorista mais próximos
    this.engineT -= dt;
    if (this.engineT <= 0) {
      this.engineT = 0.3;
      const near = g.cars.filter((c) => c.ai).sort((a, b) => Math.hypot(a.x - g.player.x, a.z - g.player.z) - Math.hypot(b.x - g.player.x, b.z - g.player.z)).slice(0, 4);
      for (const c of g.cars) {
        const want = near.includes(c) && Math.hypot(c.x - g.player.x, c.z - g.player.z) < 45;
        if (want && !c.aiEngine) c.aiEngine = g.audio.createEngine(false);
        if (!want && c.aiEngine) { g.audio.stopEngine(c.aiEngine); c.aiEngine = null; }
      }
    }
    for (const c of g.cars) if (c.aiEngine) g.audio.updateEngine(c.aiEngine, { rpm: c.rpm, throttle: Math.max(0, c.input.throttle), x: c.x, z: c.z });
  }

  removeCar(i) {
    const g = this.game, c = g.cars[i];
    if (c.aiEngine) { g.audio.stopEngine(c.aiEngine); c.aiEngine = null; }
    c.root.removeFromParent();
    g.cars.splice(i, 1);
  }
}
void _v;
