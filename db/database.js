'use strict';

const config = require('./config.json');
const Sequelize = require('sequelize');

// const url = `postgres://${config.host}:${config.port}/${config.database}`

const sequelize = new Sequelize(config.database, config.username, config.password, config);
module.exports = sequelize;

sequelize.sync({alter: true});

