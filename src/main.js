import {GameServer} from "server";
import * as ui from "ui";

const game = new GameServer();

ui.start();
setInterval(game.step.bind(game), 1000 / 40);
