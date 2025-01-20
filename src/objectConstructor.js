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
  }

  receiveAttack(array) {
    if(array[0] > 9 || array[0] < 0 || array[1] > 9 || array[1] < 0){
        return "invalid"
    }
    if (this.myBoard[array[0]][array[1]] instanceof ship) {
      this.myBoard[array[0]][array[1]].hit();
      if (this.myBoard[array[0]][array[1]].sunk == true) {
        this.sunkShips += 1;
        return "SUNK!"
      }
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
    const array = [];
    this.myBoard.forEach((row) => {
      row.forEach((box) => {
        if (box instanceof ship) {
          if (!array.includes(box)) {
            array.push(box);
          }
        }
      });
    });
    this.numberofShips = array.length;
  }
}

class player {
  constructor() {
    this.gameboard = new gameboard();
    this.enemyboard = new gameboard();
  }
  attack(player, coordinates){
    if(!this.enemyboard[coordinates[0],coordinates[1]]){
        const result = player.gameboard.receiveAttack(coordinates)
        if(result === "hit"){
            this.enemyboard[coordinates[0],coordinates[1]] = "O"
            return "hit"
        }
        else if(result === "miss"){
            this.enemyboard[coordinates[0],coordinates[1]] = "X"
            return "miss"
        }
        else if(result === "SUNK!"){
            this.enemyboard[coordinates[0],coordinates[1]] = "!"
            return "SUNK!"
        }
        else{
            return "invalid"
        }
    }
    else{
        return "you have already attacked this place"
    }
  }

  randomAttack(player){
    const RNG = [Math.floor(Math.random * 9),Math.floor(Math.random * 9)]
    return this.attack(player, RNG)
  }
}

module.exports = {
  ship,
  gameboard,
  player,
};
