const Ship = require('./ship');

class Destroyer extends Ship {
  constructor() {
    super(3);
  }
}

module.exports = Destroyer;
