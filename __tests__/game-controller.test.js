import GameController from '../src/game-controller.js';

test('is defined', () => {
  expect(new GameController()).toBeDefined();
});

describe('players', () => {
  test('can create human player', () => {
    const gameController = new GameController();
    expect(gameController.createHumanPlayer).toBeDefined();
  });

  test('doest not create invalid players', () => {
    const gameController = new GameController();
    gameController.startRound();
    expect(gameController.createHumanPlayer()).not.toBeTruthy();
  });

  test('can create bot player', () => {
    const gameController = new GameController();
    gameController.startRound();
    expect(gameController.createBotPlayer).toBeDefined();
  });

  test('can create one bot one human player', () => {
    const gameController = new GameController();
    gameController.startRound();

    expect(gameController.createBotPlayer()).toBeTruthy();
    expect(gameController.createHumanPlayer('Player 2')).toBeTruthy();
  });

  test('can get players details', () => {
    const gameController = new GameController();
    gameController.startRound();

    expect(gameController.humanPlayerDetails).toBeDefined();
    expect(gameController.botPlayerDetails).toBeDefined();
  });

  describe('has method for ship placements', () => {
    describe('ship placement methods for human-bot is defined', () => {
      test('players can place ships', () => {
        const gameController = new GameController();
        gameController.startRound();

        expect(gameController.placeHumanPlayerCarrier).toBeDefined();

        expect(gameController.placeHumanPlayerBattleShip).toBeDefined();

        expect(gameController.placeHumanPlayerDestroyer).toBeDefined();

        expect(gameController.placeHumanPlayerSubMarine).toBeDefined();

        expect(gameController.placeHumanPlayerPatrolBoat).toBeDefined();

        expect(gameController.autoPlaceBotShips).toBeDefined();

        expect(gameController.autoPlaceHumanPlayerShips).toBeDefined();
      });
    });
  });
});

describe('game round creation', () => {
  test('creation method exists', () => {
    const gameController = new GameController();
    expect(gameController.startRound).toBeDefined();
  });

  test('method for checking gameState exists', () => {
    const gameController = new GameController();
    expect(gameController.gameState).toBeDefined();
  });

  test('should return round state when creating new round state', () => {
    const gameController = new GameController();

    gameController.startRound();

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    gameController.autoPlaceHumanPlayerShips();
    gameController.autoPlaceBotShips();

    const roundState = gameController.gameState;

    expect(roundState).toHaveProperty('roundStart', true);

    expect(roundState).toHaveProperty('roundEnd', false);
  });

  test('round state reflects proper game state', () => {
    const gameController = new GameController();

    const initialRoundState = gameController.gameState;

    expect(initialRoundState).toHaveProperty('roundStart', false);

    gameController.startRound();

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    gameController.autoPlaceHumanPlayerShips();
    gameController.autoPlaceBotShips();

    const roundState = gameController.gameState;

    expect(roundState).toHaveProperty('roundStart', true);
    expect(roundState).toHaveProperty('roundEnd', false);
  });

  test('individual human ship placements works', () => {
    const gameController = new GameController();

    gameController.startRound();

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    // Individual ship placements

    gameController.placeHumanPlayerCarrier(5, 0);

    gameController.placeHumanPlayerBattleShip(0, 4, 'vertical');

    gameController.placeHumanPlayerDestroyer(3, 3);
    gameController.placeHumanPlayerSubMarine(6, 6, 'vertical');

    gameController.placeHumanPlayerPatrolBoat(1, 9);

    const { roundStart } = gameController.gameState;

    expect(roundStart).toBeTruthy();
  });
});

test.skip('knows when game should end', () => {
  const gameController = new GameController();

  gameController.startRound();

  gameController.createHumanPlayer('Player 1');
  gameController.createBotPlayer();

  // Individual ship placements

  gameController.placeHumanPlayerCarrier(5, 0);

  gameController.placeHumanPlayerBattleShip(0, 4, 'vertical');

  gameController.placeHumanPlayerDestroyer(3, 3);
  gameController.placeHumanPlayerSubMarine(6, 6, 'vertical');

  gameController.placeHumanPlayerPatrolBoat(1, 9);

  let { roundStart, roundEnd } = gameController.gameState;

  expect(roundStart).toBeTruthy();
  expect(roundEnd).toBeFalsy();

  const activePlayer = gameController.getActivePlayer();

  expect(activePlayer).toHaveProperty('playerName', 'jarvis');

  const humanPlayerShipConfig = gameController.humanPlayerShipDetails();

  // const botCarrier = botShipConfig.carrierPlacement;
  // const botBattleShip = botShipConfig.battleShipPlacement;
  // const botDestroyer = botShipConfig.destroyerPlacement;
  // const botSubMarine = botShipConfig.subMarinePlacement;
  // const botPatrolBoat = botShipConfig.patrolBoatPlacement;

  const humanPlayerCarrier = humanPlayerShipConfig.carrierPlacement;
  const humanPlayerBattleShip = humanPlayerShipConfig.battleShipPlacement;
  const humanPlayerDestroyer = humanPlayerShipConfig.destroyerPlacement;
  const humanPlayerSubMarine = humanPlayerShipConfig.subMarinePlacement;
  const humanPlayerPatrolBoat = humanPlayerShipConfig.patrolBoatPlacement;

  // const botCarrierShipConfig = botCarrier.occupyingLoc;
  // const botBattleShipShipConfig = botBattleShip.occupyingLoc;
  // const botDestroyerShipConfig = botDestroyer.occupyingLoc;
  // const botSubMarineShipConfig = botSubMarine.occupyingLoc;
  // const botPatrolBoatShipConfig = botPatrolBoat.occupyingLoc;

  const humanPlayerCarrierShipConfig = humanPlayerCarrier.occupyingLoc;
  const humanPlayerBattleShipShipConfig = humanPlayerBattleShip.occupyingLoc;
  const humanPlayerDestroyerShipConfig = humanPlayerDestroyer.occupyingLoc;
  const humanPlayerSubMarineShipConfig = humanPlayerSubMarine.occupyingLoc;
  const humanPlayerPatrolBoatShipConfig = humanPlayerPatrolBoat.occupyingLoc;

  // function humanHit(locationNodes) {
  //   const statusCodes = new Set();

  //   locationNodes.forEach((locationNode) => {
  //     const [x, y] = locationNode;
  //     const statusCode = gameRound.humanPlayerMove(x, y);
  //     statusCodes.add(statusCode);
  //   });

  //   return [...statusCodes];
  // }

  function botHit(locationNodes) {
    const statusCodes = new Set();

    locationNodes.forEach((locationNode) => {
      const [x, y] = locationNode;
      const { hitStatus } = gameController.botMove;
      statusCodes.add(hitStatus);
    });

    return [...statusCodes];
  }

  // auto sink all ships
  botHit(humanPlayerCarrierShipConfig);
  botHit(humanPlayerBattleShipShipConfig);
  botHit(humanPlayerDestroyerShipConfig);
  botHit(humanPlayerSubMarineShipConfig);
  botHit(humanPlayerPatrolBoatShipConfig);

  ({ roundEnd, roundStart } = gameController.gameState);

  expect(roundEnd).toBeTruthy();
  expect(roundStart).toBeFalsy();

  const { roundState } = gameController;

  expect(roundState).toHaveProperty('winnerName', 'jarvis');
  expect(roundState).toHaveProperty('roundWon', true);
});
