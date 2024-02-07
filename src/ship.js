export default class Ship {
  #isSunk = false;

  static isValidLength(length) {
    return length > 0;
  }

  constructor(length) {
    if (!Ship.isValidLength(length)) {
      throw new Error('Invalid length. 1 is minimum ship length');
    }

    this.length = length;
    this.hitsCount = 0;
  }

  hit() {
    if (this.#isSunk) return;

    this.hitsCount += 1;
    if (this.isSunk()) this.#isSunk = true;
  }

  isSunk() {
    return this.hitsCount === this.length;
  }
}
