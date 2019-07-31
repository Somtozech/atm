class User {
  constructor(pin, amount) {
    this.pin = pin;
    this.amount = Number(amount || 0);
  }
}

module.exports = User;
