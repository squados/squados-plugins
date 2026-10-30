// Pulo Alto — jogo de plataforma em Canvas 2D, sem dependências nem build.
// A fase vem de level.js; sprites e sons ficam em assets/ (Kenney, CC0).
'use strict';

// ---------- Ajustes de jogo ----------
const TILE = 64;
const VIEW_W = 1280;
const VIEW_H = 768;
const GRAVITY = 2400;
const MAX_FALL = 1100;
const RUN_SPEED = 380;
const RUN_ACCEL = 2600;
const AIR_ACCEL = 1800;
const FRICTION = 2800;
const JUMP_SPEED = 1000;
const JUMP_CUT = 400;       // soltar o pulo cedo limita a subida a esta velocidade
const COYOTE_TIME = 0.1;    // ainda dá para pular logo depois de sair da borda
const JUMP_BUFFER = 0.12;   // pulo apertado pouco antes de tocar o chão vale
const SLIME_SPEED = 70;
const STOMP_BOUNCE = 650;
const MAX_HEARTS = 3;
const INVULNERABLE_TIME = 1.2;
const STEP = 1 / 120;

// ---------- Tema: troque aqui personagem, terreno, fundo, inimigo e moeda ----------
// Os nomes correspondem aos arquivos de assets/sprites/; veja "Personalizar" no README.md.
const THEME = {
  character: 'green',  // beige, green, pink, purple, yellow ou o nome de um personagem próprio
  terrain: 'grass',    // grass, dirt, purple, sand, snow, stone
  background: 'hills', // desert, hills, mushrooms, trees
  enemy: { walk: ['slime_normal_walk_a', 'slime_normal_walk_b'], defeated: 'slime_normal_flat' },
  coin: 'coin_gold',   // por exemplo gem_blue, gem_red, star ou heart
};

const character = (pose) => `character_${THEME.character}_${pose}`;
const terrain = (part) => `terrain_${THEME.terrain}_${part}`;
const backgroundHills = `background_color_${THEME.background}`;

const SPRITES = {
  backgrounds: ['background_solid_sky', 'background_clouds', backgroundHills],
  characters: ['idle', 'jump', 'walk_a', 'walk_b', 'hit'].map(character),
  enemies: [...THEME.enemy.walk, THEME.enemy.defeated],
  tiles: [
    ...['block_top_left', 'block_top', 'block_top_right', 'block_left', 'block_center', 'block_right',
      'horizontal_left', 'horizontal_middle', 'horizontal_right'].map(terrain),
    'block_coin_active', 'block_empty', 'bricks_brown', THEME.coin, 'flag_green_a', 'flag_green_b', 'flag_off',
    'bush', 'grass', 'hud_heart', 'hud_heart_empty', 'hud_character_multiply',
    ...Array.from({ length: 10 }, (_, i) => `hud_character_${i}`),
  ],
};
const SOUNDS = { jump: 'sfx_jump', coin: 'sfx_coin', bump: 'sfx_bump', hurt: 'sfx_hurt', stomp: 'sfx_disappear', win: 'sfx_magic' };

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const stage = document.getElementById('stage');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const overlayButton = document.getElementById('overlay-button');

const images = {};
const sounds = {};
const input = { left: false, right: false, jump: false };

let state = 'loading'; // loading | title | play | paused | won | over
let level, player, enemies, coins, pops, camX, time, jumpBuffer;

// ---------- Carregamento ----------
function loadImage(folder, name) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve((images[name] = img));
    img.onerror = () => reject(new Error(`sprite ausente: assets/sprites/${folder}/${name}.png`));
    img.src = `assets/sprites/${folder}/${name}.png`;
  });
}

function playSound(name) {
  const audio = sounds[name].cloneNode();
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

// ---------- Fase ----------
function parseLevel(rows) {
  const width = Math.max(...rows.map((row) => row.length));
  const result = { width, height: rows.length, grid: [], coins: [], enemies: [], decor: [], start: { x: 0, y: 0 }, flag: null, totalCoins: 0 };
  rows.forEach((row, y) => {
    result.grid.push([]);
    for (let x = 0; x < width; x++) {
      const ch = row[x] || '.';
      result.grid[y].push('#=B?'.includes(ch) ? ch : '.');
      if (ch === '?' || ch === 'o') result.totalCoins++;
      if (ch === 'o') result.coins.push({ x: x * TILE, y: y * TILE, taken: false });
      if (ch === 's') result.enemies.push({ x, y });
      if (ch === 'b' || ch === 'g') result.decor.push({ x, y, sprite: ch === 'b' ? 'bush' : 'grass' });
      if (ch === 'P') result.start = { x, y };
      if (ch === 'F') result.flag = { x, y };
    }
  });
  return result;
}

function tileAt(tx, ty) {
  if (tx < 0 || tx >= level.width) return '#'; // bordas da fase são paredes
  if (ty < 0 || ty >= level.height) return '.';
  return level.grid[ty][tx];
}

const isSolid = (tx, ty) => tileAt(tx, ty) !== '.';

function resetGame() {
  level = parseLevel(LEVEL);
  const startX = level.start.x * TILE + (TILE - 44) / 2;
  const startY = (level.start.y + 1) * TILE - 72;
  player = { x: startX, y: startY, w: 44, h: 72, vx: 0, vy: 0, onGround: true, coyote: 0, facing: 1, hearts: MAX_HEARTS, hurt: 0, coins: 0, safe: { x: startX, y: startY } };
  enemies = level.enemies.map(({ x, y }) => ({ x: x * TILE + 8, y: (y + 1) * TILE - 38, w: 48, h: 38, vx: -SLIME_SPEED, vy: 0, dead: 0 }));
  coins = level.coins;
  pops = [];
  camX = 0;
  time = 0;
  jumpBuffer = 0;
}

// ---------- Física ----------
// Move no eixo X e desfaz a sobreposição com blocos sólidos. Retorna true se bateu.
function moveX(body, dx) {
  body.x += dx;
  const top = Math.floor(body.y / TILE);
  const bottom = Math.floor((body.y + body.h - 1) / TILE);
  if (dx > 0) {
    const tx = Math.floor((body.x + body.w) / TILE);
    for (let ty = top; ty <= bottom; ty++) if (isSolid(tx, ty)) { body.x = tx * TILE - body.w; return true; }
  } else if (dx < 0) {
    const tx = Math.floor(body.x / TILE);
    for (let ty = top; ty <= bottom; ty++) if (isSolid(tx, ty)) { body.x = (tx + 1) * TILE; return true; }
  }
  return false;
}

// Move no eixo Y. Retorna a coluna do bloco atingido (ou null).
function moveY(body, dy) {
  body.y += dy;
  const left = Math.floor(body.x / TILE);
  const right = Math.floor((body.x + body.w - 1) / TILE);
  const center = Math.floor((body.x + body.w / 2) / TILE);
  if (dy > 0) {
    const ty = Math.floor((body.y + body.h) / TILE);
    for (let tx = left; tx <= right; tx++) if (isSolid(tx, ty)) { body.y = ty * TILE - body.h; return { tx, ty }; }
  } else if (dy < 0) {
    const ty = Math.floor(body.y / TILE);
    // A cabeça bate primeiro no bloco que está sobre o centro do corpo.
    const columns = [center, ...[left, right].filter((tx) => tx !== center)];
    for (const tx of columns) if (isSolid(tx, ty)) { body.y = (ty + 1) * TILE; return { tx, ty }; }
  }
  return null;
}

const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function hitBlock({ tx, ty }) {
  const tile = tileAt(tx, ty);
  if (tile === '?') {
    level.grid[ty][tx] = 'X';
    player.coins++;
    pops.push({ x: tx * TILE, y: (ty - 1) * TILE, t: 0 });
    playSound('coin');
  } else {
    playSound('bump');
  }
}

function hurtPlayer() {
  if (player.hurt > 0) return;
  player.hearts--;
  playSound('hurt');
  if (player.hearts <= 0) return endGame('over');
  player.hurt = INVULNERABLE_TIME;
  player.vy = -500;
  player.vx = -player.facing * 300;
}

function updatePlayer(dt) {
  const p = player;
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir) {
    p.facing = dir;
    p.vx += dir * (p.onGround ? RUN_ACCEL : AIR_ACCEL) * dt;
    p.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, p.vx));
  } else if (p.onGround) {
    p.vx -= Math.sign(p.vx) * Math.min(Math.abs(p.vx), FRICTION * dt);
  }

  p.coyote = p.onGround ? COYOTE_TIME : p.coyote - dt;
  jumpBuffer -= dt;
  if (jumpBuffer > 0 && p.coyote > 0) {
    p.vy = -JUMP_SPEED;
    p.coyote = 0;
    jumpBuffer = 0;
    playSound('jump');
  }
  if (!input.jump && p.vy < -JUMP_CUT) p.vy = -JUMP_CUT;

  p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
  if (moveX(p, p.vx * dt)) p.vx = 0;
  const hit = moveY(p, p.vy * dt);
  p.onGround = Boolean(hit && p.vy > 0);
  if (hit) {
    if (p.vy < 0) hitBlock(hit);
    p.vy = 0;
  }

  // Guarda o último ponto seguro sobre terreno firme para voltar depois de uma queda.
  const footY = Math.floor((p.y + p.h) / TILE);
  if (p.onGround && isSolid(Math.floor(p.x / TILE), footY) && isSolid(Math.floor((p.x + p.w - 1) / TILE), footY)) {
    p.safe = { x: p.x, y: p.y };
  }
  if (p.y > level.height * TILE) {
    hurtPlayer();
    if (state === 'play') Object.assign(p, { x: p.safe.x, y: p.safe.y, vx: 0, vy: 0, hurt: INVULNERABLE_TIME });
  }
  p.hurt = Math.max(0, p.hurt - dt);

  for (const coin of coins) {
    if (!coin.taken && overlaps(p, { x: coin.x + 14, y: coin.y + 12, w: 36, h: 40 })) {
      coin.taken = true;
      p.coins++;
      playSound('coin');
    }
  }

  if (state === 'play' && level.flag && p.x + p.w > level.flag.x * TILE + 24) endGame('won');
}

function updateEnemies(dt) {
  for (const e of enemies) {
    if (e.dead) { e.dead += dt; continue; }
    if (Math.abs(e.x - player.x) > VIEW_W) continue; // só anda perto da câmera
    e.vy = Math.min(MAX_FALL, e.vy + GRAVITY * dt);
    if (moveX(e, e.vx * dt)) e.vx = -e.vx;
    const ground = moveY(e, e.vy * dt);
    if (ground) e.vy = 0;
    // Vira na beirada em vez de cair.
    const aheadX = Math.floor((e.vx > 0 ? e.x + e.w + 1 : e.x - 1) / TILE);
    if (ground && !isSolid(aheadX, Math.floor((e.y + e.h + 1) / TILE))) e.vx = -e.vx;

    if (state === 'play' && overlaps(player, e)) {
      const wasAbove = player.y + player.h - player.vy * dt <= e.y + 12;
      if (player.vy > 0 && wasAbove) {
        e.dead = 0.001;
        player.vy = input.jump ? -JUMP_SPEED * 0.8 : -STOMP_BOUNCE;
        playSound('stomp');
      } else {
        hurtPlayer();
      }
    }
  }
  enemies = enemies.filter((e) => e.dead < 0.6);
}

function update(dt) {
  time += dt;
  updatePlayer(dt);
  updateEnemies(dt);
  pops.forEach((pop) => (pop.t += dt));
  pops = pops.filter((pop) => pop.t < 0.5);
  const target = player.x + player.w / 2 - VIEW_W / 2;
  camX = Math.max(0, Math.min(level.width * TILE - VIEW_W, target));
}

// ---------- Desenho ----------
function terrainSprite(tx, ty) {
  const ground = (x, y) => (x < 0 || x >= level.width ? true : tileAt(x, y) === '#');
  const up = ground(tx, ty - 1);
  const left = ground(tx - 1, ty);
  const right = ground(tx + 1, ty);
  if (!up) return terrain(!left && right ? 'block_top_left' : left && !right ? 'block_top_right' : 'block_top');
  return terrain(!left && right ? 'block_left' : left && !right ? 'block_right' : 'block_center');
}

function platformSprite(tx, ty) {
  const left = tileAt(tx - 1, ty) === '=';
  const right = tileAt(tx + 1, ty) === '=';
  return terrain(left && !right ? 'horizontal_right' : !left && right ? 'horizontal_left' : 'horizontal_middle');
}

const TILE_SPRITES = { B: () => 'bricks_brown', '?': () => 'block_coin_active', X: () => 'block_empty', '#': terrainSprite, '=': platformSprite };

function drawBackground() {
  ctx.drawImage(images.background_solid_sky, 0, 0, VIEW_W, VIEW_H);
  const layers = [['background_clouds', 0.2, 128], [backgroundHills, 0.45, 384]];
  for (const [name, speed, y] of layers) {
    const offset = -((camX * speed) % 512);
    for (let x = offset; x < VIEW_W; x += 512) ctx.drawImage(images[name], x, y, 512, 256);
  }
  // Estica a última linha das colinas para cobrir o fundo dos buracos.
  ctx.drawImage(images[backgroundHills], 0, 255, 256, 1, 0, 640, VIEW_W, VIEW_H - 640);
}

function drawNumber(value, x, y, size) {
  ctx.drawImage(images.hud_character_multiply, x, y, size, size);
  String(value).split('').forEach((digit, i) => ctx.drawImage(images[`hud_character_${digit}`], x + (i + 1) * size * 0.7, y, size, size));
}

function drawHud() {
  ctx.drawImage(images[THEME.coin], 24, 20, 56, 56);
  drawNumber(player.coins, 72, 20, 56);
  for (let i = 0; i < MAX_HEARTS; i++) {
    ctx.drawImage(images[i < player.hearts ? 'hud_heart' : 'hud_heart_empty'], VIEW_W - 80 - i * 52, 20, 56, 56);
  }
}

function draw() {
  drawBackground();
  ctx.save();
  ctx.translate(-Math.round(camX), 0);
  const first = Math.floor(camX / TILE);
  const last = first + Math.ceil(VIEW_W / TILE);

  for (const d of level.decor) if (d.x >= first - 1 && d.x <= last) ctx.drawImage(images[d.sprite], d.x * TILE, d.y * TILE);
  for (let ty = 0; ty < level.height; ty++) {
    for (let tx = first; tx <= last; tx++) {
      const tile = tileAt(tx, ty);
      if (TILE_SPRITES[tile]) ctx.drawImage(images[TILE_SPRITES[tile](tx, ty)], tx * TILE, ty * TILE);
    }
  }

  if (level.flag) {
    const { x, y } = level.flag;
    ctx.drawImage(images.flag_off, x * TILE, y * TILE);
    ctx.drawImage(images.flag_off, x * TILE, (y - 1) * TILE);
    ctx.drawImage(images[Math.floor(time * 4) % 2 ? 'flag_green_b' : 'flag_green_a'], x * TILE, (y - 2) * TILE);
  }

  const bob = Math.sin(time * 4) * 3;
  for (const coin of coins) if (!coin.taken) ctx.drawImage(images[THEME.coin], coin.x, coin.y + bob);
  for (const pop of pops) {
    ctx.globalAlpha = 1 - pop.t / 0.5;
    ctx.drawImage(images[THEME.coin], pop.x, pop.y - pop.t * 120);
    ctx.globalAlpha = 1;
  }

  for (const e of enemies) {
    const sprite = e.dead ? THEME.enemy.defeated : THEME.enemy.walk[Math.floor(time * 5) % THEME.enemy.walk.length];
    drawFlipped(images[sprite], e.x + e.w / 2, e.y + e.h, 1, e.vx > 0);
  }

  const p = player;
  if (!(p.hurt > 0 && Math.floor(p.hurt * 12) % 2)) {
    const walking = p.onGround && Math.abs(p.vx) > 20;
    const pose = state === 'over' ? 'hit' : !p.onGround ? 'jump' : walking ? (Math.floor(time * 10) % 2 ? 'walk_b' : 'walk_a') : 'idle';
    drawFlipped(images[character(pose)], p.x + p.w / 2, p.y + p.h, 0.75, p.facing < 0);
  }
  ctx.restore();
  drawHud();
}

// Desenha o sprite em escala com a base centralizada em (cx, bottom), espelhando se preciso.
function drawFlipped(img, cx, bottom, scale, flip) {
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(bottom));
  if (flip) ctx.scale(-1, 1);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

// ---------- Estados e telas ----------
function showOverlay(title, text, button) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayButton.textContent = button;
  overlay.hidden = false;
}

function startGame() {
  if (state === 'loading' || state === 'play') return;
  if (state !== 'paused') resetGame();
  state = 'play';
  overlay.hidden = true;
  overlayButton.blur();
}

function endGame(result) {
  state = result;
  if (result === 'won') {
    playSound('win');
    showOverlay('Fase concluída!', `Moedas: ${player.coins} de ${level.totalCoins} · Tempo: ${time.toFixed(1)} s`, 'Jogar de novo');
  } else {
    showOverlay('Fim de jogo', 'Seus corações acabaram. Tente outra vez!', 'Recomeçar');
  }
}

function togglePause() {
  if (state === 'play') {
    state = 'paused';
    showOverlay('Pausa', 'O jogo está parado.', 'Continuar');
  } else if (state === 'paused') {
    startGame();
  }
}

// ---------- Entrada ----------
const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyZ: 'jump' };

function press(action, down) {
  if (action === 'jump' && down && !input.jump) jumpBuffer = JUMP_BUFFER;
  input[action] = down;
}

addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && state !== 'play') return startGame();
  if (event.code === 'KeyP') return togglePause();
  const action = KEYS[event.code];
  if (!action) return;
  event.preventDefault();
  if (!event.repeat) press(action, true);
});
addEventListener('keyup', (event) => {
  const action = KEYS[event.code];
  if (action) press(action, false);
});
addEventListener('blur', () => { input.left = input.right = input.jump = false; });
overlayButton.addEventListener('click', startGame);

for (const button of document.querySelectorAll('[data-key]')) {
  const action = button.dataset.key;
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); press(action, true); });
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) button.addEventListener(type, () => press(action, false));
}

// ---------- Tela e loop ----------
function fitStage() {
  const scale = Math.min(innerWidth / VIEW_W, innerHeight / VIEW_H);
  stage.style.width = `${VIEW_W * scale}px`;
  stage.style.height = `${VIEW_H * scale}px`;
}
addEventListener('resize', fitStage);
fitStage();

let last = performance.now();
let accumulator = 0;
function frame(now) {
  accumulator += Math.min(0.1, (now - last) / 1000);
  last = now;
  while (accumulator >= STEP) {
    if (state === 'play') update(STEP);
    accumulator -= STEP;
  }
  if (state !== 'loading') draw();
  requestAnimationFrame(frame);
}

for (const [name, file] of Object.entries(SOUNDS)) sounds[name] = new Audio(`assets/sounds/${file}.ogg`);
Promise.all(Object.entries(SPRITES).flatMap(([folder, names]) => names.map((name) => loadImage(folder, name)))).then(() => {
  resetGame();
  state = 'title';
  requestAnimationFrame(frame);
}).catch((error) => {
  overlayTitle.textContent = 'Erro ao carregar';
  overlayText.textContent = error.message;
});
