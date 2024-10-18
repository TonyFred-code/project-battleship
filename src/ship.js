export default class Ship {
  #isSunk = false;

  #size;

  #hitsCount = 0;

  #name = '';

  static isValidLength(length) {
    return length > 0;
  }

  constructor(length, name) {
    if (!Ship.isValidLength(length)) {
      throw new Error('Invalid length. 1 is minimum ship length');
    }

    this.#size = length;
    this.#name = name;
  }

  hit() {
    if (this.isSunk()) return -1;

    this.#hitsCount += 1;
    if (this.isSunk()) {
      this.#isSunk = true;
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

  isSunk() {
    return this.#hitsCount === this.#size;
  }
}
