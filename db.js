const Sequelize = require('sequelize');
require("dotenv").config()
const sequelize = new Sequelize(process.env.BD_URL, {dialect: 'postgres'});

module.exports = sequelize;