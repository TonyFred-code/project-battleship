import Ship from './ship';
import Carrier from './carrier';
import BattleShip from './battleship';
import Destroyer from './destroyer';
import SubMarine from './submarine';
import PatrolBoat from './patrol-boat';
import Node from './board-node';

export default class GameBoard {
  // #COORDINATE_ERR_MSG = `Invalid Coordinate. 'x, y' coordinate must both be greater
  //   zero and less than or equal to 10`;

  // #SHIP_COORDINATE_SIZE_LESS_ERR_MSG = 'Coordinate size too low to place ship';

  // #SHIP_COORDINATE_SIZE_HIGH_ERR_MSG =
  //   'Coordinate size too large to place ship';

  BOARD_SIZE = 10;
  // #SHIP_YARD_SIZE = 5;

  constructor() {
    this.shipYard = [];
    this.ships = [];
    this.board = [];
    this.#buildBoard();
    this.#initializeShips();
  }

  #initializeShips() {
    const carrier = new Carrier();
    this.shipYard.push(carrier);

    const battleship = new BattleShip();
    this.shipYard.push(battleship);

    const destroyer = new Destroyer();
    this.shipYard.push(destroyer);

    const submarine = new SubMarine();
    this.shipYard.push(submarine);

    const patrolBoat = new PatrolBoat();
    this.shipYard.push(patrolBoat);
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
    if (node.isOccupied || node.isNeighboringOccupied) return false;

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
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = true;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    }

    return true;
  }

  placeCarrier() {}

  placeBattleShip() {}

  placeDestroyer() {}

  placeSubMarine() {}

  placePatrolBoat() {}

  receiveAttack(x, y) {
    if (!this.#isValidCoordinate(x, y)) return false;

    if (!this.#hasShipOnBoard()) return false;

    if (this.isAllShipSunk) return false;

    const node = this.board[y * this.BOARD_SIZE + x];

    if (node.isHit) {
      return false;
    }

    node.isHit = true;
    if (node.isOccupied) {
      this.ships[y * this.BOARD_SIZE + x].hit();
    }

    return true;
  }

  #hasShipOnBoard() {
    return this.ships.length !== 0;
  }

  get isAllShipSunk() {
    const notSunk = this.ships.filter((ship) => !ship.isSunk());
    return notSunk.length === 0;
  }

  get missedShots() {
    const shots = this.board.filter((node) => node.isHit);
    const missedShots = shots.filter((shot) => !shot.isOccupied);
    return missedShots;
  }
}
