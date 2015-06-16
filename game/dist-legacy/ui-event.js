define(["exports", "direction", "events", "ui-shared", "ui-state"], function (exports, _direction, _events, _uiShared, _uiState) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.get_key_help = get_key_help;
  exports.createHandlers = createHandlers;
  exports.addHandler = addHandler;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // Polyfill offsetX / offsetY
  if (!MouseEvent.prototype.hasOwnProperty("offsetX")) {
    Object.defineProperties(MouseEvent.prototype, {
      offsetX: {
        get: function get() {
          return this.clientX - this.target.getBoundingClientRect().left;
        }
      },
      offsetY: {
        get: function get() {
          return this.clientY - this.target.getBoundingClientRect().top;
        }
      }
    });
  }

  // Define constants and state constants.
  var handlers = [];
  var mousex = 0;
  exports.mousex = mousex;
  var mousey = 0;

  exports.mousey = mousey;
  var DIRECTION_KEYS = {
    w: _direction.NORTH,
    a: _direction.WEST,
    s: _direction.SOUTH,
    d: _direction.EAST
  };

  var STOP_MOTION_KEY = " ";
  var TURBO_KEY = "t";

  function get_key_help() {
    var dct = new Map();
    for (var k in DIRECTION_KEYS) {
      dct.set(k, "Move " + (0, _direction.dirname)(DIRECTION_KEYS[k]));
    }
    dct.set(STOP_MOTION_KEY, "Stop moving");
    dct.set(TURBO_KEY, "Turbo mode");

    return dct;
  }

  var ui_events = [];

  exports.ui_events = ui_events;
  function get_event_from_char(char) {
    /** Get the movement event for the player given the input character.
     Return None if the input character does not correspond to a movement
    key.
    */
    if (DIRECTION_KEYS.hasOwnProperty(char)) {
      return new _events.ChangeDirection(_uiState.state.player, DIRECTION_KEYS[char]);
    } else if (char === STOP_MOTION_KEY) {
      return new _events.ChangeDirection(_uiState.state.player, null);
    } else if (char === TURBO_KEY) {
      return new _events.ActivateTurbo(_uiState.state.player);
    }
  }

  var EventHandler = (function () {
    function EventHandler(x, y, w, h, call) {
      _classCallCheck(this, EventHandler);

      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.call = call;
      this.inactive = false;
    }

    _createClass(EventHandler, [{
      key: "run",
      value: function run(x, y) {
        if (this.inactive || this.x > x || this.x + this.w < x || this.y > y || this.y + this.h < y) {
          return;
        }
        var result = this.call();
        if (result !== "persist") {
          this.inactive = true;
        }
      }
    }]);

    return EventHandler;
  })();

  function createHandlers() {
    _uiShared.canvas.addEventListener("mousedown", function (ev) {
      var x = ev.offsetX;
      var y = ev.offsetY;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          handler.run(x, y);
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

      handlers = handlers.filter(function (h) {
        return !h.inactive;
      });
    }, false);

    _uiShared.canvas.addEventListener("mousemove", function (ev) {
      exports.mousex = mousex = ev.offsetX;
      exports.mousey = mousey = ev.offsetY;
    }, false);

    document.addEventListener("keydown", function (ev) {
      var input = get_event_from_char(ev.key);
      if (input !== undefined) {
        ui_events.push(input);
      }
    }, false);
  }

  function addHandler(x, y, w, h, call) {
    var handler = new EventHandler(x, y, w, h, call);
    handlers.push(handler);
    return handler;
  }
});