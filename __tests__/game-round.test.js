import GameRound from '../src/game-round.js';

describe('can return active player', () => {});

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

describe('allows playing in turns', () => {});

describe('can return ship particulars of both players', () => {});
