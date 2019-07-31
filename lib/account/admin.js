const User = require('./user');

class Admin extends User {
  constructor(pin, amount) {
    super(pin, amount);
  }

  getAmount() {
    return this.amount.toLocaleString();
  }

  parseAmount(amount) {
    return Number(amount);
  }

  depositFund(amount) {
    if (typeof amount !== 'number')
      throw new Error(`'Amount' must be a number`);
    this.amount = this.amount + this.parseAmount(amount);
  }

  withdrawFund(amount) {
    if (amount > this.amount - 1000) {
      console.error('Sorry! Insufficient Balance');
      return;
    }
    this.amount = this.amount - this.parseAmount(amount);
  }

  checkAccountBalance() {
    return `Your Account Balance is ${this.getAmount()}`;
  }
}

module.exports = Admin;
