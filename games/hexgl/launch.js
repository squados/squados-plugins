/* Adaptação de entrada direta do SquadOS. O jogo e seus assets são de BKcore e colaboradores. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt-BR';
  var game = null;
  var ready = false;
  var soundEnabled = false;
  bkcore.Audio.enabled = false;
  var result = null;
  var copy = {
    'pt-BR': {
      title: 'Corrida Espacial', back: '← Jogos', speed: 'Velocidade', shield: 'Escudo', lap: 'Volta', time: 'Tempo', telemetry: 'Instrumentos da nave', dashboard: 'Estado da nave', touch: 'Controles de toque',
      loading: 'Preparando a pista', detail: 'Carregando nave, pista e sons…',
      soundOn: 'Som: ligado', soundOff: 'Som: desligado', restart: 'Reiniciar',
      help: '<kbd>↑</kbd> Acelerar · <kbd>←</kbd><kbd>→</kbd> Direção · <kbd>A</kbd><kbd>D</kbd> Freios laterais',
      goal: 'Complete 3 voltas na estação orbital. <kbd>R</kbd> reinicia.', credits: 'Derivado de HexGL por BKcore · créditos',
      finish: 'Corrida concluída', destroyed: 'Nave destruída', again: 'Correr novamente',
      track: 'ORBITAL 01 / 3 VOLTAS', laps: 'Voltas', elapsed: 'Tempo', reload: 'Recarregar',
      unsupported: 'WebGL indisponível', unsupportedDetail: 'Ative a aceleração gráfica do navegador para jogar.',
      error: 'Não foi possível carregar a pista', errorDetail: 'Verifique a conexão e recarregue a página.',
      messages: { 'Get ready': 'Prepare-se', 'Go': 'Vai!', 'Final lap': 'Última volta', 'Finish': 'Chegada', 'Destroyed': 'Nave destruída' },
      left: 'Esquerda', right: 'Direita', accelerate: 'Acelerar', controls: 'Controles da corrida'
    },
    en: {
      title: 'Space Racing', back: '← Games', speed: 'Speed', shield: 'Shield', lap: 'Lap', time: 'Time', telemetry: 'Ship instruments', dashboard: 'Ship status', touch: 'Touch controls',
      loading: 'Preparing the track', detail: 'Loading ship, track and sounds…',
      soundOn: 'Sound: on', soundOff: 'Sound: off', restart: 'Restart',
      help: '<kbd>↑</kbd> Accelerate · <kbd>←</kbd><kbd>→</kbd> Steer · <kbd>A</kbd><kbd>D</kbd> Air brakes',
      goal: 'Complete 3 laps around the orbital station. <kbd>R</kbd> restarts.', credits: 'Based on HexGL by BKcore · credits',
      finish: 'Race complete', destroyed: 'Ship destroyed', again: 'Race again',
      track: 'ORBITAL 01 / 3 LAPS', laps: 'Laps', elapsed: 'Time', reload: 'Reload',
      unsupported: 'WebGL unavailable', unsupportedDetail: 'Enable browser graphics acceleration to race.',
      error: 'The track could not load', errorDetail: 'Check your connection and reload the page.',
      messages: {}, left: 'Left', right: 'Right', accelerate: 'Accelerate', controls: 'Race controls'
    }
  };
  function formatTime(ms) {
    var t = bkcore.Timer.msToTimeString(ms);
    return t.m + ':' + t.s + '.' + t.ms.slice(-3);
  }
  function renderCopy() {
    var t = copy[lang];
    document.documentElement.lang = lang;
    document.title = t.title + ' · SquadOS';
    ['game-name', 'loading-name', 'result-brand'].forEach(function (id) { $(id).textContent = t.title; });
    $('race').setAttribute('aria-label', t.title);
    $('back-index').textContent = t.back;
    $('back-index').setAttribute('href', '../?lang=' + lang);
    ['speed', 'shield', 'lap', 'time'].forEach(function (name) { $(name + '-label').textContent = t[name]; });
    $('telemetry').setAttribute('aria-label', t.telemetry);
    $('dashboard').setAttribute('aria-label', t.dashboard);
    $('touch-controls').setAttribute('aria-label', t.touch);
    $('loading-title').textContent = t.loading;
    $('loading-detail').textContent = t.detail;
    $('sound').textContent = soundEnabled ? t.soundOn : t.soundOff;
    $('restart').innerHTML = t.restart + ' <kbd>R</kbd>';
    $('keyboard-help').innerHTML = t.help;
    $('race-goal').innerHTML = t.goal;
    $('credits').textContent = t.credits;
    $('race-again').textContent = t.again;
    $('result-track').textContent = t.track;
    $('reload').textContent = t.reload;
    $('language').textContent = lang === 'en' ? 'PT' : 'EN';
    $('language').setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
    document.querySelector('nav').setAttribute('aria-label', t.controls);
    document.querySelector('[data-key="left"]').setAttribute('aria-label', t.left);
    document.querySelector('[data-key="right"]').setAttribute('aria-label', t.right);
    $('accelerate').setAttribute('aria-label', t.accelerate);
    if (result) {
      $('result-title').textContent = result.finished ? t.finish : t.destroyed;
      $('result-time').textContent = t.elapsed + ' ' + formatTime(result.time);
      $('result-laps').textContent = result.laps.length ? t.laps + ': ' + result.laps.map(formatTime).join(' / ') : '';
    }
  }
  function fail(type) {
    $('loading').hidden = false;
    $('loading-title').textContent = copy[lang][type];
    $('loading-detail').textContent = copy[lang][type + 'Detail'];
    $('reload').hidden = false;
  }
  function releaseKeys() {
    if (!ready) return;
    var keys = game.components.shipControls.key;
    Object.keys(keys).forEach(function (key) { keys[key] = false; });
  }
  function restart() {
    if (!ready) return;
    releaseKeys();
    $('result').hidden = true;
    result = null;
    game.reset();
  }
  $('restart').onclick = restart;
  $('race-again').onclick = restart;
  $('reload').onclick = function () { location.reload(); };
  $('language').onclick = function () { lang = lang === 'en' ? 'pt-BR' : 'en'; renderCopy(); };
  $('sound').onclick = function () {
    if (!ready) return;
    var ctx = bkcore.Audio._ctx;
    if (!ctx) return;
    $('sound').disabled = true;
    soundEnabled = !soundEnabled;
    bkcore.Audio.enabled = soundEnabled;
    if (!soundEnabled) { bkcore.Audio.stop('bg'); bkcore.Audio.stop('wind'); }
    var action = soundEnabled ? ctx.resume() : ctx.suspend();
    action.then(function () {
      if (soundEnabled && ready) { bkcore.Audio.play('bg'); bkcore.Audio.play('wind'); bkcore.Audio.volume('wind', 0.35); }
      $('sound').setAttribute('aria-pressed', String(soundEnabled)); renderCopy();
    }).catch(function () { soundEnabled = false; bkcore.Audio.enabled = false; renderCopy(); }).finally(function () { $('sound').disabled = false; });
  };
  window.addEventListener('blur', releaseKeys);
  document.addEventListener('visibilitychange', function () { if (document.hidden) releaseKeys(); });
  document.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(event.key) !== -1) event.preventDefault();
    if ((event.key.toLowerCase() === 'r' || event.key === 'Escape') && !event.repeat) {
      event.preventDefault();
      restart();
    }
  }, true);
  document.querySelectorAll('[data-key]').forEach(function (button) {
    function setKey(value) { if (ready) game.components.shipControls.key[button.dataset.key] = value; }
    button.addEventListener('pointerdown', function (event) { event.preventDefault(); button.setPointerCapture(event.pointerId); setKey(true); });
    button.addEventListener('pointerup', function () { setKey(false); });
    button.addEventListener('pointercancel', function () { setKey(false); });
    button.addEventListener('lostpointercapture', function () { setKey(false); });
  });
  renderCopy();
  try {
    game = window.hexGL = new bkcore.hexgl.HexGL({
      document: document, width: innerWidth, height: innerHeight,
      container: $('main'), overlay: $('overlay'),
      quality: 3, difficulty: 0, hud: true, controlType: 0, godmode: false, track: 'Cityscape'
    });
    // O resultado permanece sobre a pista. Não carrega ranking, conta ou serviço remoto.
    game.displayScore = function (time, laps) {
      result = { finished: game.gameplay.result === game.gameplay.results.FINISH, time: time, laps: laps.slice() };
      releaseKeys();
      renderCopy();
      $('result').hidden = false;
    };
    game.load({
      onLoad: function () {
        game.init();
        SpaceRacing.apply(game);
        var display = game.hud.display;
        game.hud.display = function (message, duration) { display.call(this, copy[lang].messages[message] || message, duration); };
        game.start();
        game.gameplay.startDelay = 0;
        game.gameplay.countDownDelay = 750;
        ready = true;
        $('sound').disabled = !bkcore.Audio._ctx;
        $('restart').disabled = false;
        $('loading').hidden = true;
        window.addEventListener('resize', function () {
          game.width = innerWidth; game.height = innerHeight;
          game.renderer.setSize(innerWidth, innerHeight);
          ['game', 'sky'].forEach(function (name) {
            var camera = game.manager.get(name).camera;
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
          });
          game.renderer.deallocateRenderTarget(game.composers.game.renderTarget1);
          game.renderer.deallocateRenderTarget(game.composers.game.renderTarget2);
          game.composers.game.reset(new THREE.WebGLRenderTarget(innerWidth, innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }));
          game.composers.game.passes.forEach(function (pass) {
            if (pass.uniforms && pass.uniforms.rx) {
              pass.uniforms.rx.value = innerWidth;
              pass.uniforms.ry.value = innerHeight;
              pass.uniforms.size.value = 512 * innerWidth / 1633;
            }
          });
          game.hud.resize(innerWidth, innerHeight);
        });
      },
      onError: function (name) { console.error('HexGL asset failed: ' + name); fail('error'); },
      onProgress: function (progress) { $('progressbar').style.width = Math.round(progress.loaded / progress.total * 100) + '%'; }
    });
  } catch (error) { console.error(error); fail('unsupported'); }
}());
