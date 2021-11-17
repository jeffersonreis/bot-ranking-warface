const Sequelize = require('sequelize');
let config = require("./config.json") 
// require("dotenv").config()
const sequelize = new Sequelize(config.BD_URL, {dialect: 'postgres'});

module.exports = sequelize;