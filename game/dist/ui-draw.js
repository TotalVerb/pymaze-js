define(["exports", "location", "direction", "events", "ui-state", "ui-shared", "ui-event", "ui-button", "ui-perf"], function (exports, _location, _direction, _events, _uiState, _uiShared, _uiEvent, _uiButton, _uiPerf) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.paintButtons = paintButtons;
  exports.paintGame = paintGame;
  exports.paintInfoBar = paintInfoBar;

  const sidebar_width = 200;
  const infobar_height = 350;
  const game_width = _uiShared.width - sidebar_width;
  exports.game_width = game_width;
  const line_height = 30;
  const title_height = 90;

  const buttons = [];

  function paintImage(location, picture) {
    _uiShared.context.drawImage(_uiShared.images[picture], location[0] * _uiState.tile_size_x, location[1] * _uiState.tile_size_y, _uiState.tile_size_x, _uiState.tile_size_y);
  }

  function greyout() {
    _uiShared.context.fillStyle = "rgba(200, 200, 200, 0.8)";
    _uiShared.context.fillRect(0, 0, _uiShared.width, _uiShared.height);
  }

  function message(text, vh = _uiShared.height / 2) {
    _uiShared.context.fillStyle = "#202020";
    _uiShared.context.textAlign = "center";
    _uiShared.context.textBaseline = "middle";
    _uiShared.context.font = "80px sans-serif";
    _uiShared.context.fillText(text, _uiShared.width / 2, vh);
  }

  function error(text) {
    greyout();
    message(text);
  }

  function result(text) {
    greyout();
    message(text, _uiShared.height / 2 - 100);

    if (buttons.length === 0) {
      buttons.push(new _uiButton.Button("Restart", _uiShared.width / 2 - 100, _uiShared.height / 2 - 30, 200, 60, function () {
        _uiEvent.ui_events.push(new _events.Restart());
        buttons.pop();
      }));
      buttons[0].activate();
    }
  }

  function paintButtons() {
    for (var button of buttons) {
      button.draw();
    }
  }

  function paintStatusBar() {
    // Clear
    _uiShared.context.fillStyle = "#FFFFFF";
    _uiShared.context.fillRect(game_width, infobar_height, sidebar_width, _uiShared.height - infobar_height);

    // Draw text
    const text = [[`${ _uiState.state.fps.toFixed(1) } FPS`, "#000000"], [`${ _uiPerf.fps.toFixed(1) } GFPS`, "#000000"], [`Turbo left: ${ _uiState.state.player.turbo_left }`, "#0000FF"]];
    if (_uiState.state.player.turbo_time) {
      text.push(["TURBO ON", "#FF0000"]);
    }

    _uiShared.context.textBaseline = "top";
    _uiShared.context.textAlign = "right";
    _uiShared.context.font = "15px sans-serif";

    for (var i = 0; i < text.length; i++) {
      _uiShared.context.fillStyle = text[i][1];
      _uiShared.context.fillText(text[i][0], _uiShared.width - 5, i * line_height + infobar_height + 5);
    }
  }

  function semi_location(entity) {
    var partial = entity.movement_counter / entity.speed;
    if (_uiState.state.condition !== "running") {
      partial = 0;
    }
    var undo_x = -(0, _direction.dx)(entity.facing) * partial;
    var undo_y = -(0, _direction.dy)(entity.facing) * partial;
    return [entity.location[0] + undo_x, entity.location[1] + undo_y];
  }

  function paintGameArea() {
    // Clear
    _uiShared.context.fillStyle = "white";
    _uiShared.context.fillRect(0, 0, game_width, _uiShared.height);

    for (var y = 0; y < _uiState.state.maze.sizeY; y++) {
      for (var x = 0; x < _uiState.state.maze.sizeX; x++) {
        if (!_uiState.state.maze.get(x, y)) {
          paintImage([x, y], "wall");
        }
      }
    }

    for (var exit of _uiState.state.maze.exits) {
      paintImage((0, _location.unpack)(exit), "goal");
    }
    paintImage(semi_location(_uiState.state.player), "player");
    for (var enemy of _uiState.state.enemies) {
      paintImage(semi_location(enemy), enemy.right_image());
    }
  }

  function paintGame() {
    if (_uiState.state === null) {
      error("Not ready");
    } else if (_uiState.state.condition === "running") {
      paintGameArea();
      paintStatusBar();
    } else if (_uiState.state.condition === "won") {
      paintGameArea();
      result("You won!");
    } else if (_uiState.state.condition === "lost") {
      paintGameArea();
      result("You lost!");
    }
  }

  function paintInfoBar() {
    // Draw background.
    _uiShared.context.fillStyle = "white";
    _uiShared.context.fillRect(game_width, 0, sidebar_width, _uiShared.height);

    // Draw title.
    _uiShared.context.font = "30px sans-serif";
    _uiShared.context.textAlign = "center";
    _uiShared.context.textBaseline = "top";
    _uiShared.context.fillStyle = "black";
    _uiShared.context.fillText("PYMAZE", game_width + sidebar_width / 2, 10);

    const instructions = ["Instructions"];
    const help = (0, _uiEvent.get_key_help)();
    for (var [k, v] of help) {
      if (v.length + k.length < 20) {
        instructions.push(`${ k }: ${ v }`);
      } else {
        instructions.push(k + ":");
        instructions.push("  " + v);
      }
    }

    _uiShared.context.font = "15px sans-serif";
    _uiShared.context.textAlign = "left";
    for (var i = 0; i < instructions.length; i++) {
      _uiShared.context.fillText(instructions[i], game_width + 5, (i + 1) * line_height + title_height);
    }
  }
});