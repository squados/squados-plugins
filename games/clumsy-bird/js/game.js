/* Clumsy Bird, Ellison Leão. Alterado pelo SquadOS em 2026-10-15. GPLv3; UPSTREAM.md. */
var game = {
    data: { score: 0, steps: 0, start: false, flapQueued: false, muteQueued: false, newHiScore: false, muted: false },
    text: null,
    resources: [
        {name: "bg", type: "image", src: "data/art/skyline.svg"},
        {name: "clumsy", type: "image", src: "data/art/robot.svg"},
        {name: "pipe", type: "image", src: "data/art/portal.svg"},
        {name: "ground", type: "image", src: "data/art/runway.svg"},
        {name: "hit", type: "image", src: "data/art/marker.svg"},
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
            name: "2D Arcade", loading: "2D Arcade · Loading…", back: "← Games", portals: "PORTALS",
            ready: "Tap, click or press Space to fly. Find your way through the energy portals.",
            over: "Tap, click or press Space to try again.",
            restart: "Play again", soundOn: "Sound on", soundOff: "Sound off",
            score: "PORTALS", best: "BEST", result: "2D ARCADE · RESULTS", ended: "Flight complete",
            resultCopy: "One more portal. One more adventure.", record: "New best", unsupported: "Your browser does not support 2D Arcade."
        } : {
            name: "Arcade 2D", loading: "Arcade 2D · Carregando…", back: "← Jogos", portals: "PORTAIS",
            ready: "Toque, clique ou aperte Espaço para voar. Atravesse os portais de energia.",
            over: "Toque, clique ou aperte Espaço para tentar de novo.",
            restart: "Jogar novamente", soundOn: "Som ligado", soundOff: "Som desligado",
            score: "PORTAIS", best: "RECORDE", result: "ARCADE 2D · RESULTADO", ended: "Voo encerrado",
            resultCopy: "Mais um portal. Mais uma aventura.", record: "Novo recorde", unsupported: "Seu navegador não suporta o Arcade 2D."
        };
        document.title = this.text.name;
        document.getElementById("screen").setAttribute("aria-label", this.text.name);
        document.getElementById("game-title").textContent = this.text.name;
        document.getElementById("status").textContent = this.text.loading;
        document.getElementById("back").textContent = this.text.back;
        document.getElementById("back").href = "../?lang=" + (english ? "en" : "pt-BR");
        document.getElementById("score-label").textContent = this.text.portals;
        document.getElementById("score-panel").setAttribute("aria-label", this.text.portals);
        document.getElementById("result-brand").textContent = this.text.result;
        document.getElementById("result-title").textContent = this.text.ended;
        document.getElementById("result-copy").textContent = this.text.resultCopy;
        document.getElementById("result-score-label").textContent = this.text.score;
        document.getElementById("result-best-label").textContent = this.text.best;
        document.getElementById("record-badge").textContent = this.text.record;
        document.getElementById("restart").textContent = this.text.restart;
        document.getElementById("sound").textContent = this.text.soundOn;
        document.querySelectorAll(".interface").forEach(function (element) {
            ["pointerdown", "mousedown", "touchstart"].forEach(function (event) {
                element.addEventListener(event, function (e) { e.stopPropagation(); });
            });
            ["keydown", "keyup"].forEach(function (event) {
                element.addEventListener(event, function (e) {
                    if ((e.key === " " || e.key === "Enter") && e.target.closest("button, a")) {
                        e.stopPropagation();
                    }
                });
            });
        });
        document.getElementById("restart").addEventListener("click", function () {
            me.state.change(me.state.PLAY);
        });
        document.getElementById("sound").addEventListener("click", function () { game.toggleSound(); });
        if (!me.video.init(900, 600, { wrapper: "screen", scale: "auto", scaleMethod: "fit", antiAlias: true })) {
            document.getElementById("status").textContent = this.text.unsupported;
            return;
        }
        var canvas = document.querySelector("#screen canvas");
        canvas.tabIndex = 0;
        canvas.setAttribute("aria-label", this.text.name);
        canvas.addEventListener("pointerdown", function () { canvas.focus(); });
        me.audio.init("mp3,ogg");
        me.audio.setVolume(0.5);
        // O loader legado usa um alinhamento inválido de canvas. A cena simples
        // evita o aviso e mantém somente o estado de carregamento na interface.
        me.state.set(me.state.LOADING, new (me.ScreenObject.extend({
            onResetEvent: function () {
                me.game.world.addChild(new me.ColorLayer("loading", "#e4d4b5", 0), 0);
            }
        }))());
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    loaded: function () {
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());
        me.input.bindKey(me.input.KEY.M, "mute", true);
        this.muteHandler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "mute" && edge) game.data.muteQueued = true;
        });
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
