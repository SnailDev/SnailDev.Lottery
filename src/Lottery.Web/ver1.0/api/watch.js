var watch = require('../proxy').Watch;

exports.logwatch = function (req, res, next) {
    var category = req.body.category;
    var periods = req.body.periods;
    var numbers = req.body.numbers;
    var times = req.body.times;
    watch.newAndSave(category, periods, numbers, times, function (err, doc) {
        if (err) {
            res.json({ status: 500, msg: err });
            console.log(err);
        } else {
            res.json({ status: 200, msg: "" });
        }
    });
};