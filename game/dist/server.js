define(["exports", "gamestate", "events", "ui"], function (exports, _gamestate, _events, _ui) {
  /** A module containing server-side functionality.
  
  This functionality is responsible for simulating the game and enforcing the
  rules.
  */

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GameServer = (function () {
    function GameServer() {
      _classCallCheck(this, GameServer);

      // this.mazeGenerator = mazeGenerator
      // this.maze = this.mazeGenerator.generate()
      this.maze = null;
      this.state = null;
      this.load_maze();
    }

    _createClass(GameServer, [{
      key: "load_maze",
      value: function load_maze() {
        this.state = new _gamestate.GameState();
        _ui.changeState(this.state);
        this.maze = this.state.maze;
      }
    }, {
      key: "step",
      value: function step() {
        const user_inputs = _ui.poll();
        const ai_inputs = [];

        if (this.state.condition === "running") {
          for (var enemy of this.state.enemies) {
            var ev = enemy.move();
            if (ev !== undefined) {
              ai_inputs.push(ev);
            }
          }

          this.state.do_moves();
          this.state.check_endgame();

          _ui.repaint();
        }

        for (var input of user_inputs) {
          this._handle_input(input);
        }
        for (var input of ai_inputs) {
          this._handle_input(input);
        }
      }
    }, {
      key: "restart",
      value: function restart() {
        this.load_maze();
      }
    }, {
      key: "_handle_input",
      value: function _handle_input(input) {
        if (input instanceof _events.Restart) {
          this.restart();
        } else if (input.entity) {
          // Event affects an entity.
          const entity = input.entity;
          entity.process_event(input);
        }
      }
    }]);

    return GameServer;
  })();

  exports.GameServer = GameServer;
});