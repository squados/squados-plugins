import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

THREE.Cache.enabled = true; // texturas iguais (colormap.png) viram uma só imagem

// No build, play/index.html lê os mesmos arquivos de public/, sem cópia duplicada.
const ROOT = import.meta.env.DEV ? '' : '../public/';

const letters = (from, to) => {
  const out = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) out.push(String.fromCharCode(c));
  return out;
};

export const CHAR_KEYS = [
  ...letters('a', 'f').map((l) => `character-female-${l}`),
  ...letters('a', 'f').map((l) => `character-male-${l}`),
];
export const PLAYER_KEY = 'character-male-e';
export const CAR_KEYS = ['sedan', 'taxi', 'police', 'suv', 'suv-luxury', 'van', 'hatchback-sports', 'sedan-sports', 'delivery', 'truck', 'ambulance'];
export const TRAFFIC_WEIGHTS = { sedan: 5, taxi: 3, suv: 3, 'suv-luxury': 2, van: 2, 'hatchback-sports': 2, 'sedan-sports': 2, police: 1, delivery: 1, truck: 1, ambulance: 0.5 };
export const BUILDING_SMALL = letters('a', 'n').map((l) => `building-${l}`);
export const BUILDING_TALL = letters('a', 'e').map((l) => `building-skyscraper-${l}`);
export const BACKDROP = [...letters('a', 'n').map((l) => `low-detail-building-${l}`), 'low-detail-building-wide-a', 'low-detail-building-wide-b'];
const PROPS = ['props/roads/light-square', 'props/roads/light-curved', 'props/suburban/tree-large', 'props/suburban/tree-small', 'props/suburban/planter', 'props/cone', 'props/box', 'weapon/pistol',
  'props/debris-bumper', 'props/debris-tire', 'props/debris-door', 'props/debris-plate-a', 'props/debris-plate-small-a'];
export const DEBRIS = ['props/debris-bumper', 'props/debris-tire', 'props/debris-door', 'props/debris-plate-a', 'props/debris-plate-small-a'];

export const SOUND_FILES = [
  'footstep_concrete_000', 'footstep_concrete_001', 'footstep_concrete_002', 'footstep_concrete_003', 'footstep_concrete_004',
  'impactMetal_heavy_000', 'impactMetal_heavy_001', 'impactMetal_heavy_002', 'impactMetal_medium_000', 'impactMetal_medium_001',
  'impactMetal_light_000', 'impactMetal_light_001', 'impactMetal_light_002',
  'impactPunch_heavy_000', 'impactPunch_heavy_001', 'impactPunch_heavy_002',
  'impactSoft_heavy_000', 'impactSoft_heavy_001',
  'impactGeneric_light_000', 'impactGeneric_light_001', 'impactGeneric_light_002',
  'impactGlass_light_000', 'impactPlate_light_000', 'impactPlate_medium_000',
  'metalLatch', 'doorClose_1', 'cloth1', 'woosh1',
];

const store = new Map();

function prepare(root) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (m.map) m.map.anisotropy = 4;
        if ('metalness' in m) m.metalness = 0;
        if ('roughness' in m) m.roughness = Math.max(m.roughness ?? 1, 0.7);
      }
    }
  });
}

export const Assets = {
  async loadAll(onProgress) {
    const list = [
      ...CHAR_KEYS.map((k) => `characters/${k}`),
      ...CAR_KEYS.map((k) => `cars/${k}`),
      ...BUILDING_SMALL.map((k) => `buildings/${k}`),
      ...BUILDING_TALL.map((k) => `buildings/${k}`),
      ...BACKDROP.map((k) => `buildings/${k}`),
      ...PROPS,
    ];
    const loader = new GLTFLoader();
    let done = 0;
    const total = list.length + SOUND_FILES.length;
    const tick = () => onProgress && onProgress(++done / total);
    const models = list.map((k) =>
      loader.loadAsync(`${ROOT}assets/${k}.glb`).then((g) => {
        prepare(g.scene);
        store.set(k, g);
        tick();
      })
    );
    const sounds = SOUND_FILES.map((n) =>
      fetch(`${ROOT}assets/audio/${n}.ogg`)
        .then((r) => r.arrayBuffer())
        .then((b) => {
          store.set(`sound:${n}`, b);
          tick();
        })
    );
    await Promise.all([...models, ...sounds]);
  },
  gltf: (k) => store.get(k),
  sound: (n) => store.get(`sound:${n}`),
  clone: (k) => store.get(k).scene.clone(true),
  cloneChar: (k) => skeletonClone(store.get(`characters/${k}`).scene),
};
