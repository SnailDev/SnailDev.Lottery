var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;

var url = 'http://www.gaopinpk10.com/shishicai/kj?date='; //2018-04-09
var useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';
var mongourl = 'mongodb://localhost:27017';
var dbName = 'Lottery';

getpk10data(new Date());

function getpk10data(date) {
    var options = {
        url: url + formatdate(date),
        headers: {
            'User-Agent': useragent,
        }
    }

    console.log(formatdate(date));

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            $ = cheerio.load(body);

            var dataArr = [];
            $('#history tr').each(function (i, item) {
                _this = $(item);
                if (_this.hasClass('head')) return true;

                var data = {};
                data._id = Number(_this.find('.p').text().replace('-', '')).toFixed(0);
                data.date = formatdate(date);
                data.time = _this.find('.t').text();

                _this.find('.nums span').each(function (index, numberItem) {
                    data["num" + (index + 1)] = Number($(numberItem).text());
                });
                dataArr.push(data);
            });

            // Connect using MongoClient
            MongoClient.connect(mongourl, function (err, client) {
                // Create a collection we want to drop later
                const col = client.db(dbName).collection('CQSSC');

                col.insertMany(dataArr, function (err, result) {
                    if (err) {
                        console.log(err);
                    }

                    date.setDate(date.getDate() - 1);//设置天数 -1 天  
                    getpk10data(date)
                });

                client.close();
            });
        }
        else {
            getpk10data(date);
            console.log(error);
        }
    });
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
function formatdate(date, fmt = 'yyyy-MM-dd') { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}