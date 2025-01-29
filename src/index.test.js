const { ship, gameboard, player } = require("./objectConstructor");

it("testing gameboard receiveAttack method", () => {
  const mockGameboard = new gameboard();
  mockGameboard.generateShip();
  expect(mockGameboard.receiveAttack([3,3])).toBe("hit");
  expect(mockGameboard.receiveAttack([1,1])).toBe("miss");
});

it("testing gameboard ship placement", () => {
  const mockGameboard = new gameboard();
  mockGameboard.generateShip();
  expect(mockGameboard.myBoard[0][0]).toBeInstanceOf(ship);
  expect(mockGameboard.myBoard[3][3]).toBeInstanceOf(ship);
  expect(mockGameboard.myBoard[3][4]).toBeInstanceOf(ship);
});

it("testing number of ships on board", () => {
  const mockGameboard = new gameboard();
  mockGameboard.generateShip();
  expect(mockGameboard.numberofShips).toBe(3);
});

it("testing ship sinking on gameboard", () => {
  const mockGameboard = new gameboard();
  mockGameboard.generateShip();
  mockGameboard.receiveAttack([0,0]); // Attack ship2 (length 1)
  expect(mockGameboard.myBoard[0][0].sunk).toBe(true);
});

it("testing ship sunk counter", () =>{
    const mockGameboard = new gameboard();
    mockGameboard.generateShip();
    mockGameboard.receiveAttack([0,0]);
    expect(mockGameboard.sunkShips).toBe(1)
})

it("testing player attack method", () => {
  const player1 = new player();
  const player2 = new player();
  player2.gameboard.generateShip();
  expect(player1.attack(player2, [3,3])).toBe("hit");
  expect(player1.attack(player2, [1,1])).toBe("miss");
  expect(player1.attack(player2, [10,10])).toBe("invalid");
  expect(player1.attack(player2, [3,3])).toBe("you have already attacked this place");
});

it("testing player boards initialization", () => {
  const player1 = new player();
  expect(player1.gameboard).toBeInstanceOf(gameboard);
  expect(player1.enemyboard).toBeInstanceOf(gameboard);
});

it("testing win condition", () => {
  const player1 = new player("Player1");
  const player2 = new player("Player2");
  player1.opponent = player2;
  player2.opponent = player1;
  player2.gameboard.generateShip();
  
  // Sink all ships on player2's board
  player1.attack(player2, [0,0]); // Sink ship2 (length 1)
  player1.attack(player2, [3,3]); // Hit ship1 (length 2)
  player1.attack(player2, [3,4]); // Sink ship1
  player1.attack(player2, [6,6]); // Hit ship3 (length 3) 
  player1.attack(player2, [6,7]); // Hit ship3
  player1.attack(player2, [6,8]); // Sink ship3

  expect(player2.winCondition()).toBe(true);
  expect(player1.winCondition()).toBe(false);
});

it("testing ship placement validation", () => {
  const mockGameboard = new gameboard();
  const testShip = new ship(3);
  
  expect(mockGameboard.isValidPlacement(testShip, 0, 0)).toBe(true);
  expect(mockGameboard.isValidPlacement(testShip, 8, 8)).toBe(false); // Would go off board
  
  mockGameboard.placeShip(testShip, 0, 0);
  expect(mockGameboard.isValidPlacement(new ship(2), 0, 0)).toBe(false); // Overlapping ships
});
