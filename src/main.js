spider.define(function (require) {

    var renderer = require('renderer'),
        stack = require('stack'),
        tiles = require('tiles');

    var start;
    var fn;

    function step (timestamp) {
        if (!start) {
            start = timestamp;
        }
        tiles.draw(timestamp - start);
        stack.clean();
        requestAnimationFrame(step);
    }

    function radial (x0, y0, fn) {
        return function (x, y, t) {
            var r = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
            return fn(r, t);
        }
    }

    function wave (x0, y0, w, rF, v) {
        //return radial(x0, y0, function (r, t) {
        var t0;
        return  {
            before: function (t) {
                t0 = t;
            },
            fn: function (x, y, t) {
                var r = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
                var dr = Math.abs(r - v * (t - t0));
                if (r < rF && dr < w) {
                    return Math.cos(dr / w * (Math.PI / 2));
                } else {
                    return 0;
                }
            }
        }
    }

    function drop (x0, yF, r, v, theta) {
        theta = theta * Math.PI / 180;
        var t0;
        var vX = v * Math.sin(theta);
        var vY = v * Math.cos(theta);
        var xF = yF * (vX / vY) + x0;
        return {
            before: function (t) {
                t0 = t;
            },
            fn: function (x, y, t) {
                if (y > yF || x - r > xF || x + r < x0) {
                    return 0;
                }
                var dx = Math.abs(x - (x0 + vX * (t - t0)));
                var dy = Math.abs(y - ( 0 + vY * (t - t0)));
                var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                if (dr < r) {
                    return 1 - dr / r;
                } else {
                    return 0;
                }
            },
            after: function () {
                stack.push(wave(xF, yF, 10, 30, 1));
            }
        }
    }

    function snake (w, h) {
        var direction = 2;
        var xPrev = 100, yPrev = 100;
        return {
            before: function () {
                /*direction = (direction + Math.round(Math.random() * 2 - 1)) % 4;
                var mod2 = direction % 2;
                if (mod2 === 0) {
                    xPrev += direction - 1;
                } else {
                    yPrev += direction - 2;
                }
                console.log(direction);*/
                xPrev+=2;
            },
            fn: function (x, y, t) {
                var dx = Math.abs(x - xPrev);
                var dy = Math.abs(y - yPrev);
                if (dx < w && dy < h) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }

    stack.push(drop(100, 400, 10, 0.1, 15));
    //stack.push(wave(100, 400, 10, 0.1));
    //stack.push(snake(5, 5));

    setInterval(function () {
        var x0 = Math.random() * 1000;
        var yF = 200 + Math.random() * 400;
        var r = Math.random() * 5 + 5;
        stack.push(drop(x0, yF, r, 1, 15));
        //stack.push(wave(renderer.w/2, renderer.h/2, 50, 0.1));
    }, 10);

    requestAnimationFrame(step);
});
