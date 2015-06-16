/** A module containing server-side functionality.

This functionality is responsible for simulating the game and enforcing the
rules.
*/

import {GameState} from "gamestate";
import {Restart} from "events";
import * as ui from "ui";


export class GameServer {
  constructor() {
    // this.mazeGenerator = mazeGenerator
    // this.maze = this.mazeGenerator.generate()
    this.maze = null;
    this.state = null;
    this.load_maze();
  }

  load_maze() {
    this.state = new GameState();
    ui.changeState(this.state);
    this.maze = this.state.maze;
  }

  step() {
    const user_inputs = ui.poll();
    const ai_inputs = [];

    if (this.state.condition === "running") {
      for (let enemy of this.state.enemies) {
        let ev = enemy.move();
        if (ev !== undefined) {
          ai_inputs.push(ev);
        }
      }

      this.state.do_moves();
      this.state.check_endgame();

      ui.repaint();
    }

    for (let input of user_inputs) {
      this._handle_input(input);
    }
    for (let input of ai_inputs) {
      this._handle_input(input);
    }
  }

  restart() {
    this.load_maze();
  }

  _handle_input(input) {
    if (input instanceof Restart) {
      this.restart();
    } else if (input.entity) {
      // Event affects an entity.
      const entity = input.entity;
      entity.process_event(input);
    }
  }
}
