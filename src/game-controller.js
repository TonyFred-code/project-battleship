import GameRound from './game-round.js';

export default class GameController {
  #GAME_ROUND = null;

  #GAME_START = false;

  #GAME_END = false;

  createHumanPlayer(playerName) {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.addHumanPlayer(playerName);
  }

  createBotPlayer() {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.addBotPlayer();
  }

  canBeHumanPlayerCarrierShipHead(x, y, orientation) {
    return this.#GAME_ROUND.canBeHumanPlayerCarrierShipHead(x, y, orientation);
  }

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
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.autoPlaceHumanShips();
  }

  autoPlaceBotShips() {
    if (!this.#GAME_START) return false;

    return this.#GAME_ROUND.autoPlaceBotShips();
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

  get humanPlayerCarrierPlacementDetails() {
    return this.#GAME_ROUND.humanPlayerCarrierPlacementDetails;
  }

  get humanPlayerBattleShipPlacementDetails() {
    return this.#GAME_ROUND.humanPlayerBattleShipPlacementDetails;
  }

  get humanPlayerDestroyerPlacementDetails() {
    return this.#GAME_ROUND.humanPlayerDestroyerPlacementDetails;
  }

  get humanPlayerSubMarinePlacementDetails() {
    return this.#GAME_ROUND.humanPlayerSubMarinePlacementDetails;
  }

  get humanPlayerPatrolBoatPlacementDetails() {
    return this.#GAME_ROUND.humanPlayerPatrolBoatPlacementDetails;
  }

  get computerPlayerCarrierPlacementDetails() {
    return this.#GAME_ROUND.computerPlayerCarrierPlacementDetails;
  }

  get computerPlayerBattleShipPlacementDetails() {
    return this.#GAME_ROUND.computerPlayerBattleShipPlacementDetails;
  }

  get computerPlayerDestroyerPlacementDetails() {
    return this.#GAME_ROUND.computerPlayerDestroyerPlacementDetails;
  }

  get computerPlayerSubMarinePlacementDetails() {
    return this.#GAME_ROUND.computerPlayerSubMarinePlacementDetails;
  }

  get computerPlayerPatrolBoatPlacementDetails() {
    return this.#GAME_ROUND.computerPlayerPatrolBoatPlacementDetails;
  }

  get gameState() {
    // winner name?
    // lost or won
    // game ended
    const GAME_STATE = {
      // roundStart,
      // roundEnd,
    };

    // GAME_STATE.humanPlayerName = this.#HUMAN_PLAYER
    //   ? this.#HUMAN_PLAYER.name
    //   : null;

    // GAME_STATE.botPlayerName = this.#BOT_PLAYER ? this.#BOT_PLAYER.name : null;

    GAME_STATE.roundStart = this.#GAME_START;

    GAME_STATE.roundEnd = this.#GAME_END;
    const canPlayRound =
      this.#GAME_ROUND !== null && this.#GAME_ROUND.canPlayRound;

    GAME_STATE.canPlayRound = canPlayRound;
    return GAME_STATE;
  }

  get roundState() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.roundState;
  }

  getActivePlayer() {
    if (this.#GAME_ROUND === null) return {};

    return this.#GAME_ROUND.getActivePlayer();
  }

  botMove(x, y) {
    if (!this.#GAME_START) return false;

    const hitStatus = this.#GAME_ROUND.botMove(x, y);

    const { roundWon } = this.roundState;

    if (roundWon) {
      this.endRound();
    }

    return hitStatus;
  }

  get computerPlayerMove() {
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
    this.#GAME_END = true;
    this.#GAME_START = false;
  }

  startRound(difficulty = 'easy') {
    if (!GameRound.isValidRoundDifficulty(difficulty)) {
      this.#GAME_ROUND = new GameRound('easy');
    } else {
      this.#GAME_ROUND = new GameRound(difficulty);
    }

    this.#GAME_START = true;
    this.#GAME_END = false;
  }
}

// const gameController = new GameController();

// gameController.startRound();

// gameController.createHumanPlayer('Player 1');
// gameController.createBotPlayer();

// // const { roundState } = gameController;s

// // Individual ship placements

// gameController.placeHumanPlayerCarrier(5, 0);

// gameController.placeHumanPlayerBattleShip(0, 4, 'vertical');

// gameController.placeHumanPlayerDestroyer(3, 3);
// gameController.placeHumanPlayerSubMarine(6, 6, 'vertical');

// gameController.placeHumanPlayerPatrolBoat(1, 9);

// const { roundStart, roundEnd } = gameController.gameState;

// console.table(gameController.gameState);

// const activePlayer = gameController.getActivePlayer();

// console.table(activePlayer);

// const humanPlayerShipConfig = gameController.humanPlayerShipDetails();

// // const botCarrier = botShipConfig.carrierPlacement;
// // const botBattleShip = botShipConfig.battleShipPlacement;
// // const botDestroyer = botShipConfig.destroyerPlacement;
// // const botSubMarine = botShipConfig.subMarinePlacement;
// // const botPatrolBoat = botShipConfig.patrolBoatPlacement;

// const humanPlayerCarrier = humanPlayerShipConfig.carrierPlacement;
// const humanPlayerBattleShip = humanPlayerShipConfig.battleShipPlacement;
// const humanPlayerDestroyer = humanPlayerShipConfig.destroyerPlacement;
// const humanPlayerSubMarine = humanPlayerShipConfig.subMarinePlacement;
// const humanPlayerPatrolBoat = humanPlayerShipConfig.patrolBoatPlacement;

// // const botCarrierShipConfig = botCarrier.occupyingLoc;
// // const botBattleShipShipConfig = botBattleShip.occupyingLoc;
// // const botDestroyerShipConfig = botDestroyer.occupyingLoc;
// // const botSubMarineShipConfig = botSubMarine.occupyingLoc;
// // const botPatrolBoatShipConfig = botPatrolBoat.occupyingLoc;

// const humanPlayerCarrierShipConfig = humanPlayerCarrier.occupyingLoc;
// const humanPlayerBattleShipShipConfig = humanPlayerBattleShip.occupyingLoc;
// const humanPlayerDestroyerShipConfig = humanPlayerDestroyer.occupyingLoc;
// const humanPlayerSubMarineShipConfig = humanPlayerSubMarine.occupyingLoc;
// const humanPlayerPatrolBoatShipConfig = humanPlayerPatrolBoat.occupyingLoc;

// // function humanHit(locationNodes) {
// //   const statusCodes = new Set();

// //   locationNodes.forEach((locationNode) => {
// //     const [x, y] = locationNode;
// //     const statusCode = gameRound.humanPlayerMove(x, y);
// //     statusCodes.add(statusCode);
// //   });

// //   return [...statusCodes];
// // }

// function botHit(locationNodes) {
//   const statusCodes = new Set();

//   locationNodes.forEach((locationNode) => {
//     const [x, y] = locationNode;
//     const statusCode = gameController.botMove(x, y);
//     statusCodes.add(statusCode);
//   });

//   return [...statusCodes];
// }

// // auto sink all ships
// botHit(humanPlayerCarrierShipConfig);
// botHit(humanPlayerBattleShipShipConfig);
// botHit(humanPlayerDestroyerShipConfig);
// botHit(humanPlayerSubMarineShipConfig);
// botHit(humanPlayerPatrolBoatShipConfig);

// // ({ roundEnd, roundStart } = gameController.gameState);

// console.log(gameController.roundState);

// const { roundState } = gameController;

// console.log(roundState);
