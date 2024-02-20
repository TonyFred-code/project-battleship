import BattleShip from '../src/battleship.js';
import Ship from '../src/ship.js';

test('can create a battleship class', () => {
  expect(new BattleShip()).not.toBeUndefined();
});

test('is a ship extension', () => {
  const battleship = new BattleShip();
  expect(battleship instanceof Ship).toBe(true);
});

test('has a fixed length of 4', () => {
  const battleship = new BattleShip(6);
  expect(battleship).toHaveLength(4);
});

test('is sunk in 4 hits', () => {
  const battleship = new BattleShip();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBe(true);
});

test('denys hits after being sunk', () => {
  const battleship = new BattleShip();
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(true);
  expect(battleship.hit()).toBe(false);
});
