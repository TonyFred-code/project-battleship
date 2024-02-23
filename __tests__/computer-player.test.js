import ComputerPlayer from '../src/computer-player.js';
import Player from '../src/player.js';

test('can create computer player', () => {
  expect(ComputerPlayer).toBeDefined();
});

test('computer has a default name', () => {
  const computerPlayer = new ComputerPlayer('something');

  expect(computerPlayer.name).toBe('jarvis');
});

test('computer player is extension of Player', () => {
  const computerPlayer = new ComputerPlayer();

  expect(computerPlayer).toBeInstanceOf(Player);
});

test('computer has a getAttack method', () => {
  const computerPlayer = new ComputerPlayer();

  expect(computerPlayer.getAttack).toBeDefined();
});

test('getAttack gives two element arr as return value', () => {
  const computerPlayer = new ComputerPlayer();
  const opponent = new Player('something');

  const move = computerPlayer.getAttack(opponent.validMoves);

  expect(move).toHaveLength(2);
  expect(Array.isArray(move)).toBeTruthy();

  const [x, y] = move;
  expect(typeof x).toBe('number');
  expect(typeof y).toBe('number');
});

test('does not hit same place twice', () => {
  const computerPlayer = new ComputerPlayer();
  const player = new Player('some');

  expect(player.placeCarrier(5, 0)).toBe(true);
  expect(player.placeBattleShip(0, 4, 'vertical')).toBe(true);
  expect(player.placeDestroyer(3, 3)).toBe(true);
  expect(player.placeSubMarine(6, 6, 'vertical')).toBe(true);
  expect(player.placePatrolBoat(1, 9)).toBe(true);

  function transform(x, y) {
    return y * 10 + x;
  }

  const attacks = new Set();

  function populate() {
    for (let i = 0; i < 100; i += 1) {
      const { validMoves } = player;
      const move = computerPlayer.getAttack(validMoves);
      const [x, y] = move;
      player.receiveAttack(x, y);
      attacks.add(transform(x, y));
    }
  }

  populate();

  expect(attacks.size).toBe(100);
});
