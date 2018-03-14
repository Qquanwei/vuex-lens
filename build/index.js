"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
function isObject(obj) {
    var type = typeof obj;
    return obj != null && (type == 'object' || type == 'function');
}
function prop(key) {
    return function (obj) {
        return obj[key];
    };
}
function pathOr(p, placeholder) {
    return function (obj) {
        var c = obj;
        for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
            var i = p_1[_i];
            if (!isObject(c)) {
                return placeholder;
            }
            else if (c !== null) {
                c = c[i];
            }
        }
        return c;
    };
}
function Const(x) {
    return {
        value: x,
        map: function (f) { return Const(x); }
    };
}
exports.Const = Const;
function Identity(x) {
    return {
        value: x,
        map: function (f) { return Identity(f(x)); }
    };
}
exports.Identity = Identity;
// mutable assoc
function assoc(k, v, o) {
    vue_1["default"].set(o, k.toString(), v);
    return o;
}
// mutable assocPath
function assocPath(path, v, o) {
    var obj = o;
    for (var i = 0; i < (path.length - 1); i++) {
        if (obj[path[i]] === undefined) {
            vue_1["default"].set(obj, path[i], {});
        }
        obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = v;
    return o;
}
function lens(getter, setter) {
    return function (toFunctorFn) {
        return function (obj) {
            return toFunctorFn(getter(obj)).map(function (v) {
                return setter(v, obj);
            });
        };
    };
}
exports.lens = lens;
function set(len, value, obj) {
    var functor = len(function (x) { return Identity(value); })(obj);
    return obj;
}
exports.set = set;
function get(len, obj) {
    var functor = len(function (x) { return Const(x); })(obj);
    return functor.value;
}
exports.get = get;
function over(len, fn, obj) {
    var functor = len(function (x) { return Identity(fn(x)); })(obj);
    return functor.value;
}
exports.over = over;
function propLens(name) {
    return lens(prop(name), function (v, obj) { return assoc(name, v, obj); });
}
exports.propLens = propLens;
function pathLensOr(path, alt) {
    return lens(pathOr(path, alt), function (v, obj) { return assocPath(path, v, obj); });
}
exports.pathLensOr = pathLensOr;
function lensToVueLens(len) {
    return function (obj) {
        return Object.defineProperty({}, 'value', {
            get: function () { return get(len, obj); },
            set: function (v) { return set(len, v, obj); }
        });
    };
}
exports.lensToVueLens = lensToVueLens;
