var request = require('request');
var cheerio = require('cheerio');

var cookies = 'say=icmfy47.94.168.82; yunsuo_session_verify=8e96329d8ea023589fe9fd81813b8bd9;ASP.NET_SessionId=x2mw4phjaahoodcjkclrwfcj';

var j = request.jar();
var url = 'http://mem2.mamefi718.dnwxj.com/';
var options = {
    url: url + 'user/Refresh_Credits.aspx',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
        'Cookie': cookies
    },
    gzip: true,
    jar: j,
    followRedirect: false,
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        var prefix = $('a').attr('href');
        if (prefix != undefined) {
            options.url = url + prefix;
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var resObj = JSON.parse(body);
                    if (resObj.status != 'OK') {
                        console.log("url或cookie错误. body:" + body);
                    }
                    else {
                        console.log("当前可用额度为" + resObj.Current_Credits_kc)
                    }
                }
                else {
                    console.log("url或cookie错误1.error:" + error);
                }
            });
        }
        else {
            var resObj = JSON.parse(body);
            if (resObj.status != 'OK') {
                console.log("url或cookie错误. body:" + body);
            }
            else {
                console.log("当前可用额度为" + resObj.Current_Credits_kc)
            }
        }
    }
    else {
        console.log("url或cookie错误2.error:" + error);
    }
});