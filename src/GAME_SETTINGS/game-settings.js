const BOARD_AREA = 100;
const BOARD_X_SIZE = 10;
const BOARD_Y_SIZE = 10;

function isValidGameBoardCoordinate(x, y) {
  return x >= 0 && x < BOARD_X_SIZE && y >= 0 && y < BOARD_Y_SIZE;
}

const BOARD_SPECS = {
  BOARD_AREA,
  BOARD_X_SIZE,
  BOARD_Y_SIZE,
};

export default {
  BOARD_SPECS,
  isValidGameBoardCoordinate,
};
