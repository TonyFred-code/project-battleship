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

  test.todo('should get player one details');
  test('only creates two players', () => {
    const gameController = new GameController();
    expect(gameController.createHumanPlayer('Player 1')).toBeTruthy();
    expect(gameController.createBotPlayer()).toBeTruthy();
    expect(gameController.createHumanPlayer('Player 3')).not.toBeTruthy();
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
