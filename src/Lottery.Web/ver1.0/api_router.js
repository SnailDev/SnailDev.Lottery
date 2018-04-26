var express = require('express');
var userController = require('./api/user');
var pk10Controller = require('./api/pk10');
var watchController = require('./api/watch');

var router = express.Router();

router.get('/pk101', pk10Controller.pk101);
router.post('/login', userController.login);
router.post('/logwatch', watchController.logwatch);
router.post('/buyset', pk10Controller.buyset);
router.post('/buysetupdate', pk10Controller.buysetupdate);
router.post('/openclose', pk10Controller.openclose);
router.get('/buysetshot', pk10Controller.buysetshot)
router.get('/buylog', pk10Controller.buylog);
router.get('/servertime',pk10Controller.servertime);
router.get('/getcurmoney',pk10Controller.getcurmoney);

module.exports = router;