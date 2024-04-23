require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');
const entityFactory = require('./model');

const expressApp = express(); 

expressApp.use(express.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(cors({ origin : config.corsSettings.origin }));

expressApp.use('/', require('./routes'));

const server = http.createServer(expressApp);

expressApp.use(function (error, _req, res, _next){
    console.error(error);
    res.status(500).send(error);
});

const startServer = async () => {
  // Database initialization
  await entityFactory.init();
  // Server initialization
  await server.listen(config.server.port || 3000);
  console.log(`Server started on port ${config.server.port || 3000}`);
};

startServer();
