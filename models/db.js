const { Sequelize } = require('sequelize');

// Update these values with your MySQL credentials
const sequelize = new Sequelize('matuka', 'root', 'secret', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
