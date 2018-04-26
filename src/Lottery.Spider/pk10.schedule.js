var url = 'http://data.917500.cn/pk10_1000.txt';

var request = require('request');
var schedule = require("node-schedule");
var MongoClient = require('mongodb').MongoClient;

var mongourl = 'mongodb://localhost:27017';
var dbName = 'Lottery';

var rule = new schedule.RecurrenceRule();
rule.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
rule.minute = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58];
rule.second = 20;
schedule.scheduleJob(rule1, function () {
    // Connect using MongoClient
    MongoClient.connect(mongourl, function (err, client) {
        // Create a collection we want to drop later
        const col = client.db(dbName).collection('Pk10');

        col.find({}).sort({ "_id": -1 }).limit(1).toArray(function (err, result) {
            var lastperoid = result[0]._id;
            request(url, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    var dataArr = [];
                    var elements = body.split('\n');
                    for (j = 0; j < elements.length; j++) {
                        var infos = elements[j].split(' ');
                        var period = Number(infos[0]);
                        if (period <= lastperoid) continue;

                        var data = {};
                        data._id = period;
                        console.log(period);
                        for (i = 1; i < infos.length; i++) {
                            data['num' + i] = Number(infos[i]);
                        }
                        dataArr.push(data);
                    };

                    col.insertMany(dataArr, function (err, result) {
                        if (err) {
                            console.log(err);
                        }

                        client.close();
                    });
                }
            })

        });
    });
});