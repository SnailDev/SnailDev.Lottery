var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../util/logger');

mongoose.Promise = global.Promise;

const options = {
  promiseLibrary: global.Promise,
  useMongoClient: true,
};

// mongoose.connect(config.db, options, function (err) {
//     if (err) {
//         logger.error('connect to %s error: ', config.db, err.message);
//         process.exit(1);
//     }
// });

// models
require('./user');
require('./pk10');
require('./watch');

require('./buysetting');
require('./buyrecord');

exports.User = mongoose.model('User');
exports.Pk10 = mongoose.model('Pk10');
exports.Watch = mongoose.model('Watch');

exports.BuySetting = mongoose.model('BuySetting');
exports.BuyRecord = mongoose.model('BuyRecord');
