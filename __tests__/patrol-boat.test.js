import PatrolBoat from '../src/patrol-boat.js';

describe('PatrolBoat class', () => {
  let patrolBoat;

  beforeEach(() => {
    patrolBoat = new PatrolBoat();
  });
  test('should create a patrol boat with correct size and name', () => {
    expect(patrolBoat.size).toBe(2);
    expect(patrolBoat.name).toBe('patrol_boat');
  });
});
