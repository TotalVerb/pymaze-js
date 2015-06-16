import {done_paint} from "ui-state";
import {initialized, initialize_ui} from "ui-shared";
import {paintInfoBar, paintGame, paintButtons} from "ui-draw";
import {dirty, complete_repaint_necessary} from "ui-state";
import {createHandlers, ui_events} from "ui-event";
import {updateFPS} from "ui-perf";
export {repaint, changeState} from "ui-state";

let started = false;

function frame() {
  if (!initialized) {
    // Are resources available? If so, acquire them.
    if (initialize_ui()) {
      createHandlers();
    }
    return;
  }

  if (complete_repaint_necessary) {
    paintInfoBar();
    paintGame();
    done_paint();
  } else if (dirty) {
    paintGame();
    done_paint();
  }

  paintButtons();
  updateFPS();
}

export function* poll() {
  while (ui_events.length) {
    yield ui_events.shift();
  }
}

export function start() {
  if (started) {
    throw new Error("Already started the UI.");
  }

  started = true;
  setInterval(frame, 1000 / 24);  // 24 FPS
}
