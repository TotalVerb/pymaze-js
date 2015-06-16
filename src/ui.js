import {done_paint} from "ui-state";
import {initialized, initialize_ui} from "ui-shared";
import {draw_info_bar, paint_game, draw_buttons} from "ui-draw";
import {dirty, complete_repaint_necessary} from "ui-state";
import {createHandlers, ui_events} from "ui-event";
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
    draw_info_bar();
    paint_game();
    done_paint();
  } else if (dirty) {
    paint_game();
    done_paint();
  }

  draw_buttons();
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

/*
    def draw(self):
        # Generate all the elements.
        status = this.gen_status_bar()
        game_area = this.gen_game_area()
        overlay = this.gen_overlay()

        # Blit the separate elements onto the main display.
        this.display.blit(game_area, (0, 0))
        this.display.blit(this.infoBar, (this._gameAreaWidth, 0))
        this.display.blit(status, (this._gameAreaWidth, this._infoBarHeight))
        if overlay:
            this.display.blit(overlay, (0, 0))

        # TODO: Optimize by only updating the changed rects
        pygame.display.update()

*/
