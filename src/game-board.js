import Ship from './ship';
import Node from './board-node';

export default class GameBoard {
  #COORDINATE_ERR_MSG = `Invalid Coordinate. 'x, y' coordinate must both be greater
    zero and less than or equal to 10`;

  #SHIP_COORDINATE_SIZE_LESS_ERR_MSG = 'Coordinate size too low to place ship';

  #SHIP_COORDINATE_SIZE_HIGH_ERR_MSG =
    'Coordinate size too large to place ship';

  BOARD_SIZE = 10;

  constructor() {
    this.ships = [];
    this.board = [];
    this.#buildBoard();
  }

  #buildBoard() {
    for (let y = 0; y < this.BOARD_SIZE; y += 1) {
      for (let x = 0; x < this.BOARD_SIZE; x += 1) {
        const node = new Node(x, y);
        this.#addNeighbors(node);
        this.board[y * this.BOARD_SIZE + x] = node;
      }
    }
  }

  #addNeighbors(node) {
    const { address } = node;
    const [x, y] = address;

    const neighbors = [
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
      [x - 1, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
    ];

    neighbors.forEach((neighbor) => {
      const [nx, ny] = neighbor;
      if (this.#isValidCoordinate(nx, ny)) {
        node.neighbors.push(neighbor);
      }
    });
  }

  #isValidCoordinate(x, y) {
    return x >= 0 && x < this.BOARD_SIZE && y >= 0 && y < this.BOARD_SIZE;
  }

  #canPlaceShip(x, y) {
    if (!this.#isValidCoordinate(x, y)) {
      return false;
    }

    const node = this.board[y * this.BOARD_SIZE + x];
    if (node.isOccupied) return false;

    // eslint-disable-next-line consistent-return
    node.neighbors.forEach((neighbor) => {
      const [nx, ny] = neighbor;
      const neighborNode = this.board[ny * this.BOARD_SIZE + nx];
      if (neighborNode.isOccupied) return false;
    });

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  #getToBeOccupied(size, x, y, orientation) {
    const toBeOccupied = [[x, y]];
    if (orientation === 'vertical') {
      for (let i = 0; i < size; i += 1) {
        toBeOccupied.push([x, y + i + 1]);
      }
    } else {
      for (let i = 0; i < size; i += 1) {
        toBeOccupied.push([x + i + 1, y]);
      }
    }

    return toBeOccupied;
  }

  placeShip(size, x, y, orientation = 'horizontal') {
    if (!this.#isValidCoordinate(x, y)) {
      return false;
    }

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);
    // eslint-disable-next-line no-restricted-syntax
    for (const nodeLocation of toBeOccupied) {
      const [nx, ny] = nodeLocation;
      if (!this.#isValidCoordinate(nx, ny) || !this.#canPlaceShip(nx, ny)) {
        return false;
      }
    }

    const ship = new Ship(size);
    // eslint-disable-next-line no-restricted-syntax
    for (const nodeLocation of toBeOccupied) {
      const [nx, ny] = nodeLocation;
      this.ships[ny * this.BOARD_SIZE + nx] = ship;
      this.board[ny * this.BOARD_SIZE + nx].isOccupied = true;
    }

    return true;
  }
}
