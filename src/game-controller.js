import HumanPlayer from './human-player.js';
import ComputerPlayer from './computer-player.js';

export default class GameController {
  #HUMAN_PLAYER = null;

  #BOT_PLAYER = null;

  #BOT_DETAILS = {
    initialized: false,
    placedShips: false,
  };

  #HUMAN_PLAYER_DETAILS = {
    initialized: false,
    carrierPlaced: false,
    battleShipPlaced: false,
    destroyerPlaced: false,
    subMarinePlaced: false,
    patrolBoatPlaced: false,
    allShipsPlaced: false,
    markAllPlaced() {
      this.carrierPlaced = true;
      this.battleShipPlaced = true;
      this.destroyerPlaced = true;
      this.subMarinePlaced = true;
      this.patrolBoatPlaced = true;
      this.allShipsPlaced = true;
    },
    placedShips() {
      return (
        this.carrierPlaced &&
        this.battleShipPlaced &&
        this.destroyerPlaced &&
        this.subMarinePlaced &&
        this.patrolBoatPlaced
      );
    },
  };

  #GAME_START = false;

  #GAME_END = false;

  createHumanPlayer(playerName) {
    if (typeof playerName !== 'string' || playerName.trim() === '') {
      return false;
    }

    if (this.#HUMAN_PLAYER === null) {
      this.#HUMAN_PLAYER = new HumanPlayer(playerName);
      this.#HUMAN_PLAYER_DETAILS.initialized = true;
      return true;
    }

    return false;
  }

  createBotPlayer() {
    if (this.#BOT_PLAYER === null) {
      this.#BOT_PLAYER = new ComputerPlayer();
      this.#BOT_DETAILS.initialized = true;

      this.placeBotShips();
      this.#BOT_DETAILS.placedShips = true;

      return true;
    }

    return false;
  }

  placeHumanPlayerCarrier(x, y, orientation) {
    const state = this.#HUMAN_PLAYER.placeCarrier(x, y, orientation);

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.carrierPlaced = true;
    }
    return state;
  }

  placeHumanPlayerBattleShip(x, y, orientation) {
    const state = this.#HUMAN_PLAYER.placeBattleShip(x, y, orientation);

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.battleShipPlaced = true;
    }
    return state;
  }

  placeHumanPlayerDestroyer(x, y, orientation) {
    const state = this.#HUMAN_PLAYER.placeDestroyer(x, y, orientation);

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.destroyerPlaced = true;
    }
    return state;
  }

  placeHumanPlayerSubMarine(x, y, orientation) {
    const state = this.#HUMAN_PLAYER.placeSubMarine(x, y, orientation);

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.subMarinePlaced = true;
    }
    return state;
  }

  placeHumanPlayerPatrolBoat(x, y, orientation) {
    const state = this.#HUMAN_PLAYER.placePatrolBoat(x, y, orientation);

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.patrolBoatPlaced = true;
    }
    return state;
  }

  autoPlaceHumanPlayerShips() {
    const state = this.#HUMAN_PLAYER.autoPlaceShips();

    if (state) {
      this.#HUMAN_PLAYER_DETAILS.markAllPlaced();
    }

    return state;
  }

  placeBotShips() {
    return this.#BOT_PLAYER.autoPlaceShips();
  }

  getPlayerDetails() {
    const playerDetails = [];

    if (this.#HUMAN_PLAYER) {
      const player1 = {
        name: this.#HUMAN_PLAYER.name,
      };
      playerDetails.push(player1);
    }

    if (this.#BOT_PLAYER) {
      const player2 = {
        name: this.#BOT_PLAYER.name,
      };
      playerDetails.push(player2);
    }

    return playerDetails;
  }

  #playersComplete() {
    return this.#BOT_PLAYER !== null && this.#HUMAN_PLAYER !== null;
  }

  get gameState() {
    // winner name
    // lost or won
    // game ended
    const GAME_STATE = {
      // humanPlayerName,
      // botPlayerName,
      // roundStart,
      // roundEnd,
    };

    GAME_STATE.humanPlayerName = this.#HUMAN_PLAYER
      ? this.#HUMAN_PLAYER.name
      : null;

    GAME_STATE.botPlayerName = this.#BOT_PLAYER ? this.#BOT_PLAYER.name : null;

    GAME_STATE.roundStart = this.#GAME_START;

    GAME_STATE.roundEnd = this.#GAME_END;

    return GAME_STATE;
  }

  restartRound() {}

  endRound() {
    // this = new GameController();
  }

  startRound() {
    if (
      this.#BOT_DETAILS.initialized &&
      this.#HUMAN_PLAYER_DETAILS.initialized &&
      this.#BOT_DETAILS.placedShips &&
      this.#HUMAN_PLAYER_DETAILS.placedShips()
    ) {
      this.#GAME_START = true;
      this.#GAME_END = false;
    }
  }

  get botPlayerDetails() {}

  get humanPlayerDetails() {}
}
