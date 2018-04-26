var models = require('../models');
var User = models.User;

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, callback) {
  User.findOne(query, callback);
};


exports.newAndSave = function (username, password, mobile, callback) {
  var user = new User();
  user.username = username;
  user.password = password;
  user.mobile = mobile;

  user.save(callback);
}