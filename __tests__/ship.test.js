import Ship from '../src/ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(1, 'test');
  });

  describe('hit', () => {
    test('should return -1 if ship is has been sunk', () => {
      ship.hit();

      expect(ship.hit()).toBe(-1);
    });

    test('should return 1 if ship is hit without sinking', () => {
      const ship1 = new Ship(2, 'test');

      expect(ship1.hit()).toBe(1);
    });

    test('should return 2 if hit causes ship to be sunk', () => {
      expect(ship.hit()).toBe(2);
    });
  });

  describe('name', () => {
    test('should return name of ship', () => {
      expect(ship.name).toMatch(/test/i);
    });
  });

  describe('hitsCount', () => {
    test('should return number of registered hits', () => {
      expect(ship.hitsCount).toBe(0);

      ship.hit();

      expect(ship.hitsCount).toBe(1);
    });
  });

  describe('size', () => {
    test('should return size of ship', () => {
      expect(ship.size).toBe(1);
    });
  });

  describe('isSunk', () => {
    test('should return false if ship is sunk', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true if ship has been sunk', () => {
      ship.hit();

      expect(ship.isSunk()).toBe(true);
    });
  });
});
