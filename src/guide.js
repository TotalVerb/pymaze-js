/**
 * Generates the desired facing direction given certain rules.
 */

import {dx, dy} from "direction";
import {pack2} from "location";
import {astar} from "pathfind";

export class QueuedFacingGuide {
  /** When it is possible to move in this direction, move that way. */
  constructor(direction) {
    this.direction = direction;
  }

  guide(ent, maze) {
    // Check if destination is passable. If so, update the facing.
    if (maze.get(
      ent.location[0] + dx(this.direction),
      ent.location[1] + dy(this.direction)
      )) {
      ent.facing = this.direction;
    }
  }
}

export class DestinationGuide {
  /** Move closer to the destination. */
  constructor(destination) {
    this.destination = destination;
  }

  guide(ent, maze) {
    // Check if at destination. If so, stop.
    if (pack2(ent.location) === pack2(this.destination)) {
      ent.facing = null;
    } else if (maze.get2(this.destination)) {
      // Check if destination is passable. If so, update the facing.
      ent.facing = astar(maze, ent.location, this.destination).direction;
    }
  }
}
