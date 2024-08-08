'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const router = require('./routes/index.js');

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router)

const port = 3000;
app.listen(3000, () => {
  console.log(`listening patiently on port ${port}`);
});

