const BOARD_SIZE = 10;

function isValidGameBoardCoordinate(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

export default {
  BOARD_SIZE,
  isValidGameBoardCoordinate,
};
