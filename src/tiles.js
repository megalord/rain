spider.define(function (require) {

    var renderer = require('renderer'),
        stack = require('stack');

    var x, y, s = 6, p = 3;
    var zPrev;

    function fillBackground () {
        renderer.ctx.fillStyle = '#000000';
        renderer.ctx.fillRect(0, 0, w, h);
    }

    function toColor (z) {
        var i = Math.round(z * 100) + 20;
        return 'rgb(' + i + ',' + i + ',' + i + ')';
    }

    function drawTile (x, y, s, z) {
        if (z !== zPrev) {
            renderer.ctx.fillStyle = toColor(z);
        }
        renderer.ctx.fillRect(x, y, s, s);
    }

    function drawTiles (t) {
        reset();
        stack.beforeEach(t);
        while (x < w && y < h) {
            drawTile(x, y, s, stack.exec(x, y, t));

            x += s + p;
            if (x >= w) {
                x = 4;
                y += s + p;
            }
        }
    }

    function reset () {
        x = 4;
        y = 4;
    }

    fillBackground();

    return {
        draw: drawTiles
    }
});
