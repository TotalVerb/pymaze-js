import {ChangeDirection, ActivateTurbo, GoToSquare} from "events";
import {dx, dy} from "direction";
import {DestinationGuide, QueuedFacingGuide} from "guide";

export class Entity {

  constructor(location, host) {
    this.speed = 8;
    this.location = location;
    this.host = host;

    this._real_speed = this.speed;
    this.turbo_time = 0;
    this.turbo_left = 1;
    this._movement_counter = 0;  // when 0, can move
    this.facing = null;  // direction facing
    this.guide = null;  // guide
  }

  do_move() {
    this._movement_counter = Math.max(0, this._movement_counter - 1);
    if (this.turbo_time > 0) {
      this.turbo_time -= 1;
      if (this.turbo_time === 0) {
        this.speed = this._real_speed;
      }
    }
    if (this._movement_counter !== 0) {
      return;
    }

    // Update facing using the movement guide.
    if (this.guide !== null) {
      this.guide.guide(this, this.host.maze);
    }

    // Check if destination is passable. If so, do the move.
    // Then reset the movement counter.
    if (this.facing !== null) {
      const new_location = [
        this.location[0] + dx(this.facing),
        this.location[1] + dy(this.facing)
      ];

      if (this.host.maze.get2(new_location)) {
        this.location = new_location;
        this._movement_counter = this.speed;
      }
    }
  }

  process_event(ev) {
    if (ev instanceof ChangeDirection) {
      this.guide = new QueuedFacingGuide(ev.direction);
    } else if (ev instanceof ActivateTurbo) {
      // Turbo can only be used once.
      if (this.turbo_left > 0) {
        this.turbo_left -= 1;
        this._real_speed = this.speed;
        this.turbo_time = 80;
        this.speed = Math.ceil(this.speed / 2);
      }
    } else if (ev instanceof GoToSquare) {
      this.guide = new DestinationGuide(ev.destination);
    }
  }
}
