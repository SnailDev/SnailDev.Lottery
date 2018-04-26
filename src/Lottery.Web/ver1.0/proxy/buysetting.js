var models = require('../models');
var BuySetting = models.BuySetting;

exports.getSettingByQuery = function (query, callback) {
    BuySetting.find(query, callback);
};

exports.updateEntity = function (setting, callback) {
    BuySetting.findByIdAndUpdate(setting._id, {
        date: setting.date,
        uid: setting.uid,
        url: setting.url,
        cookies: setting.cookies,
        cookies_cache: setting.cookies_cache,
        money: setting.money,
        maxmoney: setting.maxmoney,
        minmoney: setting.minmoney,
        stime: setting.stime,
        etime: setting.etime,
        unit: setting.unit,
        channel: setting.channel,
        status: setting.status
    }, callback);
}

exports.newAndSave = function (setting, callback) {
    var buysetting = new BuySetting();

    buysetting.date = setting.date;
    buysetting.uid = setting.uid;
    buysetting.url = setting.url;
    buysetting.cookies = setting.cookies;
    buysetting.cookies_cache = "";
    buysetting.money = setting.money;
    buysetting.maxmoney = setting.maxmoney;
    buysetting.minmoney = setting.minmoney;
    buysetting.stime = setting.starttime;
    buysetting.etime = setting.endtime;
    buysetting.unit = setting.unit;
    buysetting.channel = setting.channel;
    buysetting.status = setting.status;

    buysetting.save(callback);
}

exports.newOrUpdate = function (setting, callback) {
    var conditions = { uid: setting.uid, date: setting.date };
    var update = {
        $set: {
            date: setting.date,
            uid: setting.uid,
            url: setting.url,
            cookies: setting.cookies,
            cookies_cache: "",
            money: setting.money,
            maxmoney: setting.maxmoney,
            minmoney: setting.minmoney,
            stime: setting.starttime,
            etime: setting.endtime,
            unit: setting.unit,
            channel: setting.channel,
            status: setting.status
        }
    };
    var options = { upsert: true };
    BuySetting.update(conditions, update, options, callback);
}

exports.updateCookiesAndMoney = function (_id, cookies, money, callback) {
    BuySetting.findByIdAndUpdate(_id, {
        money: money,
        cookies_cache: cookies
    }, callback);
}

exports.updateMoney = function (_id, money, callback) {
    BuySetting.findByIdAndUpdate(_id, {
        money: money
    }, callback);
}

exports.updateStatus = function (_id, status, callback) {
    BuySetting.findByIdAndUpdate(_id, {
        status: status
    }, callback);
}