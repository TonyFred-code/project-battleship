import GameRound from './game-round.js';

export default class GameController {
  #GAME_ROUND = null;

  #ROUND_START = false;

  constructor() {
    this.#GAME_ROUND = new GameRound();
  }

  placeHumanPlayerCarrier(x, y, orientation) {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerCarrier(x, y, orientation);
  }

  placeHumanPlayerBattleShip(x, y, orientation) {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerBattleShip(x, y, orientation);
  }

  placeHumanPlayerDestroyer(x, y, orientation) {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerDestroyer(x, y, orientation);
  }

  placeHumanPlayerSubMarine(x, y, orientation) {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerSubMarine(x, y, orientation);
  }

  placeHumanPlayerPatrolBoat(x, y, orientation) {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.placeHumanPlayerPatrolBoat(x, y, orientation);
  }

  autoPlaceHumanPlayerShips() {
    if (!this.#ROUND_START) return;

    this.#GAME_ROUND.autoPlaceHumanShips();
  }

  autoPlaceBotShips() {
    if (!this.#ROUND_START) return;

    this.#GAME_ROUND.autoPlaceBotShips();
  }

  get humanPlayerDetails() {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.humanPlayerDetails();
  }

  get botPlayerDetails() {
    if (!this.#ROUND_START) return false;

    return this.#GAME_ROUND.botPlayerDetails();
  }

  humanPlayerShipDetails() {
    return this.#GAME_ROUND.humanPlayerShipDetails();
  }

  botPlayerShipDetails() {
    return this.#GAME_ROUND.botShipDetails();
  }

  get roundState() {
    const state = this.#GAME_ROUND.roundState;
    const { canPlayRound } = this.#GAME_ROUND;

    return {
      ...state,
      canPlayRound,
    };
  }

  getActivePlayer() {
    if (!this.#ROUND_START) return {};

    return this.#GAME_ROUND.getActivePlayer();
  }

  computerPlayerMove() {
    if (!this.#ROUND_START) return false;

    const { roundWon } = this.roundState;

    if (roundWon) return {};

    const { move, hitStatus } = this.#GAME_ROUND.botMove();

    return { hitStatus, move };
  }

  humanPlayerMove(x, y) {
    if (!this.#ROUND_START) return false;

    const { roundWon } = this.roundState;

    if (roundWon) return {};

    const hitStatus = this.#GAME_ROUND.humanPlayerMove(x, y);

    return hitStatus;
  }

  endRound() {
    this.#ROUND_START = false;
  }

  startRound() {
    this.#GAME_ROUND = new GameRound();
    this.#GAME_ROUND.addBotPlayer();
    this.#GAME_ROUND.addHumanPlayer();
    this.#ROUND_START = true;
  }
}
