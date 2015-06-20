define(["exports", "location", "direction"], function (exports, _location, _direction) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.euclid = euclid;
  exports.astar = astar;

  function reconstruct_path(came_from, current) {
    const total_path = [current];
    while (came_from.hasOwnProperty(current)) {
      current = came_from[current];
      total_path.push(current);
    }
    return total_path;
  }

  function euclid(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }

  function astar(maze, start, end) {
    const p_start = (0, _location.pack2)(start);
    const p_end = (0, _location.pack2)(end);

    const closed_set = new Set(); // The set of nodes already evaluated.

    // The set of tentative nodes to be evaluated,
    // initially containing the start node
    const open_set = new Set([p_start]);
    const came_from = {}; // The map of navigated nodes.

    // Cost from start along best known path.
    const g_score = {
      [p_start]: 0
    };

    // Estimated total cost from start to goal through y.
    const f_score = {
      [p_start]: g_score[p_start] + euclid(start, end)
    };

    while (open_set.size) {
      var p_current = null;
      var best_score = Infinity;
      for (var candidate of open_set) {
        const candidate_score = f_score[candidate];
        if (candidate_score < best_score) {
          p_current = candidate;
          best_score = candidate_score;
        }
      }
      if (p_current === p_end) {
        const rp = reconstruct_path(came_from, p_end);
        const [px, py] = (0, _location.unpack)(rp[rp.length - 2]);
        return {
          distance: rp.length,
          direction: (0, _direction.dirpack)(px - start[0], py - start[1])
        };
      }

      var current = (0, _location.unpack)(p_current);
      open_set.delete(p_current);
      closed_set.add(p_current);
      for (var neighbour of maze.get_neighbours(current[0], current[1])) {
        const p_neighbour = (0, _location.pack2)(neighbour);

        if (closed_set.has(p_neighbour)) {
          continue;
        }
        const tentative_g_score = g_score[current] + 1;

        const not_evaluate = !open_set.has(p_neighbour);
        if (not_evaluate || tentative_g_score < g_score[p_neighbour]) {
          came_from[p_neighbour] = p_current;
          g_score[p_neighbour] = tentative_g_score;
          f_score[p_neighbour] = g_score[p_neighbour] + euclid(neighbour, end);
          open_set.add(p_neighbour);
        }
      }
    }
  }
});