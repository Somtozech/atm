const { prompt } = require('inquirer');
const atm = require('./atm');
const Customer = require('./account/customer');

const application = {};

const { customer } = require('./config');

//list of all actions performed by either admin or user
const actions = {
  'withdraw funds': atm.withdraw,
  'check account balance': atm.checkBalance,
  'deposit funds': atm.deposit,
  quit: atm.quit
};

//handle All Customer Transactions
const handleCustomerActions = (exports.handleCustomerActions = async function handleCustomerActions() {
  atm.customer = new Customer(customer.pin);

  const validUser = await atm.authenticateUser();
  if (validUser) {
    await atm.selectTypeOfCustomerAccount();
    const customerAction = await atm.logCustomerActions();
    actions[customerAction]();
  }
});

//handle All Admin Transactions
const handleAdminActions = (exports.handleAdminActions = async function handleAdminActions() {
  const isAdmin = await atm.authenticateAdmin();
  if (isAdmin) {
    const action = await atm.logAdminActions();
    actions[action]('admin');
  }
});

//start Atm Application
function start() {
  //log welcome message
  atm.logWelcomeMessage();

  atm.getAccountType().then(user => {
    const accountUser = user.account.toLowerCase();
    if (accountUser === 'user') {
      handleCustomerActions();
    } else if (accountUser === 'admin') {
      handleAdminActions();
    } else {
      atm.quit();
    }
  });
}

application.start = start;

module.exports = application;
