const Ship = require('../src/ship');

test('create new ship', () => {
  expect(new Ship()).toNotBeUndefined();
});
