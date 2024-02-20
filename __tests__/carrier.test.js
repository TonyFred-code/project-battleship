import Carrier from '../src/carrier.js';
import Ship from '../src/ship.js';

it('can create a carrier class', () => {
  expect(new Carrier()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const carrier = new Carrier();
  expect(carrier instanceof Ship).toBe(true);
});

it('has a fixed length of 5', () => {
  const carrier = new Carrier(6);
  expect(carrier).toHaveLength(5);
});

it('is sunk in five hits', () => {
  const carrier = new Carrier();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  carrier.hit();
  expect(carrier.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const carrier = new Carrier();
  expect(carrier.hit()).toBe(true);
  expect(carrier.hit()).toBe(true);
  expect(carrier.hit()).toBe(true);
  expect(carrier.hit()).toBe(true);
  expect(carrier.hit()).toBe(true);
  expect(carrier.hit()).toBe(false);
});
