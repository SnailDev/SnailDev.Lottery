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
