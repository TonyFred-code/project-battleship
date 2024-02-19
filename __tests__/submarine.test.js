const SubMarine = require('../src/submarine');
const Ship = require('../src/ship');

it('can create a submarine class', () => {
  expect(new SubMarine()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const submarine = new SubMarine();
  expect(submarine instanceof Ship).toBe(true);
});

it('has a fixed length of 3', () => {
  const submarine = new SubMarine(6);
  expect(submarine).toHaveLength(3);
});

it('is sunk in 3 hits', () => {
  const submarine = new SubMarine();
  submarine.hit();
  submarine.hit();
  submarine.hit();
  expect(submarine.isSunk()).toBe(true);
});

it('denys hits after being sunk', () => {
  const submarine = new SubMarine();
  expect(submarine.hit()).toBe(true);
  expect(submarine.hit()).toBe(true);
  expect(submarine.hit()).toBe(true);
  expect(submarine.hit()).toBe(false);
});
