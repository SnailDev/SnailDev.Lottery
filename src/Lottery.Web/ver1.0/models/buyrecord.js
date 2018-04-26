var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var utility = require('utility');

var BuyRecordSchema = new Schema({
    uid: { type: String },
    period: { type: String },
    channel: { type: String },
    sum: { type: String },
    location: { type: String },
    rmoney: { type: String },
    pdata: { type: Object },
    desc: { type: String },
    time: { type: String }
});

BuyRecordSchema.plugin(BaseModel);

//BuyRecordSchema.index({ uid: 1, period: 1 }, { unique: true });

BuyRecordSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;

    next();
});

mongoose.model('BuyRecord', BuyRecordSchema);