import Destroyer from '../src/destroyer.js';

describe('Destroyer class', () => {
  let destroyer;

  beforeEach(() => {
    destroyer = new Destroyer();
  });

  test('should create a destroyer class ship with correct size and name', () => {
    expect(destroyer.size).toBe(3);
    expect(destroyer.name).toBe('destroyer');
  });
});
