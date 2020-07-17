const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "issues",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    categoryOfIssues: {
      type: Sequelize.STRING,
    },
    contractNumber: {
      type: Sequelize.STRING,
    },
    consumptionType: {
      type: Sequelize.STRING,
    },
    billingPeriod: {
      type: Sequelize.DATE,
    },
    billingYear: {
      type: Sequelize.DATE,
    },
    openingBalance: {
      type: Sequelize.STRING,
    },
    currentCharges: {
      type: Sequelize.STRING,
    },
    closingBalance: {
      type: Sequelize.STRING,
    },
    previousClosingBalance: {
      type: Sequelize.STRING,
    },
    trackingId: {
      type: Sequelize.STRING,
    },
    amountPaid: {
      type: Sequelize.STRING,
    },
    paymentDate: {
      type: Sequelize.STRING,
    },
    channelOfPayment: {
      type: Sequelize.STRING,
    },
    facilityName: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    maintenanceType: {
      type: Sequelize.STRING,
    },
    descriptionOfIssues: {
      type: Sequelize.STRING,
    },
    // imageOne: {
    //   type: Sequelize.STRING,
    // },
    // imageTwo: {
    //   type: Sequelize.STRING,
    profilePics: {
      type: Sequelize.STRING,
      // },
    },
    address: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    isCustomer: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);
