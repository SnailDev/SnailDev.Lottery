var url = 'http://data.917500.cn/cqssc_1000.txt';

var Q = require('q');
var request = require('request');
var schedule = require("node-schedule");
var MongoClient = require('mongodb').MongoClient;

var mongourl = 'mongodb://localhost:29018';
var dbName = 'Lottery';

var rule = new schedule.RecurrenceRule();
rule.hour = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
rule.minute = [3, 13, 23, 33, 43, 53];
rule.second = 40;
schedule.scheduleJob(rule, function () { dogetcqsscdata(); });


var rule1 = new schedule.RecurrenceRule();
rule1.hour = [1, 22, 23];
rule1.minute = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58];
rule1.second = 40;
schedule.scheduleJob(rule1, function () { dogetcqsscdata(); });

function dogetcqsscdata() {
    // Connect using MongoClient
    MongoClient.connect(mongourl, function (err, client) {
        // Create a collection we want to drop later
        const col = client.db(dbName).collection('CQSSC');

        col.find({}).sort({ "_id": -1 }).limit(1).toArray(function (err, result) {
            var lastperoid = result[0]._id;
            request(url, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    var dataArr = [];
                    var elements = body.split('\n');
                    for (j = 0; j < elements.length; j++) {
                        var infos = elements[j].split(' ');
                        var period = infos[0];
                        if (period <= lastperoid) continue;

                        console.log(period);
                        var data = {};
                        data._id = period;
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

                    // var analysisdataArr = [];
                    // for (j = elements.length - 1; j > elements.length - 6; j--) {
                    //     var infos = elements[j].split(' ');
                    //     var period = infos[0];

                    //     if (!period) continue;

                    //     var data = {};
                    //     data._id = period;
                    //     for (i = 1; i < infos.length; i++) {
                    //         data['num' + i] = Number(infos[i]);
                    //     }
                    //     analysisdataArr.push(data);
                    // };

                    // analysisdata(analysisdataArr);
                }
            })

        });
    });
}

function analysisdata(result) {
    var length = result.length;
    for (k = 1; k < 4; k++) {
        for (i = length - 4; i >= 0; i--) {
            if (!iszusan(result[i + 1], k) && !iszusan(result[i + 2], k) && !iszusan(result[i + 3], k))
                continue;

            if (result[i]['num' + (k + 1)] == result[i + 1]['num' + (k + 1)] && result[i + 1]['num' + (k + 1)] == result[i + 2]['num' + (k + 1)]) {
                result[i]['xingtai_forecast' + k] = 'A';
            }
            else if (result[i]['num' + k] == result[i + 1]['num' + k] && result[i + 1]['num' + k] == result[i + 2]['num' + k]) {
                result[i]['xingtai_forecast' + k] = 'C';
            }
            else if (result[i]['num' + (k + 2)] == result[i + 1]['num' + (k + 2)] && result[i + 1]['num' + (k + 2)] == result[i + 2]['num' + (k + 2)]) {
                result[i]['xingtai_forecast' + k] = 'B';
            }

            if (result[i]['xingtai_forecast' + k]) {
                sendTemplateMessage(function (err, result) {
                    console.log(result);
                });

                return;
            }
        }
    }
}

function iszusan(obj, index) {
    return (obj['num' + index] == obj['num' + (index + 1)] || obj['num' + index] == obj['num' + (index + 2)] || obj['num' + (index + 1)] == obj['num' + (index + 2)]);
}

var APPID = 'wx4f5bc3cd7c5325ec';
var APPSECRET = 'fb6000cc761d16e5e1107a546262816c';

var accesstoken = '';
var accesstoken_date;
var expiretime = 0;

function sendTemplateMessage(cb) {
    var today = new Date();
    var current = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var openids = ['oPJSX1QL9Z3H1qpYsZxxR0vwatAg', 'oPJSX1Rfsp4x5BxyCndKFw3pxPGo'];
    for (i = 0; i < openids.length; i++) {
        var msg = GetJSON(openids[i]);
        getAccessToken(function (token) {
            var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
            getWebContent(url, 'POST', msg, cb);

        });
    }
}

function getAccessToken(cb) {

    var uri = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET;

    var date = new Date();
    if (!accesstoken || (date - accesstoken_date) / 1000 >= expiretime + 1) {
        console.log('-----------no valid token');
        //无accesstoken或者超时  
        getWebContent(uri, 'POST', null).then(function (result) {
            accesstoken = result.access_token;
            accesstoken_date = new Date();
            expiretime = result.expires_in;
            cb(accesstoken);
        }).catch(function (err) {
            cb(null);
        })
    } else {
        cb(accesstoken)
    }

}

function GetJSON(openid) {
    return {
        "touser": openid, "template_id": "NFwdwJLD1Iuhp1qlS1WVonGNKELBDkxnUEYxLuZEMmc",
        "url": 'http://lottery.develophelper.com/cqssc',
        "data": {
            "result": {
                "value": "已达到投注标准，请准备下注",
                "color": "#000"
            },
            "totalWinMoney": {
                "value": "组三三期~组三五期",
                "color": "#173177"
            },
            "issueInfo": {
                "value": '重庆时时彩',
                "color": "#173177"
            },
            "fee": {
                "value": '72元~296元',
                "color": "#173177"
            },
            "betTime": {
                "value": '待投注',
                "color": "#173177"
            },
            "remark": {
                "value": '购彩有风险，投资需谨慎！',
                "color": "#173177"
            }
        }
    };
}

var getWebContent = function (uri, method, data, callback) {
    method = method || "POST";
    var defer = Q.defer();
    var requestdata = {
        "method": method,
        "uri": uri,
        "json": true
    };
    if (data) {
        requestdata['body'] = data;
        requestdata['qs'] = data;

    }
    request(requestdata,
        function (error, response, body) {
            if (error) {
                console.log(error);
                defer.reject(error);
            } else {
                //console.log(body);
                defer.resolve(body);
            }
        }
    );
    return defer.promise.nodeify(callback);
}