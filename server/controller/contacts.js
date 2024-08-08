/**
 * contacts controller.
 * @module controllers/contacts
 */


const {Contact, EditHistory} = require('../../db/models/index.js')
// temp sample data
const data = [{id: 1, firstName: 'John', lastName: 'Doe', phone: 6462990000, email: 'john@zmail.com'}, {id: 2, firstName: 'Jane', lastName: 'Doe', phone: 6462990001, email: 'jane@zmail.com'}]

const create = async (req, res, next) => {
  Contact.create(req.body)
    .then(function (created) {
      return new Promise( resolve => setTimeout(()=>{
        resolve(res.json({
          message: 'Created successfully',
          contact: created
        }));
      }, 10000))
    })
    .catch( err =>{
      return new Error(err.message, {errors: err.errors});
    });

}

/*!
* @api {GET} /contact/:id Get Contact Info
* @apiVersion 0.0.1
* @apiName getContact
*
*/
const getContact = async (req, res, next) => {
  Contact.findOne({where: {id: req.params.id}})
    .then(function (contact) {
      res.json(contact);
    })
    .catch(next);
}

/*!
* @api {GET} /contacts Get List of Contacts
* @apiVersion 0.0.1
* @apiName getList
*
*/
const getList = async (req, res, next) => {
  Contact.findAll({order: [['first_name', 'ASC']]})
    .then(function (contacts) {
      res.json(contacts);
    })
    .catch(next);
}

/*!
* @api {GET} /contacts Get List of Edit History
* @apiVersion 0.0.1
* @apiName getHistory
*
*/
const getHistory = async (req, res, next) => {
  EditHistory.findAll({where: {contact_id: req.params.id}, order: [['createdAt', 'DESC']]})
    .then(function (contacts) {
      res.json(contacts);
    })
    .catch(next);
}

/*!
* @api {put} /contacts Edits given contact and adds to edit history
* @apiVersion 0.0.1
* @apiName updateContact
*
*/
const updateContact = async (req, res, next) => {
  Contact.update(req.body, {
    where: {id: req.params.id},
    returning: true,
    individualHooks: true,
  })
    .then(results => {
      const updatedContact = results[1][0];
      res.json({
        message: 'Updated contact with id ' + updatedContact.id,
        contact: updatedContact
      })
    })
    .catch(console.error);
}

/*!
* @api {delete} /contacts Delete a given contact
* @apiVersion 0.0.1
* @apiName deleteContact
*
*/
const deleteContact = async (req, res, next) => {
  Contact.destroy({where: {id: req.params.id}})
    .then(results=>{
      res.json(results)
    })
    .catch(next);
}

module.exports = {
  create,
  getContact,
  getList,
  getHistory,
  updateContact,
  deleteContact,
}
