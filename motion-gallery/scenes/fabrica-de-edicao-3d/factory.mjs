import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { addCeramic, addEditor } from './factory-actors.mjs';

const W = 1920, H = 1080, FPS = 30;
const COUNTS = { queue: 466, knowledge: 325, mural: 292, epilogue: 363 };
const MODELS = {
  factory: ['conveyor-long-stripe-sides', 'scanner-high', 'machine-window',
    'machine-connection-hole', 'box-small', 'box-wide', 'warning-traffic',
    'robot-arm-a', 'pipe-large-long', 'pipe-large-curve', 'pipe-large-valve',
    'catwalk-straight', 'catwalk-stairs'],
  furniture: ['pottedPlant'],
};
const FLOOR = ['floor-concrete', 'wall-office-brick', 'desk-walnut'];
const ACCENTS = { manual: '#ffc57e', auto: '#baabf9', output: '#aff5db' };
const root = document.querySelector('main');
const pi = Math.PI;
const clamp = value => Math.max(0, Math.min(1, value));
const ease = (t, a, b) => { const p = clamp((t - a) / (b - a)); return p * p * (3 - 2 * p); };
const lerp = T.MathUtils.lerp;
const vector = array => new T.Vector3(...array);
const stockGeometry = new Map();

function group(parent, x = 0, y = 0, z = 0) {
  const child = new T.Group();
  child.position.set(x, y, z);
  parent.add(child);
  return child;
}

function standard(color, roughness = .64, metalness = .07) {
  return new T.MeshStandardMaterial({ color, roughness, metalness });
}
function lit(color) {
  return new T.MeshBasicMaterial({ color, toneMapped: false });
}
function mesh(parent, geometry, material, xyz, shadow = true) {
  const object = new T.Mesh(geometry, material);
  object.position.set(...xyz);
  object.castShadow = object.receiveShadow = shadow;
  parent.add(object);
  return object;
}
function shape(width, height, depth, radius) {
  const key = [width, height, depth, radius].join('/');
  if (!stockGeometry.has(key)) stockGeometry.set(key, radius
    ? new RoundedBoxGeometry(width, height, depth, 1, radius)
    : new T.BoxGeometry(width, height, depth));
  return stockGeometry.get(key);
}
function block(parent, xyz, size, material, radius = .025, shadow = true) {
  return mesh(parent, shape(...size, radius), material, xyz, shadow);
}
function panel(parent, xyz, dimensions, material) {
  return mesh(parent, new T.PlaneGeometry(...dimensions), material, xyz, false);
}
function cylinder(parent, xyz, radius, height, material, radialSegments = 16) {
  return mesh(parent, new T.CylinderGeometry(radius, radius, height, radialSegments), material, xyz);
}
function rod(parent, a, b, radius, material) {
  const first = vector(a), last = vector(b);
  const mid = first.clone().lerp(last, .5);
  const tube = cylinder(parent, mid.toArray(), radius, first.distanceTo(last), material, 8);
  tube.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), last.sub(first).normalize());
  return tube;
}
function instances(parent, geometry, material, positions, shadows = false) {
  const items = new T.InstancedMesh(geometry, material, positions.length);
  const matrix = new T.Matrix4();
  positions.forEach(([x, y, z], i) => {
    items.setMatrixAt(i, matrix.makeTranslation(x, y, z));
  });
  items.castShadow = items.receiveShadow = shadows;
  parent.add(items);
  return items;
}
function canvasMap(width, height, paint) {
  const image = document.createElement('canvas');
  image.width = width; image.height = height;
  const ctx = image.getContext('2d');
  const map = new T.CanvasTexture(image);
  map.colorSpace = T.SRGBColorSpace;
  map.anisotropy = 8;
  if (paint) paint(ctx, width, height);
  return { map, ctx, width, height };
}
function flatMap(map) {
  return new T.MeshBasicMaterial({ map, toneMapped: false });
}

async function loadAssets(inputs) {
  const gltf = new GLTFLoader();
  const textureLoader = new T.TextureLoader();
  const models = Object.entries(MODELS).flatMap(([pack, names]) => names.map(async name =>
    [name, (await gltf.loadAsync('assets/' + pack + '/' + name + '.glb')).scene]));
  const surfaces = FLOOR.map(async name => {
    const [color, normal] = await Promise.all(['color', 'normal'].map(channel =>
      textureLoader.loadAsync('assets/surfaces/' + name + '/' + channel + '.jpg')));
    color.colorSpace = T.SRGBColorSpace;
    for (const map of [color, normal]) {
      map.anisotropy = 8;
      map.wrapS = map.wrapT = T.RepeatWrapping;
    }
    return [name, { color, normal }];
  });
  const [loaded, maps, human, clip, atlas] = await Promise.all([
    Promise.all(models), Promise.all(surfaces),
    gltf.loadAsync('assets/rocketbox/male-adult-20/male-adult-20.gltf'),
    gltf.loadAsync('assets/rocketbox/m-sit-work/m-sit-work.gltf'),
    inputs.atlas ? new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(Error('Não foi possível carregar o atlas de referências.'));
      image.src = inputs.atlas;
    }) : null,
  ]);
  return { models: Object.fromEntries(loaded), surfaces: Object.fromEntries(maps),
    human: human.scene, clip: clip.animations[0], atlas };
}
function place(assets, name, parent, xyz, scale = 1, yaw = 0, tint = '#ffffff') {
  const object = assets.models[name].clone();
  object.position.set(...xyz);
  object.scale.setScalar(scale);
  object.rotation.y = yaw;
  object.traverse(child => {
    if (!child.isMesh) return;
    const tintOne = material => {
      const coat = material.clone();
      if (!coat.transparent) {
        coat.color.multiply(new T.Color(tint));
        coat.metalness = .10;
        coat.roughness = .58;
      }
      return coat;
    };
    child.material = Array.isArray(child.material) ? child.material.map(tintOne) : tintOne(child.material);
    child.castShadow = child.receiveShadow = true;
  });
  parent.add(object);
  return object;
}
function surface(assets, key, color, repeat, strength, roughness) {
  const maps = assets.surfaces[key];
  const map = maps.color.clone(), normalMap = maps.normal.clone();
  for (const image of [map, normalMap]) { image.repeat.set(...repeat); image.needsUpdate = true; }
  return new T.MeshStandardMaterial({ color, map, normalMap,
    normalScale: new T.Vector2(strength, strength), roughness, metalness: .04 });
}

const steel = standard('#424a59', .47, .44);
const paleSteel = standard('#727686', .42, .46);
const iron = standard('#222b37', .59, .46);
const pewter = standard('#818b95', .52, .51);
const black = standard('#19202a', .56, .28);
const fabric = standard('#333448', .87, .0);
const amber = lit(ACCENTS.manual), violet = lit(ACCENTS.auto), mint = lit(ACCENTS.output);

function warningStrip() {
  return canvasMap(128, 48, (c, w, h) => {
    c.fillStyle = '#322c27'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f2bc63';
    for (let i = -1; i < 4; i++) {
      c.beginPath();
      c.moveTo(i * 48, 0); c.lineTo(i * 48 + 22, 0);
      c.lineTo(i * 48 + 50, h); c.lineTo(i * 48 + 28, h); c.closePath(); c.fill();
    }
  }).map;
}

function sign(parent, xy, width, height, title, subtitle, accent, index) {
  block(parent, [...xy, -3.85], [.42, .20, .57], iron, .018);
  const back = block(parent, [...xy, -3.55], [width + .06, height + .06, .12], steel, .035);
  const { map } = canvasMap(768, 220, (c, w, h) => {
    c.fillStyle = '#202531'; c.fillRect(0, 0, w, h);
    c.fillStyle = accent; c.fillRect(0, 0, 8, h);
    c.font = '600 28px Outfit, sans-serif';
    c.fillText('ESTAÇÃO  ' + index, 40, 49);
    c.font = '680 68px Outfit, sans-serif';
    c.fillStyle = '#f5f5ee'; c.fillText(title, 40, 131);
    c.font = '500 28px Outfit, sans-serif';
    c.fillStyle = '#c5c8d0'; c.fillText(subtitle, 42, 181);
  });
  const face = panel(parent, [...xy, -3.486], [width, height], flatMap(map));
  face.name = title;
  return back;
}

function architecture(scene, assets) {
  const stage = group(scene);
  const floor = panel(stage, [0, 0, -.18], [27.2, 13.3],
    surface(assets, 'floor-concrete', '#8e959a', [11, 6], .21, .74));
  floor.rotation.x = -pi / 2; floor.receiveShadow = true;
  block(stage, [0, -.155, -.18], [27.2, .30, 13.3], iron, .05);
  const wallSurface = surface(assets, 'wall-office-brick', '#8e8a95', [10, 2], .19, .82);
  const wall = panel(stage, [0, 2.63, -4.38], [27.2, 5.26], wallSurface);
  wall.receiveShadow = true;
  block(stage, [0, .51, -4.31], [27.2, 1.02, .12], black, .03);
  block(stage, [0, 1.03, -4.22], [27.2, .07, .055], paleSteel, .012);
  block(stage, [0, 4.92, -4.18], [27.2, .30, .37], iron, .018);
  block(stage, [0, 3.37, -4.19], [27.2, .13, .20], iron, .016);

  const sky = new T.MeshStandardMaterial({ color: '#b6c9df', emissive: '#a8c3dd',
    emissiveIntensity: .39, roughness: .31, metalness: .20 });
  const stripe = warningStrip();
  stripe.wrapS = T.RepeatWrapping;
  stripe.repeat.x = 2;
  const taped = flatMap(stripe);
  for (let i = 0; i < 10; i++) {
    const x = -12.15 + i * 2.7;
    block(stage, [x, 4.12, -4.20], [2.40, 1.11, .14], iron, .027);
    block(stage, [x, 4.12, -4.115], [2.23, .92, .042], sky, .019, false);
    block(stage, [x, 4.14, -4.073], [2.21, .034, .040], steel, .004, false);
    for (const dx of [-.56, 0, .56]) {
      block(stage, [x + dx, 4.12, -4.068], [.037, .93, .06], steel, .005, false);
    }
    block(stage, [x + 1.3, 2.44, -4.11], [.14, 4.88, .43], iron, .016);
    block(stage, [x + 1.3, 2.45, -3.88], [.25, 4.90, .050], steel, .013);
    block(stage, [x, 4.91, -.08], [.19, .23, 8.40], steel, .018);
    rod(stage, [x - .18, 4.59, -3.71], [x + .92, 4.79, -2.25], .027, paleSteel);
    block(stage, [x, 4.58, -1.67], [1.36, .109, .28], iron, .027);
    block(stage, [x, 4.50, -1.67], [1.20, .026, .19], lit('#f8e8d9'), .021, false);
  }
  for (const x of [-12.9, -.36, 12.5]) {
    const side = x < -1 ? 3.10 : x > 1 ? 3.12 : 2.61;
    block(stage, [x, 2.41, side], [.28, 4.82, .36], iron, .023);
    block(stage, [x, .05, side], [.62, .10, .60], steel, .04);
    const sticker = panel(stage, [x, .75, side + .184], [.23, .42], taped);
    sticker.material = taped;
  }
  for (const y of [2.86, 3.07]) {
    rod(stage, [-12.9, y, -3.84], [12.7, y, -3.84], .042, pewter);
    for (let i = 0; i < 11; i++) {
      block(stage, [-12.5 + i * 2.51, y, -3.84], [.064, .12, .095], black, .012, false);
    }
  }

  const yellow = standard('#c49151', .57, .22);
  const lane = panel(stage, [0, .006, 2.98], [25.6, .045], new T.MeshBasicMaterial({ color: '#e7d7a6', toneMapped: false }));
  lane.rotation.x = -pi / 2;
  const bars = Array.from({ length: 44 }, (_, i) => [-12.48 + i * .58, .010, 3.21]);
  instances(stage, shape(.31, .012, .033, 0), yellow, bars);
  const shallow = panel(stage, [-.34, .009, 2.63], [.49, .49], taped);
  shallow.rotation.x = -pi / 2;

  for (const x of [-10.7, -8.3, 1.1]) {
    place(assets, 'pipe-large-long', stage, [x, 3.31, -3.60], .68, 0, '#bcc3cc');
    place(assets, 'pipe-large-curve', stage, [x + .96, 3.31, -3.60], .68, 0, '#bcc3cc');
  }
  place(assets, 'pipe-large-valve', stage, [-2.85, 2.03, -3.55], .71, pi / 2, '#dfcdb6');
  for (const x of [-11.55, -10.56, 9.93, 10.92, 11.91]) {
    place(assets, 'catwalk-straight', stage, [x, 2.26, -3.24], 1, pi / 2);
  }
  place(assets, 'catwalk-stairs', stage, [11.65, .035, -2.42], 1.02, -.04, '#c7c8d5');
  sign(stage, [-8.52, 2.45], 3.01, .86, 'EDIÇÃO MANUAL', 'Revisão e exportação', ACCENTS.manual, '01');
  sign(stage, [1.84, 2.45], 2.78, .80, 'EDIÇÃO COM IA', 'Processamento em equipe', ACCENTS.auto, '02');
  return stage;
}

function cellImage(ctx, atlas, index, x, y, w, h) {
  if (atlas) {
    const sourceW = atlas.width / 3, sourceH = atlas.height / 3;
    const expected = w / h;
    const clipW = Math.min(sourceW, sourceH * expected), clipH = clipW / expected;
    ctx.drawImage(atlas, index % 3 * sourceW + (sourceW - clipW) / 2,
      Math.floor(index / 3) * sourceH + (sourceH - clipH) / 2, clipW, clipH, x, y, w, h);
    return;
  }
  const colors = ['#332f55', '#305047', '#6d3b39', '#2b4c6e', '#513748', '#194c51'];
  const color = colors[index % colors.length];
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, color); gradient.addColorStop(1, '#202231');
  ctx.fillStyle = gradient; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#d2e4e5'; ctx.lineWidth = Math.max(1, w / 125);
  for (let i = 0; i < 4; i++) {
    const dx = w * (.13 + i * .07), dy = h * (.13 + i * .072);
    ctx.strokeRect(x + dx, y + dy, w - 2 * dx, h - 2 * dy);
  }
}
function archiveScreen(c, w, h, atlas, view, tick) {
  const reviewing = view === 'review';
  c.fillStyle = '#161c2a'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#232d40'; c.fillRect(0, 0, w, 35);
  c.fillStyle = '#f0e9de'; c.font = '650 17px Outfit, sans-serif';
  c.fillText(reviewing ? 'Novo projeto' : 'Referências da estação', 15, 24);
  c.fillStyle = '#7f8caa'; c.font = '570 12px Outfit, sans-serif';
  c.fillText(reviewing ? 'REVISAR REFERÊNCIAS' : 'BIBLIOTECA LOCAL', 16, 58);
  const active = reviewing ? Math.max(0, tick - 168) : Math.max(0, tick - 71);
  for (let i = 0; i < 6; i++) {
    const x = 16 + (i % 3) * 165, y = 71 + Math.floor(i / 3) * 92;
    cellImage(c, atlas, i, x, y, 151, 84.9375);
    if (reviewing && i > Math.floor(active / 11)) {
      c.fillStyle = '#101627bb';
      c.fillRect(x, y, 151, 84.9375);
    } else if (i === Math.min(5, Math.floor(active / 11))) {
      c.lineWidth = 2;
      c.strokeStyle = reviewing ? '#dab686' : '#c4b8f8';
      c.strokeRect(x + 1, y + 1, 149, 82.9375);
    }
  }
  c.fillStyle = '#313b50'; c.fillRect(15, 265, 480, 8);
  c.fillStyle = reviewing ? '#e8ba87' : '#a9e3cc';
  c.fillRect(15, 265, 480 * Math.min(1, (active + 2) / 53), 8);
}

function screen(parent, xyz, width, atlas, index, yaw = 0) {
  const item = group(parent, ...xyz);
  item.rotation.y = yaw;
  const h = width * 9 / 16;
  block(item, [0, h / 2 + .13, 0], [width + .034, h + .031, .055], black, .023);
  block(item, [0, .101, -.022], [.067, .184, .067], paleSteel, .015);
  block(item, [0, .02, -.024], [.22, .030, .146], black, .016);
  const paint = canvasMap(512, 288);
  panel(item, [0, h / 2 + .13, .029], [width, h], flatMap(paint.map));
  block(item, [width * .43, .118, .03], [.012, .005, .003], mint, .001, false);
  let last;
  return (t, view = 'edit') => {
    const tick = Math.floor(t * 20);
    const stamp = tick + '/' + view;
    if (stamp === last) return;
    last = stamp;
    const { ctx: c, width: w, height: hh, map } = paint;
    if (view !== 'edit') {
      archiveScreen(c, w, hh, atlas, view, tick);
      map.needsUpdate = true;
      return;
    }
    c.fillStyle = '#121826'; c.fillRect(0, 0, w, hh);
    c.fillStyle = '#222e42'; c.fillRect(0, 0, w, 27);
    c.fillStyle = '#e9edf3'; c.font = '650 13px Outfit, sans-serif';
    c.fillText(index === 0 ? 'Montagem principal' : ['Decupagem', 'Legendas', 'Prévia final'][index - 1], 12, 18);
    cellImage(c, atlas, index === 0 ? 0 : index + 3, 14, 39, 233, 131.0625);
    c.fillStyle = '#273347'; c.fillRect(265, 39, 233, 131);
    c.fillStyle = '#bfc6da'; c.font = '600 11px Outfit, sans-serif'; c.fillText('PREVIEW · 1920×1080', 278, 58);
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i % 2 ? '#43506b' : '#5e6981';
      c.fillRect(278, 74 + i * 16, 146 - 13 * i, 5);
    }
    c.fillStyle = '#293447'; c.fillRect(10, 181, 492, 96);
    for (let j = 0; j < 3; j++) for (let k = 0; k < 7; k++) {
      const x = 24 + k * 63 + ((j + k * 7) % 8);
      c.fillStyle = ['#655ba5', '#459887', '#b6766f'][(j + index) % 3];
      c.fillRect(x, 195 + j * 24, 56 - (k * 3) % 11, 14);
      c.fillStyle = '#f0f6e53b'; c.fillRect(x + 3, 199 + j * 24, 26 - k, 3);
    }
    c.fillStyle = '#f2eee1';
    c.fillRect(26 + (tick * (index ? 3 : 2)) % 453, 183, 2, 88);
    map.needsUpdate = true;
  };
}

function chair(parent, robot) {
  const chair = group(parent);
  const height = robot ? .495 : .468;
  const seat = block(chair, [0, height - .028, -.026], [.505, .068, .45], fabric, .047);
  block(chair, [0, height + .164, -.236], [.482, .298, .067], fabric, .045).rotation.x = -.10;
  rod(chair, [0, .095, -.042], [0, height - .045, -.042], .037, pewter);
  for (let i = 0; i < 5; i++) {
    const theta = i * (2 * pi / 5);
    const tip = [Math.sin(theta) * .255, .047, -.042 + Math.cos(theta) * .255];
    rod(chair, [0, .085, -.042], tip, .025, steel);
    cylinder(chair, [tip[0], .032, tip[2]], .037, .048, black).rotation.x = pi / 2;
  }
  for (const x of [-.247, .247]) {
    rod(chair, [x, height - .04, -.11], [x, height + .18, -.16], .018, steel);
    block(chair, [x, height + .18, -.113], [.062, .032, .18], fabric, .013);
  }
  return seat;
}

function desk(parent, assets, xyz, yaw, index, robot = false) {
  const seat = group(parent, ...xyz);
  seat.rotation.y = yaw;
  const deskSurface = surface(assets, 'desk-walnut', robot ? '#bfc4dd' : '#d1bb9d', [1.25, .83], .18, .51);
  block(seat, [0, .735, .723], [1.74, .061, .90], deskSurface, .024);
  block(seat, [0, .684, 1.113], [1.65, .06, .049], steel, .012);
  block(seat, [0, .665, .65], [1.64, .043, .025], black, .008);
  for (const x of [-.785, .785]) {
    for (const z of [.34, 1.12]) {
      block(seat, [x, .346, z], [.049, .696, .049], steel, .009);
      block(seat, [x, .019, z], [.096, .031, .082], black, .010);
    }
    block(seat, [x, .16, .73], [.044, .056, .81], iron, .011);
    block(seat, [x, .70, .70], [.052, .046, .83], iron, .008);
  }
  chair(seat, robot);
  const monitor = robot
    ? screen(seat, [.434, .768, .902], .58, assets.atlas, index, pi - .35)
    : screen(seat, [.125, .768, .904], .72, assets.atlas, index, pi - .07);
  const second = robot ? null : screen(seat, [-.473, .764, .949], .395, assets.atlas, 2, pi + .27);
  block(seat, [0, .771, .435], [.473, .018, .187], black, .011);
  const keys = [];
  for (let y = 0; y < 5; y++) for (let x = 0; x < 13; x++) {
    keys.push([(x - 6) * .0325 + (y % 2) * .005, .784, .368 + y * .030]);
  }
  instances(seat, shape(.027, .011, .022, .002), robot ? paleSteel : standard('#c3bdad'), keys);
  block(seat, [-.352, .767, .516], [.190, .008, .201], fabric, .013, false);
  block(seat, [-.326, .796, .507], [.092, .058, .123], black, .027);
  block(seat, [-.325, .824, .527], [.006, .007, .030], robot ? violet : amber, .001, false);
  const consoleBody = block(seat, [.722, .794, .555], [.190, .056, .212], iron, .018);
  consoleBody.rotation.y = .10;
  for (let i = 0; i < 4; i++) block(seat, [.667 + i * .034, .824, .534], [.018, .010, .021],
    i === 1 ? mint : robot ? violet : amber, .003, false);
  const cup = cylinder(seat, [.677, .813, .962], .047, .091, standard(robot ? '#b6a7df' : '#b56b4e'));
  cylinder(seat, [cup.position.x, .86, cup.position.z], .035, .005, black);
  rod(seat, [.13, 1.0, 1.055], [.13, .660, 1.099], .009, black);
  rod(seat, [.13, .660, 1.099], [.74, .64, 1.099], .009, black);
  return { seat, play(t, view) { monitor(t, view); if (second) second(t + 1); } };
}

function shelves(stage, assets, x, shade) {
  const rack = group(stage, x, 0, -3.56);
  for (const y of [.17, .78, 1.38, 1.99]) block(rack, [0, y, 0], [1.56, .072, .54], steel);
  for (const dx of [-.75, .75]) for (const z of [-.24, .24]) {
    block(rack, [dx, 1.04, z], [.065, 2.10, .068], iron, .007);
  }
  rod(rack, [-.71, .23, -.25], [.72, 1.95, -.25], .015, pewter);
  for (let i = 0; i < 7; i++) {
    const y = i < 3 ? .22 : i < 5 ? .83 : 1.43;
    place(assets, 'box-small', rack, [-.53 + (i % 3) * .51, y, -.047], .75, (i % 3 - 1) * .08, shade);
    block(rack, [-.53 + (i % 3) * .51, y + .17, .143], [.17, .056, .007], lit('#ead8b1'), .003, false);
  }
}

function belt(stage, assets, origin, automatic) {
  const assembly = group(stage, origin, 0, 1.46);
  const accent = automatic ? violet : amber;
  const trim = standard(automatic ? '#697186' : '#79634e', .5, .46);
  for (let i = -2; i <= 2; i++) {
    place(assets, 'conveyor-long-stripe-sides', assembly, [i * 2, .35, 0], 1, 0,
      automatic ? '#c2d4e9' : '#f0d1b8');
    block(assembly, [i * 2, .18, 0], [.62, .36, .87], steel, .036);
    for (const z of [-.42, .42]) block(assembly, [i * 2, .035, z], [.83, .065, .23], iron, .025);
  }
  for (const z of [-.56, .56]) {
    block(assembly, [0, .573, z], [10.05, .081, .08], paleSteel, .012);
    block(assembly, [0, .505, z], [10.03, .027, .07], trim, .009);
  }
  block(assembly, [0, .54, .607], [9.97, .018, .007], accent, 0, false);
  const nuts = Array.from({ length: 43 }, (_, i) => [-4.86 + i * .231, .576, .605]);
  const bolt = new T.CylinderGeometry(.019, .019, .012, 6);
  bolt.rotateX(pi / 2);
  instances(assembly, bolt, pewter, nuts);
  const roller = new T.CylinderGeometry(.0305, .0305, .766, 12);
  roller.rotateX(pi / 2);
  instances(assembly, roller, standard('#464d5f', .44, .35),
    Array.from({ length: 75 }, (_, i) => [-4.86 + i * .131, .737, 0]));
  const beltMap = canvasMap(64, 96, (c, w, h) => {
    c.fillStyle = '#343946'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#4f5966'; c.fillRect(0, 0, 12, h);
    c.fillStyle = '#222935'; c.fillRect(42, 0, 2, h);
  }).map;
  beltMap.wrapS = T.RepeatWrapping;
  beltMap.repeat.x = 69;
  const center = panel(assembly, [0, .773, 0], [9.85, .53],
    new T.MeshStandardMaterial({ map: beltMap, roughness: .76, metalness: .1 }));
  center.rotation.x = -pi / 2; center.receiveShadow = true;
  for (const x of [-5.02, 5.02]) {
    block(assembly, [x, .392, 0], [.132, .65, 1.20], trim, .036);
    block(assembly, [x, .726, 0], [.143, .049, .65], steel, .02);
  }
  place(assets, 'machine-connection-hole', assembly, [4.70, .01, -.12], .87, -.06,
    automatic ? '#b5d2dd' : '#ebceb1');
  return { assembly, beltMap };
}

function tileArt(state, atlas) {
  return canvasMap(320, 200, (c, w, h) => {
    const done = state === 'done' || state === 'new';
    const high = done ? '#b9f3dd' : '#fad098';
    c.fillStyle = done ? '#1f343e' : '#302a34'; c.fillRect(0, 0, w, h);
    c.lineWidth = 2; c.strokeStyle = high; c.strokeRect(10, 10, w - 20, h - 20);
    c.fillStyle = high;
    for (let i = 0; i < 10; i++) {
      c.fillRect(20 + i * 29, 17, 14, 6); c.fillRect(20 + i * 29, h - 22, 14, 6);
    }
    c.beginPath();
    if (done) {
      const off = state === 'new' ? 72 : 0;
      if (state === 'new') cellImage(c, atlas, 8, 32, 49, 145, 81.5625);
      c.moveTo(117 + off, 101); c.lineTo(148 + off, 127); c.lineTo(202 + off * .79, 74);
      c.lineWidth = 10; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    } else if (state === 'error') {
      c.moveTo(160, 55); c.lineTo(213, 138); c.lineTo(105, 138); c.closePath(); c.fill();
      c.fillStyle = '#2e2732'; c.fillRect(156, 84, 8, 24); c.fillRect(156, 117, 8, 8);
    } else {
      c.moveTo(135, 62); c.lineTo(196, 100); c.lineTo(135, 138); c.closePath(); c.fill();
    }
  }).map;
}
function tile(parent, media) {
  const holder = group(parent);
  const body = block(holder, [0, .189, 0], [.572, .378, .146], steel, .025);
  const face = panel(holder, [0, .194, .075], [.530, .33125], media.input);
  const back = panel(holder, [0, .194, -.075], [.530, .33125], media.input);
  back.rotation.y = pi;
  return {
    holder,
    update(x, reveal, state, tilt = 0) {
      holder.position.set(x, .775, 0);
      holder.visible = reveal > .005;
      holder.scale.setScalar(Math.max(.02, reveal));
      holder.rotation.z = tilt;
      body.material = state === 'done' || state === 'new' ? media.goodShell : media.badShell;
      face.material = back.material = media[state];
    },
  };
}

const MURAL_NAMES = ['Órbita', 'Colagem', 'Contracampo', 'Máscara', 'Vidro', 'Três cortes', 'Agentes', 'Dobra', 'Tesla'];
function galleryWall(stage, atlas) {
  const wall = group(stage, 6.19, 2.39, -3.70);
  block(wall, [0, 0, 0], [4.51, 3.22, .19], steel, .056);
  block(wall, [0, -.014, .105], [4.33, 3.05, .025], black, .041);
  block(wall, [0, 1.441, .143], [4.13, .017, .012], violet, .006, false);
  const head = canvasMap(1100, 150, (c, w, h) => {
    c.fillStyle = '#211f2c'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#c2b6f8'; c.fillRect(27, 28, 7, 91);
    c.fillStyle = '#f7f3f5'; c.font = '670 61px Outfit, sans-serif'; c.fillText('Mural de efeitos', 51, 82);
    c.fillStyle = '#bfbad0'; c.font = '500 28px Outfit, sans-serif'; c.fillText('BIBLIOTECA DA EQUIPE', 54, 123);
  });
  panel(wall, [0, 1.228, .129], [4.13, .37], flatMap(head.map));
  const w = 1.22, h = w * 9 / 16;
  const cards = MURAL_NAMES.map((name, i) => {
    const x = (i % 3 - 1) * 1.36, y = .598 - Math.floor(i / 3) * .788;
    block(wall, [x, y, .129], [w + .049, h + .041, .024], steel, .018, false);
    const holder = group(wall, x, y, .151);
    const card = canvasMap(640, 360, (c, width, height) => cellImage(c, atlas, i, 0, 0, width, height));
    const preview = panel(holder, [0, 0, .0], [w, h], flatMap(card.map));
    preview.name = name;
    const status = block(holder, [w / 2 - .055, h / 2 - .049, .012], [.033, .019, .013], mint, .003, false);
    status.visible = false;
    return { holder, status };
  });
  const frame = new T.MeshBasicMaterial({ color: '#b5eed9', transparent: true, opacity: 0, toneMapped: false });
  for (const y of [-.359, .359]) block(cards[8].holder, [0, y, .017], [1.267, .012, .007], frame, 0, false);
  for (const x of [-.635, .635]) block(cards[8].holder, [x, 0, .017], [.013, .73, .007], frame, 0, false);
  return {
    wall,
    draw(t, reveal) {
      cards[8].holder.visible = !reveal || t >= 4.17;
      const p = ease(t, 4.17, 4.46);
      cards[8].status.visible = reveal && p > .96;
      frame.opacity = reveal ? p * (1 - ease(t, 5.12, 6.04)) : 0;
    },
  };
}

function room(stage, assets, automatic, materials) {
  const origin = automatic ? 6.17 : -6.25;
  const line = belt(stage, assets, origin, automatic);
  const cards = Array.from({ length: automatic ? 7 : 8 }, () => tile(line.assembly, materials));
  const tint = automatic ? '#bed2e0' : '#e1bd9b';
  for (const [i, x] of [origin - 4.98, origin - 4.28, origin + 4.85].entries()) {
    place(assets, i === 2 ? 'box-wide' : 'box-small', stage, [x, .019, .38], .90 + .1 * i, .1 * i, tint);
  }
  place(assets, 'pottedPlant', stage, [origin + 5.18, .019, -1.96], 1.48, .62);
  place(assets, 'machine-window', stage, [origin - 5.26, .011, -1.25], 1.19, .25, tint);
  shelves(stage, assets, origin - 4.2, tint);
  shelves(stage, assets, origin + 4.70, tint);
  const indicator = place(assets, 'warning-traffic', stage, [origin + (automatic ? 4.45 : 1.7), .01, 2.20], .68, 0, tint);
  const light = new T.MeshStandardMaterial({ color: automatic ? ACCENTS.output : '#ffa56d',
    emissive: automatic ? ACCENTS.output : '#ff974f', emissiveIntensity: .4 });
  block(stage, [indicator.position.x, 1.055, 2.24], [.096, .057, .082], light, .019, false);
  if (!automatic) return { ...line, cards, light };

  const scanners = [-.44, 2.53].map(x => {
    place(assets, 'scanner-high', line.assembly, [x, .30, 0], .93, 0, '#ddd7ff');
    const sweep = block(line.assembly, [x, 1.28, 0], [.022, .014, .97], mint, .001, false);
    return sweep;
  });
  const arm = place(assets, 'robot-arm-a', stage, [origin - 2.58, .019, .52], .73, -.4, '#d9d5ed');
  return { ...line, cards, light, scanners, arm };
}

function scan(t, line, learned = false) {
  line.beltMap.offset.x = -t * 5.9;
  line.cards.forEach((card, i) => {
    const x = -5.08 + ((t * 2.68 + i * 1.455) % 10.17);
    const shown = ease(x, -5.08, -4.77) * (1 - ease(x, 4.56, 4.92));
    card.update(x, shown, x >= -.47 ? learned ? 'new' : 'done' : 'input');
  });
  line.scanners.forEach((bar, i) => { bar.position.y = 1.02 + .28 * (.5 + .5 * Math.sin(t * 7.4 + i)); });
  line.light.emissiveIntensity = 1.7 + .6 * Math.sin(t * 7);
  const q = .5 + .5 * Math.sin(t * 2.55);
  line.arm.getObjectByName('element-a').rotation.y = .81 - .55 * q;
  line.arm.getObjectByName('element-b').rotation.z = -1.09 + .36 * q;
  line.arm.getObjectByName('element-d').rotation.z = -.89 - .29 * q;
  line.arm.getObjectByName('element-f').rotation.z = -.66;
  line.arm.getObjectByName('claw-a').rotation.z = .07 + .20 * q;
  line.arm.getObjectByName('claw-b').rotation.z = -.07 - .20 * q;
}
function jam(t, line) {
  const reverse = ease(t, 6.47, 7.12) * (1 - ease(t, 9.63, 10.53));
  line.beltMap.offset.x = -.46 * Math.min(t, 2.1) + .14 * reverse;
  line.cards.forEach((card, i) => {
    const elapsed = t - i * .52 + .35;
    const cap = 1.11 - i * .627 - .48 * reverse;
    const walk = -4.93 + elapsed * 1.98;
    const brake = clamp((walk - cap + .35) / .35);
    const stop = cap - .35 + .35 * (brake + brake * brake - brake * brake * brake);
    const x = walk < cap - .35 ? walk : stop;
    const show = ease(x, -5.03, -4.69) * ease(elapsed, -.04, .25);
    card.update(x, show, i === 0 && reverse > .25 ? 'error' : 'input', i === 0 ? -.14 * reverse : 0);
  });
  line.light.emissiveIntensity = .46 + 2.2 * ease(t, 2.1, 2.60) * (.5 + .5 * Math.sin(t * 4.7));
  return reverse;
}

const QUEUE_CAMERA = [
  [0, [-11.45, 2.86, 5.02], [-8.20, 1.24, -.53], 45],
  [2.75, [-10.06, 2.56, 4.67], [-7.20, 1.15, -.66], 43],
  [5.30, [-8.28, 2.20, 3.81], [-6.88, .98, -.72], 39],
  [7.92, [-6.65, 2.17, 3.70], [-6.27, .98, -.68], 39],
  [9.84, [-4.07, 2.42, 4.14], [-4.35, 1.19, -.42], 43],
  [11.00, [-.51, 2.52, 4.51], [-.17, 1.25, -.72], 44],
  [12.48, [2.77, 2.47, 4.64], [4.36, 1.13, -.92], 44],
  [15.5, [6.38, 2.97, 5.72], [5.86, 1.18, -.64], 46],
];
const KNOWLEDGE_CAMERA = [
  [0, [-8.94, 2.07, 1.36], [-6.68, .96, -.51], 43],
  [2.65, [-8.37, 1.96, .92], [-6.54, .98, -.56], 42],
  [5.12, [-7.84, 1.80, .73], [-6.25, 1.045, -.64], 38],
  [8.31, [-7.89, 1.71, .58], [-6.27, 1.045, -.64], 39],
  [10.81, [-8.05, 1.91, .88], [-6.38, .99, -.61], 42],
];
const MURAL_CAMERA = [
  [0, [5.73, 2.82, 2.60], [6.06, 2.29, -3.70], 46],
  [3.72, [6.07, 2.69, 1.56], [6.13, 2.25, -3.70], 44],
  [6.15, [6.22, 2.56, 1.07], [6.19, 2.23, -3.70], 44],
  [9.70, [6.35, 2.60, 1.43], [6.25, 2.24, -3.70], 44],
];
const EPILOGUE_CAMERA = [
  [0, [2.55, 3.28, 5.83], [5.14, 1.34, -.86], 47],
  [4.33, [4.88, 2.77, 5.29], [6.45, 1.22, -.88], 45],
  [7.57, [7.45, 2.32, 4.90], [7.42, 1.19, -1.06], 45],
  [12.07, [8.89, 2.55, 5.59], [7.68, 1.13, -.79], 46],
];
const CAMERAS = { queue: QUEUE_CAMERA, knowledge: KNOWLEDGE_CAMERA, mural: MURAL_CAMERA, epilogue: EPILOGUE_CAMERA };

function trajectory(keys, slot, t) {
  const after = keys.findIndex(key => key[0] > t);
  if (after === -1) return vector(keys.at(-1)[slot]);
  const i = Math.max(1, after);
  const [before, a, b, following] = [keys[Math.max(0, i - 2)], keys[i - 1], keys[i],
    keys[Math.min(keys.length - 1, i + 1)]];
  const d = b[0] - a[0];
  const u = clamp((t - a[0]) / d), u2 = u * u, u3 = u2 * u;
  const tangentA = vector(b[slot]).sub(vector(before[slot])).multiplyScalar(d / (b[0] - before[0]));
  const tangentB = vector(following[slot]).sub(vector(a[slot])).multiplyScalar(d / (following[0] - a[0]));
  return vector(a[slot]).multiplyScalar(2 * u3 - 3 * u2 + 1)
    .addScaledVector(tangentA, u3 - 2 * u2 + u)
    .addScaledVector(vector(b[slot]), -2 * u3 + 3 * u2)
    .addScaledVector(tangentB, u3 - u2);
}
function cameraAt(camera, mode, t) {
  const keys = CAMERAS[mode];
  camera.position.copy(trajectory(keys, 1, t));
  camera.lookAt(trajectory(keys, 2, t));
  const i = keys.findIndex(key => t < key[0]);
  camera.fov = i > 0 ? lerp(keys[i - 1][3], keys[i][3], ease(t, keys[i - 1][0], keys[i][0])) : keys.at(-1)[3];
  camera.updateProjectionMatrix();
}

async function main() {
  const inputs = window.motionInputs || {};
  const params = new URLSearchParams(location.search);
  await document.fonts.load('650 28px Outfit');
  const assets = await loadAssets(inputs);
  const canvas = document.querySelector('canvas');
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;

  const scene = new T.Scene();
  scene.background = new T.Color('#222935');
  scene.fog = new T.FogExp2('#222935', .024);
  const env = new RoomEnvironment();
  const envBuilder = new T.PMREMGenerator(renderer);
  const environment = envBuilder.fromScene(env, .052, .1, 38, { size: 128 });
  scene.environment = environment.texture;
  scene.environmentIntensity = .52;
  env.dispose(); envBuilder.dispose();
  const camera = new T.PerspectiveCamera(45, W / H, .07, 60);
  scene.add(new T.HemisphereLight('#d6e3ff', '#5b4758', .89));
  const key = new T.DirectionalLight('#ffe3bf', 1.72);
  key.position.set(-5.5, 10.6, 8.0);
  key.target.position.set(0, .13, -.63);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -14.7, right: 14.7, top: 8.3, bottom: -8.3, near: .1, far: 31 });
  key.shadow.bias = -.00030; key.shadow.normalBias = .020; key.shadow.radius = 2.3;
  scene.add(key, key.target);
  const fill = new T.DirectionalLight('#b7cfff', 1.07);
  fill.position.set(7.0, 5.8, -5.2); scene.add(fill);
  for (const [x, color, intensity] of [[-7.3, '#ffc58d', 27], [3.5, '#c3b7f5', 23], [8.4, '#c0d6ff', 20]]) {
    const local = new T.PointLight(color, intensity, 8.0, 2);
    local.position.set(x, 3.58, -1.02);
    scene.add(local);
  }

  const stage = architecture(scene, assets);
  const media = Object.fromEntries(['input', 'error', 'done', 'new'].map(name =>
    [name, flatMap(tileArt(name, assets.atlas))]));
  media.goodShell = standard('#68958a', .46, .21);
  media.badShell = standard('#725747', .48, .21);
  const manual = room(stage, assets, false, media);
  const auto = room(stage, assets, true, media);
  const board = galleryWall(stage, assets.atlas);
  const manualPost = desk(stage, assets, [-6.96, 0, -.80], 1.33, 0);
  const robots = [[2.26, 0, -1.24], [4.95, 0, -1.07], [7.72, 0, -1.15]].map((point, i) => {
    const post = desk(stage, assets, point, .96 + .065 * i, i + 1, true);
    return { ...post, move: addCeramic(post.seat, i) };
  });
  const finalPost = desk(stage, assets, [7.72, 0, -1.15], 1.26, 0);
  const actor = addEditor(manualPost.seat, assets.human, assets.clip);

  let mode = params.get('shot') || inputs.mode || 'queue';
  function draw(value, proof) {
    const t = Math.max(0, Math.min(value, (COUNTS[mode] - 1) / FPS));
    const final = mode === 'epilogue';
    manualPost.seat.visible = !final;
    finalPost.seat.visible = final;
    robots[2].seat.visible = !final;
    const active = final ? finalPost : manualPost;
    if (actor.model.parent !== active.seat) active.seat.add(actor.model);
    const correction = jam(mode === 'queue' ? t : 7.7, manual);
    scan(mode === 'queue' ? Math.max(0, t - 8.6) : t + 2.43, auto,
      mode === 'mural' ? t >= 5.43 : final);
    board.draw(t, mode === 'mural');
    const library = mode === 'knowledge' && t >= 3.45;
    const review = library && t >= 8.39;
    const mouse = mode === 'queue' ? correction : library
      ? .88 * ease(t, 3.13, 3.63) * (1 - ease(t, 9.18, 10.2)) : 0;
    actor.pose(t, mouse);
    active.play(t, review ? 'review' : library ? 'library' : 'edit');
    robots.forEach((robot, i) => {
      robot.play(t + i * .23);
      robot.move(t + i * .18, mode === 'mural' ? ease(t, 4.4, 4.8) * (1 - ease(t, 5.2, 6)) : .1);
    });
    cameraAt(camera, mode, t);
    if (proof) {
      camera.position.set(...proof[0]);
      camera.lookAt(...proof[1]);
      camera.fov = proof[2];
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  }
  window.renderMotion = draw;
  window.setFactoryMode = value => {
    // Os nomes antigos do catálogo ainda abrem as cenas em que o processo correspondente aparece.
    const aliases = { farewell: 'epilogue' };
    const id = aliases[value] || value;
    if (!Object.hasOwn(COUNTS, id)) throw Error('Cena desconhecida: ' + value);
    mode = id;
    root.dataset.duration = String(COUNTS[mode] / FPS);
    draw(0);
    return COUNTS[mode];
  };
  window.factoryProof = name => {
    const cases = {
      roupa: ['queue', 5.6, [[-5.87, 1.73, .63], [-6.72, 1.08, -.65], 39]],
      maos: ['queue', 3.34, [[-7.54, 1.52, .42], [-6.56, .831, -.59], 36]],
      retrabalho: ['queue', 7.34, [[-7.18, 1.73, .46], [-6.53, .812, -.60], 35]],
      mascote: ['queue', 14.9, [[6.14, 1.68, .53], [5.11, 1.01, -.87], 37]],
      mural: ['mural', 5.52, [[6.19, 2.32, 1.53], [6.19, 2.32, -3.70], 44]],
    };
    const [shot, t, proof] = cases[name];
    window.setFactoryMode(shot);
    draw(t, proof);
    return { fingers: shot === 'queue' ? actor.fingers() : null, viewport: [W, H] };
  };
  window.setFactoryMode(mode);
}
window.motionReady = main().then(() => {
  window.__hfTimelinesBuilding = false;
  window.dispatchEvent(new Event('hf-timelines-built'));
});
