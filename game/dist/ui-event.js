define(["exports", "direction", "events", "ui-shared", "ui-state"], function (exports, _direction, _events, _uiShared, _uiState) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.get_key_help = get_key_help;
  exports.addHandler = addHandler;
  exports.createHandlers = createHandlers;
  exports.spontaneous_events = spontaneous_events;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // Polyfill offsetX / offsetY
  if (!MouseEvent.prototype.hasOwnProperty("offsetX")) {
    Object.defineProperties(MouseEvent.prototype, {
      offsetX: {
        get: function () {
          return this.clientX - this.target.getBoundingClientRect().left;
        }
      },
      offsetY: {
        get: function () {
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
  // If there's a touch screen, use different instructions.
  const supportsTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints > 0;

  const DIRECTION_KEYS = {
    w: _direction.NORTH,
    a: _direction.WEST,
    s: _direction.SOUTH,
    d: _direction.EAST
  };

  const STOP_MOTION_KEY = " ";
  const TURBO_KEY = "t";

  function get_key_help() {
    const dct = new Map();

    if (supportsTouch) {
      dct.set("Touch map", "Move towards square");
      dct.set("Hold finger down", "Turbo mode");
    } else {
      for (var k in DIRECTION_KEYS) {
        dct.set(k, "Move " + (0, _direction.dirname)(DIRECTION_KEYS[k]));
      }
      dct.set(STOP_MOTION_KEY, "Stop moving");
      dct.set(TURBO_KEY, "Turbo mode");
    }

    return dct;
  }

  const ui_events = [];

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
        const result = this.call(x, y);
        if (result !== "persist") {
          this.inactive = true;
        }
      }
    }]);

    return EventHandler;
  })();

  function addHandler(x, y, w, h, call) {
    const handler = new EventHandler(x, y, w, h, call);
    handlers.push(handler);
    return handler;
  }

  var touching = 0;

  function createHandlers() {
    _uiShared.canvas.addEventListener("mousedown", function (ev) {
      const [x, y] = [ev.offsetX, ev.offsetY];
      for (var handler of handlers) {
        handler.run(x, y);
      }
      handlers = handlers.filter(h => !h.inactive);
      touching = Date.now();
    }, false);

    _uiShared.canvas.addEventListener("mouseup", function () {
      touching = 0;
    });

    _uiShared.canvas.addEventListener("mousemove", function (ev) {
      exports.mousex = mousex = ev.offsetX;
      exports.mousey = mousey = ev.offsetY;
    }, false);

    document.addEventListener("keydown", function (ev) {
      const input = get_event_from_char(ev.key);
      if (input !== undefined) {
        ui_events.push(input);
      }
    }, false);

    // Add game area click handler
    addHandler(0, 0, _uiShared.game_width, _uiShared.height, function (x, y) {
      const [tilex, tiley] = [~ ~(x / _uiState.tile_size_x), ~ ~(y / _uiState.tile_size_y)];
      if (tilex >= _uiState.state.maze.sizeX || tiley >= _uiState.state.maze.sizeY) {
        return "persist";
      } else if (_uiState.state.condition !== "running") {
        return "persist";
      } else {
        ui_events.push(new _events.GoToSquare(_uiState.state.player, [tilex, tiley]));
        return "persist";
      }
    });
  }

  function* spontaneous_events() {
    if (touching !== 0) {
      if (Date.now() > touching + 500) {
        // Touch for more than half second -> turbo
        yield new _events.ActivateTurbo(_uiState.state.player);
      }
    }
  }
});