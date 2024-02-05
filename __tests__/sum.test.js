const sum = require('../src/sum');

test('returns sum', () => {
  expect(sum(1, 2)).toBe(3);
});
