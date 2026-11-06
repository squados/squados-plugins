import * as T from 'three';
import { teamCast, deskHeight, seatPop } from './office-team.mjs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { box, makeFinishes, material, plane, rod, sphere, surface } from './office-geometry.mjs';
import { buildOffice } from './office-set.mjs';
import { loadSleeper } from './office-sleeper.mjs';

const clamp = (n) => Math.max(0, Math.min(n, 1));
const ease = (n) => { const x = clamp(n); return x * x * (3 - 2 * x); };
const sweep = (t, start, duration) => ease((t - start) / duration);
const blend = (a, b, x) => a + (b - a) * x;
const ink = material('#171e2b');
const oat = material('#e0d0bd');
const metal = material('#637c8a', { roughness: .33, metalness: .22 });
const dark = material('#24283b');
const blue = material('#70d5e7', { emissive: '#52c5dc', emissiveIntensity: .62 });
const light = material('#f7d39a', { emissive: '#f2a656', emissiveIntensity: .45 });

function image(path) {
  return new Promise((resolve, reject) => {
    const media = new Image();
    media.onload = () => resolve(media);
    media.onerror = reject;
    media.src = path;
  });
}

function paintedScreen(ctx, atlas, time, active) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.fillStyle = '#19191f';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#2b2933';
  ctx.fillRect(0, 0, w, 47);
  ctx.fillStyle = '#c1b5ff';
  ctx.font = 'bold 22px Arial';
  ctx.fillText('Pr', 15, 31);
  ctx.fillStyle = '#eeeaf4';
  ctx.font = '14px Arial';
  ctx.fillText('Editor de vídeo', 57, 29);
  ctx.fillStyle = '#bbb9c9';
  ctx.fillText('Editar', 622, 29);
  ctx.fillStyle = '#2b2834';
  ctx.fillRect(14, 60, 206, 272);
  ctx.fillRect(234, 60, 520, 272);
  ctx.fillStyle = '#bfbacb';
  ctx.fillText('Projeto: Demonstração', 27, 83);
  ctx.fillText('Programa', 250, 83);
  const n = Math.min(49, Math.floor(time * 10));
  for (let j = 0; j < 3; j++) {
    ctx.drawImage(atlas, j * 256, 0, 256, 144, 26 + (j % 2) * 95, 105 + Math.floor(j / 2) * 73, 80, 45);
  }
  ctx.fillStyle = '#8d8c9a';
  ctx.fillText('cursoedicaovideos', 27, 263);
  ctx.drawImage(atlas, (n % 10) * 256, Math.floor(n / 10) * 144, 256, 144, 312, 94, 350, 197);
  ctx.fillStyle = '#dad5eb';
  ctx.fillText('▶', 481, 317);
  ctx.fillStyle = '#201f29';
  ctx.fillRect(14, 346, 740, 137);
  ctx.fillStyle = '#aaa8bc';
  ctx.fillText('Sequência 01', 25, 366);
  const length = [131, 181, 117, 126, 80];
  let x = 66;
  for (let i = 0; i < length.length; i++) {
    const width = length[i];
    ctx.fillStyle = i === 2 ? '#8268bd' : '#535e9d';
    ctx.fillRect(x, 388, width - 4, 27);
    ctx.fillStyle = '#3f826e';
    ctx.fillRect(x, 422, width - 4, 30);
    ctx.strokeStyle = '#9bd1bc';
    ctx.beginPath();
    for (let a = 4; a < width - 6; a += 4) {
      const amp = 2 + 10 * Math.abs(Math.sin(a * .64 + i) * Math.cos(a * .15));
      ctx.moveTo(x + a, 437 - amp);
      ctx.lineTo(x + a, 437 + amp);
    }
    ctx.stroke();
    x += width + 1;
  }
  ctx.fillStyle = '#ccc8dc';
  ctx.fillText('V1', 26, 406);
  ctx.fillText('A1', 26, 440);
  const playhead = 69 + (time / 5) * 603;
  ctx.fillStyle = '#9acaff';
  ctx.fillRect(playhead, 376, 3, 87);
  ctx.beginPath();
  ctx.moveTo(playhead - 7, 376);
  ctx.lineTo(playhead + 10, 376);
  ctx.lineTo(playhead + 1, 385);
  ctx.fill();
  if (!active) {
    ctx.fillStyle = '#12151fdf';
    ctx.fillRect(0, 0, w, h);
  }
}

function stationTexture(index) {
  const surface = document.createElement('canvas');
  surface.width = 448;
  surface.height = 260;
  const ctx = surface.getContext('2d');
  const accents = ['#80c7d5', '#d49ae9', '#eebc70', '#83d5b6', '#f2a99c'];
  const tools = ['Transcrição', 'Animação', 'Som', 'Exportação', 'Direção'];
  const accent = accents[index - 1];
  ctx.fillStyle = '#1c202b';
  ctx.fillRect(0, 0, 448, 260);
  ctx.fillStyle = '#292d3a';
  ctx.fillRect(0, 0, 448, 44);
  ctx.fillStyle = '#e1e7ef';
  ctx.font = '19px Arial';
  ctx.fillText(tools[index - 1], 18, 29);
  ctx.fillStyle = '#232a37';
  for (let i = 0; i < 3; i++) ctx.fillRect(16, 62 + i * 60, 416, 48);
  ctx.fillStyle = accent;
  if (index === 1 || index === 3) {
    for (let i = 0; i < 78; i++) {
      const amplitude = 5 + 29 * Math.abs(Math.sin(i * .51) * Math.cos(i * .13));
      ctx.fillRect(29 + i * 5, 87 - amplitude / 2, 3, amplitude);
    }
    for (let i = 0; i < 5; i++) ctx.fillRect(27 + i * 75, 141, 38 + (i % 3) * 12, 7);
  } else {
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(28, 78 + i * 60, 24, 17);
      ctx.fillRect(65, 80 + i * 60, 63 + ((index + i) % 3) * 41, 11);
      ctx.fillRect(284, 80 + i * 60, 120 - 29 * i, 9);
    }
  }
  const texture = new T.CanvasTexture(surface);
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

function makeDesk(room, x, z, screen, logo, f, hero) {
  const group = new T.Group();
  group.position.set(x, 0, z);
  room.add(group);
  box(group, [2.11, .085, .98], [0, .928, 0], f.oak, .031);
  for (const xx of [-.85, .85]) {
    box(group, [.062, .86, .069], [xx, .453, -.31], f.steel);
    box(group, [.062, .86, .069], [xx, .453, .34], f.steel);
    box(group, [.069, .057, .78], [xx, .061, .021], f.steel);
  }
  box(group, [1.78, .08, .06], [0, .80, -.32], f.steel);
  box(group, [1.48, .86, .083], [0, 1.52, -.19], ink, .023);
  plane(group, [1.418, .795], [0, 1.52, -.146], new T.MeshBasicMaterial({ map: screen }));
  rod(group, [0, .99, -.24], [0, 1.18, -.24], .045, f.steel);
  box(group, [.42, .032, .23], [0, .986, -.19], ink);
  box(group, [1.02, .013, .34], [-.039, .977, .22], f.felt, .025);
  box(group, [.67, .038, .20], [-.13, .999, .22], ink, .015);
  for (let col = 0; col < 11; col++) {
    for (let row = 0; row < 3; row++) {
      const key = row === 1 && col === 10 ? light : col % 5 === 0 ? oat : metal;
      box(group, [.048, .012, .033], [-.408 + col * .054, 1.022, .166 + row * .052], key, .004);
    }
  }
  box(group, [.09, .043, .135], [.372, 1.004, .23], ink, .02);
  const tower = box(group, [.32, .56, .45], [.63, .33, -.19], ink, .025);
  for (let i = 0; i < 5; i++) box(group, [.178, .007, .004], [.63, .13 + i * .021, .038], f.steel, 0);
  box(group, [.042, .012, .004], [.58, .555, .039], blue, .004);
  for (const xx of [-.875, .875]) {
    box(group, [.179, .258, .182], [xx, 1.105, -.27], dark, .012);
    for (const [y, radius] of [[1.158, .024], [1.061, .055]]) {
      rod(group, [xx, y, -.181], [xx, y, -.172], radius, f.steel);
      sphere(group, [radius * .58, radius * .58, .015], [xx, y, -.170], ink);
    }
  }
  if (hero) {
    box(group, [.23, .024, .16], [-.78, .985, .27], material('#865443'), .011);
    box(group, [.205, .013, .146], [-.78, .997, .27], oat, .002);
    rod(group, [-.88, 1.009, .317], [-.71, 1.009, .295], .009, f.brass);
    const cup = material('#b06a4d');
    rod(group, [.80, .975, .23], [.80, 1.106, .23], .054, cup, .068);
    rod(group, [.80, 1.103, .23], [.80, 1.108, .23], .054, material('#33241d'));
    const handle = new T.Mesh(new T.TorusGeometry(.039, .008, 7, 15), cup);
    handle.position.set(.868, 1.047, .23);
    group.add(handle);
    const cable = new T.CubicBezierCurve3(new T.Vector3(.09, 1.012, .117), new T.Vector3(.12, .993, -.014), new T.Vector3(-.13, 1.005, -.05), new T.Vector3(.02, 1.094, -.26));
    group.add(new T.Mesh(new T.TubeGeometry(cable, 18, .006, 5), ink));
  }
  if (logo) {
    const mark = new T.MeshBasicMaterial({ map: logo, transparent: true, alphaTest: .1 });
    plane(group, [.135, .135], [tower.position.x, .414, .038], mark);
  }
  if (!hero && x < 0 && z < 0) {
    const panel = box(group, [.38, .035, .26], [.65, 1.006, .25], f.steel, .017);
    panel.rotation.x = -.19;
    for (let i = 0; i < 8; i++) {
      box(group, [.009, .015, .11], [.50 + i * .044, 1.038, .25], ink, 0);
      box(group, [.023, .014, .029], [.50 + i * .044, 1.045, .225 + .045 * Math.sin(i * 2)], i % 4 ? oat : blue, .004);
    }
  }
  if (!hero && x > 2 && z < 0) {
    for (let i = 0; i < 3; i++) {
      const cover = box(group, [.27 - i * .019, .035, .187], [.73, .984 + i * .036, .29], [ink, f.felt, f.walnut][i], .006);
      cover.rotation.y = (i - 1) * .16;
    }
  }
  const chair = new T.Group();
  chair.position.z = .99;
  group.add(chair);
  box(chair, [.63, .104, .61], [0, .52, 0], dark, .043);
  box(chair, [.59, .47, .079], [0, .765, .295], f.felt, .032).rotation.x = -.10;
  for (const xx of [-.30, .30]) {
    rod(chair, [xx, .47, .19], [xx, .70, .19], .023, f.steel);
    box(chair, [.08, .035, .31], [xx, .705, .10], ink);
  }
  rod(chair, [0, .10, 0], [0, .51, 0], .055, f.steel);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * .4;
    const x = Math.cos(angle) * .30, z = Math.sin(angle) * .30;
    rod(chair, [x, .073, z], [0, .123, 0], .025, f.steel);
    sphere(chair, [.040, .040, .032], [x, .041, z], ink);
  }
  return group;
}

function makeRobot(desk, color, headset) {
  const actor = new T.Group();
  desk.add(actor);
  const body = new T.Group();
  actor.add(body);
  const shell = material(color, { roughness: .37, metalness: .16 });
  box(body, [.54, .42, .34], [0, .75, 0], shell, .069);
  box(body, [.25, .14, .027], [0, .77, -.175], ink, .015);
  box(body, [.27, .24, .055], [0, .77, .182], metal, .028);
  for (let i = 0; i < 3; i++) box(body, [.116, .012, .008], [0, .81 - i * .032, .214], ink, .004);
  box(body, [.10, .032, .032], [0, .77, -.191], blue, .005);
  const head = new T.Group();
  head.position.set(0, 1.18, 0);
  body.add(head);
  box(head, [.53, .43, .38], [0, 0, 0], shell, .077);
  box(head, [.29, .16, .031], [0, -.017, .189], material(color, { roughness: .45, metalness: .28 }), .018);
  for (const x of [-.107, .107]) {
    rod(head, [x, .024, .204], [x, .024, .210], .012, metal);
    box(head, [.080, .010, .007], [x * .61, -.058, .208], ink, .003);
  }
  box(head, [.026, .014, .008], [0, .024, .209], blue, .004);
  box(head, [.42, .25, .03], [0, .005, -.192], ink, .05);
  for (const x of [-.101, .101]) box(head, [.046, .079, .026], [x, .015, -.21], blue, .015);
  rod(head, [.15, .20, .01], [.20, .32, .01], .018, metal);
  sphere(head, [.033, .033, .033], [.20, .32, .01], light);
  if (headset) {
    const band = new T.Mesh(new T.TorusGeometry(.26, .035, 9, 22, Math.PI), ink);
    band.position.y = .018;
    head.add(band);
    for (const x of [-.263, .263]) box(head, [.083, .19, .20], [x, .002, 0], ink, .038);
    rod(head, [-.27, -.02, -.04], [-.22, -.13, -.28], .018, ink);
    sphere(head, [.039, .024, .024], [-.22, -.13, -.28], metal);
  }
  const arms = [], legs = [];
  for (const side of [-1, 1]) {
    const arm = new T.Group();
    arm.position.set(side * .32, .865, -.025);
    body.add(arm);
    sphere(arm, [.071, .071, .071], [0, 0, 0], dark);
    rod(arm, [0, 0, 0], [0, -.183, -.12], .056, shell);
    sphere(arm, [.058, .058, .058], [0, -.183, -.12], metal);
    rod(arm, [0, -.183, -.12], [-side * .10, -.044, -.49], .049, shell);
    sphere(arm, [.056, .046, .052], [-side * .10, -.048, -.545], oat);
    arms.push(arm);
    const leg = new T.Group();
    leg.position.set(side * .135, .54, 0);
    actor.add(leg);
    rod(leg, [0, 0, 0], [0, -.27, 0], .071, shell);
    rod(leg, [0, -.27, 0], [0, -.48, 0], .062, metal);
    box(leg, [.20, .085, .28], [0, -.51, -.09], ink, .022);
    legs.push(leg);
  }
  return { actor, body, head, arms, legs };
}

function hammock(room, sleeper, f, solo) {
  const stand = new T.Group();
  stand.position.set(solo ? 1.40 : 2.66, 0, solo ? 1.75 : 2.27);
  stand.rotation.y = -.19;
  room.add(stand);
  const sling = new T.Group();
  stand.add(sling);
  for (const side of [-1, 1]) {
    box(stand, [.19, .08, .74], [side * 1.61, .062, -.05], f.steel, .024);
    rod(stand, [side * 1.58, .075, -.18], [side * 1.66, 1.67, -.02], .047, f.walnut);
    rod(stand, [side * 1.58, .075, .28], [side * 1.66, 1.67, -.02], .034, f.steel);
    sphere(stand, [.066, .066, .065], [side * 1.66, 1.66, -.02], f.brass);
    rod(sling, [side * 1.12, 1.14, -.39], [side * 1.12, 1.14, .39], .024, f.oak);
    for (let i = 0; i < 9; i++) {
      const z = -.38 + i * .095;
      rod(sling, [side * 1.64, 1.61, -.02], [side * 1.12, 1.145, z], .008, f.fabric);
    }
  }

  const fabric = f.fabric.clone();
  fabric.map = surface(768, 512, ctx => {
    ctx.drawImage(f.fabric.map.image, 0, 0, 768, 512);
    for (const [y, h, color] of [[0, 22, '#365957'], [31, 5, '#6b5240'], [46, 4, '#6b5240'], [462, 4, '#6b5240'], [476, 5, '#6b5240'], [490, 22, '#365957']]) {
      ctx.globalAlpha = .76;
      ctx.fillStyle = color;
      ctx.fillRect(0, y, 768, h);
    }
  });
  const textile = new T.Mesh(new T.PlaneGeometry(2.25, .80, 36, 16), fabric);
  const vertices = textile.geometry.attributes.position;
  const bedHeight = (x, z) => .815 + .325 * (x / 1.125) ** 2 + .12 * (z / .40) ** 2 * (1 - (x / 1.125) ** 4);
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), z = vertices.getY(i);
    vertices.setXYZ(i, x, bedHeight(x, z), z);
  }
  textile.geometry.computeVertexNormals();
  textile.castShadow = textile.receiveShadow = true;
  sling.add(textile);
  for (const z of [-.4, .4]) {
    const seam = new T.CatmullRomCurve3(Array.from({ length: 13 }, (_, i) => {
      const x = -1.125 + i * .1875;
      return new T.Vector3(x, bedHeight(x, z), z);
    }));
    sling.add(new T.Mesh(new T.TubeGeometry(seam, 32, .013, 6), f.felt));
  }
  const pillow = sphere(sling, [.235, .083, .236], [-.755, 1.013, -.031], f.felt);
  pillow.rotation.z = -.23;
  sleeper.position.set(.034, 1.006, -.021);
  sling.add(sleeper);
  return sling;
}

function shot(camera, t, keys, offset) {
  const endIndex = keys.findIndex(([time]) => t <= time);
  const i = endIndex < 1 ? (endIndex === -1 ? keys.length - 1 : 1) : endIndex;
  const [t0, a, p] = keys[i - 1], [t1, b, q] = keys[i];
  const e = sweep(t, t0, t1 - t0);
  camera.position.set(...a.map((v, j) => blend(v, b[j], e) + offset[j]));
  camera.lookAt(...p.map((v, j) => blend(v, q[j], e) + offset[j]));
}

const shots = {
  intro: [
    [0, [-.96, 2.19, 3.20], [-2.38, 1.37, -.04]],
    [1.0, [-.63, 2.32, 3.60], [-2.35, 1.34, -.06]],
    [4.18, [2.21, 3.49, 7.09], [.86, 1.44, .11]],
    [5, [2.32, 3.53, 7.21], [.91, 1.39, .14]],
  ],
  introSquare: [
    [0, [.36, 2.18, 3.46], [-1.46, 1.30, .16]],
    [1.40, [.50, 2.33, 3.84], [-1.43, 1.29, .22]],
    [4.06, [1.20, 3.27, 6.50], [.02, 1.12, .76]],
    [5, [1.42, 3.43, 6.78], [.15, 1.11, .80]],
  ],
  team: [
    [0, [3.70, 4.29, 7.25], [.15, 1.29, -.78]],
    [2.9, [2.46, 3.89, 7.28], [.05, 1.29, -.83]],
    [5, [1.72, 3.51, 7.21], [-.10, 1.28, -.92]],
  ],
  editor: [
    [0, [-.4, 2.48, 4.12], [-2.76, 1.30, .43]],
    [1.7, [-1.44, 1.92, 2.52], [-2.72, 1.37, .05]],
    [2.9, [-2.13, 1.79, .88], [-2.78, 1.45, -.15]],
    [4.12, [-2.68, 1.65, .72], [-2.78, 1.49, -.15]],
    [5, [-2.78, 1.58, .70], [-2.78, 1.49, -.15]],
  ],
};

function orbitPosition(progress) {
  const angle = blend(.37, -.21, progress);
  return new T.Vector3(Math.sin(angle) * 8.9, blend(4.75, 4.15, progress), Math.cos(angle) * 8.9);
}

function officeCamera(story) {
  const orbitEnd = story.pushAt ?? story.duration;
  const orbitTarget = new T.Vector3(0, 1.26, -.65);
  const start = orbitPosition(1);
  const path = new T.CatmullRomCurve3([
    start,
    new T.Vector3(-1.83, 3.54, 6.62),
    new T.Vector3(-1.45, 2.42, 3.65),
    new T.Vector3(-1.95, 1.92, 1.91),
    new T.Vector3(-2.23, 1.77, .93),
    new T.Vector3(-2.78, 1.58, .70),
  ]);
  const target = new T.CatmullRomCurve3([
    orbitTarget, new T.Vector3(-1.20, 1.38, -.22),
    new T.Vector3(-2.47, 1.47, -.08), new T.Vector3(-2.78, 1.49, -.15),
  ]);
  return (camera, t) => {
    if (story.pushAt === undefined || t < story.pushAt) {
      camera.position.copy(orbitPosition(clamp(t / orbitEnd)));
      camera.lookAt(orbitTarget);
      if (camera.fov !== 43) {
        camera.fov = 43;
        camera.updateProjectionMatrix();
      }
      return;
    }
    const p = sweep(t, story.pushAt, story.duration - story.pushAt);
    camera.position.copy(path.getPoint(p));
    camera.lookAt(target.getPoint(p));
    camera.fov = blend(43, 58, sweep(p, .48, .52));
    camera.updateProjectionMatrix();
  };
}

export async function createRoom(canvas, options) {
  const loader = new GLTFLoader();
  const story = options.story;
  const [atlas, mark, crate, equipment, control, sleeper, people] = await Promise.all([
    image(options.atlas || 'assets/camera-atlas.jpg'),
    image(options.logo || 'assets/claude.svg'),
    loader.loadAsync('assets/kenney/factory-kit/box-small.glb'),
    loader.loadAsync('assets/kenney/factory-kit/machine-window.glb'),
    loader.loadAsync('assets/kenney/factory-kit/scanner-high.glb'),
    options.mode === 'intro' ? loadSleeper() : null,
    story ? teamCast() : null,
  ]);
  const logo = surface(256, 256, ctx => ctx.drawImage(mark, 0, 0, 256, 256));
  const room = new T.Scene();
  room.background = new T.Color('#293c57');
  const camera = new T.PerspectiveCamera(43, (options.width || 1920) / (options.height || 1080), .055, 105);
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setSize(options.width || 1920, options.height || 1080, false);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  room.add(new T.HemisphereLight('#c9dffa', '#a17b5e', 1.63));
  const key = new T.DirectionalLight('#ffdbb5', 1.38);
  key.position.set(-2.4, 6.4, 4.1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -7.4, right: 7.4, top: 6.1, bottom: -6.1, near: .6, far: 19 });
  key.shadow.normalBias = .020
  key.shadow.radius = 2.8;
  key.shadow.bias = -.00012;
  room.add(key);
  const windowLight = new T.DirectionalLight('#a0bbff', 1.37);
  windowLight.position.set(-.8, 2.65, -5.9);
  room.add(windowLight);
  const loungeFill = new T.SpotLight('#ffc48f', 32, 8, .81, 1, 2);
  loungeFill.position.set(4.25, 3.78, 4.1);
  loungeFill.target.position.set(2.45, .77, 2.21);
  room.add(loungeFill, loungeFill.target);
  const f = makeFinishes();
  buildOffice(room, f, { crate: crate.scene, case: equipment.scene, control: control.scene });
  const floorShadow = document.createElement('canvas');
  floorShadow.width = floorShadow.height = 96;
  const shadowContext = floorShadow.getContext('2d');
  const radial = shadowContext.createRadialGradient(48, 48, 7, 48, 48, 47);
  radial.addColorStop(0, '#030711a8');
  radial.addColorStop(1, '#03071100');
  shadowContext.fillStyle = radial;
  shadowContext.fillRect(0, 0, 96, 96);
  const shade = new T.MeshBasicMaterial({ map: new T.CanvasTexture(floorShadow), transparent: true, depthWrite: false });
  const screen = document.createElement('canvas');
  screen.width = 768;
  screen.height = 490;
  const ctx = screen.getContext('2d');
  const texture = new T.CanvasTexture(screen);
  texture.colorSpace = T.SRGBColorSpace;
  const colors = ['#ddbda4', '#8bb9c9', '#c8a9de', '#e2ad6b', '#8aa99a', '#e3b3a8'];
  const solo = options.solo && options.mode === 'intro';
  const centers = solo ? [[-1.42, 0]] : [[-2.78, 0], [0, 0], [2.78, 0], [-1.78, -2.65], [.98, -2.65], [3.79, -2.65]];
  const characters = centers.map(([x, z], i) => {
    const display = i === 0 ? texture : stationTexture(i);
    const station = makeDesk(room, x, z, display, i === 0 ? logo : null, f, i === 0);
    const shadow = plane(room, [2.67, 2.08], [x, .004, z + .30], shade, true);
    const bot = makeRobot(station, colors[i], i === 0);
    bot.display = station.children.find((mesh) => mesh.material?.map === display).material;
    if (i > 0 && options.mode !== 'team' && (options.station || 0) !== i) bot.actor.visible = false;
    if (story) station.add(people[i].actor);
    return { ...bot, station, shadow, pop: story ? seatPop(room, x, z) : null };
  });
  const sling = sleeper ? hammock(room, sleeper, f, solo) : null;
  const focus = options.mode === 'editor' ? centers[options.station || 0] : centers[0];
  const offset = [focus[0] - centers[0][0], 0, focus[1]];
  const moveOffice = story ? officeCamera(story) : null;

  return (t) => {
    paintedScreen(ctx, atlas, t, true);
    texture.needsUpdate = true;
    characters.forEach(({ actor, body, head, arms, legs, display, station, shadow, pop }, i) => {
      if (story) {
        const drop = deskHeight(t, story.desks + i * .18);
        const remove = story.swap + i * .105;
        station.visible = drop !== null;
        station.position.y = drop ?? 0;
        if (shadow) shadow.visible = drop !== null && drop < .18;
        people[i].update(t, story.people + i * .11, remove);
        actor.visible = t >= remove + .045;
        pop(t - remove);
      }
      const arrival = !story && options.mode === 'team' ? sweep(t, .14 + i * .28, 1.55) : 1;
      const seated = !story && options.mode === 'team' ? sweep(t, 1.16 + i * .28, .67) : 1;
      const awake = i === 0 || i === options.station ? 1 : options.mode === 'team' ? .10 + .90 * sweep(t, 1.60 + i * .28, .36) : .12;
      display.color.setScalar(story ? .22 + .78 * sweep(t, story.desks + i * .18 + .4, .35) : awake);
      actor.rotation.y = (1 - arrival) * (i % 2 ? -.68 : .68);
      const step = (1 - seated) * Math.sin(t * 11 + i);
      actor.position.set((1 - arrival) * (i % 2 ? .48 : -.47), .20 * seated, .86 + .82 * (1 - arrival));
      body.position.y = .035 * Math.abs(step) - .11 * seated;
      head.rotation.y = .08 * Math.sin(t * 2 + i) + (i === 0 ? -.18 * (1 - sweep(t, .15, .78)) : 0);
      head.rotation.x = .10 * seated + .018 * Math.sin(t * 7);
      arms.forEach((arm, j) => {
        arm.rotation.x = -.06 + .27 * seated + .042 * Math.sin(17 * t + j * 1.9 + i) * seated + step * (j ? -.18 : .18);
      });
      legs.forEach((leg, j) => {
        leg.rotation.x = .89 * seated + (j ? -.32 : .32) * step;
        leg.position.y = .53 - .13 * seated;
      });
    });
    if (sling) {
      sling.rotation.x = .011 * Math.sin(t * 2.3);
      camera.fov = blend(43, 45, sweep(t, 1, 3.2));
      camera.updateProjectionMatrix();
    }
    if (options.mode === 'editor') {
      camera.fov = blend(43, 59, sweep(t, 2.35, 1.70));
      camera.updateProjectionMatrix();
    }
    if (moveOffice) {
      moveOffice(camera, t);
    } else {
      shot(camera, t, shots[solo ? 'introSquare' : options.mode], offset);
    }
    renderer.render(room, camera);
  };
}
