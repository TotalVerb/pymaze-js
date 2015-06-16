define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.pack = pack;
  exports.pack2 = pack2;
  exports.unpack = unpack;

  function pack(x, y) {
    return x + ',' + y;
  }

  function pack2(xy) {
    return xy.join(',');
  }

  function unpack(loc) {
    return loc.split(',').map(Number);
  }
});