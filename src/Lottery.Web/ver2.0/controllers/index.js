var tools = require('../util/tools');

exports.home = function (req, res, next) {
    res.render('index', { title: '高频彩' });
};

exports.bjpk10 = function (req, res, next) {
    res.render('bjpk10', { title: '北京赛车pk10', date: new Date().Format("yyyy-MM-dd") });
};

exports.cqssc = function (req, res, next) {
    res.render('cqssc', { title: '重庆时时彩', date: new Date().Format("yyyy-MM-dd") });
};
