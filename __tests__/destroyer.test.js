import Destroyer from '../src/destroyer.js';
import Ship from '../src/ship.js';

test('can create a destroyer class', () => {
  expect(new Destroyer()).not.toBeUndefined();
});

test('is a ship extension', () => {
  const destroyer = new Destroyer();
  expect(destroyer instanceof Ship).toBe(true);
});

test('has a fixed length of 3', () => {
  const destroyer = new Destroyer(6);
  expect(destroyer).toHaveLength(3);
});

test('is sunk in 3 hits', () => {
  const destroyer = new Destroyer();
  destroyer.hit();
  destroyer.hit();
  destroyer.hit();
  expect(destroyer.isSunk()).toBe(true);
});

test('denys hits after being sunk', () => {
  const destroyer = new Destroyer();
  expect(destroyer.hit()).toBe(1);
  expect(destroyer.hit()).toBe(1);
  expect(destroyer.hit()).toBe(2);
  expect(destroyer.hit()).toBe(-1);
});
