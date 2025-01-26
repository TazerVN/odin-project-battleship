import { ship } from "./objectConstructor";
import { gameboard } from "./objectConstructor";
import { turnState } from "./gamestate";
import { funrack } from ".";
import { mouseDown, resetXY, mouseUp } from "./dragNdrop";
import { player } from "./objectConstructor";

const gameboardNode = document.querySelector("div.game-container");

async function renderGameboard(player) {
  if (gameboardNode.hasChildNodes()) {
    while (gameboardNode.hasChildNodes()) {
      gameboardNode.removeChild(gameboardNode.lastChild);
    }
  }
  await renderEmptyBoard(player);
  await renderSelection(player.gameboard.listOfShips);

  // await renderDefaultBoard(player);
  // await renderEnemyBoard(player)
  gameboardNode.style.opacity = "100";
}

async function renderDefaultBoard(player) {
  const gridcontainer = document.createElement("div");
  gridcontainer.classList.add("grid-container");
  gridcontainer.setAttribute("id", "my-board");
  gridcontainer.style.left = "20%";
  gridcontainer.style.top = "30%";
  funrack(gridcontainer, gameboardNode);
  gridcontainer.addEventListener("mousedown", (e) =>
    mouseDown(e, gridcontainer)
  );
  resetXY();

  player.gameboard.myBoard.forEach((row, rowid) => {
    row.forEach((box, boxid) => {
      const button = document.createElement("button");
      button.classList.add("grid-button");
      button.id = "default" + rowid.toString() + boxid.toString();
      colorIndicator(box[0], button);

      if (box instanceof ship) {
        button.classList.add("grid-button-ship");
        gridcontainer.appendChild(button);
      }
      gridcontainer.appendChild(button);
    });
  });
  gameboardNode.appendChild(gridcontainer);
}

function replacableBlock(el) {
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.classList.add("grid-button-ship");
  });
  

  el.addEventListener("dragleave", dragleave);

  function dragleave() {
    el.classList.remove("grid-button-ship");
  }
}

async function renderEmptyBoard(player) {
  const gridcontainer = document.createElement("div");
  gridcontainer.classList.add("grid-container");
  gridcontainer.setAttribute("id", "my-board");
  gridcontainer.style.left = "20%";
  gridcontainer.style.top = "30%";
  funrack(gridcontainer, gameboardNode);

  gridcontainer.addEventListener("mousedown", (e) =>
    mouseDown(e, gridcontainer)
  );

  for (let i = 0; i < 10; i++) {
    for (let n = 0; n < 10; n++) {
      const button = document.createElement("button");
      button.classList.add("grid-button");
      button.id = "empty" + i.toString() + n.toString();
      gridcontainer.appendChild(button);
      button.addEventListener("drop", (e) => {
        button.classList.remove("grid-button-ship");
        onDrop(e, i, n);
      });
      replacableBlock(button);
    }
    gameboardNode.appendChild(gridcontainer);
  }
}

function onDrop(e, i, n) {
  //i and n is the index of the current block that activate the function
  e.preventDefault();
  const replacements = document.querySelectorAll(".selected");
  console.log(replacements.length)
  if((i - 1) + replacements.length >= 10 || (n - 1) + replacements.length >= 10 ){
    return "not valid"
  }
  replacements.forEach((selectedEl, selectedElindex) => {
    selectedEl.classList.remove("selected");
    selectedEl.classList.remove("drag");
    //replace the current block with replacements
    AdjustableShipOnEmptyBoard(selectedEl, selectedElindex, i, n);

    //reset the replacements with normal, replaceable block
    selectedEl.setAttribute("class", "grid-button");

    let blockid = selectedEl.id;
    let arrayID = blockid.split("");
    if (arrayID.includes("e") && arrayID.includes("m")) {
      replacableBlock(selectedEl);
      selectedEl.addEventListener("drop", (t) => {
        console.log(arrayID[arrayID.length - 2], arrayID[arrayID.length - 1]);
        onDrop(
          t,
          Number(arrayID[arrayID.length - 2]),
          Number(arrayID[arrayID.length - 1])
        );
      });
    }
  });
}

function AdjustableShipOnEmptyBoard(ship, shipindex, i, n) {
  let shipName = ship.className;
  let nameArray = shipName.split(" ");
  const currentButton = document.querySelector(
    "#empty" + i.toString() + (n + shipindex).toString()
  );
  console.log(currentButton);

  const newButton = currentButton.cloneNode(true);
  currentButton.replaceWith(newButton);

  newButton.setAttribute("class", shipName);

  newButton.addEventListener("focusin", (e) => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element) => {
      element.classList.add("selected");
    });
    newButton.draggable = true;
  });

  newButton.addEventListener("focusout", () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    console.log(ships);
    ships.forEach((element) => {
      element.classList.remove("selected");
    });
    newButton.draggable = false;
  });

  newButton.addEventListener("dragend", () => {
    newButton.classList.remove("drag");
  });
  newButton.addEventListener("dragstart", () => {
    newButton.classList.add("drag");
  });

  newButton.addEventListener("mousemove", mouseUp);
}

async function renderSelection(shipList) {
  const gridcontainer = document.createElement("div");
  gridcontainer.classList.add("grid-container");
  gridcontainer.classList.add("ship-container");
  gridcontainer.setAttribute("id", "my-board");
  gridcontainer.style.right = "20%";
  gridcontainer.style.top = "30%";
  funrack(gridcontainer, gameboardNode);

  gridcontainer.addEventListener("mousedown", (e) =>
    mouseDown(e, gridcontainer)
  );

  shipList.forEach((ship) => {
    gridcontainer.appendChild(dragAbleShip(ship));
  });

  gameboardNode.appendChild(gridcontainer);
}

function dragAbleShip(ship) {
  const shipContainer = document.createElement("div");
  const shipElement = document.createElement("div");
  shipElement.classList.add("ship-container-selection");
  for (let i = 0; i < ship.length; i++) {
    const button = document.createElement("button");
    button.classList.add("grid-button");
    button.classList.add("grid-button-ship");
    button.classList.add(ship.name);
    button.setAttribute("id", "selection" + i);
    shipElement.draggable = true;
    button.addEventListener("mousemove", mouseUp);

    shipElement.addEventListener("focusin", () => {
      button.classList.add("selected");
    });

    shipElement.addEventListener("focusout", () => {
      button.classList.remove("selected");
    });

    shipElement.addEventListener("dragend", () => {
      shipElement.classList.remove("drag");
    });
    shipElement.addEventListener("dragstart", () => {
      shipElement.classList.add("drag");
    });
    shipElement.appendChild(button);
    shipContainer.appendChild(shipElement);
  }
  return shipContainer;
}

async function renderEnemyBoard(player) {
  console.log(player.enemyboard);
  const gridcontainer = document.createElement("div");
  gridcontainer.style.right = "20%";
  gridcontainer.style.top = "30%";
  gridcontainer.classList.add("grid-container");
  gridcontainer.setAttribute("id", "enemy-board");
  funrack(gridcontainer, gameboardNode);
  gridcontainer.addEventListener("mousedown", (e) =>
    mouseDown(e, gridcontainer)
  );
  resetXY();

  player.enemyboard.myBoard.forEach((row, rowid) => {
    row.forEach((box, boxid) => {
      const button = document.createElement("button");
      button.classList.add("grid-button");
      button.id = "enemy" + rowid.toString() + boxid.toString();
      colorIndicator(box[0], button);

      const cord = [rowid, boxid];

      button.addEventListener("click", () => {
        if (player.isTurn === true) {
          switch (player.attackTarget(player.opponent, cord)) {
            case "hit":
              button.textContent = "O";
              button.style.backgroundColor = "var(--hit-color)";
              break;
            case "miss":
              button.textContent = "X";
              button.style.backgroundColor = "var(--miss-color)";
              break;
            case "SUNK!":
              button.textContent = "!";
              button.style.backgroundColor = "var(--hit-color)";
              break;
          }
          reRender("enemy", player.enemyboard);
          turnState(player);
        }
      });
      gridcontainer.appendChild(button);
    });
  });
  gameboardNode.appendChild(gridcontainer);
}

function colorIndicator(indicator, element) {
  switch (indicator) {
    case "O":
      element.textContent = "O";
      element.style.backgroundColor = "var(--hit-color)";
      break;
    case "X":
      element.textContent = "X";
      element.style.backgroundColor = "var(--miss-color)";
      break;
    case "!":
      element.textContent = "!";
      element.style.backgroundColor = "var(--hit-color)";
      break;
  }
}

function reRender(boardString, gameboard) {
  gameboard.myBoard.forEach((row, rowid) => {
    row.forEach((box, boxid) => {
      const button = document.querySelector(
        ("#" + boardString + rowid.toString() + boxid.toString()).toString()
      );
      colorIndicator(box, button);
    });
  });
}

export { renderGameboard, reRender };
