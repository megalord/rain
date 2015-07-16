spider.define(function () {

    var stack = [];

    function noop () {}

    function createItem (params) {
        if (typeof params === 'function') {
            return createItem({ fn: params });
        }
        return {
            keep: false,
            fn: params.fn,
            before: params.before ? function (t) {
                params.before(t)
                this.before = noop;
            } : noop,
            beforeEach: params.beforeEach || noop,
            after: params.after || noop
        };
    }

    function each (key) {
        var args = Array.prototype.slice.call(arguments, 1);
        stack.forEach(function (item) {
            item[key].apply(item, args);
        });
    }

    return {
        beforeEach: function (t) {
            each('before', t);
            each('beforeEach', t);
        },
        clean: function () {
            var i = 0;
            var cleaned = [];
            while(i < stack.length) {
                if (stack[i].keep) {
                    stack[i].keep = false;
                    i++;
                } else {
                    cleaned = cleaned.concat(stack.splice(i, 1));
                }
            }
            cleaned.forEach(function (item) {
                item.after();
            });
        },
        exec: function (x, y, t) {
            return stack.reduce(function (prev, data) {
                var curr = data.fn(x, y, t);
                if (!data.keep && curr > 0) {
                    data.keep = true;
                }
                return prev + curr;
            }, 0);
        },
        push: function (params) {
            stack.push(createItem(params));
        }
    }
});
