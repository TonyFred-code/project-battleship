import Ship from '../src/ship';

it('create new ship', () => {
  expect(new Ship(2)).not.toBeUndefined();
});

it('ship has a length', () => {
  expect(new Ship(3)).toHaveLength(3);
});

it.todo('ship stores number of times hit');

it.todo('ship knows whether or not it is sunk');

it.todo('ship hit() function increase number of hits');

it.todo('ship isSunk() function checks if ship is sunk');
