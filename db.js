const Sequelize = require('sequelize');
// const config = require("./config.json");
const sequelize = new Sequelize("postgres://bhvkswaz:hUW_w78z-HuJ3IYkLxnyA98AVOGxSBIj@motty.db.elephantsql.com/bhvkswaz", {dialect: 'postgres'});

module.exports = sequelize;