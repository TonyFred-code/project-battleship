import HumanPlayer from '../src/human-player.js';

describe('HumanPlayer', () => {
  let human;

  beforeEach(() => {
    human = new HumanPlayer();
  });

  describe('constructor', () => {
    test('should initialize HumanPlayer with name "Human"', () => {
      expect(human.name).toBe('Human');
    });
  });

  describe('inheritance', () => {
    test('should inherit methods from Player class', () => {
      expect(typeof human.placeCarrier).toBe('function');
      expect(typeof human.removeCarrier).toBe('function');
      expect(typeof human.autoPlaceCarrier).toBe('function');
      expect(typeof human.receiveAttack).toBe('function');
      expect(typeof human.allShipSunk).toBe('function');
    });

    test('should initialize with a GameBoard instance', () => {
      expect(human.boardCopy).toBeDefined();
      expect(human.validMoves).toBeDefined();
    });
  });
});
