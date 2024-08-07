'use strict';
const db = require('../database');
const Contact = require('./Contact');
const EditHistory  = require('./EditHistory');


Contact.EditHistory = Contact.hasMany(EditHistory, {
  foreignKey: 'contact_id',
})
EditHistory.Contact = EditHistory.belongsTo(Contact, {foreignKey: 'id'})

module.exports = {
  Contact,
  EditHistory,
}