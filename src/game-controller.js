import HumanPlayer from './human-player.js';
import ComputerPlayer from './computer-player.js';

export default class GameController {
  #PLAYER_ONE = null;

  #PLAYER_TWO = null;

  createHumanPlayer(playerName) {
    if (typeof playerName !== 'string' || playerName.trim() === '') {
      return false;
    }

    if (this.#PLAYER_ONE === null) {
      this.#PLAYER_ONE = new HumanPlayer(playerName);
      return true;
    }

    if (this.#PLAYER_TWO === null) {
      this.#PLAYER_TWO = new HumanPlayer(playerName);
      return true;
    }

    return false;
  }

  createBotPlayer() {
    if (this.#PLAYER_ONE === null) {
      this.#PLAYER_ONE = new ComputerPlayer();
      return true;
    }

    if (this.#PLAYER_TWO === null) {
      this.#PLAYER_TWO = new ComputerPlayer();
      return true;
    }

    return false;
  }

  placePlayerOneCarrier() {}

  placePlayerOneBattleShip() {}

  placePlayerOneDestroyer() {}

  placePlayerOneSubMarine() {}

  placePlayerOnePatrolBoat() {}

  placePlayerTwoCarrier() {}

  placePlayerTwoBattleShip() {}

  placePlayerTwoDestroyer() {}

  placePlayerTwoSubMarine() {}

  placePlayerTwoPatrolBoat() {}

  getPlayerDetails() {
    const playerDetails = [];

    if (this.#PLAYER_ONE) {
      const player1 = {
        name: this.#PLAYER_ONE.name,
      };
      playerDetails.push(player1);
    }

    if (this.#PLAYER_TWO) {
      const player2 = {
        name: this.#PLAYER_TWO.name,
      };
      playerDetails.push(player2);
    }

    return playerDetails;
  }
}
