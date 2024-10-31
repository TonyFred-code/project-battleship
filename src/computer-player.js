import Player from './player.js';
import getRndElement from './helper_module/rnd-array-element.js';

export default class ComputerPlayer extends Player {
  constructor() {
    super('jarvis');
  }

  getAttack(enemy) {
    if (!(enemy instanceof Player)) {
      throw new Error('Invalid enemy: expected instance of Player');
    }

    if (this.allShipSunk()) {
      return null; // Returning null when all ships are sunk
    }

    const { validMoves } = enemy;

    if (validMoves.length === 0) {
      return null; // Returning null when there are no valid moves left
    }

    const { element } = getRndElement(validMoves);

    return element; // Return the chosen attack coordinates
  }
}
