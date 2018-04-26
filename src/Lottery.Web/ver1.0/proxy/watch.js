var models = require('../models');
var Watch = models.Watch;

// exports.getWatchByCategory = function (date, callback) {
//     if (date.length === 0) {
//         return callback(null, []);
//     }
//     Watch.find({ date: date }, callback).sort({ 'periods': -1 });
// };

// exports.getPk10LastOne = function (callback) {
//     Pk10.findOne({}, callback).sort({ 'periods': -1 });
// };

exports.newAndSave = function (category, periods, numbers, times, callback) {
    var watch = new Watch();
    watch.category = category;
    watch.periods = periods;
    watch.numbers = numbers;
    watch.times = times;

    watch.save(callback);
}

// exports.newAndSaveArr = function (dataArr, callback) {
//     var pk10Arr = [];
//     for (var i = 0; i < dataArr.length; i++) {
//         var pk10 = new Pk10();
//         pk10.date = dataArr[i].date;
//         pk10.periods = dataArr[i].periods;
//         pk10.numbers = dataArr[i].numbers;
//         pk10.time = dataArr[i].time;
//         pk10Arr.push(pk10);
//     }

//     Pk10.insertMany(pk10Arr, callback);
// }