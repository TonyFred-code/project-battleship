import Carrier from '../src/carrier.js';
import Ship from '../src/ship.js';

test('can create a carrier class', () => {
  expect(new Carrier()).not.toBeUndefined();
});

test('is a ship extension', () => {
  const carrier = new Carrier();
  expect(carrier instanceof Ship).toBe(true);
});

test('has a fixed length of 5', () => {
  const carrier = new Carrier(6);
  expect(carrier).toHaveLength(5);
});

test('is sunk in five hits', () => {
  const carrier = new Carrier();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  expect(carrier.isSunk()).toBe(true);
});

test('denys hits after being sunk', () => {
  const carrier = new Carrier();
  expect(carrier.hit()).toBe(1);
  expect(carrier.hit()).toBe(1);
  expect(carrier.hit()).toBe(1);
  expect(carrier.hit()).toBe(1);
  expect(carrier.hit()).toBe(2);
  expect(carrier.hit()).toBe(-1);
});
