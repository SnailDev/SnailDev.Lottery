var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var utility = require('utility');

var BuySettingSchema = new Schema({
    date: { type: String },
    uid: { type: String },
    url: { type: String },
    cookies: { type: String },
    cookies_cache: { type: String },
    money: { type: String },
    maxmoney: { type: String },
    minmoney: { type: String },
    stime: { type: String },
    etime: { type: String },
    unit: { type: String },
    channel: { type: String },
    status: { type: String }
});

BuySettingSchema.plugin(BaseModel);

BuySettingSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;

    next();
});

mongoose.model('BuySetting', BuySettingSchema);