import Destroyer from '../src/destroyer';
import Ship from '../src/ship';

it('can create a destroyer class', () => {
  expect(new Destroyer()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const destroyer = new Destroyer();
  expect(destroyer instanceof Ship).toBe(true);
});

it('has a fixed length of 3', () => {
  const destroyer = new Destroyer(6);
  expect(destroyer).toHaveLength(3);
});

it('is sunk in 3 hits', () => {
  const destroyer = new Destroyer();
  destroyer.hit();
  destroyer.hit();
  destroyer.hit();
  expect(destroyer.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const destroyer = new Destroyer();
  expect(destroyer.hit()).toBe(true);
  expect(destroyer.hit()).toBe(true);
  expect(destroyer.hit()).toBe(true);
  expect(destroyer.hit()).toBe(false);
});
