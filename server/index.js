import express from 'express';
import bodyParser from 'body-parser'
import morgan from 'morgan';
import cors from 'cors';
const app = express();

import {router} from './routes/index.js';
app.use(bodyParser.json());
app.use(cors('*'));
app.use(morgan('dev'));
app.use('/api', router)

const port = 3000;
app.listen(3000, () => {
  console.log(`listening patiently on port ${port}`);
});