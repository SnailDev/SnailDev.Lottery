var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

var count = parseInt(process.argv[2]);
var numbet = parseInt(process.argv[3]);

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
    var dataArrs = [[], [], [], [], [], [], [], [], [], []];
    var _conut1 = 0;
    var _conut2 = 0;
    var _count2x = 0;
    var _count2xArr = [];

    // 出现位置统计
    for (var j = 0; j < dataArrs.length; j++) {
        for (var i = result.length - 1; i > -1; i--) {
            dataArrs[j].push(_.values(result[i]).indexOf(j + 1));
        }
    }

    for (var i = 0; i < dataArrs[numbet - 1].length - 1; i++) {
        var start = 0;
        var end = 0;
        if (dataArrs[numbet - 1][i + 1] - dataArrs[numbet - 1][i] < -7) {
            start = 1;
            end = 5;
        }
        else if (dataArrs[numbet - 1][i + 1] - dataArrs[numbet - 1][i] > 5) {
            start = 6;
            end = 10;
        }
        else {
            continue;
        }

        if (i + 3 > dataArrs[numbet - 1].length) break;
        if (dataArrs[numbet - 1][i + 2] > start - 1 && dataArrs[numbet - 1][i + 2] < end + 1) {
            _conut1++;
            _count2xArr.push(_count2x);
            _count2x = 0;
        }
        else {
            _conut2++;
            _count2x++;
        }
    }


    var total = _conut1 + _conut2;
    console.log('达到条件总个数：' + total);
    console.log('命中个数：' + _conut1 + ',未命中个数：' + _conut2);
    console.log('命中占比：' + (_conut1 / total).toFixed(2) + ',未命中占比：' + (_conut2 / total).toFixed(2));

    _count2xArr.sort();
    //console.log(_count2xArr);
    console.log('最大连续不中个数：' + _count2xArr[_count2xArr.length - 1]);
}