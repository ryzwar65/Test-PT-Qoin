var express = require('express');
var routes = express.Router();
var auth = require('./auth');
var generate = require('./generateroom');

routes.use('/auth', auth);
routes.use('/generate', generate);
module.exports = routes;
