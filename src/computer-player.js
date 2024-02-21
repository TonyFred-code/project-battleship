import Player from './player.js';

export default class ComputerPlayer extends Player {
  constructor() {
    super('jarvis');
  }

  getAttack(validMoves) {
    if (super.allShipSunk()) return [];

    if (validMoves.length === 0) return [];

    function getRnd(array) {
      const max = array.length;
      const min = 0;
      const pos = Math.floor(Math.random() * (max - min + 1) + min);

      return pos;
    }

    const attackNode = getRnd(validMoves);

    return validMoves[attackNode].address;
  }
}
