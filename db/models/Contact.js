// models/Contact.js
const { DataTypes } = require('sequelize');
const db = require('../database.js');
const EditHistory = require('./EditHistory');

const Contact = db.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name:  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    hooks: {
      beforeUpdate: async (contact, options) => {
        await EditHistory.create({
          contact_id: contact.id,
          changes: JSON.stringify(contact._previousDataValues),
          updatedAt: new Date(),
        },
          {
            include: [
              {
                association: Contact.EditHistory,
              }
            ]
          });
      }
    }
  });


module.exports = Contact;
