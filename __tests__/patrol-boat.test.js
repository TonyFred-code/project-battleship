import PatrolBoat from '../src/patrol-boat.js';
import Ship from '../src/ship.js';

it('can create a patrolBoat class', () => {
  expect(new PatrolBoat()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat instanceof Ship).toBe(true);
});

it('has a fixed length of 2', () => {
  const patrolBoat = new PatrolBoat(6);
  expect(patrolBoat).toHaveLength(2);
});

it('is sunk in 2 hits', () => {
  const patrolBoat = new PatrolBoat();
  patrolBoat.hit();
  patrolBoat.hit();
  expect(patrolBoat.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(false);
});
