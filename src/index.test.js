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

