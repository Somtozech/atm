const User = require('./user');

class Customer extends User {
  constructor(pin, amount) {
    super(pin, amount);
  }

  changePin() {}
}

module.exports = Customer;
