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
    full_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    contract_number: {
      type: Sequelize.STRING,
    },
    // category: {
    //   type: Sequelize.STRING,
    // },
    message: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.TINYINT,
    },
  },
  {
    timestamps: false,
  }
);
