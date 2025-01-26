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
    const ship4 = new ship("ship", 3);

    this.listOfShips.push(ship1);
    this.listOfShips.push(ship2);
    this.listOfShips.push(ship3);
    this.listOfShips.push(ship4);

    this.myBoard[0][0] = ship2;
    this.myBoard[3][3] = ship3;
    this.myBoard[3][2] = ship3;
    this.myBoard[6][6] = ship1;
    this.myBoard[5][6] = ship1;
    this.myBoard[4][6] = ship1;
    this.myBoard[3][6] = ship1;
    this.updateNumberofShip();
  }

  updateNumberofShip() {
    this.numberofShips = this.listOfShips.length;
  }
}

class player {
  constructor(name) {
    this.name = name;
    this.gameboard = new gameboard();
    this.enemyboard = new gameboard();
    this.opponent = null;
    this.isTurn = false;
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
      return "you have already attacked this place";
    }
  }

  randomAttack(player) {
    let previousCoord;
    let RNG1 = Math.floor(Math.random() * 9);
    let RNG2 = Math.floor(Math.random() * 9);
    const RNGcoord = [RNG1, RNG2];
    if (RNGcoord == previousCoord) {
      RNG1 = Math.floor(Math.random() * 9);
      RNG2 = Math.floor(Math.random() * 9);
    }
    previousCoord = RNGcoord;
    this.attackTarget(player, RNGcoord);
  }

  winCondition() {
    return this.gameboard.numberofShips === this.gameboard.sunkShips;
  }
}

module.exports = {
  ship,
  gameboard,
  player,
};
