import GameBoard from './game-board.js';

export default class Player {
  #PLAYER_BOARD;

  #NAME;

  constructor(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid name: expect non-empty string as player name');
    }

    this.#NAME = name;

    this.#PLAYER_BOARD = new GameBoard();
  }

  get name() {
    return this.#NAME;
  }

  get boardCopy() {
    return GameBoard.createCopy(this.#PLAYER_BOARD);
  }

  get validMoves() {
    return this.#PLAYER_BOARD.unHitCoordinates;
  }

  placeCarrier(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeCarrier(x, y, orientation);
  }

  removeCarrier() {
    this.#PLAYER_BOARD.removeCarrier();
  }

  get carrierInfo() {
    return this.#PLAYER_BOARD.carrierInfo;
  }

  autoPlaceCarrier() {
    return this.#PLAYER_BOARD.autoPlaceCarrier();
  }

  placeBattleShip(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeBattleShip(x, y, orientation);
  }

  removeBattleShip() {
    this.#PLAYER_BOARD.removeBattleShip();
  }

  get battleShipInfo() {
    return this.#PLAYER_BOARD.battleShipInfo;
  }

  autoPlaceBattleShip() {
    return this.#PLAYER_BOARD.autoPlaceBattleShip();
  }

  placeDestroyer(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeDestroyer(x, y, orientation);
  }

  removeDestroyer() {
    this.#PLAYER_BOARD.removeDestroyer();
  }

  get destroyerInfo() {
    return this.#PLAYER_BOARD.destroyerInfo;
  }

  autoPlaceDestroyer() {
    return this.#PLAYER_BOARD.autoPlaceDestroyer();
  }

  placeSubmarine(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placeSubmarine(x, y, orientation);
  }

  removeSubmarine() {
    return this.#PLAYER_BOARD.removeSubmarine();
  }

  get submarineInfo() {
    return this.#PLAYER_BOARD.submarineInfo;
  }

  autoPlaceSubmarine() {
    return this.#PLAYER_BOARD.autoPlaceSubmarine();
  }

  placePatrolBoat(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placePatrolBoat(x, y, orientation);
  }

  removePatrolBoat() {
    this.#PLAYER_BOARD.removePatrolBoat();
  }

  get patrolBoatInfo() {
    return this.#PLAYER_BOARD.patrolBoatInfo;
  }

  autoPlacePatrolBoat() {
    return this.#PLAYER_BOARD.autoPlacePatrolBoat();
  }

  receiveAttack(x, y) {
    return this.#PLAYER_BOARD.receiveAttack(x, y);
  }

  autoPlaceAllShips() {
    this.#PLAYER_BOARD.autoPlaceAllShips();
  }

  allShipSunk() {
    if (!this.#PLAYER_BOARD.allShipsOnBoard) return false;

    return (
      this.#PLAYER_BOARD.carrierInfo.isSunk &&
      this.#PLAYER_BOARD.battleShipInfo.isSunk &&
      this.#PLAYER_BOARD.destroyerInfo.isSunk &&
      this.#PLAYER_BOARD.submarineInfo.isSunk &&
      this.#PLAYER_BOARD.patrolBoatInfo.isSunk
    );
  }

  get allShipsOnBoard() {
    return this.#PLAYER_BOARD.allShipsOnBoard;
  }
}
