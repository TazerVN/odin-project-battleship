class ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hitAmount = 0;
    this.sunk = false;
  }

  hit() {
    if (this.sunk == true) {
      return "already sunk";
    }
    this.hitAmount += 1;
    this.isSunk();
  }

  isSunk() {
    if (this.hitAmount == this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}

class gameboard {
  constructor() {
    this.myBoard = [
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], []],
    ];
    this.numberofShips = 0;
    this.sunkShips = 0;
    this.listOfShips = [];
  }

  receiveAttack(array) {
    if (array[0] > 9 || array[0] < 0 || array[1] > 9 || array[1] < 0) {
      return "invalid";
    }
    if (this.myBoard[array[0]][array[1]] instanceof ship) {
      this.myBoard[array[0]][array[1]].hit();
      if (this.myBoard[array[0]][array[1]].sunk == true) {
        this.sunkShips += 1;
        this.myBoard[array[0]][array[1]] = "!";
        return "SUNK!";
      }
      this.myBoard[array[0]][array[1]] = "O";
      return "hit";
    } else {
      this.myBoard[array[0]][array[1]] = "X";
      return "miss";
    }
  }

  generateShip() {
    const ship1 = new ship("ship1", 4);
    const ship2 = new ship("ship2", 1);
    const ship3 = new ship("ship3", 2);
    const ship4 = new ship("ship4", 3);

    this.listOfShips.push(ship1);
    this.listOfShips.push(ship2);
    this.listOfShips.push(ship3);
    this.listOfShips.push(ship4);

    this.updateNumberofShip();
  }

  randomShipPlacement(array) {
    array.forEach((element) => {
      let direction = "horizontal";
      let RNG1 = RNGfunc(10);
      let RNG2 = RNGfunc(10);
      let RNGBool = RNGfunc(2);

      if (RNGBool == 1) {
        direction = "vertical";
      }

      for (let i = 0; i < element.length; i++) {
        if (direction == "vertical") {
          while (
            this.myBoard[RNG1][RNG2] instanceof ship ||
            this.myBoard[RNG1 + i][RNG2] instanceof ship ||
            RNG1 - 1 + element.length >= 10
          ) {
            RNG1 = RNGfunc(10);
            RNG2 = RNGfunc(10);
          }
        } else if (direction == "horizontal") {
          while (
            this.myBoard[RNG1][RNG2] instanceof ship ||
            this.myBoard[RNG1][RNG2 + i] instanceof ship ||
            RNG2 - 1 + element.length >= 10
          ) {
            RNG1 = RNGfunc(10);
            RNG2 = RNGfunc(10);
          }
        }
      }
      console.log(RNG1, RNG2);

      if (direction == "vertical") {
        for (let i = 0; i < element.length; i++) {
          this.myBoard[RNG1 + i][RNG2] = element;
        }
      } else if (direction == "horizontal") {
        for (let i = 0; i < element.length; i++) {
          this.myBoard[RNG1][RNG2 + i] = element;
        }
      }
    });
  }

  updateNumberofShip() {
    this.numberofShips = this.listOfShips.length;
  }

  updateCoordinate(ship, i, n) {
    this.myBoard[i][n] = ship;
  }
}

class player {
  constructor(name) {
    this.name = name;
    this.gameboard = new gameboard();
    this.enemyboard = new gameboard();
    this.opponent = null;
    this.isTurn = false;
    this.attackList = [];
  }
  attackTarget(player, coordinates) {
    if (this.enemyboard.myBoard[coordinates[0]][coordinates[1]] == "") {
      const result = player.gameboard.receiveAttack(coordinates);
      if (result === "hit") {
        this.enemyboard.myBoard[coordinates[0]][coordinates[1]].push("O");
        return "hit";
      } else if (result === "miss") {
        this.enemyboard.myBoard[coordinates[0]][coordinates[1]].push("X");
        return "miss";
      } else if (result === "SUNK!") {
        this.enemyboard.myBoard[coordinates[0]][coordinates[1]].push("!");
        return "SUNK!";
      } else {
        return "invalid";
      }
    } else {
      return "invalid";
    }
  }

  winCondition() {
    return this.gameboard.numberofShips === this.gameboard.sunkShips;
  }
}

function RNGfunc(number) {
  return Math.floor(Math.random() * number);
}

function check(value, index, array) {
  return value;
}

module.exports = {
  ship,
  gameboard,
  player,
  RNGfunc,
};
