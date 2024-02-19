const Ship = require('../src/ship');

it('create new ship', () => {
  expect(new Ship(2)).not.toBeUndefined();
});

it('ship has a length', () => {
  expect(new Ship(3)).toHaveLength(3);
});

it('ship stores number of times hit', () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hitsCount).toBe(1);
});

it('ship knows whether or not it is sunk', () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

it('disallows zero or lower ship length', () => {
  const tryErrorShip = () => new Ship(-2);

  expect(() => {
    tryErrorShip();
  }).toThrow();
});

it('ship hit() function increase number of hits', () => {
  const ship = new Ship(3);
  expect(ship.hitsCount).toBe(0);
  ship.hit();
  expect(ship.hitsCount).toBe(1);
});

it('ship isSunk() function checks if ship is sunk', () => {
  const ship = new Ship(1);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

it('denies hits after ship is sunk', () => {
  const ship = new Ship(1);
  expect(ship.hit()).toBe(true);
  expect(ship.isSunk()).toBe(true);
  expect(ship.hit()).toBe(false);
});
