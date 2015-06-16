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
        var user_inputs = _ui.poll();
        var ai_inputs = [];

        if (this.state.condition === "running") {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.state.enemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var enemy = _step.value;

              var ev = enemy.move();
              if (ev !== undefined) {
                ai_inputs.push(ev);
              }
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

          this.state.do_moves();
          this.state.check_endgame();

          _ui.repaint();
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = user_inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var input = _step2.value;

            this._handle_input(input);
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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = ai_inputs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var input = _step3.value;

            this._handle_input(input);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
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
          var entity = input.entity;
          entity.process_event(input);
        }
      }
    }]);

    return GameServer;
  })();

  exports.GameServer = GameServer;
});