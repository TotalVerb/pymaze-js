define(["exports"], function (exports) {
  /** Measures the FPS of the UI. (GFPS) */

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateFPS = updateFPS;
  var last_time = window.performance.now();
  var fps = 0;

  exports.fps = fps;

  function updateFPS() {
    const this_time = window.performance.now();
    const diff = this_time - last_time;
    last_time = this_time;
    exports.fps = fps = 0.9 * fps + 100 / diff;
  }
});