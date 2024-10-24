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

  describe('GameBoard.getToBeOccupied', () => {
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

    test('should disallow placing carrier when carrier is placed without removing it first', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');

      expect(gameBoard.placeCarrier(0, 1, 'horizontal')).toBe(false);
    });

    test('should allow placing carrier after removing carrier from board', () => {
      gameBoard.placeCarrier(0, 0, 'horizontal');
      gameBoard.removeCarrier();

      expect(gameBoard.placeCarrier(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeCarrier', () => {
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
  });

  describe('carrierInfo', () => {
    test('should return specifications regarding carrier', () => {
      const { carrierInfo } = gameBoard;

      expect(carrierInfo).toHaveProperty('isOnBoard', false);
      expect(carrierInfo).toHaveProperty('orientation', '');
      expect(carrierInfo).toHaveProperty('placeHead', [null, null]);
      expect(carrierInfo).toHaveProperty('size', 5);
      expect(carrierInfo).toHaveProperty('name');

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

    // todo Mock a scenario where no valid nodes are available
    // todo: extend auto place carrier test cases
    // - ensure proper logic is being implemented;

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

    test('should disallow placing battleship when battleship is placed without removing it first', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');

      expect(gameBoard.placeBattleShip(0, 1, 'horizontal')).toBe(false);
    });

    test('should allow placing carrier after removing carrier from board', () => {
      gameBoard.placeBattleShip(0, 0, 'horizontal');
      gameBoard.removeBattleShip();

      expect(gameBoard.placeBattleShip(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeBattleShip', () => {
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
  });

  describe('battleShipInfo', () => {
    test('should return specifications regarding battleship', () => {
      const { battleShipInfo } = gameBoard;

      expect(battleShipInfo).toHaveProperty('isOnBoard', false);
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

    test('should disallow placing destroyer when destroyer is placed without removing it first', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');

      expect(gameBoard.placeDestroyer(0, 1, 'horizontal')).toBe(false);
    });

    test('should allow placing destroyer after removing destroyer from board', () => {
      gameBoard.placeDestroyer(0, 0, 'horizontal');
      gameBoard.removeDestroyer();

      expect(gameBoard.placeDestroyer(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeDestroyer', () => {
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
  });

  describe('destroyerInfo', () => {
    test('should return specifications regarding destroyer', () => {
      const { destroyerInfo } = gameBoard;

      expect(destroyerInfo).toHaveProperty('isOnBoard', false);
      expect(destroyerInfo).toHaveProperty('orientation', '');
      expect(destroyerInfo).toHaveProperty('placeHead', [null, null]);
      expect(destroyerInfo).toHaveProperty('size', 3);
      expect(destroyerInfo).toHaveProperty('name');

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

    test('should disallow placing patrol boat when patrol boat is placed without removing it first', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');

      expect(gameBoard.placePatrolBoat(0, 1, 'horizontal')).toBe(false);
    });

    test('should allow placing carrier after removing carrier from board', () => {
      gameBoard.placePatrolBoat(0, 0, 'horizontal');
      gameBoard.removePatrolBoat();

      expect(gameBoard.placePatrolBoat(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removePatrolBoat', () => {
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
  });

  describe('patrolBoatInfo', () => {
    test('should return specifications regarding patrol boat', () => {
      const { patrolBoatInfo } = gameBoard;

      expect(patrolBoatInfo).toHaveProperty('isOnBoard', false);
      expect(patrolBoatInfo).toHaveProperty('orientation', '');
      expect(patrolBoatInfo).toHaveProperty('placeHead', [null, null]);
      expect(patrolBoatInfo).toHaveProperty('size', 2);
      expect(patrolBoatInfo).toHaveProperty('name');

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

    test('should disallow placing submarine when submarine is placed without removing it first', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');

      expect(gameBoard.placeSubmarine(0, 1, 'horizontal')).toBe(false);
    });

    test('should allow placing submarine after removing submarine from board', () => {
      gameBoard.placeSubmarine(0, 0, 'horizontal');
      gameBoard.removeSubmarine();

      expect(gameBoard.placeSubmarine(0, 1, 'horizontal')).toBe(true);
    });
  });

  describe('removeSubmarine', () => {
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
  });

  describe('submarineInfo', () => {
    test('should return specifications regarding submarine', () => {
      const { submarineInfo } = gameBoard;

      expect(submarineInfo).toHaveProperty('isOnBoard', false);
      expect(submarineInfo).toHaveProperty('orientation', '');
      expect(submarineInfo).toHaveProperty('placeHead', [null, null]);
      expect(submarineInfo).toHaveProperty('size', 3);
      expect(submarineInfo).toHaveProperty('name');

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
});

// test('can create board', () => {
//   expect(GameBoard).not.toBeUndefined();
// });

// describe('get validMoves method', () => {
//   test('can return valid moves', () => {
//     const gameBoard = new GameBoard();
//     const { validMoves } = gameBoard;

//     expect(Array.isArray(validMoves)).toBeTruthy();
//     expect(validMoves).toHaveLength(100);
//   });

//   test('reflects currently valid moves count', () => {
//     const gameBoard = new GameBoard();

//     expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//     expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//     expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//     expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//     expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//     function runCheck() {
//       for (let i = 99; i >= 0; i -= 1) {
//         const [x, y] = reverseTransform(i, BOARD_SIZE);
//         gameBoard.receiveAttack(x, y);
//         const { validMoves } = gameBoard;

//         expect(validMoves).toHaveLength(i);
//       }
//     }

//     runCheck();
//   });

//   test('valid moves are all node type', () => {
//     const gameBoard = new GameBoard();
//     const { validMoves } = gameBoard;

//     let status = false;
//     function runCheck() {
//       return validMoves.every((node) => node instanceof Node);
//     }

//     status = runCheck();
//     expect(status).toBeTruthy();
//   });

//   test('ensures all valid moves can be hit', () => {
//     const gameBoard = new GameBoard();
//     const { validMoves } = gameBoard;

//     let status = false;
//     function runCheck() {
//       return validMoves.every((node) => !node.isHit);
//     }

//     status = runCheck();

//     expect(status).toBeTruthy();
//   });
// });

// test('board should have a shipyard', () => {
//   const board = new GameBoard();
//   expect(board.shipYard).not.toBeUndefined();
// });

// test('board should have only 5 ship docks', () => {
//   const board = new GameBoard();
//   const shipDock = Object.keys(board.shipYard);
//   expect(shipDock).toHaveLength(5);
// });

// test('board should contain only 5 Ships', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof Ship;
//   }
//   expect(ships.every(checkShip)).toBe(true);
// });

// test('board should have a carrier in shipYard', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof Carrier;
//   }

//   expect(ships.some(checkShip)).toBe(true);
// });

// test('board should have a battleship in shipYard', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof BattleShip;
//   }

//   expect(ships.some(checkShip)).toBe(true);
// });

// test('board should have a destroyer in shipYard', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof Destroyer;
//   }

//   expect(ships.some(checkShip)).toBe(true);
// });

// test('board should have a submarine in shipYard', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof SubMarine;
//   }

//   expect(ships.some(checkShip)).toBe(true);
// });

// test('board should have a patrolBoat in shipYard', () => {
//   const board = new GameBoard();
//   const { shipYard } = board;
//   const ships = Object.values(shipYard);

//   function checkShip(ship) {
//     return ship instanceof PatrolBoat;
//   }

//   expect(ships.some(checkShip)).toBe(true);
// });

// test('board should have a placeCarrier method', () => {
//   const board = new GameBoard();
//   expect(board.placeCarrier).not.toBeUndefined();
// });

// test('board can position carrier horizontally', () => {
//   const board = new GameBoard();
//   expect(board.placeCarrier(0, 0)).toBe(true);
// });

// test('board can position carrier vertically', () => {
//   const board = new GameBoard();
//   expect(board.placeCarrier(0, 0, 'vertical')).toBe(true);
// });

// test('ignores invalid carrier orientation', () => {
//   const board = new GameBoard();
//   expect(board.placeCarrier(0, 0, 'diagonal')).toBe(false);
// });

// test('board should have a placeBattleShip method', () => {
//   const board = new GameBoard();
//   expect(board.placeBattleShip).not.toBeUndefined();
// });

// test('board can position battleship horizontally', () => {
//   const board = new GameBoard();
//   expect(board.placeBattleShip(0, 0)).toBe(true);
// });

// test('board can position battleship vertically', () => {
//   const board = new GameBoard();
//   expect(board.placeBattleShip(0, 0, 'vertical')).toBe(true);
// });

// test('ignores invalid battleship orientation', () => {
//   const board = new GameBoard();
//   expect(board.placeBattleShip(0, 0, 'diagonal')).toBe(false);
// });

// test('board should have a placeDestroyer method', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer).not.toBeUndefined();
// });

// test('board can position destroyer horizontally', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0)).toBe(true);
// });

// test('board can position destroyer vertically', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
// });

// test('ignores invalid destroyer orientation', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
// });

// test('board should have a placePatrolBoat method', () => {
//   const board = new GameBoard();
//   expect(board.placePatrolBoat).not.toBeUndefined();
// });

// test('board can position patrol boat horizontally', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0)).toBe(true);
// });

// test('board can position patrol boat vertically', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0, 'vertical')).toBe(true);
// });

// test('ignores invalid patrol boat orientation', () => {
//   const board = new GameBoard();
//   expect(board.placeDestroyer(0, 0, 'diagonal')).toBe(false);
// });

// test('board should have a placeSubMarine method', () => {
//   const board = new GameBoard();
//   expect(board.placeSubMarine).not.toBeUndefined();
// });

// test('board can position submarine horizontally', () => {
//   const board = new GameBoard();
//   expect(board.placeSubMarine(0, 0)).toBe(true);
// });

// test('board can position submarine vertically', () => {
//   const board = new GameBoard();
//   expect(board.placeSubMarine(0, 0, 'vertical')).toBe(true);
// });

// test('ignores invalid submarine orientation', () => {
//   const board = new GameBoard();
//   expect(board.placeSubMarine(0, 0, 'diagonal')).toBe(false);
// });

// test('game should refuse overlapping ships', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(0, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 0)).toBe(false);
// });

// test('game should refuse placing ships on partly occupied position', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(0, 0, 'vertical')).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 3)).toBe(false);
// });

// test('game should refuse placing ships on grids next to a ship', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(0, 0, 'vertical')).toBe(true);
//   expect(gameBoard.placeBattleShip(1, 0)).toBe(false);
// });

// test('game should refuse placing ships off board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(2, 12)).toBe(false);
//   expect(gameBoard.placeBattleShip(4, 12)).toBe(false);
//   expect(gameBoard.placeDestroyer(3, 12)).toBe(false);
//   expect(gameBoard.placeSubMarine(7, 12)).toBe(false);
//   expect(gameBoard.placePatrolBoat(0, 12)).toBe(false);
// });

// test('should refuse to place ship on grids siding a ship on the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(4, 5)).toBe(true);
//   expect(gameBoard.placeBattleShip(5, 1, 'vertical')).toBe(false);
// });

// test('gameBoard should have a receiveAttack() method', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.receiveAttack).not.toBeUndefined();
// });

// test('receiveAttack should refuse hit if no ship is on the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.receiveAttack(0, 0)).toBe(-1);
// });

// test('receiveAttack should refuse hit if all ships are not on the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.receiveAttack(0, 0)).toBe(-1);
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.receiveAttack(5, 0)).toBe(-1);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.receiveAttack(0, 4)).toBe(-1);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.receiveAttack(3, 3)).toBe(-1);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.receiveAttack(6, 6)).toBe(-1);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
//   expect(gameBoard.receiveAttack(1, 9)).toBe(1);
// });

// test('gameBoard receiveAttack should not hit off the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
//   expect(gameBoard.receiveAttack(10, 11)).toBe(-1);
// });

// test('gameBoard receiveAttack should hit a ship on the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
//   expect(gameBoard.receiveAttack(1, 9)).toBe(1);
// });

// test('gameBoard receiveAttack should hit a unoccupied node on the board', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
//   expect(gameBoard.receiveAttack(9, 2)).toBe(0);
// });

// test('gameBoard receiveAttack should not hit same spot twice', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);
//   expect(gameBoard.receiveAttack(1, 9)).toBe(1);
//   expect(gameBoard.receiveAttack(1, 9)).toBe(-1);
// });

// test('can report when carrier is sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(5, 0)).toBe(1);
//   expect(gameBoard.carrierSunk).toBe(false);
//   expect(gameBoard.receiveAttack(6, 0)).toBe(1);
//   expect(gameBoard.carrierSunk).toBe(false);
//   expect(gameBoard.receiveAttack(7, 0)).toBe(1);
//   expect(gameBoard.carrierSunk).toBe(false);
//   expect(gameBoard.receiveAttack(8, 0)).toBe(1);
//   expect(gameBoard.carrierSunk).toBe(false);
//   expect(gameBoard.receiveAttack(9, 0)).toBe(2);
//   expect(gameBoard.carrierSunk).toBe(true);
// });

// test('can report when battleship is sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(0, 4)).toBe(1);
//   expect(gameBoard.battleShipSunk).toBe(false);
//   expect(gameBoard.receiveAttack(0, 5)).toBe(1);
//   expect(gameBoard.battleShipSunk).toBe(false);

//   expect(gameBoard.receiveAttack(0, 6)).toBe(1);
//   expect(gameBoard.battleShipSunk).toBe(false);

//   expect(gameBoard.receiveAttack(0, 7)).toBe(2);
//   expect(gameBoard.battleShipSunk).toBe(true);
// });

// test('can report when destroyer is sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(3, 3)).toBe(1);
//   expect(gameBoard.destroyerSunk).toBe(false);
//   expect(gameBoard.receiveAttack(4, 3)).toBe(1);
//   expect(gameBoard.destroyerSunk).toBe(false);

//   expect(gameBoard.receiveAttack(5, 3)).toBe(2);
//   expect(gameBoard.destroyerSunk).toBe(true);
// });

// test('can report when submarine is sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(6, 6)).toBe(1);
//   expect(gameBoard.submarineSunk).toBe(false);
//   expect(gameBoard.receiveAttack(6, 7)).toBe(1);
//   expect(gameBoard.submarineSunk).toBe(false);
//   expect(gameBoard.receiveAttack(6, 8)).toBe(2);

//   expect(gameBoard.submarineSunk).toBe(true);
// });

// test('can report when patrol boat is sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(1, 9)).toBe(1);
//   expect(gameBoard.patrolBoatSunk).toBe(false);
//   expect(gameBoard.receiveAttack(2, 9)).toBe(2);
//   expect(gameBoard.patrolBoatSunk).toBe(true);
// });

// test('knows when all ship sunk', () => {
//   const gameBoard = new GameBoard();
//   expect(gameBoard.placeCarrier(5, 0)).toBe(true);
//   expect(gameBoard.placeBattleShip(0, 4, 'vertical')).toBe(true);
//   expect(gameBoard.placeDestroyer(3, 3)).toBe(true);
//   expect(gameBoard.placeSubMarine(6, 6, 'vertical')).toBe(true);
//   expect(gameBoard.placePatrolBoat(1, 9)).toBe(true);

//   expect(gameBoard.receiveAttack(5, 0)).toBe(1);
//   expect(gameBoard.receiveAttack(6, 0)).toBe(1);
//   expect(gameBoard.receiveAttack(7, 0)).toBe(1);
//   expect(gameBoard.receiveAttack(8, 0)).toBe(1);
//   expect(gameBoard.receiveAttack(9, 0)).toBe(2);

//   expect(gameBoard.receiveAttack(0, 4)).toBe(1);
//   expect(gameBoard.receiveAttack(0, 5)).toBe(1);
//   expect(gameBoard.receiveAttack(0, 6)).toBe(1);
//   expect(gameBoard.receiveAttack(0, 7)).toBe(2);

//   expect(gameBoard.receiveAttack(3, 3)).toBe(1);
//   expect(gameBoard.receiveAttack(4, 3)).toBe(1);
//   expect(gameBoard.receiveAttack(5, 3)).toBe(2);

//   expect(gameBoard.receiveAttack(6, 6)).toBe(1);
//   expect(gameBoard.receiveAttack(6, 7)).toBe(1);
//   expect(gameBoard.receiveAttack(6, 8)).toBe(2);

//   expect(gameBoard.receiveAttack(1, 9)).toBe(1);
//   expect(gameBoard.receiveAttack(2, 9)).toBe(2);

//   expect(gameBoard.isAllShipSunk).toBeTruthy();
// });

// describe('ship removal', () => {
//   describe('carrier removal', () => {
//     const gameBoard = new GameBoard();

//     test('has its removal method', () => {
//       expect(gameBoard.removeCarrier).toBeDefined();
//     });

//     test('can remove carrier from board', () => {
//       expect(gameBoard.placeCarrier(0, 0)).toBe(true);
//       gameBoard.removeCarrier();
//       expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
//     });
//   });

//   describe('battleShip removal', () => {
//     const gameBoard = new GameBoard();

//     test('has its removal method', () => {
//       expect(gameBoard.removeBattleShip).toBeDefined();
//     });

//     test('can remove battleShip from board', () => {
//       expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
//       gameBoard.removeBattleShip();
//       expect(gameBoard.placeCarrier(0, 0)).toBe(true);
//     });
//   });

//   describe('destroyer removal', () => {
//     const gameBoard = new GameBoard();

//     test('has its removal method', () => {
//       expect(gameBoard.removeDestroyer).toBeDefined();
//     });

//     test('can remove destroyer from board', () => {
//       expect(gameBoard.placeDestroyer(0, 0)).toBe(true);
//       gameBoard.removeDestroyer();
//       expect(gameBoard.placeCarrier(0, 0)).toBe(true);
//     });
//   });

//   describe('submarine removal', () => {
//     const gameBoard = new GameBoard();

//     test('has its removal method', () => {
//       expect(gameBoard.removeSubMarine).toBeDefined();
//     });

//     test('can remove submarine from board', () => {
//       expect(gameBoard.placeSubMarine(0, 0)).toBe(true);
//       gameBoard.removeSubMarine();
//       expect(gameBoard.placeCarrier(0, 0)).toBe(true);
//     });
//   });

//   describe('patrol boat removal', () => {
//     const gameBoard = new GameBoard();

//     test('has its removal method', () => {
//       expect(gameBoard.removePatrolBoat).toBeDefined();
//     });

//     test('can remove patrol boat from board', () => {
//       expect(gameBoard.placePatrolBoat(0, 0)).toBe(true);
//       gameBoard.removePatrolBoat();
//       expect(gameBoard.placeBattleShip(0, 0)).toBe(true);
//     });
//   });
// });

// describe('auto ship placement', () => {
//   function isValidOrientation(orientation) {
//     return orientation === 'horizontal' || orientation === 'vertical';
//   }

//   function checkFormatted(placements, orientation, expectedPlacements) {
//     const formattedPlacements = placements.map((shipHead) => {
//       const [x, y] = shipHead;
//       return `${x}-${y}`;
//     });

//     return formattedPlacements.every((element) =>
//       expectedPlacements[orientation].includes(element),
//     );
//   }

//   function isValidPlaceHead(
//     orientation,
//     formattedShipHead,
//     expectedPlacements,
//   ) {
//     return expectedPlacements[orientation].includes(formattedShipHead);
//   }

//   describe('carrier auto placement', () => {
//     const gameBoard = new GameBoard();

//     test('carrierPlacement exists', () => {
//       expect(gameBoard.carrierPlacement).toBeDefined();
//     });

//     test('should return array of possible head pos - horizontal', () => {
//       const carrierPlacements = gameBoard.carrierPlacement('horizontal');

//       expect(carrierPlacements).toHaveLength(60);

//       expect(
//         checkFormatted(
//           carrierPlacements,
//           'horizontal',
//           CARRIER_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('should return array of possible head pos - vertical', () => {
//       const carrierPlacements = gameBoard.carrierPlacement('vertical');

//       expect(
//         checkFormatted(carrierPlacements, 'vertical', CARRIER_SHIP_PLACEMENTS),
//       ).toBe(true);
//     });

//     test('ignores invalid orientation', () => {
//       const carrierPlacements = gameBoard.carrierPlacement('invalid');

//       expect(carrierPlacements).toHaveLength(0);
//     });

//     test('carrierAutoPlace exists', () => {
//       expect(gameBoard.carrierAutoPlace).toBeDefined();
//     });

//     test('carrierAutoPlace returns obj following a pattern', () => {
//       const placeAttribute = gameBoard.carrierAutoPlace();

//       expect(placeAttribute).toHaveProperty('orientation');

//       const { orientation } = placeAttribute;

//       expect(isValidOrientation(orientation)).toBe(true);

//       expect(placeAttribute).toHaveProperty('shipHead');

//       const { shipHead } = placeAttribute;
//       console.table(shipHead);
//       const [x, y] = shipHead;

//       const formattedShipHead = `${x}-${y}`;

//       expect(
//         isValidPlaceHead(
//           orientation,
//           formattedShipHead,
//           CARRIER_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);

//       expect(placeAttribute).toHaveProperty('occupyingLoc');

//       gameBoard.removeCarrier();
//     });
//   });

//   describe('battleship auto placement', () => {
//     const gameBoard = new GameBoard();

//     test('battleShipPlacement exists', () => {
//       expect(gameBoard.battleShipPlacement).toBeDefined();
//     });

//     test('should return array of possible head pos - horizontal', () => {
//       const battleShipPlacements = gameBoard.battleShipPlacement('horizontal');

//       expect(
//         checkFormatted(
//           battleShipPlacements,
//           'horizontal',
//           BATTLESHIP_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('should return array of possible head pos - vertical', () => {
//       const battleShipPlacements = gameBoard.battleShipPlacement('vertical');

//       expect(
//         checkFormatted(
//           battleShipPlacements,
//           'vertical',
//           BATTLESHIP_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('ignores invalid orientation', () => {
//       const battleShipPlacements = gameBoard.battleShipPlacement('invalid');

//       expect(battleShipPlacements).toHaveLength(0);
//     });

//     test('battleShipAutoPlace exists', () => {
//       expect(gameBoard.battleShipAutoPlace).toBeDefined();
//     });

//     test('battleShipAutoPlace returns obj following a pattern', () => {
//       const placeAttribute = gameBoard.battleShipAutoPlace('horizontal');

//       expect(placeAttribute).toHaveProperty('orientation');

//       const { orientation } = placeAttribute;

//       expect(isValidOrientation(orientation)).toBe(true);

//       expect(placeAttribute).toHaveProperty('shipHead');

//       const { shipHead } = placeAttribute;

//       const formattedShipHead = `${shipHead[0]}-${shipHead[1]}`;

//       expect(
//         isValidPlaceHead(
//           orientation,
//           formattedShipHead,
//           BATTLESHIP_SHIP_PLACEMENTS,
//         ),
//       ).toBeTruthy();

//       expect(placeAttribute).toHaveProperty('occupyingLoc');

//       gameBoard.removeBattleShip();
//     });
//   });

//   describe('destroyer auto placement', () => {
//     const gameBoard = new GameBoard();
//     test('destroyerPlacement exists', () => {
//       expect(gameBoard.destroyerPlacement).toBeDefined();
//     });

//     test('should return array of possible head pos - horizontal', () => {
//       const destroyerPlacements = gameBoard.destroyerPlacement('horizontal');

//       expect(
//         checkFormatted(
//           destroyerPlacements,
//           'horizontal',
//           DESTROYER_SHIP_PLACEMENTS,
//         ),
//       ).toBeTruthy();
//     });

//     test('should return array of possible head pos - vertical', () => {
//       const destroyerPlacements = gameBoard.destroyerPlacement('vertical');

//       expect(
//         checkFormatted(
//           destroyerPlacements,
//           'vertical',
//           DESTROYER_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('ignores invalid orientation', () => {
//       const destroyerPlacements = gameBoard.destroyerPlacement('invalid');

//       expect(destroyerPlacements).toHaveLength(0);
//     });

//     test('destroyerAutoPlace exists', () => {
//       expect(gameBoard.destroyerAutoPlace).toBeDefined();
//     });

//     test('destroyerAutoPlace returns obj following a pattern', () => {
//       const placeAttribute = gameBoard.destroyerAutoPlace('horizontal');

//       expect(placeAttribute).toHaveProperty('orientation');

//       const { orientation } = placeAttribute;

//       expect(isValidOrientation(orientation)).toBeTruthy();

//       expect(placeAttribute).toHaveProperty('shipHead');

//       const { shipHead } = placeAttribute;
//       const [x, y] = shipHead;

//       const formattedShipHead = `${x}-${y}`;

//       expect(
//         isValidPlaceHead(
//           orientation,
//           formattedShipHead,
//           DESTROYER_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);

//       expect(placeAttribute).toHaveProperty('occupyingLoc');

//       gameBoard.removeDestroyer();
//     });
//   });

//   describe('submarine auto placement', () => {
//     const gameBoard = new GameBoard();

//     test('subMarinePlacement exists', () => {
//       expect(gameBoard.subMarinePlacement).toBeDefined();
//     });

//     test('should return array of possible head pos - horizontal', () => {
//       const subMarinePlacements = gameBoard.subMarinePlacement('horizontal');

//       expect(
//         checkFormatted(
//           subMarinePlacements,
//           'horizontal',
//           SUB_MARINE_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('should return array of possible head pos - vertical', () => {
//       const subMarinePlacements = gameBoard.subMarinePlacement('vertical');

//       expect(
//         checkFormatted(
//           subMarinePlacements,
//           'vertical',
//           SUB_MARINE_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('ignores invalid orientation', () => {
//       const subMarinePlacements = gameBoard.subMarinePlacement('invalid');

//       expect(subMarinePlacements).toHaveLength(0);
//     });

//     test('subMarineAutoPlace exists', () => {
//       expect(gameBoard.subMarineAutoPlace).toBeDefined();
//     });

//     test('subMarineAutoPlace returns obj following a pattern', () => {
//       const placeAttribute = gameBoard.subMarineAutoPlace();

//       expect(placeAttribute).toHaveProperty('orientation');

//       const { orientation } = placeAttribute;

//       expect(placeAttribute).toHaveProperty('shipHead');

//       const { shipHead } = placeAttribute;
//       const [x, y] = shipHead;

//       const formattedShipHead = `${x}-${y}`;

//       expect(
//         isValidPlaceHead(
//           orientation,
//           formattedShipHead,
//           SUB_MARINE_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);

//       expect(placeAttribute).toHaveProperty('occupyingLoc');

//       gameBoard.removeSubMarine();
//     });
//   });

//   describe('patrol boat auto placement', () => {
//     const gameBoard = new GameBoard();

//     test('patrolBoatPlacement exists', () => {
//       expect(gameBoard.patrolBoatPlacement).toBeDefined();
//     });

//     test('should return array of possible head pos - horizontal', () => {
//       const patrolBoatPlacements = gameBoard.patrolBoatPlacement('horizontal');

//       expect(
//         checkFormatted(
//           patrolBoatPlacements,
//           'horizontal',
//           PATROL_BOAT_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('should return array of possible head pos - vertical', () => {
//       const patrolBoatPlacements = gameBoard.patrolBoatPlacement('vertical');

//       expect(
//         checkFormatted(
//           patrolBoatPlacements,
//           'vertical',
//           PATROL_BOAT_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);
//     });

//     test('ignores invalid orientation', () => {
//       const patrolBoatPlacements = gameBoard.patrolBoatPlacement('invalid');

//       expect(patrolBoatPlacements).toHaveLength(0);
//     });

//     test('patrolBoatAutoPlace exists', () => {
//       expect(gameBoard.patrolBoatAutoPlace).toBeDefined();
//     });

//     test('patrolBoatAutoPlace returns obj following a pattern', () => {
//       const placeAttribute = gameBoard.patrolBoatAutoPlace('horizontal');

//       expect(placeAttribute).toHaveProperty('orientation');

//       const { orientation } = placeAttribute;

//       expect(isValidOrientation(orientation)).toBe(true);

//       expect(placeAttribute).toHaveProperty('shipHead');

//       const { shipHead } = placeAttribute;
//       const [x, y] = shipHead;

//       const formattedShipHead = `${x}-${y}`;

//       expect(
//         isValidPlaceHead(
//           orientation,
//           formattedShipHead,
//           PATROL_BOAT_SHIP_PLACEMENTS,
//         ),
//       ).toBe(true);

//       expect(placeAttribute).toHaveProperty('occupyingLoc');

//       gameBoard.removePatrolBoat();
//     });
//   });

//   describe('ship auto placement places ships on the board', () => {
//     describe('carrier auto placement', () => {
//       const gameBoard = new GameBoard();

//       test('ships get hit and can be sunk using auto placement', () => {
//         const carrierPlaceInfo = gameBoard.carrierAutoPlace();

//         gameBoard.battleShipAutoPlace();

//         gameBoard.destroyerAutoPlace();

//         gameBoard.subMarineAutoPlace();

//         gameBoard.patrolBoatAutoPlace();

//         const carrierOccupying = carrierPlaceInfo.occupyingLoc;

//         const carrierHits = new Set();

//         carrierOccupying.forEach((nodeLoc) => {
//           const [x, y] = nodeLoc;

//           carrierHits.add(gameBoard.receiveAttack(x, y));
//         });

//         expect(carrierHits.size).toBe(2);

//         expect(carrierHits.has(1)).toBe(true);
//         expect(carrierHits.has(2)).toBe(true);
//         expect(carrierHits.has(0)).toBe(false);
//         expect(carrierHits.has(-1)).toBe(false);

//         expect(gameBoard.carrierSunk).toBe(true);
//       });
//     });

//     describe('battleship auto placement', () => {
//       const gameBoard = new GameBoard();

//       test('ships get hit and can be sunk using auto placement', () => {
//         gameBoard.carrierAutoPlace();

//         const battleShipPlaceInfo = gameBoard.battleShipAutoPlace();

//         gameBoard.destroyerAutoPlace();

//         gameBoard.subMarineAutoPlace();

//         gameBoard.patrolBoatAutoPlace();

//         const battleShipOccupying = battleShipPlaceInfo.occupyingLoc;

//         const battleShipHits = new Set();

//         battleShipOccupying.forEach((nodeLoc) => {
//           const [x, y] = nodeLoc;

//           battleShipHits.add(gameBoard.receiveAttack(x, y));
//         });

//         expect(battleShipHits.size).toBe(2);

//         expect(battleShipHits.has(1)).toBe(true);
//         expect(battleShipHits.has(2)).toBe(true);
//         expect(battleShipHits.has(0)).toBe(false);
//         expect(battleShipHits.has(-1)).toBe(false);

//         expect(gameBoard.battleShipSunk).toBe(true);
//       });
//     });

//     describe('destroyer auto placement', () => {
//       const gameBoard = new GameBoard();

//       test('ships get hit and can be sunk using auto placement', () => {
//         gameBoard.carrierAutoPlace();

//         gameBoard.battleShipAutoPlace();

//         const destroyerPlaceInfo = gameBoard.destroyerAutoPlace();

//         gameBoard.subMarineAutoPlace();

//         gameBoard.patrolBoatAutoPlace();

//         const destroyerOccupying = destroyerPlaceInfo.occupyingLoc;

//         const destroyerHits = new Set();

//         destroyerOccupying.forEach((nodeLoc) => {
//           const [x, y] = nodeLoc;

//           destroyerHits.add(gameBoard.receiveAttack(x, y));
//         });

//         expect(destroyerHits.size).toBe(2);

//         expect(destroyerHits.has(1)).toBe(true);
//         expect(destroyerHits.has(2)).toBe(true);

//         expect(destroyerHits.has(0)).toBe(false);
//         expect(destroyerHits.has(-1)).toBe(false);

//         expect(gameBoard.destroyerSunk).toBe(true);
//       });
//     });

//     describe('sub marine auto placement', () => {
//       const gameBoard = new GameBoard();

//       test('ships get hit and can be sunk using auto placement', () => {
//         gameBoard.carrierAutoPlace();

//         gameBoard.battleShipAutoPlace();

//         gameBoard.destroyerAutoPlace();

//         const subMarinePlaceInfo = gameBoard.subMarineAutoPlace();

//         gameBoard.patrolBoatAutoPlace();

//         const subMarineOccupying = subMarinePlaceInfo.occupyingLoc;

//         const subMarineHits = new Set();

//         subMarineOccupying.forEach((nodeLoc) => {
//           const [x, y] = nodeLoc;

//           subMarineHits.add(gameBoard.receiveAttack(x, y));
//         });

//         expect(subMarineHits.size).toBe(2);

//         expect(subMarineHits.has(1)).toBe(true);
//         expect(subMarineHits.has(2)).toBe(true);

//         expect(subMarineHits.has(0)).toBe(false);
//         expect(subMarineHits.has(-1)).toBe(false);

//         expect(gameBoard.submarineSunk).toBe(true);
//       });
//     });

//     describe('patrol boat auto placement', () => {
//       const gameBoard = new GameBoard();

//       test('ships get hit and can be sunk using auto placement', () => {
//         gameBoard.carrierAutoPlace();

//         gameBoard.battleShipAutoPlace();

//         gameBoard.destroyerAutoPlace();

//         gameBoard.subMarineAutoPlace();

//         const patrolBoatPlaceInfo = gameBoard.patrolBoatAutoPlace();

//         const patrolBoatOccupying = patrolBoatPlaceInfo.occupyingLoc;

//         const patrolBoatHits = new Set();

//         patrolBoatOccupying.forEach((nodeLoc) => {
//           const [x, y] = nodeLoc;

//           patrolBoatHits.add(gameBoard.receiveAttack(x, y));
//         });

//         expect(patrolBoatHits.size).toBe(2);

//         expect(patrolBoatHits.has(1)).toBe(true);
//         expect(patrolBoatHits.has(2)).toBe(true);

//         expect(patrolBoatHits.has(0)).toBe(false);
//         expect(patrolBoatHits.has(-1)).toBe(false);

//         expect(gameBoard.patrolBoatSunk).toBe(true);
//       });
//     });
//   });
// });

// describe('querying ship placement', () => {
//   test('method to check for ship placements exists', () => {
//     const board = new GameBoard();

//     expect(board.shipPlacements).toBeDefined();
//   });

//   describe('ship placement method returns correct data input', () => {
//     const gameBoard = new GameBoard();

//     gameBoard.placeCarrier(5, 0);

//     gameBoard.placeBattleShip(0, 4, 'vertical');

//     gameBoard.placeDestroyer(3, 3);
//     gameBoard.placeSubMarine(6, 6, 'vertical');

//     gameBoard.placePatrolBoat(1, 9);

//     const { shipPlacements } = gameBoard;

//     test('carrier placement returned is correct', () => {
//       expect(shipPlacements).toHaveProperty('carrierPlacement');

//       const { carrierPlacement } = shipPlacements;

//       expect(carrierPlacement).toHaveProperty('shipHead', [5, 0]);

//       expect(carrierPlacement).toHaveProperty('orientation', 'horizontal');

//       expect(carrierPlacement).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = carrierPlacement;

//       const toBeOccupied = ['5, 0', '6, 0', '7, 0', '8, 0', '9, 0'];

//       expect(occupyingLoc).toHaveLength(5);

//       let correct = false;

//       occupyingLoc.forEach((element) => {
//         const [x, y] = element;

//         const transformed = `${x}, ${y}`;

//         correct = toBeOccupied.includes(transformed);
//       });

//       expect(correct).toBeTruthy();

//       expect(carrierPlacement).toHaveProperty('isOnBoard', true);
//     });

//     test('battleship placement returned is correct', () => {
//       expect(shipPlacements).toHaveProperty('battleShipPlacement');

//       const { battleShipPlacement } = shipPlacements;

//       expect(battleShipPlacement).toHaveProperty('shipHead', [0, 4]);

//       expect(battleShipPlacement).toHaveProperty('orientation', 'vertical');

//       expect(battleShipPlacement).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = battleShipPlacement;

//       const toBeOccupied = ['0, 4', '0, 5', '0, 6', '0, 7'];

//       expect(occupyingLoc).toHaveLength(4);

//       let correct = false;

//       occupyingLoc.forEach((element) => {
//         const [x, y] = element;

//         const transformed = `${x}, ${y}`;

//         correct = toBeOccupied.includes(transformed);
//       });

//       expect(correct).toBeTruthy();

//       expect(battleShipPlacement).toHaveProperty('isOnBoard', true);
//     });

//     test('destroyer placement returned is correct', () => {
//       expect(shipPlacements).toHaveProperty('destroyerPlacement');

//       const { destroyerPlacement } = shipPlacements;

//       expect(destroyerPlacement).toHaveProperty('shipHead', [3, 3]);

//       expect(destroyerPlacement).toHaveProperty('orientation', 'horizontal');

//       expect(destroyerPlacement).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = destroyerPlacement;

//       const toBeOccupied = ['3, 3', '4, 3', '5, 3'];

//       expect(occupyingLoc).toHaveLength(3);

//       let correct = false;

//       occupyingLoc.forEach((element) => {
//         const [x, y] = element;

//         const transformed = `${x}, ${y}`;

//         correct = toBeOccupied.includes(transformed);
//       });

//       expect(correct).toBeTruthy();

//       expect(destroyerPlacement).toHaveProperty('isOnBoard', true);
//     });

//     test('submarine placement returned is correct', () => {
//       expect(shipPlacements).toHaveProperty('subMarinePlacement');

//       const { subMarinePlacement } = shipPlacements;

//       expect(subMarinePlacement).toHaveProperty('shipHead', [6, 6]);

//       expect(subMarinePlacement).toHaveProperty('orientation', 'vertical');

//       expect(subMarinePlacement).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = subMarinePlacement;

//       const toBeOccupied = ['6, 6', '6, 7', '6, 8'];

//       expect(occupyingLoc).toHaveLength(3);

//       let correct = false;

//       occupyingLoc.forEach((element) => {
//         const [x, y] = element;

//         const transformed = `${x}, ${y}`;

//         correct = toBeOccupied.includes(transformed);
//       });

//       expect(correct).toBeTruthy();

//       expect(subMarinePlacement).toHaveProperty('isOnBoard', true);
//     });

//     test('patrol boat placement returned is correct', () => {
//       expect(shipPlacements).toHaveProperty('patrolBoatPlacement');

//       const { patrolBoatPlacement } = shipPlacements;

//       expect(patrolBoatPlacement).toHaveProperty('shipHead', [1, 9]);

//       expect(patrolBoatPlacement).toHaveProperty('orientation', 'horizontal');

//       expect(patrolBoatPlacement).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = patrolBoatPlacement;

//       const toBeOccupied = ['1, 9', '2, 9'];

//       expect(occupyingLoc).toHaveLength(2);

//       let correct = false;

//       occupyingLoc.forEach((element) => {
//         const [x, y] = element;

//         const transformed = `${x}, ${y}`;

//         correct = toBeOccupied.includes(transformed);
//       });

//       expect(correct).toBeTruthy();

//       expect(patrolBoatPlacement).toHaveProperty('isOnBoard', true);
//     });
//   });

//   describe('ship placement for non-placed ships', () => {
//     const gameBoard = new GameBoard();

//     test('un-placed carrier', () => {
//       const { carrierPlacement } = gameBoard.shipPlacements;

//       const { shipHead, occupyingLoc, orientation, isOnBoard } =
//         carrierPlacement;

//       expect(shipHead).toHaveLength(0);

//       expect(occupyingLoc).toHaveLength(0);

//       expect(orientation).toBe('');

//       expect(isOnBoard).toBe(false);
//     });

//     test('un-placed battleShip', () => {
//       const { battleShipPlacement } = gameBoard.shipPlacements;

//       const { shipHead, occupyingLoc, orientation, isOnBoard } =
//         battleShipPlacement;

//       expect(shipHead).toHaveLength(0);

//       expect(occupyingLoc).toHaveLength(0);

//       expect(orientation).toBe('');

//       expect(isOnBoard).toBe(false);
//     });

//     test('un-placed destroyer', () => {
//       const { destroyerPlacement } = gameBoard.shipPlacements;

//       const { shipHead, occupyingLoc, orientation, isOnBoard } =
//         destroyerPlacement;

//       expect(shipHead).toHaveLength(0);

//       expect(occupyingLoc).toHaveLength(0);

//       expect(orientation).toBe('');

//       expect(isOnBoard).toBe(false);
//     });

//     test('un-placed subMarine', () => {
//       const { subMarinePlacement } = gameBoard.shipPlacements;

//       const { shipHead, occupyingLoc, orientation, isOnBoard } =
//         subMarinePlacement;

//       expect(shipHead).toHaveLength(0);

//       expect(occupyingLoc).toHaveLength(0);

//       expect(orientation).toBe('');

//       expect(isOnBoard).toBe(false);
//     });

//     test('un-placed patrolBoat', () => {
//       const { patrolBoatPlacement } = gameBoard.shipPlacements;

//       const { shipHead, occupyingLoc, orientation, isOnBoard } =
//         patrolBoatPlacement;

//       expect(shipHead).toHaveLength(0);

//       expect(occupyingLoc).toHaveLength(0);

//       expect(orientation).toBe('');

//       expect(isOnBoard).toBe(false);
//     });
//   });
// });

// describe('ship placing methods', () => {
//   describe('carrier placing', () => {
//     test('placeCarrier() allows ship to be re-placed', () => {
//       const gameBoard = new GameBoard();

//       expect(gameBoard.placeCarrier(0, 0)).toBeTruthy();

//       expect(gameBoard.placeCarrier(0, 5)).toBeTruthy();
//     });

//     test('placeCarrier() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeCarrier(0, 0);

//       expect(gameBoard.placeCarrier(0, -2)).toBeFalsy();

//       expect(gameBoard.shipPlacements.carrierPlacement.isOnBoard).toBeTruthy();

//       expect(gameBoard.shipPlacements.carrierPlacement).toHaveProperty(
//         'shipHead',
//         [0, 0],
//       );
//     });
//   });

//   describe('battleship placing', () => {
//     test('placeBattleShip() allows ship to be re-placed', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeBattleShip(0, 0);

//       expect(gameBoard.placeBattleShip(0, 2)).toBeTruthy();
//     });

//     test('placeBattleShip() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeBattleShip(0, 0);

//       expect(gameBoard.placeBattleShip(0, -2)).toBeFalsy();

//       expect(
//         gameBoard.shipPlacements.battleShipPlacement.isOnBoard,
//       ).toBeTruthy();
//     });
//   });

//   describe('destroyer placing', () => {
//     test('placeDestroyer() allows ship to be re-placed', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeDestroyer(0, 0);

//       expect(gameBoard.placeDestroyer(0, 2)).toBeTruthy();
//     });

//     test('placeDestroyer() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeDestroyer(0, 0);

//       expect(gameBoard.placeDestroyer(0, -2)).toBeFalsy();

//       expect(
//         gameBoard.shipPlacements.destroyerPlacement.isOnBoard,
//       ).toBeTruthy();
//     });
//   });

//   describe('submarine placing', () => {
//     test('placeSubMarine() allows ship to be re-placed', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeSubMarine(0, 0);

//       expect(gameBoard.placeSubMarine(0, 2)).toBeTruthy();
//     });

//     test('placeSubMarine() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placeSubMarine(0, 0);

//       expect(gameBoard.placeSubMarine(0, -2)).toBeFalsy();

//       expect(
//         gameBoard.shipPlacements.subMarinePlacement.isOnBoard,
//       ).toBeTruthy();
//     });
//   });
//   describe('patrol boat placing', () => {
//     test('placePatrolBoat() allows ship to be re-placed', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placePatrolBoat(0, 0);

//       expect(gameBoard.placePatrolBoat(0, 2)).toBeTruthy();
//     });

//     test('placePatrolBoat() disallows ship to be re-placed if new coordinate or orientation is invalid', () => {
//       const gameBoard = new GameBoard();

//       gameBoard.placePatrolBoat(0, 0);

//       expect(gameBoard.placePatrolBoat(0, -2)).toBeFalsy();

//       expect(
//         gameBoard.shipPlacements.patrolBoatPlacement.isOnBoard,
//       ).toBeTruthy();
//     });
//   });
// });

// describe('ship-typePlacementDetails', () => {
//   function runOccupyingCheck(occupyingLoc, expectedOccupyingLoc) {
//     let status = false;

//     occupyingLoc.forEach((loc) => {
//       const [x, y] = loc;

//       const index = expectedOccupyingLoc.indexOf(`${x}-${y}`);

//       if (index === -1) {
//         status = false;
//       }

//       expectedOccupyingLoc.splice(index, 1);
//     });

//     status = expectedOccupyingLoc.length === 0;

//     return status;
//   }

//   describe('carrierPlacementDetails', () => {
//     let gameBoard;

//     beforeEach(() => {
//       gameBoard = new GameBoard();
//     });

//     test('should exists', () => {
//       expect(gameBoard.carrierPlacementDetails).toBeDefined();
//     });

//     test('should return placement details', () => {
//       let placementDetails = gameBoard.carrierPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', []);

//       expect(placementDetails).toHaveProperty('isOnBoard', false);

//       expect(placementDetails).toHaveProperty('orientation', '');

//       expect(placementDetails).toHaveProperty('occupyingLoc', []);

//       gameBoard.placeCarrier(0, 0, 'horizontal');

//       placementDetails = gameBoard.carrierPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', [0, 0]);

//       expect(placementDetails).toHaveProperty('isOnBoard', true);

//       expect(placementDetails).toHaveProperty('orientation', 'horizontal');

//       expect(placementDetails).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = placementDetails;

//       const expectedOccupyingLoc = ['0-0', '1-0', '2-0', '3-0', '4-0'];

//       expect(
//         runOccupyingCheck(occupyingLoc, expectedOccupyingLoc),
//       ).toBeTruthy();
//     });
//   });

//   describe('battleShipPlacementDetails', () => {
//     let gameBoard;

//     beforeEach(() => {
//       gameBoard = new GameBoard();
//     });

//     test('should exists', () => {
//       expect(gameBoard.battleShipPlacementDetails).toBeDefined();
//     });

//     test('should return placement details', () => {
//       let placementDetails = gameBoard.battleShipPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', []);

//       expect(placementDetails).toHaveProperty('isOnBoard', false);

//       expect(placementDetails).toHaveProperty('orientation', '');

//       expect(placementDetails).toHaveProperty('occupyingLoc', []);

//       gameBoard.placeBattleShip(0, 0, 'horizontal');

//       placementDetails = gameBoard.battleShipPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', [0, 0]);

//       expect(placementDetails).toHaveProperty('isOnBoard', true);

//       expect(placementDetails).toHaveProperty('orientation', 'horizontal');

//       expect(placementDetails).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = placementDetails;

//       const expectedOccupyingLoc = ['0-0', '1-0', '2-0', '3-0'];

//       expect(
//         runOccupyingCheck(occupyingLoc, expectedOccupyingLoc),
//       ).toBeTruthy();
//     });
//   });

//   describe('destroyerPlacementDetails', () => {
//     let gameBoard;

//     beforeEach(() => {
//       gameBoard = new GameBoard();
//     });

//     test('should exists', () => {
//       expect(gameBoard.destroyerPlacementDetails).toBeDefined();
//     });

//     test('should return placement details', () => {
//       let placementDetails = gameBoard.destroyerPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', []);

//       expect(placementDetails).toHaveProperty('isOnBoard', false);

//       expect(placementDetails).toHaveProperty('orientation', '');

//       expect(placementDetails).toHaveProperty('occupyingLoc', []);

//       gameBoard.placeDestroyer(0, 0, 'horizontal');

//       placementDetails = gameBoard.destroyerPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', [0, 0]);

//       expect(placementDetails).toHaveProperty('isOnBoard', true);

//       expect(placementDetails).toHaveProperty('orientation', 'horizontal');

//       expect(placementDetails).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = placementDetails;

//       const expectedOccupyingLoc = ['0-0', '1-0', '2-0'];

//       expect(
//         runOccupyingCheck(occupyingLoc, expectedOccupyingLoc),
//       ).toBeTruthy();
//     });
//   });

//   describe('subMarinePlacementDetails', () => {
//     let gameBoard;

//     beforeEach(() => {
//       gameBoard = new GameBoard();
//     });

//     test('should exists', () => {
//       expect(gameBoard.subMarinePlacementDetails).toBeDefined();
//     });

//     test('should return placement details', () => {
//       let placementDetails = gameBoard.subMarinePlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', []);

//       expect(placementDetails).toHaveProperty('isOnBoard', false);

//       expect(placementDetails).toHaveProperty('orientation', '');

//       expect(placementDetails).toHaveProperty('occupyingLoc', []);

//       gameBoard.placeSubMarine(0, 0, 'horizontal');

//       placementDetails = gameBoard.subMarinePlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', [0, 0]);

//       expect(placementDetails).toHaveProperty('isOnBoard', true);

//       expect(placementDetails).toHaveProperty('orientation', 'horizontal');

//       expect(placementDetails).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = placementDetails;

//       const expectedOccupyingLoc = ['0-0', '1-0', '2-0'];

//       expect(
//         runOccupyingCheck(occupyingLoc, expectedOccupyingLoc),
//       ).toBeTruthy();
//     });
//   });

//   describe('patrolBoatPlacementDetails', () => {
//     let gameBoard;

//     beforeEach(() => {
//       gameBoard = new GameBoard();
//     });

//     test('should exists', () => {
//       expect(gameBoard.patrolBoatPlacementDetails).toBeDefined();
//     });

//     test('should return placement details', () => {
//       let placementDetails = gameBoard.patrolBoatPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', []);

//       expect(placementDetails).toHaveProperty('isOnBoard', false);

//       expect(placementDetails).toHaveProperty('orientation', '');

//       expect(placementDetails).toHaveProperty('occupyingLoc', []);

//       gameBoard.placePatrolBoat(0, 0, 'horizontal');

//       placementDetails = gameBoard.patrolBoatPlacementDetails;

//       expect(placementDetails).toHaveProperty('shipHead', [0, 0]);

//       expect(placementDetails).toHaveProperty('isOnBoard', true);

//       expect(placementDetails).toHaveProperty('orientation', 'horizontal');

//       expect(placementDetails).toHaveProperty('occupyingLoc');

//       const { occupyingLoc } = placementDetails;

//       const expectedOccupyingLoc = ['0-0', '1-0'];

//       expect(
//         runOccupyingCheck(occupyingLoc, expectedOccupyingLoc),
//       ).toBeTruthy();
//     });
//   });
// });

// describe('body copying method', () => {
//   test('should have copy method', () => {
//     const gameBoard = new GameBoard();

//     expect(gameBoard.copy).toBeDefined();
//   });

//   test('copy should be a GameBoard instance', () => {
//     const gameBoard = new GameBoard();

//     const { copy } = gameBoard;

//     expect(copy).toBeInstanceOf(GameBoard);
//   });

//   test('must not be equal', () => {
//     const gameBoard = new GameBoard();

//     const { copy } = gameBoard;

//     expect(copy === gameBoard).toBeFalsy();
//   });

//   // TODO: complete tests to confirm copying requirements
//   // test('should copy referenced board state', () => {
//   //   const gameBoard = new GameBoard();

//   //   gameBoard.allShipsPlacement()

//   //   const { copy } = gameBoard;
//   //   const { carrierPlacementDetails } = gameBoard;
//   //   expect(carrierPlacementDetails.shipHead).toHaveLength(2);
//   // });
// });
