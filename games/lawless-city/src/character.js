// Modelo de personagem Kenney (Mini Characters) com animações em duas camadas.
import * as THREE from 'three';
import { Assets } from './assets.js';
import { CFG } from './config.js';

// esfera de enquadramento compartilhada (evita sumiço de SkinnedMesh deitada)
const CULL_SPHERE = new THREE.Sphere(new THREE.Vector3(0, 0.3, 0), 0.75);
const filteredCache = new Map();

// Clipes sem o braço direito, para o braço ficar livre para segurar a pistola
function armlessClips(key) {
  let c = filteredCache.get(key);
  if (c) return c;
  c = Assets.gltf(`characters/${key}`).animations.map((clip) => {
    if (clip.name.startsWith('holding')) return clip;
    const tracks = clip.tracks.filter((t) => !t.name.startsWith('arm-right.'));
    return new THREE.AnimationClip(clip.name, clip.duration, tracks);
  });
  filteredCache.set(key, c);
  return c;
}

export class CharModel {
  constructor(key, { scale = 1, armless = false } = {}) {
    this.key = key;
    this.female = key.includes('female');
    this.root = new THREE.Group();
    this.tumble = new THREE.Group(); // gira o corpo quando é arremessado
    this.root.add(this.tumble);
    this.model = Assets.cloneChar(key);
    this.scale = CFG.CH_SCALE * scale;
    this.model.scale.setScalar(this.scale);
    this.height = 0.67 * this.scale;
    this.tumble.position.y = this.height * 0.45;
    this.model.position.y = -this.height * 0.45;
    this.tumble.add(this.model);
    this.mixer = new THREE.AnimationMixer(this.model);
    this.clips = armless ? armlessClips(key) : Assets.gltf(`characters/${key}`).animations;
    this.actions = {};
    this.current = null;
    this.currentName = '';
    this.upper = null;
    this.upperName = '';
    this.model.traverse((o) => {
      if (o.name === 'arm-right') this.armR = o;
      if (o.name === 'head') this.head = o;
      if (o.isMesh) {
        o.boundingSphere = CULL_SPHERE;
        o.castShadow = true;
      }
    });
  }
  action(name) {
    let a = this.actions[name];
    if (!a) {
      const clip = this.clips.find((c) => c.name === name);
      a = this.mixer.clipAction(clip);
      this.actions[name] = a;
    }
    return a;
  }
  // camada principal (corpo inteiro)
  play(name, { fade = 0.15, once = false, timeScale = 1, reverse = false } = {}) {
    if (this.currentName === name && !once && !reverse) {
      this.current.timeScale = timeScale;
      return this.current;
    }
    const a = this.action(name);
    const prev = this.current;
    a.reset();
    a.enabled = true;
    a.setEffectiveWeight(1);
    a.timeScale = reverse ? -timeScale : timeScale;
    if (once) {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    } else a.setLoop(THREE.LoopRepeat, Infinity);
    if (reverse) a.time = a.getClip().duration;
    a.play();
    if (prev && prev !== a) {
      if (fade > 0) a.crossFadeFrom(prev, fade, false);
      else prev.stop();
    }
    this.current = a;
    this.currentName = name;
    return a;
  }
  // camada do braço (segurar / atirar)
  playUpper(name, { once = false, fade = 0.06 } = {}) {
    if (this.upperName === name && !once) return;
    const a = this.action(name);
    const prev = this.upper;
    a.reset();
    a.enabled = true;
    a.setEffectiveWeight(1);
    a.timeScale = 1;
    if (once) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
    else a.setLoop(THREE.LoopRepeat, Infinity);
    a.play();
    if (prev && prev !== a) a.crossFadeFrom(prev, fade, false);
    this.upper = a;
    this.upperName = name;
  }
  isDone() {
    return this.current && !this.current.isRunning();
  }
  update(dt) {
    this.mixer.update(dt);
  }
  dispose() {
    this.mixer.stopAllAction();
    this.root.removeFromParent();
  }
}
