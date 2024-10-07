import Ship from '../src/ship.js';

test('create new ship', () => {
  expect(new Ship(2)).not.toBeUndefined();
});

test('ship has a length', () => {
  expect(new Ship(3)).toHaveLength(3);
});

test('ship stores number of times hit', () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hitsCount).toBe(1);
});

test('ship knows whether or not it is sunk', () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test('disallows zero or lower ship length', () => {
  const tryErrorShip = () => new Ship(-2);

  expect(() => {
    tryErrorShip();
  }).toThrow();
});

test('ship hit() function increase number of hits', () => {
  const ship = new Ship(3);
  expect(ship.hitsCount).toBe(0);
  ship.hit();
  expect(ship.hitsCount).toBe(1);
});

test('ship isSunk() function checks if ship is sunk', () => {
  const ship = new Ship(1);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test('denies hits after ship is sunk', () => {
  const ship = new Ship(1);
  expect(ship.hit()).toBe(2);
  expect(ship.isSunk()).toBe(true);
  expect(ship.hit()).toBe(-1);
});
