/* Clumsy Bird, Ellison Leão. Alterado pelo SquadOS em 2026-10-15. GPLv3; UPSTREAM.md. */
var game = {
    data: { score: 0, steps: 0, start: false, flapQueued: false, newHiScore: false, muted: false },
    text: null,
    resources: [
        {name: "bg", type: "image", src: "data/img/bg.png"},
        {name: "clumsy", type: "image", src: "data/img/clumsy.png"},
        {name: "pipe", type: "image", src: "data/img/pipe.png"},
        {name: "ground", type: "image", src: "data/img/ground.png"},
        {name: "gameover", type: "image", src: "data/img/gameover.png"},
        {name: "gameoverbg", type: "image", src: "data/img/gameoverbg.png"},
        {name: "hit", type: "image", src: "data/img/hit.png"},
        {name: "new", type: "image", src: "data/img/new.png"},
        {name: "theme", type: "audio", src: "data/bgm/"},
        {name: "hit", type: "audio", src: "data/sfx/"},
        {name: "lose", type: "audio", src: "data/sfx/"},
        {name: "wing", type: "audio", src: "data/sfx/"}
    ],

    onload: function () {
        var language = new URLSearchParams(window.location.search).get("lang") || navigator.language;
        var english = language.toLowerCase().indexOf("en") === 0;
        document.documentElement.lang = english ? "en" : "pt-BR";
        this.text = english ? {
            ready: "Tap, click or press Space to fly.",
            over: "Game over. Tap, click or press Space to try again.",
            restart: "Play again", soundOn: "Sound on", soundOff: "Sound off",
            score: "Score: ", best: "Best: ", unsupported: "Your browser does not support this game."
        } : {
            ready: "Toque, clique ou aperte Espaço para voar.",
            over: "Fim de jogo. Toque, clique ou aperte Espaço para tentar de novo.",
            restart: "Jogar novamente", soundOn: "Som ligado", soundOff: "Som desligado",
            score: "Pontos: ", best: "Recorde: ", unsupported: "Seu navegador não suporta este jogo."
        };
        document.getElementById("restart").textContent = this.text.restart;
        document.getElementById("sound").textContent = this.text.soundOn;
        var controls = document.getElementById("controls");
        ["pointerdown", "mousedown", "touchstart"].forEach(function (event) {
            controls.addEventListener(event, function (e) { e.stopPropagation(); });
        });
        document.getElementById("restart").addEventListener("click", function () {
            me.state.change(me.state.PLAY);
        });
        document.getElementById("sound").addEventListener("click", function () { game.toggleSound(); });
        if (!me.video.init(900, 600, { wrapper: "screen", scale: "auto", scaleMethod: "fit" })) {
            document.getElementById("status").textContent = this.text.unsupported;
            return;
        }
        me.audio.init("mp3,ogg");
        me.audio.setVolume(0.5);
        // O loader legado usa um alinhamento inválido de canvas. A cena simples
        // evita o aviso e mantém somente o estado de carregamento na interface.
        me.state.set(me.state.LOADING, new (me.ScreenObject.extend({
            onResetEvent: function () {
                me.game.world.addChild(new me.ColorLayer("loading", "#0099cc", 0), 0);
            }
        }))());
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    loaded: function () {
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());
        me.input.bindKey(me.input.KEY.M, "mute", true);
        me.pool.register("clumsy", game.BirdEntity);
        me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);
        me.state.change(me.state.PLAY);
    },

    beginFlight: function () {
        this.data.start = true;
        document.getElementById("status").textContent = "";
        me.game.world.addChild(new game.PipeGenerator(), 0);
        // disable() aplica mute global no Howler, sem impedir play(). Iniciar
        // uma vez no primeiro gesto permite reativar o mesmo loop durante o voo.
        me.audio.play("theme", true);
    },

    toggleSound: function () {
        this.data.muted = !this.data.muted;
        if (this.data.muted) { me.audio.disable(); } else { me.audio.enable(); }
        var button = document.getElementById("sound");
        button.textContent = this.data.muted ? this.text.soundOff : this.text.soundOn;
        button.setAttribute("aria-pressed", String(this.data.muted));
    }
};
