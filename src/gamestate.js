import { ship, gameboard, player } from "./objectConstructor";
import { renderGameboard} from "./render";

function gameStart(playername) {
  const player1 = new player(playername);
  const player2 = new player("CPU");
  player1.gameboard.generateShip();
  player2.gameboard.generateShip();
  renderGameboard(player1.gameboard.myBoard);
  renderGameboard(player2.gameboard.myBoard);
}

export { gameStart };
