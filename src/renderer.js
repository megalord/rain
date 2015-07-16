spider.define(function () {

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    document.body.appendChild(canvas);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    return {
        ctx: ctx,
        w: w,
        h: h
    }

});
