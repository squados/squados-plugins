// Cidade Sem Lei — ponto de entrada: cena, laço do jogo, colisões dinâmicas, menu, pausa e HUD.
import * as THREE from 'three';
import { Assets, DEBRIS } from './assets.js';
import { CFG, clamp, rand, pick, groundHeight } from './config.js';
import { World, circleVsObb } from './collision.js';
import { buildCity } from './city.js';
import { Audio } from './audio.js';
import { FX } from './fx.js';
import { Player } from './player.js';
import { PedSystem } from './peds.js';
import { Traffic } from './traffic.js';
import { collideCars } from './vehicle.js';
import { FollowCam } from './camera.js';

const $ = (id) => document.getElementById(id);

class Game {
  constructor() {
    this.state = 'loading'; // loading | menu | play | pause
    this.cars = [];
    this.debris = [];
    this.keys = new Set();
    this.mouseDown = false;
    this.time = 0;
    this.fpsT = 0; this.fpsN = 0; this.fps = 0;
    this.audio = new Audio();
    this.initRenderer();
  }

  initRenderer() {
    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    r.setSize(window.innerWidth, window.innerHeight);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    $('app').appendChild(r.domElement);
    this.canvas = r.domElement;

    const scene = (this.scene = new THREE.Scene());
    scene.fog = new THREE.Fog(0xcfe3f2, 90, 260);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);

    // céu em gradiente
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(500, 24, 12),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { top: { value: new THREE.Color(0x4f9fe8) }, bottom: { value: new THREE.Color(0xd8ecf8) } },
        vertexShader: 'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h=clamp(vP.y*1.6+0.05,0.0,1.0); gl_FragColor=vec4(mix(bottom,top,pow(h,0.8)),1.0); }',
      })
    );
    sky.renderOrder = -1;
    this.sky = sky;
    scene.add(sky);

    scene.add(new THREE.HemisphereLight(0xdcefff, 0x8a7f6a, 1.5));
    const sun = (this.sun = new THREE.DirectionalLight(0xfff1d6, 2.6));
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -60; sc.right = 60; sc.top = 60; sc.bottom = -60; sc.near = 1; sc.far = 260;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    scene.add(sun, sun.target);
    this.sunOff = new THREE.Vector3(55, 95, 35);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.fx && this.fx.setPixelScale(window.innerHeight);
    });
  }

  async load() {
    await Assets.loadAll((f) => { $('bar').style.width = `${Math.round(f * 100)}%`; });
    this.world = new World(8);
    this.city = buildCity(this.scene, this.world);
    this.fx = new FX(this.scene);
    this.fx.setPixelScale(window.innerHeight);
    this.cam = new FollowCam(this.camera, this.world);

    // jogador surge na calçada de uma rua, de frente para ela, com carros estacionados por perto
    const sx = -60 + 20, sz = CFG.RING - 0.8;
    this.player = new Player(this, sx, sz, Math.PI / 2 + Math.PI / 2);
    this.player.h = Math.PI; // olha para a rua (-Z)
    this.player.sync();
    this.peds = new PedSystem(this, 42);
    this.traffic = new Traffic(this, { moving: 18, parked: 24 });
    this.traffic.spawnInitial(sx, sz);
    this.peds.spawnAll(sx, sz);
    this.cam.yaw = this.player.h;
    this.cam.snap();
    this.cam.update(0.016, this.player);
    this.updateSun();

    // pré-compila shaders e sobe texturas para a GPU antes do jogo começar
    this.renderer.compile(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);

    this.bindInput();
    this.state = 'menu';
    $('loading').classList.add('hidden');
    $('start').classList.remove('hidden');
    this.last = performance.now();
    this.renderer.setAnimationLoop(() => this.frame());
    window.ready = true;
  }

  // ---------- entrada ----------
  bindInput() {
    const map = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
    this.input = { up: false, down: false, left: false, right: false, fire: false, brake: false };
    window.addEventListener('keydown', (e) => {
      if (e.repeat) { if (map[e.code] || e.code === 'Space') e.preventDefault(); return; }
      if (this.state === 'menu' && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); this.start(); return; }
      if (this.state === 'pause' && (e.code === 'Enter' || e.code === 'KeyP' || e.code === 'Escape')) { e.preventDefault(); this.resume(); return; }
      if (this.state !== 'play') return;
      if (e.code === 'KeyP' || e.code === 'Escape') { e.preventDefault(); this.pause(); return; }
      if (e.code === 'KeyE' || e.code === 'KeyF') {
        if (this.player.car) this.player.exitCar();
        else if (this.player.onFoot) this.player.tryEnter();
      }
      if (e.code === 'KeyH' && this.player.car) this.audio.horn(this.player.car.x, this.player.car.z);
      this.keys.add(e.code);
      if (map[e.code] || e.code === 'Space') e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.mouseDown = false; if (this.state === 'play') this.pause(); });
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state !== 'play') return;
      if (document.pointerLockElement !== this.canvas) this.lock();
      if (e.button === 0) this.mouseDown = true;
    });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) this.mouseDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (this.state === 'play' && document.pointerLockElement === this.canvas) this.cam.onMouse(e.movementX, e.movementY);
    });
    document.addEventListener('pointerlockchange', () => {
      // Esc solta o mouse: pausa
      if (document.pointerLockElement !== this.canvas && this.state === 'play' && this.wasLocked) this.pause();
      this.wasLocked = document.pointerLockElement === this.canvas;
    });
    $('start').addEventListener('click', () => this.start());
    $('pause').addEventListener('click', () => this.resume());
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  lock() {
    try {
      const p = this.canvas.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) p.catch(() => { try { this.canvas.requestPointerLock(); } catch { /* sem mouse travado */ } });
    } catch { /* sem mouse travado: teclado continua funcionando */ }
  }
  readInput() {
    const k = this.keys, i = this.input;
    i.up = k.has('KeyW') || k.has('ArrowUp');
    i.down = k.has('KeyS') || k.has('ArrowDown');
    i.left = k.has('KeyA') || k.has('ArrowLeft');
    i.right = k.has('KeyD') || k.has('ArrowRight');
    i.brake = k.has('Space');
    i.fire = this.mouseDown || (k.has('Space') && !this.player.car) || k.has('KeyJ');
    return i;
  }

  async start() {
    if (this.state !== 'menu') return;
    $('start').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('hud').classList.remove('hidden');
    this.state = 'play';
    this.lock();
    await this.audio.init();
    this.audio.resume();
    this.last = performance.now();
    this.showHint('Corra com WASD e atire com o clique. Chegue perto de um carro e aperte E.', 6);
  }
  pause() {
    if (this.state !== 'play') return;
    this.state = 'pause';
    this.keys.clear(); this.mouseDown = false;
    $('menu').classList.remove('hidden');
    $('pause').classList.remove('hidden');
    $('hud').classList.add('hidden');
    this.audio.suspend();
    if (document.pointerLockElement) document.exitPointerLock();
  }
  resume() {
    if (this.state !== 'pause') return;
    this.state = 'play';
    $('menu').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('hud').classList.remove('hidden');
    this.audio.resume();
    this.lock();
    this.last = performance.now();
  }

  // ---------- laço ----------
  frame() {
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 1 / 30);
    this.fpsN++; this.fpsT += dt;
    if (this.fpsT >= 0.5) { this.fps = Math.round(this.fpsN / ((now - (this.fpsStart || now)) / 1000 || 1)); this.fpsStart = now; this.fpsN = 0; this.fpsT = 0; $('fps').textContent = `${this.fps} fps`; }
    if (this.state === 'play') this.update(dt);
    else if (this.state === 'menu') this.menuCam(dt);
    this.renderer.render(this.scene, this.camera);
  }

  menuCam(dt) {
    // câmera passeando sobre a cidade no menu, com o mundo vivo ao fundo
    this.time += dt;
    this.traffic.update(dt);
    this.stepCars(dt);
    this.peds.update(dt, this.camera);
    this.fx.update(dt);
    const a = this.time * 0.05;
    const px = this.player.x, pz = this.player.z;
    this.camera.position.set(px + Math.sin(a) * 34, 17, pz + Math.cos(a) * 34);
    this.camera.lookAt(px, 2, pz);
    this.player.cm.update(dt);
    this.player.poseArm();
    this.audio.setListener(px, pz);
  }

  update(dt) {
    this.time += dt;
    const p = this.player;
    const inp = this.readInput();
    p.update(dt, inp);
    this.traffic.update(dt);
    this.stepCars(dt);
    this.peds.update(dt, this.camera);
    p.cm.update(dt);
    if (!p.car) p.poseArm();
    this.updateDebris(dt);
    if (p.car) {
      const c = p.car;
      this.audio.updateEngine(p.engine, { rpm: c.rpm, throttle: Math.abs(c.input.throttle) });
      if (c.skidding > 0) {
        this.skidT = (this.skidT || 0) - dt;
        if (this.skidT <= 0) { this.skidT = 0.12; this.audio.skid(c.x, c.z, c.skidding); }
        for (const s of [-1, 1]) {
          const [wx, wz] = c.toWorld(s * c.hw * 0.8, c.rearZ);
          if (Math.random() < 0.6) this.fx.smoke(wx, 0.2, wz, { size: 0.45, alpha: 0.4, rise: 0.4, spread: 0.1, life: 0.9 });
        }
      }
    }
    this.cam.update(dt, p);
    this.audio.setListener(p.car ? p.car.x : p.x, p.car ? p.car.z : p.z);
    this.fx.update(dt);
    this.updateSun();
    this.updateHud(dt);
  }

  updateSun() {
    const p = this.player;
    const x = p.car ? p.car.x : p.x, z = p.car ? p.car.z : p.z;
    // alinha a sombra à grade de texels para não "tremer"
    const step = 120 / 2048;
    const sx = Math.round(x / step) * step, sz = Math.round(z / step) * step;
    this.sun.position.set(sx + this.sunOff.x, this.sunOff.y, sz + this.sunOff.z);
    this.sun.target.position.set(sx, 0, sz);
    this.sky.position.set(this.camera.position.x, 0, this.camera.position.z);
  }

  stepCars(dt) {
    const steps = dt > 1 / 70 ? 2 : 1;
    const h = dt / steps;
    const cars = this.cars;
    for (let s = 0; s < steps; s++) {
      for (const c of cars) {
        if (!c.driver && !c.ai && c.speed < 0.02 && Math.abs(c.w) < 0.02) { c.vx = c.vz = c.w = 0; continue; }
        c.step(h);
        c.collideStatic(this.world, (car, impact, px, pz, item) => this.onStaticHit(car, impact, px, pz, item));
      }
      for (let i = 0; i < cars.length; i++)
        for (let j = i + 1; j < cars.length; j++) collideCars(cars[i], cars[j], (a, b, impact, px, pz) => this.onCarHit(a, b, impact, px, pz));
      this.runOvers();
    }
    const L = CFG.WALL - 1;
    for (const c of cars) {
      // segurança extra: nada sai do mapa
      if (Math.abs(c.x) > L || Math.abs(c.z) > L) { c.x = clamp(c.x, -L, L); c.z = clamp(c.z, -L, L); c.vx *= -0.3; c.vz *= -0.3; }
      c.updateEngine(dt);
      c.updateVisual(dt);
      c.effects(dt, this.fx);
    }
  }

  isPlayerCar(c) { return this.player && this.player.car === c; }

  onStaticHit(car, impact, px, pz, item) {
    if (impact < 2.5) return;
    const now = this.time;
    if (now - car.lastCrash < 0.25) return;
    car.lastCrash = now;
    const k = clamp(impact / 22, 0, 1);
    car.damage = Math.min(1, car.damage + k * 0.25);
    this.audio.crash(px, pz, k);
    const nx = car.x - px, nz = car.z - pz, l = Math.hypot(nx, nz) || 1;
    this.fx.sparks(px, 0.6, pz, nx / l, nz / l, Math.round(6 + k * 20));
    this.fx.dust(px, 0.8, pz, nx / l, nz / l, Math.round(4 + k * 8));
    if (impact > 9) this.spawnDebris(px, pz, nx / l, nz / l, impact);
    if (impact > 12) this.fx.word('CRASH!', px, 3, pz, 1.1);
    if (this.isPlayerCar(car)) this.cam.kick(0.25 + k);
    if (car.ai) { car.ai.panic = Math.max(car.ai.panic, 2); }
    void item;
  }

  onCarHit(a, b, impact, px, pz) {
    if (impact < 2) return;
    const now = this.time;
    if (now - a.lastCrash < 0.25 && now - b.lastCrash < 0.25) return;
    a.lastCrash = b.lastCrash = now;
    const k = clamp(impact / 22, 0, 1);
    a.damage = Math.min(1, a.damage + k * 0.2);
    b.damage = Math.min(1, b.damage + k * 0.2);
    this.audio.crash(px, pz, k);
    const nx = a.x - b.x, nz = a.z - b.z, l = Math.hypot(nx, nz) || 1;
    this.fx.sparks(px, 0.7, pz, nx / l, nz / l, Math.round(8 + k * 20));
    if (impact > 8) this.spawnDebris(px, pz, nx / l, nz / l, impact);
    if (impact > 11) this.fx.word('CRASH!', px, 3, pz, 1.1);
    if (this.isPlayerCar(a) || this.isPlayerCar(b)) this.cam.kick(0.2 + k);
    for (const c of [a, b]) if (c.ai) { c.ai.panic = Math.max(c.ai.panic, rand(3, 6)); if (Math.random() < 0.7) this.audio.horn(c.x, c.z); }
    // pedestres próximos se assustam
    if (impact > 6) this.peds.alarm(px, pz, 18);
  }

  runOvers() {
    for (const c of this.cars) {
      const sp = c.speed;
      if (sp < 1.2) continue;
      for (const p of this.peds.list) {
        if (!p.vulnerable) continue;
        const dx = p.x - c.x, dz = p.z - c.z;
        if (dx * dx + dz * dz > (c.hl + 1) ** 2) continue;
        const col = circleVsObb(p.x, p.z, 0.36, c.obb);
        if (!col) continue;
        this.runOver(c, p, sp);
      }
    }
  }

  runOver(c, p, sp) {
    const k = clamp(sp / 25, 0, 1);
    const [fx, fz] = [c.vx / sp, c.vz / sp];
    // direção: velocidade do carro + saída lateral para fora do capô
    const dx = p.x - c.x, dz = p.z - c.z, l = Math.hypot(dx, dz) || 1;
    if (sp < 5) {
      // empurrãozinho: só cai
      p.knock(fx * (sp + 1.5) + (dx / l) * 1.5, 1.5, fz * (sp + 1.5) + (dz / l) * 1.5, false);
      this.audio.thud(p.x, p.z);
      this.fx.word('TUM!', p.x, 2.3, p.z, 0.7);
    } else {
      const up = 3 + sp * 0.38;
      const fwd = sp * (1.05 + rand(0, 0.25));
      p.knock(fx * fwd + (dx / l) * sp * 0.25, up, fz * fwd + (dz / l) * sp * 0.25, true);
      this.audio.runOver(p.x, p.z, k + 0.2);
      this.fx.word(sp > 14 ? 'POW!' : 'PLOFT!', p.x, 2.6, p.z, 1 + k * 0.6);
      this.fx.puff(p.x, 0.6, p.z);
      this.fx.confetti(p.x, 1.2, p.z, 18);
      // o carro perde um pouco de velocidade
      c.vx *= 0.9; c.vz *= 0.9;
      c.damage = Math.min(1, c.damage + 0.02);
      if (this.isPlayerCar(c)) this.cam.kick(0.25 + k * 0.5);
    }
    this.audio.scream(p.x, p.z, p.cm.female);
    this.peds.alarm(p.x, p.z, 22);
  }

  spawnDebris(x, z, nx, nz, impact) {
    const n = impact > 16 ? 3 : impact > 11 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const key = pick(DEBRIS);
      const o = Assets.clone(key);
      o.scale.setScalar(CFG.CAR_SCALE);
      o.position.set(x, 0.7, z);
      this.scene.add(o);
      const s = rand(3, 7);
      this.debris.push({ o, vx: (nx + rand(-0.8, 0.8)) * s, vy: rand(3, 7), vz: (nz + rand(-0.8, 0.8)) * s, wx: rand(-8, 8), wz: rand(-8, 8), life: 12 });
    }
    while (this.debris.length > 24) { const d = this.debris.shift(); d.o.removeFromParent(); }
  }

  updateDebris(dt) {
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      if (d.life <= 0) { d.o.removeFromParent(); this.debris.splice(i, 1); continue; }
      const gh = groundHeight(d.o.position.x, d.o.position.z) + 0.05;
      if (d.o.position.y > gh || d.vy > 0) {
        d.vy -= 20 * dt;
        d.o.position.x += d.vx * dt; d.o.position.y += d.vy * dt; d.o.position.z += d.vz * dt;
        d.o.rotation.x += d.wx * dt; d.o.rotation.z += d.wz * dt;
        if (d.o.position.y <= gh) {
          d.o.position.y = gh;
          if (d.vy < -3) { d.vy *= -0.3; d.vx *= 0.5; d.vz *= 0.5; d.wx *= 0.4; d.wz *= 0.4; this.audio.sample('impactPlate_light_000', { x: d.o.position.x, z: d.o.position.z, vol: 0.4 }); }
          else { d.vy = 0; d.vx = d.vz = 0; d.o.rotation.x = Math.round(d.o.rotation.x / Math.PI) * Math.PI; d.o.rotation.z = Math.round(d.o.rotation.z / Math.PI) * Math.PI; }
        }
      }
      if (d.life < 1) d.o.scale.setScalar(CFG.CAR_SCALE * d.life);
    }
  }

  // ---------- HUD ----------
  showHint(text, sec = 3) {
    this.tempHint = text;
    this.tempHintT = sec;
  }
  onModeChange() {
    const inCar = !!this.player.car;
    $('ctl-foot').classList.toggle('hidden', inCar);
    $('ctl-car').classList.toggle('hidden', !inCar);
    $('speed').classList.toggle('hidden', !inCar);
    if (inCar && !this.carTipShown) { this.carTipShown = true; this.showHint('W acelera, S freia e dá ré, A/D esterçam. Espaço puxa o freio de mão.', 5); }
    this.cam.mouseT = 5;
  }
  updateHud(dt) {
    const p = this.player;
    let hint = '';
    if (this.tempHintT > 0) { this.tempHintT -= dt; hint = this.tempHint; }
    if (p.onFoot) {
      const c = p.nearestCar();
      if (c) {
        if (!p.canEnter(c)) hint = 'O carro está rápido demais para entrar';
        else hint = c.driver === 'ai' ? '<b>E</b> — roubar o carro (o motorista vai pra rua!)' : '<b>E</b> — entrar no carro';
      }
    } else if (p.car) {
      const c = p.car;
      if (c.speed < 1.5 && Math.abs(c.input.throttle) < 0.05 && !this.tempHintT) hint = 'Motor em marcha lenta. <b>W</b> acelera · <b>E</b> sai do carro';
      $('speed').innerHTML = `${Math.round(c.speed * 3.6)}<small>km/h</small>`;
    }
    if (hint !== this.lastHint) {
      this.lastHint = hint;
      $('hint').innerHTML = hint;
      $('hint').classList.toggle('hidden', !hint);
    }
  }
}

const game = new Game();
window.game = game;
game.load().catch((e) => {
  console.error(e);
  $('loading').textContent = 'Erro ao carregar: ' + e.message;
});
void THREE;
