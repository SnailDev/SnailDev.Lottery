var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27017';
var dbName = 'Lottery';

var startId = 210491;
var endId = 677573;

MongoClient.connect(mongourl, function (err, client) {
    // Create a collection we want to drop later
    const col = client.db(dbName).collection('Pk10');

    //for (id = startId; id < endId; id++) {
    id = 210491;
    function haha(id) {
        col.findOne({ "_id": id }, function (err, result) {
            //console.log('检查' + id);
            if (err) {
                console.log(err);
            }
            if (!result) console.log(id + '不存在');
            if (id > endId) {
                client.close();
                console.log('END');
            }
            else {
                haha(id + 1);
            }
        });
    }
    haha(id);
    //}
});

// analysisdata(startId + 1);
// function analysisdata(id) {
//     MongoClient.connect(mongourl, function (err, client) {
//         // Create a collection we want to drop later
//         const col = client.db(dbName).collection('Pk10');
//         console.log('检查' + id);
//         col.findOne({ "_id": id }, function (err, result) {
//             if (err) {
//                 console.log(err);
//             }
//             if (!result) console.log(id + '不存在');
//         });

//         //client.close();
//         if (id < endId)
//             analysisdata(id + 1);
//         else
//             console.log('END');
//     });
// }