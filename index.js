require('dotenv').config();

const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const bodyParser = require('body-parser');
const path = require('path');
const Raven = require('./app/services/sentry');

const dbConfig = require('./config/database');

console.log(dbConfig.url);

mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true },
);
requireDir(dbConfig.modelsPath);

app.use(bodyParser.json());

app.use(Raven.requestHandler());

app.use('/api', require('./app/routes'));

app.use(Raven.errorHandler());

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
