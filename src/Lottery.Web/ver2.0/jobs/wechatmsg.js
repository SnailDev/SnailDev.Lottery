var Q = require('q');
var request = require('request');

var APPID = '';
var APPSECRET = '';

var accesstoken = '';
var accesstoken_date;
var expiretime = 0;// 7200;


function userinfo(openid, cb) {
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + token + '&openid=' + openid + '&lang=zh_CN';

        getWebContent(url, 'GET', null, cb);
    });
}

function sendTemplateMessage(cb) {

    var today = new Date();
    var current = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var myopenid = 'oPJSX1QL9Z3H1qpYsZxxR0vwatAg';
    var msg = GetJSON(myopenid);
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
        getWebContent(url, 'POST', msg, cb);

    });
}


function get_all_private_template(cb) {
    var self = this;
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=' + token;
        getWebContent(url, 'GET', null).then(function (result) {
            var aaaa = result;
            console.log(result);
        });
    });
}


function api_add_template(cb) {
    var self = this;
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=' + token;
        var data = { "template_id_short": "TM00001" };
        getWebContent(url, 'POST', data, cb);
    });
}

function GetWNUserList(callback) {
    var self = this;

    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + token;
        getWebContent(url, 'GET', null).then(function (result) {
            callback(null, result);
        }).catch(function (error) {
            callback(error);
        });
    });
}

function setindustry(cb) {
    var self = this;
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=' + token;
        var data = { "industry_id1": "1", "industry_id2": "2" };
        getWebContent(url, 'POST', data, cb);
    });
}

function getindustry(cb) {
    var self = this;
    getAccessToken(function (token) {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token=' + token;
        var data = {};
        getWebContent(url, 'POST', data, cb);
    });
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
                "value": "已达到投注标准，请至网站下注",
                "color": "#000"
            },
            "totalWinMoney": {
                "value": "组三/组六",
                "color": "#173177"
            },
            "issueInfo": {
                "value": '重庆时时彩',
                "color": "#173177"
            },
            "fee": {
                "value": '0元',
                "color": "#173177"
            },
            "betTime": {
                "value": '待投注',
                "color": "#173177"
            },
            "remark": {
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

function done(err, result) {
    if (err) console.log(err);
}


// GetWNUserList(function (err, result) {
//     console.log(result.data.openid);
// });

// setindustry(function (err, result) {
//     console.log(result);
// })

// getindustry(function (err, result) {
//     console.log(result);
// })

// sendTemplateMessage(function (err, result) {
//     console.log(result);
// })

module.exports.sendTemplateMessage = sendTemplateMessage;