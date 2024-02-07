export default class Ship {
  #isSunk = false;

  constructor(length) {
    this.length = length;
    this.hitsCount = 0;
  }

  hit() {
    if (this.#isSunk) return;

    this.hitsCount += 1;
    if (this.hitsCount === this.length) this.#isSunk = true;
  }

  isSunk() {
    return this.hitsCount === this.length;
  }
}
