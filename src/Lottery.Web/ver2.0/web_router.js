var express = require('express');
var index = require('./controllers/index');

var router = express.Router();

/* GET home page. */
router.get('/', index.home);
router.get('/bjpk10', index.bjpk10);
router.get('/cqssc', index.cqssc);

module.exports = router;
