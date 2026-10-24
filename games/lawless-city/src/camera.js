// Câmera em 3ª pessoa: segue o jogador a pé ou o carro, com suavização e anti-parede.
import * as THREE from 'three';
import { clamp, damp, angleDiff } from './config.js';
import { raycastStatic } from './collision.js';

export class FollowCam {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.yaw = 0; // para onde a câmera olha (heading)
    this.pitch = 0.32;
    this.dist = 5.2;
    this.curDist = 5.2;
    this.target = new THREE.Vector3();
    this.pos = new THREE.Vector3();
    this.shake = 0;
    this.mouseT = 0; // tempo desde o último movimento do mouse
    this.fov = 60;
    this.first = true;
  }
  kick(a) { this.shake = Math.min(1, this.shake + a); }
  onMouse(dx, dy) {
    this.yaw -= dx * 0.0026;
    this.pitch = clamp(this.pitch + dy * 0.002, -0.05, 1.1);
    this.mouseT = 0;
  }
  snap() { this.first = true; }

  update(dt, player) {
    this.mouseT += dt;
    const car = player.car;
    let tx, ty, tz, dist, height, wantFov;
    if (car) {
      // atrás do carro; recentra sozinho depois que o mouse para
      const sp = car.speed;
      let goal = car.h;
      if (car.vF < -1.5) goal = car.h; // de ré continua olhando para a frente do carro
      if (this.mouseT > 1.2 || sp > 3) this.yaw += angleDiff(this.yaw, goal) * (1 - Math.exp(-(sp > 3 ? 4 : 2) * dt));
      if (this.mouseT > 1.2) this.pitch = damp(this.pitch, 0.24, 2, dt);
      tx = car.x; ty = car.y + 1.4; tz = car.z;
      dist = 8.5 + car.hl * 0.6 + clamp(sp * 0.09, 0, 3);
      height = 0;
      wantFov = 62 + clamp(sp * 0.35, 0, 14);
    } else {
      // a pé: recentra atrás do personagem enquanto ele corre
      if (player.moving && this.mouseT > 1.0) this.yaw += angleDiff(this.yaw, player.h) * (1 - Math.exp(-1.6 * dt));
      tx = player.x; ty = player.y + 1.55; tz = player.z;
      dist = 5.0;
      height = 0;
      wantFov = 60;
    }
    if (this.first) { this.target.set(tx, ty, tz); this.yaw = car ? car.h : player.h; this.curDist = dist; }
    // alvo com suavização leve (sem tremer)
    const k = car ? 18 : 22;
    this.target.x = damp(this.target.x, tx, k, dt);
    this.target.y = damp(this.target.y, ty, 10, dt);
    this.target.z = damp(this.target.z, tz, k, dt);
    if (car) {
      // garante que o carro nunca fique para trás do alvo em alta velocidade
      this.target.x = tx + clamp(this.target.x - tx, -1.5, 1.5);
      this.target.z = tz + clamp(this.target.z - tz, -1.5, 1.5);
    }
    // anti-parede: aproxima a câmera se houver prédio no caminho
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    const bx = -Math.sin(this.yaw) * cp, bz = -Math.cos(this.yaw) * cp;
    const hit = raycastStatic(this.world, this.target.x, this.target.y, this.target.z, bx, sp, bz, dist + 0.5);
    let want = dist;
    if (hit) want = Math.max(1.6, hit.t * Math.hypot(bx, bz) - 0.4);
    // encolhe rápido, volta devagar
    this.curDist = want < this.curDist ? damp(this.curDist, want, 25, dt) : damp(this.curDist, want, 3, dt);
    if (this.first) { this.curDist = want; this.first = false; }
    const d = this.curDist;
    this.pos.set(this.target.x + bx * d, this.target.y + sp * d + height, this.target.z + bz * d);
    if (this.pos.y < 0.4) this.pos.y = 0.4;
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.target.x, this.target.y, this.target.z);
    // tremor
    if (this.shake > 0.001) {
      const s = this.shake * this.shake * 0.5;
      this.camera.rotation.x += (Math.random() - 0.5) * s * 0.12;
      this.camera.rotation.y += (Math.random() - 0.5) * s * 0.12;
      this.shake = damp(this.shake, 0, 6, dt);
    }
    this.fov = damp(this.fov, wantFov, 3, dt);
    if (Math.abs(this.camera.fov - this.fov) > 0.05) { this.camera.fov = this.fov; this.camera.updateProjectionMatrix(); }
  }
}
