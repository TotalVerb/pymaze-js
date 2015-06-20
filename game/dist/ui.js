define(["exports", "ui-state", "ui-shared", "ui-draw", "ui-event", "ui-perf"], function (exports, _uiState, _uiShared, _uiDraw, _uiEvent, _uiPerf) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.poll = poll;
  exports.start = start;
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
      (0, _uiDraw.paintInfoBar)();
      (0, _uiDraw.paintGame)();
      (0, _uiState.done_paint)();
    } else if (_uiState.dirty) {
      (0, _uiDraw.paintGame)();
      (0, _uiState.done_paint)();
    }

    (0, _uiDraw.paintButtons)();
    (0, _uiPerf.updateFPS)();
  }

  function* poll() {
    while (_uiEvent.ui_events.length) {
      yield _uiEvent.ui_events.shift();
    }
    yield* (0, _uiEvent.spontaneous_events)();
  }

  function start() {
    if (started) {
      throw new Error("Already started the UI.");
    }

    started = true;
    setInterval(frame, 1000 / 24); // 24 FPS
  }
});