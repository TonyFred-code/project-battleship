import Submarine from '../src/submarine.js';

describe('Submarine class', () => {
  let submarine;

  beforeEach(() => {
    submarine = new Submarine();
  });

  test('should create a submarine class with correct size and name', () => {
    expect(submarine.size).toBe(3);
    expect(submarine.name).toBe('submarine');
  });
});
