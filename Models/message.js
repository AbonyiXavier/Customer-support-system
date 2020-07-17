const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "messages",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    messageType: {
      type: Sequelize.STRING,
    },
    messageContent: {
      type: Sequelize.STRING,
    },
    dateCreated: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  }
);
