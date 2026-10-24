// Monta a cidade: chão, marcações, quarteirões, prédios, postes, árvores, muro e colisores.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Assets, BUILDING_SMALL, BUILDING_TALL, BACKDROP } from './assets.js';
import { CFG, NODES, nodeCoord, mulberry32, DIRS } from './config.js';

const BLD_SCALE = 15;

function canvasTex(size, draw, repeatMeters) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.userData.meters = repeatMeters;
  return t;
}

function noise(g, s, n, colors, rmin, rmax, rnd) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[Math.floor(rnd() * colors.length)];
    const r = rmin + rnd() * (rmax - rmin);
    g.fillRect(rnd() * s, rnd() * s, r, r);
  }
}

function makeTextures() {
  const rnd = mulberry32(7);
  const asphalt = canvasTex(512, (g, s) => {
    g.fillStyle = '#4a4d55'; g.fillRect(0, 0, s, s);
    noise(g, s, 9000, ['#43464e', '#52555d', '#3e4148', '#575a62'], 1, 3, rnd);
    g.globalAlpha = 0.07;
    for (let i = 0; i < 14; i++) { g.fillStyle = rnd() > 0.5 ? '#2c2e33' : '#6a6d75'; g.beginPath(); g.ellipse(rnd() * s, rnd() * s, 20 + rnd() * 60, 10 + rnd() * 40, rnd() * 3, 0, 7); g.fill(); }
    g.globalAlpha = 1;
  }, 10);
  const sidewalk = canvasTex(256, (g, s) => {
    g.fillStyle = '#b9b6ae'; g.fillRect(0, 0, s, s);
    noise(g, s, 2500, ['#b1aea6', '#c2bfb7', '#aca9a1'], 1, 2, rnd);
    g.strokeStyle = '#9a978f'; g.lineWidth = 2;
    for (let i = 0; i <= 4; i++) { const p = (i * s) / 4; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, s); g.stroke(); g.beginPath(); g.moveTo(0, p); g.lineTo(s, p); g.stroke(); }
  }, 4);
  const plaza = canvasTex(256, (g, s) => {
    g.fillStyle = '#a7a298'; g.fillRect(0, 0, s, s);
    noise(g, s, 2500, ['#9f9a90', '#b0aba1', '#99948a'], 1, 2, rnd);
    g.strokeStyle = '#8c877d'; g.lineWidth = 2;
    for (let i = 0; i <= 8; i++) { const p = (i * s) / 8; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, s); g.stroke(); }
    for (let i = 0; i <= 4; i++) { const p = (i * s) / 4; g.beginPath(); g.moveTo(0, p); g.lineTo(s, p); g.stroke(); }
  }, 6);
  const grass = canvasTex(256, (g, s) => {
    g.fillStyle = '#6f9a4a'; g.fillRect(0, 0, s, s);
    noise(g, s, 5000, ['#668f43', '#79a553', '#5f873d', '#82ad5a'], 1, 3, rnd);
  }, 6);
  const wall = canvasTex(256, (g, s) => {
    g.fillStyle = '#d9d4c7'; g.fillRect(0, 0, s, s);
    noise(g, s, 2000, ['#cfcabd', '#e0dbcf'], 1, 2, rnd);
    for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#d9d4c7' : '#e8b33a'; }
    g.fillStyle = '#c8a03a'; g.fillRect(0, s * 0.72, s, s * 0.12);
    g.fillStyle = '#2b2b2b';
    for (let i = 0; i < 4; i++) { g.save(); g.translate(i * s / 4, s * 0.72); g.beginPath(); g.moveTo(0, 0); g.lineTo(s / 8, 0); g.lineTo(s / 8 + s * 0.12, s * 0.12); g.lineTo(s * 0.12, s * 0.12); g.fill(); g.restore(); }
    g.strokeStyle = '#b5b0a3'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 2); g.lineTo(s, 2); g.stroke();
  }, 4);
  return { asphalt, sidewalk, plaza, grass, wall };
}

// Retângulo horizontal com UV em metros
function quadXZ(minX, minZ, maxX, maxZ, y, uvScale) {
  const g = new THREE.BufferGeometry();
  const p = [minX, y, minZ, minX, y, maxZ, maxX, y, maxZ, maxX, y, minZ];
  const uv = [minX, -minZ, minX, -maxZ, maxX, -maxZ, maxX, -minZ].map((v) => v / uvScale);
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  return g;
}

// Lajes da calçada: topo + laterais (meio-fio)
function slab(minX, minZ, maxX, maxZ, h, uvScale) {
  const top = quadXZ(minX, minZ, maxX, maxZ, h, uvScale);
  const sides = [];
  const mk = (x1, z1, x2, z2, nx, nz) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([x1, 0, z1, x2, 0, z2, x2, h, z2, x1, h, z1], 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute([nx, 0, nz, nx, 0, nz, nx, 0, nz, nx, 0, nz], 3));
    const L = Math.hypot(x2 - x1, z2 - z1) / uvScale;
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, L, 0, L, 0.06, 0, 0.06], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    sides.push(g);
  };
  mk(minX, maxZ, maxX, maxZ, 0, 1);
  mk(maxX, minZ, minX, minZ, 0, -1);
  mk(maxX, maxZ, maxX, minZ, 1, 0);
  mk(minX, minZ, minX, maxZ, -1, 0);
  return [top, ...sides];
}

function bake(entries, castShadow, receiveShadow) {
  // entries: {obj, kit}; junta todas as malhas por kit/material num único Mesh
  const groups = new Map();
  for (const { obj, kit } of entries) {
    obj.updateMatrixWorld(true);
    obj.traverse((m) => {
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      if (mats.length > 1) return;
      const key = kit + '|' + mats[0].name;
      let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      for (const a of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(a)) g.deleteAttribute(a);
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      g.applyMatrix4(m.matrixWorld);
      let e = groups.get(key);
      if (!e) groups.set(key, (e = { mat: mats[0], geos: [] }));
      e.geos.push(g);
    });
  }
  const out = new THREE.Group();
  for (const { mat, geos } of groups.values()) {
    const mesh = new THREE.Mesh(mergeGeometries(geos, false), mat);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    mesh.matrixAutoUpdate = false;
    out.add(mesh);
    geos.forEach((g) => g.dispose());
  }
  return out;
}

export function buildCity(scene, world) {
  const rnd = mulberry32(1337);
  const T = makeTextures();
  const H = CFG.CURB_H;
  const lo = CFG.ORIGIN - CFG.ROAD_HALF; // -127.5
  const hi = -lo;
  const W = CFG.WALL;

  // ----- Chão -----
  const asphaltMat = new THREE.MeshStandardMaterial({ map: T.asphalt, roughness: 0.95 });
  const road = new THREE.Mesh(quadXZ(lo - 1, lo - 1, hi + 1, hi + 1, 0, T.asphalt.userData.meters), asphaltMat);
  road.receiveShadow = true;
  scene.add(road);

  const walkGeos = [];
  const plazaGeos = [];
  for (let i = 0; i < CFG.NB; i++)
    for (let j = 0; j < CFG.NB; j++) {
      const x0 = nodeCoord(i) + CFG.ROAD_HALF, x1 = nodeCoord(i + 1) - CFG.ROAD_HALF;
      const z0 = nodeCoord(j) + CFG.ROAD_HALF, z1 = nodeCoord(j + 1) - CFG.ROAD_HALF;
      walkGeos.push(...slab(x0, z0, x1, z1, H, T.sidewalk.userData.meters));
      plazaGeos.push(quadXZ(x0 + 5, z0 + 5, x1 - 5, z1 - 5, H + 0.005, T.plaza.userData.meters));
    }
  // calçada externa
  walkGeos.push(...slab(lo - 5, hi, hi + 5, W + 1, H, 4));
  walkGeos.push(...slab(lo - 5, -W - 1, hi + 5, lo, H, 4));
  walkGeos.push(...slab(hi, lo, W + 1, hi, H, 4));
  walkGeos.push(...slab(-W - 1, lo, lo, hi, H, 4));
  const sidewalkMat = new THREE.MeshStandardMaterial({ map: T.sidewalk, roughness: 0.9 });
  const walk = new THREE.Mesh(mergeGeometries(walkGeos.map((g) => g.toNonIndexed())), sidewalkMat);
  walk.receiveShadow = true;
  scene.add(walk);
  const plazaMat = new THREE.MeshStandardMaterial({ map: T.plaza, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const plaza = new THREE.Mesh(mergeGeometries(plazaGeos.map((g) => g.toNonIndexed())), plazaMat);
  plaza.receiveShadow = true;
  scene.add(plaza);

  // grama fora do muro
  const grass = new THREE.Mesh(
    mergeGeometries([
      quadXZ(-420, W + 1, 420, 420, H, 6), quadXZ(-420, -420, 420, -W - 1, H, 6),
      quadXZ(W + 1, -W - 1, 420, W + 1, H, 6), quadXZ(-420, -W - 1, -W - 1, W + 1, H, 6),
    ].map((g) => g.toNonIndexed())),
    new THREE.MeshStandardMaterial({ map: T.grass, roughness: 1 })
  );
  grass.receiveShadow = true;
  scene.add(grass);

  // ----- Marcações -----
  const white = [], yellow = [];
  const Y = 0.012;
  const addRect = (arr, cx, cz, alongX, len, wid) => {
    const hx = alongX ? len / 2 : wid / 2, hz = alongX ? wid / 2 : len / 2;
    arr.push(quadXZ(cx - hx, cz - hz, cx + hx, cz + hz, Y, 1));
  };
  const EDGE = 4.6;
  for (let a = 0; a < NODES; a++) {
    const c = nodeCoord(a);
    for (let b = 0; b < CFG.NB; b++) {
      const s0 = nodeCoord(b) + CFG.INTER, s1 = nodeCoord(b + 1) - CFG.INTER;
      const len = s1 - s0, mid = (s0 + s1) / 2;
      for (const alongX of [true, false]) {
        const P = (along, lat) => (alongX ? [along, c + lat] : [c + lat, along]);
        // linha dupla amarela (com folga para a faixa de pedestres)
        const ls0 = s0 + 5.2, ls1 = s1 - 5.2, lm = (ls0 + ls1) / 2, ll = ls1 - ls0;
        for (const off of [-0.16, 0.16]) { const [x, z] = P(lm, off); addRect(yellow, x, z, alongX, ll, 0.12); }
        // bordas brancas da faixa de estacionamento
        for (const off of [-EDGE, EDGE]) { const [x, z] = P(lm, off); addRect(white, x, z, alongX, ll, 0.12); }
        // faixas de pedestres nas duas pontas
        for (const end of [s0, s1]) {
          const dir = end === s0 ? 1 : -1;
          const center = end + dir * (CFG.RING - CFG.INTER);
          for (let k = -6; k <= 6; k += 1.2) { const [x, z] = P(center, k); addRect(white, x, z, alongX, 2.6, 0.6); }
          // linha de retenção na faixa de quem chega
          // quem chega em s1 anda no sentido +; mão direita: +X usa z>0, +Z usa x<0
          const stopAt = end + dir * 4.6;
          const plus = end === s1;
          const lat = alongX ? (plus ? 1 : -1) : plus ? -1 : 1;
          const [x, z] = P(stopAt, (lat * (EDGE + 0.3)) / 2);
          addRect(white, x, z, !alongX, EDGE - 0.3, 0.45);
        }
        void len; void mid;
      }
    }
  }
  const markMat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const wm = new THREE.Mesh(mergeGeometries(white.map((g) => g.toNonIndexed())), markMat(0xeeeeee));
  const ym = new THREE.Mesh(mergeGeometries(yellow.map((g) => g.toNonIndexed())), markMat(0xf2c230));
  wm.receiveShadow = ym.receiveShadow = true;
  scene.add(wm, ym);

  // ----- Prédios -----
  const baked = [];
  const backdrop = [];
  const place = (key, kit, x, z, rotY, scale) => {
    const o = Assets.clone(key);
    o.scale.setScalar(scale);
    o.rotation.y = rotY;
    o.position.set(x, 0, z);
    o.updateMatrixWorld(true);
    return o;
  };
  const addBuilding = (key, cx, cz, rotY, scale = BLD_SCALE) => {
    const o = place(`buildings/${key}`, 'b', 0, 0, rotY, scale);
    const box = new THREE.Box3().setFromObject(o);
    const c = box.getCenter(new THREE.Vector3());
    o.position.set(cx - c.x, H - 0.02, cz - c.z);
    o.updateMatrixWorld(true);
    box.setFromObject(o);
    world.addBox(box.min.x + 0.05, box.min.z + 0.05, box.max.x - 0.05, box.max.z - 0.05, box.max.y, 'building');
    baked.push({ obj: o, kit: 'b' });
    return box;
  };
  // fachadas: rotY tal que +Z local aponte para a rua
  const faceRot = (dx, dz) => Math.atan2(dx, dz);

  const trees = [];
  const addTree = (x, z, big = true) => {
    const o = place(big ? 'props/suburban/tree-large' : 'props/suburban/tree-small', 's', x, z, rnd() * 6.28, big ? 8.5 : 8);
    o.position.y = H;
    baked.push({ obj: o, kit: 's' });
    world.addCircle(x, z, 0.4, 6, 'tree');
    trees.push([x, z]);
  };

  let park = false;
  for (let i = 0; i < CFG.NB; i++)
    for (let j = 0; j < CFG.NB; j++) {
      const bx0 = nodeCoord(i) + CFG.WALK_OUT, bx1 = nodeCoord(i + 1) - CFG.WALK_OUT;
      const bz0 = nodeCoord(j) + CFG.WALK_OUT, bz1 = nodeCoord(j + 1) - CFG.WALK_OUT;
      const cx = (bx0 + bx1) / 2, cz = (bz0 + bz1) / 2;
      const r = rnd();
      const isCenter = (i === 1 || i === 2) && (j === 1 || j === 2);
      if (!park && i === 2 && j === 1) {
        // praça com árvores
        park = true;
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (!(a === 1 && b === 1)) addTree(bx0 + 6 + a * 11.5 + rnd() * 2, bz0 + 6 + b * 11.5 + rnd() * 2, rnd() > 0.4);
        const pl = place('props/suburban/planter', 's', cx, cz, 0, 9); pl.position.y = H; baked.push({ obj: pl, kit: 's' });
        world.addBox(cx - 1.8, cz - 1.4, cx + 1.8, cz + 1.4, 1.6, 'planter');
        continue;
      }
      if (isCenter && r < 0.75) {
        // arranha-céu central + árvores na esquina
        const key = BUILDING_TALL[Math.floor(rnd() * BUILDING_TALL.length)];
        addBuilding(key, cx, cz, Math.floor(rnd() * 4) * (Math.PI / 2), 16);
        for (const [tx, tz] of [[bx0 + 3.5, bz0 + 3.5], [bx1 - 3.5, bz0 + 3.5], [bx0 + 3.5, bz1 - 3.5], [bx1 - 3.5, bz1 - 3.5]]) addTree(tx, tz, true);
        continue;
      }
      // quatro prédios menores, um por quadrante, de frente para a rua
      const q = 8.75;
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const key = BUILDING_SMALL[Math.floor(rnd() * BUILDING_SMALL.length)];
          const faceX = rnd() < 0.5;
          const rot = faceX ? faceRot(sx, 0) : faceRot(0, sz);
          const px = cx + sx * q, pz = cz + sz * q;
          // encosta na calçada
          const o = place(`buildings/${key}`, 'b', 0, 0, rot, BLD_SCALE);
          const box = new THREE.Box3().setFromObject(o);
          const w = box.max.x - box.min.x, d = box.max.z - box.min.z;
          const tx = sx > 0 ? bx1 - w / 2 - 0.3 : bx0 + w / 2 + 0.3;
          const tz = sz > 0 ? bz1 - d / 2 - 0.3 : bz0 + d / 2 + 0.3;
          void px; void pz;
          addBuilding(key, tx, tz, rot);
        }
    }

  // ----- Mobiliário urbano -----
  const lights = [];
  for (let a = 0; a < NODES; a++) {
    const c = nodeCoord(a);
    for (let b = 0; b < CFG.NB; b++) {
      const s0 = nodeCoord(b);
      for (const alongX of [true, false])
        for (const side of [-1, 1]) {
          // não coloca do lado de fora do muro
          const lat = c + side * CFG.FURN;
          if (Math.abs(lat) > W - 2) continue;
          for (const t of [17, 43]) {
            const along = s0 + t;
            const [x, z] = alongX ? [along, lat] : [lat, along];
            const o = place('props/roads/light-curved', 'r', x, z, 0, 10);
            // o braço do poste aponta para -Z local; vira para a rua
            o.rotation.y = alongX ? (side > 0 ? 0 : Math.PI) : side > 0 ? Math.PI / 2 : -Math.PI / 2;
            o.position.y = H;
            baked.push({ obj: o, kit: 'r' });
            world.addCircle(x, z, 0.22, 7, 'pole');
            lights.push([x, z]);
          }
          if (rnd() < 0.55) {
            const along = s0 + 30 + (rnd() - 0.5) * 6;
            const [x, z] = alongX ? [along, lat] : [lat, along];
            addTree(x, z, rnd() > 0.5);
          }
        }
    }
  }

  // ----- Muro (limite do mapa) -----
  const wallMat = new THREE.MeshStandardMaterial({ map: T.wall, roughness: 0.9 });
  const WH = 2.6, WT = 1.2;
  const wallGeos = [];
  const addWall = (minX, minZ, maxX, maxZ) => {
    const g = new THREE.BoxGeometry(maxX - minX, WH, maxZ - minZ);
    const uv = g.attributes.uv, pos = g.attributes.position, nrm = g.attributes.normal;
    for (let k = 0; k < uv.count; k++) {
      const px = pos.getX(k) + (minX + maxX) / 2, pz = pos.getZ(k) + (minZ + maxZ) / 2, py = pos.getY(k) + WH / 2;
      const along = Math.abs(nrm.getX(k)) > 0.5 ? pz : px;
      uv.setXY(k, along / 4, py / WH);
    }
    g.translate((minX + maxX) / 2, WH / 2, (minZ + maxZ) / 2);
    wallGeos.push(g.toNonIndexed());
    world.addBox(minX, minZ, maxX, maxZ, WH, 'wall');
  };
  addWall(-W - WT, W, W + WT, W + WT);
  addWall(-W - WT, -W - WT, W + WT, -W);
  addWall(W, -W, W + WT, W);
  addWall(-W - WT, -W, -W, W);
  const wallMesh = new THREE.Mesh(mergeGeometries(wallGeos), wallMat);
  wallMesh.castShadow = wallMesh.receiveShadow = true;
  scene.add(wallMesh);

  // ----- Cenário de fundo (fora do muro) -----
  for (let k = 0; k < 90; k++) {
    const ang = rnd() * Math.PI * 2;
    const rr = 150 + rnd() * 120;
    let x = Math.sin(ang) * rr, z = Math.cos(ang) * rr;
    // empurra para fora do quadrado jogável
    const m = Math.max(Math.abs(x), Math.abs(z));
    if (m < 148) { const f = 148 / m; x *= f; z *= f; }
    const key = BACKDROP[Math.floor(rnd() * BACKDROP.length)];
    const o = place(`buildings/${key}`, 'b', x, z, Math.atan2(-x, -z), 15 + rnd() * 8);
    o.position.y = H;
    backdrop.push({ obj: o, kit: 'b' });
  }
  for (let k = 0; k < 70; k++) {
    const side = Math.floor(rnd() * 4);
    const t = -W + rnd() * 2 * W;
    const d = W + 4 + rnd() * 8;
    const [x, z] = [[t, d], [t, -d], [d, t], [-d, t]][side];
    const o = place('props/suburban/tree-large', 's', x, z, rnd() * 6, 8 + rnd() * 4);
    o.position.y = H;
    backdrop.push({ obj: o, kit: 's' });
  }

  scene.add(bake(baked, true, true));
  scene.add(bake(backdrop, false, true));

  return { lights, trees, textures: T };
}

// ---------- Grafo de calçadas para pedestres ----------
export function buildPedGraph() {
  const nodes = [];
  const idx = new Map();
  const key = (i, j, sx, sz) => `${i},${j},${sx},${sz}`;
  for (let i = 0; i < NODES; i++)
    for (let j = 0; j < NODES; j++)
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const n = { x: nodeCoord(i) + sx * CFG.RING, z: nodeCoord(j) + sz * CFG.RING, links: [], cross: [] };
          idx.set(key(i, j, sx, sz), nodes.length);
          nodes.push(n);
        }
  const link = (a, b, isCross) => {
    if (a === undefined || b === undefined) return;
    nodes[a].links.push(b); nodes[b].links.push(a);
    if (isCross) { nodes[a].cross.push(b); nodes[b].cross.push(a); }
  };
  for (let i = 0; i < NODES; i++)
    for (let j = 0; j < NODES; j++)
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const a = idx.get(key(i, j, sx, sz));
          // faixas de pedestres (atravessa uma rua)
          if (sx === 1) link(a, idx.get(key(i, j, -1, sz)), true);
          if (sz === 1) link(a, idx.get(key(i, j, sx, -1)), true);
          // calçada ao longo do quarteirão
          if (sx === 1 && i + 1 < NODES) link(a, idx.get(key(i + 1, j, -1, sz)), false);
          if (sz === 1 && j + 1 < NODES) link(a, idx.get(key(i, j + 1, sx, -1)), false);
        }
  return nodes;
}

// ---------- Vagas de estacionamento ----------
export function parkingSpots() {
  const spots = [];
  for (let a = 0; a < NODES; a++) {
    const c = nodeCoord(a);
    for (let b = 0; b < CFG.NB; b++) {
      const s0 = nodeCoord(b);
      for (const alongX of [true, false])
        for (const side of [-1, 1])
          for (const t of [23, 30, 37]) {
            const along = s0 + t;
            const lat = c + side * CFG.PARK;
            const [x, z] = alongX ? [along, lat] : [lat, along];
            // mão da via: lado direito do sentido -> heading
            const dir = alongX ? (side > 0 ? 0 : 2) : side < 0 ? 1 : 3;
            const [fx, fz] = DIRS[dir];
            spots.push({ x, z, h: Math.atan2(fx, fz) });
          }
    }
  }
  return spots;
}
