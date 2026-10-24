// Áudio: amostras Kenney + sons sintetizados (tiro, motor, buzina, freio, gritos).
import { Assets, SOUND_FILES } from './assets.js';
import { clamp, rand, pick } from './config.js';

export class Audio {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.listener = { x: 0, z: 0 };
    this.engines = new Set();
  }
  async init() {
    if (this.ctx) return;
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
    this.master = ctx.createGain();
    this.master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.noise = this._noiseBuffer(1.5);
    await Promise.all(SOUND_FILES.map(async (n) => {
      try { this.buffers[n] = await ctx.decodeAudioData(Assets.sound(n).slice(0)); } catch { /* ignora */ }
    }));
    this._ambience();
  }
  _noiseBuffer(sec) {
    const b = this.ctx.createBuffer(1, this.ctx.sampleRate * sec, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  suspend() { this.ctx && this.ctx.suspend(); }
  resume() { this.ctx && this.ctx.resume(); }
  setListener(x, z) { this.listener.x = x; this.listener.z = z; }

  // volume e pan conforme a posição
  _spatial(x, z, range = 60) {
    if (x === undefined) return { vol: 1, pan: 0 };
    const dx = x - this.listener.x, dz = z - this.listener.z, d = Math.hypot(dx, dz);
    const vol = clamp(1 - d / range, 0, 1) ** 1.6;
    return { vol, pan: clamp(dx / 25, -0.8, 0.8) };
  }
  _out(vol, pan) {
    const g = this.ctx.createGain(); g.gain.value = vol;
    const p = this.ctx.createStereoPanner(); p.pan.value = pan;
    g.connect(p).connect(this.sfx);
    return g;
  }
  sample(name, { x, z, vol = 1, rate = 1, range = 60 } = {}) {
    if (!this.ctx) return;
    const buf = this.buffers[name]; if (!buf) return;
    const s = this._spatial(x, z, range); if (s.vol * vol < 0.01) return;
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
    src.connect(this._out(s.vol * vol, s.pan)); src.start();
  }
  rand(prefix, n, opts) { this.sample(`${prefix}${String(Math.floor(Math.random() * n)).padStart(3, '0')}`, opts); }

  gunshot(x, z) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, s = this._spatial(x, z, 140); if (s.vol < 0.01) return;
    const out = this._out(s.vol, s.pan);
    // estalo
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.setValueAtTime(9000, t); bp.frequency.exponentialRampToValueAtTime(600, t + 0.18);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    n.connect(bp).connect(g).connect(out); n.start(t, Math.random()); n.stop(t + 0.4);
    // corpo grave
    const o = this.ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    const og = this.ctx.createGain(); og.gain.setValueAtTime(0.9, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(og).connect(out); o.start(t); o.stop(t + 0.2);
    // eco da cidade
    const e = this.ctx.createBufferSource(); e.buffer = this.noise;
    const el = this.ctx.createBiquadFilter(); el.type = 'bandpass'; el.frequency.value = 900; el.Q.value = 0.7;
    const eg = this.ctx.createGain(); eg.gain.setValueAtTime(0, t); eg.gain.linearRampToValueAtTime(0.12, t + 0.08); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    e.connect(el).connect(eg).connect(out); e.start(t, Math.random()); e.stop(t + 0.8);
    this.sample('metalLatch', { x, z, vol: 0.25, rate: 1.6 });
  }
  ricochet(x, z, metal) {
    if (metal) this.rand('impactMetal_light_', 3, { x, z, vol: 0.6, rate: rand(1, 1.4) });
    else this.rand('impactGeneric_light_', 3, { x, z, vol: 0.7, rate: rand(0.9, 1.2) });
  }
  hitBody(x, z) {
    this.rand('impactPunch_heavy_', 3, { x, z, vol: 0.9, rate: rand(0.9, 1.1) });
  }
  crash(x, z, strength) {
    const v = clamp(strength, 0.15, 1);
    if (v > 0.5) this.rand('impactMetal_heavy_', 3, { x, z, vol: v, rate: rand(0.85, 1.05) });
    else this.rand('impactMetal_medium_', 2, { x, z, vol: v + 0.2, rate: rand(0.9, 1.1) });
    if (v > 0.65) this.sample('impactGlass_light_000', { x, z, vol: v * 0.6, rate: rand(0.9, 1.1) });
  }
  runOver(x, z, strength) {
    const v = clamp(strength, 0.3, 1);
    this.rand('impactPunch_heavy_', 3, { x, z, vol: v, rate: rand(0.7, 0.9) });
    this.rand('impactSoft_heavy_', 2, { x, z, vol: v, rate: rand(0.9, 1.1) });
    this.sample('impactPlate_medium_000', { x, z, vol: v * 0.5, rate: 0.8 });
  }
  thud(x, z) { this.rand('impactSoft_heavy_', 2, { x, z, vol: 0.5, rate: rand(0.9, 1.2) }); }
  footstep(x, z) { this.rand('footstep_concrete_', 5, { x, z, vol: 0.28, rate: rand(0.95, 1.15), range: 25 }); }
  door(x, z, open) {
    if (open) this.sample('metalLatch', { x, z, vol: 0.7, rate: 1 });
    else this.sample('doorClose_1', { x, z, vol: 0.8, rate: 1.1 });
  }
  whoosh(x, z) { this.sample('woosh1', { x, z, vol: 0.5, rate: rand(0.9, 1.2) }); }

  scream(x, z, female) {
    if (!this.ctx) return;
    const s = this._spatial(x, z, 50); if (s.vol < 0.02) return;
    const t = this.ctx.currentTime, out = this._out(s.vol * 0.22, s.pan);
    const base = (female ? 520 : 300) * rand(0.85, 1.2), dur = rand(0.35, 0.7);
    const o = this.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(base, t); o.frequency.linearRampToValueAtTime(base * rand(1.3, 1.7), t + dur * 0.3); o.frequency.exponentialRampToValueAtTime(base * 0.75, t + dur);
    const vib = this.ctx.createOscillator(); vib.frequency.value = rand(6, 9); const vg = this.ctx.createGain(); vg.gain.value = base * 0.04; vib.connect(vg).connect(o.frequency);
    const f1 = this.ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = female ? 1100 : 800; f1.Q.value = 3;
    const f2 = this.ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = female ? 2600 : 1900; f2.Q.value = 4;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.04); g.gain.setValueAtTime(1, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(f1).connect(g); o.connect(f2).connect(g); g.connect(out);
    o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  }
  horn(x, z) {
    if (!this.ctx) return;
    const s = this._spatial(x, z, 80); if (s.vol < 0.02) return;
    const t = this.ctx.currentTime, out = this._out(s.vol * 0.18, s.pan), dur = rand(0.25, 0.6);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.02); g.gain.setValueAtTime(1, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 0.05);
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
    for (const f of [392, 494]) { const o = this.ctx.createOscillator(); o.type = 'square'; o.frequency.value = f * rand(0.97, 1.03); o.connect(lp); o.start(t); o.stop(t + dur + 0.1); }
    lp.connect(g).connect(out);
  }
  skid(x, z, vol) {
    if (!this.ctx) return;
    const s = this._spatial(x, z, 60); if (s.vol * vol < 0.02) return;
    const t = this.ctx.currentTime, out = this._out(s.vol * vol * 0.25, s.pan);
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = rand(1800, 2400); bp.Q.value = 8;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.03); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    n.connect(bp).connect(g).connect(out); n.start(t, Math.random()); n.stop(t + 0.3);
  }
  _ambience() {
    // ruído urbano baixo
    const n = this.ctx.createBufferSource(); n.buffer = this.noise; n.loop = true;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400;
    const g = this.ctx.createGain(); g.gain.value = 0.035;
    n.connect(lp).connect(g).connect(this.master); n.start();
    this._birdTimer = 0;
  }
  // Motor sintetizado: duas serras + filtro; tom e volume seguem a rotação.
  createEngine(isPlayer) {
    if (!this.ctx) return null;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = ctx.createGain(); out.gain.value = 0;
    const pan = ctx.createStereoPanner();
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; lp.Q.value = 2;
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth';
    const o2 = ctx.createOscillator(); o2.type = 'square';
    const o3 = ctx.createOscillator(); o3.type = 'sine';
    const g1 = ctx.createGain(); g1.gain.value = 0.5; const g2 = ctx.createGain(); g2.gain.value = 0.22; const g3 = ctx.createGain(); g3.gain.value = 0.7;
    // "batida" dos cilindros
    const am = ctx.createOscillator(); am.type = 'sine'; const amg = ctx.createGain(); amg.gain.value = 0.25;
    const amBias = ctx.createGain(); amBias.gain.value = 0.75;
    const mod = ctx.createGain(); mod.gain.value = 0;
    am.connect(amg).connect(mod.gain);
    const one = ctx.createConstantSource(); one.offset.value = 0.75; one.connect(mod.gain);
    o1.connect(g1).connect(lp); o2.connect(g2).connect(lp); o3.connect(g3).connect(lp);
    lp.connect(mod).connect(out).connect(pan).connect(this.sfx);
    for (const o of [o1, o2, o3, am, one]) o.start(t);
    const e = { out, pan, lp, o1, o2, o3, am, isPlayer, alive: true, nodes: [o1, o2, o3, am, one], amBias };
    this.engines.add(e);
    return e;
  }
  updateEngine(e, { rpm, throttle, x, z, on = true }) {
    if (!e || !e.alive) return;
    const t = this.ctx.currentTime;
    const f = 32 + rpm * 95; // 0..1 -> 32..127 Hz
    e.o1.frequency.setTargetAtTime(f, t, 0.05);
    e.o2.frequency.setTargetAtTime(f * 0.5, t, 0.05);
    e.o3.frequency.setTargetAtTime(f * 0.5, t, 0.05);
    e.am.frequency.setTargetAtTime(f * 0.25, t, 0.05);
    e.lp.frequency.setTargetAtTime(300 + rpm * 1400 + throttle * 600, t, 0.08);
    let vol;
    if (e.isPlayer) vol = on ? 0.13 + rpm * 0.12 + throttle * 0.07 : 0;
    else { const s = this._spatial(x, z, 45); vol = on ? s.vol * (0.05 + rpm * 0.05) : 0; e.pan.pan.setTargetAtTime(s.pan, t, 0.1); }
    e.out.gain.setTargetAtTime(vol, t, 0.08);
  }
  stopEngine(e) {
    if (!e || !e.alive) return;
    e.alive = false;
    const t = this.ctx.currentTime;
    e.out.gain.setTargetAtTime(0, t, 0.08);
    for (const n of e.nodes) n.stop(t + 0.5);
    this.engines.delete(e);
  }
  startEngineCrank(x, z) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, out = this._out(0.25, 0);
    const o = this.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(20, t); o.frequency.linearRampToValueAtTime(70, t + 0.35);
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.1); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + 0.55);
    void x; void z; void pick;
  }
}
