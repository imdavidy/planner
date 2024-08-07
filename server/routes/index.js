const {Router} = require('express');
const controller = require('../controller/index.js');

const router = Router();

router.get('/contacts', controller.contacts.getList)
router.post('/contact', controller.contacts.create)
router.put('/contacts/:id', controller.contacts.updateContact)
router.delete('/contacts/:id', controller.contacts.deleteContact)
router.get('/contacts/:id/history', controller.contacts.getHistory)

module.exports = router;