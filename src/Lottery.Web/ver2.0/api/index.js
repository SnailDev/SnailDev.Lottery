var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

exports.servertime = function (req, res, next) {
    res.json({ diff: (+new Date() - req.query.localtime) / 1000 });
};

exports.getdata = function (req, res, next) {
    var sdate = req.query.date;
    var type = req.query.type;
    var date = new Date(sdate);
    date.setDate(date.getDate() - 1);
    var edate = date.Format("yyyy-MM-dd");

    if (type == 'bjpk10') {
        getpk10data(sdate, edate, function (resultData) { res.json(resultData); });
    } else if (type == 'cqssc') {
        getcqsscdata(sdate, edate, function (resultData) { res.json(resultData); });
    }
};

function getpk10data(sdate, edate, callback) {
    MongoClient.connect(mongourl, function (error, client) {
        var col = client.db(database).collection('Pk10');
        col.find({}).sort({ '_id': -1 }).limit(300).toArray(function (err, result) {
            if (!err) {
                callback(result);
            }
            else {
                callback({});
            }

            client.close();
        });
    });
}

function getcqsscdata(sdate, edate, callback) {
    MongoClient.connect(mongourl, function (error, client) {
        var col = client.db(database).collection('CQSSC');
        col.find({}).sort({ '_id': -1 }).limit(600).toArray(function (err, result) {
            if (!err) {
                callback(analysisdata(result));
            }
            else {
                callback({});
            }

            client.close();
        });
    });
}

function analysisdata(result) {
    var length = result.length;
    for (k = 1; k < 4; k++) {
        for (i = length - 3; i >= 0; i--) {
            if (result[i]['num' + (k + 1)] == result[i + 1]['num' + (k + 1)] && result[i + 1]['num' + (k + 1)] == result[i + 2]['num' + (k + 1)]) {
                result[i]['xingtai_forecast' + k] = 'A';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        result[i]['xingtai_forecast' + k] += '(0)';
                        break;
                    }
                    if (result[j]['num' + k] == result[j]['num' + (k + 1)] || result[j]['num' + k] == result[j]['num' + (k + 2)] || result[j]['num' + (k + 1)] == result[j]['num' + (k + 2)]) {
                        result[i]['xingtai_forecast' + k] += '(1)';
                        break;
                    }

                    if (j == i - 3) result[i]['xingtai_forecast' + k] += '(-1)';
                }
            }
            else if (result[i]['num' + k] == result[i + 1]['num' + k] && result[i + 1]['num' + k] == result[i + 2]['num' + k]) {
                // result[i]['xingtai_forecast'+k] = '组六杀' + result[i]['num'+k] + '' + (result[i]['num'+k] - 1);
                result[i]['xingtai_forecast' + k] = 'B';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        result[i]['xingtai_forecast' + k] += '(0)';
                        break;
                    }
                    if (result[j]['num' + k] == result[j]['num' + (k + 1)] || result[j]['num' + k] == result[j]['num' + (k + 2)] || result[j]['num' + (k + 1)] == result[j]['num' + (k + 2)]) {
                        result[i]['xingtai_forecast' + k] += '(1)';
                        break;
                    }

                    if (j == i - 3) result[i]['xingtai_forecast' + k] += '(-1)';
                }
            }
            else if (result[i]['num' + (k + 2)] == result[i + 1]['num' + (k + 2)] && result[i + 1]['num' + (k + 2)] == result[i + 2]['num' + (k + 2)]) {
                // result[i]['xingtai_forecast'+k] = '组六杀' + result[i]['num'+(k+2)] + '' + (result[i]['num'+(k+2)] - 1);
                result[i]['xingtai_forecast' + k] = 'C';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        result[i]['xingtai_forecast' + k] += '(0)';
                        break;
                    }
                    if (result[j]['num' + k] == result[j]['num' + (k + 1)] || result[j]['num' + k] == result[j]['num' + (k + 2)] || result[j]['num' + (k + 1)] == result[j]['num' + (k + 2)]) {
                        result[i]['xingtai_forecast' + k] += '(1)';
                        break;
                    }

                    if (j == i - 3) result[i]['xingtai_forecast' + k] += '(-1)';
                }
            }
        }
    }

    return result;
}

exports.forecast = function (req, res, next) {
    if (type == 'bjpk10') {
        pk10forcast(function (resultData) { res.json(resultData); });
    } else if (type == 'cqssc') {
        cqsscforcast(function (resultData) { res.json(resultData); });
    }
};

function pk10forcast(callback) {
    callback({});
}

function cqsscforcast(callback) {
    callback({});
    // MongoClient.connect(mongourl, function (error, client) {
    //     var col = client.db(database).collection('CQSSC');
    //     col.find({}).sort({ '_id': -1 }).limit(80).toArray(function (err, result) {
    //         if (!err) {
    //             // callback(result);
    //             // forcastlogic              
    //             for (let index = 0; index < result.length; index++) {
    //                 const element = array[index];

    //             }
    //         }
    //         else {
    //             callback({});
    //         }

    //         client.close();
    //     });
    // });
}