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
    expect(gameController.createHumanPlayer()).not.toBeTruthy();
  });

  test('can create bot player', () => {
    const gameController = new GameController();
    expect(gameController.createBotPlayer).toBeDefined();
  });

  test('can create one bot one human player', () => {
    const gameController = new GameController();
    expect(gameController.createBotPlayer()).toBeTruthy();
    expect(gameController.createHumanPlayer('Player 2')).toBeTruthy();
  });

  test('can get players details', () => {
    const gameController = new GameController();

    expect(gameController.getPlayerDetails).toBeDefined();
  });

  test('returns empty array no player', () => {
    const gameController = new GameController();

    expect(gameController.getPlayerDetails()).toHaveLength(0);
  });

  test('returns one element array if only one player created', () => {
    const gameController = new GameController();
    gameController.createHumanPlayer('Player 1');

    expect(gameController.getPlayerDetails()).toHaveLength(1);
  });

  test('gets correct player details', () => {
    const gameController = new GameController();
    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();
    const playerDetails = gameController.getPlayerDetails();
    expect(playerDetails).toHaveLength(2);
    const [player1, player2] = playerDetails;
    expect(player1.name).toBe('Player 1');
    expect(player2.name).toBe('jarvis');
  });

  test('only creates two players', () => {
    const gameController = new GameController();
    expect(gameController.createHumanPlayer('Player 1')).toBeTruthy();
    expect(gameController.createBotPlayer()).toBeTruthy();
    expect(gameController.createHumanPlayer('Player 3')).not.toBeTruthy();
  });

  describe('has method for ship placements', () => {
    describe('ship placement methods for human-bot is defined', () => {
      test('players can place ships', () => {
        const gameController = new GameController();
        expect(gameController.placeHumanPlayerCarrier).toBeDefined();

        expect(gameController.placeHumanPlayerBattleShip).toBeDefined();

        expect(gameController.placeHumanPlayerDestroyer).toBeDefined();

        expect(gameController.placeHumanPlayerSubMarine).toBeDefined();

        expect(gameController.placeHumanPlayerPatrolBoat).toBeDefined();

        expect(gameController.placeBotShips).toBeDefined();

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

  test('allow round start when proper details are entered', () => {
    const gameController = new GameController();

    // enters player name
    gameController.createHumanPlayer('Player 1');
    // create bot
    gameController.createBotPlayer();

    // position player ships
    gameController.autoPlaceHumanPlayerShips();

    gameController.startRound();

    expect(gameController.gameState.roundStart).toBeTruthy();
  });

  test('should return round state when creating new round state', () => {
    const gameController = new GameController();

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    gameController.autoPlaceHumanPlayerShips();

    gameController.startRound();

    const roundState = gameController.gameState;

    expect(roundState).toHaveProperty('humanPlayerName', 'Player 1');
    expect(roundState).toHaveProperty('botPlayerName', 'jarvis');

    expect(roundState).toHaveProperty('roundStart', true);

    expect(roundState).toHaveProperty('roundEnd', false);
  });

  test('round state reflects proper game state', () => {
    const gameController = new GameController();

    const initialRoundState = gameController.gameState;

    expect(initialRoundState).toHaveProperty('roundStart', false);

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    gameController.autoPlaceHumanPlayerShips();

    gameController.startRound();

    const roundState = gameController.gameState;

    expect(roundState).toHaveProperty('humanPlayerName', 'Player 1');
    expect(roundState).toHaveProperty('botPlayerName', 'jarvis');

    expect(roundState).toHaveProperty('roundStart', true);

    expect(roundState).toHaveProperty('roundEnd', false);
  });

  test('individual human ship placements works', () => {
    const gameController = new GameController();

    gameController.createHumanPlayer('Player 1');
    gameController.createBotPlayer();

    gameController.placeHumanPlayerBattleShip(0, 0, 'vertical');

    gameController.placeHumanPlayerCarrier(0, 2, 'vertical');

    gameController.placeHumanPlayerDestroyer(0, 4, 'vertical');

    gameController.placeHumanPlayerSubMarine(0, 6, 'vertical');

    gameController.placeHumanPlayerPatrolBoat(0, 8, 'vertical');

    gameController.startRound();

    const { roundStart } = gameController.gameState;

    expect(roundStart).toBeTruthy();
  });

  test('refuse start if players not created', () => {
    const gameController = new GameController();

    gameController.startRound();

    const { gameState } = gameController;

    expect(gameState).toHaveProperty('roundStart', false);
  });
});

test.todo('allows players to play in turns');

test.todo('can get details of players');

test.todo('can get properties of active player');

test.todo('knows when game should end');

test.todo('can restart game when game end');

test.todo('player can forfeit - surrender');

test.todo('');
