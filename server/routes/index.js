import {Router} from 'express';
import controller from '../controller/index.js'

const router = Router();

router.get('/contacts', controller.contacts.getList)
router.post('/contacts', controller.contacts.create)
router.put('/contacts/:id', controller.contacts.updateContact)

export { router };