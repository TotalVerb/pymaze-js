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
      this.speed = 10;

      this._ai_delay = 20;
      this._current_tick = ~ ~(Math.random() * 20); // each AI offset for speed
    }

    _inherits(Enemy, _Entity);

    _createClass(Enemy, [{
      key: "move",
      value: function move() {
        this._current_tick += 1;
        if (this._current_tick >= this._ai_delay) {
          this._current_tick = 0;

          if (Math.random() > 0.9) {
            // 10% chance of changing versions.
            this.version = ~ ~(1 + 2 * Math.random());
          }

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
      key: "move1",
      value: function move1() {
        // move1 is almost random, but never reverses if possible.

        var directions = Array.from(this.host.maze.get_directions2(this.location));

        if (directions.length === 1) {
          return new _events.ChangeDirection(this, directions[0]);
        } else if (this.facing !== null) {
          // Don't allow reversing.
          const rev = (0, _direction.reverse_direction)(this.facing);
          directions = directions.filter(dir => dir !== rev);
        }

        const direction = directions[~ ~(Math.random() * directions.length)];
        return new _events.ChangeDirection(this, direction);
      }
    }, {
      key: "move2",
      value: function move2() {
        // move2 is the 'chaser' mode
        return new _events.GoToSquare(this, this.host.player.location);
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
    }, {
      key: "right_image",
      value: function right_image() {
        if (this.version === 1) {
          return "enemy-2";
        } else if (this.version === 2) {
          return "enemy-1";
        } else {
          return _pathfind.euclid(this.location, this.host.player.location) < 15 ? "enemy-1" : "enemy-2";
        }
      }
    }]);

    return Enemy;
  })(_entities.Entity);

  exports.Enemy = Enemy;
});