import {ChangeDirection, ActivateTurbo} from "events";
import {dx, dy} from "direction";

export class Entity {

  constructor(location, host) {
    this.speed = 8;
    this.location = location;
    this.host = host;

    this._real_speed = this.speed;
    this.turbo_time = 0;
    this.turbo_left = 1;
    this._movement_counter = 0;  // when 0, can move
    this._facing = null;  // direction facing
    this._queued_facing = null;
  }

  do_move() {
    this._movement_counter = Math.max(0, this._movement_counter - 1);
    if (this.turbo_time > 0) {
      this.turbo_time -= 1;
      if (this.turbo_time === 0) {
        this.speed = this._real_speed;
      }
    }
    if (this._movement_counter !== 0 || this._queued_facing === null) {
      return;
    }

    let new_location = [
      this.location[0] + dx(this._queued_facing),
      this.location[1] + dy(this._queued_facing)
    ];

    // Check if destination is passable. If so, do the move.
    // Then reset the movement counter.
    if (this.host.maze.get2(new_location)) {
      this.location = new_location;
      this._movement_counter = this.speed;
      this._facing = this._queued_facing;
    } else if (this._facing !== null) {
      new_location = [
        this.location[0] + dx(this._facing),
        this.location[1] + dy(this._facing)
      ];

      if (this.host.maze.get2(new_location)) {
        this.location = new_location;
        this._movement_counter = this.speed;
      }
    }
  }

  process_event(ev) {
    if (ev instanceof ChangeDirection) {
      this._queued_facing = ev.direction;
    } else if (ev instanceof ActivateTurbo) {
      // Turbo can only be used once.
      if (this.turbo_left > 0) {
        this.turbo_left -= 1;
        this._real_speed = this.speed;
        this.turbo_time = 100;
        this.speed = Math.ceil(this.speed / 2);
      }
    }
  }
}
