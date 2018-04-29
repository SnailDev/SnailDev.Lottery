var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

var count = parseInt(process.argv.splice(2));

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

    for (k = 1; k < 4; k++) {
        for (i = length - 4; i >= 0; i--) {
            if (result[i]['num' + (k + 1)] == result[i + 1]['num' + (k + 1)] && result[i + 1]['num' + (k + 1)] == result[i + 2]['num' + (k + 1)]) {
                if (!iszusan(result[i + 1], k) && !iszusan(result[i + 2], k) && !iszusan(result[i + 3], k))
                    continue;

                //result[i]['xingtai_forecast' + k] = 'A';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        // result[i]['xingtai_forecast' + k] += '(0)';
                        _conut0++;
                        break;
                    }
                    if (iszusan(result[j], k)) {
                        // result[i]['xingtai_forecast' + k] += '(1)';
                        _conut1++;
                        break;
                    }

                    if (j == i - 3) _conut2++; //result[i]['xingtai_forecast' + k] += '(-1)';
                }
            }
            else if (result[i]['num' + k] == result[i + 1]['num' + k] && result[i + 1]['num' + k] == result[i + 2]['num' + k]) {
                // result[i]['xingtai_forecast'+k] = '组六杀' + result[i]['num'+k] + '' + (result[i]['num'+k] - 1);
                // result[i]['xingtai_forecast' + k] = 'B';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        // result[i]['xingtai_forecast' + k] += '(0)';
                        _conut0++;
                        break;
                    }
                    if (iszusan(result[j], k)) {
                        // result[i]['xingtai_forecast' + k] += '(1)';
                        _conut1++;
                        break;
                    }

                    if (j == i - 3) _conut2++; //result[i]['xingtai_forecast' + k] += '(-1)';
                }
            }
            else if (result[i]['num' + (k + 2)] == result[i + 1]['num' + (k + 2)] && result[i + 1]['num' + (k + 2)] == result[i + 2]['num' + (k + 2)]) {
                // result[i]['xingtai_forecast'+k] = '组六杀' + result[i]['num'+(k+2)] + '' + (result[i]['num'+(k+2)] - 1);
                // result[i]['xingtai_forecast' + k] = 'C';
                for (j = i - 1; j > i - 4; j--) {
                    if (j < 0) {
                        // result[i]['xingtai_forecast' + k] += '(0)';
                        _conut0++;
                        break;
                    }
                    if (iszusan(result[j], k)) {
                        // result[i]['xingtai_forecast' + k] += '(1)';
                        _conut1++;
                        break;
                    }

                    if (j == i - 3) _conut2++; //result[i]['xingtai_forecast' + k] += '(-1)';
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