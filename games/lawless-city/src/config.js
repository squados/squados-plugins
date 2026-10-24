// Constantes do mundo. Unidade = metro.
export const CFG = {
  ORIGIN: -120, // primeira linha de rua
  PITCH: 60, // distância entre ruas paralelas
  NB: 4, // quarteirões por eixo (5 ruas por eixo)
  ROAD_HALF: 7.5, // meia largura do asfalto
  WALK_OUT: 12.5, // fim da calçada, a partir do eixo da rua
  LANE: 2.4, // centro da faixa de rolamento
  PARK: 6.1, // centro da faixa de estacionamento
  FURN: 8.1, // postes e árvores (perto do meio-fio)
  RING: 10.2, // linha média de caminhada dos pedestres
  INTER: 7.5, // meia largura do cruzamento
  CURB_H: 0.15, // altura do meio-fio
  WALL: 132.5, // limite do mapa (muro)
  CH_SCALE: 2.6, // personagem Kenney (0,67) -> ~1,75 m
  CAR_SCALE: 1.75, // sedã Kenney (2,55) -> ~4,5 m
};

export const NODES = CFG.NB + 1;
export const nodeCoord = (i) => CFG.ORIGIN + i * CFG.PITCH;
export const MAX_LINE = CFG.ORIGIN + CFG.NB * CFG.PITCH;

export function distToLine(u) {
  if (u <= CFG.ORIGIN) return CFG.ORIGIN - u;
  if (u >= MAX_LINE) return u - MAX_LINE;
  const k = Math.round((u - CFG.ORIGIN) / CFG.PITCH);
  return Math.abs(u - (CFG.ORIGIN + k * CFG.PITCH));
}

export function isRoad(x, z) {
  const inX = x > CFG.ORIGIN - CFG.ROAD_HALF && x < MAX_LINE + CFG.ROAD_HALF;
  const inZ = z > CFG.ORIGIN - CFG.ROAD_HALF && z < MAX_LINE + CFG.ROAD_HALF;
  return (inX && inZ) && (distToLine(x) < CFG.ROAD_HALF || distToLine(z) < CFG.ROAD_HALF);
}

export function groundHeight(x, z) {
  return isRoad(x, z) ? 0 : CFG.CURB_H;
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));
export function angleDiff(a, b) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function pickWeighted(obj) {
  let total = 0;
  for (const k in obj) total += obj[k];
  let r = Math.random() * total;
  for (const k in obj) if ((r -= obj[k]) <= 0) return k;
  return Object.keys(obj)[0];
}

export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Direções: 0:+X 1:+Z 2:-X 3:-Z
export const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
export const headingOf = (fx, fz) => Math.atan2(fx, fz);
