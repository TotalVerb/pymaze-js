define(["exports", "location", "direction"], function (exports, _location, _direction) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var MazeGrid = (function () {
    /** A grid representing a maze.
      Conform to the specification, version 6, at <http://goo.gl/dMRovy>.
    */

    function MazeGrid(x_size, y_size) {
      _classCallCheck(this, MazeGrid);

      this.sizeX = x_size;
      this.sizeY = y_size;
      this._maze_list = new Uint8Array(x_size * y_size);

      this.entrance = null;
      this.exits = new Set();
    }

    _createClass(MazeGrid, [{
      key: "is_coordinate",
      value: function is_coordinate(x, y) {
        /** Return true if the given coordinate is valid. */

        return x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY;
      }
    }, {
      key: "set_entrance",
      value: function set_entrance(x, y) {
        if (!this.get(x, y)) {
          // entrance only makes sense if passable
          throw new Error("Can't put entrance on impassible square.");
        }

        this.entrance = [x, y];
      }
    }, {
      key: "add_exit",
      value: function add_exit(x, y) {
        if (!this.get(x, y)) {
          // exit only makes sense if passable
          throw new Error("Can't put exit on impassible square.");
        }

        this.exits.add((0, _location.pack)(x, y));
      }
    }, {
      key: "set",
      value: function set(x, y, value) {
        /** Set a value.
          Warning: This method is highly optimized. Using x/y values that are
        not valid integers within the maze's coordinate bounds is undefined
        behaviour.
        */
        this._maze_list[x * this.sizeY + y] = value;
      }
    }, {
      key: "get",
      value: function get(x, y) {
        /** Get a value.
          Warning: This method is highly optimized. Using x/y values that are
        not valid integers within the maze's coordinate bounds is undefined
        behaviour.
        */
        return this._maze_list[x * this.sizeY + y];
      }
    }, {
      key: "get2",
      value: function get2(xy) {
        /** Get a value from an array [x, y].
          Warning: This method is highly optimized. Using x/y values that are
        not valid integers within the maze's coordinate bounds is undefined
        behaviour.
        */
        return this._maze_list[xy[0] * this.sizeY + xy[1]];
      }
    }, {
      key: "get_neighbours",
      value: regeneratorRuntime.mark(function get_neighbours(x, y) {
        return regeneratorRuntime.wrap(function get_neighbours$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              if (!(this.is_coordinate(x, y - 1) && this.get(x, y - 1))) {
                context$2$0.next = 3;
                break;
              }

              context$2$0.next = 3;
              return [x, y - 1];

            case 3:
              if (!(this.is_coordinate(x, y + 1) && this.get(x, y + 1))) {
                context$2$0.next = 6;
                break;
              }

              context$2$0.next = 6;
              return [x, y + 1];

            case 6:
              if (!(this.is_coordinate(x - 1, y) && this.get(x - 1, y))) {
                context$2$0.next = 9;
                break;
              }

              context$2$0.next = 9;
              return [x - 1, y];

            case 9:
              if (!(this.is_coordinate(x + 1, y) && this.get(x + 1, y))) {
                context$2$0.next = 12;
                break;
              }

              context$2$0.next = 12;
              return [x + 1, y];

            case 12:
            case "end":
              return context$2$0.stop();
          }
        }, get_neighbours, this);
      })
    }, {
      key: "get_neighbours2",
      value: regeneratorRuntime.mark(function get_neighbours2(loc) {
        return regeneratorRuntime.wrap(function get_neighbours2$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.delegateYield(this.get_neighbours(loc[0], loc[1]), "t0", 1);

            case 1:
            case "end":
              return context$2$0.stop();
          }
        }, get_neighbours2, this);
      })
    }, {
      key: "get_directions",
      value: regeneratorRuntime.mark(function get_directions(x, y) {
        return regeneratorRuntime.wrap(function get_directions$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              if (!(this.is_coordinate(x, y - 1) && this.get(x, y - 1))) {
                context$2$0.next = 3;
                break;
              }

              context$2$0.next = 3;
              return _direction.NORTH;

            case 3:
              if (!(this.is_coordinate(x, y + 1) && this.get(x, y + 1))) {
                context$2$0.next = 6;
                break;
              }

              context$2$0.next = 6;
              return _direction.SOUTH;

            case 6:
              if (!(this.is_coordinate(x - 1, y) && this.get(x - 1, y))) {
                context$2$0.next = 9;
                break;
              }

              context$2$0.next = 9;
              return _direction.WEST;

            case 9:
              if (!(this.is_coordinate(x + 1, y) && this.get(x + 1, y))) {
                context$2$0.next = 12;
                break;
              }

              context$2$0.next = 12;
              return _direction.EAST;

            case 12:
            case "end":
              return context$2$0.stop();
          }
        }, get_directions, this);
      })
    }, {
      key: "get_directions2",
      value: regeneratorRuntime.mark(function get_directions2(loc) {
        return regeneratorRuntime.wrap(function get_directions2$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.delegateYield(this.get_directions(loc[0], loc[1]), "t0", 1);

            case 1:
            case "end":
              return context$2$0.stop();
          }
        }, get_directions2, this);
      })
    }]);

    return MazeGrid;
  })();

  exports.MazeGrid = MazeGrid;
});