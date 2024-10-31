import Player from '../src/player.js';
import GameBoard from '../src/game-board.js';

describe('Player Class', () => {
  let player;

  beforeEach(() => {
    player = new Player('Player1');
  });

  test('should throw error if name is invalid', () => {
    expect(() => new Player('')).toThrow(
      'Invalid name: expect non-empty string as player name',
    );
    expect(() => new Player(123)).toThrow(
      'Invalid name: expect non-empty string as player name',
    );
  });

  test('should initialize player with a GameBoard', () => {
    expect(player.boardCopy).toBeInstanceOf(GameBoard);
  });

  test('should return valid moves from the game board', () => {
    const { validMoves } = player;
    expect(validMoves.length).toBe(100); // Assuming 10x10 board with no hits initially
  });

  describe('Ship Placement and Removal', () => {
    test('should place and remove a carrier', () => {
      player.placeCarrier(0, 0, 'horizontal');
      expect(player.carrierInfo.isOnBoard).toBe(true);

      player.removeCarrier();
      expect(player.carrierInfo.isOnBoard).toBe(false);
    });

    test('should place and remove a battleship', () => {
      player.placeBattleShip(1, 1, 'vertical');
      expect(player.battleShipInfo.isOnBoard).toBe(true);

      player.removeBattleShip();
      expect(player.battleShipInfo.isOnBoard).toBe(false);
    });

    test('should place and remove a destroyer', () => {
      player.placeDestroyer(1, 1, 'vertical');
      expect(player.destroyerInfo.isOnBoard).toBe(true);

      player.removeDestroyer();
      expect(player.destroyerInfo.isOnBoard).toBe(false);
    });

    test('should place and remove a submarine', () => {
      player.placeSubmarine(1, 1, 'vertical');
      expect(player.submarineInfo.isOnBoard).toBe(true);

      player.removeSubmarine();
      expect(player.submarineInfo.isOnBoard).toBe(false);
    });

    test('should place and remove a patrol boat', () => {
      player.placePatrolBoat(1, 1, 'vertical');
      expect(player.patrolBoatInfo.isOnBoard).toBe(true);

      player.removePatrolBoat();
      expect(player.patrolBoatInfo.isOnBoard).toBe(false);
    });
  });

  describe('Auto Placement and All Ships Sunk Check', () => {
    test('should automatically place all ships', () => {
      player.autoPlaceAllShips();
      expect(player.carrierInfo.isOnBoard).toBe(true);
      expect(player.battleShipInfo.isOnBoard).toBe(true);
      expect(player.destroyerInfo.isOnBoard).toBe(true);
      expect(player.submarineInfo.isOnBoard).toBe(true);
      expect(player.patrolBoatInfo.isOnBoard).toBe(true);
    });

    test('should correctly report all ships sunk status', () => {
      player.autoPlaceAllShips();

      // Simulate all ships being sunk
      function getPosition(shipInfo) {
        const { orientation, size, placeHead } = shipInfo;
        const [x, y] = placeHead;

        const position = GameBoard.getToBeOccupied(size, x, y, orientation);
        return position;
      }

      function attackPosition(positions) {
        positions.forEach((position) => {
          const [x, y] = position;
          player.receiveAttack(x, y);
        });
      }

      const carrierPosition = getPosition(player.carrierInfo);
      attackPosition(carrierPosition);

      const battleshipPosition = getPosition(player.battleShipInfo);
      attackPosition(battleshipPosition);

      const destroyerPosition = getPosition(player.destroyerInfo);
      attackPosition(destroyerPosition);

      const submarinePosition = getPosition(player.submarineInfo);
      attackPosition(submarinePosition);

      const patrolBoatPosition = getPosition(player.patrolBoatInfo);
      attackPosition(patrolBoatPosition);

      expect(player.allShipSunk()).toBe(true);
    });
  });
});
