var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
//var utility = require('utility');

var Pk10Schema = new Schema({
    date: { type: String },
    periods: { type: String },
    time: { type: String },
    numbers: { type: Array }
}, {
        strict: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }

    });

Pk10Schema.plugin(BaseModel);

Pk10Schema.index({periods: 1}, {unique: true})

Pk10Schema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;

    next();
});

mongoose.model('Pk10', Pk10Schema);