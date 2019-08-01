const { prompt } = require('inquirer');

const Admin = require('./account/admin');
const Logger = require('./logger');
const app = require('./app');

const { admin } = require('./config');
// console.log('admin', admin);
const adminAccount = new Admin(admin.pin, admin.amount);

class Atm {
  constructor() {
    this.admin = adminAccount;
    this.customer = null;
    this.welcomeMessage =
      'ZECH CLI BANK INTERNATIONAL\nWelcome to ZECH CLI BANK INTERNATIONAL';
  }

  /**
   * Log Welcome Messgae
   */
  logWelcomeMessage = () => {
    Logger.log(this.welcomeMessage);
  };
  /**
   * Show Actions a customer could perform
   */
  logCustomerActions() {
    const choices = ['Withdraw Funds', 'Check Account Balance', 'Quit'];

    return prompt({
      name: 'action',
      type: 'list',
      message: 'Select type of Transaction you want to perform',
      choices
    }).then(answer => {
      return answer.action.toLowerCase();
    });
  }

  selectTypeOfCustomerAccount() {
    const choices = ['Savings', 'Current'];

    return prompt({
      type: 'list',
      name: 'type',
      message: 'Select type of Account',
      choices
    }).then(answer => {
      return answer.type;
    });
  }

  /**
   * Show Actions admin could perform
   */
  logAdminActions() {
    const choices = ['Deposit Funds', 'Check Account Balance', 'Quit'];

    return prompt({
      name: 'action',
      type: 'list',
      message: 'Select type of Transaction you want to perform',
      choices
    }).then(answer => {
      return answer.action.toLowerCase();
    });
  }

  // get type of account ie user or admin
  getAccountType = () => {
    const choices = ['User', 'Admin', 'Quit'];
    return prompt({
      name: 'account',
      type: 'list',
      message: 'Login',
      choices: choices
    });
  };

  // validate if account password is correct
  validateAccount(user, account) {
    return user.password.length === 4 && Number(user.password) === account.pin;
  }

  //authenticate the user
  authenticateUser() {
    return prompt({
      type: 'password',
      name: 'password',
      mask: true,
      message: 'Enter Four digit password'
    }).then(user => {
      const isValidUser = this.validateAccount(user, this.customer);
      if (!isValidUser) {
        Logger.log('Password is wrong. Please Try again');
        return this.authenticateUser();
      }
      return isValidUser;
    });
  }

  // authenticate the admin
  authenticateAdmin() {
    return prompt({
      type: 'password',
      name: 'password',
      mask: true,
      message: 'Enter Four digit password'
    }).then(user => {
      const isAdmin = this.validateAccount(user, this.admin);
      if (!isAdmin) {
        Logger.log('Password is wrong. Please Try again');
        return this.authenticateAdmin();
      }
      return isAdmin;
    });
  }

  /**
   * check the balance of a user account
   * @param {String} account - type of account to check Balance from
   */
  checkBalance = (account = 'user') => {
    Logger.log(this.admin.checkAccountBalance());
    this.checkIfUserWantsToPerformAnotherAction(account);
  };

  /**
   * Withdraw
   * Calls the withdraw function of the admin with the amount user prompts from the console
   */
  withdraw = () => {
    const choices = [1000, 5000, 10000, 20000, 50000, 'other'].map(amount =>
      amount.toLocaleString()
    );
    return prompt({
      type: 'list',
      name: 'amount',
      message: 'Select Amount You want to withdraw',
      choices
    }).then(answer => {
      if (answer.amount === 'other') {
        return prompt({
          type: 'input',
          name: 'amount',
          message: 'Enter Amount You want to withdraw'
        }).then(answer => {
          const amount = Number(answer.amount.replace(/\D/, ''));
          this.admin.withdrawFund(amount);
          Logger.log(`Current Balance : ${this.admin.getAmount()}`);
          this.checkIfUserWantsToPerformAnotherAction();
        });
      }
      const amount = Number(answer.amount.replace(/\D/, ''));
      this.admin.withdrawFund(parseInt(amount));
      Logger.log(`Current Balance : ${this.admin.getAmount()}`);
      this.checkIfUserWantsToPerformAnotherAction();
    });
  };

  // deposit an amount based on the user input on console
  deposit = () => {
    return prompt({
      type: 'input',
      name: 'amount',
      message: 'Enter Amount You want to deposit'
    }).then(answer => {
      this.admin.depositFund(Number(answer.amount));
      Logger.log(
        `You deposited the amount ${
          answer.amount
        } and current balance is ${this.admin.getAmount()}`
      );
      this.checkIfUserWantsToPerformAnotherAction('admin');
    });
  };

  checkIfUserWantsToPerformAnotherAction = (type = 'user') => {
    return prompt({
      type: 'confirm',
      name: 'bool',
      message: 'Do you want to perform another Transaction'
    }).then(answer => {
      if (answer.bool) {
        return type === 'user'
          ? app.handleCustomerActions()
          : app.handleAdminActions();
      }
      Logger.log('Thanks for using our ATM service');
    });
  };

  //quit
  quit() {
    process.exit(1);
  }
}

module.exports = new Atm(adminAccount);
