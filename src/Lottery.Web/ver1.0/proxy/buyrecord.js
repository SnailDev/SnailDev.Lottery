var models = require('../models');
var BuyRecord = models.BuyRecord;

exports.getRecordByQuery = function (query, callback) {
    BuyRecord.find(query, callback).sort({ 'period': -1 });
};

exports.newAndSave = function (record, callback) {
    var buyrecord = new BuyRecord();
    buyrecord.uid = record.uid;
    buyrecord.period = record.period;
    buyrecord.channel = record.channel;
    buyrecord.sum = record.sum;
    buyrecord.location = record.location;
    buyrecord.rmoney = record.rmoney;
    buyrecord.pdata = record.pushdata;
    buyrecord.desc = record.desc;
    buyrecord.time = record.time;

    buyrecord.save(callback);
}