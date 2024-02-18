import GameBoard from '../src/game-board';
import Ship from '../src/ship';
import Carrier from '../src/carrier';
import BattleShip from '../src/battleship';
import Destroyer from '../src/destroyer';
import SubMarine from '../src/submarine';
import PatrolBoat from '../src/patrol-boat';

it('can create board', () => {
  expect(GameBoard).not.toBeUndefined();
});

it('board should have a shipyard', () => {
  const board = new GameBoard();
  expect(board.shipYard).not.toBeUndefined();
});

it('board should have only 5 ship docks', () => {
  const board = new GameBoard();
  const shipDock = Object.keys(board.shipYard);
  expect(shipDock).toHaveLength(5);
});

it('board should contain only 5 Ships', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Ship;
  }
  expect(ships.every(checkShip)).toBe(true);
});

it('board should have a carrier in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Carrier;
  }

  expect(ships.some(checkShip)).toBe(true);
});

it('board should have a battleship in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof BattleShip;
  }

  expect(ships.some(checkShip)).toBe(true);
});

it('board should have a destroyer in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Destroyer;
  }

  expect(ships.some(checkShip)).toBe(true);
});

it('board should have a submarine in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof SubMarine;
  }

  expect(ships.some(checkShip)).toBe(true);
});

it('board should have a patrolBoat in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof PatrolBoat;
  }

  expect(ships.some(checkShip)).toBe(true);
});

it('board should have a placeCarrier method', () => {
  const board = new GameBoard();
  expect(board.placeCarrier).not.toBeUndefined();
});

it('board can position carrier horizontally', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0)).toBe(true);
});

it('board can position carrier vertically', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0, 'vertical')).toBe(true);
});

it('ignores invalid carrier orientation', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0, 'diagonal')).toBe(false);
});

it('board should have a placeBattleShip method', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip).not.toBeUndefined();
});

it('board can position battleship horizontally', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0)).toBe(true);
});

it('board can position battleship vertically', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0, 'vertical')).toBe(true);
});

it('ignores invalid battleship orientation', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0, 'diagonal')).toBe(false);
});

it('board should have a placeDestroyer method', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer).not.toBeUndefined();
});

it('board can position destroyer horizontally', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0)).toBe(true);
});

it('board can position destroyer vertically', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
});

it('ignores invalid destroyer orientation', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
});

it('board should have a placePatrolBoat method', () => {
  const board = new GameBoard();
  expect(board.placePatrolBoat).not.toBeUndefined();
});

it('board can position patrol boat horizontally', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0)).toBe(true);
});

it('board can position patrol boat vertically', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
});

it('ignores invalid patrol boat orientation', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
});

it('board should have a placeSubMarine method', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine).not.toBeUndefined();
});

it('board can position submarine horizontally', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0)).toBe(true);
});

it('board can position submarine vertically', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0, 'vertical')).toBe(true);
});

it('ignores invalid submarine orientation', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0, 'diagonal')).toBe(false);
});

// it('game should have a placeShip() method', () => {
//   expect(new GameBoard().placeShip).not.toBeUndefined();
// });

// it('game should place ship at coordinates', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeShip(2, 1, 3)).toBe(true);
// });

it('game should refuse overlapping ships', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(0, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 0)).toBe(false);
});

it.todo('game should refuse placing ships on partly occupied position');

it.todo('game should refuse placing ships on grids next to a ship');

it.todo('game should refuse placing ships off board');

it.todo('game should place ship vertically');

it.todo('game should place ship horizontally');

it.todo('should use "horizontal" or "vertical" orientation');

it.todo('game should refuse to place ship exactly side by side');

it.todo('should refuse to place ship on grids siding a ship on the board');

it.todo('gameBoard should have a receiveAttack() method');

it.todo('receiveAttack should refuse hit if no ship is on the board');

it.todo('receiveAttack should refuse hit if all ships are not on the board');

it.todo('gameBoard receiveAttack should not hit off the board');

it.todo('gameBoard receiveAttack should hit a ship on the board');

it.todo('gameBoard receiveAttack should hit a unoccupied node on the board');

it.todo('gameBoard receiveAttack should not hit same spot twice');

it.todo('gameBoard receiveAttack should deny hit when all ship is sunk');

it.todo('gameBoard should report when all ships are sunk');

/*

1. Gameboards should be able to place ships at specific coordinates by calling the ship factory
   function.

2. Gameboards should have a receiveAttack function that takes a pair of coordinates, determines
   whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or
   records the coordinates of the missed shot.

3. Gameboards should keep track of missed attacks so they can display them properly.

4. Gameboards should be able to report whether or not all of their ships have been sunk.
*/
