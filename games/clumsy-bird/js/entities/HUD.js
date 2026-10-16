/* Clumsy Bird. HUD alterado pelo SquadOS em 2026-10-15. GPLv3; consulte UPSTREAM.md. */
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
    init: function () {
        this._super(me.Container, 'init');
        this.isPersistent = false;
        this.collidable = false;
        this.z = Infinity;
        this.name = "HUD";
        this.addChild(new game.HUD.ScoreItem(5, 5));
    }
});

game.HUD.ScoreItem = me.Renderable.extend({
    init: function (x, y) {
        this._super(me.Renderable, "init", [x, y, 10, 10]);
        this.floating = true;
        this.alwaysUpdate = true;
        this.steps = -1;
    },
    update: function () {
        if (this.steps !== game.data.steps) {
            this.steps = game.data.steps;
            document.getElementById("score-value").textContent = String(this.steps);
        }
        return false;
    },
    draw: function () {}
});

var BackgroundLayer = me.ImageLayer.extend({
    init: function (image, z) {
        this._super(me.ImageLayer, 'init', [0, 0, {
            name: image, width: 900, height: 600, image: image, z: z, ratio: 1
        }]);
    },
    update: function () {
        // Consome o lock nativo mesmo quando há um toque curto na fila.
        var mutePressed = me.input.isKeyPressed("mute");
        if (game.data.muteQueued || mutePressed) {
            game.data.muteQueued = false;
            game.toggleSound();
        }
        return true;
    }
});
