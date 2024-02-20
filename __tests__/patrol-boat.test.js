import PatrolBoat from '../src/patrol-boat.js';
import Ship from '../src/ship.js';

test('can create a patrolBoat class', () => {
  expect(new PatrolBoat()).not.toBeUndefined();
});

test('is a ship extension', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat instanceof Ship).toBe(true);
});

test('has a fixed length of 2', () => {
  const patrolBoat = new PatrolBoat(6);
  expect(patrolBoat).toHaveLength(2);
});

test('is sunk in 2 hits', () => {
  const patrolBoat = new PatrolBoat();
  patrolBoat.hit();
  patrolBoat.hit();
  expect(patrolBoat.isSunk()).toBe(true);
});

test('denys hits after being sunk', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(false);
});
