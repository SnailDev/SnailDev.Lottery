var path = require('path');

var config = {
    env: 'local',
    db: 'mongodb://localhost:27017',
    log_dir: path.join(__dirname, 'logs'),
    debug: true
}

// if (config.env == 'local') {
//     config.db = 'mongodb://localhost:29018/lottery';
// }
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  config.db = 'mongodb://localhost:29018';
}

module.exports = config;