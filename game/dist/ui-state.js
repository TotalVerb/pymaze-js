define(["exports", "ui-shared", "ui-draw"], function (exports, _uiShared, _uiDraw) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.changeState = changeState;
  exports.repaint = repaint;
  exports.done_paint = done_paint;
  var state = null;
  exports.state = state;
  var dirty = false;
  exports.dirty = dirty;
  var complete_repaint_necessary = false;

  exports.complete_repaint_necessary = complete_repaint_necessary;
  var tile_size_x = 0;
  exports.tile_size_x = tile_size_x;
  var tile_size_y = 0;

  exports.tile_size_y = tile_size_y;

  function changeState(new_state) {
    exports.complete_repaint_necessary = complete_repaint_necessary = true;
    exports.state = state = new_state;

    exports.tile_size_x = tile_size_x = _uiDraw.game_width / state.maze.sizeX;
    exports.tile_size_y = tile_size_y = _uiShared.height / state.maze.sizeY;
  }

  function repaint(complete = false) {
    exports.dirty = dirty = true;
    exports.complete_repaint_necessary = complete_repaint_necessary = complete_repaint_necessary || complete;
  }

  function done_paint() {
    exports.dirty = dirty = false;
    exports.complete_repaint_necessary = complete_repaint_necessary = false;
  }
});