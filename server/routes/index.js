const {Router} = require('express');
const controller = require('../controller/index.js');

const router = Router();

router.get('/contacts', controller.contacts.getList)
router.post('/contact', controller.contacts.create)
/* non-event API for updating contact
router.put('/contacts/:id', controller.contacts.updateContact)
*/
router.put('/contacts/:id', controller.events.addUpdate)
router.get('/contacts/:id', controller.contacts.getContact)
router.delete('/contacts/:id', controller.contacts.deleteContact)
router.get('/contacts/:id/history', controller.contacts.getHistory)

router.get('/status', controller.events.getStatus);
router.put('/update', controller.events.addUpdate);
router.get('/events', controller.events.eventsHandler);

module.exports = router;