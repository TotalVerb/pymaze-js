import {NORTH, WEST, SOUTH, EAST, dirname} from "direction";
import {ChangeDirection, ActivateTurbo, GoToSquare} from "events";
import {canvas, game_width, height} from "ui-shared";
import {state, tile_size_x, tile_size_y} from "ui-state";

// Define constants and state constants.
let handlers = [];
export let mousex = 0;
export let mousey = 0;

// If there's a touch screen, use different instructions.
const supportsTouch = ("ontouchstart" in window) ||
                      window.navigator.msMaxTouchPoints > 0;

const DIRECTION_KEYS = {
  w: NORTH,
  a: WEST,
  s: SOUTH,
  d: EAST
};

const STOP_MOTION_KEY = ' ';
const TURBO_KEY = 't';

export function get_key_help() {
  const dct = new Map();

  if (supportsTouch) {
    dct.set('Touch map', 'Move towards square');
    dct.set('Hold finger down', 'Turbo mode');
  } else {
    for (let k in DIRECTION_KEYS) {
      dct.set(k, 'Move ' + dirname(DIRECTION_KEYS[k]));
    }
    dct.set(STOP_MOTION_KEY, 'Stop moving');
    dct.set(TURBO_KEY, 'Turbo mode');
  }

  return dct;
}

export const ui_events = [];


function get_event_from_char(char) {
  /** Get the movement event for the player given the input character.

  Return None if the input character does not correspond to a movement
  key.
  */
  if (DIRECTION_KEYS.hasOwnProperty(char)) {
    return new ChangeDirection(state.player, DIRECTION_KEYS[char]);
  } else if (char === STOP_MOTION_KEY) {
    return new ChangeDirection(state.player, null);
  } else if (char === TURBO_KEY) {
    return new ActivateTurbo(state.player);
  }
}

class EventHandler {
  constructor(x, y, w, h, call) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.call = call;
    this.inactive = false;
  }

  run(x, y) {
    if (this.inactive ||
      this.x > x || this.x + this.w < x ||
      this.y > y || this.y + this.h < y) {
        return;
    }
    const result = this.call(x, y);
    if (result !== "persist") {
      this.inactive = true;
    }
  }
}

export function addHandler(x, y, w, h, call) {
  const handler = new EventHandler(x, y, w, h, call);
  handlers.push(handler);
  return handler;
}

let touching = 0;

export function createHandlers() {
  canvas.addEventListener("pointerdown", function(ev) {
    const [x, y] = [ev.offsetX, ev.offsetY];
    for (let handler of handlers) {
      handler.run(x, y);
    }
    handlers = handlers.filter(h => !h.inactive);
    touching = Date.now();
  }, false);

  canvas.addEventListener("pointerup", function() {
    touching = 0;
  });

  canvas.addEventListener("pointermove", function(ev) {
    mousex = ev.offsetX;
    mousey = ev.offsetY;
  }, false);

  document.addEventListener("keydown", function(ev) {
    const input = get_event_from_char(ev.key);
    if (input !== undefined) {
      ui_events.push(input);
    }
  }, false);

  // Add game area click handler
  addHandler(0, 0, game_width, height, function(x, y) {
    const [tilex, tiley] = [~~(x / tile_size_x), ~~(y / tile_size_y)];
    if (tilex >= state.maze.sizeX || tiley >= state.maze.sizeY) {
      return "persist";
    } else if (state.condition !== "running") {
      return "persist";
    } else {
      ui_events.push(new GoToSquare(state.player, [tilex, tiley]));
      return "persist";
    }
  });
}

export function* spontaneous_events() {
  if (touching !== 0) {
    if (Date.now() > touching + 500) {
      // Touch for more than half second -> turbo
      yield new ActivateTurbo(state.player);
    }
  }
}
