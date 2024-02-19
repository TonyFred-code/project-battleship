const Ship = require('./ship');

class PatrolBoat extends Ship {
  constructor() {
    super(2);
  }
}

module.exports = PatrolBoat;
