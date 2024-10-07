import SubMarine from '../src/submarine.js';
import Ship from '../src/ship.js';

test('can create a submarine class', () => {
  expect(new SubMarine()).not.toBeUndefined();
});

test('is a ship extension', () => {
  const submarine = new SubMarine();
  expect(submarine instanceof Ship).toBe(true);
});

test('has a fixed length of 3', () => {
  const submarine = new SubMarine(6);
  expect(submarine).toHaveLength(3);
});

test('is sunk in 3 hits', () => {
  const submarine = new SubMarine();
  submarine.hit();
  submarine.hit();
  submarine.hit();
  expect(submarine.isSunk()).toBe(true);
});

test('denys hits after being sunk', () => {
  const submarine = new SubMarine();
  expect(submarine.hit()).toBe(1);
  expect(submarine.hit()).toBe(1);
  expect(submarine.hit()).toBe(2);
  expect(submarine.hit()).toBe(-1);
});
