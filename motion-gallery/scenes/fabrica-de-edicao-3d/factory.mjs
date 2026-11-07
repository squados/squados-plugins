import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const WIDTH = 1920, HEIGHT = 1080, FPS = 30;
const FRAME_COUNTS = { queue: 466, knowledge: 325, mural: 292, farewell: 367 };
const ASSETS = {
  factory: ['conveyor-long-stripe-sides', 'scanner-high', 'machine-window',
    'machine-connection-hole', 'box-small', 'warning-traffic', 'robot-arm-a',
    'structure-window-wide', 'structure-doorway-wide', 'door-wide-open',
    'lever-single', 'pipe-large-long', 'pipe-large-curve'],
  furniture: ['desk', 'computerScreen', 'computerKeyboard', 'pottedPlant'],
};
const SKINS = ['casualMaleA', 'robot', 'robot2', 'robot3'];
const CLIPS = ['idle', 'walk', 'interactStanding'];
const COLORS = {
  manual: { ink: '#121c2a', floor: '#383740', wall: '#282c3a', metal: '#53464c',
    accent: '#e79c63', light: '#ffbc6d', glow: '#ff9c5b', panel: '#363749' },
  auto: { ink: '#101e2a', floor: '#253945', wall: '#263645', metal: '#3a5263',
    accent: '#72d8ca', light: '#9cf4e8', glow: '#68f5e1', panel: '#1c4b51' },
};

const root = document.querySelector('main');
const label = document.querySelector('.scene-label');
const clamp = x => Math.max(0, Math.min(1, x));
const ease = (t, a, b) => {
  const p = clamp((t - a) / (b - a));
  return p * p * (3 - 2 * p);
};
const lerp = T.MathUtils.lerp;
const wave = (t, rate) => .5 + .5 * Math.sin(t * rate);
const mod = (x, n) => ((x % n) + n) % n;
const vector = v => new T.Vector3(...v);
const COLOR_KEYS = ['#deb080', '#c89ce2', '#79cabf', '#86b5df', '#eda587', '#c0bcff', '#dfa578', '#8bd9cb', '#b6f4e0'];
const CARD_LABELS = ['ÓRBITA', 'COLAGEM', 'CONTRACAMPO', 'MÁSCARA', 'VIDRO', 'TRÊS CORTES', 'AGENTES', 'DOBRA', 'NOVO EFEITO'];

function texture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const output = new T.CanvasTexture(canvas);
  output.colorSpace = T.SRGBColorSpace;
  output.anisotropy = 4;
  return output;
}
function material(color, roughness = .72, metalness = .05) {
  return new T.MeshStandardMaterial({ color, roughness, metalness });
}
function lit(color) {
  return new T.MeshBasicMaterial({ color });
}
function object(geometry, surface, xyz, parent, shadow = true) {
  const mesh = new T.Mesh(geometry, surface);
  mesh.position.set(...xyz);
  mesh.castShadow = mesh.receiveShadow = shadow;
  parent.add(mesh);
  return mesh;
}
function block(parent, xyz, dimensions, surface, radius = .04, shadow = true) {
  const geometry = radius
    ? new RoundedBoxGeometry(...dimensions, 1, radius)
    : new T.BoxGeometry(...dimensions);
  return object(geometry, surface, xyz, parent, shadow);
}
function panel(parent, xyz, dimensions, surface) {
  return object(new T.PlaneGeometry(...dimensions), surface, xyz, parent, false);
}
function group(parent, x = 0, y = 0, z = 0) {
  const child = new T.Group();
  child.position.set(x, y, z);
  parent.add(child);
  return child;
}
function fitLabel(parent, xyz, width, height, title, subtitle, accent) {
  const map = texture(768, 208, (c, w, h) => {
    c.fillStyle = '#1e2634';
    c.fillRect(0, 0, w, h);
    c.fillStyle = accent;
    c.fillRect(0, 0, 8, h);
    c.fillRect(42, 33, 62, 4);
    c.font = '700 58px Outfit, sans-serif';
    c.fillStyle = '#fff5e9';
    c.fillText(title, 42, 114);
    c.font = '600 24px Outfit, sans-serif';
    c.fillStyle = accent;
    c.fillText(subtitle, 44, 165);
  });
  return panel(parent, xyz, [width, height], new T.MeshBasicMaterial({ map }));
}

async function loadAssets(inputs) {
  const gltf = new GLTFLoader(), fbx = new FBXLoader(), tex = new T.TextureLoader();
  const entries = Object.entries(ASSETS).flatMap(([pack, names]) => names.map(async name =>
    [name, (await gltf.loadAsync('assets/' + pack + '/' + name + '.glb')).scene]));
  const loadFbx = name => fbx.loadAsync('assets/characters/' + name + '.fbx');
  const [models, human, robot, clips, maps, atlas] = await Promise.all([
    Promise.all(entries), loadFbx('characterLargeMale'), loadFbx('characterMedium'),
    Promise.all(CLIPS.map(async key => [key, (await loadFbx(key)).animations[0]])),
    Promise.all(SKINS.map(async key => {
      const map = await tex.loadAsync('assets/characters/' + key + '.png');
      map.colorSpace = T.SRGBColorSpace;
      map.anisotropy = 4;
      return [key, map];
    })),
    inputs.atlas ? new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(Error('Não foi possível carregar o atlas de referências.'));
      image.src = inputs.atlas;
    }) : null,
  ]);
  return { models: Object.fromEntries(models), human, robot, clips: Object.fromEntries(clips), maps: Object.fromEntries(maps), atlas };
}

function place(models, name, parent, xyz, scale = 1, yaw = 0, shade = '#ffffff') {
  const asset = models[name].clone();
  asset.position.set(...xyz);
  asset.scale.setScalar(scale);
  asset.rotation.y = yaw;
  asset.traverse(mesh => {
    if (!mesh.isMesh) return;
    const coat = surface => {
      const output = surface.clone();
      if (!output.transparent) {
        output.color.multiply(new T.Color(shade));
        output.roughness = .67;
        output.metalness = .04;
      }
      return output;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(coat) : coat(mesh.material);
    mesh.castShadow = mesh.receiveShadow = true;
  });
  parent.add(asset);
  return asset;
}

function makeActor(parent, source, size, skin, clips) {
  const holder = group(parent);
  const model = cloneSkeleton(source);
  model.scale.setScalar(size);
  const coat = new T.MeshStandardMaterial({ map: skin, roughness: .72, metalness: .04 });
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    mesh.material = coat;
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.frustumCulled = false;
  });
  holder.add(model);
  const mixer = new T.AnimationMixer(model);
  const actions = Object.fromEntries(CLIPS.map(name => {
    const action = mixer.clipAction(clips[name]).play();
    action.paused = true;
    return [name, action];
  }));
  const hand = model.getObjectByName('RightHand');
  return {
    holder, hand,
    pose(t, walk = 0, reach = 0, contact = .66) {
      const weights = [1 - walk - reach, walk, reach];
      for (const [i, name] of CLIPS.entries()) {
        const action = actions[name];
        action.time = name === 'interactStanding' ? contact : mod(t, clips[name].duration);
        action.setEffectiveWeight(Math.max(0, weights[i]));
      }
      mixer.update(0);
    },
  };
}

function gridFloor(color) {
  const map = texture(1024, 640, (c, w, h) => {
    c.fillStyle = color;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) {
      const x = (i * 487.13) % w, y = (i * 128.27) % h;
      c.fillStyle = i % 2 ? '#ffffff07' : '#0000000d';
      c.fillRect(x, y, 1 + i % 3, 1);
    }
    for (let x = 32; x < w; x += 96) {
      c.fillStyle = '#151c2738';
      c.fillRect(x, 0, 2, h);
    }
    for (let y = 32; y < h; y += 96) {
      c.fillStyle = '#151c2747';
      c.fillRect(0, y, w, 2);
    }
  });
  return new T.MeshStandardMaterial({ map, roughness: .78 });
}

function cardArt(index, atlas) {
  const palette = COLOR_KEYS[index];
  return texture(384, 210, (c, w, h) => {
    c.fillStyle = '#14202f';
    c.fillRect(0, 0, w, h);
    if (atlas) {
      const column = index % 3, row = Math.floor(index / 3);
      c.drawImage(atlas, column * atlas.width / 3, row * atlas.height / 3,
        atlas.width / 3, atlas.height / 3, 0, 0, w, h - 45);
    } else {
      c.strokeStyle = palette;
      c.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const offset = (index + 1) * i;
        c.strokeRect(50 + offset, 24 + 10 * i, 262 - offset * 2, 104 - 14 * i);
      }
      c.fillStyle = palette;
      c.beginPath();
      c.moveTo(168, 53); c.lineTo(235, 80); c.lineTo(168, 107); c.closePath(); c.fill();
    }
    c.fillStyle = '#14202f';
    c.fillRect(0, h - 47, w, 47);
    c.fillStyle = palette;
    c.fillRect(9, h - 40, 4, 32);
    c.font = '700 25px Outfit, sans-serif';
    c.fillText(CARD_LABELS[index], 28, h - 15);
  });
}

function board(parent, auto, colors, maps) {
  const frame = group(parent, 1.55, 1.95, -2.58);
  const edge = material(colors.metal, .51, .23);
  block(frame, [0, 0, 0], [3.84, 2.03, .16], edge, .085);
  block(frame, [0, -.04, .097], [3.64, 1.74, .045], material('#172130'), .025);
  block(frame, [0, .963, .10], [3.56, .025, .015], lit(colors.light), 0, false);
  const heading = fitLabel(frame, [0, .695, .125], 3.58, .365,
    auto ? 'MURAL DE EFEITOS' : 'REFERÊNCIAS DO EDITOR', auto ? 'BIBLIOTECA COMPARTILHADA' : 'ARQUIVO DA ESTAÇÃO', colors.light);
  heading.material.toneMapped = false;
  const cards = maps.map((map, i) => {
    const x = (i % 3 - 1) * 1.16, y = .318 - Math.floor(i / 3) * .48;
    block(frame, [x, y, .13], [1.04, .413, .043], material('#314053'), .015, false);
    const card = group(frame, x, y, .169);
    block(card, [0, 0, .0], [1.027, .402, .047], edge, .026, false);
    panel(card, [0, 0, .026], [.985, .355], new T.MeshBasicMaterial({ map }));
    return { card, x, y };
  });
  return { frame, cards };
}

function tokenArt(style, atlas) {
  const colors = { input: ['#2b2b39', '#ffd3a3'], error: ['#5b3c35', '#ffd496'],
    output: ['#183b3e', '#bef9e9'], effect: ['#183b3e', '#bef9e9'] };
  const [back, front] = colors[style];
  return texture(256, 160, (c, w, h) => {
    c.fillStyle = back; c.fillRect(0, 0, w, h);
    c.strokeStyle = front; c.lineWidth = 2;
    c.strokeRect(16, 14, w - 32, h - 27);
    c.fillStyle = front;
    for (let i = 0; i < 9; i++) {
      c.fillRect(24 + i * 24, 23, 12, 6);
      c.fillRect(24 + i * 24, 131, 12, 6);
    }
    c.beginPath();
    if (style === 'output' || style === 'effect') {
      const inset = style === 'effect';
      if (inset && atlas) {
        c.drawImage(atlas, atlas.width * 2 / 3, atlas.height * 2 / 3, atlas.width / 3, atlas.height / 3, 39, 43, 113, 70);
      } else if (inset) {
        c.strokeRect(41, 46, 104, 65);
        c.fillRect(55, 56, 18, 20); c.fillRect(85, 65, 18, 28); c.fillRect(115, 79, 18, 21);
      }
      const x = inset ? 70 : 0;
      c.moveTo(98 + x, 79); c.lineTo(119 + x, 99); c.lineTo(161 + x * .76, 58);
      c.lineWidth = inset ? 8 : 12; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    } else if (style === 'error') {
      c.moveTo(132, 52); c.lineTo(158, 101); c.lineTo(106, 101); c.closePath(); c.fill();
      c.fillStyle = back; c.fillRect(130, 68, 4, 17); c.fillRect(130, 90, 4, 4);
    } else {
      c.moveTo(109, 53); c.lineTo(155, 79); c.lineTo(109, 105); c.closePath(); c.fill();
    }
  });
}

function createToken(parent, stock) {
  const holder = group(parent);
  const casing = block(holder, [0, .233, 0], [.65, .46, .18], stock.shell, .041);
  const face = panel(holder, [0, .233, .092], [.59, .387], stock.input);
  const reverse = panel(holder, [0, .233, -.092], [.59, .387], stock.input);
  reverse.rotation.y = Math.PI;
  return {
    holder,
    state(name) {
      face.material = reverse.material = stock[name];
      casing.material = name === 'output' || name === 'effect' ? stock.outputShell : stock.shell;
    },
  };
}

function belt(room, models, auto, colors) {
  const frame = group(room);
  const beam = material(auto ? '#374e61' : '#47404b', .61, .18);
  const rim = lit(colors.accent);
  for (let i = -2; i <= 2; i++) {
    const x = i * 2;
    place(models, 'conveyor-long-stripe-sides', frame, [x, .28, 0], 1, 0, auto ? '#c1eee4' : '#ffdac9');
    block(frame, [x, .215, 0], [1.9, .395, .77], beam, .055);
    block(frame, [x, .44, .494], [1.78, .032, .015], rim, 0, false);
    for (const z of [-.31, .31]) {
      block(frame, [x, .05, z], [.77, .086, .29], beam, .027);
    }
  }
  const lines = texture(64, 64, (c, w, h) => {
    c.fillStyle = '#313846'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#242936'; c.fillRect(0, 0, 4, h);
    c.fillStyle = '#454d5c'; c.fillRect(4, 0, 3, h);
  });
  lines.wrapS = T.RepeatWrapping;
  lines.repeat.x = 55;
  const top = panel(frame, [0, .681, 0], [9.88, .755], new T.MeshStandardMaterial({ map: lines, roughness: .73 }));
  top.rotation.x = -Math.PI / 2;
  top.receiveShadow = true;
  return lines;
}

function buildRoom(scene, assets, auto, tiles, stock) {
  const colors = auto ? COLORS.auto : COLORS.manual;
  const { models } = assets;
  const room = group(scene);
  const iron = material(colors.metal, .6, .22);
  const backdrop = material(colors.wall);
  const rim = lit(colors.accent);
  block(room, [0, -.13, -.16], [12.55, .25, 7.82], iron, .085);
  const floor = panel(room, [0, .002, -.16], [12.53, 7.8], gridFloor(colors.floor));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  block(room, [0, .021, 1.53], [10.4, .014, .045], rim, 0, false);
  for (let i = 0; i < 16; i++) {
    const mark = block(room, [-5.25 + i * .70, .024, 1.39], [.26, .016, .033], iron, 0, false);
    mark.rotation.y = -.65;
  }

  block(room, [0, 1.84, -3.81], [12.5, 3.68, .32], backdrop, .085);
  block(room, [0, 3.55, -3.58], [12.3, .16, .17], iron);
  block(room, [0, 3.47, -3.46], [12.2, .019, .023], rim, 0, false);
  for (const x of [-4.3, -2.3]) {
    place(models, 'structure-window-wide', room, [x, 0, -4.02], 1, 0, auto ? '#b9d9ef' : '#e5c8bb');
    block(room, [x, 2.78, -2.63], [1.77, .076, .09], lit(auto ? '#92b5d5' : '#f0c39d'), .025, false);
  }
  block(room, [0, .12, -3.3], [12.0, .24, .16], iron);
  for (const x of [-5.65, 4.6]) {
    block(room, [x, 1.75, -3.54], [.17, 3.49, .24], iron);
    block(room, [x, 2.26, -3.38], [.03, .63, .033], rim, .009, false);
  }
  const pipeColor = auto ? '#a5d7ee' : '#cbb3b4';
  for (let i = 0; i < 6; i++) {
    place(models, 'pipe-large-long', room, [-.93 + .78 * i, 2.90, -3.18], .39, 0, pipeColor);
  }
  place(models, 'pipe-large-curve', room, [3.61, 2.90, -3.18], .39, 0, pipeColor);

  const strip = belt(room, models, auto, colors);
  const referenceBoard = board(room, auto, colors, tiles);
  place(models, 'pottedPlant', room, [4.31, .01, -2.58], 1.6, .2);
  const door = group(room, 5.18, .01, 2.17);
  door.rotation.y = -Math.PI / 2;
  place(models, 'structure-doorway-wide', door, [0, 0, -.26], .78, 0, auto ? '#bde7e5' : '#ffd9c1');
  place(models, 'door-wide-open', door, [0, 0, -.25], .78);
  block(door, [0, 1.925, .52], [1.19, .032, .026], rim, 0, false);

  const lamp = new T.MeshStandardMaterial({ color: colors.glow, emissive: colors.glow, emissiveIntensity: .35 });
  place(models, 'box-small', room, [-5.39, .01, -1.72], 1.25, .25);
  const indicator = place(models, 'warning-traffic', room, [auto ? 4.85 : .78, .02, .78], .8, .12);
  const beacon = block(room, [indicator.position.x, 1.25, .83], [.12, .07, .095], lamp, .026, false);
  fitLabel(room, [-3.42, 2.15, -2.48], 2.62, .71, auto ? 'LINHA 02' : 'LINHA 01',
    auto ? 'EDIÇÃO COM IA' : 'EDIÇÃO MANUAL', colors.light);

  const tokens = Array.from({ length: auto ? 6 : 8 }, () => createToken(room, stock));
  if (!auto) {
    place(models, 'desk', room, [.2, .01, -1.52], 2.34);
    place(models, 'computerScreen', room, [1.26, .914, -1.52], 1.64, Math.PI);
    place(models, 'computerKeyboard', room, [.91, .916, -1.39], 1.52);
    place(models, 'lever-single', room, [1.26, .65, -.8], .82, .10);
    place(models, 'machine-window', room, [3.32, .014, -.96], .88, .14);
    const editMap = texture(320, 180, (c, w, h) => {
      c.fillStyle = '#202936'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#4c586e'; c.fillRect(22, 18, 123, 88);
      c.fillStyle = '#b499b8'; c.fillRect(51, 55, 61, 25);
      c.fillStyle = '#8b9fbb'; c.fillRect(161, 25, 112, 7); c.fillRect(161, 45, 76, 7);
      c.fillStyle = '#55617b'; c.fillRect(161, 64, 91, 7); c.fillRect(161, 83, 55, 7);
      for (let i = 0; i < 7; i++) {
        c.fillStyle = ['#bfa3da', '#e2ac93', '#73ab9a'][i % 3];
        c.fillRect(14 + 42 * i, 124, 38, 17);
        c.fillRect(22 + 42 * i, 147, 29, 11);
      }
      c.fillStyle = '#eff9f1'; c.fillRect(194, 115, 4, 52);
    });
    panel(room, [.938, 1.194, -1.352], [.577, .314], new T.MeshBasicMaterial({ map: editMap }));
    const carryCase = place(models, 'box-small', room, [0, 0, 0], .78);
    const handle = material('#192630', .52, .22);
    block(carryCase, [0, .558, 0], [.235, .054, .069], handle, .019);
    block(carryCase, [0, .31, .252], [.263, .141, .023], rim, .013, false);
    const editor = makeActor(room, assets.human, .00555, assets.maps.casualMaleA, assets.clips);
    return { room, colors, strip, referenceBoard, tokens, editor, carryCase, lamp };
  }

  for (const x of [-.95, 2.35]) {
    place(models, 'scanner-high', room, [x, .32, 0], .84, 0, '#c1fff3');
  }
  place(models, 'machine-connection-hole', room, [4.62, .03, -1.24], 1.07, -.17, '#badbfa');
  place(models, 'machine-window', room, [-4.6, .03, -1.34], 1.00, .11, '#b7f2df');
  const arm = place(models, 'robot-arm-a', room, [-2.91, .03, -.79], .83, .36, '#c1fbef');
  const bots = [-3.91, -.11, 3.24].map((x, i) => {
    const actor = makeActor(room, assets.robot, .00425, assets.maps[SKINS[i + 1]], assets.clips);
    actor.holder.position.set(x, .02, -1.03);
    actor.holder.rotation.y = -.12 + i * .10;
    return actor;
  });
  const control = group(room, 2.75, .0, 1.02);
  block(control, [0, .50, 0], [.38, .98, .36], iron, .043);
  block(control, [0, 1.00, 0], [.53, .098, .46], material(colors.panel, .41, .11), .033);
  place(models, 'lever-single', control, [.05, 1.05, -.02], .55, 0, '#b7e9de');
  const beams = [-.95, 2.35].map(x => {
    const scan = block(room, [x, 1.043, 0], [.047, .022, .955], lit('#91f6e2'), .008, false);
    return scan;
  });
  return { room, colors, strip, referenceBoard, tokens, arm, bots, beams, lamp };
}

function timelineCamera(camera, t, keys) {
  const next = keys.findIndex(([time]) => t < time);
  const index = next < 0 ? keys.length - 1 : Math.max(1, next);
  const [a, start, focusA] = keys[index - 1], [b, end, focusB] = keys[index];
  const p = ease(t, a, b);
  camera.position.copy(vector(start).lerp(vector(end), p));
  camera.lookAt(vector(focusA).lerp(vector(focusB), p));
}

const CAMERAS = {
  queueOpen: [[0, [-2.8, 4.37, 7.4], [.20, 1.17, -.35]],
    [6.30, [-2.03, 3.78, 6.56], [.36, 1.07, -.35]]],
  rework: [[6.30, [-.70, 2.44, 4.63], [.91, 1.17, -.27]],
    [11.03, [.19, 2.58, 4.54], [.65, 1.15, -.38]]],
  flow: [[11.03, [-2.66, 3.57, 6.88], [.18, 1.12, -.33]],
    [15.54, [-.8, 3.18, 6.15], [.53, 1.11, -.38]]],
  knowledge: [[0, [2.06, 2.95, 4.55], [1.08, 1.39, -1.30]],
    [3.75, [2.63, 2.73, 4.52], [1.45, 1.49, -1.60]]],
  collect: [[3.75, [-.96, 2.65, 3.48], [1.41, 1.56, -1.74]],
    [8.3, [-.24, 2.48, 3.05], [1.68, 1.54, -1.67]],
    [10.84, [.84, 2.72, 3.47], [2.31, 1.46, -1.36]]],
  board: [[0, [-1.34, 2.77, 4.4], [1.30, 1.57, -1.48]],
    [5.63, [-.08, 2.52, 3.56], [1.53, 1.65, -1.53]]],
  process: [[5.63, [-1.90, 3.02, 5.04], [.75, 1.08, -.24]],
    [9.74, [-.84, 2.85, 4.75], [1.38, 1.10, -.27]]],
  leave: [[0, [1.78, 3.28, 6.12], [1.77, 1.2, -.26]],
    [4.2, [2.10, 3.02, 5.63], [2.1, 1.14, -.13]],
    [7.06, [2.51, 2.79, 5.08], [3.62, 1.09, .62]]],
  team: [[7.06, [1.08, 2.91, 5.5], [.85, 1.20, -.35]],
    [12.24, [-.39, 3.07, 5.70], [.62, 1.17, -.28]]],
};

function manualQueue(set, t, active) {
  const rework = active ? ease(t, 6.45, 7.12) * (1 - ease(t, 9.95, 10.66)) : 0;
  set.strip.offset.x = -.3 * Math.min(2.1, t);
  for (const [i, token] of set.tokens.entries()) {
    const appear = ease(t, i * .62 - .12, i * .62 + .30);
    const end = .56 - .664 * i;
    const start = Math.max(-5.18, end - 2.2);
    token.holder.visible = appear > .005;
    token.holder.scale.setScalar(Math.max(.08, appear));
    token.holder.position.set(lerp(start, end, ease(t, i * .62 - .25, i * .62 + 2.02)) - (i === 0 ? rework * .46 : 0), .684, 0);
    token.holder.rotation.set(0, .04 * Math.sin(i * 2), (i === 0 ? -.19 * rework : 0));
    token.state(i === 0 && rework > .12 ? 'error' : 'input');
  }
  set.lamp.emissiveIntensity = .35 + (active ? 2.8 * wave(t, 5.0) * ease(t, 2.1, 2.55) : 0);
}

function robotFlow(set, t, learned = false) {
  set.strip.offset.x = -5.3 * t;
  for (const [i, token] of set.tokens.entries()) {
    const x = -5.03 + mod(t * 2.62 + i * 1.68, 10.08);
    const reveal = ease(x, -5.03, -4.65) * (1 - ease(x, 4.68, 5.05));
    token.holder.visible = reveal > .004;
    token.holder.scale.setScalar(Math.max(.02, reveal));
    token.holder.position.set(x, .684, 0);
    token.holder.rotation.set(0, 0, 0);
    token.state(x > -.9 ? learned ? 'effect' : 'output' : 'input');
  }
  set.bots.forEach((actor, i) => {
    const phase = t + i * .32;
    actor.holder.rotation.y = -.12 + i * .10;
    actor.pose(phase, 0, .74 * wave(phase, 3.25), .62);
  });
  const cycle = wave(t, 2.9);
  const arm = set.arm;
  arm.getObjectByName('element-a').rotation.y = .55 + .62 * wave(t, 1.7);
  arm.getObjectByName('element-b').rotation.z = -.50 - .50 * cycle;
  arm.getObjectByName('element-d').rotation.z = -.97 + .33 * cycle;
  arm.getObjectByName('element-f').rotation.z = -.78;
  arm.getObjectByName('claw-a').rotation.z = .15 + .24 * cycle;
  arm.getObjectByName('claw-b').rotation.z = -.15 - .24 * cycle;
  for (const [i, scanner] of set.beams.entries()) scanner.position.y = .905 + .12 * wave(t + .3 * i, 8);
  set.lamp.emissiveIntensity = 1.7 + 1.25 * wave(t, 7);
}

function resetCards(set) {
  for (const { card, x, y } of set.referenceBoard.cards) {
    card.visible = true;
    card.position.set(x, y, .169);
    card.rotation.set(0, 0, 0);
    card.scale.setScalar(1);
  }
}
function collectCards(set, t) {
  const { frame, cards } = set.referenceBoard;
  const hand = frame.worldToLocal(set.editor.hand.getWorldPosition(new T.Vector3()));
  for (const [i, { card, x, y }] of cards.entries()) {
    const start = 8.33 + i * .105;
    const p = ease(t, start, start + .43);
    card.visible = p < .998;
    card.position.set(lerp(x, hand.x, p), lerp(y, hand.y, p) + .21 * Math.sin(p * Math.PI),
      lerp(.169, hand.z, p));
    card.rotation.set(-.38 * p, p * .64, .17 * Math.sin(p * Math.PI));
    card.scale.setScalar(1 - .71 * p);
  }
}
function addEffect(set, t) {
  const { frame, cards } = set.referenceBoard;
  const { card, x, y } = cards[8];
  const p = ease(t, 4.17, 5.19);
  const reach = ease(t, 3.63, 4.17) * (1 - ease(t, 5.07, 5.65));
  const director = set.bots[2];
  director.holder.rotation.y = lerp(.08, -2.72, reach);
  director.pose(t, 0, reach * .88, .66);
  const hand = frame.worldToLocal(director.hand.getWorldPosition(new T.Vector3()));
  card.visible = t >= 4.17;
  card.position.set(lerp(hand.x, x, p), lerp(hand.y, y, p) + .19 * Math.sin(Math.PI * p), lerp(hand.z, .169, p));
  card.rotation.y = -.57 * (1 - p);
  card.scale.setScalar(.55 + .45 * p);
}
function holdCase(set) {
  const hand = set.room.worldToLocal(set.editor.hand.getWorldPosition(new T.Vector3()));
  set.carryCase.position.set(hand.x, hand.y - .42, hand.z + .11);
  set.carryCase.rotation.y = set.editor.holder.rotation.y;
}

function play(scene, camera, renderer, manual, auto) {
  const editor = manual.editor;
  const setEditor = (t, xyz, yaw, walk = 0, reach = 0, contact = .66) => {
    editor.holder.position.set(...xyz);
    editor.holder.rotation.y = yaw;
    editor.pose(t, walk, reach, contact);
  };
  return (mode, seconds) => {
    const t = Math.max(0, Math.min(seconds, (FRAME_COUNTS[mode] - 1) / FPS));
    const automated = mode === 'mural' || mode === 'queue' && t >= 11.03 || mode === 'farewell' && t >= 7.06;
    const activeSet = automated ? auto : manual;
    const colors = activeSet.colors;
    manual.room.visible = !automated;
    auto.room.visible = automated;
    const editorRoom = mode === 'farewell' && automated ? auto.room : manual.room;
    if (editor.holder.parent !== editorRoom) editorRoom.add(editor.holder);
    manual.carryCase.visible = false;
    scene.background.set(colors.ink);
    scene.fog.color.set(colors.ink);
    label.dataset.automation = automated;
    label.textContent = ({ knowledge: 'O conhecimento do editor', mural: 'O novo efeito',
      farewell: automated ? 'Editor com IA' : 'A saída do editor' })[mode] || (automated ? 'Edição com IA' : 'Edição manual');
    resetCards(activeSet);
    if (automated) robotFlow(auto, t, mode === 'mural' && t >= 5.40 || mode === 'farewell');
    else manualQueue(manual, mode === 'queue' ? t : 6, mode === 'queue');
    if (mode === 'queue') {
      if (!automated) setEditor(t, [1.27, .009, -.89], -.36, 0, .48 * wave(t, 2.8), .68);
      timelineCamera(camera, t, automated ? CAMERAS.flow : t < 6.30 ? CAMERAS.queueOpen : CAMERAS.rework);
    } else if (mode === 'knowledge') {
      const approach = ease(t, 5.93, 8.37);
      const leave = ease(t, 9.42, 10.85);
      const walk = Math.max(ease(t, 5.94, 6.33) * (1 - ease(t, 8.02, 8.42)), ease(t, 9.53, 10.12));
      const reach = .77 * ease(t, 8.30, 8.62) * (1 - ease(t, 9.30, 9.56));
      const yaw = lerp(-.39, Math.PI, approach) - 1.68 * leave;
      setEditor(t, [lerp(.88, 1.77, approach) + 1.72 * leave, .01, lerp(-.85, -1.65, approach)], yaw, walk, reach);
      collectCards(manual, t);
      manual.carryCase.visible = t >= 9.41;
      if (manual.carryCase.visible) holdCase(manual);
      timelineCamera(camera, t, t < 3.75 ? CAMERAS.knowledge : CAMERAS.collect);
    } else if (mode === 'mural') {
      addEffect(auto, t);
      timelineCamera(camera, t, t < 5.63 ? CAMERAS.board : CAMERAS.process);
    } else {
      if (!automated) {
        for (const entry of manual.referenceBoard.cards) entry.card.visible = false;
        const depart = ease(t, 3.95, 7.16);
        const walk = ease(t, 3.95, 4.47);
        setEditor(t, [lerp(2.16, 5.50, depart), .01, lerp(1.26, 2.16, depart)],
          lerp(-.17, 1.29, ease(t, 3.59, 4.36)), walk);
        manual.carryCase.visible = true;
        holdCase(manual);
      } else {
        const settle = ease(t, 7.06, 8.23);
        const cue = ease(t, 8.35, 8.69) * (1 - ease(t, 9.48, 9.78));
        setEditor(t, [lerp(3.12, 2.24, settle), .01, 1.57], lerp(-1.61, -3.70, settle), 1 - settle, .70 * cue);
      }
      timelineCamera(camera, t, automated ? CAMERAS.team : CAMERAS.leave);
    }
    renderer.render(scene, camera);
  };
}

async function main() {
  const params = new URLSearchParams(location.search);
  const inputs = window.motionInputs || {};
  const width = Number(params.get('width')) || WIDTH;
  const height = Number(params.get('height')) || HEIGHT;
  await document.fonts.load('650 28px Outfit');
  const assets = await loadAssets(inputs);
  const canvas = document.querySelector('canvas');
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height, false);
  canvas.style.width = WIDTH + 'px';
  canvas.style.height = HEIGHT + 'px';
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;

  const scene = new T.Scene();
  scene.background = new T.Color(COLORS.manual.ink);
  scene.fog = new T.FogExp2(COLORS.manual.ink, .045);
  const camera = new T.PerspectiveCamera(41, WIDTH / HEIGHT, .07, 70);
  scene.add(new T.HemisphereLight('#dce9ff', '#67566c', 1.68));
  const key = new T.DirectionalLight('#ffdfba', 2.35);
  key.position.set(-4.65, 8.5, 5.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  Object.assign(key.shadow.camera, { left: -7.3, right: 7.3, top: 5.8, bottom: -5.8, near: .2, far: 23 });
  key.shadow.bias = -.00036;
  key.shadow.normalBias = .024;
  key.shadow.radius = 2.4;
  scene.add(key);
  const rim = new T.DirectionalLight('#81c9ff', 1.63);
  rim.position.set(4.9, 5, -4.3);
  scene.add(rim);
  const fill = new T.DirectionalLight('#bdd6e5', .35);
  fill.position.set(4.7, 2.2, 6.1);
  scene.add(fill);

  const cards = COLOR_KEYS.map((_, i) => cardArt(i, assets.atlas));
  const stock = {
    shell: material('#665061', .49, .13), outputShell: material('#5b998f', .42, .14),
    ...Object.fromEntries(['input', 'error', 'output', 'effect'].map(name => [name, new T.MeshBasicMaterial({ map: tokenArt(name, assets.atlas) })])),
  };
  const manual = buildRoom(scene, assets, false, cards, stock);
  const auto = buildRoom(scene, assets, true, cards, stock);
  const draw = play(scene, camera, renderer, manual, auto);
  let mode = params.get('shot') || inputs.mode || 'queue';
  window.renderMotion = t => draw(mode, t);
  window.setFactoryMode = value => {
    if (!Object.hasOwn(FRAME_COUNTS, value)) throw Error('Cena desconhecida: ' + value);
    mode = value;
    root.dataset.duration = String(FRAME_COUNTS[mode] / FPS);
    window.renderMotion(0);
    return FRAME_COUNTS[mode];
  };
  window.setFactoryMode(mode);
}

window.motionReady = main().then(() => {
  window.__hfTimelinesBuilding = false;
  window.dispatchEvent(new Event('hf-timelines-built'));
});
