import {pack2, unpack} from "location";
import {dirpack} from "direction";

function reconstructPath(came_from, current) {
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

function findMinKey(keys, dict) {
  /** Find the key with lowest weight in the given dictionary.

  Return null if keys is empty. */

  let current = null;
  let best_score = Infinity;
  for (let candidate of keys) {
    const candidate_score = dict[candidate];
    if (candidate_score < best_score) {
      current = candidate;
      best_score = candidate_score;
    }
  }

  return current;
}

export function astar(maze, start, end) {
  /** Find a path from start to end.

  This method uses the A* algorithm with a Euclidean heuristic.
  See https://en.wikipedia.org/wiki/A*_search_algorithm for a description.

  A* is used because it has good efficiency and is correct in all cases.
  Our implementation does NOT use a priority queue because mazes tend not to
  be too large, so the overhead of a priority queue is not worth it. */

  const p_start = pack2(start);
  const p_end = pack2(end);

  // The set of nodes already evaluated.
  const closed_set = new Set();

  // The set of tentative nodes to be evaluated (initially start node).
  const open_set = new Set([p_start]);

  // The map of predecessors for all nodes.
  const came_from = {};

  // Cost (from start) along best known path.
  const g_score = {
    [p_start]: 0
  };

  // Estimated total cost from start to goal through y.
  const f_score = {
    [p_start]: g_score[p_start] + euclid(start, end)
  };

  while (open_set.size) {
    // Find best next node using heuristic
    const p_current = findMinKey(open_set, f_score);

    // found the end?
    if (p_current === p_end) {
      const rp = reconstructPath(came_from, p_end);
      const [px, py] = unpack(rp[rp.length - 2]);
      return {
        distance: rp.length,
        direction: dirpack(px - start[0], py - start[1])
      };
    }

    // update viewed squares sets
    open_set.delete(p_current);
    closed_set.add(p_current);

    const current = unpack(p_current);

    for (let neighbour of maze.get_neighbours2(current)) {
      const p_neighbour = pack2(neighbour);

      if (closed_set.has(p_neighbour)) {
        // seen it already
        continue;
      }
      open_set.add(p_neighbour);

      // relax the node
      const tentative_g_score = g_score[current] + 1;

      if (tentative_g_score < g_score[p_neighbour]) {
        came_from[p_neighbour] = p_current;
        g_score[p_neighbour] = tentative_g_score;
        f_score[p_neighbour] = g_score[p_neighbour] + euclid(neighbour, end);
      }
    }
  }
}
