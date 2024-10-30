import ComputerPlayer from '../src/computer-player.js';
import getRndElement from '../src/helper_module/rnd-array-element.js';
import Player from '../src/player.js';

jest.mock('../src/helper_module/rnd-array-element.js');

describe('ComputerPlayer', () => {
  let computer;
  let enemy;

  beforeEach(() => {
    computer = new ComputerPlayer();
    enemy = new Player('Enemy');
  });

  describe('constructor', () => {
    test('should initialize ComputerPlayer with name "jarvis"', () => {
      expect(computer.name).toBe('jarvis');
    });
  });

  describe('getAttack', () => {
    test('should throw an error if enemy is not an instance of Player', () => {
      expect(() => computer.getAttack({})).toThrow(
        'Invalid enemy: expected instance of Player',
      );
    });

    test('should return null if ComputerPlayer has all ships sunk', () => {
      jest.spyOn(computer, 'allShipSunk').mockReturnValue(true);
      expect(computer.getAttack(enemy)).toBeNull();
    });

    test('should return null if there are no valid moves left on enemy board', () => {
      jest.spyOn(enemy, 'validMoves', 'get').mockReturnValue([]);
      expect(computer.getAttack(enemy)).toBeNull();
    });

    test('should return a valid coordinate from enemy valid moves', () => {
      const mockCoordinate = [3, 4];
      const mockElement = { element: mockCoordinate };
      getRndElement.mockReturnValue(mockElement);

      const attack = computer.getAttack(enemy);

      expect(attack).toEqual(mockCoordinate);
      expect(getRndElement).toHaveBeenCalledWith(enemy.validMoves);
    });

    test('should pick a random coordinate and return its address', () => {
      const mockCoordinates = [
        [1, 1],
        [2, 2],
        [3, 3],
      ];
      jest.spyOn(enemy, 'validMoves', 'get').mockReturnValue(mockCoordinates);
      const mockElement = { element: [1, 1] };
      getRndElement.mockReturnValue(mockElement);

      const result = computer.getAttack(enemy);

      expect(result).toEqual([1, 1]);
    });
  });
});
