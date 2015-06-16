import {pack} from "location";
import {NORTH, SOUTH, EAST, WEST} from "direction";

export class MazeGrid {
  /** A grid representing a maze.

  Conform to the specification, version 6, at <http://goo.gl/dMRovy>.
  */

  constructor(x_size, y_size) {
    this.sizeX = x_size;
    this.sizeY = y_size;
    this._maze_list = new Uint8Array(x_size * y_size);

    this.entrance = null;
    this.exits = new Set();
  }

  is_coordinate(x, y) {
    /** Return true if the given coordinate is valid. */

    return (
        x >= 0 && x < this.sizeX &&
        y >= 0 && y < this.sizeY
    );
  }

  set_entrance(x, y) {
    if (!this.get(x, y)) {
      // entrance only makes sense if passable
      throw new Error("Can't put entrance on impassible square.");
    }

    this.entrance = [x, y];
  }

  add_exit(x, y) {
    if (!this.get(x, y)) {
      // exit only makes sense if passable
      throw new Error("Can't put exit on impassible square.");
    }

    this.exits.add(pack(x, y));
  }

  set(x, y, value) {
    /** Set a value.

    Warning: This method is highly optimized. Using x/y values that are
    not valid integers within the maze's coordinate bounds is undefined
    behaviour.
    */
    this._maze_list[x * this.sizeY + y] = value;
  }

  get(x, y) {
    /** Get a value.

    Warning: This method is highly optimized. Using x/y values that are
    not valid integers within the maze's coordinate bounds is undefined
    behaviour.
    */
    return this._maze_list[x * this.sizeY + y];
  }

  get2(xy) {
    /** Get a value from an array [x, y].

    Warning: This method is highly optimized. Using x/y values that are
    not valid integers within the maze's coordinate bounds is undefined
    behaviour.
    */
    return this._maze_list[xy[0] * this.sizeY + xy[1]];
  }

  * get_neighbours(x, y) {
    if (this.is_coordinate(x, y - 1) && this.get(x, y - 1)) {
      yield [x, y - 1];
    }
    if (this.is_coordinate(x, y + 1) && this.get(x, y + 1)) {
      yield [x, y + 1];
    }
    if (this.is_coordinate(x - 1, y) && this.get(x - 1, y)) {
      yield [x - 1, y];
    }
    if (this.is_coordinate(x + 1, y) && this.get(x + 1, y)) {
      yield [x + 1, y];
    }
  }

  * get_neighbours2(loc) {
    yield* this.get_neighbours(loc[0], loc[1]);
  }

  * get_directions(x, y) {
    if (this.is_coordinate(x, y - 1) && this.get(x, y - 1)) {
      yield NORTH;
    }
    if (this.is_coordinate(x, y + 1) && this.get(x, y + 1)) {
      yield SOUTH;
    }
    if (this.is_coordinate(x - 1, y) && this.get(x - 1, y)) {
      yield WEST;
    }
    if (this.is_coordinate(x + 1, y) && this.get(x + 1, y)) {
      yield EAST;
    }
  }

  * get_directions2(loc) {
    yield* this.get_directions(loc[0], loc[1]);
  }
}
