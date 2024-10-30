import Node from './board-node.js';

import GAME_SETTINGS from './GAME_SETTINGS/game-settings.js';

import Carrier from './carrier.js';
import Destroyer from './destroyer.js';
import Submarine from './submarine.js';
import BattleShip from './battleship.js';
import PatrolBoat from './patrol-boat.js';

import Ship from './ship.js';

import transform, {
  reverseTransform,
} from './helper_module/number-transform.js';
import { isPositiveNumber } from './helper_module/number.js';
import getRndElement from './helper_module/rnd-array-element.js';

const { BOARD_SPECS } = GAME_SETTINGS;
const { BOARD_AREA, BOARD_X_SIZE, BOARD_Y_SIZE } = BOARD_SPECS;

export default class GameBoard {
  /**
   * Creates an instance of GameBoard.
   * Allows access to an array of Nodes
   */

  static BOARD_SIZE = BOARD_AREA;

  static BOARD_X_Y = [BOARD_X_SIZE, BOARD_Y_SIZE];

  #NODES = [];

  #CARRIER = null;

  #BATTLESHIP = null;

  #DESTROYER = null;

  #SUBMARINE = null;

  #PATROL_BOAT = null;

  constructor() {
    this.#initializeNodes();
    this.#initializeShips();
  }

  #initializeShips() {
    this.#CARRIER = new Carrier();
    this.#BATTLESHIP = new BattleShip();
    this.#DESTROYER = new Destroyer();
    this.#SUBMARINE = new Submarine();
    this.#PATROL_BOAT = new PatrolBoat();
  }

  /**
   * Initializes array of node
   * node is a Node Class
   */
  #initializeNodes() {
    for (let i = 0; i < GameBoard.BOARD_SIZE; i += 1) {
      const [BOARD_X] = GameBoard.BOARD_X_Y;
      const [x, y] = reverseTransform(i, BOARD_X);
      const index = transform(x, y, BOARD_X);
      const node = new Node(x, y);

      this.#NODES[index] = node;
    }

    this.#NODES.forEach((node) => {
      this.#assignNeighbors(node);
    });
  }

  #assignNeighbors(node) {
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
      if (GameBoard.isValidBoardCoordinate(nx, ny)) {
        const [BOARD_X] = GameBoard.BOARD_X_Y;
        const index = transform(nx, ny, BOARD_X);
        const nodeNeighbor = this.#NODES[index];
        node.addNeighbor(nodeNeighbor);
      }
    });
  }

  static createCopy(BOARD) {
    if (!(BOARD instanceof GameBoard)) {
      throw new Error('Invalid argument: expected an instance of GameBoard');
    }

    const copy = new GameBoard();

    // Replicate ship placements based on original board state
    const {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    } = BOARD;

    if (carrierInfo.isOnBoard) {
      const { placeHead, orientation } = carrierInfo;
      const [x, y] = placeHead;
      copy.placeCarrier(x, y, orientation);
    }

    if (battleShipInfo.isOnBoard) {
      const { placeHead, orientation } = battleShipInfo;
      const [x, y] = placeHead;
      copy.placeBattleShip(x, y, orientation);
    }

    if (destroyerInfo.isOnBoard) {
      const { placeHead, orientation } = destroyerInfo;
      const [x, y] = placeHead;
      copy.placeDestroyer(x, y, orientation);
    }

    if (submarineInfo.isOnBoard) {
      const { placeHead, orientation } = submarineInfo;
      const [x, y] = placeHead;
      copy.placeSubmarine(x, y, orientation);
    }

    if (patrolBoatInfo.isOnBoard) {
      const { placeHead, orientation } = patrolBoatInfo;
      const [x, y] = placeHead;
      copy.placePatrolBoat(x, y, orientation);
    }

    // Replicate attack states if all ships are on the board
    if (BOARD.allShipsOnBoard) {
      BOARD.hitCoordinates.forEach(([x, y]) => {
        copy.receiveAttack(x, y);
      });
    }

    return copy;
  }

  static formatShipInfo(SHIP) {
    if (!(SHIP instanceof Ship)) return null;

    const { sunk, hasPlaceOrigin, orientation, size, name } = SHIP.shipInfo;

    const { x, y } = SHIP.assignedPlaceOrigin;

    return {
      isOnBoard: hasPlaceOrigin,
      orientation,
      placeHead: [x, y],
      size,
      name,
      isSunk: sunk,
    };
  }

  static isValidBoardCoordinate(x, y) {
    if (!isPositiveNumber(x, true) || !isPositiveNumber(y, true)) return false;

    const [boardXSize, boardYSize] = GameBoard.BOARD_X_Y;

    return x < boardXSize && y < boardYSize;
  }

  static getToBeOccupied(size, x, y, orientation) {
    if (
      !Ship.isValidOrientation(orientation) ||
      !GameBoard.isValidBoardCoordinate(x, y)
    ) {
      return [];
    }

    const horizontalOrientationRegExp = /^(horizontal)$/i;
    const verticalOrientationRegExp = /^(vertical)$/i;

    const toBeOccupied = [[x, y]];

    if (verticalOrientationRegExp.test(orientation)) {
      for (let i = 0; i < size - 1; i += 1) {
        const occupied = y + i + 1;
        if (GameBoard.isValidBoardCoordinate(x, occupied)) {
          toBeOccupied.push([x, occupied]);
        }
      }
    } else if (horizontalOrientationRegExp.test(orientation)) {
      for (let i = 0; i < size - 1; i += 1) {
        const occupied = x + i + 1;
        if (GameBoard.isValidBoardCoordinate(occupied, y)) {
          toBeOccupied.push([occupied, y]);
        }
      }
    }

    return toBeOccupied;
  }

  static getNeighboringLoc(size, x, y, orientation) {
    const BASE = GAME_SETTINGS.BOARD_SPECS.BOARD_X_SIZE;

    const temp = GameBoard.getToBeOccupied(size, x, y, orientation).map(
      (loc) => {
        const [a, b] = loc;
        const index = transform(a, b, BASE);

        return index;
      },
    );

    if (temp.length < size) return [];

    const toBeOccupiedNeighbors = new Set();

    temp.forEach((index) => {
      const address = reverseTransform(index, BASE);
      const [nx, ny] = address;

      const neighbors = [
        [nx, ny - 1],
        [nx + 1, ny - 1],
        [nx + 1, ny],
        [nx + 1, ny + 1],
        [nx, ny + 1],
        [nx - 1, ny + 1],
        [nx - 1, ny],
        [nx - 1, ny - 1],
      ];

      neighbors.forEach((neighbor) => {
        const [a, b] = neighbor;

        if (GameBoard.isValidBoardCoordinate(a, b)) {
          const i = transform(a, b, BASE);

          if (!temp.includes(i)) {
            toBeOccupiedNeighbors.add(i);
          }
        }
      });
    });

    const arr = [...toBeOccupiedNeighbors];

    return arr.map((index) => {
      const address = reverseTransform(index, BASE);

      return address;
    });
  }

  #hasTakenHit() {
    return this.#NODES.some((node) => node.isHit);
  }

  #getNode(x, y) {
    const [BOARD_X] = GameBoard.BOARD_X_Y;

    return this.#NODES[transform(x, y, BOARD_X)];
  }

  #getCanReceiveShipNodes(SHIP, orientation) {
    if (!Ship.isValidOrientation(orientation)) return [];

    const availableNodes = this.#NODES.filter(
      (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
    );

    const { size } = GameBoard.formatShipInfo(SHIP);
    const canPlace = [];

    availableNodes.forEach((node) => {
      const [x, y] = node.address;

      const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

      if (
        toBeOccupied.length === size &&
        this.#canReceiveShip(SHIP, toBeOccupied)
      ) {
        canPlace.push([x, y]);
      }
    });

    return canPlace;
  }

  #availableForShip(SHIP) {
    const horizontalPlacements = this.#getCanReceiveShipNodes(
      SHIP,
      'horizontal',
    );
    const verticalPlacements = this.#getCanReceiveShipNodes(SHIP, 'vertical');

    const available = [];

    horizontalPlacements.forEach((loc) => {
      available.push({
        loc,
        orientation: 'horizontal',
      });
    });

    verticalPlacements.forEach((loc) => {
      available.push({
        loc,
        orientation: 'vertical',
      });
    });

    return available;
  }

  #canReceiveShip(SHIP, nodeLocations) {
    const { size } = SHIP.shipInfo;

    if (nodeLocations.length < size) return false;

    return nodeLocations.every((nodeLocation) => {
      const [x, y] = nodeLocation;

      const [BOARD_X] = GameBoard.BOARD_X_Y;

      const node = this.#NODES[transform(x, y, BOARD_X)];

      return !node.isHit && !node.isNeighboringOccupied && !node.isOccupied;
    });
  }

  #replaceShip(SHIP, newOrientation, nx, ny) {
    const originalInfo = GameBoard.formatShipInfo(SHIP);

    this.#removeShip(SHIP);

    const placed = this.#placeShip(nx, ny, newOrientation, SHIP);

    if (placed) return true;

    const { placeHead, orientation } = originalInfo;
    const [x, y] = placeHead;

    return this.#placeShip(x, y, orientation, SHIP);
  }

  #placeShip(x, y, orientation, SHIP) {
    if (
      !Ship.isValidOrientation(orientation) ||
      !GameBoard.isValidBoardCoordinate(x, y)
    ) {
      return false;
    }

    const { size, isOnBoard } = GameBoard.formatShipInfo(SHIP);

    if (isOnBoard) return this.#replaceShip(SHIP, orientation, x, y);

    const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

    if (!this.#canReceiveShip(SHIP, toBeOccupied)) return false;

    toBeOccupied.forEach((nodeLocation) => {
      const [nx, ny] = nodeLocation;
      const [BOARD_X] = GameBoard.BOARD_X_Y;

      const node = this.#NODES[transform(nx, ny, BOARD_X)];

      node.occupy(SHIP);
    });

    SHIP.assignOrientation(orientation);
    SHIP.assignPlaceOrigin(x, y);

    return true;
  }

  #removeShip(SHIP) {
    if (this.#hasTakenHit()) return;

    const { size, orientation, placeHead } = GameBoard.formatShipInfo(SHIP);
    const [x, y] = placeHead;

    const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

    toBeOccupied.forEach((nodeLocation) => {
      const [nx, ny] = nodeLocation;
      const [BOARD_X] = GameBoard.BOARD_X_Y;

      const node = this.#NODES[transform(nx, ny, BOARD_X)];
      node.removeOccupant();
    });

    SHIP.removeAssignedPlaceOrigin();
    SHIP.removeAssignedOrientation();
  }

  #autoPlaceShip(SHIP) {
    if (GameBoard.formatShipInfo(SHIP).isOnBoard) {
      this.#removeShip(SHIP);
    }

    const availableNodes = this.#availableForShip(SHIP);

    const { element } = getRndElement(availableNodes);

    const { loc, orientation } = element;
    const [x, y] = loc;

    return {
      orientation,
      x,
      y,
    };
  }

  #allShipsOnBoard() {
    return (
      this.carrierInfo.isOnBoard &&
      this.battleShipInfo.isOnBoard &&
      this.destroyerInfo.isOnBoard &&
      this.submarineInfo.isOnBoard &&
      this.patrolBoatInfo.isOnBoard
    );
  }

  get canReceiveShipNodeLoc() {
    return this.#NODES
      .filter((node) => {
        const { isOccupied, isNeighboringOccupied, isHit } = node;

        if (isOccupied) return false;

        if (isNeighboringOccupied) return false;

        if (isHit) return false;

        return true;
      })
      .map((node) => {
        const { address } = node;

        return address;
      });
  }

  get boardNodes() {
    return [...this.#NODES];
  }

  get carrierInfo() {
    return GameBoard.formatShipInfo(this.#CARRIER);
  }

  placeCarrier(x, y, orientation) {
    return this.#placeShip(x, y, orientation, this.#CARRIER);
  }

  removeCarrier() {
    this.#removeShip(this.#CARRIER);
  }

  autoPlaceCarrier() {
    const { x, y, orientation } = this.#autoPlaceShip(this.#CARRIER);

    return this.placeCarrier(x, y, orientation);
  }

  get battleShipInfo() {
    return GameBoard.formatShipInfo(this.#BATTLESHIP);
  }

  placeBattleShip(x, y, orientation) {
    return this.#placeShip(x, y, orientation, this.#BATTLESHIP);
  }

  removeBattleShip() {
    this.#removeShip(this.#BATTLESHIP);
  }

  autoPlaceBattleShip() {
    const { x, y, orientation } = this.#autoPlaceShip(this.#BATTLESHIP);

    return this.placeBattleShip(x, y, orientation);
  }

  get destroyerInfo() {
    return GameBoard.formatShipInfo(this.#DESTROYER);
  }

  placeDestroyer(x, y, orientation) {
    return this.#placeShip(x, y, orientation, this.#DESTROYER);
  }

  removeDestroyer() {
    this.#removeShip(this.#DESTROYER);
  }

  autoPlaceDestroyer() {
    const { x, y, orientation } = this.#autoPlaceShip(this.#DESTROYER);

    return this.placeDestroyer(x, y, orientation);
  }

  get submarineInfo() {
    return GameBoard.formatShipInfo(this.#SUBMARINE);
  }

  placeSubmarine(x, y, orientation) {
    return this.#placeShip(x, y, orientation, this.#SUBMARINE);
  }

  removeSubmarine() {
    this.#removeShip(this.#SUBMARINE);
  }

  autoPlaceSubmarine() {
    const { x, y, orientation } = this.#autoPlaceShip(this.#SUBMARINE);

    return this.placeSubmarine(x, y, orientation);
  }

  get patrolBoatInfo() {
    return GameBoard.formatShipInfo(this.#PATROL_BOAT);
  }

  placePatrolBoat(x, y, orientation) {
    return this.#placeShip(x, y, orientation, this.#PATROL_BOAT);
  }

  removePatrolBoat() {
    this.#removeShip(this.#PATROL_BOAT);
  }

  autoPlacePatrolBoat() {
    const { x, y, orientation } = this.#autoPlaceShip(this.#PATROL_BOAT);

    return this.placePatrolBoat(x, y, orientation);
  }

  autoPlaceAllShips() {
    this.autoPlaceCarrier();

    this.autoPlaceBattleShip();

    this.autoPlaceDestroyer();

    this.autoPlacePatrolBoat();

    this.autoPlaceSubmarine();
  }

  receiveAttack(x, y) {
    if (!this.#allShipsOnBoard() || !GameBoard.isValidBoardCoordinate(x, y)) {
      return -1;
    }

    const node = this.#getNode(x, y);

    return node.hit();
  }

  get unHitCoordinates() {
    return this.#NODES
      .filter((available) => !available.isHit)
      .map((unHit) => {
        const { address } = unHit;
        const [x, y] = address;

        return [x, y];
      });
  }

  get hitCoordinates() {
    return this.#NODES
      .filter((available) => available.isHit)
      .map((unHit) => {
        const { address } = unHit;
        const [x, y] = address;

        return [x, y];
      });
  }

  get allShipsOnBoard() {
    return this.#allShipsOnBoard();
  }
}
// export default class GameBoard {
//   BOARD_SIZE;

//   #HORIZONTAL = 'horizontal';

//   #VERTICAL = 'vertical';

//   #transform(x, y) {
//     return transform(x, y, this.BOARD_SIZE);
//   }

//   #reverseTransform(index) {
//     return reverseTransform(index, this.BOARD_SIZE);
//   }

//   #CARRIER_INFO = {
//     isOnBoard: false,
//     occupying: [],
//     shipHead: [],
//     orientation: '',
//     size: 0,
//     name: '',
//     exempt: [],
//   };

//   #BATTLESHIP_INFO = {
//     isOnBoard: false,
//     occupying: [],
//     shipHead: [],
//     orientation: '',
//     size: 0,
//     name: '',
//     exempt: [],
//   };

//   #DESTROYER_INFO = {
//     isOnBoard: false,
//     occupying: [],
//     shipHead: [],
//     orientation: '',
//     size: 0,
//     name: '',
//     exempt: [],
//   };

//   #SUBMARINE_INFO = {
//     isOnBoard: false,
//     occupying: [],
//     shipHead: [],
//     orientation: '',
//     size: 0,
//     name: '',
//     exempt: [],
//   };

//   #PATROL_BOAT_INFO = {
//     isOnBoard: false,
//     occupying: [],
//     shipHead: [],
//     orientation: '',
//     size: 0,
//     name: '',
//     exempt: [],
//   };

//   constructor() {
//     this.BOARD_SIZE = gameSettings.BOARD_SIZE;
//     this.shipYard = {};
//     this.ships = [];
//     this.board = [];
//     this.#buildBoard();
//     this.#initializeShips();
//   }

//   #initializeShips() {
//     const carrier = new Carrier();
//     this.shipYard.carrier = carrier;
//     this.#CARRIER_INFO.size = carrier.length;
//     this.#CARRIER_INFO.name = carrier.name;

//     const battleship = new BattleShip();
//     this.shipYard.battleship = battleship;
//     this.#BATTLESHIP_INFO.size = battleship.length;
//     this.#BATTLESHIP_INFO.name = battleship.name;

//     const destroyer = new Destroyer();
//     this.shipYard.destroyer = destroyer;
//     this.#DESTROYER_INFO.size = destroyer.length;
//     this.#DESTROYER_INFO.name = destroyer.name;

//     const submarine = new SubMarine();
//     this.shipYard.submarine = submarine;
//     this.#SUBMARINE_INFO.size = submarine.length;
//     this.#SUBMARINE_INFO.name = submarine.name;

//     const patrolBoat = new PatrolBoat();
//     this.shipYard.patrolBoat = patrolBoat;
//     this.#PATROL_BOAT_INFO.size = patrolBoat.length;
//     this.#PATROL_BOAT_INFO.name = patrolBoat.name;
//   }

//   #buildBoard() {
//     for (let y = 0; y < this.BOARD_SIZE; y += 1) {
//       for (let x = 0; x < this.BOARD_SIZE; x += 1) {
//         const node = new Node(x, y);
//         this.board[y * this.BOARD_SIZE + x] = node;
//       }
//     }

//     this.board.forEach((boardNode) => {
//       this.#addNeighbors(boardNode);
//     });
//   }

//   #addNeighbors(node) {
//   const { address } = node;
//   const [x, y] = address;

//   const neighbors = [
//     [x, y - 1],
//     [x + 1, y - 1],
//     [x + 1, y],
//     [x + 1, y + 1],
//     [x, y + 1],
//     [x - 1, y + 1],
//     [x - 1, y],
//     [x - 1, y - 1],
//   ];

//   neighbors.forEach((neighbor) => {
//     const [nx, ny] = neighbor;
//     if (this.#isValidCoordinate(nx, ny)) {
//       const index = this.#transform(nx, ny);
//       const nodeNeighbor = this.board[index];
//       node.addNeighbor(nodeNeighbor);
//     }
//   });
// }

//   #isValidCoordinate(x, y) {
//     return x >= 0 && x < this.BOARD_SIZE && y >= 0 && y < this.BOARD_SIZE;
//   }

//   #canPlaceShip(x, y) {
//     if (!this.#isValidCoordinate(x, y)) {
//       return false;
//     }

//     const node = this.board[y * this.BOARD_SIZE + x];
//     if (node.isHit || node.isOccupied || node.isNeighboringOccupied) {
//       return false;
//     }

//     return true;
//   }

//   #boardHitNodes() {
//     return this.board.filter((node) => node.isHit);
//   }

// #getToBeOccupied(size, x, y, orientation) {
//   if (!this.#isValidOrientation(orientation)) {
//     return [];
//   }

//   const toBeOccupied = [[x, y]];
//   if (orientation === 'vertical') {
//     for (let i = 0; i < size - 1; i += 1) {
//       const occupied = y + i + 1;
//       if (this.#isValidCoordinate(x, occupied)) {
//         toBeOccupied.push([x, occupied]);
//       }
//     }
//   } else if (orientation === 'horizontal') {
//     for (let i = 0; i < size - 1; i += 1) {
//       const occupied = x + i + 1;
//       if (this.#isValidCoordinate(occupied, y)) {
//         toBeOccupied.push([occupied, y]);
//       }
//     }
//   }

//   return toBeOccupied;
// }

//   #isValidOrientation(orientation) {
//     return orientation === this.#HORIZONTAL || orientation === this.#VERTICAL;
//   }

//   #checkNodeLocations(nodeLocations) {
//     return nodeLocations.every((nodeLoc) => {
//       const [nx, ny] = nodeLoc;
//       return this.#canPlaceShip(nx, ny);
//     });
//   }

//   #ShipExempt(SHIP_INFO, shipHead, orientation) {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const [x, y] = shipHead;
//     if (!this.#isValidCoordinate(x, y)) return false;

//     const exemptShipHead = shipHead;
//     const exemptOrientation = orientation;
//     SHIP_INFO.exempt.push({
//       exemptShipHead,
//       exemptOrientation,
//     });

//     return true;
//   }

//   #CarrierExempt(shipHead, orientation) {
//     this.#ShipExempt(this.#CARRIER_INFO, shipHead, orientation);
//   }

//   #BattleShipExempt(shipHead, orientation) {
//     this.#ShipExempt(this.#BATTLESHIP_INFO, shipHead, orientation);
//   }

//   #DestroyerExempt(shipHead, orientation) {
//     this.#ShipExempt(this.#DESTROYER_INFO, shipHead, orientation);
//   }

//   #SubMarineExempt(shipHead, orientation) {
//     this.#ShipExempt(this.#SUBMARINE_INFO, shipHead, orientation);
//   }

//   #PatrolBoatExempt(shipHead, orientation) {
//     this.#ShipExempt(this.#PATROL_BOAT_INFO, shipHead, orientation);
//   }

//   #isShipExempted(SHIP_INFO, shipHead, orientation) {
//     const [shipHeadX, shipHeadY] = shipHead;
//     const transformedShipHead = this.#transform(shipHeadX, shipHeadY);

//     if (SHIP_INFO.exempt.length === 0) return false;

//     return SHIP_INFO.exempt.every((exempt) => {
//       const { exemptShipHead, exemptOrientation } = exempt;
//       const [x, y] = exemptShipHead;
//       const exemptTransformed = this.#transform(x, y);

//       return (
//         exemptTransformed !== transformedShipHead &&
//         exemptOrientation !== orientation
//       );
//     });
//   }

//   #isCarrierExempted(shipHead, orientation) {
//     return this.#isShipExempted(this.#CARRIER_INFO, shipHead, orientation);
//   }

//   #isBattleShipExempted(shipHead, orientation) {
//     return this.#isShipExempted(this.#BATTLESHIP_INFO, shipHead, orientation);
//   }

//   #isDestroyerExempted(shipHead, orientation) {
//     return this.#isShipExempted(this.#DESTROYER_INFO, shipHead, orientation);
//   }

//   #isSubMarineExempted(shipHead, orientation) {
//     return this.#isShipExempted(this.#SUBMARINE_INFO, shipHead, orientation);
//   }

//   #isPatrolBoatExempted(shipHead, orientation) {
//     return this.#isShipExempted(this.#PATROL_BOAT_INFO, shipHead, orientation);
//   }

//   // exempt configuration
//   // remove all ships on board
//   // place all removed ships on new config
//   #reformShipPlacements() {
//     if (this.#CARRIER_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#CARRIER_INFO;
//       this.#CarrierExempt(shipHead, orientation);
//       this.removeCarrier();
//       this.carrierAutoPlace();
//     }

//     if (this.#BATTLESHIP_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#BATTLESHIP_INFO;
//       this.#BattleShipExempt(shipHead, orientation);
//       this.removeBattleShip();
//       this.battleShipAutoPlace();
//     }

//     if (this.#DESTROYER_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#DESTROYER_INFO;
//       this.#DestroyerExempt(shipHead, orientation);
//       this.removePatrolBoat();
//       this.destroyerAutoPlace();
//     }

//     if (this.#SUBMARINE_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#SUBMARINE_INFO;
//       this.#SubMarineExempt(shipHead, orientation);
//       this.removeSubMarine();
//       this.subMarineAutoPlace();
//     }

//     if (this.#PATROL_BOAT_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#PATROL_BOAT_INFO;
//       this.#PatrolBoatExempt(shipHead, orientation);
//       this.removePatrolBoat();
//       this.patrolBoatAutoPlace();
//     }
//   }

//   canBeCarrierShipHead(x, y, orientation) {
//     if (!this.#isValidOrientation(orientation)) return false;
//     const { size } = this.#CARRIER_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     return true;
//   }

//   placeCarrier(x, y, orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const { size } = this.#CARRIER_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (this.#CARRIER_INFO.isOnBoard) {
//       this.removeCarrier();
//     }

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     toBeOccupied.forEach((location) => {
//       const [nx, ny] = location;

//       this.#CARRIER_INFO.occupying.push([nx, ny]);
//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.occupy(this.shipYard.carrier);
//     });

//     this.#CARRIER_INFO.isOnBoard = true;
//     this.#CARRIER_INFO.shipHead.push(x, y);
//     this.#CARRIER_INFO.orientation = orientation;

//     return true;
//   }

//   removeCarrier() {
//     const { occupying } = this.#CARRIER_INFO;

//     occupying.forEach((location) => {
//       const [nx, ny] = location;

//       const node = this.board[ny * this.BOARD_SIZE + nx];

//       node.removeOccupant();
//     });

//     this.#CARRIER_INFO.occupying = [];
//     this.#CARRIER_INFO.isOnBoard = false;
//     this.#CARRIER_INFO.shipHead = [];
//     this.#CARRIER_INFO.orientation = '';
//   }

//   carrierPlacement(orientation = 'horizontal') {
// if (!this.#isValidOrientation(orientation)) return [];

// const availableNodes = this.board.filter(
//   (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
// );

// const { size } = this.#CARRIER_INFO;

// const canPlace = [];

// availableNodes.forEach((node) => {
//   const [x, y] = node.address;

//   const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//   if (
//     toBeOccupied.length === size &&
//     this.#checkNodeLocations(toBeOccupied)
//   ) {
//     canPlace.push([x, y]);
//   }
// });

// return canPlace;
//   }

//   #carrierAutoPlaceArray() {
//     const horizontalPlace = this.carrierPlacement(this.#HORIZONTAL);
//     const verticalPlace = this.carrierPlacement(this.#VERTICAL);

// const available = [];

// horizontalPlace.forEach((loc) => {
//   if (!this.#isCarrierExempted(loc, 'horizontal')) {
//     available.push({
//       loc,
//       orientation: 'horizontal',
//     });
//   }
// });

// verticalPlace.forEach((loc) => {
//   if (!this.#isCarrierExempted(loc, 'vertical')) {
//     available.push({
//       loc,
//       orientation: 'vertical',
//     });
//   }
// });

// return available;
//   }

//   carrierAutoPlace() {
//     const available = this.#carrierAutoPlaceArray();

//     if (available.length === 0) {
//       return [];
//     }

//     let placed = false;

//     while (!placed) {
//       const { element } = getRndElement(available);

//       const { loc, orientation } = element;

//       const [x, y] = loc;

//       placed = this.placeCarrier(x, y, orientation);
//     }

//     return this.carrierPlacementDetails;
//   }

//   placeBattleShip(x, y, orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const { size } = this.#BATTLESHIP_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (this.#BATTLESHIP_INFO.isOnBoard) {
//       this.removeBattleShip();
//     }

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     toBeOccupied.forEach((location) => {
//       const [nx, ny] = location;

//       this.#BATTLESHIP_INFO.occupying.push([nx, ny]);
//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.occupy(this.shipYard.battleship);
//     });

//     this.#BATTLESHIP_INFO.isOnBoard = true;
//     this.#BATTLESHIP_INFO.shipHead.push(x, y);
//     this.#BATTLESHIP_INFO.orientation = orientation;
//     return true;
//   }

//   removeBattleShip() {
//     const { occupying } = this.#BATTLESHIP_INFO;

//     occupying.forEach((location) => {
//       const [nx, ny] = location;

//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.removeOccupant();
//     });
//     this.#BATTLESHIP_INFO.occupying = [];
//     this.#BATTLESHIP_INFO.isOnBoard = false;
//     this.#BATTLESHIP_INFO.orientation = '';
//     this.#BATTLESHIP_INFO.shipHead = [];
//   }

//   battleShipPlacement(orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return [];

//     const availableNodes = this.board.filter(
//       (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
//     );

//     const { size } = this.#BATTLESHIP_INFO;

//     const canPlace = [];

//     availableNodes.forEach((node) => {
//       const [x, y] = node.address;

//       const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//       if (
//         toBeOccupied.length === size &&
//         this.#checkNodeLocations(toBeOccupied)
//       ) {
//         canPlace.push([x, y]);
//       }
//     });

//     return canPlace;
//   }

//   #battleShipAutoPlaceArray() {
//     const horizontalPlace = this.battleShipPlacement(this.#HORIZONTAL);
//     const verticalPlace = this.battleShipPlacement(this.#VERTICAL);

//     const available = [];

//     horizontalPlace.forEach((loc) => {
//       if (!this.#isBattleShipExempted(loc, 'horizontal')) {
//         available.push({
//           loc,
//           orientation: 'horizontal',
//         });
//       }
//     });

//     verticalPlace.forEach((loc) => {
//       if (!this.#isBattleShipExempted(loc, 'vertical')) {
//         available.push({
//           loc,
//           orientation: 'vertical',
//         });
//       }
//     });

//     return available;
//   }

//   battleShipAutoPlace() {
//     const available = this.#battleShipAutoPlaceArray();

//     if (available.length === 0) {
//       return [];
//     }

//     let placed = false;

//     while (!placed) {
//       const { element } = getRndElement(available);

//       const { loc, orientation } = element;

//       const [x, y] = loc;

//       placed = this.placeBattleShip(x, y, orientation);
//     }

//     return this.battleShipPlacementDetails;
//   }

//   placeDestroyer(x, y, orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const { size } = this.#DESTROYER_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     if (this.#DESTROYER_INFO.isOnBoard) {
//       this.removeDestroyer();
//     }

//     // if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     toBeOccupied.forEach((location) => {
//       const [nx, ny] = location;

//       this.#DESTROYER_INFO.occupying.push([nx, ny]);
//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.occupy(this.shipYard.destroyer);
//     });

//     this.#DESTROYER_INFO.isOnBoard = true;
//     this.#DESTROYER_INFO.shipHead.push(x, y);
//     this.#DESTROYER_INFO.orientation = orientation;
//     return true;
//   }

//   removeDestroyer() {
//     const { occupying } = this.#DESTROYER_INFO;

//     occupying.forEach((location) => {
//       const [nx, ny] = location;

//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.removeOccupant();
//     });
//     this.#DESTROYER_INFO.occupying = [];
//     this.#DESTROYER_INFO.isOnBoard = false;
//     this.#DESTROYER_INFO.orientation = '';
//     this.#DESTROYER_INFO.shipHead = [];
//   }

//   destroyerPlacement(orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return [];

//     const availableNodes = this.board.filter(
//       (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
//     );

//     const { size } = this.#DESTROYER_INFO;

//     const canPlace = [];

//     availableNodes.forEach((node) => {
//       const [x, y] = node.address;

//       const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//       if (
//         toBeOccupied.length === size &&
//         this.#checkNodeLocations(toBeOccupied)
//       ) {
//         canPlace.push([x, y]);
//       }
//     });

//     return canPlace;
//   }

//   #destroyerAutoPlaceArray() {
//     const horizontalPlace = this.destroyerPlacement(this.#HORIZONTAL);
//     const verticalPlace = this.destroyerPlacement(this.#VERTICAL);

//     const available = [];

//     horizontalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'horizontal',
//       });
//     });

//     verticalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'vertical',
//       });
//     });

//     return available;
//   }

//   destroyerAutoPlace() {
//     const available = this.#destroyerAutoPlaceArray();

//     if (available.length === 0) {
//       return [];
//     }

//     let placed = false;

//     while (!placed) {
//       const { element } = getRndElement(available);

//       const { loc, orientation } = element;

//       const [x, y] = loc;

//       placed = this.placeDestroyer(x, y, orientation);
//     }

//     return this.destroyerPlacementDetails;
//   }

//   placeSubMarine(x, y, orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const { size } = this.#DESTROYER_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (this.#SUBMARINE_INFO.isOnBoard) {
//       this.removeSubMarine();
//     }

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     toBeOccupied.forEach((location) => {
//       const [nx, ny] = location;

//       this.#SUBMARINE_INFO.occupying.push([nx, ny]);
//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.occupy(this.shipYard.submarine);
//     });

//     this.#SUBMARINE_INFO.isOnBoard = true;
//     this.#SUBMARINE_INFO.shipHead.push(x, y);
//     this.#SUBMARINE_INFO.orientation = orientation;
//     return true;
//   }

//   removeSubMarine() {
//     const { occupying } = this.#SUBMARINE_INFO;

//     occupying.forEach((location) => {
//       const [nx, ny] = location;

//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.removeOccupant();
//     });

//     this.#SUBMARINE_INFO.occupying = [];
//     this.#SUBMARINE_INFO.isOnBoard = false;
//     this.#SUBMARINE_INFO.orientation = '';
//     this.#SUBMARINE_INFO.shipHead = [];
//   }

//   subMarinePlacement(orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return [];

//     const availableNodes = this.board.filter(
//       (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
//     );

//     const { size } = this.#SUBMARINE_INFO;

//     const canPlace = [];

//     availableNodes.forEach((node) => {
//       const [x, y] = node.address;

//       const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//       if (
//         toBeOccupied.length === size &&
//         this.#checkNodeLocations(toBeOccupied)
//       ) {
//         canPlace.push([x, y]);
//       }
//     });

//     return canPlace;
//   }

//   #subMarineAutoPlaceArray() {
//     const horizontalPlace = this.subMarinePlacement(this.#HORIZONTAL);
//     const verticalPlace = this.subMarinePlacement(this.#VERTICAL);

//     const available = [];

//     horizontalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'horizontal',
//       });
//     });

//     verticalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'vertical',
//       });
//     });

//     return available;
//   }

//   subMarineAutoPlace() {
//     const available = this.#subMarineAutoPlaceArray();

//     if (available.length === 0) {
//       return [];
//     }

//     let placed = false;

//     while (!placed) {
//       const { element } = getRndElement(available);

//       const { loc, orientation } = element;

//       const [x, y] = loc;

//       placed = this.placeSubMarine(x, y, orientation);
//     }

//     return this.subMarinePlacementDetails;
//   }

//   placePatrolBoat(x, y, orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return false;

//     const { size } = this.#PATROL_BOAT_INFO;

//     const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//     if (toBeOccupied.length < size) return false;

//     if (this.#PATROL_BOAT_INFO.isOnBoard) {
//       this.removePatrolBoat();
//     }

//     if (!this.#checkNodeLocations(toBeOccupied)) return false;

//     toBeOccupied.forEach((location) => {
//       const [nx, ny] = location;

//       this.#PATROL_BOAT_INFO.occupying.push([nx, ny]);
//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.occupy(this.shipYard.patrolBoat);
//     });

//     this.#PATROL_BOAT_INFO.isOnBoard = true;
//     this.#PATROL_BOAT_INFO.shipHead.push(x, y);
//     this.#PATROL_BOAT_INFO.orientation = orientation;
//     return true;
//   }

//   removePatrolBoat() {
//     const { occupying } = this.#PATROL_BOAT_INFO;

//     occupying.forEach((location) => {
//       const [nx, ny] = location;

//       const node = this.board[ny * this.BOARD_SIZE + nx];
//       node.removeOccupant();
//     });
//     this.#PATROL_BOAT_INFO.occupying = [];
//     this.#PATROL_BOAT_INFO.isOnBoard = false;
//     this.#PATROL_BOAT_INFO.orientation = '';
//     this.#PATROL_BOAT_INFO.shipHead = [];
//   }

//   patrolBoatPlacement(orientation = 'horizontal') {
//     if (!this.#isValidOrientation(orientation)) return [];

//     const availableNodes = this.board.filter(
//       (node) => !node.isHit && !node.isOccupied && !node.isNeighboringOccupied,
//     );

//     const { size } = this.#PATROL_BOAT_INFO;

//     const canPlace = [];

//     availableNodes.forEach((node) => {
//       const [x, y] = node.address;

//       const toBeOccupied = GameBoard.getToBeOccupied(size, x, y, orientation);

//       if (
//         toBeOccupied.length === size &&
//         this.#checkNodeLocations(toBeOccupied)
//       ) {
//         canPlace.push([x, y]);
//       }
//     });

//     return canPlace;
//   }

//   #patrolBoatAutoPlaceArray() {
//     const horizontalPlace = this.patrolBoatPlacement(this.#HORIZONTAL);
//     const verticalPlace = this.patrolBoatPlacement(this.#VERTICAL);

//     const available = [];

//     horizontalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'horizontal',
//       });
//     });

//     verticalPlace.forEach((loc) => {
//       available.push({
//         loc,
//         orientation: 'vertical',
//       });
//     });

//     return available;
//   }

//   patrolBoatAutoPlace() {
//     const available = this.#patrolBoatAutoPlaceArray();

//     if (available.length === 0) {
//       return [];
//     }

//     let placed = false;

//     while (!placed) {
//       const { element } = getRndElement(available);

//       const { loc, orientation } = element;

//       const [x, y] = loc;

//       placed = this.placePatrolBoat(x, y, orientation);
//     }

//     return this.patrolBoatPlacementDetails;
//   }

//   removeAllShips() {
//     this.removeCarrier();
//     this.removeBattleShip();
//     this.removeDestroyer();
//     this.removeSubMarine();
//     this.removePatrolBoat();
//   }

//   allShipsPlacement() {
//     this.carrierAutoPlace();
//     this.battleShipAutoPlace();
//     this.destroyerAutoPlace();
//     this.subMarineAutoPlace();
//     this.patrolBoatAutoPlace();

//     return this.shipPlacements;
//   }

//   receiveAttack(x, y) {
//     if (!this.#isValidCoordinate(x, y)) return -1;

//     if (!this.#allShipOnBoard()) return -1;

//     const node = this.board[y * this.BOARD_SIZE + x];

//     return node.hit();
//   }

//   #allShipOnBoard() {
//     return (
//       this.#CARRIER_INFO.isOnBoard &&
//       this.#BATTLESHIP_INFO.isOnBoard &&
//       this.#DESTROYER_INFO.isOnBoard &&
//       this.#SUBMARINE_INFO.isOnBoard &&
//       this.#PATROL_BOAT_INFO.isOnBoard
//     );
//   }

//   get isAllShipSunk() {
//     const ships = Object.values(this.shipYard);

//     const sunkShips = ships.filter((ship) => ship.isSunk());

//     return sunkShips.length === ships.length;
//   }

//   get carrierSunk() {
//     return this.shipYard.carrier.isSunk();
//   }

//   get battleShipSunk() {
//     return this.shipYard.battleship.isSunk();
//   }

//   get destroyerSunk() {
//     return this.shipYard.destroyer.isSunk();
//   }

//   get submarineSunk() {
//     return this.shipYard.submarine.isSunk();
//   }

//   get patrolBoatSunk() {
//     return this.shipYard.patrolBoat.isSunk();
//   }

//   get missedShots() {
//     const shots = this.board.filter((node) => node.isHit);
//     const missedShots = shots.filter((shot) => !shot.isOccupied);
//     return missedShots;
//   }

//   get validMoves() {
//     const available = this.board.filter((node) => !node.isHit);

//     return available;
//   }

//   #shipNeighboringLoc(shipInfo) {
//     const { occupying } = shipInfo;
//     const neighborLocStore = new Set();

//     occupying.forEach((loc) => {
//       const [x, y] = loc;
//       const node = this.board[transform(x, y, this.BOARD_SIZE)];
//       const { neighbors } = node;
//       neighbors.forEach((neighbor) => {
//         if (!neighbor.isOccupied) {
//           neighborLocStore.add(neighbor.address);
//         }
//       });
//     });

//     return [...neighborLocStore];
//   }

//   get carrierPlacementDetails() {
//     return {
//       shipHead: this.#CARRIER_INFO.shipHead,
//       isOnBoard: this.#CARRIER_INFO.isOnBoard,
//       occupyingLoc: this.#CARRIER_INFO.occupying,
//       orientation: this.#CARRIER_INFO.orientation,
//       name: this.#CARRIER_INFO.name,
//       isSunk: this.carrierSunk,
//       neighborLoc: this.#shipNeighboringLoc(this.#CARRIER_INFO),
//     };
//   }

//   get battleShipPlacementDetails() {
//     return {
//       shipHead: this.#BATTLESHIP_INFO.shipHead,
//       isOnBoard: this.#BATTLESHIP_INFO.isOnBoard,
//       occupyingLoc: this.#BATTLESHIP_INFO.occupying,
//       orientation: this.#BATTLESHIP_INFO.orientation,
//       name: this.#BATTLESHIP_INFO.name,
//       isSunk: this.battleShipSunk,
//       neighborLoc: this.#shipNeighboringLoc(this.#BATTLESHIP_INFO),
//     };
//   }

//   get destroyerPlacementDetails() {
//     return {
//       shipHead: this.#DESTROYER_INFO.shipHead,
//       isOnBoard: this.#DESTROYER_INFO.isOnBoard,
//       occupyingLoc: this.#DESTROYER_INFO.occupying,
//       orientation: this.#DESTROYER_INFO.orientation,
//       name: this.#DESTROYER_INFO.name,
//       isSunk: this.destroyerSunk,
//       neighborLoc: this.#shipNeighboringLoc(this.#DESTROYER_INFO),
//     };
//   }

//   get subMarinePlacementDetails() {
//     return {
//       shipHead: this.#SUBMARINE_INFO.shipHead,
//       isOnBoard: this.#SUBMARINE_INFO.isOnBoard,
//       occupyingLoc: this.#SUBMARINE_INFO.occupying,
//       orientation: this.#SUBMARINE_INFO.orientation,
//       name: this.#SUBMARINE_INFO.name,
//       isSunk: this.submarineSunk,
//       neighborLoc: this.#shipNeighboringLoc(this.#SUBMARINE_INFO),
//     };
//   }

//   get patrolBoatPlacementDetails() {
//     return {
//       shipHead: this.#PATROL_BOAT_INFO.shipHead,
//       isOnBoard: this.#PATROL_BOAT_INFO.isOnBoard,
//       occupyingLoc: this.#PATROL_BOAT_INFO.occupying,
//       orientation: this.#PATROL_BOAT_INFO.orientation,
//       name: this.#PATROL_BOAT_INFO.name,
//       isSunk: this.patrolBoatSunk,
//       neighborLoc: this.#shipNeighboringLoc(this.#PATROL_BOAT_INFO),
//     };
//   }

//   get shipPlacements() {
//     const carrierPlacement = this.carrierPlacementDetails;

//     const battleShipPlacement = this.battleShipPlacementDetails;

//     const destroyerPlacement = this.destroyerPlacementDetails;

//     const subMarinePlacement = this.subMarinePlacementDetails;

//     const patrolBoatPlacement = this.patrolBoatPlacementDetails;

//     return {
//       carrierPlacement,
//       battleShipPlacement,
//       destroyerPlacement,
//       subMarinePlacement,
//       patrolBoatPlacement,
//     };
//   }

//   get allShipsOnBoard() {
//     return (
//       this.#CARRIER_INFO.isOnBoard &&
//       this.#BATTLESHIP_INFO.isOnBoard &&
//       this.#DESTROYER_INFO.isOnBoard &&
//       this.#SUBMARINE_INFO.isOnBoard &&
//       this.#PATROL_BOAT_INFO.isOnBoard
//     );
//   }

//   get copy() {
//     const boardCopy = new GameBoard();

//     if (this.#CARRIER_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#CARRIER_INFO;
//       const [x, y] = shipHead;
//       boardCopy.placeCarrier(x, y, orientation);
//     }

//     if (this.#BATTLESHIP_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#BATTLESHIP_INFO;
//       const [x, y] = shipHead;
//       boardCopy.placeBattleShip(x, y, orientation);
//     }

//     if (this.#DESTROYER_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#DESTROYER_INFO;
//       const [x, y] = shipHead;
//       boardCopy.placeDestroyer(x, y, orientation);
//     }

//     if (this.#SUBMARINE_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#SUBMARINE_INFO;
//       const [x, y] = shipHead;
//       boardCopy.placeSubMarine(x, y, orientation);
//     }

//     if (this.#PATROL_BOAT_INFO.isOnBoard) {
//       const { shipHead, orientation } = this.#PATROL_BOAT_INFO;
//       const [x, y] = shipHead;
//       boardCopy.placePatrolBoat(x, y, orientation);
//     }

//     const hitNodes = this.#boardHitNodes();

//     hitNodes.forEach((node) => {
//       const [x, y] = node.address;

//       boardCopy.receiveAttack(x, y);
//     });

//     return boardCopy;
//   }
// }
