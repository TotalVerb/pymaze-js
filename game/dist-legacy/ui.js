define(["exports", "ui-state", "ui-shared", "ui-draw", "ui-event"], function (exports, _uiState, _uiShared, _uiDraw, _uiEvent) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.poll = poll;
  exports.start = start;
  var marked0$0 = [poll].map(regeneratorRuntime.mark);
  Object.defineProperty(exports, "repaint", {
    enumerable: true,
    get: function get() {
      return _uiState.repaint;
    }
  });
  Object.defineProperty(exports, "changeState", {
    enumerable: true,
    get: function get() {
      return _uiState.changeState;
    }
  });

  var started = false;

  function frame() {
    if (!_uiShared.initialized) {
      // Are resources available? If so, acquire them.
      if ((0, _uiShared.initialize_ui)()) {
        (0, _uiEvent.createHandlers)();
      }
      return;
    }

    if (_uiState.complete_repaint_necessary) {
      (0, _uiDraw.draw_info_bar)();
      (0, _uiDraw.paint_game)();
      (0, _uiState.done_paint)();
    } else if (_uiState.dirty) {
      (0, _uiDraw.paint_game)();
      (0, _uiState.done_paint)();
    }

    (0, _uiDraw.draw_buttons)();
  }

  function poll() {
    return regeneratorRuntime.wrap(function poll$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          if (!_uiEvent.ui_events.length) {
            context$1$0.next = 5;
            break;
          }

          context$1$0.next = 3;
          return _uiEvent.ui_events.shift();

        case 3:
          context$1$0.next = 0;
          break;

        case 5:
        case "end":
          return context$1$0.stop();
      }
    }, marked0$0[0], this);
  }

  function start() {
    if (started) {
      throw new Error("Already started the UI.");
    }

    started = true;
    setInterval(frame, 1000 / 24); // 24 FPS
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
});