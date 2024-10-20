import Ship from '../src/ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2, 'test');
  });

  describe('hit', () => {
    test('should return -1 if ship has been sunk', () => {
      ship.hit();
      ship.hit();

      expect(ship.hit()).toBe(-1);
    });

    test('should return 1 if ship is hit without sinking', () => {
      expect(ship.hit()).toBe(1);
    });

    test('should return 2 if hit causes ship to be sunk', () => {
      ship.hit();

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
      expect(ship.size).toBe(2);
    });
  });

  describe('isSunk', () => {
    test('should return false if ship is sunk', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true if ship has been sunk', () => {
      ship.hit();
      ship.hit();

      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('assignPlaceOrigin', () => {
    test('should throw error if x coordinate is negative', () => {
      expect(() => {
        ship.assignPlaceOrigin(-1, 0);
      }).toThrow(/invalid/i);
    });

    test('should throw error if x coordinate is non-numeric', () => {
      expect(() => {
        ship.assignPlaceOrigin('1', 0);
      }).toThrow(/invalid/i);
    });

    test('should throw error if y coordinate is negative', () => {
      expect(() => {
        ship.assignPlaceOrigin(0, -1);
      }).toThrow(/invalid/i);
    });

    test('should throw error if y coordinate is non-numeric', () => {
      expect(() => {
        ship.assignPlaceOrigin(0, '1');
      }).toThrow(/invalid/i);
    });

    test('should throw error if ship has been placed', () => {
      ship.assignPlaceOrigin(0, 1);

      expect(() => {
        ship.assignPlaceOrigin(0, 0);
      }).toThrow();
    });

    test('should assign place origin', () => {
      ship.assignPlaceOrigin(0, 1);

      const { x, y } = ship.assignedPlaceOrigin;

      expect(x).toBe(0);
      expect(y).toBe(1);
    });
  });

  describe('assignedPlaceOrigin', () => {
    test('should return place origin assigned to ship', () => {
      expect(ship.assignedPlaceOrigin).toEqual({ x: null, y: null });

      ship.assignPlaceOrigin(0, 1);

      expect(ship.assignedPlaceOrigin).toEqual({ x: 0, y: 1 });
    });
  });

  describe('removeAssignedPlaceOrigin', () => {
    test('should remove previously assigned place origin', () => {
      ship.assignPlaceOrigin(0, 0);

      ship.removeAssignedPlaceOrigin();

      expect(ship.assignedPlaceOrigin).toEqual({ x: null, y: null });
    });

    test('should run fine with an attempt to remove before being placed', () => {
      ship.removeAssignedPlaceOrigin();

      expect(ship.assignedPlaceOrigin).toEqual({ x: null, y: null });
    });
  });
});
