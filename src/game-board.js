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

  #transform(x, y) {
    return y + this.BOARD_SIZE * x;
  }

  #CARRIER_INFO = {
    isOnBoard: false,
    occupying: [],
    shipHead: [],
    orientation: '',
    size: 0,
    exemptShipHead: [],
    autoRemoved: false,
  };

  #BATTLESHIP_INFO = {
    isOnBoard: false,
    occupying: [],
    shipHead: [],
    orientation: '',
    size: 0,
  };

  #DESTROYER_INFO = {
    isOnBoard: false,
    occupying: [],
    shipHead: [],
    orientation: '',
    size: 0,
  };

  #SUBMARINE_INFO = {
    isOnBoard: false,
    occupying: [],
    shipHead: [],
    orientation: '',
    size: 0,
  };

  #PATROL_BOAT_INFO = {
    isOnBoard: false,
    occupying: [],
    shipHead: [],
    orientation: '',
    size: 0,
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
    if (node.isHit || node.isOccupied || node.isNeighboringOccupied) {
      return false;
    }

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
        if (this.#isValidCoordinate(x, occupied)) {
          toBeOccupied.push([x, occupied]);
        }
      }
    } else if (orientation === 'horizontal') {
      for (let i = 0; i < size - 1; i += 1) {
        const occupied = x + i + 1;
        if (this.#isValidCoordinate(occupied, y)) {
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
    return nodeLocations.every((nodeLoc) => {
      const [nx, ny] = nodeLoc;
      return this.#canPlaceShip(nx, ny);
    });

    // return allValid;
  }

  #CarrierExempt(shipHead, orientation) {
    const exemptShipHead = shipHead;
    const exemptOrientation = orientation;
    this.#CARRIER_INFO.exemptShipHead.push({
      exemptShipHead,
      exemptOrientation,
    });
  }

  #isCarrierExempted(shipHead, orientation) {
    const [shipHeadX, shipHeadY] = shipHead;
    const transformedShipHead = this.#transform(shipHeadX, shipHeadY);

    // let isExempted = false;

    return this.#CARRIER_INFO.exemptShipHead.some((exempt) => {
      const { exemptShipHead, exemptOrientation } = exempt;
      const [x, y] = exemptShipHead;
      const transformed = this.#transform(x, y);

      return (
        transformed === transformedShipHead && exemptOrientation === orientation
      );
    });

    // this.#CARRIER_INFO.exemptShipHead.forEach((exempt) => {
    //   const { exemptShipHead, exemptOrientation } = exempt;
    //   const [x, y] = exemptShipHead;
    //   const transformed = this.#transform(x, y);

    //   if (
    //     transformed === transformedShipHead &&
    //     exemptOrientation === orientation
    //   ) {
    //     isExempted = true;
    //   }
    // });

    // return isExempted;
  }

  #storeExemptConfig() {
    if (this.#CARRIER_INFO.isOnBoard) {
      const { shipHead, orientation } = this.#CARRIER_INFO;
      // const [x, y] = shipHead;
      this.#CarrierExempt(shipHead, orientation);
    }
  }

  #reformPlacement() {
    if (this.#CARRIER_INFO.autoRemoved) {
      this.carrierAutoPlace();
      this.#CARRIER_INFO.autoRemoved = false;
    }
  }

  canBeCarrierShipHead(x, y, orientation) {
    if (!this.#isValidOrientation(orientation)) return false;
    const { size } = this.#CARRIER_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (!this.#checkNodeLocations(toBeOccupied)) return false;

    return true;
  }

  placeCarrier(x, y, orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return false;

    const { size } = this.#CARRIER_INFO;

    const toBeOccupied = this.#getToBeOccupied(size, x, y, orientation);

    if (toBeOccupied.length < size) return false;

    if (this.#CARRIER_INFO.isOnBoard) {
      this.removeCarrier();
    }

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
    this.#CARRIER_INFO.shipHead.push(x, y);
    this.#CARRIER_INFO.orientation = orientation;

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
    this.#CARRIER_INFO.isOnBoard = false;
    this.#CARRIER_INFO.shipHead = [];
    this.#CARRIER_INFO.orientation = '';
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

  carrierAutoPlace() {
    // Randomly choose orientation
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

    const available = this.carrierPlacement(orientation);

    // if no space to place ship, reform
    if (available.length === 0) {
      // this.#storeExemptConfig();
      // this.removeAllShips();
      // this.#reformPlacement();
      // return this.carrierAutoPlace();
      console.table(this.board);
    }

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);
      const element = array[rnd];

      return {
        element,
        index: rnd,
      };
    }
    const { size } = this.#CARRIER_INFO;

    // let placed = false;

    const { index } = getRndElement(available);

    const [placeHead] = available.splice(index, 1);
    console.log(placeHead);

    const [x, y] = placeHead;

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

    if (this.#BATTLESHIP_INFO.isOnBoard) {
      this.removeBattleShip();
    }

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
    this.#BATTLESHIP_INFO.shipHead.push(x, y);
    this.#BATTLESHIP_INFO.orientation = orientation;
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
    this.#BATTLESHIP_INFO.isOnBoard = false;
    this.#BATTLESHIP_INFO.orientation = '';
    this.#BATTLESHIP_INFO.shipHead = [];
  }

  battleShipPlacement(orientation = 'horizontal') {
    if (!this.#isValidOrientation(orientation)) return [];

    const availableNodes = this.board.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    // console.table(availableNodes);

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
    // console.log(placeHead);

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

    if (this.#DESTROYER_INFO.isOnBoard) {
      this.removeDestroyer();
    }

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
    this.#DESTROYER_INFO.shipHead.push(x, y);
    this.#DESTROYER_INFO.orientation = orientation;
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
    this.#DESTROYER_INFO.isOnBoard = false;
    this.#DESTROYER_INFO.orientation = '';
    this.#DESTROYER_INFO.shipHead = [];
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

    // console.table(available);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);

    // console.log(placeHead);

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

    if (this.#SUBMARINE_INFO.isOnBoard) {
      this.removeSubMarine();
    }

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
    this.#SUBMARINE_INFO.shipHead.push(x, y);
    this.#SUBMARINE_INFO.orientation = orientation;
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
    this.#SUBMARINE_INFO.isOnBoard = false;
    this.#SUBMARINE_INFO.orientation = '';
    this.#SUBMARINE_INFO.shipHead = [];
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

    // console.log(available);

    function getRndElement(array) {
      const rnd = Math.floor(Math.random() * array.length);

      return array[rnd];
    }

    const placeHead = getRndElement(available);
    // console.table(placeHead);

    if (placeHead.length === 0) {
      console.log(available);
    }

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

    if (this.#PATROL_BOAT_INFO.isOnBoard) {
      this.removePatrolBoat();
    }

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
    this.#PATROL_BOAT_INFO.shipHead.push(x, y);
    this.#PATROL_BOAT_INFO.orientation = orientation;
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
    this.#PATROL_BOAT_INFO.isOnBoard = false;
    this.#PATROL_BOAT_INFO.orientation = '';
    this.#PATROL_BOAT_INFO.shipHead = [];
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

    // console.table(placeHead);
    // console.table(available);

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
    const placementInfo = [];

    placementInfo.push(this.carrierAutoPlace(rndOrientation()));
    placementInfo.push(this.battleShipAutoPlace(rndOrientation()));
    placementInfo.push(this.destroyerAutoPlace(rndOrientation()));
    placementInfo.push(this.subMarineAutoPlace(rndOrientation()));
    placementInfo.push(this.patrolBoatAutoPlace(rndOrientation()));

    return placementInfo;
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

  get shipPlacements() {
    const carrierPlacement = {
      shipHead: this.#CARRIER_INFO.shipHead,
      isOnBoard: this.#CARRIER_INFO.isOnBoard,
      occupyingLoc: this.#CARRIER_INFO.occupying,
      orientation: this.#CARRIER_INFO.orientation,
    };

    const battleShipPlacement = {
      shipHead: this.#BATTLESHIP_INFO.shipHead,
      isOnBoard: this.#BATTLESHIP_INFO.isOnBoard,
      occupyingLoc: this.#BATTLESHIP_INFO.occupying,
      orientation: this.#BATTLESHIP_INFO.orientation,
    };

    const destroyerPlacement = {
      shipHead: this.#DESTROYER_INFO.shipHead,
      isOnBoard: this.#DESTROYER_INFO.isOnBoard,
      occupyingLoc: this.#DESTROYER_INFO.occupying,
      orientation: this.#DESTROYER_INFO.orientation,
    };

    const subMarinePlacement = {
      shipHead: this.#SUBMARINE_INFO.shipHead,
      isOnBoard: this.#SUBMARINE_INFO.isOnBoard,
      occupyingLoc: this.#SUBMARINE_INFO.occupying,
      orientation: this.#SUBMARINE_INFO.orientation,
    };

    const patrolBoatPlacement = {
      shipHead: this.#PATROL_BOAT_INFO.shipHead,
      isOnBoard: this.#PATROL_BOAT_INFO.isOnBoard,
      occupyingLoc: this.#PATROL_BOAT_INFO.occupying,
      orientation: this.#PATROL_BOAT_INFO.orientation,
    };

    return {
      carrierPlacement,
      battleShipPlacement,
      destroyerPlacement,
      subMarinePlacement,
      patrolBoatPlacement,
    };
  }
}

// const gameBoard = new GameBoard();

// console.log(gameBoard.carrierPlacement('horizontal'));

// const HorizontalPlacements = [
//   '0-0',
//   '1-0',
//   '2-0',
//   '3-0',
//   '4-0',
//   '5-0',
//   '0-1',
//   '1-1',
//   '2-1',
//   '3-1',
//   '4-1',
//   '5-1',
//   '0-2',
//   '1-2',
//   '2-2',
//   '3-2',
//   '4-2',
//   '5-2',
//   '0-3',
//   '1-3',
//   '2-3',
//   '3-3',
//   '4-3',
//   '5-3',
//   '0-4',
//   '1-4',
//   '2-4',
//   '3-4',
//   '4-4',
//   '5-4',
//   '0-5',
//   '1-5',
//   '2-5',
//   '3-5',
//   '4-5',
//   '5-5',
//   '0-6',
//   '1-6',
//   '2-6',
//   '3-6',
//   '4-6',
//   '5-6',
//   '0-7',
//   '1-7',
//   '2-7',
//   '3-7',
//   '4-7',
//   '5-7',
//   '0-8',
//   '1-8',
//   '2-8',
//   '3-8',
//   '4-8',
//   '5-8',
//   '0-9',
//   '1-9',
//   '2-9',
//   '3-9',
//   '4-9',
//   '5-9',
// ];

// const VerticalPlacements = [
//   '0-0',
//   '1-0',
//   '2-0',
//   '3-0',
//   '4-0',
//   '5-0',
//   '6-0',
//   '7-0',
//   '8-0',
//   '9-0',
//   '0-1',
//   '1-1',
//   '2-1',
//   '3-1',
//   '4-1',
//   '5-1',
//   '6-1',
//   '7-1',
//   '8-1',
//   '9-1',
//   '0-2',
//   '1-2',
//   '2-2',
//   '3-2',
//   '4-2',
//   '5-2',
//   '6-2',
//   '7-2',
//   '8-2',
//   '9-2',
//   '0-3',
//   '1-3',
//   '2-3',
//   '3-3',
//   '4-3',
//   '5-3',
//   '6-3',
//   '7-3',
//   '8-3',
//   '9-3',
//   '0-4',
//   '1-4',
//   '2-4',
//   '3-4',
//   '4-4',
//   '5-4',
//   '6-4',
//   '7-4',
//   '8-4',
//   '9-4',
//   '0-5',
//   '1-5',
//   '2-5',
//   '3-5',
//   '4-5',
//   '5-5',
//   '6-5',
//   '7-5',
//   '8-5',
//   '9-5',
// ];

// function run(orientation) {
//   const testCase = new Set();

//   if (orientation === 'horizontal') {
//     HorizontalPlacements.forEach((placement) => {
//       const [x, y] = placement.split('-');

//       testCase.add(
//         gameBoard.canBeCarrierShipHead(Number(x), Number(y), orientation),
//       );
//     });
//   }

//   return [...testCase];
// }

// const horizontalPlace = run('horizontal');
// gameBoard.allShip
// const DestroyerHorizontalPlacements =
//   gameBoard.destroyerPlacement('horizontal');

// console.log(DestroyerHorizontalPlacements.length);

// const DestroyerVerticalPlacements = gameBoard.destroyerPlacement('vertical');

// console.log(DestroyerVerticalPlacements.length);

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
