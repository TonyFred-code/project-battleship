export default class Ship {
  constructor(length) {
    this.length = length;
    this.isSunk = false;
    this.hitsCount = 0;
  }

  hit() {
    if (this.isSunk) return;

    this.hitsCount += 1;
    if (this.hitsCount === this.length) this.isSunk = true;
  }
}
