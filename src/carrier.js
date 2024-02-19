const Ship = require('./ship');

class Carrier extends Ship {
  constructor() {
    super(5);
  }
}

module.exports = Carrier;
