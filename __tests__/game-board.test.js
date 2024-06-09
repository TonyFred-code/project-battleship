import GameBoard from '../src/game-board.js';
import Ship from '../src/ship.js';
import Carrier from '../src/carrier.js';
import BattleShip from '../src/battleship.js';
import Destroyer from '../src/destroyer.js';
import SubMarine from '../src/submarine.js';
import PatrolBoat from '../src/patrol-boat.js';
import Node from '../src/board-node.js';
import {
  CarrierVerticalPlacements,
  CarrierHorizontalPlacements,
  BattleShipHorizontalPlacements,
  BattleShipVerticalPlacements,
} from '../src/helper_module/ship-placements.js';

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
  expect(gameBoard.placeBattleShip(0, 3)).toBe(false);
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
  expect(gameBoard.receiveAttack(0, 0)).toBe(-1);
});

test('receiveAttack should refuse hit if all ships are not on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.receiveAttack(0, 0)).toBe(-1);
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.receiveAttack(5, 0)).toBe(-1);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.receiveAttack(0, 4)).toBe(-1);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.receiveAttack(3, 3)).toBe(-1);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.receiveAttack(6, 6)).toBe(-1);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(1);
});

test('gameBoard receiveAttack should not hit off the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(10, 11)).toBe(-1);
});

test('gameBoard receiveAttack should hit a ship on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(1);
});

test('gameBoard receiveAttack should hit a unoccupied node on the board', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(9, 2)).toBe(0);
});

test('gameBoard receiveAttack should not hit same spot twice', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
  expect(gameBoard.receiveAttack(1, 9)).toBe(1);
  expect(gameBoard.receiveAttack(1, 9)).toBe(-1);
});

test('can report when carrier is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(5, 0)).toBe(1);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(6, 0)).toBe(1);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(7, 0)).toBe(1);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(8, 0)).toBe(1);
  expect(gameBoard.carrierSunk).toBe(false);
  expect(gameBoard.receiveAttack(9, 0)).toBe(1);
  expect(gameBoard.carrierSunk).toBe(true);
});

test('can report when battleship is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(0, 4)).toBe(1);
  expect(gameBoard.battleShipSunk).toBe(false);
  expect(gameBoard.receiveAttack(0, 5)).toBe(1);
  expect(gameBoard.battleShipSunk).toBe(false);

  expect(gameBoard.receiveAttack(0, 6)).toBe(1);
  expect(gameBoard.battleShipSunk).toBe(false);

  expect(gameBoard.receiveAttack(0, 7)).toBe(1);
  expect(gameBoard.battleShipSunk).toBe(true);
});

test('can report when destroyer is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(3, 3)).toBe(1);
  expect(gameBoard.destroyerSunk).toBe(false);
  expect(gameBoard.receiveAttack(4, 3)).toBe(1);
  expect(gameBoard.destroyerSunk).toBe(false);

  expect(gameBoard.receiveAttack(5, 3)).toBe(1);
  expect(gameBoard.destroyerSunk).toBe(true);
});

test('can report when submarine is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(6, 6)).toBe(1);
  expect(gameBoard.submarineSunk).toBe(false);
  expect(gameBoard.receiveAttack(6, 7)).toBe(1);
  expect(gameBoard.submarineSunk).toBe(false);
  expect(gameBoard.receiveAttack(6, 8)).toBe(1);

  expect(gameBoard.submarineSunk).toBe(true);
});

test('can report when patrol boat is sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(1, 9)).toBe(1);
  expect(gameBoard.patrolBoatSunk).toBe(false);
  expect(gameBoard.receiveAttack(2, 9)).toBe(1);
  expect(gameBoard.patrolBoatSunk).toBe(true);
});

test('knows when all ship sunk', () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeCarrier(5, 0)).toBe(true);
  expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
  expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

  expect(gameBoard.receiveAttack(5, 0)).toBe(1);
  expect(gameBoard.receiveAttack(6, 0)).toBe(1);
  expect(gameBoard.receiveAttack(7, 0)).toBe(1);
  expect(gameBoard.receiveAttack(8, 0)).toBe(1);
  expect(gameBoard.receiveAttack(9, 0)).toBe(1);

  expect(gameBoard.receiveAttack(0, 4)).toBe(1);
  expect(gameBoard.receiveAttack(0, 5)).toBe(1);
  expect(gameBoard.receiveAttack(0, 6)).toBe(1);
  expect(gameBoard.receiveAttack(0, 7)).toBe(1);

  expect(gameBoard.receiveAttack(3, 3)).toBe(1);
  expect(gameBoard.receiveAttack(4, 3)).toBe(1);
  expect(gameBoard.receiveAttack(5, 3)).toBe(1);

  expect(gameBoard.receiveAttack(6, 6)).toBe(1);
  expect(gameBoard.receiveAttack(6, 7)).toBe(1);
  expect(gameBoard.receiveAttack(6, 8)).toBe(1);

  expect(gameBoard.receiveAttack(1, 9)).toBe(1);
  expect(gameBoard.receiveAttack(2, 9)).toBe(1);

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
  describe('carrier auto placement', () => {
    const gameBoard = new GameBoard();

    function isValidOrientation(orientation) {
      return orientation === 'horizontal' || orientation === 'vertical';
    }

    test('carrierPlacement exists', () => {
      expect(gameBoard.carrierPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const carrierPlacements = gameBoard.carrierPlacement('horizontal');

      expect(carrierPlacements).toHaveLength(60);

      const formatted = carrierPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          CarrierHorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const carrierPlacements = gameBoard.carrierPlacement('vertical');

      const formatted = carrierPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          CarrierVerticalPlacements.includes(element),
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
      const placeAttribute = gameBoard.carrierAutoPlace();

      expect(placeAttribute).toHaveProperty('orientation');

      const { orientation } = placeAttribute;

      expect(isValidOrientation(orientation)).toBe(true);

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

      const { placeHead } = placeAttribute;
      console.table(placeHead);

      const formattedPlaceHead = `${placeHead[0]}-${placeHead[1]}`;

      function isValidPlaceHead() {
        if (orientation === 'horizontal') {
          return HorizontalPlacements.includes(formattedPlaceHead);
        }
        return VerticalPlacements.includes(formattedPlaceHead);
      }

      expect(isValidPlaceHead()).toBe(true);

      expect(placeAttribute).toHaveProperty('occupyingNodeLoc');

      gameBoard.removeCarrier();
    });

    test('carrierAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.carrierAutoPlace();

      const { orientation } = placeAttribute;

      expect(isValidOrientation(orientation)).toBe(true);

      gameBoard.removeCarrier();
    });
  });

  describe('battleship auto placement', () => {
    const gameBoard = new GameBoard();

    test('battleShipPlacement exists', () => {
      expect(gameBoard.battleShipPlacement).toBeDefined();
    });

    test('should return array of possible head pos - horizontal', () => {
      const battleShipPlacements = gameBoard.battleShipPlacement('horizontal');

      const formatted = battleShipPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          BattleShipHorizontalPlacements.includes(element),
        );
      }

      expect(checkFormatted()).toBe(true);
    });

    test('should return array of possible head pos - vertical', () => {
      const battleShipPlacements = gameBoard.battleShipPlacement('vertical');

      const formatted = battleShipPlacements.map(
        (headLoc) => `${headLoc[0]}-${headLoc[1]}`,
      );

      function checkFormatted() {
        return formatted.every((element) =>
          BattleShipVerticalPlacements.includes(element),
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

      gameBoard.removeBattleShip();
    });

    test('battleShipAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.battleShipAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);

      gameBoard.removeBattleShip();
    });

    test('battleShipAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.battleShipAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);

      gameBoard.removeBattleShip();
    });
  });

  describe('destroyer auto placement', () => {
    const gameBoard = new GameBoard();
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

      gameBoard.removeDestroyer();
    });

    test('destroyerAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.destroyerAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);
      gameBoard.removeDestroyer();
    });

    test('destroyerAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.destroyerAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);
      gameBoard.removeDestroyer();
    });
  });

  describe('submarine auto placement', () => {
    const gameBoard = new GameBoard();

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

      gameBoard.removeSubMarine();
    });

    test('subMarineAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.subMarineAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);

      gameBoard.removeSubMarine();
    });

    test('subMarineAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.subMarineAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);

      gameBoard.removeSubMarine();
    });
  });

  describe('patrol boat auto placement', () => {
    const gameBoard = new GameBoard();

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

      gameBoard.removePatrolBoat();
    });

    test('patrolBoatAutoPlace can place vertically', () => {
      const placeAttribute = gameBoard.patrolBoatAutoPlace('vertical');

      const { orientation } = placeAttribute;

      expect(orientation === 'vertical').toBe(true);

      gameBoard.removePatrolBoat();
    });

    test('patrolBoatAutoPlace refuse invalid orientation', () => {
      const placeAttribute = gameBoard.patrolBoatAutoPlace('something');

      const keys = Object.keys(placeAttribute);

      expect(keys).toHaveLength(0);

      gameBoard.removePatrolBoat();
    });
  });

  describe('ship auto placement places ships on the board', () => {
    describe('carrier auto placement', () => {
      const gameBoard = new GameBoard();

      test('ships get hit and can be sunk using auto placement', () => {
        function rndOrientation() {
          const rnd = Math.floor(Math.random() * 10);

          if (rnd % 2 === 0) return 'vertical';

          return 'horizontal';
        }

        const carrierPlaceInfo = gameBoard.carrierAutoPlace(rndOrientation());

        gameBoard.battleShipAutoPlace(rndOrientation());

        gameBoard.destroyerAutoPlace(rndOrientation());

        gameBoard.subMarineAutoPlace(rndOrientation());

        gameBoard.patrolBoatAutoPlace(rndOrientation());

        const carrierOccupying = carrierPlaceInfo.occupyingNodeLoc;

        const carrierHits = new Set();

        carrierOccupying.forEach((nodeLoc) => {
          const [x, y] = nodeLoc;

          carrierHits.add(gameBoard.receiveAttack(x, y));
        });

        expect(carrierHits.size).toBe(1);

        expect(carrierHits.has(1)).toBe(true);
        expect(carrierHits.has(0)).toBe(false);
        expect(carrierHits.has(-1)).toBe(false);

        expect(gameBoard.carrierSunk).toBe(true);
      });
    });

    describe('battleship auto placement', () => {
      const gameBoard = new GameBoard();

      test('ships get hit and can be sunk using auto placement', () => {
        function rndOrientation() {
          const rnd = Math.floor(Math.random() * 10);

          if (rnd % 2 === 0) return 'vertical';

          return 'horizontal';
        }

        gameBoard.carrierAutoPlace(rndOrientation());

        const battleShipPlaceInfo =
          gameBoard.battleShipAutoPlace(rndOrientation());

        gameBoard.destroyerAutoPlace(rndOrientation());

        gameBoard.subMarineAutoPlace(rndOrientation());

        gameBoard.patrolBoatAutoPlace(rndOrientation());

        const battleShipOccupying = battleShipPlaceInfo.occupyingNodeLoc;

        const battleShipHits = new Set();

        battleShipOccupying.forEach((nodeLoc) => {
          const [x, y] = nodeLoc;

          battleShipHits.add(gameBoard.receiveAttack(x, y));
        });

        expect(battleShipHits.size).toBe(1);

        expect(battleShipHits.has(1)).toBe(true);
        expect(battleShipHits.has(0)).toBe(false);
        expect(battleShipHits.has(-1)).toBe(false);

        expect(gameBoard.battleShipSunk).toBe(true);
      });
    });

    describe('destroyer auto placement', () => {
      const gameBoard = new GameBoard();

      test('ships get hit and can be sunk using auto placement', () => {
        function rndOrientation() {
          const rnd = Math.floor(Math.random() * 10);

          if (rnd % 2 === 0) return 'vertical';

          return 'horizontal';
        }

        gameBoard.carrierAutoPlace(rndOrientation());

        gameBoard.battleShipAutoPlace(rndOrientation());

        const destroyerPlaceInfo =
          gameBoard.destroyerAutoPlace(rndOrientation());

        gameBoard.subMarineAutoPlace(rndOrientation());

        gameBoard.patrolBoatAutoPlace(rndOrientation());

        const destroyerOccupying = destroyerPlaceInfo.occupyingNodeLoc;

        const destroyerHits = new Set();

        destroyerOccupying.forEach((nodeLoc) => {
          const [x, y] = nodeLoc;

          destroyerHits.add(gameBoard.receiveAttack(x, y));
        });

        expect(destroyerHits.size).toBe(1);

        expect(destroyerHits.has(1)).toBe(true);
        expect(destroyerHits.has(0)).toBe(false);
        expect(destroyerHits.has(-1)).toBe(false);

        expect(gameBoard.destroyerSunk).toBe(true);
      });
    });

    describe('sub marine auto placement', () => {
      const gameBoard = new GameBoard();

      test('ships get hit and can be sunk using auto placement', () => {
        function rndOrientation() {
          const rnd = Math.floor(Math.random() * 10);

          if (rnd % 2 === 0) return 'vertical';

          return 'horizontal';
        }

        gameBoard.carrierAutoPlace(rndOrientation());

        gameBoard.battleShipAutoPlace(rndOrientation());

        gameBoard.destroyerAutoPlace(rndOrientation());

        const subMarinePlaceInfo =
          gameBoard.subMarineAutoPlace(rndOrientation());

        gameBoard.patrolBoatAutoPlace(rndOrientation());

        const subMarineOccupying = subMarinePlaceInfo.occupyingNodeLoc;

        const subMarineHits = new Set();

        subMarineOccupying.forEach((nodeLoc) => {
          const [x, y] = nodeLoc;

          subMarineHits.add(gameBoard.receiveAttack(x, y));
        });

        expect(subMarineHits.size).toBe(1);

        expect(subMarineHits.has(1)).toBe(true);
        expect(subMarineHits.has(0)).toBe(false);
        expect(subMarineHits.has(-1)).toBe(false);

        expect(gameBoard.submarineSunk).toBe(true);
      });
    });

    describe('patrol boat auto placement', () => {
      const gameBoard = new GameBoard();

      test('ships get hit and can be sunk using auto placement', () => {
        function rndOrientation() {
          const rnd = Math.floor(Math.random() * 10);

          if (rnd % 2 === 0) return 'vertical';

          return 'horizontal';
        }

        gameBoard.carrierAutoPlace(rndOrientation());

        gameBoard.battleShipAutoPlace(rndOrientation());

        gameBoard.destroyerAutoPlace(rndOrientation());

        gameBoard.subMarineAutoPlace(rndOrientation());

        const patrolBoatPlaceInfo =
          gameBoard.patrolBoatAutoPlace(rndOrientation());

        const patrolBoatOccupying = patrolBoatPlaceInfo.occupyingNodeLoc;

        const patrolBoatHits = new Set();

        patrolBoatOccupying.forEach((nodeLoc) => {
          const [x, y] = nodeLoc;

          patrolBoatHits.add(gameBoard.receiveAttack(x, y));
        });

        expect(patrolBoatHits.size).toBe(1);

        expect(patrolBoatHits.has(1)).toBe(true);
        expect(patrolBoatHits.has(0)).toBe(false);
        expect(patrolBoatHits.has(-1)).toBe(false);

        expect(gameBoard.patrolBoatSunk).toBe(true);
      });
    });
  });
});

describe('querying ship placement', () => {
  test('method to check for ship placements exists', () => {
    const board = new GameBoard();

    expect(board.shipPlacements).toBeDefined();
  });

  describe('ship placement method returns correct data input', () => {
    const gameBoard = new GameBoard();

    gameBoard.placeCarrier(5, 0);

    gameBoard.placeBattleShip(0, 4, 'vertical');

    gameBoard.placeDestroyer(3, 3);
    gameBoard.placeSubMarine(6, 6, 'vertical');

    gameBoard.placePatrolBoat(1, 9);

    const { shipPlacements } = gameBoard;

    test('carrier placement returned is correct', () => {
      expect(shipPlacements).toHaveProperty('carrierPlacement');

      const { carrierPlacement } = shipPlacements;

      expect(carrierPlacement).toHaveProperty('shipHead', [5, 0]);

      expect(carrierPlacement).toHaveProperty('orientation', 'horizontal');

      expect(carrierPlacement).toHaveProperty('occupyingLoc');

      const { occupyingLoc } = carrierPlacement;

      const toBeOccupied = ['5, 0', '6, 0', '7, 0', '8, 0', '9, 0'];

      expect(occupyingLoc).toHaveLength(5);

      let correct = false;

      occupyingLoc.forEach((element) => {
        const [x, y] = element;

        const transform = `${x}, ${y}`;

        correct = toBeOccupied.includes(transform);
      });

      expect(correct).toBeTruthy();

      expect(carrierPlacement).toHaveProperty('isOnBoard', true);
    });

    test('battleship placement returned is correct', () => {
      expect(shipPlacements).toHaveProperty('battleShipPlacement');

      const { battleShipPlacement } = shipPlacements;

      expect(battleShipPlacement).toHaveProperty('shipHead', [0, 4]);

      expect(battleShipPlacement).toHaveProperty('orientation', 'vertical');

      expect(battleShipPlacement).toHaveProperty('occupyingLoc');

      const { occupyingLoc } = battleShipPlacement;

      const toBeOccupied = ['0, 4', '0, 5', '0, 6', '0, 7'];

      expect(occupyingLoc).toHaveLength(4);

      let correct = false;

      occupyingLoc.forEach((element) => {
        const [x, y] = element;

        const transform = `${x}, ${y}`;

        correct = toBeOccupied.includes(transform);
      });

      expect(correct).toBeTruthy();

      expect(battleShipPlacement).toHaveProperty('isOnBoard', true);
    });

    test('destroyer placement returned is correct', () => {
      expect(shipPlacements).toHaveProperty('destroyerPlacement');

      const { destroyerPlacement } = shipPlacements;

      expect(destroyerPlacement).toHaveProperty('shipHead', [3, 3]);

      expect(destroyerPlacement).toHaveProperty('orientation', 'horizontal');

      expect(destroyerPlacement).toHaveProperty('occupyingLoc');

      const { occupyingLoc } = destroyerPlacement;

      const toBeOccupied = ['3, 3', '4, 3', '5, 3'];

      expect(occupyingLoc).toHaveLength(3);

      let correct = false;

      occupyingLoc.forEach((element) => {
        const [x, y] = element;

        const transform = `${x}, ${y}`;

        correct = toBeOccupied.includes(transform);
      });

      expect(correct).toBeTruthy();

      expect(destroyerPlacement).toHaveProperty('isOnBoard', true);
    });

    test('submarine placement returned is correct', () => {
      expect(shipPlacements).toHaveProperty('subMarinePlacement');

      const { subMarinePlacement } = shipPlacements;

      expect(subMarinePlacement).toHaveProperty('shipHead', [6, 6]);

      expect(subMarinePlacement).toHaveProperty('orientation', 'vertical');

      expect(subMarinePlacement).toHaveProperty('occupyingLoc');

      const { occupyingLoc } = subMarinePlacement;

      const toBeOccupied = ['6, 6', '6, 7', '6, 8'];

      expect(occupyingLoc).toHaveLength(3);

      let correct = false;

      occupyingLoc.forEach((element) => {
        const [x, y] = element;

        const transform = `${x}, ${y}`;

        correct = toBeOccupied.includes(transform);
      });

      expect(correct).toBeTruthy();

      expect(subMarinePlacement).toHaveProperty('isOnBoard', true);
    });

    test('patrol boat placement returned is correct', () => {
      expect(shipPlacements).toHaveProperty('patrolBoatPlacement');

      const { patrolBoatPlacement } = shipPlacements;

      expect(patrolBoatPlacement).toHaveProperty('shipHead', [1, 9]);

      expect(patrolBoatPlacement).toHaveProperty('orientation', 'horizontal');

      expect(patrolBoatPlacement).toHaveProperty('occupyingLoc');

      const { occupyingLoc } = patrolBoatPlacement;

      const toBeOccupied = ['1, 9', '2, 9'];

      expect(occupyingLoc).toHaveLength(2);

      let correct = false;

      occupyingLoc.forEach((element) => {
        const [x, y] = element;

        const transform = `${x}, ${y}`;

        correct = toBeOccupied.includes(transform);
      });

      expect(correct).toBeTruthy();

      expect(patrolBoatPlacement).toHaveProperty('isOnBoard', true);
    });
  });

  describe('ship placement for non-placed ships', () => {
    const gameBoard = new GameBoard();

    test('un-placed carrier', () => {
      const { carrierPlacement } = gameBoard.shipPlacements;

      const { shipHead, occupyingLoc, orientation, isOnBoard } =
        carrierPlacement;

      expect(shipHead).toHaveLength(0);

      expect(occupyingLoc).toHaveLength(0);

      expect(orientation).toBe('');

      expect(isOnBoard).toBe(false);
    });

    test('un-placed battleShip', () => {
      const { battleShipPlacement } = gameBoard.shipPlacements;

      const { shipHead, occupyingLoc, orientation, isOnBoard } =
        battleShipPlacement;

      expect(shipHead).toHaveLength(0);

      expect(occupyingLoc).toHaveLength(0);

      expect(orientation).toBe('');

      expect(isOnBoard).toBe(false);
    });

    test('un-placed destroyer', () => {
      const { destroyerPlacement } = gameBoard.shipPlacements;

      const { shipHead, occupyingLoc, orientation, isOnBoard } =
        destroyerPlacement;

      expect(shipHead).toHaveLength(0);

      expect(occupyingLoc).toHaveLength(0);

      expect(orientation).toBe('');

      expect(isOnBoard).toBe(false);
    });

    test('un-placed subMarine', () => {
      const { subMarinePlacement } = gameBoard.shipPlacements;

      const { shipHead, occupyingLoc, orientation, isOnBoard } =
        subMarinePlacement;

      expect(shipHead).toHaveLength(0);

      expect(occupyingLoc).toHaveLength(0);

      expect(orientation).toBe('');

      expect(isOnBoard).toBe(false);
    });

    test('un-placed patrolBoat', () => {
      const { patrolBoatPlacement } = gameBoard.shipPlacements;

      const { shipHead, occupyingLoc, orientation, isOnBoard } =
        patrolBoatPlacement;

      expect(shipHead).toHaveLength(0);

      expect(occupyingLoc).toHaveLength(0);

      expect(orientation).toBe('');

      expect(isOnBoard).toBe(false);
    });
  });
});

describe.skip('board setup', () => {
  const gameBoard = new GameBoard();

  describe('canBeCarrierShipHead', () => {
    test('method exists', () => {
      // gameBoard = new GameBoard();
      expect(gameBoard.canBeCarrierShipHead).toBeDefined();
    });

    test('method returns true if node can be head node for carrier', () => {
      function run(orientation) {
        const testCase = new Set();

        if (orientation === 'horizontal') {
          CarrierHorizontalPlacements.forEach((placement) => {
            const [x, y] = placement.split('-');

            testCase.add(
              gameBoard.canBeCarrierShipHead(Number(x), Number(y), orientation),
            );
          });
        }

        if (orientation === 'vertical') {
          CarrierVerticalPlacements.forEach((placement) => {
            const [x, y] = placement.split('-');

            testCase.add(
              gameBoard.canBeCarrierShipHead(Number(x), Number(y), orientation),
            );
          });
        }

        return [...testCase];
      }

      const horizontalPlace = run('horizontal');

      expect(horizontalPlace).toHaveLength(1);
      expect(horizontalPlace.includes(true)).toBe(true);

      const verticalPlace = run('vertical');

      expect(verticalPlace).toHaveLength(1);
      expect(verticalPlace.includes(true)).toBe(true);
    });

    test('method returns false for invalid coordinate and orientation', () => {
      expect(gameBoard.canBeCarrierShipHead(-2, 3, 'horizontal')).toBeFalsy();

      expect(gameBoard.canBeCarrierShipHead(2, 3, 'horzontal')).toBeFalsy();
    });
  });

  describe.skip('canBeBattleShipShipHead', () => {
    test('method exists', () => {
      // gameBoard = new GameBoard();
      expect(gameBoard.canBeBattleShipShipHead).toBeDefined();
    });

    test('method returns true if node can be head node for carrier', () => {
      function run(orientation) {
        const testCase = new Set();

        if (orientation === 'horizontal') {
          BattleShipHorizontalPlacements.forEach((placement) => {
            const [x, y] = placement.split('-');

            testCase.add(
              gameBoard.canBeBattleShipShipHead(
                Number(x),
                Number(y),
                orientation,
              ),
            );
          });
        }

        if (orientation === 'vertical') {
          BattleShipVerticalPlacements.forEach((placement) => {
            const [x, y] = placement.split('-');

            testCase.add(
              gameBoard.canBeBattleShipShipHead(
                Number(x),
                Number(y),
                orientation,
              ),
            );
          });
        }

        return [...testCase];
      }

      const horizontalPlace = run('horizontal');

      expect(horizontalPlace).toHaveLength(1);
      expect(horizontalPlace.includes(true)).toBe(true);

      const verticalPlace = run('vertical');

      expect(verticalPlace).toHaveLength(1);
      expect(verticalPlace.includes(true)).toBe(true);
    });

    test('method returns false for invalid coordinate and orientation', () => {
      expect(
        gameBoard.canBeBattleShipShipHead(-2, 3, 'horizontal'),
      ).toBeFalsy();

      expect(gameBoard.canBeBattleShipShipHead(2, 3, 'horzontal')).toBeFalsy();
    });
  });
});

describe('ship placing methods', () => {
  describe('carrier placing', () => {
    test('placeCarrier() allows ship to be re-placed', () => {
      const gameBoard = new GameBoard();

      function runCheck() {
        const check = new Set();

        CarrierHorizontalPlacements.forEach((placement) => {
          const [x, y] = placement.split('-');

          const placeStatus = gameBoard.placeCarrier(
            Number(x),
            Number(y),
            'horizontal',
          );

          check.add(placeStatus);
        });

        CarrierVerticalPlacements.forEach((placement) => {
          const [x, y] = placement.split('-');

          const placeStatus = gameBoard.placeCarrier(
            Number(x),
            Number(y),
            'vertical',
          );

          check.add(placeStatus);
        });

        return [...check];
      }

      const placeStatus = runCheck();

      expect(placeStatus).toHaveLength(1);
      expect(placeStatus.includes(true)).toBeTruthy();
    });

    test('placeCarrier() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeCarrier(0, 0);

      expect(gameBoard.placeCarrier(0, -2)).toBeFalsy();

      expect(gameBoard.shipPlacements.carrierPlacement.isOnBoard).toBeTruthy();
    });
  });

  describe('battleship placing', () => {
    test('placeBattleShip() allows ship to be re-placed', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeBattleShip(0, 0);

      expect(gameBoard.placeBattleShip(0, 2)).toBeTruthy();
    });

    test('placeBattleShip() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeBattleShip(0, 0);

      expect(gameBoard.placeBattleShip(0, -2)).toBeFalsy();

      expect(
        gameBoard.shipPlacements.battleShipPlacement.isOnBoard,
      ).toBeTruthy();
    });
  });

  describe('destroyer placing', () => {
    test('placeDestroyer() allows ship to be re-placed', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeDestroyer(0, 0);

      expect(gameBoard.placeDestroyer(0, 2)).toBeTruthy();
    });

    test('placeDestroyer() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeDestroyer(0, 0);

      expect(gameBoard.placeDestroyer(0, -2)).toBeFalsy();

      expect(
        gameBoard.shipPlacements.destroyerPlacement.isOnBoard,
      ).toBeTruthy();
    });
  });

  describe('submarine placing', () => {
    test('placeSubMarine() allows ship to be re-placed', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeSubMarine(0, 0);

      expect(gameBoard.placeSubMarine(0, 2)).toBeTruthy();
    });

    test('placeSubMarine() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
      const gameBoard = new GameBoard();

      gameBoard.placeSubMarine(0, 0);

      expect(gameBoard.placeSubMarine(0, -2)).toBeFalsy();

      expect(
        gameBoard.shipPlacements.subMarinePlacement.isOnBoard,
      ).toBeTruthy();
    });
  });
  describe('patrol boat placing', () => {
    test('placePatrolBoat() allows ship to be re-placed', () => {
      const gameBoard = new GameBoard();

      gameBoard.placePatrolBoat(0, 0);

      expect(gameBoard.placePatrolBoat(0, 2)).toBeTruthy();
    });

    test('placePatrolBoat() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
      const gameBoard = new GameBoard();

      gameBoard.placePatrolBoat(0, 0);

      expect(gameBoard.placePatrolBoat(0, -2)).toBeFalsy();

      expect(
        gameBoard.shipPlacements.patrolBoatPlacement.isOnBoard,
      ).toBeTruthy();
    });
  });
});
