import BattleShip from '../src/battleship.js';
import Ship from '../src/ship.js';

it('can create a battleship class', () => {
  expect(new BattleShip()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const battleship = new BattleShip();
  expect(battleship instanceof Ship).toBe(true);
});

it('has a fixed length of 4', () => {
  const battleship = new BattleShip(6);
  expect(battleship).toHaveLength(4);
});

it('is sunk in 4 hits', () => {
  const battleship = new BattleShip();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const battleship = new BattleShip();
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(false);
});
