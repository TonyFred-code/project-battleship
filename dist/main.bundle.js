(() => {
  'use strict';
  function t(e) {
    return (
      (t =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      t(e)
    );
  }
  function e(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        'value' in r && (r.writable = !0),
        Object.defineProperty(t, n(r.key), r);
    }
  }
  function n(e) {
    var n = (function (e, n) {
      if ('object' != t(e) || !e) return e;
      var i = e[Symbol.toPrimitive];
      if (void 0 !== i) {
        var r = i.call(e, 'string');
        if ('object' != t(r)) return r;
        throw new TypeError('@@toPrimitive must return a primitive value.');
      }
      return String(e);
    })(e);
    return 'symbol' == t(n) ? n : String(n);
  }
  function i(t, e, n) {
    if (!e.has(t))
      throw new TypeError(
        'attempted to ' + n + ' private field on non-instance',
      );
    return e.get(t);
  }
  var r = new WeakMap(),
    o = (function () {
      function t(e) {
        if (
          ((function (t, e) {
            if (!(t instanceof e))
              throw new TypeError('Cannot call a class as a function');
          })(this, t),
          (o = { writable: !0, value: !1 }),
          (function (t, e) {
            if (e.has(t))
              throw new TypeError(
                'Cannot initialize the same private elements twice on an object',
              );
          })((n = this), (i = r)),
          i.set(n, o),
          !t.isValidLength(e))
        )
          throw new Error('Invalid length. 1 is minimum ship length');
        var n, i, o;
        (this.length = e), (this.hitsCount = 0);
      }
      var n, o, a;
      return (
        (n = t),
        (a = [
          {
            key: 'isValidLength',
            value: function (t) {
              return t > 0;
            },
          },
        ]),
        (o = [
          {
            key: 'hit',
            value: function () {
              return (
                !(function (t, e) {
                  return e.get ? e.get.call(t) : e.value;
                })(this, i(this, r, 'get')) &&
                ((this.hitsCount += 1),
                this.isSunk() &&
                  (function (t, e, n) {
                    (function (t, e, n) {
                      if (e.set) e.set.call(t, n);
                      else {
                        if (!e.writable)
                          throw new TypeError(
                            'attempted to set read only private field',
                          );
                        e.value = n;
                      }
                    })(t, i(t, e, 'set'), n);
                  })(this, r, !0),
                !0)
              );
            },
          },
          {
            key: 'isSunk',
            value: function () {
              return this.hitsCount === this.length;
            },
          },
        ]) && e(n.prototype, o),
        a && e(n, a),
        Object.defineProperty(n, 'prototype', { writable: !1 }),
        t
      );
    })(),
    a = [].concat(['a', 'b', 'c']);
  console.log(a), console.log('hello'), console.log(new o(2));
})();
//# sourceMappingURL=main.bundle.js.map
