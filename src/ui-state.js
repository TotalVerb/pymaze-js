import {game_width, height} from "ui-shared";

export let state = null;
export let dirty = false;
export let complete_repaint_necessary = false;

export let tile_size_x = 0;
export let tile_size_y = 0;

export function changeState(new_state) {
  complete_repaint_necessary = true;
  state = new_state;

  tile_size_x = game_width / state.maze.sizeX;
  tile_size_y = height / state.maze.sizeY;
}

export function repaint(complete=false) {
  dirty = true;
  complete_repaint_necessary = complete_repaint_necessary || complete;
}

export function done_paint() {
  dirty = false;
  complete_repaint_necessary = false;
}
