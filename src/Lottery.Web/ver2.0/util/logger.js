var config = require('../config');
var pathLib = require('path')

var log4js = require('log4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: pathLib.join(config.log_dir, 'cheese.log') } },
  categories: { default: { appenders: ['cheese'], level: config.debug && config.env !== 'local' ? 'DEBUG' : 'ERROR' } }
});

var logger = log4js.getLogger('cheese');

module.exports = logger;
