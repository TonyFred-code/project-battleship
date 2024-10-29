import ComputerPlayer from './computer-player.js';
import Player from './player.js';
import gameSettings from './GAME_SETTINGS/game-settings.js';
import getRndElement from './helper_module/rnd-array-element.js';
import GameBoard from './game-board.js';
import transform, {
  reverseTransform,
} from './helper_module/number-transform.js';

export default class HardComputerPlayer extends ComputerPlayer {
  #attacksStore = new Set(); // Use Set for efficient deduplication and filtering

  static getPossibleNextMove(x, y) {
    return [
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
      [x - 1, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
    ].filter(([nx, ny]) => GameBoard.isValidBoardCoordinate(nx, ny));
  }

  #storeMove(x, y, enemy) {
    const { boardCopy } = enemy;
    const hitStatus = boardCopy.receiveAttack(x, y);

    if (hitStatus !== 1) return;

    const { BOARD_X_SIZE } = gameSettings.BOARD_SPECS;
    const possibleNeighbors = HardComputerPlayer.getPossibleNextMove(x, y)
      .map(([cx, cy]) => transform(cx, cy, BOARD_X_SIZE))
      .filter((neighbor) =>
        boardCopy.unHitCoordinates.some(
          ([nx, ny]) => transform(nx, ny, BOARD_X_SIZE) === neighbor,
        ),
      );

    possibleNeighbors.forEach((move) => this.#attacksStore.add(move));
  }

  getAttack(enemy) {
    if (
      super.allShipSunk() ||
      !(enemy instanceof Player) ||
      enemy.validMoves.length === 0 ||
      enemy.allShipSunk()
    )
      return [];

    if (this.#attacksStore.size === 0) {
      const move = super.getAttack(enemy);
      if (move.length === 2) this.#storeMove(move[0], move[1], enemy);
      return move;
    }

    const { BOARD_X_SIZE } = gameSettings.BOARD_SPECS;
    const { element } = getRndElement([...this.#attacksStore]);
    this.#attacksStore.delete(element); // Remove move from store to prevent reuse

    const move = reverseTransform(element, BOARD_X_SIZE);
    this.#storeMove(move[0], move[1], enemy);
    return move;
  }
}
