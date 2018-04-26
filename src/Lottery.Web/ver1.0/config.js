var path = require('path');

var config = {
    env: 'local',
    db: 'mongodb://47.94.168.82:29018/lottery',
    log_dir: path.join(__dirname, 'logs'),
    debug: true
}

// if (config.env == 'local') {
//     config.db = 'mongodb://47.94.168.82:29018/lottery';
// }
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  config.db = 'mongodb://172.17.104.123:29018/lottery';
}

module.exports = config;