import Ship from './ship.js';

export default class Node {
  /**
   * Creates an instance of Node.
   * @param {number} x - The x-coordinate of the node.
   * @param {number} y - The y-coordinate of the node.
   * @throws {Error} Will throw an error if x or y are negative.
   */

  #occupant = null;

  #isHit = false;

  #neighbors = [];

  constructor(x, y) {
    if (x < 0 || y < 0) {
      throw new Error('Coordinates must be non-negative integers.');
    }
    this.address = [x, y];
  }

  /**
   * Adds a neighbor to the node.
   * @param {Node} neighbor - The neighboring node to add.
   */
  addNeighbor(neighbor) {
    if (neighbor instanceof Node) {
      this.#neighbors.push(neighbor);
      return true;
    }

    return false;
  }

  /**
   * Returns neighbors attached to node.
   */
  get neighbors() {
    return this.#neighbors;
  }

  /**
   * Hits the node, marking it as hit.
   */
  hit() {
    if (this.isHit) return -1;

    this.#isHit = true;

    if (this.isNeighboringSunk) return 3;

    if (!this.isOccupied) return 0;

    return this.#occupant.hit();
  }

  /**
   * Sets the node as occupied.
   */
  occupy(ship) {
    if (this.isOccupied) return false;

    if (ship instanceof Ship) {
      this.#occupant = ship;
      return true;
    }

    return false;
  }

  /**
   * Returns the current occupant
   */
  get occupant() {
    return this.#occupant;
  }

  get isOccupied() {
    return this.#occupant !== null;
  }

  get isNeighboringOccupied() {
    if (this.#neighbors.length === 0) return false;

    const noOccupiedNeighbor = this.#neighbors.every(
      (neighbor) => !neighbor.isOccupied,
    );

    return !noOccupiedNeighbor;
  }

  get isNeighboringSunk() {
    if (this.#neighbors.length === 0) return false;

    const notNeighboringSunk = this.#neighbors.every(
      (neighbor) => !neighbor.occupantShipSunk,
    );

    return !notNeighboringSunk;
  }

  get isHit() {
    return this.#isHit;
  }

  get occupantShipSunk() {
    if (this.isOccupied) {
      return this.#occupant.isSunk();
    }

    return false;
  }

  removeOccupant() {
    this.#occupant = null;
  }
}
