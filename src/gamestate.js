import { ship, gameboard, player } from "./objectConstructor";
import { reRender, renderGameboard } from "./render";
import { RNGfunc } from "./objectConstructor";

let RNG1 = RNGfunc(10);
let RNG2 = RNGfunc(10);

let IsAttackSucceed = false;
const description = document.querySelector(".description");

const continueButton = () => {
  const input = document.querySelector("#name") || "player";
  const prompt = document.querySelector(".prompt");
  gameStart(input.value);
  prompt.style.display = "none";
};

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
  if (player.opponent.winCondition() === true) {
    player.isTurn = false;
    player.opponent.isTurn = false;
    const wait = await later(1000, "continue");
    description.textContent = player.opponent.name + " has no more ship";
    const wait2 = await later(1000, "continue");
    description.textContent = player.name + " Win!";
    const replay = document.querySelector("button.replay");
    replay.style.opacity = "100"
    return;
  } else {
    if (player.isTurn === true && player.opponent.isTurn === false) {
      player.isTurn = false;
      const wait = await later(1000, "continue");
      description.textContent = player.opponent.name + " turn!";
      player.opponent.isTurn = true;
    }
    if (player.opponent.name == "CPU") {
      description.textContent = "CPU turn!";
      const nextturn = CPUturn(player.opponent);
    }
  }
}

async function CPUturn(player) {
  if (IsAttackSucceed == true) {
    while (player.enemyboard.myBoard[RNG1][RNG2][0]) {
      switch (RNGfunc(4)) {
        case 0:
          if (RNG1 - 1 >= 0) {
            RNG1 = RNG1 - 1;
          }
          break;
        case 1:
          if (RNG2 + 1 < 10) {
            RNG2 = RNG2 + 1;
          }
          break;
        case 2:
          if (RNG1 + 1 < 10) {
            RNG1 = RNG1 + 1;
          }
          break;
        case 3:
          if (RNG2 - 1 >= 0) {
            RNG2 = RNG2 - 1;
          }
          break;
      }
    }
  } else {
    RNG1 = RNGfunc(10);
    RNG2 = RNGfunc(10);
  }

  switch (player.attackTarget(player.opponent, [RNG1, RNG2])) {
    case "hit":
      IsAttackSucceed = true;
      description.textContent = "hit!";

      break;
    case "miss":
      IsAttackSucceed = false;
      description.textContent = "miss...";
      break;
    case "SUNK!":
      IsAttackSucceed = false;
      description.textContent = "A SHIP HAS SUNK!";
      break;
    case "invalid":
      CPUturn(player);
      break;
  }
  reRender("default", player.opponent.gameboard);
  turnState(player);
}

function later(delay, value) {
  return new Promise((resolve) => setTimeout(resolve, delay, value));
}

function newd() {}

export { gameStart, turnState, continueButton, later };
