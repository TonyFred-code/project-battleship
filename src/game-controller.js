import GameRound from './game-round.js';

export default class GameController {
  #GAME_ROUND = null;

  #GAME_START = false;

  placeHumanPlayerCarrier(x, y, orientation) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerCarrier(x, y, orientation);
  }

  placeHumanPlayerBattleShip(x, y, orientation) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerBattleShip(x, y, orientation);
  }

  placeHumanPlayerDestroyer(x, y, orientation) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerDestroyer(x, y, orientation);
  }

  placeHumanPlayerSubMarine(x, y, orientation) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerSubMarine(x, y, orientation);
  }

  placeHumanPlayerPatrolBoat(x, y, orientation) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerPatrolBoat(x, y, orientation);
  }

  autoPlaceHumanPlayerShips() {
    if (!this.#GAME_START) return;

    this.#GAME_ROUND.autoPlaceHumanShips();
  }

  autoPlaceBotShips() {
    if (!this.#GAME_START) return;

    this.#GAME_ROUND.autoPlaceBotShips();
  }

  get humanPlayerDetails() {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.humanPlayerDetails();
  }

  get botPlayerDetails() {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.botPlayerDetails();
  }

  humanPlayerShipDetails() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.humanPlayerShipDetails();
  }

  botPlayerShipDetails() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.botShipDetails();
  }

  get roundState() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.roundState;
  }

  getActivePlayer() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.getActivePlayer();
  }

  computerPlayerMove() {
    if (!this.#GAME_START) return false;

    const { move, hitStatus } = this.#GAME_ROUND.botMove;

    const { roundWon } = this.roundState;

    if (roundWon) {
      this.endRound();
    }

    return { hitStatus, move };
  }

  humanPlayerMove(x, y) {
    if (!this.#GAME_START) return false;

    const hitStatus = this.#GAME_ROUND.humanPlayerMove(x, y);

    const { roundWon } = this.roundState;

    if (roundWon) {
      this.endRound();
    }

    return hitStatus;
  }

  endRound() {
    this.#GAME_START = false;
    this.#GAME_ROUND = null;
  }

  startRound() {
    this.#GAME_ROUND = new GameRound();
    this.#GAME_ROUND.addBotPlayer();
    this.#GAME_ROUND.addHumanPlayer();
    this.#GAME_START = true;
  }
}
