import {unpack} from "location";
import {Restart} from "events";
import {tile_size_x, tile_size_y, state} from "ui-state";
import {
  context, images, game_width, sidebar_width, title_height,
  line_height, title_height, height, width, infobar_height
  } from "ui-shared";
import {get_key_help, ui_events} from "ui-event";
import {Button} from "ui-button";

const buttons = [];

function draw_entity(location, picture) {
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

function draw_error(text) {
  greyout();
  message(text);
}

function draw_result(text) {
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

export function draw_buttons() {
  for (let button of buttons) {
    button.draw();
  }
}

let last_time = window.performance.now();
let fps = 0;

function update_fps() {
  const this_time = window.performance.now();
  const diff = this_time - last_time;
  last_time = this_time;
  fps = 0.9 * fps + 100 / diff;
}

function status_bar() {
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

export function paint_game() {
  update_fps();

  if (state === null) {
    draw_error("Not ready");
  } else if (state.condition === "running") {
    draw_game_area();
    status_bar();
  } else if (state.condition === "won") {
    draw_result("You won!");
  } else if (state.condition === "lost") {
    draw_result("You lost!");
  }
}

export function draw_game_area() {
  const player_loc = state.player.location;

  // Clear
  context.fillStyle = 'white';
  context.fillRect(0, 0, game_width, height);

  for (let y = 0; y < state.maze.sizeY; y++) {
    for (let x = 0; x < state.maze.sizeX; x++) {
      if (!state.maze.get(x, y)) {
        context.drawImage(images.wall, x * tile_size_x, y * tile_size_y, tile_size_x, tile_size_y);
      }
    }
  }

  for (let exit of state.maze.exits) {
    draw_entity(unpack(exit), 'goal');
  }
  draw_entity(player_loc, 'player');
  for (let enemy of state.enemies) {
    draw_entity(enemy.location, 'enemy');
  }
}

export function draw_info_bar() {
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
