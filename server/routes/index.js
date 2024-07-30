import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send({ni: 'Hello World!'});
})

export { router };