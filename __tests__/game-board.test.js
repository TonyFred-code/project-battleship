import GameBoard from '../src/game-board';

it('game should have a placeShip() method', () => {
  expect(new GameBoard().placeShip).not.toBeUndefined();
});

it('game should place ship at coordinates', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 1, 3)).toBe(true);
});

it('game should refuse overlapping ships', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 1, 3)).toBe(true);
  expect(gameBoard.placeShip(2, 1, 3)).toBe(false);
});

it('game should refuse placing ships on partly occupied position', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 1, 3)).toBe(true);
  expect(gameBoard.placeShip(5, 2, 1, 'vertical')).toBe(false);
});

it('game should refuse placing ships on grids next to a ship', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(1, 7, 8)).toBe(true);
  expect(gameBoard.placeShip(1, 8, 9, 'vertical')).toBe(false);
});

it('game should refuse placing ships off board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 1, 11)).toBe(false);
});

it('game should place ship vertically', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 1, 3, 'vertical')).toBe(true);
});

it('game should refuse to place ship exactly side by side', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip(2, 2, 8)).toBe(true);
  expect(gameBoard.placeShip(2, 2, 7)).toBe(false);
});

it('game should refuse to place ship on grids by the side of a ship on the board', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 1, 3);
  expect(gameBoard.placeShip(2, 3, 3, 'vertical')).toBe(false);
});

it('gameBoard should have a receiveAttack() method', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack).not.toBeUndefined();
});

it('receiveAttack should refuse hit if no ship is on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack(1, 3)).toBe(false);
});

it('gameBoard receiveAttack should not hit off the board', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 1, 3);
  expect(gameBoard.receiveAttack(1, 10)).toBe(false);
});

it('gameBoard receiveAttack should hit a ship on the board', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 1, 3);
  expect(gameBoard.receiveAttack(1, 3)).toBe(true);
});

it('gameBoard receiveAttack should hit a unoccupied node on the board', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 1, 3);
  expect(gameBoard.receiveAttack(9, 3)).toBe(true);
});

it('gameBoard receiveAttack should not hit same spot twice', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 1, 3);
  expect(gameBoard.receiveAttack(1, 3)).toBe(true);
  expect(gameBoard.receiveAttack(1, 3)).toBe(false);
});

it('gameBoard receiveAttack should deny hit when all ship is sunk', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(1, 1, 3);
  expect(gameBoard.receiveAttack(1, 3)).toBe(true);
  expect(gameBoard.receiveAttack(9, 9)).toBe(false);
});

it('gameBoard receiveAttack should deny hit when all ship is sunk 2', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(2, 2, 8);
  expect(gameBoard.receiveAttack(2, 8)).toBe(true);
  expect(gameBoard.receiveAttack(3, 8)).toBe(true);
  expect(gameBoard.receiveAttack(9, 9)).toBe(false);
});

it('gameBoard should report when all ships are sunk', () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(1, 1, 3);
  gameBoard.receiveAttack(1, 3);
  expect(gameBoard.isAllShipSunk).toBe(true);
});

/*

1. Gameboards should be able to place ships at specific coordinates by calling the ship factory
   function.

2. Gameboards should have a receiveAttack function that takes a pair of coordinates, determines
   whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or
   records the coordinates of the missed shot.

3. Gameboards should keep track of missed attacks so they can display them properly.

4. Gameboards should be able to report whether or not all of their ships have been sunk.
*/
