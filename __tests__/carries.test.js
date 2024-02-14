import Carrier from '../src/carrier';
import Ship from '../src/ship';

it('can create a carrier class', () => {
  expect(new Carrier()).not.toBeUndefined();
});

it('is a ship extension', () => {
  const carrier = new Carrier();
  expect(carrier instanceof Ship).toBe(true);
});
