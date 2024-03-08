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

  test('can create two human player', () => {
    const gameController = new GameController();
    expect(gameController.createHumanPlayer('Player 1')).toBeTruthy();
    expect(gameController.createHumanPlayer('Player 2')).toBeTruthy();
  });

  test('can create bot player', () => {
    const gameController = new GameController();
    expect(gameController.createBotPlayer).toBeDefined();
  });

  test('can create two bot players', () => {
    const gameController = new GameController();
    expect(gameController.createBotPlayer()).toBeTruthy();
    expect(gameController.createBotPlayer()).toBeTruthy();
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

  test('players can place ships', () => {
    const gameController = new GameController();
    expect(gameController.placePlayerOneCarrier).toBeDefined();
    expect(gameController.placePlayerTwoCarrier).toBeDefined();

    expect(gameController.placePlayerOneBattleShip).toBeDefined();
    expect(gameController.placePlayerTwoBattleShip).toBeDefined();

    expect(gameController.placePlayerOneDestroyer).toBeDefined();
    expect(gameController.placePlayerTwoDestroyer).toBeDefined();

    expect(gameController.placePlayerOneSubMarine).toBeDefined();
    expect(gameController.placePlayerTwoSubMarine).toBeDefined();

    expect(gameController.placePlayerOnePatrolBoat).toBeDefined();
    expect(gameController.placePlayerTwoPatrolBoat).toBeDefined();
  });
});

test.todo('controller create a new game');

test.todo('allows players to play in turns');

test.todo('can get details of players');

test.todo('can get properties of active player');

test.todo('knows when game should end');

test.todo('can restart game when game end');

test.todo('player can forfeit - surrender');

test.todo('');
