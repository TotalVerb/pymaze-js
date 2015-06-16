define(["exports", "location", "events", "ui-state", "ui-shared", "ui-event", "ui-button"], function (exports, _location, _events, _uiState, _uiShared, _uiEvent, _uiButton) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.draw_buttons = draw_buttons;
  exports.paint_game = paint_game;
  exports.draw_game_area = draw_game_area;
  exports.draw_info_bar = draw_info_bar;

  const buttons = [];

  function draw_entity(location, picture) {
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

  function draw_error(text) {
    greyout();
    message(text);
  }

  function draw_result(text) {
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

  function draw_buttons() {
    for (var button of buttons) {
      button.draw();
    }
  }

  var last_time = window.performance.now();
  var fps = 0;

  function update_fps() {
    const this_time = window.performance.now();
    const diff = this_time - last_time;
    last_time = this_time;
    fps = 0.9 * fps + 100 / diff;
  }

  function status_bar() {
    // Clear
    _uiShared.context.fillStyle = "#FFFFFF";
    _uiShared.context.fillRect(_uiShared.game_width, _uiShared.infobar_height, _uiShared.sidebar_width, _uiShared.height - _uiShared.infobar_height);

    // Draw text
    const text = [[`${ _uiState.state.fps.toFixed(1) } FPS`, "#000000"], [`${ fps.toFixed(1) } GFPS`, "#000000"], [`Turbo left: ${ _uiState.state.player.turbo_left }`, "#0000FF"]];
    if (_uiState.state.player.turbo_time) {
      text.push(["TURBO ON", "#FF0000"]);
    }

    _uiShared.context.textBaseline = "top";
    _uiShared.context.textAlign = "right";
    _uiShared.context.font = "15px sans-serif";

    for (var i = 0; i < text.length; i++) {
      _uiShared.context.fillStyle = text[i][1];
      _uiShared.context.fillText(text[i][0], _uiShared.width - 5, i * _uiShared.line_height + _uiShared.infobar_height + 5);
    }
  }

  function paint_game() {
    update_fps();

    if (_uiState.state === null) {
      draw_error("Not ready");
    } else if (_uiState.state.condition === "running") {
      draw_game_area();
      status_bar();
    } else if (_uiState.state.condition === "won") {
      draw_result("You won!");
    } else if (_uiState.state.condition === "lost") {
      draw_result("You lost!");
    }
  }

  function draw_game_area() {
    const player_loc = _uiState.state.player.location;

    // Clear
    _uiShared.context.fillStyle = "white";
    _uiShared.context.fillRect(0, 0, _uiShared.game_width, _uiShared.height);

    for (var y = 0; y < _uiState.state.maze.sizeY; y++) {
      for (var x = 0; x < _uiState.state.maze.sizeX; x++) {
        if (!_uiState.state.maze.get(x, y)) {
          _uiShared.context.drawImage(_uiShared.images.wall, x * _uiState.tile_size_x, y * _uiState.tile_size_y, _uiState.tile_size_x, _uiState.tile_size_y);
        }
      }
    }

    for (var exit of _uiState.state.maze.exits) {
      draw_entity((0, _location.unpack)(exit), "goal");
    }
    draw_entity(player_loc, "player");
    for (var enemy of _uiState.state.enemies) {
      draw_entity(enemy.location, "enemy");
    }
  }

  function draw_info_bar() {
    // Draw background.
    _uiShared.context.fillStyle = "white";
    _uiShared.context.fillRect(_uiShared.game_width, 0, _uiShared.sidebar_width, _uiShared.height);

    // Draw title.
    _uiShared.context.font = "30px sans-serif";
    _uiShared.context.textAlign = "center";
    _uiShared.context.textBaseline = "top";
    _uiShared.context.fillStyle = "black";
    _uiShared.context.fillText("PYMAZE", _uiShared.game_width + _uiShared.sidebar_width / 2, 10);

    const instructions = ["Instructions"];
    const help = (0, _uiEvent.get_key_help)();
    for (var [k, v] of help) {
      instructions.push(`${ k }: ${ v }`);
    }

    _uiShared.context.font = "15px sans-serif";
    _uiShared.context.textAlign = "left";
    for (var i = 0; i < instructions.length; i++) {
      _uiShared.context.fillText(instructions[i], _uiShared.game_width + 5, (i + 1) * _uiShared.line_height + _uiShared.title_height);
    }
  }
});