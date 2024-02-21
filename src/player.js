import GameBoard from "./game-board";

export default class Player {

  #PLAYER_BOARD = new GameBoard();

  constructor(name) {
    if (!this.#isValidString(name)) {
      throw new Error('Invalid name parameter');
    }

    this.name = name;
  }

  #isValidString(string) {
    return typeof string === 'string' && string.trim() !== '';
  }

  getBoard() {
    return this.#PLAYER_BOARD;
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
    return this.#PLAYER_BOARD.placeSubMarine(x, y, orientation)
  }

  placePatrolBoat(x, y, orientation = 'horizontal') {
    return this.#PLAYER_BOARD.placePatrolBoat(x, y, orientation);
  }

  receiveAttack(x, y) {
    const status = this.#PLAYER_BOARD.receiveAttack(x, y);
    return status;
  }
}