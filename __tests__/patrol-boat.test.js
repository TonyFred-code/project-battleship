import PatrolBoat from '../src/patrol-boat';
import Ship from '../src/ship';

it('can create a patrolBoat class', () => {
  expect(new PatrolBoat()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat instanceof Ship).toBe(true);
});

it('has a fixed length of 3', () => {
  const patrolBoat = new PatrolBoat(6);
  expect(patrolBoat).toHaveLength(3);
});

it('is sunk in 3 hits', () => {
  const patrolBoat = new PatrolBoat();
  patrolBoat.hit();
  patrolBoat.hit();
  patrolBoat.hit();
  expect(patrolBoat.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const patrolBoat = new PatrolBoat();
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(true);
  expect(patrolBoat.hit()).toBe(false);
});
