export default class Ship {
  #isSunk = false;

  static isValidLength(length) {
    return length > 0;
  }

  constructor(length, name) {
    if (!Ship.isValidLength(length)) {
      throw new Error('Invalid length. 1 is minimum ship length');
    }

    this.length = length;
    this.hitsCount = 0;
    this.name = name;
  }

  hit() {
    if (this.#isSunk) return -1;

    this.hitsCount += 1;
    if (this.isSunk()) {
      this.#isSunk = true;
      return 2;
    }

    return 1;
  }

  isSunk() {
    return this.hitsCount === this.length;
  }
}
