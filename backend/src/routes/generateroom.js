var express = require('express');
var routes = express.Router();
var { authJWT } = require('../middlewares/jwt/jwt');
var generateRoomController = require('../controllers/generateRoomController');
routes.post('/create', authJWT, generateRoomController.generate);
module.exports = routes;
