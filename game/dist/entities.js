define(["exports", "events", "direction", "guide"], function (exports, _events, _direction, _guide) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Entity = (function () {
    function Entity(location, host) {
      _classCallCheck(this, Entity);

      this.speed = 8;
      this.location = location;
      this.host = host;

      this._real_speed = this.speed;
      this.turbo_time = 0;
      this.turbo_left = 1;
      this._movement_counter = 0; // when 0, can move
      this.facing = null; // direction facing
      this.guide = null; // guide
    }

    _createClass(Entity, [{
      key: "do_move",
      value: function do_move() {
        this._movement_counter = Math.max(0, this._movement_counter - 1);
        if (this.turbo_time > 0) {
          this.turbo_time -= 1;
          if (this.turbo_time === 0) {
            this.speed = this._real_speed;
          }
        }
        if (this._movement_counter !== 0) {
          return;
        }

        // Update facing using the movement guide.
        if (this.guide !== null) {
          this.guide.guide(this, this.host.maze);
        }

        // Check if destination is passable. If so, do the move.
        // Then reset the movement counter.
        if (this.facing !== null) {
          const new_location = [this.location[0] + (0, _direction.dx)(this.facing), this.location[1] + (0, _direction.dy)(this.facing)];

          if (this.host.maze.get2(new_location)) {
            this.location = new_location;
            this._movement_counter = this.speed;
          }
        }
      }
    }, {
      key: "process_event",
      value: function process_event(ev) {
        if (ev instanceof _events.ChangeDirection) {
          this.guide = new _guide.QueuedFacingGuide(ev.direction);
        } else if (ev instanceof _events.ActivateTurbo) {
          // Turbo can only be used once.
          if (this.turbo_left > 0) {
            this.turbo_left -= 1;
            this._real_speed = this.speed;
            this.turbo_time = 80;
            this.speed = Math.ceil(this.speed / 2);
          }
        } else if (ev instanceof _events.GoToSquare) {
          this.guide = new _guide.DestinationGuide(ev.destination);
        }
      }
    }]);

    return Entity;
  })();

  exports.Entity = Entity;
});