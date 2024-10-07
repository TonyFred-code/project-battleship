import ComputerPlayer from './computer-player.js';
import Player from './player.js';

import gameSettings from './GAME_SETTINGS/game-settings.js';
import getRndElement from './helper_module/rnd-array-element.js';

export default class HardComputerPlayer extends ComputerPlayer {
  #attacksStore = [];

  static getPossibleNextMove(x, y) {
    const neighbors = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ];

    const possibleNextMove = [];

    neighbors.forEach((neighbor) => {
      const [nx, ny] = neighbor;
      if (gameSettings.isValidGameBoardCoordinate(nx, ny)) {
        possibleNextMove.push(neighbor);
      }
    });

    return possibleNextMove;
  }

  #storeMove(x, y, enemy) {
    const enemyCopy = enemy.copy;
    const move = [x, y];

    const hitStatus = enemyCopy.receiveAttack(x, y);

    const possibleNeighbors = HardComputerPlayer.getPossibleNextMove(x, y);
    const { validMoves } = enemyCopy;
    const formattedUpdatedValidMoves = validMoves.map((validMove) => {
      const [mx, my] = validMove;
      return `${mx}-${my}`;
    });

    const validNeighbors = possibleNeighbors.filter((neighbor) => {
      const [nx, ny] = neighbor;
      const formattedNeighbor = `${nx}-${ny}`;

      return formattedUpdatedValidMoves.includes(formattedNeighbor);
    });

    if (hitStatus === 1) {
      this.#attacksStore.push({
        move,
        neighbors: validNeighbors,
      });
    }
  }

  getAttack(enemy) {
    if (super.allShipSunk()) return [];

    if (!(enemy instanceof Player)) return [];

    const { validMoves } = enemy;

    if (validMoves.length === 0) return [];

    if (!(enemy instanceof Player)) return [];

    if (this.#attacksStore.length === 0) {
      const move = super.getAttack(enemy);

      const [x, y] = move;

      this.#storeMove(x, y, enemy);

      return move;
    }

    const lastMove = this.#attacksStore.pop();
    const { neighbors } = lastMove;

    if (neighbors.length === 0) {
      return this.getAttack(validMoves, enemy);
    }

    const nextMove = getRndElement(neighbors);

    const [x, y] = nextMove;
    this.#storeMove(x, y, enemy);

    return nextMove;
  }
}
