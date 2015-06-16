import {pack2, unpack} from "location";
import {dirpack} from "direction";

function reconstruct_path(came_from, current) {
  const total_path = [current];
  while (came_from.hasOwnProperty(current)) {
    current = came_from[current];
    total_path.push(current);
  }
  return total_path;
}

export function euclid(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function astar(maze, start, end) {
  const packed_start = pack2(start);
  const packed_end = pack2(end);

  const closed_set = new Set();  // The set of nodes already evaluated.

  // The set of tentative nodes to be evaluated,
  // initially containing the start node
  const open_set = new Set([packed_start]);
  const came_from = {};  // The map of navigated nodes.

  // Cost from start along best known path.
  const g_score = {
    [packed_start]: 0
  };

  // Estimated total cost from start to goal through y.
  const f_score = {
    [packed_start]: g_score[packed_start] + euclid(start, end)
  };

  while (open_set.size) {
    let packed_current = null;
    let best_score = Infinity;
    for (let candidate of open_set) {
      const candidate_score = f_score[candidate];
      if (candidate_score < best_score) {
        packed_current = candidate;
        best_score = candidate_score;
      }
    }
    if (packed_current === packed_end) {
      const rp = reconstruct_path(came_from, packed_end);
      const [px, py] = unpack(rp[rp.length - 2]);
      return {
        distance: rp.length,
        direction: dirpack(
            px - start[0],
            py - start[1]
        )
      };
    }

    let current = unpack(packed_current);
    open_set.delete(packed_current);
    closed_set.add(packed_current);
    for (let neighbour of maze.get_neighbours(current[0], current[1])) {
      const packed_neighbour = pack2(neighbour);

      if (closed_set.has(packed_neighbour)) {
        continue;
      }
      const tentative_g_score = g_score[current] + 1;

      const not_evaluate = !open_set.has(packed_neighbour);
      if (not_evaluate || tentative_g_score < g_score[packed_neighbour]) {
        came_from[packed_neighbour] = packed_current;
        g_score[packed_neighbour] = tentative_g_score;
        f_score[packed_neighbour] = g_score[packed_neighbour] + euclid(neighbour, end);
        open_set.add(packed_neighbour);
      }
    }
  }
}
