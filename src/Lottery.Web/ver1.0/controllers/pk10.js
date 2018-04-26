//var pk10 = require('../proxy').Pk10;
var tools = require('../util/tools');

exports.pk10 = function (req, res, next) {
    res.render('pk10', { title: '北京赛车pk10' });
};

exports.pk101 = function (req, res, next) {
    res.render('pk101', { title: 'pk10_1.0', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk102 = function (req, res, next) {
    res.render('pk102', { title: 'pk10_1.1', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk103 = function (req, res, next) {
    res.render('pk103', { title: 'pk10_1.2', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk104 = function (req, res, next) {
    res.render('pk104', { title: 'pk10_1.4', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk104_1 = function (req, res, next) {
    res.render('pk104_1', { title: 'pk10_1.4.1', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk104_2 = function (req, res, next) {
    res.render('pk104_2', { title: 'pk10_1.4.2', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk105 = function (req, res, next) {
    res.render('pk105', { title: 'pk10_1.5', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk106 = function (req, res, next) {
    res.render('pk106', { title: 'pk10_1.6', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk107 = function (req, res, next) {
    res.render('pk107', { title: 'pk10_1.7', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk108 = function (req, res, next) {
    res.render('pk108', { title: 'pk10_1.8', date: new Date().Format("yyyy-MM-dd") });
};

exports.pk108_1 = function (req, res, next) {
    res.render('pk108_1', { title: 'pk10_1.8.1', date: new Date().Format("yyyy-MM-dd") });
};


exports.buy = function (req, res, next) {
    res.render('buy', { title: 'Pk10自动下注' });
};

exports.buyset = function (req, res, next) {
    res.render('buyset', { title: '下注设置' });
};

exports.buysetshot = function (req, res, next) {
    res.render('buysetshot', { title: '当前设置', date: new Date().Format("yyyy-MM-dd") });
};

exports.buylog = function (req, res, next) {
    res.render('buylog', { title: '下注记录', date: new Date().Format("yyyy-MM-dd") });
};