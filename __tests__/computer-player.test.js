import ComputerPlayer from '../src/computer-player.js';
import Player from '../src/player.js';

test('can create computer player', () => {
  expect(ComputerPlayer).not.toBeUndefined();
});

test('computer has a default name', () => {
  const computerPlayer = new ComputerPlayer('something');

  expect(computerPlayer.name).toBe('jarvis');
});

test('computer player is extension of Player', () => {
  const computerPlayer = new ComputerPlayer();
  const state = computerPlayer instanceof Player;

  expect(state).toBe(true);
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

test('computer does not hit same place twice', () => {
  const computerPlayer = new ComputerPlayer();
  const opponent = new Player('something');

  function transform(x, y) {
    return y * 10 + x;
  }
  const attacks = [];

  function populate() {
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const movesAvail = opponent.validMoves;
        const move = computerPlayer.getAttack(movesAvail);
        const [x, y] = move;
        opponent.receiveAttack(x, y);
        attacks.push(transform(x, y));
      }
    }
  }

  populate();

  expect(attacks).toHaveLength(100);
});
