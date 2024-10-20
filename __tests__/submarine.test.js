import SubMarine from '../src/submarine.js';

describe('SubMarine class', () => {
  let submarine;

  beforeEach(() => {
    submarine = new SubMarine();
  });

  test('should create a submarine class with correct size and name', () => {
    expect(submarine.size).toBe(3);
    expect(submarine.name).toBe('submarine');
  });
});
