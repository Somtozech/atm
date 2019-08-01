module.exports = {
  admin: {
    amount: process.env.AMOUNT || 100000,
    pin: parseInt(process.env.ADMIN_PIN) || 1234
  },
  customer: {
    pin: parseInt(process.env.CUSTOMER_PIN) || 1111
  }
};
