import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const material = (color, extra = {}) => new T.MeshStandardMaterial({ color, roughness: .67, ...extra });

export function random(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function box(parent, dims, position, mat, round = .018) {
  const geometry = round ? new RoundedBoxGeometry(...dims, 1, round) : new T.BoxGeometry(...dims);
  const mesh = new T.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function rod(parent, a, b, radius, mat, tip = radius) {
  const av = new T.Vector3(...a), bv = new T.Vector3(...b);
  const mesh = new T.Mesh(new T.CylinderGeometry(tip, radius, av.distanceTo(bv), 10), mat);
  mesh.position.copy(av).lerp(bv, .5);
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), bv.sub(av).normalize());
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function sphere(parent, dims, position, mat) {
  const mesh = new T.Mesh(new T.SphereGeometry(1, 18, 12), mat);
  mesh.scale.set(...dims);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function plane(parent, dims, position, mat, horizontal = false) {
  const mesh = new T.Mesh(new T.PlaneGeometry(...dims), mat);
  mesh.position.set(...position);
  if (horizontal) mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function surface(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'));
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function makeFinishes() {
  const rng = random(794);
  const grain = (base, tone) => surface(1024, 256, ctx => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 760; i++) {
      const y = rng() * 256, x = rng() * 900 - 140;
      ctx.strokeStyle = i % 4 ? tone : '#eab98e';
      ctx.globalAlpha = .02 + rng() * .11;
      ctx.lineWidth = .25 + rng() * 2.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 230, y + rng() * 20, x + 420, y - rng() * 14, x + 640, y + rng() * 4);
      ctx.stroke();
    }
  });
  const weave = (base, threads) => surface(512, 512, ctx => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 3) {
      ctx.strokeStyle = threads;
      ctx.globalAlpha = .08 + rng() * .18;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.strokeStyle = '#1e1c1b';
      ctx.globalAlpha = .06 + rng() * .08;
      ctx.fillRect(x, 0, 1, 512);
    }
  });
  const concrete = surface(768, 768, ctx => {
    ctx.fillStyle = '#777c7d';
    ctx.fillRect(0, 0, 768, 768);
    for (let i = 0; i < 12000; i++) {
      const size = 1 + rng() * 4;
      ctx.globalAlpha = .02 + rng() * .11;
      ctx.fillStyle = i % 2 ? '#303c46' : '#b8aea1';
      ctx.fillRect(rng() * 768, rng() * 768, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#5a6265';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 768, 768);
  });
  concrete.wrapS = concrete.wrapT = T.RepeatWrapping;
  concrete.repeat.set(6, 5);
  const fabric = weave('#b99069', '#f2d1a1');
  const felt = weave('#34524f', '#94a59b');
  return {
    oak: material('#fff1dd', { map: grain('#b67a4b', '#57301d'), roughness: .48 }),
    walnut: material('#fff1dd', { map: grain('#765039', '#301e17'), roughness: .50 }),
    concrete: material('#cbd1d3', { map: concrete, roughness: .59 }),
    fabric: material('#ffffff', { map: fabric, side: T.DoubleSide, roughness: .97 }),
    felt: material('#ffffff', { map: felt, roughness: .94 }),
    brass: material('#b88a52', { metalness: .46, roughness: .39 }),
    steel: material('#29343d', { metalness: .44, roughness: .38 }),
    warm: new T.MeshBasicMaterial({ color: '#ffd8a0' }),
  };
}
