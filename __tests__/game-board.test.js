/* eslint-disable jest/no-disabled-tests */
import GameBoard from '../src/game-board.js';
import Ship from '../src/ship.js';
import Carrier from '../src/carrier.js';
import BattleShip from '../src/battleship.js';
import Destroyer from '../src/destroyer.js';
import SubMarine from '../src/submarine.js';
import PatrolBoat from '../src/patrol-boat.js';
import Node from '../src/board-node.js';

test('can create board', () => {
  expect(GameBoard).not.toBeUndefined();
});

test('can return valid moves', () => {
  const gameBoard = new GameBoard();
  const { validMoves } = gameBoard;

  expect(Array.isArray(validMoves)).toBeTruthy();
  expect(validMoves).toHaveLength(100);
});

test('valid moves are all node type', () => {
  const gameBoard = new GameBoard();
  const { validMoves } = gameBoard;

  let status = false;
  function runCheck() {
    return validMoves.every((node) => node instanceof Node);
  }

  status = runCheck();
  expect(status).toBeTruthy();
});

test('ensures all valid moves can be hit', () => {
  const gameBoard = new GameBoard();
  const { validMoves } = gameBoard;

  let status = false;
  function runCheck() {
    return validMoves.every((node) => !node.isHit);
  }

  status = runCheck();

  expect(status).toBeTruthy();
});

test('board should have a shipyard', () => {
  const board = new GameBoard();
  expect(board.shipYard).not.toBeUndefined();
});

test('board should have only 5 ship docks', () => {
  const board = new GameBoard();
  const shipDock = Object.keys(board.shipYard);
  expect(shipDock).toHaveLength(5);
});

test('board should contain only 5 Ships', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Ship;
  }
  expect(ships.every(checkShip)).toBe(true);
});

test('board should have a carrier in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Carrier;
  }

  expect(ships.some(checkShip)).toBe(true);
});

test('board should have a battleship in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof BattleShip;
  }

  expect(ships.some(checkShip)).toBe(true);
});

test('board should have a destroyer in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof Destroyer;
  }

  expect(ships.some(checkShip)).toBe(true);
});

test('board should have a submarine in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof SubMarine;
  }

  expect(ships.some(checkShip)).toBe(true);
});

test('board should have a patrolBoat in shipYard', () => {
  const board = new GameBoard();
  const { shipYard } = board;
  const ships = Object.values(shipYard);

  function checkShip(ship) {
    return ship instanceof PatrolBoat;
  }

  expect(ships.some(checkShip)).toBe(true);
});

test('board should have a placeCarrier method', () => {
  const board = new GameBoard();
  expect(board.placeCarrier).not.toBeUndefined();
});

test('board can position carrier horizontally', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0)).toBe(true);
});

test('board can position carrier vertically', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0, 'vertical')).toBe(true);
});

test('ignores invalid carrier orientation', () => {
  const board = new GameBoard();
  expect(board.placeCarrier(0, 0, 'diagonal')).toBe(false);
});

test('board should have a placeBattleShip method', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip).not.toBeUndefined();
});

test('board can position battleship horizontally', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0)).toBe(true);
});

test('board can position battleship vertically', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0, 'vertical')).toBe(true);
});

test('ignores invalid battleship orientation', () => {
  const board = new GameBoard();
  expect(board.placeBattleShip(0, 0, 'diagonal')).toBe(false);
});

test('board should have a placeDestroyer method', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer).not.toBeUndefined();
});

test('board can position destroyer horizontally', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0)).toBe(true);
});

test('board can position destroyer vertically', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
});

test('ignores invalid destroyer orientation', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
});

test('board should have a placePatrolBoat method', () => {
  const board = new GameBoard();
  expect(board.placePatrolBoat).not.toBeUndefined();
});

test('board can position patrol boat horizontally', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0)).toBe(true);
});

test('board can position patrol boat vertically', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
});

test('ignores invalid patrol boat orientation', () => {
  const board = new GameBoard();
  expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
});

test('board should have a placeSubMarine method', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine).not.toBeUndefined();
});

test('board can position submarine horizontally', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0)).toBe(true);
});

test('board can position submarine vertically', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0, 'vertical')).toBe(true);
});

test('ignores invalid submarine orientation', () => {
  const board = new GameBoard();
  expect(board.placeSubMarine(0, 0, 'diagonal')).toBe(false);
});

test('game should refuse overlapping ships', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(0, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 0)).toBe(false);
});

test('game should refuse placing ships on partly occupied position', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(0, 0, 'vertical')).toBe(true);
  expect(gameBoard.placeCarrier(0, 3)).toBe(false);
});

test('game should refuse placing ships on grids next to a ship', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(0, 0, 'vertical')).toBe(true);
  expect(gameBoard.placeBattleShip(1, 0)).toBe(false);
});

test('game should refuse placing ships off board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(2, 12)).toBe(false);
  expect(gameBoard.placeBattleShip(4, 12)).toBe(false);
  expect(gameBoard.placeDestroyer(3, 12)).toBe(false);
  expect(gameBoard.placeSubMarine(7, 12)).toBe(false);
  expect(gameBoard.placePatrolBoat(0, 12)).toBe(false);
});

test('should refuse to place ship on grids siding a ship on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeSubMarine(5, 1)).toBe(false);
});

test('gameBoard should have a receiveAttack() method', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack).not.toBeUndefined();
});

test('receiveAttack should refuse hit if no ship is on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack(0, 0)).toBe(false);
});

test('receiveAttack should refuse hit if all ships are not on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack(0, 0)).toBe(false);
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.receiveAttack(5, 0)).toBe(false);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.receiveAttack(0, 4)).toBe(false);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.receiveAttack(3, 3)).toBe(false);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.receiveAttack(6, 6)).toBe(false);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(true);
});

test('gameBoard receiveAttack should not hit off the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(10, 11)).toBe(false);
});

test('gameBoard receiveAttack should hit a ship on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(true);
});

test('gameBoard receiveAttack should hit a unoccupied node on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(9, 2)).toBe(true);
});

test('gameBoard receiveAttack should not hit same spot twice', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(false);
});

test('can report when carrier is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(5, 0)).toBe(true);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(6, 0)).toBe(true);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(7, 0)).toBe(true);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(8, 0)).toBe(true);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(9, 0)).toBe(true);
  expect(gameBoard.carrierSunk).toBe(true);
});

test('can report when battleship is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(0, 4)).toBe(true);
  expect(gameBoard.battleShipSunk).toBe(false);
  expect(gameBoard.receiveAttack(0, 5)).toBe(true);
  expect(gameBoard.battleShipSunk).toBe(false);

  expect(gameBoard.receiveAttack(0, 6)).toBe(true);
  expect(gameBoard.battleShipSunk).toBe(false);

  expect(gameBoard.receiveAttack(0, 7)).toBe(true);
  expect(gameBoard.battleShipSunk).toBe(true);
});

test('can report when destroyer is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(3, 3)).toBe(true);
  expect(gameBoard.destroyerSunk).toBe(false);
  expect(gameBoard.receiveAttack(4, 3)).toBe(true);
  expect(gameBoard.destroyerSunk).toBe(false);

  expect(gameBoard.receiveAttack(5, 3)).toBe(true);
  expect(gameBoard.destroyerSunk).toBe(true);
});

test('can report when submarine is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(6, 6)).toBe(true);
  expect(gameBoard.submarineSunk).toBe(false);
  expect(gameBoard.receiveAttack(6, 7)).toBe(true);
  expect(gameBoard.submarineSunk).toBe(false);

  expect(gameBoard.receiveAttack(6, 8)).toBe(true);
  expect(gameBoard.submarineSunk).toBe(true);
});

test('can report when patrol boat is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(1, 9)).toBe(true);
  expect(gameBoard.patrolBoatSunk).toBe(false);
  expect(gameBoard.receiveAttack(2, 9)).toBe(true);
  expect(gameBoard.patrolBoatSunk).toBe(true);
});

test('knows when all ship sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(5, 0)).toBe(true);
  expect(gameBoard.receiveAttack(6, 0)).toBe(true);
  expect(gameBoard.receiveAttack(7, 0)).toBe(true);
  expect(gameBoard.receiveAttack(8, 0)).toBe(true);
  expect(gameBoard.receiveAttack(9, 0)).toBe(true);

  expect(gameBoard.receiveAttack(0, 4)).toBe(true);
  expect(gameBoard.receiveAttack(0, 5)).toBe(true);
  expect(gameBoard.receiveAttack(0, 6)).toBe(true);
  expect(gameBoard.receiveAttack(0, 7)).toBe(true);

  expect(gameBoard.receiveAttack(3, 3)).toBe(true);
  expect(gameBoard.receiveAttack(4, 3)).toBe(true);
  expect(gameBoard.receiveAttack(5, 3)).toBe(true);

  expect(gameBoard.receiveAttack(6, 6)).toBe(true);
  expect(gameBoard.receiveAttack(6, 7)).toBe(true);
  expect(gameBoard.receiveAttack(6, 8)).toBe(true);

  expect(gameBoard.receiveAttack(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(2, 9)).toBe(true);

  expect(gameBoard.isAllShipSunk).toBeTruthy();
});

describe('ship removal', () => {
  describe('carrier removal', () => {
    const gameBoard = new GameBoard();

    test('has its removal method', () => {
      expect(gameBoard.removeCarrier).toBeDefined();
    });

    test('can remove carrier from board', () => {
      expect(gameBoard.placeCarrier(0, 0)).toBe(true);
      gameBoard.removeCarrier();
      expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
    });
  });

  describe('battleShip removal', () => {
    const gameBoard = new GameBoard();

    test('has its removal method', () => {
      expect(gameBoard.removeBattleShip).toBeDefined();
    });

    test('can remove battleShip from board', () => {
      expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
      gameBoard.removeBattleShip();
      expect(gameBoard.placeCarrier(0, 0)).toBe(true);
    });
  });

  describe('destroyer removal', () => {
    const gameBoard = new GameBoard();

    test('has its removal method', () => {
      expect(gameBoard.removeDestroyer).toBeDefined();
    });

    test('can remove destroyer from board', () => {
      expect(gameBoard.placeDestroyer(0, 0)).toBe(true);
      gameBoard.removeDestroyer();
      expect(gameBoard.placeCarrier(0, 0)).toBe(true);
    });
  });

  describe('submarine removal', () => {
    const gameBoard = new GameBoard();

    test('has its removal method', () => {
      expect(gameBoard.removeSubMarine).toBeDefined();
    });

    test('can remove submarine from board', () => {
      expect(gameBoard.placeSubMarine(0, 0)).toBe(true);
      gameBoard.removeSubMarine();
      expect(gameBoard.placeCarrier(0, 0)).toBe(true);
    });
  });

  describe('patrol boat removal', () => {
    const gameBoard = new GameBoard();

    test('has its removal method', () => {
      expect(gameBoard.removePatrolBoat).toBeDefined();
    });

    test('can remove patrol boat from board', () => {
      expect(gameBoard.placePatrolBoat(0, 0)).toBe(true);
      gameBoard.removePatrolBoat();
      expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
    });
  });
});

describe('auto ship placement', () => {
  const gameBoard = new GameBoard();
  describe('carrier auto placement', () => {
    test('carrierPlacement exists', () => {
      expect(gameBoard.carrierPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
      ];

      const carrierPlacements = gameBoard.carrierPlacement('horizontal');

      const formatted = carrierPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          HorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const VerticalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '9-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '9-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '9-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '9-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '9-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '9-5',
      ];

      const carrierPlacements = gameBoard.carrierPlacement('vertical');

      const formatted = carrierPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          VerticalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('ignores invalid orientation', () => {
      const carrierPlacements = gameBoard.carrierPlacement('invalid');

      expect(carrierPlacements).toHaveLength(0);
    });

    test('carrierAutoPlace exists', () => {
      expect(gameBoard.carrierAutoPlace).toBeDefined();
    });

    test('carrierAutoPlace returns obj following a pattern', () => {
      const placeAttribute = gameBoard.carrierAutoPlace('horizontal');

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(orientation === 'horizontal').toBe(true);

      expect(placeAttribute).toHaveProperty('placeHead');

      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
      ];

      const { placeHead } = placeAttribute;

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      expect(HorizontalPlacements.includes(formattedPlaceHead)).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');
    });

    test('carrierAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.carrierAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
    });

    test('carrierAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.carrierAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
    });
  });

  describe('battleship auto placement', () => {
    test('battleShipPlacement exists', () => {
      expect(gameBoard.battleShipPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
      ];

      const battleShipPlacements = gameBoard.battleShipPlacement('horizontal');

      const formatted = battleShipPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          HorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const VerticalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '9-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '9-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '9-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '9-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '9-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '9-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '9-6',
      ];

      const battleShipPlacements = gameBoard.battleShipPlacement('vertical');

      const formatted = battleShipPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          VerticalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('ignores invalid orientation', () => {
      const battleShipPlacements = gameBoard.battleShipPlacement('invalid');

      expect(battleShipPlacements).toHaveLength(0);
    });

    test('battleShipAutoPlace exists', () => {
      expect(gameBoard.battleShipAutoPlace).toBeDefined();
    });

    test('battleShipAutoPlace returns obj following a pattern', () => {
      const placeAttribute = gameBoard.battleShipAutoPlace('horizontal');

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(orientation === 'horizontal').toBe(true);

      expect(placeAttribute).toHaveProperty('placeHead');

      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
      ];

      const { placeHead } = placeAttribute;

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      expect(HorizontalPlacements.includes(formattedPlaceHead)).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');
    });

    test('battleShipAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.battleShipAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
    });

    test('battleShipAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.battleShipAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
    });
  });

  describe('destroyer auto placement', () => {
    test('destroyerPlacement exists', () => {
      expect(gameBoard.destroyerPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
      ];

      const destroyerPlacements = gameBoard.destroyerPlacement('horizontal');

      const formatted = destroyerPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          HorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const VerticalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '9-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '9-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '9-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '9-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '9-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '9-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '9-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '8-7',
        '9-7',
      ];

      const destroyerPlacements = gameBoard.destroyerPlacement('vertical');

      const formatted = destroyerPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          VerticalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('ignores invalid orientation', () => {
      const destroyerPlacements = gameBoard.destroyerPlacement('invalid');

      expect(destroyerPlacements).toHaveLength(0);
    });

    test('destroyerAutoPlace exists', () => {
      expect(gameBoard.destroyerAutoPlace).toBeDefined();
    });

    test('destroyerAutoPlace returns obj following a pattern', () => {
      const placeAttribute = gameBoard.destroyerAutoPlace('horizontal');

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(orientation === 'horizontal').toBe(true);

      expect(placeAttribute).toHaveProperty('placeHead');

      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
      ];

      const { placeHead } = placeAttribute;

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      expect(HorizontalPlacements.includes(formattedPlaceHead)).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');
    });

    test('destroyerAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.destroyerAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
    });

    test('destroyerAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.destroyerAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
    });
  });

  describe('submarine auto placement', () => {
    test('subMarinePlacement exists', () => {
      expect(gameBoard.subMarinePlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
      ];

      const subMarinePlacements = gameBoard.subMarinePlacement('horizontal');

      const formatted = subMarinePlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          HorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const VerticalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '9-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '9-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '9-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '9-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '9-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '9-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '9-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '8-7',
        '9-7',
      ];

      const subMarinePlacements = gameBoard.subMarinePlacement('vertical');

      const formatted = subMarinePlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          VerticalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('ignores invalid orientation', () => {
      const subMarinePlacements = gameBoard.subMarinePlacement('invalid');

      expect(subMarinePlacements).toHaveLength(0);
    });

    test('subMarineAutoPlace exists', () => {
      expect(gameBoard.subMarineAutoPlace).toBeDefined();
    });

    test('subMarineAutoPlace returns obj following a pattern', () => {
      const placeAttribute = gameBoard.subMarineAutoPlace('horizontal');

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(orientation === 'horizontal').toBe(true);

      expect(placeAttribute).toHaveProperty('placeHead');

      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
      ];

      const { placeHead } = placeAttribute;

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      expect(HorizontalPlacements.includes(formattedPlaceHead)).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');
    });

    test('subMarineAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.subMarineAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
    });

    test('subMarineAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.subMarineAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
    });
  });

  describe('patrol boat auto placement', () => {
    test('patrolBoatPlacement exists', () => {
      expect(gameBoard.patrolBoatPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '8-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '8-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
        '8-9',
      ];

      const patrolBoatPlacements = gameBoard.patrolBoatPlacement('horizontal');

      const formatted = patrolBoatPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          HorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const VerticalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '9-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '9-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '9-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '9-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '9-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '9-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '9-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '8-7',
        '9-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '8-8',
        '9-8',
      ];

      const patrolBoatPlacements = gameBoard.patrolBoatPlacement('vertical');

      const formatted = patrolBoatPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          VerticalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('ignores invalid orientation', () => {
      const patrolBoatPlacements = gameBoard.patrolBoatPlacement('invalid');

      expect(patrolBoatPlacements).toHaveLength(0);
    });

    test('patrolBoatAutoPlace exists', () => {
      expect(gameBoard.patrolBoatAutoPlace).toBeDefined();
    });

    test('patrolBoatAutoPlace returns obj following a pattern', () => {
      const placeAttribute = gameBoard.patrolBoatAutoPlace('horizontal');

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(orientation === 'horizontal').toBe(true);

      expect(placeAttribute).toHaveProperty('placeHead');

      const HorizontalPlacements = [
        '0-0',
        '1-0',
        '2-0',
        '3-0',
        '4-0',
        '5-0',
        '6-0',
        '7-0',
        '8-0',
        '0-1',
        '1-1',
        '2-1',
        '3-1',
        '4-1',
        '5-1',
        '6-1',
        '7-1',
        '8-1',
        '0-2',
        '1-2',
        '2-2',
        '3-2',
        '4-2',
        '5-2',
        '6-2',
        '7-2',
        '8-2',
        '0-3',
        '1-3',
        '2-3',
        '3-3',
        '4-3',
        '5-3',
        '6-3',
        '7-3',
        '8-3',
        '0-4',
        '1-4',
        '2-4',
        '3-4',
        '4-4',
        '5-4',
        '6-4',
        '7-4',
        '8-4',
        '0-5',
        '1-5',
        '2-5',
        '3-5',
        '4-5',
        '5-5',
        '6-5',
        '7-5',
        '8-5',
        '0-6',
        '1-6',
        '2-6',
        '3-6',
        '4-6',
        '5-6',
        '6-6',
        '7-6',
        '8-6',
        '0-7',
        '1-7',
        '2-7',
        '3-7',
        '4-7',
        '5-7',
        '6-7',
        '7-7',
        '8-7',
        '0-8',
        '1-8',
        '2-8',
        '3-8',
        '4-8',
        '5-8',
        '6-8',
        '7-8',
        '8-8',
        '0-9',
        '1-9',
        '2-9',
        '3-9',
        '4-9',
        '5-9',
        '6-9',
        '7-9',
        '8-9',
      ];
      const { placeHead } = placeAttribute;

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      expect(HorizontalPlacements.includes(formattedPlaceHead)).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');
    });

    test('patrolBoatAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.patrolBoatAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
    });

    test('patrolBoatAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.patrolBoatAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
    });
  });

  describe('all ships', () => {
    test('all shipPlacement exists', () => {
      expect(gameBoard.allShipsPlacement).toBeDefined();
    });

    test('returns an array with specific structure', () => {
      const allShipsPlacements = gameBoard.allShipsPlacement();

      expect(allShipsPlacements).toHaveLength(5);

      // expect(allShipsPlacements)
    });
  });
});
