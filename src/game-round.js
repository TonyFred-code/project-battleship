import HumanPlayer from './human-player.js';
import ComputerPlayer from './computer-player.js';

export default class GameRound {
  #HUMAN_PLAYER = null;

  #COMPUTER_PLAYER = null;

  #activePlayer = null;

  #HIT_STATUS_0 = 0;

  #ROUND_WINNER_NAME = '';

  #ROUND_WON = false;

  #switchActivePlayer() {
    if (this.#activePlayer === this.#HUMAN_PLAYER) {
      this.#activePlayer = this.#COMPUTER_PLAYER;
    } else if (this.#activePlayer === this.#COMPUTER_PLAYER) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }
  }

  #canAddPlayer() {
    return this.#COMPUTER_PLAYER === null || this.#HUMAN_PLAYER === null;
  }

  addBotPlayer() {
    if (this.#COMPUTER_PLAYER !== null) return false;

    this.#COMPUTER_PLAYER = new ComputerPlayer();

    if (!this.#canAddPlayer()) {
      this.#activePlayer = this.#COMPUTER_PLAYER;
    }

    return true;
  }

  addHumanPlayer() {
    if (this.#HUMAN_PLAYER !== null) return false;

    this.#HUMAN_PLAYER = new HumanPlayer();

    if (!this.#canAddPlayer()) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }

    return true;
  }

  getActivePlayer() {
    if (this.#activePlayer === null) return null;

    const playerName = this.#activePlayer.name;

    const isBot = this.#activePlayer === this.#COMPUTER_PLAYER;
    const isHuman = this.#activePlayer === this.#HUMAN_PLAYER;

    return {
      playerName,
      isBot,
      isHuman,
    };
  }

  removePlayers() {
    this.#COMPUTER_PLAYER = null;
    this.#HUMAN_PLAYER = null;
    this.#activePlayer = null;
  }

  humanPlayerDetails() {
    if (this.#HUMAN_PLAYER === null) return null;

    const playerName = this.#HUMAN_PLAYER.name;

    return {
      playerName,
    };
  }

  botPlayerDetails() {
    if (this.#COMPUTER_PLAYER === null) return null;

    const playerName = this.#COMPUTER_PLAYER.name;

    return {
      playerName,
    };
  }

  botShipDetails() {
    const {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    } = this.#COMPUTER_PLAYER;

    return {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    };
  }

  humanPlayerShipDetails() {
    const {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    } = this.#HUMAN_PLAYER;

    return {
      carrierInfo,
      battleShipInfo,
      destroyerInfo,
      submarineInfo,
      patrolBoatInfo,
    };
  }

  placeHumanPlayerCarrier(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeCarrier(x, y, orientation);
  }

  placeHumanPlayerBattleShip(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeBattleShip(x, y, orientation);
  }

  placeHumanPlayerDestroyer(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeDestroyer(x, y, orientation);
  }

  placeHumanPlayerSubMarine(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placeSubmarine(x, y, orientation);
  }

  placeHumanPlayerPatrolBoat(x, y, orientation = 'horizontal') {
    return this.#HUMAN_PLAYER.placePatrolBoat(x, y, orientation);
  }

  placeComputerCarrier(x, y, orientation = 'horizontal') {
    return this.#COMPUTER_PLAYER.placeCarrier(x, y, orientation);
  }

  placeComputerBattleShip(x, y, orientation = 'horizontal') {
    return this.#COMPUTER_PLAYER.placeBattleShip(x, y, orientation);
  }

  placeComputerDestroyer(x, y, orientation = 'horizontal') {
    return this.#COMPUTER_PLAYER.placeDestroyer(x, y, orientation);
  }

  placeComputerSubMarine(x, y, orientation = 'horizontal') {
    return this.#COMPUTER_PLAYER.placeSubMarine(x, y, orientation);
  }

  placeComputerPatrolBoat(x, y, orientation = 'horizontal') {
    return this.#COMPUTER_PLAYER.placePatrolBoat(x, y, orientation);
  }

  autoPlaceHumanShips() {
    return this.#HUMAN_PLAYER.autoPlaceAllShips();
  }

  autoPlaceBotShips() {
    return this.#COMPUTER_PLAYER.autoPlaceAllShips();
  }

  #botMove(x, y) {
    if (this.#activePlayer !== this.#COMPUTER_PLAYER) return -1;

    const hitStatus = this.#HUMAN_PLAYER.receiveAttack(x, y);

    if (hitStatus === this.#HIT_STATUS_0) {
      this.#switchActivePlayer();
    }

    if (this.#HUMAN_PLAYER.allShipSunk()) {
      this.#ROUND_WINNER_NAME = this.#COMPUTER_PLAYER.name;
      this.#ROUND_WON = true;
    }

    return hitStatus;
  }

  botMove() {
    const [x, y] = this.#COMPUTER_PLAYER.getAttack(this.#HUMAN_PLAYER);

    const hitStatus = this.#botMove(x, y);
    const move = [x, y];

    return { move, hitStatus };
  }

  humanPlayerMove(x, y) {
    if (this.#activePlayer !== this.#HUMAN_PLAYER) return -1;

    const hitStatus = this.#COMPUTER_PLAYER.receiveAttack(x, y);

    if (hitStatus === this.#HIT_STATUS_0) {
      this.#switchActivePlayer();
    }

    if (this.#COMPUTER_PLAYER.allShipSunk()) {
      this.#ROUND_WINNER_NAME = this.#HUMAN_PLAYER.name;
      this.#ROUND_WON = true;
    }

    return hitStatus;
  }

  get roundState() {
    return {
      roundWon: this.#ROUND_WON,
      winnerName: this.#ROUND_WINNER_NAME,
    };
  }

  get canPlayRound() {
    return (
      this.#COMPUTER_PLAYER !== null &&
      this.#HUMAN_PLAYER !== null &&
      this.#COMPUTER_PLAYER.allShipsOnBoard &&
      this.#HUMAN_PLAYER.allShipsOnBoard
    );
  }
}
