const {Router} = require('express');
const controller = require('../controller/index.js');

const router = Router();

router.get('/contacts', controller.contacts.getList)
router.post('/contact', controller.contacts.create)
router.put('/contacts/:id', controller.contacts.updateContact)
router.delete('/contacts/:id', controller.contacts.deleteContact)
router.get('/contacts/:id/history', controller.contacts.getHistory)
// router.get('/status',  (req, res) => res.json({clients: clients.length}));
//
// router.put('/update', controller.events.addUpdate);
// router.get('/events', controller.events.eventsHandler);

module.exports = router;