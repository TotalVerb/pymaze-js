define(["exports", "events", "entities", "direction", "pathfind"], function (exports, _events, _entities, _direction, _pathfind) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var Enemy = (function (_Entity) {
    function Enemy(location, host, version) {
      _classCallCheck(this, Enemy);

      _get(Object.getPrototypeOf(Enemy.prototype), "constructor", this).call(this, location, host);

      this.version = version;
      this.speed = 12;

      this._ai_delay = this.speed; // Glitches may occur if not set to speed.
      this._current_tick = 0;
    }

    _inherits(Enemy, _Entity);

    _createClass(Enemy, [{
      key: "move",
      value: function move() {
        this._current_tick += 1;
        if (this._current_tick >= this._ai_delay) {
          this._current_tick = 0;

          if (this.version === 1) {
            return this.move1();
          } else if (this.version === 2) {
            return this.move2();
          } else if (this.version === 3) {
            return this.move3();
          }
        }
      }
    }, {
      key: "chase_player",
      value: function chase_player() {
        const start = this.location;
        const end = this.host.player.location;
        return _pathfind.astar(this.host.maze, start, end);
      }
    }, {
      key: "move1",
      value: function move1() {
        // move1 is almost random, but never reverses if possible.

        var directions = Array.from(this.host.maze.get_directions2(this.location));

        if (directions.length === 1) {
          return new _events.ChangeDirection(this, directions[0]);
        } else if (this._facing !== null) {
          // Don't allow reversing.
          const rev = (0, _direction.reverse_direction)(this._facing);
          directions = directions.filter(dir => dir !== rev);
        }

        const direction = directions[~ ~(Math.random() * directions.length)];
        return new _events.ChangeDirection(this, direction);
      }
    }, {
      key: "move2",
      value: function move2() {
        // move2 is the 'chaser' mode
        const path = this.chase_player();
        return new _events.ChangeDirection(this, path.direction);
      }
    }, {
      key: "move3",
      value: function move3() {
        // Checks if distance is less than a specified number
        // (Can vary based on difficulty, default is 15)
        // If less than specified number than activates 'chaser' mode
        // If more than specified number than activates 'random' mode
        if (_pathfind.euclid(this.location, this.host.player.location) < 15) {
          return this.move2();
        } else {
          return this.move1();
        }
      }
    }]);

    return Enemy;
  })(_entities.Entity);

  exports.Enemy = Enemy;
});