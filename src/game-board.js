import Ship from './ship';

export default class GameBoard {
  #COORDINATE_ERR_MSG = `Invalid Coordinate. 'x, y' coordinate must both be greater
    zero and less than or equal to 10`;

  #SHIP_COORDINATE_SIZE_LESS_ERR_MSG = 'Coordinate size too low to place ship';

  #SHIP_COORDINATE_SIZE_HIGH_ERR_MSG =
    'Coordinate size too large to place ship';

  BOARD_SIZE = 10;

  constructor() {
    this.ships = [];
    this.board = {};
    this.#buildBoard();
  }

  #buildBoard() {
    for (let y = 1; y <= this.BOARD_SIZE; y += 1) {
      for (let x = 1; x <= this.BOARD_SIZE; x += 1) {
        const boardNode = {
          occupied: false,
          isHit: false,
        };
        this.board[`${x},${y}`] = boardNode;
      }
    }
  }

  static isValidCoordinate(x, y) {
    return x > 0 && x <= this.BOARD_SIZE && y > 0 && y <= this.BOARD_SIZE;
  }

  static canPlaceShip(size, x, y, shipOrientation) {}

  placeShip(size, x, y, orientation = 'horizontal') {
    if (!GameBoard.isValidCoordinate(x, y)) {
      throw new Error(this.#COORDINATE_ERR_MSG);
    }

    if (!GameBoard.canPlaceShip(size, x, y)) {
      const sizeDiff = x - y;
      if (sizeDiff > size) {
        throw new Error(this.#SHIP_COORDINATE_SIZE_HIGH_ERR_MSG);
      } else {
        throw new Error(this.#SHIP_COORDINATE_SIZE_LESS_ERR_MSG);
      }
    }

    const ship = new Ship(size);
    this.ships[y * this.BOARD_SIZE + x](ship);

    const node = this.board[`${x},${y}`];
    if (node.occupied) return false;

    node.occupied = true;
    return true;
  }
}
