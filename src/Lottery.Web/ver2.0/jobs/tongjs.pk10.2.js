var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

var count = parseInt(process.argv[2]);
var zuhe = JSON.parse(process.argv[3]);

MongoClient.connect(mongourl, function (error, client) {
    var col = client.db(database).collection('Pk10');
    col.find({}).sort({ '_id': -1 }).limit(count).toArray(function (err, result) {
        if (!err) {
            analysisdata(result);
        }
        else {
            console.log(err);
        }

        client.close();
    });
});


function analysisdata(result) {
    var length = result.length;
  


    var total = _conut1 + _conut2;
    console.log('达到条件总个数：' + total);
    console.log('命中个数：' + _conut1 + ',未命中个数：' + _conut2);
    console.log('命中占比：' + (_conut1 / total).toFixed(2) + ',未命中占比：' + (_conut2 / total).toFixed(2));

    _count2xArr.sort();
    //console.log(_count2xArr);
    console.log('最大连续不中个数：' + _count2xArr[_count2xArr.length - 1]);
}