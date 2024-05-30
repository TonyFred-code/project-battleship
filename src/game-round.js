import HumanPlayer from './human-player.js';
import ComputerPlayer from './computer-player.js';

export default class GameRound {
  #HUMAN_PLAYER = null;

  #COMPUTER_PLAYER = null;

  #activePlayer = null;

  #HIT_STATUS_0 = 0;

  #HIT_STATUS_1 = 1;

  #ROUND_WINNER_NAME = '';

  #ROUND_WON = false;

  #isValidHitStatus(hitStatus) {
    return hitStatus === this.#HIT_STATUS_0 || hitStatus === this.#HIT_STATUS_1;
  }

  #switchActivePlayer() {
    if (this.#activePlayer === this.#HUMAN_PLAYER) {
      this.#activePlayer = this.#COMPUTER_PLAYER;
    } else if (this.#activePlayer === this.#COMPUTER_PLAYER) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }
  }

  #setActivePlayer() {
    let activePlayer = null;

    if (this.#canAddPlayer()) return activePlayer;

    const random = Math.floor(Math.random() + 1);
    if (random % 2 === 0) {
      activePlayer = this.#COMPUTER_PLAYER;
    } else {
      activePlayer = this.#HUMAN_PLAYER;
    }

    return activePlayer;
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

  addHumanPlayer(playerName) {
    if (typeof playerName !== 'string' || playerName.trim() === '') {
      return false;
    }

    if (this.#HUMAN_PLAYER !== null) return false;

    this.#HUMAN_PLAYER = new HumanPlayer(playerName);

    if (!this.#canAddPlayer()) {
      this.#activePlayer = this.#HUMAN_PLAYER;
    }

    return true;
  }

  getActivePlayer() {
    if (this.#activePlayer === null) return null;

    const playerName = this.#activePlayer.name;

    return {
      playerName,
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
    return this.#COMPUTER_PLAYER.shipPlacements();
  }

  humanPlayerShipDetails() {
    return this.#HUMAN_PLAYER.shipPlacements();
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
    return this.#HUMAN_PLAYER.placeSubMarine(x, y, orientation);
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
    return this.#HUMAN_PLAYER.autoPlaceShips();
  }

  autoPlaceBotShips() {
    return this.#COMPUTER_PLAYER.autoPlaceShips();
  }

  botMove(x, y) {
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

  botRndPlay() {
    const validMoves = this.#HUMAN_PLAYER.getValidMoves();
    const [x, y] = this.#COMPUTER_PLAYER.getAttack(validMoves);

    return this.botMove(x, y);
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
}

const gameRound = new GameRound();

gameRound.addBotPlayer();
gameRound.addHumanPlayer('Player 2');

// gameRound.autoPlaceBotShips();
// gameRound.autoPlaceHumanShips();

gameRound.placeHumanPlayerCarrier(5, 0);
gameRound.placeHumanPlayerBattleShip(0, 4, 'vertical');
gameRound.placeHumanPlayerDestroyer(3, 3);
gameRound.placeHumanPlayerSubMarine(6, 6, 'vertical');
gameRound.placeHumanPlayerPatrolBoat(1, 9);

gameRound.placeComputerCarrier(5, 0);
gameRound.placeComputerBattleShip(0, 4, 'vertical');
gameRound.placeComputerDestroyer(3, 3);
gameRound.placeComputerSubMarine(6, 6, 'vertical');
gameRound.placeComputerPatrolBoat(1, 9);

function hit(locationNodes) {
  const statusCodes = new Set();

  locationNodes.forEach((locationNode) => {
    const [x, y] = locationNode;
    const statusCode = gameRound.humanPlayerMove(x, y);
    statusCodes.add(statusCode);
  });

  return [...statusCodes];
}
const botShipConfig = gameRound.botShipDetails();

// use ship config to make a player win and check
// to ensure roundState() reflects the round win

const botCarrier = botShipConfig.carrierPlacement;
// const botBattleShip = botShipConfig.battleShipPlacement;
// const botDestroyer = botShipConfig.destroyerPlacement;
// const botSubMarine = botShipConfig.subMarinePlacement;
// const botPatrolBoat = botShipConfig.patrolBoatPlacement;

const botCarrierShipConfig = botCarrier.occupyingLoc;
// const botBattleShipShipConfig = botBattleShip.occupyingLoc;
// const botDestroyerShipConfig = botDestroyer.occupyingLoc;
// const botSubMarineShipConfig = botSubMarine.occupyingLoc;
// const botPatrolBoatShipConfig = botPatrolBoat.occupyingLoc;

const botCarrierHitStatus = hit(botCarrierShipConfig);

console.log(botCarrierHitStatus);
