define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ChangeDirection = function ChangeDirection(entity, direction = null) {
    _classCallCheck(this, ChangeDirection);

    this.entity = entity;
    this.direction = direction;
  };

  exports.ChangeDirection = ChangeDirection;

  var ActivateTurbo = function ActivateTurbo(entity) {
    _classCallCheck(this, ActivateTurbo);

    this.entity = entity;
  };

  exports.ActivateTurbo = ActivateTurbo;

  var Restart = function Restart() {
    _classCallCheck(this, Restart);
  };

  exports.Restart = Restart;
});

// do nothing (for FF 40 support)