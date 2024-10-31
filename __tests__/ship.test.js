import Ship from '../src/ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2, 'test');
  });

  describe('isValidLength', () => {
    test('should return false if given non-numeric length', () => {
      expect(Ship.isValidLength('s')).toBe(false);
    });

    test('should return false if given negative number', () => {
      expect(Ship.isValidLength(-1)).toBe(false);
    });

    test('should return false if given a value less than 1', () => {
      expect(Ship.isValidLength(0)).toBe(false);
    });

    test('should return true if given a number greater than 1', () => {
      expect(Ship.isValidLength(2)).toBe(true);
    });
  });

  describe('isValidOrientation', () => {
    test('should return true if given invalid orientation', () => {
      expect(Ship.isValidOrientation('invalid')).toBe(false);
    });

    test('should return false if given non string orientation', () => {
      expect(Ship.isValidOrientation({})).toBe(false);
    });

    test('should return false if given empty string as orientation', () => {
      expect(Ship.isValidOrientation('')).toBe(false);
    });

    test('should return true if given valid orientation', () => {
      expect(Ship.isValidOrientation('horizontal')).toBe(true);
      expect(Ship.isValidOrientation('vertical')).toBe(true);
    });
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

  describe('shipInfo', () => {
    test('should return specifications regarding ship', () => {
      const { shipInfo } = ship;

      expect(shipInfo).toHaveProperty('hasPlaceOrigin', false);
      expect(shipInfo).toHaveProperty('orientation', '');
      expect(shipInfo).toHaveProperty('size', 2);
      expect(shipInfo).toHaveProperty('name');
      expect(shipInfo).toHaveProperty('sunk', false);

      const { name } = shipInfo;

      expect(name).toMatch(/test/i);
    });

    test('should reflect changes to carrier', () => {
      ship.assignOrientation('horizontal');
      ship.assignPlaceOrigin(0, 0);
      ship.hit();
      ship.hit();

      const { shipInfo } = ship;

      expect(shipInfo).toHaveProperty('hasPlaceOrigin', true);
      expect(shipInfo).toHaveProperty('orientation');
      expect(shipInfo).toHaveProperty('sunk', true);

      const { orientation } = shipInfo;

      expect(orientation).toMatch(/horizontal/i);
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

  describe('assignOrientation', () => {
    test('should throw error if given invalid orientation', () => {
      expect(() => {
        ship.assignOrientation('INVALID');
      }).toThrow(/invalid/i);
    });

    test('should throw error if given empty string or non-string orientation', () => {
      expect(() => {
        ship.assignOrientation(0);
      }).toThrow(/invalid/i);

      expect(() => {
        ship.assignOrientation('');
      }).toThrow(/invalid/i);
    });

    test('should assign orientation if given valid orientation', () => {
      ship.assignOrientation('horizontal');

      expect(ship.assignedOrientation).toMatch(/horizontal/i);

      ship.assignOrientation('vertical');

      expect(ship.assignedOrientation).toMatch(/vertical/i);
    });
  });

  describe('assignedOrientation', () => {
    test('should return assigned orientation', () => {
      ship.assignOrientation('horizontal');

      expect(ship.assignedOrientation).toMatch(/horizontal/i);

      ship.assignOrientation('vertical');

      expect(ship.assignedOrientation).toMatch(/vertical/i);
    });

    test('should return empty string if orientation has not been assigned', () => {
      expect(ship.assignedOrientation).toBe('');
    });
  });

  describe('removeAssignedOrientation', () => {
    test('should remove assigned orientation', () => {
      ship.assignOrientation('horizontal');
      ship.removeAssignedOrientation();

      expect(ship.assignedOrientation).toBe('');
    });

    test('should work fine if ship has no orientation', () => {
      ship.removeAssignedOrientation();

      expect(ship.assignedOrientation).toBe('');
    });
  });
});
