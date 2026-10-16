/* Clumsy Bird. Identidade e resultado alterados pelo SquadOS em 2026-10-15. GPLv3; UPSTREAM.md. */
game.GameOverScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        document.getElementById("status").textContent = game.text.over;
        document.getElementById("restart").hidden = false;
        document.getElementById("result").hidden = false;
        me.save.add({ score: game.data.score, steps: game.data.steps });
        if (!me.save.topSteps) me.save.add({ topSteps: game.data.steps });
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }
        document.getElementById("result-count").textContent = String(game.data.steps);
        document.getElementById("result-best").textContent = String(me.save.topSteps);
        document.getElementById("record-badge").hidden = !game.data.newHiScore;
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", true);
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action) {
            if (action === "enter") me.state.change(me.state.PLAY);
        });
        me.game.world.addChild(new BackgroundLayer("bg", 1));
        this.ground1 = me.pool.pull("ground", 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull("ground", me.game.viewport.width, me.game.viewport.height - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);
    },

    onDestroyEvent: function () {
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        me.audio.stop("theme");
    }
});
