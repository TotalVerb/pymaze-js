import {Enemy} from "enemy";
import {Entity} from "entities";
import {depth_first_generate} from "mazemaker";
import {pack2} from "location";

export class GameState {
  constructor(maze=null, enemies=10) {
    if (maze === null) {
      maze = depth_first_generate(16, 16);
    }
    this.maze = maze;
    this.player = new Entity([1, 1], this);
    this.enemies = [];
    for (let i = 0; i < enemies; i++) {
      let location = [2 + ~~(Math.random() * (this.maze.sizeX - 2)),
                2 + ~~(Math.random() * (this.maze.sizeY - 2))];
      while (!this.maze.get(...location)) {
        location = [2 + ~~(Math.random() * (this.maze.sizeX - 2)),
                  2 + ~~(Math.random() * (this.maze.sizeY - 2))];
      }

      this.enemies.push(new Enemy(location, this, 1 + ~~(Math.random() * 3)));
    }
    this.condition = "running";
    this.fps = 0;
    this.last_time = window.performance.now();
  }

  * entities() {
    /** Yield all significant entities (players and enemies). */
    yield this.player;
    yield* this.enemies;
  }

  do_moves() {
    /** Move all entities in this state based off their facings. **/
    for (let ent of this.entities()) {
      ent.do_move();
    }

    const this_time = window.performance.now();
    this.fps = 0.9 * this.fps + 100 / (this_time - this.last_time);
    this.last_time = this_time;
  }

  check_endgame() {
    if (this.maze.exits.has(pack2(this.player.location))) {
      this.condition = "won";
    }
    for (let enemy of this.enemies) {
      if (pack2(enemy.location) === pack2(this.player.location)) {
        this.condition = "lost";
      }
    }
  }
}
