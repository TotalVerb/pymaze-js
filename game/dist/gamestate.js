define(["exports", "enemy", "entities", "mazemaker", "location"], function (exports, _enemy, _entities, _mazemaker, _location2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GameState = (function () {
    function GameState(maze = (0, _mazemaker.depth_first_generate)(13, 13), enemies = 9) {
      _classCallCheck(this, GameState);

      this.maze = maze;
      this.player = new _entities.Entity([1, 1], this);
      this.enemies = [];
      for (var i = 0; i < enemies; i++) {
        var _location = [2 + ~ ~(Math.random() * (this.maze.sizeX - 2)), 2 + ~ ~(Math.random() * (this.maze.sizeY - 2))];
        while (!this.maze.get(..._location)) {
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
      value: function* entities() {
        /** Yield all significant entities (players and enemies). */
        yield this.player;
        yield* this.enemies;
      }
    }, {
      key: "do_moves",
      value: function do_moves() {
        /** Move all entities in this state based off their facings. **/
        for (var ent of this.entities()) {
          ent.do_move();
        }

        const this_time = window.performance.now();
        this.fps = 0.9 * this.fps + 100 / (this_time - this.last_time);
        this.last_time = this_time;
      }
    }, {
      key: "check_endgame",
      value: function check_endgame() {
        if (this.maze.exits.has((0, _location2.pack2)(this.player.location))) {
          this.condition = "won";
        }
        for (var enemy of this.enemies) {
          if ((0, _location2.pack2)(enemy.location) === (0, _location2.pack2)(this.player.location)) {
            this.condition = "lost";
          }
        }
      }
    }]);

    return GameState;
  })();

  exports.GameState = GameState;
});