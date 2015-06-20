define(["exports", "enemy", "entities", "mazemaker", "location"], function (exports, _enemy, _entities, _mazemaker, _location2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GameState = (function () {
    function GameState() {
      var maze = arguments[0] === undefined ? (0, _mazemaker.depth_first_generate)(13, 13) : arguments[0];
      var enemies = arguments[1] === undefined ? 9 : arguments[1];

      _classCallCheck(this, GameState);

      this.maze = maze;
      this.player = new _entities.Entity([1, 1], this);
      this.enemies = [];
      for (var i = 0; i < enemies; i++) {
        var _location = [2 + ~ ~(Math.random() * (this.maze.sizeX - 2)), 2 + ~ ~(Math.random() * (this.maze.sizeY - 2))];
        while (!(_maze = this.maze).get.apply(_maze, _toConsumableArray(_location))) {
          var _maze;

          _location = [2 + ~ ~(Math.random() * (this.maze.sizeX - 2)), 2 + ~ ~(Math.random() * (this.maze.sizeY - 2))];
        }

        this.enemies.push(new _enemy.Enemy(_location, this, 1 + ~ ~(Math.random() * 3)));
      }
      this.condition = "running";
      this.fps = 0;
      this.last_time = window.performance.now();
    }

    _createClass(GameState, [{
      key: "entities",
      value: regeneratorRuntime.mark(function entities() {
        return regeneratorRuntime.wrap(function entities$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              context$2$0.next = 2;
              return this.player;

            case 2:
              return context$2$0.delegateYield(this.enemies, "t0", 3);

            case 3:
            case "end":
              return context$2$0.stop();
          }
        }, entities, this);
      })
    }, {
      key: "do_moves",
      value: function do_moves() {
        /** Move all entities in this state based off their facings. **/
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.entities()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ent = _step.value;

            ent.do_move();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var this_time = window.performance.now();
        this.fps = 0.9 * this.fps + 100 / (this_time - this.last_time);
        this.last_time = this_time;
      }
    }, {
      key: "check_endgame",
      value: function check_endgame() {
        if (this.maze.exits.has((0, _location2.pack2)(this.player.location))) {
          this.condition = "won";
        }
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.enemies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var enemy = _step2.value;

            if ((0, _location2.pack2)(enemy.location) === (0, _location2.pack2)(this.player.location)) {
              this.condition = "lost";
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }]);

    return GameState;
  })();

  exports.GameState = GameState;
});

/** Yield all significant entities (players and enemies). */