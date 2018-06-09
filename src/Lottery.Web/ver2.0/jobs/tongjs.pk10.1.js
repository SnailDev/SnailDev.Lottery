var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var mongourl = 'mongodb://localhost:29018';
var database = 'Lottery';

var count = parseInt(process.argv[2]);

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
    var step = 0;
    var failcount = 0;
    for (let index = length - 1; index > 0; index--) {
        if (step == 0) {
            if (result[index - 1]['num1'] == result[index]['num10'])
                step++;
            else
                step = 0;
        }
        else if (step == 1) {
            if (result[index - 1]['num5'] == result[index]['num10'])
                step++;
            else
                step = 0;
        }
        else if (step == 2) {
            if (result[index - 1]['num10'] == result[index]['num10'])
                step++;
            else
                step = 0;
        }

        if (step > 2) {
            step = 0;
            failcount++;
        }
    }

    console.log(failcount);
}