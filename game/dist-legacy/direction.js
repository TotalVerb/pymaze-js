define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.reverse_direction = reverse_direction;
  exports.dirname = dirname;
  exports.dirpack = dirpack;
  exports.dx = dx;
  exports.dy = dy;
  var NORTH = 0;
  exports.NORTH = NORTH;
  var SOUTH = 1;
  exports.SOUTH = SOUTH;
  var EAST = 2;
  exports.EAST = EAST;
  var WEST = 3;

  exports.WEST = WEST;

  function reverse_direction(direction) {
    switch (direction) {
      case NORTH:
        return SOUTH;
      case SOUTH:
        return NORTH;
      case EAST:
        return WEST;
      case WEST:
        return EAST;
    }
  }

  function dirname(direction) {
    switch (direction) {
      case NORTH:
        return 'north';
      case SOUTH:
        return 'south';
      case EAST:
        return 'west';
      case WEST:
        return 'east';
    }
  }

  function dirpack(x, y) {
    return x === 1 ? EAST : x === -1 ? WEST : y === 1 ? SOUTH : NORTH;
  }

  function dx(direction) {
    return direction === EAST ? 1 : direction === WEST ? -1 : 0;
  }

  function dy(direction) {
    return direction === SOUTH ? 1 : direction === NORTH ? -1 : 0;
  }
});