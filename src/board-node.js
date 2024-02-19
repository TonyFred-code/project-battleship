class Node {
  constructor(x, y) {
    this.address = [x, y];
    this.neighbors = [];
    this.isHit = false;
    this.isOccupied = false;
    this.isNeighboringOccupied = false;
  }
}

module.exports = Node;
