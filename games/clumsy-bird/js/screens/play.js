/* Clumsy Bird. Alterado pelo SquadOS em 2026-10-15. GPLv3; consulte UPSTREAM.md. */
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        me.game.reset();
        me.audio.stop("theme");
        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        me.input.bindKey(me.input.KEY.UP, "fly", true);
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);
        // Preserva comandos curtos que começam e terminam entre dois frames.
        this.inputHandler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "fly" && edge) game.data.flapQueued = true;
        });
        game.data.score = 0;
        game.data.steps = 0;
        game.data.start = false;
        game.data.flapQueued = false;
        game.data.newHiScore = false;
        document.getElementById("status").textContent = game.text.ready;
        document.getElementById("restart").hidden = true;

        me.game.world.addChild(new BackgroundLayer("bg", 1));
        this.ground1 = me.pool.pull("ground", 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull("ground", me.game.viewport.width, me.game.viewport.height - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);
        this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height / 2 - 100);
        me.game.world.addChild(this.bird, 10);
    },

    onDestroyEvent: function () {
        me.audio.stop("theme");
        me.event.unsubscribe(this.inputHandler);
        this.HUD = null;
        this.bird = null;
        this.ground1 = null;
        this.ground2 = null;
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});
