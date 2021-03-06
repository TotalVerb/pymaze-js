import {MazeGrid} from "grid";
import {dx, dy, NORTH, WEST, SOUTH, EAST} from "direction";

// How spacious will the maze be?
// Higher value = more spacious
// Don't set too high or maze will take a long time to generate.

const POROSITY = 0.75;

function setExit(maze) {
  /** Generate exit at last available square. */
  for (let x = maze.sizeX - 1; x >= 0; x--) {
    for (let y = maze.sizeY - 1; y >= 0; y--) {
      if (maze.get(x, y)) {
        maze.add_exit(x, y);
        return;
      }
    }
  }
}

function setEntrance(maze) {
  /** Generate entrance at first available square. */
  for (let x = 0; x < maze.sizeX; x++) {
    for (let y = 0; y < maze.sizeY; y++) {
      if (maze.get(x, y)) {
        maze.set_entrance(x, y);
        return;
      }
    }
  }
}

function compileMaze(passable, edges_h, edges_v) {
  const maze = new MazeGrid(
      edges_v.length + passable.length,
      edges_h[0].length + passable[0].length
  );

  for (let x = 0; x < maze.sizeX; x++) {
    for (let y = 0; y < maze.sizeY; y++) {
      if (x % 2 === 1) {
        if (y % 2 === 1) {
          maze.set(x, y, Number(passable[~~(x / 2)][~~(y / 2)] !== 0));
        } else {
          maze.set(x, y, edges_h[~~(x / 2)][~~(y / 2)]);
        }
      } else {
        if (y % 2 === 1) {
          maze.set(x, y, edges_v[~~(x / 2)][~~(y / 2)]);
        } else {
          try {
            maze.set(x, y, (
              edges_v[~~(x / 2)][~~(y / 2)] &
              edges_h[~~(x / 2)][~~(y / 2)] &
              edges_v[~~(x / 2)][~~(y / 2) - 1] &
              edges_h[~~(x / 2) - 1][~~(y / 2)]
            ));
          } catch(e) {
            // swallow exception
          }
        }
      }
    }
  }

  setEntrance(maze);
  setExit(maze);
  return maze;
}

export function depth_first_generate(width, height) {
  const passable = [];
  for (let x = 0; x < width; x++) {
    passable.push(new Float32Array(height));
  }

  const edges_h = [];
  for (let x = 0; x < width; x++) {
    edges_h.push(new Uint8Array(height + 1));
  }

  const edges_v = [];
  for (let x = 0; x < width + 1; x++) {
    edges_v.push(new Uint8Array(height));
  }

  passable[0][0] = 1;

  const record = [[0, 0]];

  while (record.length) {
    const last = record[record.length - 1];
    const directions = [0, 1, 2, 3];
    const possible = [];

    for (let di of directions) {
      const nextx = last[0] + dx(di);
      const nexty = last[1] + dy(di);

      // (1) inside game bounds
      // (2) not traversed too many times
      if (nextx >= 0 && nexty >= 0 && nextx < width && nexty < height
        && passable[nextx][nexty] < POROSITY) {
        possible.push(di);
      }
    }

    if (possible.length === 0) {
      // no way to proceeed; backtrack
      record.pop();
      continue;
    } else {
      const di = possible[~~(Math.random() * possible.length)];
      const nextx = last[0] + dx(di);
      const nexty = last[1] + dy(di);
      passable[nextx][nexty] += Math.random();
      if (di === NORTH) {
        edges_h[last[0]][last[1]] = 1;
      } else if (di === SOUTH) {
        edges_h[last[0]][last[1] + 1] = 1;
      } else if (di === WEST) {
        edges_v[last[0]][last[1]] = 1;
      } else if (di === EAST) {
        edges_v[last[0] + 1][last[1]] = 1;
      }

      record.push([nextx, nexty]);
    }
  }

  return compileMaze(passable, edges_h, edges_v);
}
