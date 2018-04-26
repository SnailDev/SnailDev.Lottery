var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var utility = require('utility');

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    mobile: { type: String }
});

UserSchema.plugin(BaseModel);

UserSchema.index({username: 1}, {unique: true});
UserSchema.index({mobile: 1}, {unique: true});

UserSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;

    next();
});

mongoose.model('User', UserSchema);