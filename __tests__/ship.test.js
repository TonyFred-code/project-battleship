import Ship from '../src/ship';

it('create new ship', () => {
  expect(new Ship(2)).not.toBeUndefined();
});

it.todo('ship has a length');

it.todo('ship stores number of times hit');

it.todo('ship knows whether or not it is sunk');
