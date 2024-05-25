import GameRound from '../src/game-round.js';

describe('can return active player', () => {
  test('getActivePlayer method exists', () => {
    const gameRound = new GameRound();

    expect(gameRound.getActivePlayer).toBeDefined();
  });

  test('getActivePlayer returns correct active player', () => {
    const gameRound = new GameRound();

    let activePlayer = gameRound.getActivePlayer();

    expect(activePlayer).toBeFalsy();

    gameRound.addBotPlayer();

    activePlayer = gameRound.getActivePlayer();

    expect(activePlayer).toBeFalsy();

    gameRound.addHumanPlayer('Player 2');

    activePlayer = gameRound.getActivePlayer();
    expect(activePlayer).toBeTruthy();

    expect(activePlayer).toHaveProperty('playerName', 'Player 2');
  });
});

describe('can remove active players', () => {
  test('remove active players method exist', () => {
    const gameRound = new GameRound();

    expect(gameRound.removePlayers).toBeDefined();
  });

  test('removePlayers() removes active players', () => {
    const gameRound = new GameRound();

    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    expect(gameRound.getActivePlayer()).toBeTruthy();

    gameRound.removePlayers();

    expect(gameRound.getActivePlayer()).toBeFalsy();
  });
});

describe('can add human and bot players', () => {
  test('addHumanPlayer method exists', () => {
    const gameRound = new GameRound();

    expect(gameRound.addHumanPlayer).toBeDefined();
  });

  test('addBotPlayer method exists', () => {
    const gameRound = new GameRound();

    expect(gameRound.addBotPlayer).toBeDefined();
  });

  test('doest not create invalid players', () => {
    const gameRound = new GameRound();

    expect(gameRound.addHumanPlayer()).toBeFalsy();
  });

  test('can create one bot one human player', () => {
    const gameRound = new GameRound();
    expect(gameRound.addBotPlayer()).toBeTruthy();
    expect(gameRound.addHumanPlayer('Player 2')).toBeTruthy();
  });

  test('can create only one bot and one human players', () => {
    const gameRound = new GameRound();

    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    expect(gameRound.addBotPlayer()).toBeFalsy();
    expect(gameRound.addHumanPlayer()).toBeFalsy();
  });

  // test('can create two human players', () => {
  //   const gameRound = new GameRound();

  //   expect(gameRound.addHumanPlayer('Player 1')).toBeTruthy();
  //   expect(gameRound.addHumanPlayer('Player 2')).toBeTruthy();
  // });
});

describe('round state can be returned', () => {
  const gameRound = new GameRound();

  test('should have roundState()', () => {
    expect(gameRound.roundState).toBeDefined();
  });

  test('roundState returns proper round particulars', () => {
    let { roundState } = gameRound;

    expect(roundState).toHaveProperty('roundWon');
    expect(roundState).toHaveProperty('winnerName');

    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    gameRound.autoPlaceBotShips();
    gameRound.autoPlaceHumanShips();

    const botShipConfig = gameRound.botShipDetails();
    // const humanShipConfig = ;

    // use ship config to make a player win and check
    // to ensure roundState() reflects the round win

    const botCarrier = botShipConfig.carrierPlacement;
    const botBattleShip = botShipConfig.battleShipPlacement;
    const botDestroyer = botShipConfig.destroyerPlacement;
    const botSubMarine = botShipConfig.subMarinePlacement;
    const botPatrolBoat = botShipConfig.patrolBoatPlacement;

    // const humanCarrier = humanShipConfig.carrierPlacement;
    // const humanBattleShip = humanShipConfig.battleShipPlacement;
    // const humanDestroyer = humanShipConfig.destroyerPlacement;
    // const humanSubMarine = humanShipConfig.subMarinePlacement;
    // const humanPatrolBoat = humanShipConfig.patrolBoatPlacement;

    const botCarrierShipConfig = botCarrier.occupyingLoc;
    const botBattleShipShipConfig = botBattleShip.occupyingLoc;
    const botDestroyerShipConfig = botDestroyer.occupyingLoc;
    const botSubMarineShipConfig = botSubMarine.occupyingLoc;
    const botPatrolBoatShipConfig = botPatrolBoat.occupyingLoc;

    // hit ships
    function hit(locationNodes) {
      const statusCodes = new Set();

      locationNodes.forEach((locationNode) => {
        const [x, y] = locationNode;
        const statusCode = gameRound.humanPlayerMove(x, y);
        statusCodes.add(statusCode);
      });

      return [...statusCodes];
    }

    const botCarrierHitStatus = hit(botCarrierShipConfig);

    expect(botCarrierHitStatus).toHaveLength(1);
    expect(botCarrierHitStatus.includes(1)).toBe(true);

    ({ roundState } = gameRound);

    expect(roundState.roundWon).toBeFalsy();
    expect(roundState.winnerName).toBe('');

    const botBattleShipHitStatus = hit(botBattleShipShipConfig);

    expect(botBattleShipHitStatus).toHaveLength(1);
    expect(botBattleShipHitStatus.includes(1)).toBe(true);

    ({ roundState } = gameRound);

    expect(roundState.roundWon).toBeFalsy();
    expect(roundState.winnerName).toBe('');

    const botDestroyerHitStatus = hit(botDestroyerShipConfig);

    expect(botDestroyerHitStatus).toHaveLength(1);
    expect(botDestroyerHitStatus.includes(1)).toBe(true);

    ({ roundState } = gameRound);

    expect(roundState.roundWon).toBeFalsy();
    expect(roundState.winnerName).toBe('');

    const botSubMarineHitStatus = hit(botSubMarineShipConfig);

    expect(botSubMarineHitStatus).toHaveLength(1);
    expect(botSubMarineHitStatus.includes(1)).toBe(true);

    ({ roundState } = gameRound);

    expect(roundState.roundWon).toBeFalsy();
    expect(roundState.winnerName).toBe('');

    const botPatrolBoatHItStatus = hit(botPatrolBoatShipConfig);

    expect(botPatrolBoatHItStatus).toHaveLength(1);
    expect(botPatrolBoatHItStatus.includes(1)).toBe(true);

    ({ roundState } = gameRound);

    expect(roundState.roundWon).toBeTruthy();
    expect(roundState.winnerName).toBe('Player 2');
  });
});

describe('can return particulars of both players', () => {
  test('humanPlayerDetails method exists', () => {
    const gameRound = new GameRound();

    expect(gameRound.humanPlayerDetails).toBeDefined();
  });

  test('botPlayerDetails method exists', () => {
    const gameRound = new GameRound();

    expect(gameRound.botPlayerDetails).toBeDefined();
  });

  test('humanPlayer returns correct human details', () => {
    const gameRound = new GameRound();

    expect(gameRound.humanPlayerDetails()).toBeFalsy();

    gameRound.addHumanPlayer('Player 1');

    expect(gameRound.humanPlayerDetails()).toHaveProperty(
      'playerName',
      'Player 1',
    );
  });

  test('botPlayerDetails returns correct details', () => {
    const gameRound = new GameRound();

    expect(gameRound.botPlayerDetails()).toBeFalsy();

    gameRound.addBotPlayer();

    expect(gameRound.botPlayerDetails()).toHaveProperty('playerName', 'jarvis');
  });
});

describe('allows playing in turns', () => {
  test('botMove method exists', () => {
    const gameRound = new GameRound();
    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    expect(gameRound.botMove).toBeDefined();
  });

  test('humanPlayerMove method exists', () => {
    const gameRound = new GameRound();
    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    expect(gameRound.humanPlayerMove).toBeDefined();
  });

  test('disallows moving unless all ships placed', () => {
    const gameRound = new GameRound();
    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    expect(gameRound.botMove(0, 0)).toBe(-1);
    expect(gameRound.humanPlayerMove(0, 0)).toBe(-1);
  });

  test('allows moving when ships placed', () => {
    const gameRound = new GameRound();
    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');

    gameRound.autoPlaceBotShips();
    gameRound.autoPlaceHumanShips();

    function isValidHit(hitStatus) {
      return hitStatus === 0 || hitStatus === 1;
    }

    const humanHitStatus = gameRound.humanPlayerMove(0, 1);

    expect(isValidHit(humanHitStatus)).toBe(true);

    const botHitStatus = gameRound.botMove(0, 0);

    expect(isValidHit(botHitStatus)).toBe(true);
  });

  test('plays according to active player', () => {
    const gameRound = new GameRound();

    gameRound.addBotPlayer();
    gameRound.addHumanPlayer('Player 2');
    gameRound.autoPlaceBotShips();
    gameRound.autoPlaceHumanShips();

    gameRound.humanPlayerMove(0, 0);
    expect(gameRound.humanPlayerMove(0, 1)).toBe(-1);

    expect(gameRound.botMove(0, 3)).not.toBe(-1);
  });
});

// describe('can return ship particulars of both players', () => {
//   const gameRound = new GameRound();

//   gameRound.addBotPlayer();

//   gameRound.addHumanPlayer('Player 2');
//   test('botShipDetails method exists', () => {
//     expect(gameRound.botShipDetails).toBeDefined();
//   });

//   test('humanPlayerShipDetails method exists', () => {
//     expect(gameRound.humanPlayerShipDetails).toBeDefined();
//   });

//   test('placeBotShips method exists', () => {
//     expect(gameRound.autoPlaceBotShips).toBeDefined();
//   });

//   describe('human ship placement methods', () => {
//     test('human ship placing methods exists', () => {
//       expect(gameRound.placeHumanPlayerCarrier).toBeDefined();

//       expect(gameRound.placeHumanPlayerBattleShip).toBeDefined();

//       expect(gameRound.placeHumanPlayerDestroyer).toBeDefined();

//       expect(gameRound.placeHumanPlayerSubMarine).toBeDefined();

//       expect(gameRound.placeHumanPlayerPatrolBoat).toBeDefined();

//       expect(gameRound.autoPlaceHumanShips).toBeDefined();
//     });
//   });

//   test('botShipDetails returns correct data', () => {
//     // expect(gameRound.botShipDetails()).toBeFalsy();

//     gameRound.autoPlaceBotShips();

//     expect(gameRound.botShipDetails()).toBeTruthy();
//   });
// });

// todo: add test to properly check for continuous hits
