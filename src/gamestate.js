import { ship, gameboard, player } from "./objectConstructor";
import { reRender, renderGameboard } from "./render";

function continueButton() {
  const input = document.querySelector("#name") || "player";
  const prompt = document.querySelector(".prompt");
  gameStart(input.value);
  prompt.style.display = "none";
}

async function gameStart(playername) {
  const player1 = new player(playername);
  const player2 = new player("CPU");
  player1.gameboard.generateShip();
  player2.gameboard.generateShip();
  player1.opponent = player2;
  player2.opponent = player1;
  renderGameboard(player1);
  player1.isTurn = true;
}

async function turnState(player) {
  if (player.winCondition() === true) {
    player.isTurn = false;
    player.opponent.isTurn = false;
    console.log(player.name + " has no more ship");
    return console.log(player.opponent.name + " win!");
  }
  if (player.isTurn === true && player.opponent.isTurn === false) {
    console.log("opponent turn");
    player.isTurn = false;
    player.opponent.isTurn = true;
  } else if (player.isTurn === false && player.opponent.isTurn === true) {
    console.log("your turn");
    player.isTurn = true;
    player.opponent.isTurn = false;
  }

  if (player.opponent.name == "CPU") {
    CPUturn(player.opponent);
  }
}

async function CPUturn(player) {
  console.log("CPU attack");
  const move = await later(500, "continue");
  player.randomAttack(player.opponent);
  turnState(player);
  reRender("default", player.opponent.gameboard);
}

function later(delay, value) {
  return new Promise((resolve) => setTimeout(resolve, delay, value));
}

export { gameStart, turnState, continueButton, later };
