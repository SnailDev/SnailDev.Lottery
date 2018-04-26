var pk10 = require('../proxy').Pk10;
var buysetting = require('../proxy').BuySetting;
var buyrecord = require('../proxy').BuyRecord;
var tools = require('../util/tools');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require("node-schedule");
var parseString = require('xml2js').parseString;

// http://www.bwlc.net/bulletin/prevtrax.html?dates=2017-09-01&page=2  日期+翻页
// http://www.bwlc.net/bulletin/prevtrax.html?num=637556  期号
// data: $('.tb').html()  pager: $('.fc_fanye').html()
// 开奖时间慢 暂时废弃
// www.bwlc.net
function getpk10info_bak() {
    var rule1 = new schedule.RecurrenceRule();
    rule1.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    rule1.minute = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58];
    rule1.second = 20;
    schedule.scheduleJob(rule1, function () {

        pk10.getPk10LastOne(function (err, findresult) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            if (findresult != null) {
                var period = parseFloat(findresult.periods) + 1;
                console.log(period);

                var options = {
                    url: 'http://www.bwlc.net/bulletin/prevtrax.html?num=' + period,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
                    }
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        $ = cheerio.load(body);
                        //console.log($('.tb').html());
                        var $trs = $('.tb tbody tr');
                        //console.log($trs.length);
                        if ($trs.length > 1) {
                            //console.log($trs.eq(1).html());
                            var periods = $trs.eq(1).find('td').eq(0).text();
                            var numbers = $trs.eq(1).find('td').eq(1).text().split(',').map(function (data) { return +data; });;
                            var time = new Date($trs.eq(1).find('td').eq(2).text());
                            pk10.newAndSave(time.Format('yyyy-MM-dd'), periods, time.Format('MM-dd hh:mm'), numbers, function (err, saveresult) {
                                if (err) {
                                    console.log('save failed, error:' + err);
                                    return;
                                }
                                console.log('save successful');
                            });
                        }
                        else {
                            console.log('could not find this recoard');
                        }
                    } else {
                        console.log('http get error, error: ' + error);
                    }
                });
            }
            else {
                console.log('data is not found.')
            }
        });
    });
}

// www.gaopcpk10.com
function getpk10infoSche() {
    var rule1 = new schedule.RecurrenceRule();
    rule1.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    rule1.minute = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58];
    rule1.second = 50;
    schedule.scheduleJob(rule1, function () {
        //dogetpk10info()
        dogetpk10info_new1();
    });
}

function dogetpk10info() {
    pk10.getPk10LastOne(function (err, findresult) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        if (findresult != null) {
            //console.log(findresult._doc);
            var period = parseFloat(findresult.periods) + 1;
            console.log(period);

            var options = {
                url: 'https://www.gaopcpk10.com/Pk10/ajax?ajaxhandler=GetNewestRecord&t=' + Math.random(),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
                }
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var resobj = JSON.parse(body);
                    var periods = resobj.period;
                    if (period == periods) {
                        var numbers = resobj.numbers.split(',').map(function (data) { return +data; });;
                        var time = new Date(resobj.drawingTime);

                        pk10.newAndSave(new Date().Format('yyyy-MM-dd'), periods, time.Format('MM-dd hh:mm'), numbers, function (err, saveresult) {
                            if (err) {
                                console.log('save failed, error:' + err);
                                return;
                            }
                            console.log('save successful');
                        });
                    }
                    else {
                        console.log('could not find this recoard');
                    }
                } else {
                    console.log('http get error, error: ' + error);
                    dogetpk10info();
                    return;
                }
            });
        }
        else {
            console.log('data is not found.')
        }
    });
}

function dogetpk10info_new1() {
    pk10.getPk10LastOne(function (err, findresult) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        if (findresult != null) {
            //console.log(findresult._doc);
            var period = parseFloat(findresult.periods) + 1;
            console.log(period);

            var options = {
                url: 'https://www.908511.com/index.php?c=api2&a=getLastData&cp=bjpk10&_=' + Math.random(),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
                }
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body.trim());
                    var resobj = JSON.parse(body.trim());
                    var periods = resobj.c_t;
                    if (period == periods) {
                        var numbers = resobj.c_r.split(',').map(function (data) { return +data; });;
                        var time = new Date(resobj.c_d);

                        pk10.newAndSave(new Date().Format('yyyy-MM-dd'), periods, time.Format('MM-dd hh:mm'), numbers, function (err, saveresult) {
                            if (err) {
                                console.log('save failed, error:' + err);
                                return;
                            }
                            console.log('save successful');
                        });
                    }
                    else {
                        console.log('could not find this recoard');
                    }
                } else {
                    console.log('http get error, error: ' + error);
                    dogetpk10info();
                    return;
                }
            });
        }
        else {
            console.log('data is not found.')
        }
    });
}

// http://mem2.mamefi718.dnwxj.com/
function autogetpk10moneySche() {
    var rule2 = new schedule.RecurrenceRule();
    rule2.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    rule2.minute = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58];
    rule2.second = 59;
    schedule.scheduleJob(rule2, function () {
        var currentTime = new Date();
        buysetting.getSettingByQuery({ date: currentTime.Format("yyyy-MM-dd"), status: "true" }, function (err, docs) {
            if (err) {
                console.log(err + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                return;
            }
            if (docs.length == 0) {
                console.log("未找到正常配置" + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                return;
            }
            for (var i = 0; i < docs.length; i++) {
                var startTime = new Date(docs[i].date + " " + docs[i].stime);
                var endTime = new Date(docs[i].date + " " + docs[i].etime);
                if (currentTime < startTime || currentTime > endTime) {
                    return;
                }

                var j = request.jar();
                var options = {
                    id: docs[i]._id,
                    burl: docs[i].url,
                    url: docs[i].url + 'user/Refresh_Credits.aspx',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
                        'Cookie': docs[i].cookies_cache || docs[i].cookies
                    },
                    gzip: true,
                    jar: j,
                    followRedirect: false,
                };

                //console.log(docs[i].url);
                //console.log(docs[i].cookies_cache || docs[i].cookies);
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        $ = cheerio.load(body);
                        var prefix = $('a').attr('href');
                        if (prefix != undefined) {
                            options.url = options.burl + prefix;

                            request(options, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var resObj = JSON.parse(body);
                                    if (resObj.status != 'OK') {
                                        console.log("url或cookie错误. body:" + body);
                                    }
                                    else {
                                        console.log("当前可用额度为" + resObj.Current_Credits_kc)
                                        buysetting.updateMoney(options.id, resObj.Current_Credits_kc + '', function (err, updateresult) { });
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
                                buysetting.updateMoney(options.id, resObj.Current_Credits_kc + '', function (err, updateresult) { });
                            }
                        }
                    }
                    else {
                        console.log("url或cookie错误2.error:" + error);
                    }
                });
            }
        });
    });
}

// http://mem2.mamefi718.dnwxj.com/
function autobuypk10Sche() {
    var rule2 = new schedule.RecurrenceRule();
    rule2.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    rule2.minute = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59];
    rule2.second = 10;
    schedule.scheduleJob(rule2, function () {
        //if (!CURRENT_LOCK) {
            doautobuypk10(true);
        //}
    });
}

var CURRENT_DOC;
var CURRENT_LOCK = false;
function doautobuypk10(flag) {
    if (CURRENT_LOCK) {
        console.log('正在执行中...');
        CURRENT_LOCK = false;
        return;
    }
    CURRENT_LOCK = true;
    console.log('下注开始' + new Date().Format('yyyy-MM-dd hh:mm:ss'));
    var currentTime = new Date();
    buysetting.getSettingByQuery({ date: currentTime.Format("yyyy-MM-dd"), status: "true" }, function (err, docs) {
        if (err) {
            console.log(err + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
            CURRENT_LOCK = false;
            if (flag) doautobuypk10(false);
            return;
        }
        if (docs.length == 0) {
            console.log("未找到正常配置" + new Date().Format('yyyy-MM-dd hh:mm:ss'));
            CURRENT_LOCK = false;
            return;
        }
        for (var i = 0; i < docs.length; i++) {
            CURRENT_DOC = docs[i];
            var startTime = new Date(CURRENT_DOC.date + " " + CURRENT_DOC.stime);
            var endTime = new Date(CURRENT_DOC.date + " " + CURRENT_DOC.etime);
            if (currentTime < startTime || currentTime > endTime) {
                CURRENT_LOCK = false;
                return;
            }

            var j = request.jar();
            var cookies_use = CURRENT_DOC.cookies_cache || CURRENT_DOC.cookies;
            var jcookie = request.cookie(cookies_use);
            var url = CURRENT_DOC.url + 'user/L_UserInfo.aspx';
            j.setCookie(jcookie, url);
            var options = {
                url: CURRENT_DOC.url + 'user/L_UserInfo.aspx',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
                    'Cookie': cookies_use
                },
                jar: j,
                gzip: true,
                timeout: 30000
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    $ = cheerio.load(body);
                    var money = $('#currentCreditsKc').text();
                    if (parseFloat(money) > parseFloat(CURRENT_DOC.maxmoney) || parseFloat(money) < parseFloat(CURRENT_DOC.minmoney) || parseFloat(money) < parseFloat(CURRENT_DOC.unit) * 5) {
                        console.log("金额限制" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                        CURRENT_LOCK = false;
                        return;
                    };
                    var script = $('body').find('script');
                    script.each(function (i, elem) {
                        var text = $(this).html();
                        var JeuValidateArr = text.match(/\d{12,}/g);
                        if (JeuValidateArr != null && JeuValidateArr.length > 0) {
                            buypk10withjeu(options, JeuValidateArr, money, flag);
                            //return;
                        } else {
                            var prefix = $('a').attr('href');
                            options.url = CURRENT_DOC.url + prefix;
                            request(options, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    $ = cheerio.load(body);
                                    var money = $('#currentCreditsKc').text();
                                    if (parseFloat(money) > parseFloat(CURRENT_DOC.maxmoney) || parseFloat(money) < parseFloat(CURRENT_DOC.minmoney)) {
                                        console.log("金额限制" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                        CURRENT_LOCK = false;
                                        return;
                                    };
                                    var script = $('body').find('script');
                                    script.each(function (i, elem) {
                                        var text = $(this).html();
                                        var JeuValidateArr = text.match(/\d{12,}/g);
                                        if (JeuValidateArr != null && JeuValidateArr.length > 0) {
                                            buypk10withjeu(options, JeuValidateArr, money, flag);
                                            return;
                                        }
                                        else {
                                            console.log('cookie失效');
                                            CURRENT_LOCK = false;
                                        }
                                        return;
                                    });
                                } else {
                                    console.log('获取用户金额失败，error: ' + error + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                    CURRENT_LOCK = false;
                                    if (flag) doautobuypk10(false);
                                }

                                return false;
                            });
                        }

                        return false;
                    });
                }
                else {
                    console.log('获取用户金额失败，error: ' + error + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                    CURRENT_LOCK = false;
                    if (flag) doautobuypk10(false);
                }
            });
        }
    });
}

function buypk10withjeu(options, JeuValidateArr, money, flag) {
    var currentTime = new Date();
    var JeuValidate = JeuValidateArr[0];
    console.log('JeuValidate: ' + JeuValidate + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
    pk10.getPk10ByDate(currentTime.Format("yyyy-MM-dd"), function (err, pk10Result) {
        if (pk10Result.length > 2) {
            var data1 = pk10Result[0].toObject();
            var data2 = pk10Result[1].toObject();
            data1.Sum0 = data1.numbers[0] + data1.numbers[9];
            data1.Sum0 = data1.Sum0 <= 10 ? data1.Sum0 : data1.Sum0 % 10;
            data2.Sum0 = data2.numbers[0] + data2.numbers[9];
            data2.Sum0 = data2.Sum0 <= 10 ? data2.Sum0 : data2.Sum0 % 10;
            data1.Location0 = data1.numbers.indexOf(data2.Sum0);

            data1.Sum1 = data1.numbers[1] + data1.numbers[8];
            data1.Sum1 = data1.Sum1 <= 10 ? data1.Sum1 : data1.Sum1 % 10;
            data2.Sum1 = data2.numbers[1] + data2.numbers[8];
            data2.Sum1 = data2.Sum1 <= 10 ? data2.Sum1 : data2.Sum1 % 10;
            data1.Location1 = data1.numbers.indexOf(data2.Sum1);

            data1.Sum2 = data1.numbers[2] + data1.numbers[7];
            data1.Sum2 = data1.Sum2 <= 10 ? data1.Sum2 : data1.Sum2 % 10;
            data2.Sum2 = data2.numbers[2] + data2.numbers[7];
            data2.Sum2 = data2.Sum2 <= 10 ? data2.Sum2 : data2.Sum2 % 10;
            data1.Location2 = data1.numbers.indexOf(data2.Sum2);

            data1.Sum3 = data1.numbers[3] + data1.numbers[6];
            data1.Sum3 = data1.Sum3 <= 10 ? data1.Sum3 : data1.Sum3 % 10;
            data2.Sum3 = data2.numbers[3] + data2.numbers[6];
            data2.Sum3 = data2.Sum3 <= 10 ? data2.Sum3 : data2.Sum3 % 10;
            data1.Location3 = data1.numbers.indexOf(data2.Sum3);

            data1.Sum4 = data1.numbers[4] + data1.numbers[5];
            data1.Sum4 = data1.Sum4 <= 10 ? data1.Sum4 : data1.Sum4 % 10;
            data2.Sum4 = data2.numbers[4] + data2.numbers[5];
            data2.Sum4 = data2.Sum4 <= 10 ? data2.Sum4 : data2.Sum4 % 10;
            data1.Location4 = data1.numbers.indexOf(data2.Sum4);

            options.url = CURRENT_DOC.url + "/user/XML_pk/Read_Multiple.aspx?LT=3&T=22&GT=1,5,9,13,17,21,24,27,30,33";
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    parseString(body, function (err, res) {
                        if (err) {
                            console.log(err + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                            CURRENT_LOCK = false;
                            if (flag) doautobuypk10(false);
                            return;
                        }
                        var Multiple_Info = res.update.Multiple_Info[0];
                        var Multiple_InfoArr = [];
                        for (var key in Multiple_Info) {
                            var newMultiple_Info = {};
                            newMultiple_Info.index = key.split('_')[2];
                            newMultiple_Info.pinfo = Multiple_Info[key][0];
                            Multiple_InfoArr.push(newMultiple_Info);
                        }
                        console.log('Multiple_InfoArr.length: ' + Multiple_InfoArr.length + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                        var period = parseFloat(data1.periods) + 1;
                        if (CURRENT_DOC.channel.indexOf('1/10') > -1) {
                            buypk10(money, period, data1.Sum0, data1.Location0, Multiple_InfoArr, options, JeuValidate, '1/10', CURRENT_DOC._id, flag);
                        }
                        if (CURRENT_DOC.channel.indexOf('2/9') > -1) {
                            buypk10(money, period, data1.Sum1, data1.Location1, Multiple_InfoArr, options, JeuValidate, '2/9', CURRENT_DOC._id, flag);
                        }
                        if (CURRENT_DOC.channel.indexOf('3/8') > -1) {
                            buypk10(money, period, data1.Sum2, data1.Location2, Multiple_InfoArr, options, JeuValidate, '3/8', CURRENT_DOC._id, flag);
                        }
                        if (CURRENT_DOC.channel.indexOf('4/7') > -1) {
                            buypk10(money, period, data1.Sum3, data1.Location3, Multiple_InfoArr, options, JeuValidate, '4/7', CURRENT_DOC._id, flag);
                        }
                        if (CURRENT_DOC.channel.indexOf('5/6') > -1) {
                            buypk10(money, period, data1.Sum4, data1.Location4, Multiple_InfoArr, options, JeuValidate, '5/6', CURRENT_DOC._id, flag);
                        }
                    });
                }
                else {
                    console.log("Read_Multiple, err: " + error + " ,body: " + body + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                    CURRENT_LOCK = false;
                    if (flag) doautobuypk10(false);
                }

            });
        } else {
            console.log("pk10记录出错" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
            CURRENT_LOCK = false;
            //if (flag) doautobuypk10(false);
        }
    });
}

function buypk10(money, period, num, location, Multiple_InfoArr, options, jeuValidate, channel, buysetting_id, flag) {
    //console.log(num + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
    var pi_id = "";
    var pi_p = "";
    if (location > 4) {
        pi_id = Multiple_InfoArr[num + 50 - 1].index + ',' + Multiple_InfoArr[num + 60 - 1].index + ',' + Multiple_InfoArr[num + 70 - 1].index + ',' + Multiple_InfoArr[num + 80 - 1].index + ',' + Multiple_InfoArr[num + 90 - 1].index;
        pi_p = Multiple_InfoArr[num + 50 - 1].pinfo + ',' + Multiple_InfoArr[num + 60 - 1].pinfo + ',' + Multiple_InfoArr[num + 70 - 1].pinfo + ',' + Multiple_InfoArr[num + 80 - 1].pinfo + ',' + Multiple_InfoArr[num + 90 - 1].pinfo;
    } else {
        pi_id = Multiple_InfoArr[num + 0 - 1].index + ',' + Multiple_InfoArr[num + 10 - 1].index + ',' + Multiple_InfoArr[num + 20 - 1].index + ',' + Multiple_InfoArr[num + 30 - 1].index + ',' + Multiple_InfoArr[num + 40 - 1].index;
        pi_p = Multiple_InfoArr[num + 0 - 1].pinfo + ',' + Multiple_InfoArr[num + 10 - 1].pinfo + ',' + Multiple_InfoArr[num + 20 - 1].pinfo + ',' + Multiple_InfoArr[num + 30 - 1].pinfo + ',' + Multiple_InfoArr[num + 40 - 1].pinfo;
    }
    pi_units = CURRENT_DOC.unit + ',' + CURRENT_DOC.unit + ',' + CURRENT_DOC.unit + ',' + CURRENT_DOC.unit + ',' + CURRENT_DOC.unit;
    var record = { uid: CURRENT_DOC.uid, period: period, channel: channel, sum: num, location: location, rmoney: money };
    if (pi_id != "") {
        options.url = CURRENT_DOC.url + "/user/L_Confirm_Jeu_pk.aspx";
        options.form = { 'JeuValidate': jeuValidate, 'uPI_ID': pi_id, 'uPI_P': pi_p, 'uPI_M': pi_units };
        var pushdata = options.form;
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                options.url = CURRENT_DOC.url + 'user/L_UserInfo.aspx';
                options.form = null;
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        $ = cheerio.load(body);
                        var curmoney = $('#currentCreditsKc').text() || '0';
                        if (curmoney == '0') {
                            var prefix = $('a').attr('href');
                            options.url = CURRENT_DOC.url + prefix;
                            request(options, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    $ = cheerio.load(body);
                                    var curmoney = $('#currentCreditsKc').text() || '0';
                                    console.log(curmoney + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                    if (parseFloat(curmoney) < parseFloat(money)) {
                                        console.log("下注成功" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                        record.pushdata = pushdata;
                                        record.desc = "下注成功";
                                        record.rmoney = curmoney;
                                        record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                        buyrecord.newAndSave(record);

                                        CURRENT_LOCK = false;
                                        var cookies_update = options.jar.getCookieString(options.url) + ";ASP.NET_SessionId=" + getCookie('ASP.NET_SessionId', options.headers.Cookie)
                                        buysetting.updateCookiesAndMoney(buysetting_id, cookies_update, curmoney, function (err, updateresult) { });
                                    }
                                    else {
                                        console.log("下注失败" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                        record.pushdata = pushdata;
                                        record.desc = "下注失败";
                                        record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                        buyrecord.newAndSave(record);

                                        CURRENT_LOCK = false;
                                        if (flag) doautobuypk10(false);
                                    }
                                }
                                else {
                                    console.log("下注异常L_UserInfo, err: " + error + " ,body: " + body + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                    record.pushdata = pushdata;
                                    record.desc = "下注异常L_UserInfo";
                                    record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                    buyrecord.newAndSave(record);

                                    CURRENT_LOCK = false;
                                    if (flag) doautobuypk10(false);
                                }
                            });
                        }
                        else {
                            console.log(curmoney + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                            if (parseFloat(curmoney) < parseFloat(money)) {
                                console.log("下注成功" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                record.pushdata = pushdata;
                                record.desc = "下注成功";
                                record.rmoney = curmoney;
                                record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                buyrecord.newAndSave(record);

                                CURRENT_LOCK = false;
                                var cookies_update = options.jar.getCookieString(options.url) + ";ASP.NET_SessionId=" + getCookie('ASP.NET_SessionId', options.headers.Cookie)
                                buysetting.updateCookiesAndMoney(buysetting_id, cookies_update, curmoney, function (err, updateresult) { });
                            }
                            else {
                                console.log("下注失败" + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                                record.pushdata = pushdata;
                                record.desc = "下注失败";
                                record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                buyrecord.newAndSave(record);

                                CURRENT_LOCK = false;
                                if (flag) doautobuypk10(false);
                            }
                        }
                    }
                    else {
                        console.log("下注异常L_UserInfo, err: " + error + " ,body: " + body + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                        record.pushdata = pushdata;
                        record.desc = "下注异常L_UserInfo";
                        record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                        buyrecord.newAndSave(record);

                        CURRENT_LOCK = false;
                        if (flag) doautobuypk10(false);
                    }
                });
            }
            else {
                console.log("L_Confirm_Jeu_pk, err: " + error + " ,body: " + body + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));
                record.desc = "下注异常L_Confirm_Jeu_pk";
                record.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                buyrecord.newAndSave(record);

                CURRENT_LOCK = false;
                if (flag) doautobuypk10(false);
            }
        });
    }
    else {
        console.log("pi_id: " + pi_id + " ,pi_p: " + pi_p + " " + new Date().Format('yyyy-MM-dd hh:mm:ss'));

        CURRENT_LOCK = false;
        if (flag) doautobuypk10(false);
    }
}

function getCookie(name, cookiestr) { //取cookies函数
    var value = "";
    var cookie = ";" + cookiestr.replace(/;\s+/g, ";") + ";"
    var pos = cookie.indexOf(";" + name + "=");
    if (pos > -1) {
        var start = cookie.indexOf("=", pos);
        var end = cookie.indexOf(";", start);
        value = unescape(cookie.substring(start + 1, end));
    }
    return value;
}

//dogetpk10info();
getpk10infoSche();

autogetpk10moneySche();

//doautobuypk10(false);
autobuypk10Sche();



process.on('uncaughtException', function(err){
    console.log(err);
    CURRENT_LOCK = false;
    process.exit(1);
})


