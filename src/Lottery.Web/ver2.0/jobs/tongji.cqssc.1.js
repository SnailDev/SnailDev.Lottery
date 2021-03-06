var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

var count = parseInt(process.argv[2]);
var qishu = parseInt(process.argv[3]);

MongoClient.connect(mongourl, function (error, client) {
    var col = client.db(database).collection('CQSSC');
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
    var _conut0 = 0;
    var _conut1 = 0;
    var _conut2 = 0;

    // var _lianzhong = -1;
    // var _lianbuzhong = -1;

    for (k = 1; k < 4; k++) {
        for (i = length - 4; i >= 0; i--) {
            // if (!iszusan(result[i + 1], k) && !iszusan(result[i + 2], k) && !iszusan(result[i + 3], k))
            //     continue;

            var numArr = [result[i]['num' + k], result[i]['num' + (k + 1)], result[i]['num' + (k + 2)]];
            numArr.sort(function (a, b) { return a - b });

            if ((numArr[2] - numArr[1] == 1) && (numArr[1] - numArr[0] == 1)) {
                result[i]['xingtai_forecast' + k] = 'X';
            }

            if (result[i]['xingtai_forecast' + k]) {
                for (j = i - 1; j > i - (qishu + 1); j--) {
                    if (j < 0) {
                        _conut0++;
                        break;
                    }
                    if (iszusan(result[j], k)) {
                        _conut1++;
                        break;
                    }

                    if (j == i - qishu) _conut2++;
                }
            }
        }
    }

    var total = _conut0 + _conut1 + _conut2;
    console.log('达到条件总个数：' + total);
    console.log('待验证个数：' + _conut0 + ',命中个数：' + _conut1 + ',未命中个数：' + _conut2);
    console.log('待验证占比：' + (_conut0 / total).toFixed(2) + ',命中占比：' + (_conut1 / total).toFixed(2) + ',未命中占比：' + (_conut2 / total).toFixed(2));

    //return result;
}

function iszusan(obj, index) {
    return (obj['num' + index] == obj['num' + (index + 1)] || obj['num' + index] == obj['num' + (index + 2)] || obj['num' + (index + 1)] == obj['num' + (index + 2)]);
}