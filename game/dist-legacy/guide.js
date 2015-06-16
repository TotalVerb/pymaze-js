define(["exports", "direction", "location", "pathfind"], function (exports, _direction, _location, _pathfind) {
  /**
   * Generates the desired facing direction given certain rules.
   */

  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var QueuedFacingGuide = (function () {
    /** When it is possible to move in this direction, move that way. */

    function QueuedFacingGuide(direction) {
      _classCallCheck(this, QueuedFacingGuide);

      this.direction = direction;
    }

    _createClass(QueuedFacingGuide, [{
      key: "guide",
      value: function guide(ent, maze) {
        // Check if destination is passable. If so, update the facing.
        if (maze.get(ent.location[0] + (0, _direction.dx)(this.direction), ent.location[1] + (0, _direction.dy)(this.direction))) {
          ent.facing = this.direction;
        }
      }
    }]);

    return QueuedFacingGuide;
  })();

  exports.QueuedFacingGuide = QueuedFacingGuide;

  var DestinationGuide = (function () {
    /** Move closer to the destination. */

    function DestinationGuide(destination) {
      _classCallCheck(this, DestinationGuide);

      this.destination = destination;
    }

    _createClass(DestinationGuide, [{
      key: "guide",
      value: function guide(ent, maze) {
        // Check if at destination. If so, stop.
        if ((0, _location.pack2)(ent.location) === (0, _location.pack2)(this.destination)) {
          ent.facing = null;
        } else if (maze.get2(this.destination)) {
          // Check if destination is passable. If so, update the facing.
          ent.facing = (0, _pathfind.astar)(maze, ent.location, this.destination).direction;
        }
      }
    }]);

    return DestinationGuide;
  })();

  exports.DestinationGuide = DestinationGuide;
});