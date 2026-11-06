import * as T from 'three';
import { box, material, plane, random, rod, surface } from './office-geometry.mjs';

function city(room) {
  const horizon = surface(32, 512, ctx => {
    const sky = ctx.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, '#182848');
    sky.addColorStop(.43, '#344d74');
    sky.addColorStop(.63, '#5e708f');
    sky.addColorStop(.77, '#a77772');
    sky.addColorStop(.91, '#686678');
    sky.addColorStop(1, '#35445f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 32, 512);
  });
  plane(room, [116, 31], [1, 7, -49], new T.MeshBasicMaterial({ map: horizon, fog: false }));
  const rng = random(4353);
  const blocks = ['#26344d', '#324258', '#3e4e66', '#47516a', '#3b485c'];
  const facades = blocks.map((color, n) => {
    const texture = surface(192, 320, ctx => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 192, 320);
      const windows = ['#c6b188', '#9a9da7', '#586981', '#d0ab7d', '#475977'];
      for (let row = 1; row < 19; row++) {
        for (let col = 1; col < 10; col++) {
          ctx.fillStyle = rng() < .47 ? windows[Math.floor(rng() * windows.length)] : '#25364d';
          const x = col * 19 + (n % 2) * 4;
          const y = row * 16 + (n === 1 ? 2 : 0);
          ctx.fillRect(x, y, 8 + n % 3, n === 1 ? 8 : 5);
          ctx.fillStyle = '#222d414d';
          ctx.fillRect(x + 3, y, 1, 8);
        }
        ctx.fillStyle = '#26354d50';
        ctx.fillRect(0, row * 16 + 10, 192, 1);
      }
    });
    return new T.MeshBasicMaterial({ map: texture, fog: false });
  });
  for (let row = 0; row < 3; row++) {
    const z = -37 + row * 9;
    for (let i = 0; i < 25; i++) {
      const x = -35 + i * 3.0 + rng() * 1.5 + row * .8;
      const height = 2.4 + rng() ** 2 * 8 + (row === 1 && i === 11 ? 3.4 : 0);
      const width = .9 + rng() * 1.8;
      const base = -5.1 - row * 1.2;
      const tower = box(room, [width, height, 1.6 + rng() * 1.5], [x, base + height / 2, z + rng() * 2], facades[(i + row) % facades.length], 0);
      tower.castShadow = false;
      if (height > 7) {
        const rooftop = box(room, [width * .48, .34, .9], [x, base + height + .17, tower.position.z], facades[0], 0);
        rooftop.castShadow = false;
      }
    }
  }
}

function bookcase(room, x, z, f, dark) {
  const rng = random(343);
  const titles = [material('#ad7358'), material('#d6c5a4'), material('#45747b'), material('#374550'), material('#65755d'), material('#9a473f')];
  box(room, [1.49, 2.95, .08], [x, 1.52, z - .22], dark, 0);
  for (const dx of [-.75, .75]) box(room, [.075, 3.01, .51], [x + dx, 1.54, z], f.walnut, .009);
  for (let i = 0; i < 6; i++) {
    const y = .11 + i * .57;
    box(room, [1.50, .07, .50], [x, y, z], f.oak, .008);
    if (i === 5) break;
    box(room, [1.32, .016, .019], [x, y + .512, z + .12], f.warm, .002);
    for (let j = 0; j < 9; j++) {
      const height = .20 + rng() * .18;
      const bx = x - .62 + j * .089 + (j > 5 ? .34 : 0);
      box(room, [.055 + rng() * .018, height, .20], [bx, y + .035 + height / 2, z + .04], titles[(j + i * 3) % titles.length], .006);
      for (const pct of [.2, .79]) box(room, [.039, .011, .003], [bx, y + .035 + height * pct, z + .142], titles[1], 0);
    }
  }
  for (const y of [.48, 1.62, 2.76]) {
    const strip = new T.PointLight('#ffc181', .57, 1.4, 2);
    strip.position.set(x, y, z + .34);
    room.add(strip);
  }
}

export function plant(room, position, height, seed, potColor) {
  const group = new T.Group();
  group.position.set(...position);
  group.scale.setScalar(height);
  room.add(group);
  const rng = random(seed);
  const pot = material(potColor);
  rod(group, [0, .005, 0], [0, .29, 0], .147, pot, .197);
  rod(group, [0, .267, 0], [0, .31, 0], .204, pot);
  rod(group, [0, .301, 0], [0, .308, 0], .17, material('#332922'));
  const greens = ['#33614b', '#467e59', '#5c8e5b', '#2a503e'].map(color => material(color, { side: T.DoubleSide }));
  for (let i = 0; i < 13; i++) {
    const angle = i * 2.39996, rise = .52 + rng() * .43;
    const length = .14 + (1 - rise) * .61;
    const a = new T.Vector3(Math.sin(angle) * length, rise, Math.cos(angle) * length);
    rod(group, [0, .30, 0], a.toArray(), .009, greens[0], .004);
    const breadth = .06 + rng() * .047;
    const tip = a.clone().add(new T.Vector3(Math.sin(angle) * .18, .08 + rng() * .11, Math.cos(angle) * .18));
    const tangent = new T.Vector3(Math.cos(angle), 0, -Math.sin(angle));
    const points = [];
    const indices = [];
    for (let k = 0; k <= 8; k++) {
      const s = k / 8;
      const mid = a.clone().lerp(tip, s);
      mid.y += .05 * Math.sin(s * Math.PI);
      const width = Math.sin(Math.PI * s) ** .8 * breadth;
      for (const side of [-1, 0, 1]) {
        const point = mid.clone().addScaledVector(tangent, side * width);
        point.y -= Math.abs(side) * width * .25;
        points.push(...point.toArray());
      }
      if (k < 8) {
        const j = k * 3;
        indices.push(j, j + 3, j + 1, j + 1, j + 3, j + 4, j + 1, j + 4, j + 2, j + 2, j + 4, j + 5);
      }
    }
    const leaf = new T.BufferGeometry();
    leaf.setAttribute('position', new T.Float32BufferAttribute(points, 3));
    leaf.setIndex(indices);
    leaf.computeVertexNormals();
    const mesh = new T.Mesh(leaf, greens[i % greens.length]);
    mesh.castShadow = true;
    group.add(mesh);
  }
  return group;
}

function pendant(room, x, z, f) {
  rod(room, [x, 3.47, z], [x, 4.65, z], .013, f.steel);
  rod(room, [x, 3.23, z], [x, 3.48, z], .34, f.steel, .13);
  rod(room, [x, 3.214, z], [x, 3.234, z], .292, f.warm);
  const pool = new T.SpotLight('#ffbd84', 17, 6, .83, .92, 2);
  pool.position.set(x, 3.18, z);
  pool.target.position.set(x, 0, z);
  room.add(pool, pool.target);
}

function wallArt(room, f) {
  const print = surface(580, 720, ctx => {
    ctx.fillStyle = '#d5c8aa';
    ctx.fillRect(0, 0, 580, 720);
    ctx.fillStyle = '#203b3d';
    ctx.fillRect(43, 43, 494, 568);
    const colors = ['#daa975', '#a7b2a1', '#698c8b', '#a76758', '#e1c69b'];
    for (let i = 0; i < 15; i++) {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = i % 3 === 0 ? 7 : 3;
      ctx.beginPath();
      ctx.ellipse(290, 330, 120 + i * 8, 39 + i * 7, (i - 7) * .12, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#263b3d';
    ctx.font = '600 23px Arial';
    ctx.fillText('LUZ & FREQUÊNCIA', 43, 656);
    ctx.font = '15px Arial';
    ctx.fillText('ESTUDO 03    /    FORMAS SONORAS', 43, 683);
  });
  const group = new T.Group();
  group.rotation.y = -Math.PI / 2;
  group.position.set(5.46, 2.30, .42);
  room.add(group);
  box(group, [1.11, 1.35, .064], [0, 0, 0], f.walnut);
  plane(group, [1.04, 1.29], [0, 0, .035], new T.MeshStandardMaterial({ map: print, roughness: .95 }));
  rod(group, [-.48, .75, .10], [.48, .75, .10], .025, f.brass);
  rod(group, [-.45, .74, .11], [.45, .74, .11], .010, f.warm);
}

export function buildOffice(room, f, kenney) {
  city(room);
  const plaster = material('#4b5c60', { roughness: .91 });
  const teal = material('#25454a', { roughness: .79 });
  const black = material('#18282b');
  const beam = material('#303d44', { roughness: .85 });
  const rugBorder = material('#aa8d6c');
  const threshold = box(room, [11.45, .19, 13], [0, -.109, 1.75], f.concrete, .015);
  threshold.castShadow = false;
  const floor = plane(room, [11.43, 12.98], [0, -.012, 1.75], f.concrete, true);
  floor.receiveShadow = true;
  box(room, [11.45, .70, .35], [0, .34, -4.56], teal, .010);
  box(room, [11.44, .09, .47], [0, .71, -4.55], f.walnut);
  box(room, [11.43, .52, .27], [0, 4.34, -4.54], beam, .008);
  for (const x of [-5.55, -3.70, -1.85, 0, 1.85, 3.70, 5.55]) {
    box(room, [.094, 3.43, .24], [x, 2.44, -4.52], f.steel, .009);
    box(room, [.026, 3.40, .018], [x + .023, 2.44, -4.391], f.brass, 0);
  }
  for (const y of [.78, 2.95, 4.13]) box(room, [11.4, .075, .24], [0, y, -4.52], f.steel, .007);
  const glass = new T.MeshBasicMaterial({ color: '#a3b7dd', transparent: true, opacity: .065, depthWrite: false });
  plane(room, [11.18, 3.36], [0, 2.44, -4.58], glass);

  box(room, [.25, 4.63, 8.70], [5.63, 2.29, -.27], plaster, 0).castShadow = false;
  box(room, [.24, 4.62, 10.8], [-5.63, 2.29, .74], plaster, 0).castShadow = false;
  box(room, [11.43, .14, 8.85], [0, 4.66, -.32], beam, 0).castShadow = false;
  const acoustic = material('#284447', { roughness: .94 });
  for (const z of [-1.98, -.95, .08, 1.11, 2.14]) {
    box(room, [.07, 2.18, 1.015], [-5.476, 2.35, z], acoustic, .019).castShadow = false;
    box(room, [.07, .072, .99], [-5.431, 1.18, z], f.walnut, .012);
  }
  box(room, [.063, .038, 5.14], [-5.416, 1.221, .08], f.warm, .003);
  box(room, [.07, .06, 10.81], [-5.47, .051, .74], black, .004);
  box(room, [.09, 1.23, 8.65], [5.49, .60, -.24], teal, .005);
  box(room, [.07, .069, 8.68], [5.46, 1.23, -.24], f.walnut);
  box(room, [.08, .075, 8.69], [5.46, .05, -.24], black);
  for (let i = 0; i < 34; i++) {
    box(room, [.06, 2.94, .055], [5.47, 2.77, -4.20 + i * .077], i % 3 ? f.walnut : f.oak, .005);
  }
  for (const z of [-4.11, -1.28, 1.47]) {
    const girder = box(room, [11.44, .29, .31], [0, 4.47, z], beam, .013);
    girder.castShadow = false;
    box(room, [11.40, .036, .068], [0, 4.31, z + .081], f.walnut, .004).castShadow = false;
  }
  for (const x of [-3.80, 2.80]) pendant(room, x, -.65, f);
  for (const x of [-2.38, 1.38]) pendant(room, x, -3.43, f);
  bookcase(room, -4.68, -3.49, f, black);
  wallArt(room, f);

  const rug = box(room, [4.22, .026, 2.44], [2.75, .009, 2.23], f.felt, .009);
  rug.castShadow = false;
  for (const z of [1.13, 3.33]) box(room, [3.99, .004, .019], [2.75, .025, z], rugBorder, .001);
  for (const x of [.77, 4.73]) box(room, [.019, .004, 2.22], [x, .025, 2.23], rugBorder, .001);
  for (const x of [1.05, 4.45]) {
    for (let i = 0; i < 3; i++) box(room, [.014, .004, 2.04 - i * .11], [x + i * .055, .025, 2.23], rugBorder, .001);
  }
  plant(room, [4.71, 0, -1.40], 1.68, 227, '#977f62');
  plant(room, [4.88, 0, 1.17], 1.53, 399, '#ad8066');
  plant(room, [-4.71, 0, .16], 1.66, 42, '#596966');
  plant(room, [1.73, .971, -2.88], .40, 109, '#c18866');

  rod(room, [4.85, .01, 2.60], [4.85, .06, 2.60], .26, f.steel);
  rod(room, [4.85, .05, 2.60], [4.85, 1.94, 2.60], .026, f.brass);
  rod(room, [4.85, 1.91, 2.60], [4.52, 2.12, 2.60], .026, f.brass);
  rod(room, [4.52, 1.83, 2.60], [4.52, 2.13, 2.60], .24, material('#d6b188'), .15);
  rod(room, [4.52, 1.82, 2.60], [4.52, 1.84, 2.60], .211, f.warm);
  const lamp = new T.PointLight('#ffc17d', 3.3, 4.6, 2);
  lamp.position.set(4.52, 1.76, 2.60);
  room.add(lamp);

  for (const [asset, x, y, z, scale, rot] of [
    ['crate', -4.22, 0, -1.72, .98, .24],
    ['crate', -4.71, .15, -2.03, .70, -.18],
    ['case', 4.72, 0, -.84, .62, .28],
    ['control', -4.55, 1.85, -3.42, .42, .10],
  ]) {
    const prop = kenney[asset].clone();
    prop.position.set(x, y, z);
    prop.scale.setScalar(scale);
    prop.rotation.y = rot;
    prop.traverse(mesh => {
      if (!mesh.isMesh) return;
      mesh.castShadow = mesh.receiveShadow = true;
      if (asset !== 'crate') {
        mesh.material = mesh.material.clone();
        mesh.material.color.multiply(new T.Color(asset === 'case' ? '#7c938c' : '#819e9a'));
      }
    });
    room.add(prop);
  }
}
