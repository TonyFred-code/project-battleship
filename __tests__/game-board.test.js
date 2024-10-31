import Node from '../src/board-node.js';
import GameBoard from '../src/game-board.js';
import GAME_SETTINGS from '../src/GAME_SETTINGS/game-settings.js';
import getRndElement from '../src/helper_module/rnd-array-element.js';
import Ship from '../src/ship.js';

jest.mock('../src/helper_module/rnd-array-element.js'); // Mocking the random function

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_AREA, BOARD_X_SIZE, BOARD_Y_SIZE } = BOARD_SPECS;

describe('GameBoard class', () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = new GameBoard();
    getRndElement.mockClear(); // Clearing previous mocks
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('boardNodes', () => {
    test('should return array of nodes', () => {
      const { boardNodes } = gameBoard;
      expect(boardNodes).toHaveLength(BOARD_AREA);
      boardNodes.forEach((boardNode) => {
        expect(boardNode).toBeInstanceOf(Node);
      });
    });
  });

  describe('formatShipInfo', () => {
    test('should correctly format valid Ship instances', () => {
      // Mock Ship object with shipInfo and assignedPlaceOrigin
      const mockShip = {
        shipInfo: {
          hasPlaceOrigin: true,
          orientation: 'horizontal',
          size: 4,
          name: 'Destroyer',
        },
        assignedPlaceOrigin: { x: 2, y: 3 },
      };

      // Mock Ship class inheritance
      Object.setPrototypeOf(mockShip, Ship.prototype);

      // Expected output
      const expectedShipInfo = {
        isOnBoard: true,
        orientation: 'horizontal',
        placeHead: [2, 3],
        size: 4,
        name: 'Destroyer',
      };

      // Test the formatShipInfo method
      const result = GameBoard.formatShipInfo(mockShip);

      expect(result).toEqual(expectedShipInfo);
    });

    test('should return null when passed a non-Ship object', () => {
      const invalidShip = {
        shipInfo: {
          hasPlaceOrigin: true,
          orientation: 'vertical',
          size: 5,
          name: 'Carrier',
        },
        assignedPlaceOrigin: { x: 0, y: 0 },
      };

      // Test with an invalid Ship (not an instance of Ship class)
      const result = GameBoard.formatShipInfo(invalidShip);

      expect(result).toBeNull();
    });

    test('should return null if passed undefined or null', () => {
      expect(GameBoard.formatShipInfo(null)).toBeNull();
      expect(GameBoard.formatShipInfo(undefined)).toBeNull();
    });
  });

  describe('isValidBoardCoordinate', () => {
    test.each([
      {
        case: 'return false if given negative x-coordinate',
        result: false,
        x: -1,
        y: 0,
      },

      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: BOARD_X_SIZE,
        y: 0,
      },

      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: BOARD_X_SIZE + 1,
        y: 0,
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
      },

      {
        case: 'return false if given x-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: BOARD_Y_SIZE,
      },

      {
        case: 'return false if given x-coordinate greater than board y-size',
        result: false,
        x: 1,
        y: BOARD_Y_SIZE + 1,
      },

      {
        case: 'return true if given valid x-coordinate and y-coordinate',
        result: true,
        x: 1,
        y: 0,
      },
    ])('should $case', ({ result, x, y }) => {
      expect(GameBoard.isValidBoardCoordinate(x, y)).toBe(result);
    });
  });

  describe('canReceiveShipNodeLoc', () => {
    test('should return correct array length if no ship placed', () => {
      const { canReceiveShipNodeLoc } = gameBoard;

      expect(canReceiveShipNodeLoc.length).toBe(100);
    });

    test('should return correct array length when carrier is placed', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');
      const { canReceiveShipNodeLoc } = gameBoard;

      expect(canReceiveShipNodeLoc.length).toBe(100 - 12);
    });

    test('should return correct array length when carrier is placed - 2', () => {
      gameBoard.placeCarrier(1, 1, 'horizontal');
      const { canReceiveShipNodeLoc } = gameBoard;

      expect(canReceiveShipNodeLoc.length).toBe(100 - 21);
    });
  });

  describe('getToBeOccupied', () => {
    test('should return correct node coordinates for vertical orientation', () => {
      const size = 3;
      const x = 2;
      const y = 2;
      const orientation = 'vertical';

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      expect(result).toEqual([
        [2, 2],
        [2, 3],
        [2, 4],
      ]);
    });

    test('should return correct node coordinates for horizontal orientation', () => {
      const size = 3;
      const x = 2;
      const y = 2;
      const orientation = 'horizontal';

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      expect(result).toEqual([
        [2, 2],
        [3, 2],
        [4, 2],
      ]);
    });

    test('should return an empty array for invalid orientation', () => {
      const size = 3;
      const x = 2;
      const y = 2;
      const orientation = 'diagonal'; // invalid orientation

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      expect(result).toEqual([]);
    });

    test('should return an empty array for invalid coordinates', () => {
      jest.spyOn(GameBoard, 'isValidBoardCoordinate').mockReturnValue(false); // mock invalid coordinates

      const size = 3;
      const x = -1; // invalid coordinate
      const y = 2;
      const orientation = 'horizontal';

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      expect(result).toEqual([]);
    });

    test('should handle ships larger than available space', () => {
      const size = 5;
      const x = 2;
      const y = 8;
      const orientation = 'vertical';

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      // Only valid coordinates should be included
      expect(result).toEqual([
        [2, 8],
        [2, 9],
      ]);
    });

    test('should handle ships that go out of bounds in horizontal orientation', () => {
      const size = 4;
      const x = 8;
      const y = 2;
      const orientation = 'horizontal';

      const result = GameBoard.getToBeOccupied(size, x, y, orientation);

      expect(result).toEqual([
        [8, 2],
        [9, 2],
      ]);
    });
  });

  describe('getNeighboringLoc', () => {
    // todo: write test for this method
  });

  // CARRIER TEST SUITES
  describe('placeCarrier', () => {
    test.each([
      {
        result: false,
        case: 'return false if given invalid orientation',
        x: 0,
        y: 0,
        orientation: 'invalid',
      },
      {
        result: false,
        case: 'return false if given negative x-coordinate',
        x: -1,
        y: 0,
        orientation: 'horizontal',
      },
      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
        orientation: 'vertical',
      },
      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: 11,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: 10,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
        orientation: 'vertical',
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
        orientation: 'vertical',
      },
      {
        case: 'return false if given y-coordinate greater than board y-size',
        result: false,
        x: 0,
        y: 11,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: 10,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate will place carrier off board',
        result: false,
        x: 6,
        y: 0,
        orientation: 'horizontal',
      },

      {
        case: 'return false if given x-coordinate will place carrier off board',
        result: false,
        x: 0,
        y: 6,
        orientation: 'vertical',
      },
    ])(
      'should $case. and refuse to place ship',
      ({ result, x, y, orientation }) => {
        expect(gameBoard.placeCarrier(x, y, orientation)).toBe(result);

        const { carrierInfo } = gameBoard;

        expect(carrierInfo).toHaveProperty('isOnBoard', false);
        expect(carrierInfo).toHaveProperty('placeHead', [null, null]);
        expect(carrierInfo).toHaveProperty('orientation', '');
      },
    );

    test.each([
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and horizontal orientation',
        x: 0,
        y: 0,
        orientation: 'horizontal',
      },
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and vertical orientation',
        x: 0,
        y: 0,
        orientation: 'vertical',
      },
    ])('should $case. And also place ship', ({ x, y, orientation, result }) => {
      expect(gameBoard.placeCarrier(x, y, orientation)).toBe(result);

      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', true);
      expect(carrierInfo).toHaveProperty('placeHead', [0, 0]);
      expect(carrierInfo).toHaveProperty('orientation');

      const resultOrientation = carrierInfo.orientation;
      expect(resultOrientation).toMatch(/^(horizontal|vertical)$/i);
    });

    test('should allow placing carrier when carrier is placed without removing it first', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');

      expect(gameBoard.placeCarrier(0, 1, 'horizontal')).toBe(true);
    });

    test('should allow placing carrier after removing carrier from board', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');
      gameBoard.removeCarrier();

      expect(gameBoard.placeCarrier(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeCarrier', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should remove carrier from board', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');

      gameBoard.removeCarrier();

      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', false);
      expect(carrierInfo).toHaveProperty('placeHead', [null, null]);
      expect(carrierInfo).toHaveProperty('orientation', '');

      expect(gameBoard.placeCarrier(0, 0, 'horizontal')).toBe(true);
    });

    test('should work fine if carrier is not on board', () => {
      gameBoard.removeCarrier();

      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', false);
      expect(carrierInfo).toHaveProperty('placeHead', [null, null]);
      expect(carrierInfo).toHaveProperty('orientation', '');
    });

    test('should not remove carrier if board receives a hit', () => {
      gameBoard.autoPlaceAllShips();
      gameBoard.receiveAttack(0, 0);

      gameBoard.removeCarrier();

      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', true);
    });
  });

  describe('carrierInfo', () => {
    test('should return specifications regarding carrier', () => {
      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', false);
      expect(carrierInfo).toHaveProperty('orientation', '');
      expect(carrierInfo).toHaveProperty('placeHead', [null, null]);
      expect(carrierInfo).toHaveProperty('size', 5);
      expect(carrierInfo).toHaveProperty('name');
      expect(carrierInfo).toHaveProperty('isSunk', false);

      const { name } = carrierInfo;

      expect(name).toMatch(/carrier/i);
    });

    test('should reflect changes to carrier', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');

      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', true);
      expect(carrierInfo).toHaveProperty('orientation');
      expect(carrierInfo).toHaveProperty('placeHead', [0, 0]);

      const { orientation } = carrierInfo;

      expect(orientation).toMatch(/horizontal/i);
    });
  });

  describe('autoPlaceCarrier', () => {
    test('should auto place carrier on an empty board', () => {
      const mockElement = {
        element: { loc: [0, 0], orientation: 'horizontal' },
      };

      // Mock the random selection of a valid node
      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceCarrier();

      // Assert that the carrier has been placed
      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.carrierInfo;

      expect(placeHead).toEqual([0, 0]);
      expect(orientation).toMatch(/horizontal/i);
    });

    test('should auto place carrier with vertical orientation if selected', () => {
      const mockElement = {
        element: { loc: [3, 3], orientation: 'vertical' },
      };

      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceCarrier();

      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.carrierInfo;

      expect(placeHead).toEqual([3, 3]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place carrier after it is removed', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceCarrier();

      // Remove carrier
      gameBoard.removeCarrier();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceCarrier();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.carrierInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place carrier if it is still on board', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceCarrier();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceCarrier();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.carrierInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });
  });

  // BATTLESHIP TEST SUITES
  describe('placeBattleShip', () => {
    test.each([
      {
        result: false,
        case: 'return false if given invalid orientation',
        x: 0,
        y: 0,
        orientation: 'invalid',
      },
      {
        result: false,
        case: 'return false if given negative x-coordinate',
        x: -1,
        y: 0,
        orientation: 'horizontal',
      },
      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
        orientation: 'vertical',
      },
      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: 11,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: 10,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
        orientation: 'vertical',
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
        orientation: 'vertical',
      },
      {
        case: 'return false if given y-coordinate greater than board y-size',
        result: false,
        x: 0,
        y: 11,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: 10,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate will place carrier off board',
        result: false,
        x: 7,
        y: 0,
        orientation: 'horizontal',
      },

      {
        case: 'return false if given x-coordinate will place carrier off board',
        result: false,
        x: 0,
        y: 7,
        orientation: 'vertical',
      },
    ])(
      'should $case. and refuse to place ship',
      ({ result, x, y, orientation }) => {
        expect(gameBoard.placeBattleShip(x, y, orientation)).toBe(result);

        const { battleShipInfo } = gameBoard;

        expect(battleShipInfo).toHaveProperty('isOnBoard', false);
        expect(battleShipInfo).toHaveProperty('placeHead', [null, null]);
        expect(battleShipInfo).toHaveProperty('orientation', '');
      },
    );

    test.each([
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and horizontal orientation',
        x: 0,
        y: 0,
        orientation: 'horizontal',
      },
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and vertical orientation',
        x: 0,
        y: 0,
        orientation: 'vertical',
      },
    ])('should $case. And also place ship', ({ x, y, orientation, result }) => {
      expect(gameBoard.placeBattleShip(x, y, orientation)).toBe(result);

      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', true);
      expect(battleShipInfo).toHaveProperty('placeHead', [0, 0]);
      expect(battleShipInfo).toHaveProperty('orientation');

      const resultOrientation = battleShipInfo.orientation;
      expect(resultOrientation).toMatch(/^(horizontal|vertical)$/i);
    });

    test('should allow placing battleship when battleship is placed without removing it first', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');

      expect(gameBoard.placeBattleShip(0, 1, 'horizontal')).toBe(true);
    });

    test('should allow placing carrier after removing carrier from board', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');
      gameBoard.removeBattleShip();

      expect(gameBoard.placeBattleShip(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeBattleShip', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should remove battleship from board', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');

      gameBoard.removeBattleShip();

      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', false);
      expect(battleShipInfo).toHaveProperty('placeHead', [null, null]);
      expect(battleShipInfo).toHaveProperty('orientation', '');

      expect(gameBoard.placeBattleShip(0, 0, 'horizontal')).toBe(true);
    });

    test('should work fine if battleship is not on board', () => {
      gameBoard.removeBattleShip();

      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', false);
      expect(battleShipInfo).toHaveProperty('placeHead', [null, null]);
      expect(battleShipInfo).toHaveProperty('orientation', '');
    });

    test('should not remove battleship if board has taken a hit', () => {
      gameBoard.autoPlaceAllShips();
      gameBoard.receiveAttack(0, 0);

      gameBoard.removeBattleShip();

      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', true);
    });
  });

  describe('battleShipInfo', () => {
    test('should return specifications regarding battleship', () => {
      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', false);
      expect(battleShipInfo).toHaveProperty('isSunk', false);
      expect(battleShipInfo).toHaveProperty('orientation', '');
      expect(battleShipInfo).toHaveProperty('placeHead', [null, null]);
      expect(battleShipInfo).toHaveProperty('size', 4);
      expect(battleShipInfo).toHaveProperty('name');

      const { name } = battleShipInfo;

      expect(name).toMatch(/battleship/i);
    });

    test('should reflect changes to battleship', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');

      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', true);
      expect(battleShipInfo).toHaveProperty('orientation');
      expect(battleShipInfo).toHaveProperty('placeHead', [0, 0]);

      const { orientation } = battleShipInfo;

      expect(orientation).toMatch(/horizontal/i);
    });
  });

  describe('autoPlaceBattleShip', () => {
    test('should auto place battleship on an empty board', () => {
      const mockElement = {
        element: { loc: [0, 0], orientation: 'horizontal' },
      };

      // Mock the random selection of a valid node
      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceBattleShip();

      // Assert that the carrier has been placed
      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.battleShipInfo;

      expect(placeHead).toEqual([0, 0]);
      expect(orientation).toMatch(/horizontal/i);
    });

    test('should auto place battleship with vertical orientation if selected', () => {
      const mockElement = {
        element: { loc: [3, 3], orientation: 'vertical' },
      };

      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceBattleShip();

      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.battleShipInfo;

      expect(placeHead).toEqual([3, 3]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place battleship after it is removed', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceBattleShip();

      // Remove battleship
      gameBoard.removeBattleShip();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceBattleShip();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.battleShipInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place battleship if it is still on board', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceBattleShip();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceBattleShip();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.battleShipInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });
  });

  // DESTROYER TEST SUITES
  describe('placeDestroyer', () => {
    test.each([
      {
        result: false,
        case: 'return false if given invalid orientation',
        x: 0,
        y: 0,
        orientation: 'invalid',
      },
      {
        result: false,
        case: 'return false if given negative x-coordinate',
        x: -1,
        y: 0,
        orientation: 'horizontal',
      },
      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
        orientation: 'vertical',
      },
      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: 11,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: 10,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
        orientation: 'vertical',
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
        orientation: 'vertical',
      },
      {
        case: 'return false if given y-coordinate greater than board y-size',
        result: false,
        x: 0,
        y: 11,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: 10,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate will place destroyer off board',
        result: false,
        x: 8,
        y: 0,
        orientation: 'horizontal',
      },

      {
        case: 'return false if given x-coordinate will place destroyer off board',
        result: false,
        x: 0,
        y: 8,
        orientation: 'vertical',
      },
    ])(
      'should $case. and refuse to place ship',
      ({ result, x, y, orientation }) => {
        expect(gameBoard.placeDestroyer(x, y, orientation)).toBe(result);

        const { destroyerInfo } = gameBoard;

        expect(destroyerInfo).toHaveProperty('isOnBoard', false);
        expect(destroyerInfo).toHaveProperty('placeHead', [null, null]);
        expect(destroyerInfo).toHaveProperty('orientation', '');
      },
    );

    test.each([
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and horizontal orientation',
        x: 0,
        y: 0,
        orientation: 'horizontal',
      },
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and vertical orientation',
        x: 0,
        y: 0,
        orientation: 'vertical',
      },
    ])('should $case. And also place ship', ({ x, y, orientation, result }) => {
      expect(gameBoard.placeDestroyer(x, y, orientation)).toBe(result);

      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', true);
      expect(destroyerInfo).toHaveProperty('placeHead', [0, 0]);
      expect(destroyerInfo).toHaveProperty('orientation');

      const resultOrientation = destroyerInfo.orientation;
      expect(resultOrientation).toMatch(/^(horizontal|vertical)$/i);
    });

    test('should allow placing destroyer when destroyer is placed without removing it first', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');

      expect(gameBoard.placeDestroyer(0, 1, 'horizontal')).toBe(true);
    });

    test('should allow placing destroyer after removing destroyer from board', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');
      gameBoard.removeDestroyer();

      expect(gameBoard.placeDestroyer(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeDestroyer', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should remove destroyer from board', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');

      gameBoard.removeDestroyer();

      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', false);
      expect(destroyerInfo).toHaveProperty('placeHead', [null, null]);
      expect(destroyerInfo).toHaveProperty('orientation', '');

      expect(gameBoard.placeDestroyer(0, 0, 'horizontal')).toBe(true);
    });

    test('should work fine if battleship is not on board', () => {
      gameBoard.removeDestroyer();

      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', false);
      expect(destroyerInfo).toHaveProperty('placeHead', [null, null]);
      expect(destroyerInfo).toHaveProperty('orientation', '');
    });

    test('should not remove destroyer if board has taken hit', () => {
      gameBoard.autoPlaceAllShips();
      gameBoard.receiveAttack(0, 0);

      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', true);
    });
  });

  describe('destroyerInfo', () => {
    test('should return specifications regarding destroyer', () => {
      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', false);
      expect(destroyerInfo).toHaveProperty('orientation', '');
      expect(destroyerInfo).toHaveProperty('placeHead', [null, null]);
      expect(destroyerInfo).toHaveProperty('size', 3);
      expect(destroyerInfo).toHaveProperty('name');
      expect(destroyerInfo).toHaveProperty('isSunk', false);

      const { name } = destroyerInfo;

      expect(name).toMatch(/destroyer/i);
    });

    test('should reflect changes to destroyer', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');

      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', true);
      expect(destroyerInfo).toHaveProperty('orientation');
      expect(destroyerInfo).toHaveProperty('placeHead', [0, 0]);

      const { orientation } = destroyerInfo;

      expect(orientation).toMatch(/horizontal/i);
    });
  });

  describe('autoPlaceDestroyer', () => {
    test('should auto place destroyer on an empty board', () => {
      const mockElement = {
        element: { loc: [0, 0], orientation: 'horizontal' },
      };

      // Mock the random selection of a valid node
      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceDestroyer();

      // Assert that the destroyer has been placed
      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.destroyerInfo;

      expect(placeHead).toEqual([0, 0]);
      expect(orientation).toMatch(/horizontal/i);
    });

    test('should auto place destroyer with vertical orientation if selected', () => {
      const mockElement = {
        element: { loc: [3, 3], orientation: 'vertical' },
      };

      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceDestroyer();

      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.destroyerInfo;

      expect(placeHead).toEqual([3, 3]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place destroyer after it is removed', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceDestroyer();

      // Remove destroyer
      gameBoard.removeDestroyer();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceDestroyer();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.destroyerInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place destroyer when it is on board', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceDestroyer();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceDestroyer();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.destroyerInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });
  });

  // PATROL BOAT TEST SUITES
  describe('placePatrolBoat', () => {
    test.each([
      {
        result: false,
        case: 'return false if given invalid orientation',
        x: 0,
        y: 0,
        orientation: 'invalid',
      },
      {
        result: false,
        case: 'return false if given negative x-coordinate',
        x: -1,
        y: 0,
        orientation: 'horizontal',
      },
      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
        orientation: 'vertical',
      },
      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: 11,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: 10,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
        orientation: 'vertical',
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
        orientation: 'vertical',
      },
      {
        case: 'return false if given y-coordinate greater than board y-size',
        result: false,
        x: 0,
        y: 11,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: 10,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate will place carrier off board',
        result: false,
        x: 9,
        y: 0,
        orientation: 'horizontal',
      },

      {
        case: 'return false if given x-coordinate will place carrier off board',
        result: false,
        x: 0,
        y: 9,
        orientation: 'vertical',
      },
    ])(
      'should $case. and refuse to place ship',
      ({ result, x, y, orientation }) => {
        expect(gameBoard.placePatrolBoat(x, y, orientation)).toBe(result);

        const { patrolBoatInfo } = gameBoard;

        expect(patrolBoatInfo).toHaveProperty('isOnBoard', false);
        expect(patrolBoatInfo).toHaveProperty('placeHead', [null, null]);
        expect(patrolBoatInfo).toHaveProperty('orientation', '');
      },
    );

    test.each([
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and horizontal orientation',
        x: 0,
        y: 0,
        orientation: 'horizontal',
      },
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and vertical orientation',
        x: 0,
        y: 0,
        orientation: 'vertical',
      },
    ])('should $case. And also place ship', ({ x, y, orientation, result }) => {
      expect(gameBoard.placePatrolBoat(x, y, orientation)).toBe(result);

      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', true);
      expect(patrolBoatInfo).toHaveProperty('placeHead', [0, 0]);
      expect(patrolBoatInfo).toHaveProperty('orientation');

      const resultOrientation = patrolBoatInfo.orientation;
      expect(resultOrientation).toMatch(/^(horizontal|vertical)$/i);
    });

    test('should allow placing patrol boat when patrol boat is placed without removing it first', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');

      expect(gameBoard.placePatrolBoat(0, 1, 'horizontal')).toBe(true);
    });

    test('should allow placing patrol boat after removing patrol boat from board', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');
      gameBoard.removePatrolBoat();

      expect(gameBoard.placePatrolBoat(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removePatrolBoat', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should remove patrol boat from board', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');

      gameBoard.removePatrolBoat();

      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', false);
      expect(patrolBoatInfo).toHaveProperty('placeHead', [null, null]);
      expect(patrolBoatInfo).toHaveProperty('orientation', '');

      expect(gameBoard.placePatrolBoat(0, 0, 'horizontal')).toBe(true);
    });

    test('should work fine if battleship is not on board', () => {
      gameBoard.removePatrolBoat();

      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', false);
      expect(patrolBoatInfo).toHaveProperty('placeHead', [null, null]);
      expect(patrolBoatInfo).toHaveProperty('orientation', '');
    });

    test('should not remove patrol boat if board has taken a hit', () => {
      gameBoard.autoPlaceAllShips();
      gameBoard.receiveAttack(0, 0);

      gameBoard.removePatrolBoat();

      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', true);
    });
  });

  describe('patrolBoatInfo', () => {
    test('should return specifications regarding patrol boat', () => {
      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', false);
      expect(patrolBoatInfo).toHaveProperty('orientation', '');
      expect(patrolBoatInfo).toHaveProperty('placeHead', [null, null]);
      expect(patrolBoatInfo).toHaveProperty('size', 2);
      expect(patrolBoatInfo).toHaveProperty('name');
      expect(patrolBoatInfo).toHaveProperty('isSunk', false);

      const { name } = patrolBoatInfo;

      expect(name).toMatch(/patrol_boat/i);
    });

    test('should reflect changes to patrol boat', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');

      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', true);
      expect(patrolBoatInfo).toHaveProperty('orientation');
      expect(patrolBoatInfo).toHaveProperty('placeHead', [0, 0]);

      const { orientation } = patrolBoatInfo;

      expect(orientation).toMatch(/horizontal/i);
    });
  });

  describe('autoPlacePatrolBoat', () => {
    test('should auto place patrol boat on an empty board', () => {
      const mockElement = {
        element: { loc: [0, 0], orientation: 'horizontal' },
      };

      // Mock the random selection of a valid node
      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlacePatrolBoat();

      // Assert that the carrier has been placed
      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.patrolBoatInfo;

      expect(placeHead).toEqual([0, 0]);
      expect(orientation).toMatch(/horizontal/i);
    });

    test('should auto place patrol boat with vertical orientation if selected', () => {
      const mockElement = {
        element: { loc: [3, 3], orientation: 'vertical' },
      };

      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlacePatrolBoat();

      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.patrolBoatInfo;

      expect(placeHead).toEqual([3, 3]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place patrol boat after it is removed', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlacePatrolBoat();

      // Remove carrier
      gameBoard.removePatrolBoat();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlacePatrolBoat();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.patrolBoatInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place patrol boat when it is on board', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlacePatrolBoat();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlacePatrolBoat();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.patrolBoatInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });
  });

  // SUBMARINE TEST SUITES
  describe('placeSubmarine', () => {
    test.each([
      {
        result: false,
        case: 'return false if given invalid orientation',
        x: 0,
        y: 0,
        orientation: 'invalid',
      },
      {
        result: false,
        case: 'return false if given negative x-coordinate',
        x: -1,
        y: 0,
        orientation: 'horizontal',
      },
      {
        case: 'return false if given non-numeric x-coordinate',
        result: false,
        x: '1',
        y: 0,
        orientation: 'vertical',
      },
      {
        case: 'return false if given x-coordinate greater than board x-size',
        result: false,
        x: 11,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given x-coordinate equal to board x-size',
        result: false,
        x: 10,
        y: 0,
        orientation: 'vertical',
      },

      {
        case: 'return false if given negative y-coordinate',
        result: false,
        x: 0,
        y: -1,
        orientation: 'vertical',
      },

      {
        case: 'return false if given non-numeric y-coordinate',
        result: false,
        x: 0,
        y: '0',
        orientation: 'vertical',
      },
      {
        case: 'return false if given y-coordinate greater than board y-size',
        result: false,
        x: 0,
        y: 11,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate equal to board y-size',
        result: false,
        x: 0,
        y: 10,
        orientation: 'vertical',
      },

      {
        case: 'return false if given y-coordinate will place carrier off board',
        result: false,
        x: 8,
        y: 0,
        orientation: 'horizontal',
      },

      {
        case: 'return false if given x-coordinate will place carrier off board',
        result: false,
        x: 0,
        y: 8,
        orientation: 'vertical',
      },
    ])(
      'should $case. and refuse to place ship',
      ({ result, x, y, orientation }) => {
        expect(gameBoard.placeSubmarine(x, y, orientation)).toBe(result);

        const { submarineInfo } = gameBoard;

        expect(submarineInfo).toHaveProperty('isOnBoard', false);
        expect(submarineInfo).toHaveProperty('placeHead', [null, null]);
        expect(submarineInfo).toHaveProperty('orientation', '');
      },
    );

    test.each([
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and horizontal orientation',
        x: 0,
        y: 0,
        orientation: 'horizontal',
      },
      {
        result: true,
        case: 'return true if given valid x-coordinate and y-coordinate and vertical orientation',
        x: 0,
        y: 0,
        orientation: 'vertical',
      },
    ])('should $case. And also place ship', ({ x, y, orientation, result }) => {
      expect(gameBoard.placeSubmarine(x, y, orientation)).toBe(result);

      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', true);
      expect(submarineInfo).toHaveProperty('placeHead', [0, 0]);
      expect(submarineInfo).toHaveProperty('orientation');

      const resultOrientation = submarineInfo.orientation;
      expect(resultOrientation).toMatch(/^(horizontal|vertical)$/i);
    });

    test('should allow placing submarine when submarine is placed without removing it first', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');

      expect(gameBoard.placeSubmarine(0, 1, 'horizontal')).toBe(true);
    });

    test('should allow placing submarine after removing submarine from board', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');
      gameBoard.removeSubmarine();

      expect(gameBoard.placeSubmarine(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeSubmarine', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should remove battleship from board', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');

      gameBoard.removeSubmarine();

      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', false);
      expect(submarineInfo).toHaveProperty('placeHead', [null, null]);
      expect(submarineInfo).toHaveProperty('orientation', '');

      expect(gameBoard.placeSubmarine(0, 0, 'horizontal')).toBe(true);
    });

    test('should work fine if battleship is not on board', () => {
      gameBoard.removeSubmarine();

      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', false);
      expect(submarineInfo).toHaveProperty('placeHead', [null, null]);
      expect(submarineInfo).toHaveProperty('orientation', '');
    });

    test('should not remove submarine if board has taken a hit', () => {
      gameBoard.autoPlaceAllShips();
      gameBoard.receiveAttack(0, 0);

      gameBoard.removeSubmarine();

      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', true);
    });
  });

  describe('submarineInfo', () => {
    test('should return specifications regarding submarine', () => {
      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', false);
      expect(submarineInfo).toHaveProperty('orientation', '');
      expect(submarineInfo).toHaveProperty('placeHead', [null, null]);
      expect(submarineInfo).toHaveProperty('size', 3);
      expect(submarineInfo).toHaveProperty('name');
      expect(submarineInfo).toHaveProperty('isSunk', false);

      const { name } = submarineInfo;

      expect(name).toMatch(/submarine/i);
    });

    test('should reflect changes to submarine', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');

      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', true);
      expect(submarineInfo).toHaveProperty('orientation');
      expect(submarineInfo).toHaveProperty('placeHead', [0, 0]);

      const { orientation } = submarineInfo;

      expect(orientation).toMatch(/horizontal/i);
    });
  });

  describe('autoPlaceSubmarine', () => {
    test('should auto place battleship on an empty board', () => {
      const mockElement = {
        element: { loc: [0, 0], orientation: 'horizontal' },
      };

      // Mock the random selection of a valid node
      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceSubmarine();

      // Assert that the carrier has been placed
      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.submarineInfo;

      expect(placeHead).toEqual([0, 0]);
      expect(orientation).toMatch(/horizontal/i);
    });

    test('should auto place submarine with vertical orientation if selected', () => {
      const mockElement = {
        element: { loc: [3, 3], orientation: 'vertical' },
      };

      getRndElement.mockReturnValue(mockElement);

      const placed = gameBoard.autoPlaceSubmarine();

      expect(placed).toBe(true);
      const { placeHead, orientation } = gameBoard.submarineInfo;

      expect(placeHead).toEqual([3, 3]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place submarine after it is removed', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceSubmarine();

      // Remove carrier
      gameBoard.removeSubmarine();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceSubmarine();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.submarineInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });

    test('should re-place submarine if it is on board', () => {
      // Place it once
      const mockElement1 = {
        element: { loc: [2, 2], orientation: 'horizontal' },
      };
      getRndElement.mockReturnValue(mockElement1);
      gameBoard.autoPlaceSubmarine();

      // Place it again in a different position
      const mockElement2 = {
        element: { loc: [4, 4], orientation: 'vertical' },
      };
      getRndElement.mockReturnValue(mockElement2);
      const rePlaced = gameBoard.autoPlaceSubmarine();

      expect(rePlaced).toBe(true);
      const { placeHead, orientation } = gameBoard.submarineInfo;

      expect(placeHead).toEqual([4, 4]);
      expect(orientation).toMatch(/vertical/i);
    });
  });

  describe('autoPlaceAllShips', () => {
    test('should auto place all ships on the board using the actual getRndElement', () => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);

      gameBoard.autoPlaceAllShips();

      expect(
        gameBoard.carrierInfo.isOnBoard &&
          gameBoard.battleShipInfo.isOnBoard &&
          gameBoard.destroyerInfo.isOnBoard &&
          gameBoard.submarineInfo.isOnBoard &&
          gameBoard.patrolBoatInfo.isOnBoard,
      ).toBe(true);
    });
  });

  describe('receiveAttack', () => {
    beforeEach(() => {
      // Use the real getRndElement function for this test
      const actualGetRndElement = jest.requireActual(
        '../src/helper_module/rnd-array-element.js',
      ).default;

      // Temporarily use the actual implementation for this test
      getRndElement.mockImplementation(actualGetRndElement);
    });

    test('should return -1 when coordinates are invalid', () => {
      gameBoard.autoPlaceAllShips();

      expect(gameBoard.receiveAttack(-1, 5)).toBe(-1);
      expect(gameBoard.receiveAttack(10, 10)).toBe(-1); // Assume 10 is out of bounds
    });

    test('should return -1 when not all ships are placed', () => {
      expect(gameBoard.receiveAttack(3, 4)).toBe(-1);
    });

    test('should not allow multiple hits on the same node', () => {
      gameBoard.autoPlaceAllShips();

      gameBoard.receiveAttack(3, 4);
      expect(gameBoard.receiveAttack(3, 4)).toBe(-1); // Second hit on same node
    });

    test('should handle edge coordinates correctly', () => {
      const [maxX, maxY] = GameBoard.BOARD_X_Y;
      gameBoard.autoPlaceAllShips();
      // Test for corner coordinates
      gameBoard.receiveAttack(0, 0);
      expect(gameBoard.receiveAttack(maxX - 1, maxY - 1)).toBeGreaterThan(-1); // Bottom-right corner
    });
  });

  describe('unHitCoordinates', () => {
    test('should return array of coordinates of unhit nodes', () => {
      const { unHitCoordinates } = gameBoard;

      expect(unHitCoordinates.length).toBe(100);
    });

    test('should reflect hits to the game board', () => {
      gameBoard.autoPlaceAllShips();

      gameBoard.receiveAttack(0, 1);

      const { unHitCoordinates } = gameBoard;

      expect(unHitCoordinates.length).toBe(99);

      // Additional check to ensure (0, 1) is no longer in unHitCoordinates
      expect(unHitCoordinates).not.toContainEqual([0, 1]);
    });
  });

  describe('hitCoordinates', () => {
    test('should return array of hit nodes coordinates', () => {
      const { hitCoordinates } = gameBoard;

      expect(hitCoordinates.length).toBe(0);
    });

    test('should return reflect hits to the game board', () => {
      gameBoard.autoPlaceAllShips();

      gameBoard.receiveAttack(0, 1);

      const { hitCoordinates } = gameBoard;

      expect(hitCoordinates.length).toBe(1);
      expect(hitCoordinates).toContainEqual([0, 1]);
    });
  });

  describe('allShipsOnBoard', () => {
    test('should return false when no ships are placed on the board', () => {
      expect(gameBoard.allShipsOnBoard).toBe(false); // Initially, no ships are placed
    });

    test('should return false if some ships are placed but not all', () => {
      // Manually place a subset of ships
      gameBoard.placeCarrier(0, 0, 'horizontal');
      gameBoard.placeBattleShip(1, 1, 'horizontal');

      expect(gameBoard.allShipsOnBoard).toBe(false); // Not all ships are placed
    });

    test('should return true when all ships are placed on the board', () => {
      gameBoard.autoPlaceAllShips(); // Place all ships on the board

      expect(gameBoard.allShipsOnBoard).toBe(true); // Should return true when all ships are placed
    });

    test('should return false if any ship is removed from the board', () => {
      gameBoard.autoPlaceAllShips(); // Place all ships initially

      gameBoard.removeCarrier(); // Remove a ship from the board

      expect(gameBoard.allShipsOnBoard).toBe(false); // allShipsOnBoard should be false if any ship is removed
    });
  });

  describe('GameBoard.createCopy', () => {
    let originalBoard;
    beforeEach(() => {
      originalBoard = new GameBoard();
    });

    test('should throw an error if passed an invalid argument', () => {
      expect(() => GameBoard.createCopy(null)).toThrow(
        'Invalid argument: expected an instance of GameBoard',
      );
      expect(() => GameBoard.createCopy({})).toThrow(
        'Invalid argument: expected an instance of GameBoard',
      );
    });

    test('should return a new empty board if original board is empty', () => {
      const copy = GameBoard.createCopy(originalBoard);

      expect(copy).toBeInstanceOf(GameBoard);
      expect(copy.allShipsOnBoard).toBe(false);
      expect(copy.unHitCoordinates.length).toBe(100);
    });

    test('should copy ship placements without hits', () => {
      originalBoard.placeCarrier(0, 0, 'horizontal');
      originalBoard.placeBattleShip(0, 3, 'vertical');
      const copy = GameBoard.createCopy(originalBoard);

      expect(copy).toBeInstanceOf(GameBoard);
      expect(copy.carrierInfo.isOnBoard).toBe(true);
      expect(copy.carrierInfo.placeHead).toEqual([0, 0]);
      expect(copy.carrierInfo.orientation).toMatch(/horizontal/i);
      expect(copy.battleShipInfo.isOnBoard).toBe(true);
      expect(copy.battleShipInfo.placeHead).toEqual([0, 3]);
      expect(copy.battleShipInfo.orientation).toMatch(/vertical/i);
    });

    test('should copy hit coordinates', () => {
      originalBoard.autoPlaceAllShips();
      originalBoard.receiveAttack(0, 0);
      originalBoard.receiveAttack(1, 0);

      const copy = GameBoard.createCopy(originalBoard);

      // Verify hit coordinates
      expect(copy.unHitCoordinates.length).toBe(98); // 2 cells attacked on a 10x10 board
      expect(copy.hitCoordinates).toContainEqual([0, 0]);
      expect(copy.hitCoordinates).toContainEqual([1, 0]);
    });

    test('should ensure original board and copy are independent', () => {
      originalBoard.placeCarrier(0, 0, 'horizontal');
      const copy = GameBoard.createCopy(originalBoard);

      copy.placeBattleShip(2, 2, 'vertical');
      expect(originalBoard.battleShipInfo.isOnBoard).toBe(false); // Ensures original board isn't affected by copy actions
      expect(copy.battleShipInfo.isOnBoard).toBe(true);
    });
  });
});
