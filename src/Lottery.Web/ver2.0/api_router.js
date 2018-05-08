var express = require('express');
var indexController = require('./api/index');
// var watchController = require('./api/watch');

var router = express.Router();

router.get('/getdata', indexController.getdata);
router.get('/servertime', indexController.servertime);
router.get('/getpk10', indexController.getpk10);

module.exports = router;