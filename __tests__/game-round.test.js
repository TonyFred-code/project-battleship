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
    // First Active Player is always Human
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

describe('round state can be returned', () => {});

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

    const botHitStatus = gameRound.botMove(0, 0);

    expect(isValidHit(botHitStatus)).toBe(true);

    const humanHitStatus = gameRound.humanPlayerMove(0, 1);
    expect(isValidHit(humanHitStatus)).toBe(true);
  });
});

describe('can return ship particulars of both players', () => {
  const gameRound = new GameRound();

  gameRound.addBotPlayer();

  gameRound.addHumanPlayer('Player 2');
  test('botShipDetails method exists', () => {
    expect(gameRound.botShipDetails).toBeDefined();
  });

  test('humanPlayerShipDetails method exists', () => {
    expect(gameRound.humanPlayerShipDetails).toBeDefined();
  });

  test('placeBotShips method exists', () => {
    expect(gameRound.autoPlaceBotShips).toBeDefined();
  });

  describe('human ship placement methods', () => {
    test('human ship placing methods exists', () => {
      expect(gameRound.placeHumanPlayerCarrier).toBeDefined();

      expect(gameRound.placeHumanPlayerBattleShip).toBeDefined();

      expect(gameRound.placeHumanPlayerDestroyer).toBeDefined();

      expect(gameRound.placeHumanPlayerSubMarine).toBeDefined();

      expect(gameRound.placeHumanPlayerPatrolBoat).toBeDefined();

      expect(gameRound.autoPlaceHumanShips).toBeDefined();
    });
  });

  test('botShipDetails returns correct data', () => {
    // expect(gameRound.botShipDetails()).toBeFalsy();

    gameRound.autoPlaceBotShips();

    expect(gameRound.botShipDetails()).toBeTruthy();
  });
});
