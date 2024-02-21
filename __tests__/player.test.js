import Player from '../src/player';
import GameBoard from '../src/game-board';

test('Player class exists', () => {
  expect(Player).not.toBeUndefined();
});

test('Player requires a name for creation', () => {
  const tryErrorPlayer = () => new Player();

  expect(() => {
    tryErrorPlayer();
  }).toThrow();
});

test('can create Player', () => {
  const player = new Player('Player 1');
  expect(player).not.toBeUndefined();
  expect(typeof player === 'object').toBe(true);
});

test('has a method to get player board', () => {
  const player = new Player('Player 1');
  expect(player.getBoard).not.toBeUndefined();
});

test('can get a GameBoard', () => {
  const player = new Player('player');
  const board = player.getBoard();

  expect(board instanceof GameBoard).toBe(true);
});

test('player has a method for receiving attack', () => {
  const player = new Player('dfs');
  expect(player.receiveAttack).not.toBeUndefined();
});

test('player should be able to place carrier', () => {
  const player = new Player('something');

  expect(player.placeCarrier(0, 0)).toBe(true);
});

test('player should be able to place battleship', () => {
  const player = new Player('something');

  expect(player.placeBattleShip(0, 0)).toBe(true);
});

test('player should be able to place destroyer', () => {
  const player = new Player('something');

  expect(player.placeDestroyer(0, 0)).toBe(true);
});

test('player should be able to place submarine', () => {
  const player = new Player('something');

  expect(player.placeSubMarine(0, 0)).toBe(true);
});

test('player should be able to place patrol boat', () => {
  const player = new Player('something');

  expect(player.placePatrolBoat(0, 0)).toBe(true);
});

test('player board can receive attack', () => {
  const player = new Player('something');

  expect(player.placeCarrier(5, 0)).toBe(true);
  expect(player.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(player.placeDestroyer(3, 3)).toBe(true);
  expect(player.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(player.placePatrolBoat(1, 9)).toBe(true);

  expect(player.receiveAttack(0, 0)).toBe(true);
});
