const Ship = require('./ship');
const Carrier = require('./carrier');
const BattleShip = require('./battleship');
const Destroyer = require('./destroyer');
const SubMarine = require('./submarine');
const PatrolBoat = require('./patrol-boat');
const Node = require('./board-node');

class GameBoard {
  BOARD_SIZE = 10;

  #HORIZONTAL = 'horizontal';

  #VERTICAL = 'vertical';

  #CARRIER_INFO = {
    isOnBoard: false,
    occupying: [],
  };

  #BATTLESHIP_INFO = {
    isOnBoard: false,
    occupying: [],
  };

  #DESTROYER_INFO = {
    isOnBoard: false,
    occupying: [],
  };

  #SUBMARINE_INFO = {
    isOnBoard: false,
    occupying: [],
  };

  #PATROL_BOAT_INFO = {
    isOnBoard: false,
    occupying: [],
  };

  constructor() {
    this.shipYard = {};
    this.ships = [];
    this.board = [];
    this.#buildBoard();
    this.#initializeShips();
  }

  #initializeShips() {
    const carrier = new Carrier();
    this.shipYard.carrier = carrier;
    this.#CARRIER_INFO.size = carrier.length;

    const battleship = new BattleShip();
    this.shipYard.battleship = battleship;
    this.#BATTLESHIP_INFO.size = battleship.length;

    const destroyer = new Destroyer();
    this.shipYard.destroyer = destroyer;
    this.#DESTROYER_INFO.size = destroyer.length;

    const submarine = new SubMarine();
    this.shipYard.submarine = submarine;
    this.#SUBMARINE_INFO.size = submarine.length;

    const patrolBoat = new PatrolBoat();
    this.shipYard.patrolBoat = patrolBoat;
    this.#PATROL_BOAT_INFO.size = patrolBoat.length;
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
    if (!this.#isValidOrientation(orientation)) {
      return [];
    }

    const toBeOccupied = [[x, y]];
    if (orientation === 'vertical') {
      for (let i = 0; i < size - 1; i += 1) {
        const occupied = y + i + 1;
        if (occupied < this.BOARD_SIZE) {
          toBeOccupied.push([x, occupied]);
        }
      }
    } else if (orientation === 'horizontal') {
      for (let i = 0; i < size - 1; i += 1) {
        const occupied = x + i + 1;
        if (occupied < this.BOARD_SIZE) {
          toBeOccupied.push([occupied, y]);
        }
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

  #isValidOrientation(orientation) {
    return orientation === this.#HORIZONTAL || orientation === this.#VERTICAL;
  }

  #checkNodeLocation(nodeLoc) {
    const [nx, ny] = nodeLoc;
    return this.#isValidCoordinate(nx, ny) || this.#canPlaceShip(nx, ny);
  }

  #checkNodeLocations(nodeLocations) {
    let allValid = true;

    nodeLocations.forEach((nodeLocation) => {
      const [nx, ny] = nodeLocation;
      if (!this.#isValidCoordinate(nx, ny) || !this.#canPlaceShip(nx, ny)) {
        allValid = false;
      }
    });

    return allValid;
  }

  placeCarrier(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#CARRIER_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    toBeOccupied.forEach((location) => {
      const [nx, ny] = location;

      this.#CARRIER_INFO.occupying.push([nx, ny]);
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = this.shipYard.carrier;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    });

    this.#CARRIER_INFO.isOnBoard = true;

    return true;
  }

  placeBattleShip(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#BATTLESHIP_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    toBeOccupied.forEach((location) => {
      const [nx, ny] = location;

      this.#BATTLESHIP_INFO.occupying.push([nx, ny]);
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = this.shipYard.battleship;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    });

    this.#BATTLESHIP_INFO.isOnBoard = true;
    return true;
  }

  placeDestroyer(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#DESTROYER_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    toBeOccupied.forEach((location) => {
      const [nx, ny] = location;

      this.#DESTROYER_INFO.occupying.push([nx, ny]);
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = this.shipYard.destroyer;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    });

    this.#DESTROYER_INFO.isOnBoard = true;
    return true;
  }

  placeSubMarine(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#DESTROYER_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    toBeOccupied.forEach((location) => {
      const [nx, ny] = location;

      this.#SUBMARINE_INFO.occupying.push([nx, ny]);
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = this.shipYard.submarine;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    });

    this.#SUBMARINE_INFO.isOnBoard = true;
    return true;
  }

  placePatrolBoat(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#PATROL_BOAT_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    toBeOccupied.forEach((location) => {
      const [nx, ny] = location;

      this.#PATROL_BOAT_INFO.occupying.push([nx, ny]);
      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = this.shipYard.patrolBoat;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = true;
      });
    });

    this.#PATROL_BOAT_INFO.isOnBoard = true;
    return true;
  }

  receiveAttack(x, y) {
    if (!this.#isValidCoordinate(x, y)) return false;

    if (!this.#allShipOnBoard()) return false;

    if (this.isAllShipSunk) return false;

    const node = this.board[y * this.BOARD_SIZE + x];

    if (node.isHit) {
      return false;
    }

    node.isHit = true;
    if (node.isOccupied) {
      node.isOccupied.hit();
    }

    return true;
  }

  #allShipOnBoard() {
    return (
      this.#CARRIER_INFO.isOnBoard &&
      this.#BATTLESHIP_INFO.isOnBoard &&
      this.#DESTROYER_INFO.isOnBoard &&
      this.#SUBMARINE_INFO.isOnBoard &&
      this.#PATROL_BOAT_INFO.isOnBoard
    );
  }

  #hasShipOnBoard() {
    return this.ships.length !== 0;
  }

  get isAllShipSunk() {
    const ships = Object.values(this.shipYard);

    const sunkShips = ships.filter((ship) => ship.isSunk());

    return sunkShips.length === ships.length;
  }

  get missedShots() {
    const shots = this.board.filter((node) => node.isHit);
    const missedShots = shots.filter((shot) => !shot.isOccupied);
    return missedShots;
  }
}

module.exports = GameBoard;

const gameBoard = new GameBoard();
gameBoard.receiveAttack(0, 9);
