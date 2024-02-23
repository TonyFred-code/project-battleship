import HumanPlayer from '../src/human-player.js';
import Player from '../src/player.js';

test('can create computer player', () => {
  expect(HumanPlayer).toBeDefined();
});

test('computer player is extension of Player', () => {
  const humanPlayer = new HumanPlayer('Player');

  expect(humanPlayer).toBeInstanceOf(Player);
});
