var express = require('express');
var pk10 = require('./controllers/pk10');
var user = require('./controllers/user');

var router = express.Router();

/* GET home page. */
router.get('/pk10/', pk10.pk10);
router.get('/pk10/pk101', pk10.pk101);
router.get('/pk10/pk102', pk10.pk102);
router.get('/pk10/pk103', pk10.pk103);
router.get('/pk10/pk104', pk10.pk104);
router.get('/pk10/pk104_1', pk10.pk104_1);
router.get('/pk10/pk104_2', pk10.pk104_2);
router.get('/pk10/pk105', pk10.pk105);
router.get('/pk10/pk106', pk10.pk106);
router.get('/pk10/pk107', pk10.pk107);
router.get('/pk10/pk108', pk10.pk108);
router.get('/pk10/pk108_1', pk10.pk108_1);

router.get('/pk10/buy', pk10.buy);
router.get('/pk10/buyset', pk10.buyset);
router.get('/pk10/buysetshot', pk10.buysetshot);
router.get('/pk10/buylog', pk10.buylog);

router.get('/login', user.login);

module.exports = router;
