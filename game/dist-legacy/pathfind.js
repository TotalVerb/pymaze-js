define(["exports", "location", "direction"], function (exports, _location, _direction) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.euclid = euclid;
  exports.astar = astar;

  function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

  function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

  function reconstruct_path(came_from, current) {
    var total_path = [current];
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
    var p_start = (0, _location.pack2)(start);
    var p_end = (0, _location.pack2)(end);

    var closed_set = new Set(); // The set of nodes already evaluated.

    // The set of tentative nodes to be evaluated,
    // initially containing the start node
    var open_set = new Set([p_start]);
    var came_from = {}; // The map of navigated nodes.

    // Cost from start along best known path.
    var g_score = _defineProperty({}, p_start, 0);

    // Estimated total cost from start to goal through y.
    var f_score = _defineProperty({}, p_start, g_score[p_start] + euclid(start, end));

    while (open_set.size) {
      var p_current = null;
      var best_score = Infinity;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = open_set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var candidate = _step.value;

          var candidate_score = f_score[candidate];
          if (candidate_score < best_score) {
            p_current = candidate;
            best_score = candidate_score;
          }
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

      if (p_current === p_end) {
        var rp = reconstruct_path(came_from, p_end);

        var _unpack = (0, _location.unpack)(rp[rp.length - 2]);

        var _unpack2 = _slicedToArray(_unpack, 2);

        var px = _unpack2[0];
        var py = _unpack2[1];

        return {
          distance: rp.length,
          direction: (0, _direction.dirpack)(px - start[0], py - start[1])
        };
      }

      var current = (0, _location.unpack)(p_current);
      open_set["delete"](p_current);
      closed_set.add(p_current);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = maze.get_neighbours(current[0], current[1])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var neighbour = _step2.value;

          var p_neighbour = (0, _location.pack2)(neighbour);

          if (closed_set.has(p_neighbour)) {
            continue;
          }
          var tentative_g_score = g_score[current] + 1;

          var not_evaluate = !open_set.has(p_neighbour);
          if (not_evaluate || tentative_g_score < g_score[p_neighbour]) {
            came_from[p_neighbour] = p_current;
            g_score[p_neighbour] = tentative_g_score;
            f_score[p_neighbour] = g_score[p_neighbour] + euclid(neighbour, end);
            open_set.add(p_neighbour);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }
});