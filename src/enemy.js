import {ChangeDirection, GoToSquare} from "events";
import {Entity} from "entities";
import {reverse_direction} from "direction";
import * as pathfind from "pathfind";


export class Enemy extends Entity {
  constructor(location, host, version) {
    super(location, host);

    this.version = version;
    this.speed = 10;

    this._ai_delay = 20;
    this._current_tick = ~~(Math.random() * 20);  // each AI offset for speed
  }

  move() {
    this._current_tick += 1;
    if (this._current_tick >= this._ai_delay) {
      this._current_tick = 0;

      if (Math.random() > 0.9) {
        // 10% chance of changing versions.
        this.version = ~~(1 + 2 * Math.random());
      }

      if (this.version === 1) {
        return this.move1();
      } else if (this.version === 2) {
        return this.move2();
      } else if (this.version === 3) {
        return this.move3();
      }
    }
  }

  move1() {
    // move1 is almost random, but never reverses if possible.

    let directions = Array.from(this.host.maze.get_directions2(this.location));

    if (directions.length === 1) {
      return new ChangeDirection(this, directions[0]);
    } else if (this.facing !== null) {
      // Don't allow reversing.
      const rev = reverse_direction(this.facing);
      directions = directions.filter(dir => dir !== rev);
    }

    const direction = directions[~~(Math.random() * directions.length)];
    return new ChangeDirection(this, direction);
  }

  move2() {
    // move2 is the 'chaser' mode
    return new GoToSquare(this, this.host.player.location);
  }

  move3() {
    // Checks if distance is less than a specified number
    // (Can vary based on difficulty, default is 15)
    // If less than specified number than activates 'chaser' mode
    // If more than specified number than activates 'random' mode
    if (pathfind.euclid(this.location, this.host.player.location) < 15) {
      return this.move2();
    } else {
      return this.move1();
    }
  }

  right_image() {
    if (this.version === 1) {
      return "enemy-2";
    } else if (this.version === 2) {
      return "enemy-1";
    } else {
      return (
        pathfind.euclid(this.location, this.host.player.location) < 15
        ? "enemy-1" : "enemy-2"
      );
    }
  }
}
