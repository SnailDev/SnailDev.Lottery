var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
//var utility = require('utility');

var WatchSchema = new Schema({
    category: { type: String },
    periods: { type: String },
    numbers: { type: String },
    times: { type: Number }
}, {
        strict: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }

    });

WatchSchema.plugin(BaseModel);

//WatchSchema.index({periods: 1}, {unique: true})

WatchSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;

    next();
});

mongoose.model('Watch', WatchSchema);