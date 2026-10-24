// Efeitos visuais: partículas, clarão do cano, rastro do tiro, marcas de bala, "POW!".
import * as THREE from 'three';
import { rand, pick } from './config.js';

const MAX_P = 1500;

export class FX {
  constructor(scene) {
    this.scene = scene;
    // ---- partículas (Points com tamanho por partícula) ----
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX_P * 3);
    this.col = new Float32Array(MAX_P * 4);
    this.size = new Float32Array(MAX_P);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { scale: { value: 600 } },
      vertexShader: `attribute float size; attribute vec4 color; varying vec4 vC; uniform float scale;
        void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=size*scale/max(-mv.z,0.1); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec4 vC; void main(){ vec2 d=gl_PointCoord-0.5; float r=length(d); if(r>0.5) discard; float a=smoothstep(0.5,0.32,r); gl_FragColor=vec4(vC.rgb, vC.a*a); }`,
    });
    this.points = new THREE.Points(g, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    scene.add(this.points);
    this.parts = [];
    for (let i = 0; i < MAX_P; i++) this.parts.push({ life: 0 });
    this.next = 0;

    // ---- clarão do cano ----
    const flashTex = this._starTexture();
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, color: 0xffd27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.flash.scale.setScalar(0.9);
    this.flash.visible = false;
    scene.add(this.flash);
    this.flashLight = new THREE.PointLight(0xffb04a, 0, 9, 2);
    scene.add(this.flashLight); // sempre presente (intensidade 0) para não recompilar shaders
    this.flashT = 0;

    // ---- rastros ----
    this.tracers = [];
    const tm = new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const tg = new THREE.BoxGeometry(0.05, 0.05, 1);
    tg.translate(0, 0, 0.5);
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(tg, tm.clone());
      m.visible = false;
      scene.add(m);
      this.tracers.push({ mesh: m, t: 0 });
    }

    // ---- marcas de bala ----
    this.decals = [];
    const dg = new THREE.CircleGeometry(0.11, 10);
    const dm = new THREE.MeshBasicMaterial({ color: 0x1d1d1d, transparent: true, opacity: 0.85, polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false });
    for (let i = 0; i < 60; i++) {
      const m = new THREE.Mesh(dg, dm);
      m.visible = false;
      scene.add(m);
      this.decals.push(m);
    }
    this.decalNext = 0;

    // ---- textos cartunescos ----
    this.words = {};
    this.popups = [];
    for (const [w, c] of [['POW!', '#ffdd33'], ['BAM!', '#ff7b2e'], ['TUM!', '#ffffff'], ['CRASH!', '#ff4f4f'], ['PLOFT!', '#7be3ff'], ['AI!', '#ffffff'], ['VUPT!', '#b8ff6b']])
      this.words[w] = this._wordTexture(w, c);
    // estrelinhas de tontura
    this.starTex = this._smallStar();
  }

  _starTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,220,120,0.9)'); grd.addColorStop(1, 'rgba(255,140,0,0)');
    g.fillStyle = grd; g.beginPath();
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 22 : 64; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); }
    g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  _smallStar() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#ffe14a'; g.strokeStyle = '#7a5200'; g.lineWidth = 4; g.beginPath();
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 12 : 28; g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); }
    g.closePath(); g.fill(); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  _wordTexture(word, color) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    g.translate(128, 64); g.rotate(-0.12);
    // explosão de fundo
    g.fillStyle = '#ffffff'; g.beginPath();
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, r = i % 2 ? 40 : 60; g.lineTo(Math.cos(a) * r * 1.8, Math.sin(a) * r); }
    g.closePath(); g.fill();
    g.fillStyle = '#1a1a1a'; g.lineWidth = 5; g.stroke();
    g.font = '900 54px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 10; g.strokeStyle = '#1a1a1a'; g.strokeText(word, 0, 3);
    g.fillStyle = color; g.fillText(word, 0, 3);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  emit(x, y, z, vx, vy, vz, { life = 0.6, size = 0.15, color = [1, 1, 1], alpha = 1, gravity = -9.8, drag = 0, grow = 0 } = {}) {
    const p = this.parts[this.next];
    this.next = (this.next + 1) % MAX_P;
    p.x = x; p.y = y; p.z = z; p.vx = vx; p.vy = vy; p.vz = vz;
    p.life = p.max = life; p.size = size; p.c = color; p.a = alpha; p.g = gravity; p.drag = drag; p.grow = grow;
  }
  sparks(x, y, z, nx, nz, n = 10) {
    for (let i = 0; i < n; i++) {
      const s = rand(3, 9);
      this.emit(x, y, z, (nx + rand(-0.7, 0.7)) * s, rand(0.5, 5), (nz + rand(-0.7, 0.7)) * s, { life: rand(0.15, 0.4), size: rand(0.05, 0.1), color: [1, rand(0.7, 0.95), 0.4], gravity: -18 });
    }
  }
  dust(x, y, z, nx, nz, n = 8, color = [0.75, 0.72, 0.66]) {
    for (let i = 0; i < n; i++) {
      const s = rand(0.6, 2.4);
      this.emit(x, y, z, (nx + rand(-0.6, 0.6)) * s, rand(0.2, 1.6), (nz + rand(-0.6, 0.6)) * s, { life: rand(0.4, 0.9), size: rand(0.15, 0.35), color, alpha: 0.8, gravity: -1.5, drag: 2.5, grow: 0.5 });
    }
    for (let i = 0; i < 5; i++) this.emit(x, y, z, (nx + rand(-1, 1)) * 5, rand(1, 4), (nz + rand(-1, 1)) * 5, { life: 0.4, size: 0.06, color: [0.4, 0.38, 0.35], gravity: -15 });
  }
  smoke(x, y, z, { n = 1, size = 0.5, color = [0.85, 0.85, 0.85], alpha = 0.5, rise = 1, spread = 0.4, life = 1.2 } = {}) {
    for (let i = 0; i < n; i++)
      this.emit(x + rand(-spread, spread), y, z + rand(-spread, spread), rand(-0.4, 0.4), rise * rand(0.5, 1.2), rand(-0.4, 0.4), { life: rand(life * 0.7, life), size: size * rand(0.7, 1.2), color, alpha, gravity: 0.3, drag: 1.5, grow: 1.2 });
  }
  puff(x, y, z) {
    for (let i = 0; i < 26; i++) {
      const a = rand(0, Math.PI * 2), s = rand(1.5, 3.5);
      this.emit(x + rand(-0.3, 0.3), y + rand(0, 1.5), z + rand(-0.3, 0.3), Math.cos(a) * s, rand(0.5, 2.5), Math.sin(a) * s, { life: rand(0.5, 0.9), size: rand(0.5, 0.9), color: [0.95, 0.95, 0.97], alpha: 0.9, gravity: 0.5, drag: 3, grow: 1 });
    }
  }
  confetti(x, y, z, n = 14) {
    const cols = [[1, 0.85, 0.2], [1, 1, 1], [0.6, 0.85, 1]];
    for (let i = 0; i < n; i++) this.emit(x, y, z, rand(-3, 3), rand(2, 6), rand(-3, 3), { life: rand(0.4, 0.8), size: rand(0.08, 0.16), color: pick(cols), gravity: -14 });
  }
  muzzle(x, y, z, dx, dz) {
    this.flash.position.set(x + dx * 0.15, y, z + dz * 0.15);
    this.flash.material.rotation = Math.random() * 6;
    this.flash.scale.setScalar(rand(0.7, 1.1));
    this.flash.visible = true;
    this.flashLight.position.set(x, y + 0.2, z);
    this.flashLight.intensity = 30;
    this.flashT = 0.05;
    for (let i = 0; i < 4; i++) this.smoke(x + dx * 0.3, y, z + dz * 0.3, { size: 0.2, alpha: 0.35, rise: 0.6, spread: 0.05, life: 0.6 });
  }
  tracer(x, y, z, ex, ey, ez) {
    const t = this.tracers.find((t) => t.t <= 0) || this.tracers[0];
    const len = Math.hypot(ex - x, ey - y, ez - z);
    t.mesh.position.set(x, y, z);
    t.mesh.lookAt(ex, ey, ez);
    t.mesh.scale.set(1, 1, len);
    t.mesh.material.opacity = 0.9;
    t.mesh.visible = true;
    t.t = 0.07;
  }
  decal(x, y, z, nx, ny, nz) {
    const m = this.decals[this.decalNext];
    this.decalNext = (this.decalNext + 1) % this.decals.length;
    m.position.set(x + nx * 0.02, y + ny * 0.02, z + nz * 0.02);
    m.lookAt(x + nx, y + ny, z + nz);
    m.rotation.z = Math.random() * 6;
    m.scale.setScalar(rand(0.8, 1.2));
    m.visible = true;
  }
  word(w, x, y, z, scale = 1.6) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.words[w], transparent: true, depthTest: false }));
    s.position.set(x, y, z);
    s.renderOrder = 10;
    this.scene.add(s);
    this.popups.push({ s, t: 0, max: 0.8, scale });
  }
  dizzy(parent, height) {
    // três estrelinhas girando sobre a cabeça
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.starTex, transparent: true }));
      s.scale.setScalar(0.32);
      s.userData.a = (i / 3) * Math.PI * 2;
      g.add(s);
    }
    g.position.y = height;
    g.userData.spin = true;
    parent.add(g);
    return g;
  }
  update(dt) {
    // partículas
    let n = 0;
    const P = this.pos, C = this.col, S = this.size;
    for (const p of this.parts) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) continue;
      const k = Math.exp(-p.drag * dt);
      p.vx *= k; p.vz *= k; p.vy = p.vy * k + p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y < 0.03) { p.y = 0.03; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; }
      const f = p.life / p.max;
      P[n * 3] = p.x; P[n * 3 + 1] = p.y; P[n * 3 + 2] = p.z;
      C[n * 4] = p.c[0]; C[n * 4 + 1] = p.c[1]; C[n * 4 + 2] = p.c[2]; C[n * 4 + 3] = p.a * Math.min(1, f * 2.5);
      S[n] = p.size * (1 + p.grow * (1 - f));
      n++;
    }
    const g = this.points.geometry;
    g.setDrawRange(0, n);
    g.attributes.position.needsUpdate = g.attributes.color.needsUpdate = g.attributes.size.needsUpdate = true;
    // clarão
    if (this.flashT > 0) {
      this.flashT -= dt;
      if (this.flashT <= 0) { this.flash.visible = false; this.flashLight.intensity = 0; }
    }
    for (const t of this.tracers) {
      if (t.t <= 0) continue;
      t.t -= dt;
      t.mesh.material.opacity = Math.max(0, t.t / 0.07) * 0.9;
      if (t.t <= 0) t.mesh.visible = false;
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i];
      p.t += dt;
      const f = p.t / p.max;
      const sc = p.scale * (f < 0.15 ? f / 0.15 * 1.2 : 1.2 - (f - 0.15) * 0.3);
      p.s.scale.set(sc * 2, sc, 1);
      p.s.position.y += dt * 0.8;
      p.s.material.opacity = f > 0.7 ? 1 - (f - 0.7) / 0.3 : 1;
      if (f >= 1) { this.scene.remove(p.s); p.s.material.dispose(); this.popups.splice(i, 1); }
    }
  }
  setPixelScale(h) { this.points.material.uniforms.scale.value = h * 0.9; }
}
