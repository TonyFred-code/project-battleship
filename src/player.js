import GameBoard from './game-board.js';

export default class Player {
  #PLAYER_BOARD = new GameBoard();

  get copy() {
    const newPlayer = new Player(this.name, this.boardCopy);

    return newPlayer;
  }

  constructor(name, board = null) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid name parameter');
    }

    this.name = name;

    if (board !== null && board instanceof GameBoard) {
      this.#PLAYER_BOARD = board;
    }
  }

  getBoard() {
    return this.#PLAYER_BOARD;
  }

  get boardCopy() {
    return this.#PLAYER_BOARD.copy;
  }

  get validMoves() {
    return this.#PLAYER_BOARD.validMoves;
  }

  placeCarrier(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeCarrier(x, y, orientation);
  }

  placeBattleShip(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeBattleShip(x, y, orientation);
  }

  placeDestroyer(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeDestroyer(x, y, orientation);
  }

  placeSubMarine(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeSubMarine(x, y, orientation);
  }

  placePatrolBoat(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placePatrolBoat(x, y, orientation);
  }

  receiveAttack(x, y) {
    const status = this.#PLAYER_BOARD.receiveAttack(x, y);
    return status;
  }

  allShipSunk() {
    return this.#PLAYER_BOARD.isAllShipSunk;
  }

  autoPlaceShips() {
    return this.#PLAYER_BOARD.allShipsPlacement();
  }

  shipPlacements() {
    return this.#PLAYER_BOARD.shipPlacements;
  }

  get carrierPlacementDetails() {
    return this.#PLAYER_BOARD.carrierPlacementDetails;
  }

  get battleShipPlacementDetails() {
    return this.#PLAYER_BOARD.battleShipPlacementDetails;
  }

  get destroyerPlacementDetails() {
    return this.#PLAYER_BOARD.destroyerPlacementDetails;
  }

  get subMarinePlacementDetails() {
    return this.#PLAYER_BOARD.subMarinePlacementDetails;
  }

  get patrolBoatPlacementDetails() {
    return this.#PLAYER_BOARD.patrolBoatPlacementDetails;
  }

  get allShipsOnBoard() {
    return this.#PLAYER_BOARD.allShipsOnBoard;
  }

  canBeCarrierShipHead(x, y, orientation) {
    return this.#PLAYER_BOARD.canBeCarrierShipHead(x, y, orientation);
  }
}
