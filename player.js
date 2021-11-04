const Sequelize = require('sequelize');
const database = require('./db');

const Player = database.define('player', {
  nickname: {
    type: Sequelize.STRING,
    autoIncrement: false,
    allowNull: false,
    primaryKey:true
  },

  earned_pc: Sequelize.INTEGER,

  new_pc: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  old_pc: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Player;