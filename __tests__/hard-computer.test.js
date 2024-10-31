import HardComputerPlayer from '../src/hard-computer.js';
// import getRndElement from '../src/helper_module/rnd-array-element.js';
// import Player from '../src/player.js';

jest.mock('../src/helper_module/rnd-array-element.js');

describe('ComputerPlayer', () => {
  let computer;
  // let enemy;

  beforeEach(() => {
    computer = new HardComputerPlayer();
    // enemy = new Player('Enemy');
  });

  describe('constructor', () => {
    test('should initialize ComputerPlayer with name "jarvis"', () => {
      expect(computer.name).toBe('jarvis');
    });
  });

  // todo: add test suite for get attack
});
