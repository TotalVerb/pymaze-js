define(["exports", "grid", "direction"], function (exports, _grid, _direction) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.depth_first_generate = depth_first_generate;

  // How spacious will the maze be?
  // Higher value = more spacious
  // Don't set too high or maze will take a long time to generate.

  var POROSITY = 0.7;

  function make_exit(maze) {
    /** Generate exit at last available square. */
    for (var x = maze.sizeX - 1; x >= 0; x--) {
      for (var y = maze.sizeY - 1; y >= 0; y--) {
        if (maze.get(x, y)) {
          maze.add_exit(x, y);
          return;
        }
      }
    }
  }

  function make_entrance(maze) {
    /** Generate entrance at first available square. */
    for (var x = 0; x < maze.sizeX; x++) {
      for (var y = 0; y < maze.sizeY; y++) {
        if (maze.get(x, y)) {
          maze.set_entrance(x, y);
          return;
        }
      }
    }
  }

  function make_maze_from_edges(passable, edges_h, edges_v) {
    var maze = new _grid.MazeGrid(edges_v.length + passable.length, edges_h[0].length + passable[0].length);

    for (var x = 0; x < maze.sizeX; x++) {
      for (var y = 0; y < maze.sizeY; y++) {
        if (x % 2 === 1) {
          if (y % 2 === 1) {
            maze.set(x, y, Number(passable[~ ~(x / 2)][~ ~(y / 2)] !== 0));
          } else {
            maze.set(x, y, edges_h[~ ~(x / 2)][~ ~(y / 2)]);
          }
        } else {
          if (y % 2 === 1) {
            maze.set(x, y, edges_v[~ ~(x / 2)][~ ~(y / 2)]);
          } else {
            try {
              maze.set(x, y, edges_v[~ ~(x / 2)][~ ~(y / 2)] & edges_h[~ ~(x / 2)][~ ~(y / 2)] & edges_v[~ ~(x / 2)][~ ~(y / 2) - 1] & edges_h[~ ~(x / 2) - 1][~ ~(y / 2)]);
            } catch (e) {}
          }
        }
      }
    }

    make_entrance(maze);
    make_exit(maze);
    return maze;
  }

  function depth_first_generate(width, height) {
    var passable = [];
    for (var x = 0; x < width; x++) {
      passable.push(new Float32Array(height));
    }

    var edges_h = [];
    for (var x = 0; x < width; x++) {
      edges_h.push(new Uint8Array(height + 1));
    }

    var edges_v = [];
    for (var x = 0; x < width + 1; x++) {
      edges_v.push(new Uint8Array(height));
    }

    passable[0][0] = 1;

    var record = [[0, 0]];

    while (record.length) {
      var last = record[record.length - 1];
      var directions = [0, 1, 2, 3];
      var possible = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = directions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var di = _step.value;

          var nextx = last[0] + (0, _direction.dx)(di);
          var nexty = last[1] + (0, _direction.dy)(di);

          if (nextx < 0 || nexty < 0 || nextx >= width || nexty >= height) {
            continue;
          }

          // print(di)
          if (passable[nextx][nexty] >= POROSITY) {
            // print('already been here')
            continue;
          }

          possible.push(di);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (possible.length === 0) {
        // backtrack
        record.pop();
        continue;
      } else {
        var di = possible[~ ~(Math.random() * possible.length)];
        var nextx = last[0] + (0, _direction.dx)(di);
        var nexty = last[1] + (0, _direction.dy)(di);
        passable[nextx][nexty] += Math.random();
        if (di === _direction.NORTH) {
          edges_h[last[0]][last[1]] = 1;
        } else if (di === _direction.SOUTH) {
          edges_h[last[0]][last[1] + 1] = 1;
        } else if (di === _direction.WEST) {
          edges_v[last[0]][last[1]] = 1;
        } else if (di === _direction.EAST) {
          edges_v[last[0] + 1][last[1]] = 1;
        }

        record.push([nextx, nexty]);
      }
    }

    return make_maze_from_edges(passable, edges_h, edges_v);
  }
});

// swallow exception