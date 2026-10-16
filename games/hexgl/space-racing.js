/* Corrida Espacial — ambientação e instrumentos criados pelo SquadOS.
 * Geometria, colisão, física e corrida derivam de HexGL/BKcore; ver UPSTREAM.md.
 * Usa exclusivamente a API nativa do Three.js 50dev preservado nesta pasta.
 */
(function () {
  'use strict';
  function texture(width, height, draw) {
    var canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    var result = new THREE.Texture(canvas);
    result.needsUpdate = true;
    return result;
  }
  function roadTexture() {
    return texture(512, 512, function (c, w, h) {
      c.fillStyle = '#1c292d'; c.fillRect(0, 0, w, h);
      c.strokeStyle = '#344448'; c.lineWidth = 3;
      for (var y = 0; y <= h; y += 64) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      c.fillStyle = '#101c20'; c.fillRect(70, 0, 14, h); c.fillRect(w - 84, 0, 14, h);
      c.fillStyle = '#91e8b5'; c.fillRect(20, 0, 8, h); c.fillRect(w - 28, 0, 8, h);
      c.fillStyle = '#e9b385';
      for (var i = 0; i < h; i += 128) { c.fillRect(w / 2 - 4, i + 16, 8, 48); }
    });
  }
  function hullTexture() {
    return texture(512, 512, function (c, w, h) {
      c.fillStyle = '#f1ad75'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#f4e7cb'; c.fillRect(0, 35, w, 80); c.fillRect(0, 330, w, 34);
      c.fillStyle = '#233c40'; c.fillRect(0, 150, w, 66); c.fillRect(48, 0, 30, h); c.fillRect(420, 0, 30, h);
      c.strokeStyle = '#976447'; c.lineWidth = 4;
      for (var y = 0; y < h; y += 64) { c.strokeRect(0, y, w, 64); }
      c.fillStyle = '#f8f0d8'; c.font = 'bold 42px Arial'; c.textAlign = 'center'; c.fillText('S—01', 256, 285);
    });
  }
  function stationTexture() {
    return texture(256, 512, function (c, w, h) {
      c.fillStyle = '#0b2028'; c.fillRect(0, 0, w, h);
      for (var y = 8; y < h; y += 20) {
        for (var x = 8; x < w; x += 20) {
          c.fillStyle = ((x + y) % 5 === 0) ? '#b5e4c3' : '#1c4b52';
          c.fillRect(x, y, 6, 3);
        }
      }
      c.fillStyle = '#18323c'; c.fillRect(0, 0, 10, h); c.fillRect(w - 10, 0, 10, h);
    });
  }
  function bannerTexture() {
    return texture(1024, 256, function (c, w, h) {
      c.fillStyle = '#071b1c'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#b8f4cb'; c.fillRect(0, 0, w, 8); c.fillRect(0, h - 8, w, 8);
      c.font = 'bold 88px Arial'; c.textAlign = 'center'; c.fillText('SQUADOS', w / 2, 127);
      c.font = '26px Arial'; c.fillStyle = '#eea875'; c.fillText('O R B I T A L   /   0 1', w / 2, 190);
    });
  }
  function planetTexture() {
    return texture(512, 256, function (c, w, h) {
      var g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#9bd3c0'); g.addColorStop(.48, '#497b85'); g.addColorStop(1, '#172d49');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 55; i++) {
        c.fillStyle = i % 3 === 0 ? 'rgba(229,229,185,.18)' : 'rgba(7,33,59,.17)';
        c.fillRect(0, (i * 23) % h, w, 2 + (i % 8));
      }
    });
  }
  function makeSky(game) {
    var sky = game.manager.get('sky').scene;
    sky.children.slice().forEach(function (child) { if (child instanceof THREE.Mesh) child.visible = false; });
    var dome = new THREE.Mesh(new THREE.SphereGeometry(4900, 24, 16), new THREE.MeshBasicMaterial({ color: 0x030914, depthWrite: false }));
    dome.flipSided = true; dome.name = 'space-dome'; sky.add(dome);
    var seed = 79;
    function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var stars = new THREE.Geometry();
    for (var i = 0; i < 1400; i++) {
      var azimuth = random() * Math.PI * 2;
      var vertical = random() * 2 - 1;
      var radius = 4300;
      var horizontal = Math.sqrt(1 - vertical * vertical) * radius;
      stars.vertices.push(new THREE.Vector3(Math.cos(azimuth) * horizontal, vertical * radius, Math.sin(azimuth) * horizontal));
    }
    var starfield = new THREE.ParticleSystem(stars, new THREE.ParticleBasicMaterial({ color: 0xd6f4e7, size: 2.3, sizeAttenuation: false, transparent: true, depthWrite: false }));
    starfield.name = 'orbital-stars'; sky.add(starfield);
    sky.add(new THREE.AmbientLight(0x526d82));
    var light = new THREE.DirectionalLight(0xe8ffe8, 1.4); light.position.set(-1800, 900, -1800); sky.add(light);
    var planet = new THREE.Mesh(new THREE.SphereGeometry(600, 40, 24), new THREE.MeshPhongMaterial({ map: planetTexture(), color: 0xb1dbca, ambient: 0x466675, shininess: 8 }));
    planet.position.set(-950, 0, 2850); planet.rotation.z = -.22; planet.name = 'orbital-planet'; sky.add(planet);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(830, 16, 4, 100), new THREE.MeshBasicMaterial({ color: 0xb4d6bc, transparent: true, opacity: .5, depthWrite: false }));
    ring.position.copy(planet.position); ring.rotation.x = 1.08; ring.rotation.z = -.32; ring.doubleSided = true; ring.name = 'orbital-rings'; sky.add(ring);
    var moon = new THREE.Mesh(new THREE.SphereGeometry(180, 20, 14), new THREE.MeshPhongMaterial({ color: 0xd1ab9a, ambient: 0x423944, shininess: 5 }));
    moon.position.set(1800, 0, 3300); moon.name = 'orbital-moon'; sky.add(moon);
  }
  function recolor(game) {
    var scene = game.manager.get('game').scene;
    var materials = game.track.materials;
    var road = roadTexture();
    var windows = stationTexture();
    var own = {
      track: new THREE.MeshPhongMaterial({ map: road, color: 0xc1d4d2, ambient: 0x344d50, emissive: 0x081311, shininess: 28 }),
      ship: new THREE.MeshPhongMaterial({ map: hullTexture(), color: 0xffe2c5, ambient: 0x80614f, emissive: 0x382216, specular: 0xffedce, shininess: 90 }),
      scrapers1: new THREE.MeshBasicMaterial({ map: windows, color: 0x6d98a0 }),
      scrapers2: new THREE.MeshBasicMaterial({ map: windows, color: 0x527b85 }),
      start: new THREE.MeshPhongMaterial({ color: 0x2e454b, ambient: 0x415f62, shininess: 35 }),
      startBanner: new THREE.MeshBasicMaterial({ map: bannerTexture() }),
      bonusBase: new THREE.MeshPhongMaterial({ color: 0xd9a36f, ambient: 0x7a6147, shininess: 50 }),
      bonusSpeed: new THREE.MeshBasicMaterial({ color: 0x9cfdc3 })
    };
    Object.keys(own).forEach(function (name) {
      var old = materials[name];
      scene.children.forEach(function (child) { if (child.material === old) child.material = own[name]; });
      materials[name] = own[name];
    });
    scene.children.forEach(function (child) {
      if (child instanceof THREE.AmbientLight) child.color.setHex(0x607984);
      if (child instanceof THREE.DirectionalLight) { child.color.setHex(0xc0decf); child.intensity = .95; }
    });
    var fx = game.components.shipEffects;
    fx.booster.material.color.setHex(0x83ffc1);
    fx.boosterSprite.color.setHex(0xa0ffc5);
    fx.boosterLight.color.setHex(0x6effb4);
    if (game.extras.bloom) game.extras.bloom.screenUniforms.opacity.value = .3;
    // Retira o contorno hexagonal original; preserva render passes e bloom nativos.
    var passes = game.composers.game.passes;
    var screen = new THREE.ShaderPass(THREE.ShaderExtras.screen);
    screen.renderToScreen = true;
    passes[passes.length - 1] = screen;
  }
  function instruments(game) {
    var hud = game.hud;
    var messageTimer;
    hud.canvas.style.display = 'none';
    hud.display = function (message, duration) {
      clearTimeout(messageTimer);
      document.getElementById('race-message').textContent = message;
      messageTimer = setTimeout(function () { document.getElementById('race-message').textContent = ''; }, (duration || 1) * 1000);
    };
    hud.update = function (speed, speedRatio, shield, shieldRatio) {
      document.getElementById('speed-value').textContent = speed;
      document.getElementById('shield-value').textContent = shield + '%';
      document.getElementById('shield-bar').style.width = Math.max(0, shieldRatio * 100) + '%';
      document.getElementById('shield-meter').classList.toggle('is-low', shieldRatio < .2);
      document.getElementById('lap-value').textContent = this.lap || '1/3';
      var gameplay = game.gameplay;
      var elapsed = !gameplay ? 0 : gameplay.finishTime !== null ? gameplay.finishTime : gameplay.step === 4 ? gameplay.timer.time.elapsed : 0;
      var t = bkcore.Timer.msToTimeString(elapsed);
      document.getElementById('time-value').textContent = t.m + ':' + t.s + '.' + t.ms.slice(-3);
    };
  }
  window.SpaceRacing = {
    apply: function (game) { makeSky(game); recolor(game); instruments(game); }
  };
}());
