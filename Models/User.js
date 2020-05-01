const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    is_admin: {
      type: Sequelize.TINYINT,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    last_login: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  }
);
