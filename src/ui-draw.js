import {unpack} from "location";
import {Restart} from "events";
import {tile_size_x, tile_size_y, state} from "ui-state";
import {context, images, height, width} from "ui-shared";
import {get_key_help, ui_events} from "ui-event";
import {Button} from "ui-button";
import {fps} from "ui-perf";

const sidebar_width = 200;
const infobar_height = 350;
export const game_width = width - sidebar_width;
const line_height = 30;
const title_height = 90;

const buttons = [];

function paintImage(location, picture) {
  context.drawImage(
    images[picture],
    location[0] * tile_size_x,
    location[1] * tile_size_y,
    tile_size_x,
    tile_size_y
  );
}

function greyout() {
  context.fillStyle = "rgba(200, 200, 200, 0.8)";
  context.fillRect(0, 0, width, height);
}

function message(text, vh=height / 2) {
  context.fillStyle = "#202020";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "80px sans-serif";
  context.fillText(text, width / 2, vh);
}

function error(text) {
  greyout();
  message(text);
}

function result(text) {
  greyout();
  message(text, height / 2 - 100);

  if (buttons.length === 0) {
    buttons.push(
      new Button('Restart', width / 2 - 100, height / 2 - 30, 200, 60, function() {
        ui_events.push(new Restart());
        buttons.pop();
      })
    );
    buttons[0].activate();
  }
}

export function paintButtons() {
  for (let button of buttons) {
    button.draw();
  }
}

function paintStatusBar() {
  // Clear
  context.fillStyle = '#FFFFFF';
  context.fillRect(
    game_width, infobar_height, sidebar_width, height - infobar_height);

  // Draw text
  const text = [
    [`${state.fps.toFixed(1)} FPS`, '#000000'],
    [`${fps.toFixed(1)} GFPS`, '#000000'],
    [`Turbo left: ${state.player.turbo_left}`, '#0000FF']
  ];
  if (state.player.turbo_time) {
    text.push(["TURBO ON", '#FF0000']);
  }

  context.textBaseline = 'top';
  context.textAlign = 'right';
  context.font = "15px sans-serif";

  for (let i = 0; i < text.length; i++) {
    context.fillStyle = text[i][1];
    context.fillText(text[i][0], width - 5, i * line_height + infobar_height + 5);
  }
}

function paintGameArea() {
  const player_loc = state.player.location;

  // Clear
  context.fillStyle = 'white';
  context.fillRect(0, 0, game_width, height);

  for (let y = 0; y < state.maze.sizeY; y++) {
    for (let x = 0; x < state.maze.sizeX; x++) {
      if (!state.maze.get(x, y)) {
        paintImage([x, y], 'wall');
      }
    }
  }

  for (let exit of state.maze.exits) {
    paintImage(unpack(exit), 'goal');
  }
  paintImage(player_loc, 'player');
  for (let enemy of state.enemies) {
    paintImage(enemy.location, 'enemy');
  }
}

export function paintGame() {
  if (state === null) {
    error("Not ready");
  } else if (state.condition === "running") {
    paintGameArea();
    paintStatusBar();
  } else if (state.condition === "won") {
    result("You won!");
  } else if (state.condition === "lost") {
    result("You lost!");
  }
}

export function paintInfoBar() {
  // Draw background.
  context.fillStyle = "white";
  context.fillRect(game_width, 0, sidebar_width, height);

  // Draw title.
  context.font = "30px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "black";
  context.fillText("PYMAZE", game_width + sidebar_width / 2, 10);

  const instructions = ["Instructions"];
  const help = get_key_help();
  for (let [k, v] of help) {
    instructions.push(`${k}: ${v}`);
  }

  context.font = "15px sans-serif";
  context.textAlign = "left";
  for (let i = 0; i < instructions.length; i++) {
    context.fillText(
      instructions[i],
      game_width + 5,
      (i + 1) * line_height + title_height
    );
  }
}
