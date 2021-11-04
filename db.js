const Sequelize = require('sequelize');
const config = require("./config.json");
const sequelize = new Sequelize(config.BD_URL, {dialect: 'postgres'});

module.exports = sequelize;