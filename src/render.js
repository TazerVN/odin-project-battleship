import { ship } from "./objectConstructor";
import { gameboard } from "./objectConstructor";
import { turnState } from "./gamestate";
import { funrack } from ".";
import { mouseDown, resetXY, mouseUp } from "./dragNdrop";
import { player } from "./objectConstructor";
import rotateimg from "./rotate.svg";
import { later } from "./gamestate";

const main = document.querySelector(".main");
const gameboardNode = document.querySelector("div.game-container");
const header = document.querySelector(".header");
const description = document.querySelector(".description");

async function renderGameboard(player) {
  if (gameboardNode.hasChildNodes()) {
    while (gameboardNode.hasChildNodes()) {
      gameboardNode.removeChild(gameboardNode.lastChild);
    }
  }
  const resetButton = document.createElement("button");
  resetButton.textContent = "RESET";
  resetButton.classList.add("activate");
  resetButton.classList.add("reset");
  resetButton.addEventListener("click", () => {
    resetLayout(player);
  });

  header.appendChild(resetButton);
  await renderEmptyBoard(player);
  await renderSelection(player.gameboard.listOfShips);

  addStartButton(player);

  resetButton.style.opacity = "100";
  gameboardNode.style.opacity = "100";
}

async function battleshipGameplay(player) {
  const allButton = document.querySelectorAll(".activate");
  for (let i = 0; i < allButton.length; i++) {
    allButton[i].style.opacity = 0;
    gameboardNode.childNodes[i].style.opacity = 0;
  }
  gameboardNode.style.opacity = "0";
  header.style.opacity = "0";
  const wait = await later(2000, "continue");
  gameboardNode.style.opacity = "100";
  header.style.opacity = "100";
  for (let i = 0; i < allButton.length; i++) {
    header.removeChild(allButton[i]);
    gameboardNode.removeChild(gameboardNode.firstChild);
  }

  const opponent = player.opponent;
  opponent.gameboard.randomShipPlacement(opponent.gameboard.listOfShips);

  await renderDefaultBoard(player);
  await renderEnemyBoard(player);
  description.textContent = "Choose a box on the enemy board to attack!";
  replayButton();
}

async function resetLayout(player) {
  if (gameboardNode.hasChildNodes()) {
    while (gameboardNode.hasChildNodes()) {
      gameboardNode.removeChild(gameboardNode.firstChild);
    }
  }
  await renderEmptyBoard(player);
  await renderSelection(player.gameboard.listOfShips);
  const startButton = document.querySelector("button.start");
  if (startButton.style.display !== "none") {
    startButton.style.display = "none";
  }
}

async function renderDefaultBoard(player) {
  const gridcontainer = document.createElement("div");
  gridcontainer.classList.add("grid-container");
  gridcontainer.setAttribute("id", "my-board");
  gridcontainer.style.left = "10%";
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
  gridcontainer.style.left = "10%";
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
  let isValid = true;
  const replacements = document.querySelectorAll(".selected");
  replacements.forEach((selectedEl, selectedElindex) => {
    selectedEl.classList.remove("selected");
    selectedEl.classList.remove("drag");
  });
  //chheck if there is there is already a ship or out of bound
  for (let elIndex = 0; elIndex < replacements.length; elIndex++) {
    const el = replacements[elIndex];
    const classArray = el.className.split(" ");
    if (el.classList.contains("horizontal")) {
      const currentn = n + elIndex;
      const checkbutton = document.querySelector(
        "#empty" + i.toString() + currentn.toString()
      );
      if (
        !checkbutton ||
        n - 1 + replacements.length >= 10 ||
        (!checkbutton.classList.contains(classArray[2]) &&
          checkbutton.classList.contains("horizontal")) ||
        (!checkbutton.classList.contains(classArray[2]) &&
          checkbutton.classList.contains("vertical"))
      ) {
        isValid = false;
        break;
      }
    }
    if (el.classList.contains("vertical")) {
      const currenti = i + elIndex;
      const checkbutton = document.querySelector(
        "#empty" + currenti.toString() + n.toString()
      );
      if (
        !checkbutton ||
        i - 1 + replacements.length >= 10 ||
        (!checkbutton.classList.contains(classArray[2]) &&
          checkbutton.classList.contains("horizontal")) ||
        (!checkbutton.classList.contains(classArray[2]) &&
          checkbutton.classList.contains("vertical"))
      ) {
        isValid = false;
        break;
      }
    }
  }

  if (isValid) {
    replacements.forEach((selectedEl, selectedElindex) => {
      selectedEl.classList.remove("selected");
      selectedEl.classList.remove("drag");
      //replace the current block with replacements
      AdjustableShipOnEmptyBoard(selectedEl, selectedElindex, i, n);

      //reset the replacements with normal, replaceable block
      selectedEl.setAttribute("class", "grid-button");
      selectedEl.draggable = false;

      let blockid = selectedEl.id;
      let arrayID = blockid.split("");
      if (arrayID.includes("e") && arrayID.includes("m")) {
        replacableBlock(selectedEl);
        // if (selectedEl.hasChildNodes()) {
        //   selectedEl.removeChild(selectedEl.firstChild);
        // }
        selectedEl.addEventListener("drop", (t) => {
          onDrop(
            t,
            Number(arrayID[arrayID.length - 2]),
            Number(arrayID[arrayID.length - 1])
          );
        });
      }
    });
  }
  const result = checkSelectionBoard();
  if (result == true) {
    const startButton = document.querySelector(".start");
    startButton.style.display = "block";
    startButton.style.opacity = "100";
  }
}
//render the ship
function AdjustableShipOnEmptyBoard(ship, shipindex, i, n, length) {
  let shipName = ship.className;
  let nameArray = shipName.split(" ");
  let currentButton;
  const rotateButton = document.querySelector("img.rotate" + nameArray[2]);

  if (nameArray[3] == "horizontal") {
    currentButton = document.querySelector(
      "#empty" + i.toString() + (n + shipindex).toString()
    );
  } else {
    currentButton = document.querySelector(
      "#empty" + (i + shipindex).toString() + n.toString()
    );
  }
  const newButton = currentButton.cloneNode(true);
  currentButton.replaceWith(newButton);
  newButton.setAttribute("class", shipName);

  const hover = () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element, shipindex) => {
      element.classList.add("hover");
    });
  };
  const removehover = () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element, shipindex) => {
      element.classList.remove("hover");
    });
  };

  if (shipindex == 0) {
    const rotateButtonShip = document.querySelector(
      "img.rotate" + nameArray[2]
    );
    if (rotateButton) {
      // rotateButton.style.opacity = 0;
      rotateButtonShip.remove();
      rotateButton.remove();
    }
    const rotate = document.createElement("img");
    rotate.src = rotateimg;
    rotate.alt = "rotate";
    rotate.classList.add("rotate" + nameArray[2]);
    rotate.style.position = "relative";
    rotate.style.opacity = 100;

    newButton.appendChild(rotate);
    triggerRotate(rotate, i, n, nameArray[2]);
  }

  newButton.addEventListener("mouseenter", hover);
  newButton.addEventListener("mouseleave", removehover);

  newButton.addEventListener("focusin", (e) => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element) => {
      element.draggable = true;
    });
    newButton.removeEventListener("mouseleave", removehover);
  });

  newButton.addEventListener("focusout", () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element) => {
      element.classList.remove("selected");
      element.draggable = false;
    });
    newButton.addEventListener("mouseleave", removehover);
  });

  newButton.addEventListener("dragend", () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element) => {
      element.draggable = true;
      element.classList.remove("selected");
    });
  });
  newButton.addEventListener("dragstart", () => {
    const ships = document.querySelectorAll("." + nameArray[2]);
    ships.forEach((element) => {
      element.draggable = true;
      element.classList.add("selected");
    });
  });

  newButton.addEventListener("mousemove", mouseUp);
}

function triggerRotate(el, i, n, name) {
  el.addEventListener("click", (e) => {
    const ships = document.querySelectorAll("." + name);
    //check if ships has space to rotate
    for (let shipindex = 0; shipindex < ships.length; shipindex++) {
      const element = ships[shipindex];
      if (element.classList.contains("horizontal")) {
        if (i - 1 + ships.length >= 10) {
          return "not valid";
        }
      }
      if (element.classList.contains("vertical")) {
        if (n - 1 + ships.length >= 10) {
          return "not valid";
        }
      }
      element.classList.remove("hover");
      switch (element.classList.contains("horizontal")) {
        case true:
          element.classList.remove("horizontal");
          element.classList.add("vertical");
          element.classList.add("selected");

          break;

        case false:
          element.classList.remove("vertical");
          element.classList.add("horizontal");
          element.classList.add("selected");

          break;
      }
    }
    onDrop(e, i, n);
  });
}

async function renderSelection(shipList) {
  const gridcontainer = document.createElement("div");
  gridcontainer.classList.add("grid-container");
  gridcontainer.classList.add("ship-container");
  gridcontainer.setAttribute("id", "my-board");
  gridcontainer.style.right = "10%";
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

  const rotate = document.createElement("img");
  rotate.src = rotateimg;
  rotate.alt = "rotate";
  rotate.style.position = "relative";
  shipContainer.appendChild(rotate);

  for (let i = 0; i < ship.length; i++) {
    const button = document.createElement("button");
    button.classList.add("grid-button");
    button.classList.add("grid-button-ship");
    button.classList.add(ship.name);
    rotate.classList.add("rotate" + ship.name);
    button.classList.add("horizontal");
    button.setAttribute("id", "selection" + i);
    shipElement.draggable = true;
    button.addEventListener("mousemove", mouseUp);

    rotate.addEventListener("click", (e) => {
      switch (button.classList.contains("horizontal")) {
        case true:
          shipElement.style.flexDirection = "column";
          shipContainer.style.flexDirection = "row";
          button.classList.remove("horizontal");
          button.classList.add("vertical");

          break;
        case false:
          shipElement.style.flexDirection = "row";
          shipContainer.style.flexDirection = "column";
          button.classList.remove("vertical");
          button.classList.add("horizontal");
          break;
      }
    });

    shipContainer.addEventListener("mouseenter", () => {
      rotate.style.opacity = 100;
    });

    shipContainer.addEventListener("mouseleave", () => {
      rotate.style.opacity = 0;
    });

    shipElement.addEventListener("focusin", () => {
      button.classList.add("hover");
    });

    shipElement.addEventListener("focusout", () => {
      button.classList.remove("hover");
    });

    shipElement.addEventListener("dragend", () => {
      shipElement.classList.remove("drag");
      button.classList.remove("selected");
    });
    shipElement.addEventListener("dragstart", () => {
      shipElement.classList.add("drag");
      button.classList.add("selected");
    });
    shipElement.appendChild(button);
    shipContainer.appendChild(shipElement);
  }

  return shipContainer;
}

async function renderEnemyBoard(player) {
  const gridcontainer = document.createElement("div");
  gridcontainer.style.right = "10%";
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

      const attackonBox = async () => {
        if (player.isTurn === true) {
          switch (player.attackTarget(player.opponent, cord)) {
            case "hit":
              description.textContent = "HIT!";
              button.textContent = "O";
              button.style.backgroundColor = "var(--hit-color)";
              button.removeEventListener("click", attackonBox);
              break;
            case "miss":
              description.textContent = "miss...";
              button.textContent = "X";
              button.style.backgroundColor = "var(--miss-color)";
              button.removeEventListener("click", attackonBox);
              break;
            case "SUNK!":
              description.textContent = "A SHIP HAS SUNK!";
              button.textContent = "!";
              button.style.backgroundColor = "var(--hit-color)";
              button.removeEventListener("click", attackonBox);
              break;
          }

          reRender("enemy", player.enemyboard);
          turnState(player);
        }
      };
      button.addEventListener("click", attackonBox);
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

function addStartButton(player) {
  if (document.querySelector(".start")) {
    return;
  }
  const button = document.createElement("button");
  button.textContent = "START";
  button.classList.add("activate");
  button.classList.add("start");
  button.style.display = "none";
  button.addEventListener(
    "click",
    () => {
      translateToDefaultBoard(player);
      battleshipGameplay(player);
    },
    { once: true }
  );
  header.appendChild(button);
}

function replayButton() {
  const restart = document.createElement("button");
  restart.textContent = "REPLAY";
  restart.classList.add("replay");
  restart.classList.add("activate");
  restart.addEventListener("click", () => {
    window.location.reload();
  });
  header.appendChild(restart);
}

function translateToDefaultBoard(player) {
  player.gameboard.listOfShips.forEach((ship) => {
    const coord = getShipCoordinate(ship);
    for (let i = 0; i < coord.length; i++) {
      player.gameboard.updateCoordinate(ship, coord[i][0], coord[i][1]);
    }
  });
}

function getShipCoordinate(ship) {
  const coordinates = [];
  const ships = document.querySelectorAll("." + ship.name);
  for (let i = 0; i < ships.length; i++) {
    let nameArray = ships[i].id.split("");
    coordinates.push([nameArray[5], nameArray[6]]);
  }
  return coordinates;
}

function checkSelectionBoard() {
  const selectionboard = document.querySelectorAll(".ship-container-selection");
  let isEmpty = true;
  for (let i = 0; i < selectionboard.length; i++) {
    const currentContainer = selectionboard[i];
    currentContainer.childNodes.forEach((child) => {
      if (child.classList.contains("grid-button-ship")) {
        isEmpty = false;
      }
    });
  }
  return isEmpty;
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
