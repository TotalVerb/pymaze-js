define(["exports", "server", "ui"], function (exports, _server, _ui) {
  "use strict";

  var game = new _server.GameServer();

  _ui.start();
  setInterval(game.step.bind(game), 1000 / 40);
});