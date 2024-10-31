export default class Ship {
  #size;

  #hitsCount = 0;

  #name = '';

  #orientation = '';

  #placeHead = {
    x: null,
    y: null,
  };

  static isValidLength(length) {
    return length > 0;
  }

  static isValidOrientation(orientation) {
    const regExp = /^(horizontal|vertical)$/i;
    return (
      typeof orientation === 'string' &&
      orientation.trim() !== '' &&
      regExp.test(orientation)
    );
  }

  constructor(length, name) {
    if (!Ship.isValidLength(length)) {
      throw new Error('Invalid length. 1 is minimum ship length');
    }

    this.#size = length;
    this.#name = name;
  }

  #HasPlaceOrigin() {
    const { x, y } = this.#placeHead;

    return x !== null && y !== null;
  }

  hit() {
    if (this.isSunk()) return -1;

    this.#hitsCount += 1;
    if (this.isSunk()) {
      return 2;
    }

    return 1;
  }

  get name() {
    return this.#name;
  }

  get hitsCount() {
    return this.#hitsCount;
  }

  get size() {
    return this.#size;
  }

  get shipInfo() {
    const hasPlaceOrigin = this.#HasPlaceOrigin();
    const orientation = this.assignedOrientation;
    const { size, name } = this;
    const sunk = this.isSunk();

    return {
      hasPlaceOrigin,
      orientation,
      size,
      name,
      sunk,
    };
  }

  isSunk() {
    return this.#hitsCount === this.#size;
  }

  /**
   * Specifies the ship origin (x, y)
   * @param {number} x - The x-coordinate of the Ship
   * @param {number} y - The y-coordinate of the Ship
   * @throws {Error} Will throw if x or y is negative or non-numeric
   */
  assignPlaceOrigin(x, y) {
    if (typeof x !== 'number' || x < 0) {
      throw new Error(
        'Invalid x-coordinate: x coordinate must be greater than or equal to 0',
      );
    }

    if (typeof y !== 'number' || y < 0) {
      throw new Error(
        'Invalid y-coordinate: y coordinate must be greater than or equal to 0',
      );
    }

    if (this.#HasPlaceOrigin()) {
      throw new Error(
        'Ship Placed by a previous call: Remove ship before replacing at new origin',
      );
    }

    this.#placeHead.x = x;
    this.#placeHead.y = y;
  }

  removeAssignedPlaceOrigin() {
    if (this.#HasPlaceOrigin) {
      this.#placeHead.x = null;
      this.#placeHead.y = null;
    }
  }

  get assignedPlaceOrigin() {
    const { x, y } = this.#placeHead;

    return {
      x,
      y,
    };
  }

  /**
   * Assigns orientation to ship (HORIZONTAL/VERTICAL)
   * @param {string} orientation - The orientation ship is to take
   * @throws {Error} will throw an exception if orientation is invalid
   */
  assignOrientation(orientation) {
    if (!Ship.isValidOrientation(orientation)) {
      throw new Error(
        'Invalid Orientation: Expects valid string with value (HORIZONTAL/VERTICAL)',
      );
    }

    this.#orientation = orientation.toUpperCase();
  }

  removeAssignedOrientation() {
    this.#orientation = '';
  }

  get assignedOrientation() {
    return this.#orientation;
  }
}
