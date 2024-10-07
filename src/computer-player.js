import Player from './player.js';
import getRndElement from './helper_module/rnd-array-element.js';

export default class ComputerPlayer extends Player {
  constructor() {
    super('jarvis');
  }

  getAttack(enemy) {
    if (!(enemy instanceof Player)) return [];

    const { validMoves } = enemy;

    if (super.allShipSunk()) return [];

    if (validMoves.length === 0) return [];

    const { element } = getRndElement(validMoves);

    const { address } = element;

    return address;
  }
}
