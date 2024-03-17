import Carrier from './carrier.js';
import BattleShip from './battleship.js';
import Destroyer from './destroyer.js';
import SubMarine from './submarine.js';
import PatrolBoat from './patrol-boat.js';
import Node from './board-node.js';

export default class GameBoard {
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

    // const toBeOccupied = this.#getToBeOccupied(x, y, orientation);

    const node = this.board[y * this.BOARD_SIZE + x];
    if (node.isHit || node.isOccupied || node.isNeighboringOccupied)
      return false;

    return true;
  }

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

  #isValidOrientation(orientation) {
    return orientation === this.#HORIZONTAL || orientation === this.#VERTICAL;
  }

  #checkNodeLocations(nodeLocations) {
    // let allValid = true;

    // nodeLocations.forEach((nodeLocation) => {
    //   const [nx, ny] = nodeLocation;
    //   if (!this.#canPlaceShip(nx, ny)) {
    //     allValid = false;
    //   }
    // });

    return nodeLocations.every((nodeLoc) => {
      const [nx, ny] = nodeLoc;
      return this.#canPlaceShip(nx, ny);
    });

    // return allValid;
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

  removeCarrier() {
    const { occupying } = this.#CARRIER_INFO;

    occupying.forEach((location) => {
      const [nx, ny] = location;

      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = false;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = false;
      });
    });
    this.#CARRIER_INFO.occupying = [];
  }

  carrierPlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = this.#CARRIER_INFO;

    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#checkNodeLocations(toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  carrierAutoPlace(orientation) {
    if (!this.#isValidOrientation(orientation)) return {};

    const available = this.carrierPlacement(orientation);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    const [x, y] = placeHead;

    const { size } = this.#CARRIER_INFO;

    const occupyingNodeLoc = this.#getToBeOccupied(size, x, y, orientation);

    this.placeCarrier(x, y, orientation);

    return {
      orientation,
      placeHead,
      occupyingNodeLoc,
    };
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

  removeBattleShip() {
    const { occupying } = this.#BATTLESHIP_INFO;

    occupying.forEach((location) => {
      const [nx, ny] = location;

      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = false;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = false;
      });
    });
    this.#BATTLESHIP_INFO.occupying = [];
  }

  battleShipPlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = this.#BATTLESHIP_INFO;

    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#checkNodeLocations(toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  battleShipAutoPlace(orientation) {
    if (!this.#isValidOrientation(orientation)) return {};

    const available = this.battleShipPlacement(orientation);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    const [x, y] = placeHead;

    const { size } = this.#BATTLESHIP_INFO;

    const occupyingNodeLoc = this.#getToBeOccupied(size, x, y, orientation);

    this.placeBattleShip(x, y, orientation);

    return {
      orientation,
      placeHead,
      occupyingNodeLoc,
    };
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

  removeDestroyer() {
    const { occupying } = this.#DESTROYER_INFO;

    occupying.forEach((location) => {
      const [nx, ny] = location;

      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = false;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = false;
      });
    });
    this.#DESTROYER_INFO.occupying = [];
  }

  destroyerPlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = this.#DESTROYER_INFO;

    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#checkNodeLocations(toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  destroyerAutoPlace(orientation) {
    if (!this.#isValidOrientation(orientation)) return {};

    const available = this.destroyerPlacement(orientation);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    const [x, y] = placeHead;

    const { size } = this.#DESTROYER_INFO;

    const occupyingNodeLoc = this.#getToBeOccupied(size, x, y, orientation);

    this.placeDestroyer(x, y, orientation);

    return {
      orientation,
      placeHead,
      occupyingNodeLoc,
    };
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

  removeSubMarine() {
    const { occupying } = this.#SUBMARINE_INFO;

    occupying.forEach((location) => {
      const [nx, ny] = location;

      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = false;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = false;
      });
    });
    this.#SUBMARINE_INFO.occupying = [];
  }

  subMarinePlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = this.#SUBMARINE_INFO;

    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#checkNodeLocations(toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  subMarineAutoPlace(orientation) {
    if (!this.#isValidOrientation(orientation)) return {};

    const available = this.subMarinePlacement(orientation);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    const [x, y] = placeHead;

    const { size } = this.#SUBMARINE_INFO;

    const occupyingNodeLoc = this.#getToBeOccupied(size, x, y, orientation);

    this.placeSubMarine(x, y, orientation);

    return {
      orientation,
      placeHead,
      occupyingNodeLoc,
    };
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

  removePatrolBoat() {
    const { occupying } = this.#PATROL_BOAT_INFO;

    occupying.forEach((location) => {
      const [nx, ny] = location;

      const node = this.board[ny * this.BOARD_SIZE + nx];
      node.isOccupied = false;
      node.neighbors.forEach((nodeLoc) => {
        const [nnx, nny] = nodeLoc;
        this.board[nny * this.BOARD_SIZE + nnx].isNeighboringOccupied = false;
      });
    });
    this.#PATROL_BOAT_INFO.occupying = [];
  }

  patrolBoatPlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = this.#PATROL_BOAT_INFO;

    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#checkNodeLocations(toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  patrolBoatAutoPlace(orientation) {
    if (!this.#isValidOrientation(orientation)) return {};

    const available = this.patrolBoatPlacement(orientation);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    const [x, y] = placeHead;

    const { size } = this.#PATROL_BOAT_INFO;

    const occupyingNodeLoc = this.#getToBeOccupied(size, x, y, orientation);

    this.placePatrolBoat(x, y, orientation);

    return {
      orientation,
      placeHead,
      occupyingNodeLoc,
    };
  }

  removeAllShips() {
    this.removeCarrier();
    this.removeBattleShip();
    this.removeDestroyer();
    this.removeSubMarine();
    this.removePatrolBoat();
  }

  allShipsPlacement() {
    function rndOrientation() {
      const rnd = Math.floor(Math.random() * 10);

      if (rnd % 2 === 0) return 'vertical';

      return 'horizontal';
    }

    this.carrierAutoPlace(rndOrientation());
    this.battleShipAutoPlace(rndOrientation());
    this.destroyerAutoPlace(rndOrientation());
    this.subMarineAutoPlace(rndOrientation());
    this.patrolBoatAutoPlace(rndOrientation());
    // return Array(5);
  }

  receiveAttack(x, y) {
    if (!this.#isValidCoordinate(x, y)) return -1;

    if (!this.#allShipOnBoard()) return -1;

    const node = this.board[y * this.BOARD_SIZE + x];

    if (node.isHit) {
      return -1;
    }

    node.isHit = true;
    if (node.isOccupied) {
      node.isOccupied.hit();
      return 1;
    }

    return 0;
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

  get isAllShipSunk() {
    const ships = Object.values(this.shipYard);

    const sunkShips = ships.filter((ship) => ship.isSunk());

    return sunkShips.length === ships.length;
  }

  get carrierSunk() {
    return this.shipYard.carrier.isSunk();
  }

  get battleShipSunk() {
    return this.shipYard.battleship.isSunk();
  }

  get destroyerSunk() {
    return this.shipYard.destroyer.isSunk();
  }

  get submarineSunk() {
    return this.shipYard.submarine.isSunk();
  }

  get patrolBoatSunk() {
    return this.shipYard.patrolBoat.isSunk();
  }

  get missedShots() {
    const shots = this.board.filter((node) => node.isHit);
    const missedShots = shots.filter((shot) => !shot.isOccupied);
    return missedShots;
  }

  get validMoves() {
    const available = this.board.filter((node) => !node.isHit);

    return available;
  }
}

// const gameBoard = new GameBoard();

// function rndOrientation() {
//   const rnd = Math.floor(Math.random() * 10);

//   if (rnd % 2 === 0) return 'vertical';

//   return 'horizontal';
// }
// const carrierPlaceInfo = gameBoard.carrierAutoPlace(rndOrientation());

// const battleShipPlaceInfo = gameBoard.battleShipAutoPlace(rndOrientation());

// const destroyerPlaceInfo = gameBoard.destroyerAutoPlace(rndOrientation());

// const subMarinePlaceInfo = gameBoard.subMarineAutoPlace(rndOrientation());

// const patrolBoatPlaceInfo = gameBoard.patrolBoatAutoPlace(rndOrientation());

// const carrierOccupying = carrierPlaceInfo.occupyingNodeLoc;

// const carrierHits = new Set();

// carrierOccupying.forEach((nodeLoc) => {
//   const [x, y] = nodeLoc;

//   carrierHits.add(gameBoard.receiveAttack(x, y));
// });
