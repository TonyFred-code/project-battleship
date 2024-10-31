import BattleShip from '../src/battleship.js';

describe('BattleShip class', () => {
  let battleship;

  beforeEach(() => {
    battleship = new BattleShip();
  });

  test('should create a battleship class ship with correct size and name', () => {
    expect(battleship.size).toBe(4);
    expect(battleship.name).toBe('battleship');
  });
});
