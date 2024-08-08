// models/EditHistory.js
const { DataTypes } = require('sequelize');
const db = require('../database.js');
// const Contact = require('./Contact.js');

const EditHistory = db.define('EditHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  changes: DataTypes.JSON,
  edit_method: DataTypes.STRING,
  previous_value: DataTypes.STRING,
  new_value: DataTypes.STRING,
});

module.exports = EditHistory;
