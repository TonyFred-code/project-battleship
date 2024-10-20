import Carrier from '../src/carrier.js';

describe('Carrier Class', () => {
  let carrier;

  beforeEach(() => {
    carrier = new Carrier();
  });

  test('should create a carrier class ship with correct size and name', () => {
    expect(carrier.size).toBe(5);
    expect(carrier.name).toBe('carrier');
  });
});
