var pk10 = require('../proxy').Pk10;
var buySetting = require('../proxy').BuySetting;
var buyRecord = require('../proxy').BuyRecord;
var tools = require('../util/tools');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

exports.pk101 = function (req, res, next) {
    var sdate = req.query.date;
    var type = req.query.type;
    var date = new Date(sdate);
    date.setDate(date.getDate() - 1);
    var edate = date.Format("yyyy-MM-dd");

    if (type == '1') {
        getpk10data1(sdate, edate, function (resultData) { res.json(resultData); });
    } else {
        getpk10data(sdate, edate, function (resultData) { res.json(resultData); });
    }
};

function getpk10data(sdate, edate, callback) {
    /*   pk10.getPk10ByDate(sdate, function (err, result) {
           if (result.length > 0) {
               console.log("data form db---date:" + sdate);
   
               for (k = 0; k < result.length; k++) {
                   result[k] = result[k].toObject();
                   result[k].Sum0 = result[k].numbers[0] + result[k].numbers[9];
                   result[k].Sum0 = result[k].Sum0 <= 10 ? result[k].Sum0 : result[k].Sum0 % 10;
   
                   result[k].Sum1 = result[k].numbers[1] + result[k].numbers[8];
                   result[k].Sum1 = result[k].Sum1 <= 10 ? result[k].Sum1 : result[k].Sum1 % 10;
   
                   result[k].Sum2 = result[k].numbers[2] + result[k].numbers[7];
                   result[k].Sum2 = result[k].Sum2 <= 10 ? result[k].Sum2 : result[k].Sum2 % 10;
   
                   result[k].Sum3 = result[k].numbers[3] + result[k].numbers[6];
                   result[k].Sum3 = result[k].Sum3 <= 10 ? result[k].Sum3 : result[k].Sum3 % 10;
   
                   result[k].Sum4 = result[k].numbers[4] + result[k].numbers[5];
                   result[k].Sum4 = result[k].Sum4 <= 10 ? result[k].Sum4 : result[k].Sum4 % 10;
               }
   
               pk10.getPk10ByDate(edate, function (err, prevResult) {
                   if (prevResult.length > 0) {
                       console.log("data form db---date:" + edate);
                       prevResult[0] = prevResult[0].toObject();
                       totalResult = dealpk10data(result, prevResult[0]);
                       //console.log(totalResult);
                       if (callback)
                           callback(totalResult);
                   } else {
                       console.log("data form server---date:" + edate);
                       var options = {
                           date: edate,
                           url: 'https://www.gaopinpk10.com/pk10/kj?date=' + edate,
                           headers: {
                               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
                           }
                       };
                       request(options, function (error, response, body) {
                           if (!error && response.statusCode == 200) {
                               $ = cheerio.load(body);
   
                               var dataArr = [];
                               $('#history tr').each(function (i, item) {
                                   _this = $(this);
                                   if (_this.hasClass('head')) return true;
                                   var data = {};
                                   data.date = options.date;
                                   data.periods = Number(_this.find('.p').text());
                                   data.time = _this.find('.t').text();
   
                                   data.numbers = [];
                                   _this.find('.nums i').each(function (index, numberItem) {
                                       data.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                                   });
                                   dataArr.push(data);
                               });
   
                               pk10.newAndSaveArr(dataArr, function (err, prevResult) {
                                   totalResult = dealpk10data(result, dataArr[0]);
   
                                   if (callback)
                                       callback(totalResult);
                               });
                           }
                       });
                   }
               });
           } else {*/
    console.log("data form server--date:" + sdate);

    var options = {
        date: sdate,
        url: 'https://www.gaopinpk10.com/pk10/kj?date=' + sdate,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
        }
    };

    request(options, function (error, response, body) {
        var dataArr = [];
        var dbdataArr = [];
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);

            $('#history tr').each(function (i, item) {
                _this = $(this);
                if (_this.hasClass('head')) return true;
                var data = {};
                var dbdata = {};
                data.date = options.date;
                data.periods = Number(_this.find('.p').text());
                data.time = _this.find('.t').text();

                data.numbers = [];
                _this.find('.nums i').each(function (index, numberItem) {
                    data.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                });

                dbdata.date = options.date;
                dbdata.periods = Number(_this.find('.p').text());
                dbdata.time = _this.find('.t').text();

                dbdata.numbers = [];
                _this.find('.nums i').each(function (index, numberItem) {
                    dbdata.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                });

                data.Sum0 = data.numbers[0] + data.numbers[9];
                data.Sum0 = data.Sum0 <= 10 ? data.Sum0 : data.Sum0 % 10;

                data.Sum1 = data.numbers[1] + data.numbers[8];
                data.Sum1 = data.Sum1 <= 10 ? data.Sum1 : data.Sum1 % 10;

                data.Sum2 = data.numbers[2] + data.numbers[7];
                data.Sum2 = data.Sum2 <= 10 ? data.Sum2 : data.Sum2 % 10;

                data.Sum3 = data.numbers[3] + data.numbers[6];
                data.Sum3 = data.Sum3 <= 10 ? data.Sum3 : data.Sum3 % 10;

                data.Sum4 = data.numbers[4] + data.numbers[5];
                data.Sum4 = data.Sum4 <= 10 ? data.Sum4 : data.Sum4 % 10;

                data.Location0 = 0;
                data.Location1 = 0;
                data.Location2 = 0;
                data.Location3 = 0;
                data.Location4 = 0;

                data.Status05 = 0;
                data.Status15 = 0;
                data.Status25 = 0;
                data.Status35 = 0;
                data.Status45 = 0;

                data.Other0 = "";
                data.Other1 = "";
                data.Other2 = "";
                data.Other3 = "";

                data.Other4 = "";
                data.Other5 = "";

                data.Locationo23 = "";
                data.Locationo450 = "";
                data.Locationo451 = "";

                data.Other6 = "";
                data.Locationo6 = "";

                dataArr.push(data);
                dbdataArr.push(dbdata);
            });

            /* if (dbdataArr.length > 0) {
                 pk10.newAndSaveArr(dbdataArr, function (err, result) {
                     if (err) {
                         console.log('Error:' + err);
                         return;
                     }*/

            if (dataArr.length > 0) {
                options.url = 'https://www.gaopinpk10.com/pk10/kj?date=' + edate;
                request(options, function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        $ = cheerio.load(body);
                        _this = $('#history tr').eq(1);
                        var predata = {};
                        predata.periods = Number(_this.find('.p').text());
                        predata.time = _this.find('.t').text();

                        predata.numbers = [];
                        _this.find('.nums i').each(function (index, numberItem) {
                            predata.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                        });
                        dataArr = dealpk10data(dataArr, predata);
                    } else {
                        dataArr = dealpk10data(dataArr, {});
                    }
                    if (callback)
                        callback(dataArr);
                });
                // dataArr = dealpk10data(dataArr, {});
                // if (callback)
                //     callback(dataArr);
            }
            // });
            //}
        }
    });
    // }
    //});
}

function getpk10data1(sdate, edate, callback) {
    console.log("data form server--date:" + sdate);

    var options = {
        date: sdate,
        url: 'https://www.gaopinpk10.com/pk10/kj?date=' + sdate,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36'
        }
    };

    request(options, function (error, response, body) {
        var dataArr = [];
        var dbdataArr = [];
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);

            $('#history tr').each(function (i, item) {
                _this = $(this);
                if (_this.hasClass('head')) return true;
                var data = {};
                var dbdata = {};
                data.date = options.date;
                data.periods = Number(_this.find('.p').text());
                data.time = _this.find('.t').text();

                data.numbers = [];
                _this.find('.nums i').each(function (index, numberItem) {
                    data.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                });

                dbdata.date = options.date;
                dbdata.periods = Number(_this.find('.p').text());
                dbdata.time = _this.find('.t').text();

                dbdata.numbers = [];
                _this.find('.nums i').each(function (index, numberItem) {
                    dbdata.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
                });

                data.Sum0 = data.numbers[0] + data.numbers[9];
                data.Sum0 = data.Sum0 <= 10 ? data.Sum0 : data.Sum0 % 10;

                data.Sum1 = data.numbers[1] + data.numbers[8];
                data.Sum1 = data.Sum1 <= 10 ? data.Sum1 : data.Sum1 % 10;

                data.Sum2 = data.numbers[2] + data.numbers[7];
                data.Sum2 = data.Sum2 <= 10 ? data.Sum2 : data.Sum2 % 10;

                data.Sum3 = data.numbers[3] + data.numbers[6];
                data.Sum3 = data.Sum3 <= 10 ? data.Sum3 : data.Sum3 % 10;

                data.Sum4 = data.numbers[4] + data.numbers[5];
                data.Sum4 = data.Sum4 <= 10 ? data.Sum4 : data.Sum4 % 10;

                data.Location0 = 0;
                data.Location1 = 0;
                data.Location2 = 0;
                data.Location3 = 0;
                data.Location4 = 0;

                data.Status05 = 0;
                data.Status15 = 0;
                data.Status25 = 0;
                data.Status35 = 0;
                data.Status45 = 0;

                data.Other0 = "";
                data.oper0 = 0;
                data.opersum0 = 0;
                data.Loc0 = '';
                data.Other1 = "";
                data.Other2 = "";
                data.Other3 = "";

                data.Other4 = "";
                data.Other5 = "";

                data.Locationo23 = "";
                data.Locationo450 = "";
                data.Locationo451 = "";

                data.Other6 = "";
                data.Locationo6 = "";

                data.Other7 = ""; //1、2、3、4

                dataArr.push(data);
                dbdataArr.push(dbdata);
            });


            dataArr = dealpk10data1(dataArr, {});
            if (callback)
                callback(dataArr);

            // if (dataArr.length > 0) {
            //     options.url = 'https://www.gaopinpk10.com/pk10/kj?date=' + edate;
            //     request(options, function (error, response, body) {

            //         if (!error && response.statusCode == 200) {
            //             $ = cheerio.load(body);
            //             _this = $('#history tr').eq(1);
            //             var predata = {};
            //             predata.periods = Number(_this.find('.p').text());
            //             predata.time = _this.find('.t').text();

            //             predata.numbers = [];
            //             _this.find('.nums i').each(function (index, numberItem) {
            //                 predata.numbers.push(Number($(this).attr('class').replace('pk-no', '')));
            //             });
            //             dataArr = dealpk10data(dataArr, predata);
            //         } else {
            //             dataArr = dealpk10data(dataArr, {});
            //         }
            //         if (callback)
            //             callback(dataArr);
            //     });
            // }
        }
    });

}

function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
function dealpk10data(dataArr, predata) {
    if (!isEmptyObject(predata)) {
        predata.Sum0 = predata.numbers[0] + predata.numbers[9];
        predata.Sum0 = predata.Sum0 <= 10 ? predata.Sum0 : predata.Sum0 % 10;

        predata.Sum1 = predata.numbers[1] + predata.numbers[8];
        predata.Sum1 = predata.Sum1 <= 10 ? predata.Sum1 : predata.Sum1 % 10;

        predata.Sum2 = predata.numbers[2] + predata.numbers[7];
        predata.Sum2 = predata.Sum2 <= 10 ? predata.Sum2 : predata.Sum2 % 10;

        predata.Sum3 = predata.numbers[3] + predata.numbers[6];
        predata.Sum3 = predata.Sum3 <= 10 ? predata.Sum3 : predata.Sum3 % 10;

        predata.Sum4 = predata.numbers[4] + predata.numbers[5];
        predata.Sum4 = predata.Sum4 <= 10 ? predata.Sum4 : predata.Sum4 % 10;

        dataArr[dataArr.length - 1].Location0 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum0) + 1;
        dataArr[dataArr.length - 1].Location1 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum1) + 1;
        dataArr[dataArr.length - 1].Location2 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum2) + 1;
        dataArr[dataArr.length - 1].Location3 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum3) + 1;
        dataArr[dataArr.length - 1].Location4 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum4) + 1;

        //dataArr[dataArr.length - 1].Result = dataArr[dataArr.length - 1].Location > 5 ? "大" : "小";
        dataArr[dataArr.length - 1].Status05 = dataArr[dataArr.length - 1].Location0 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label07 = dataArr[dataArr.length - 1].Location0 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status15 = dataArr[dataArr.length - 1].Location1 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label17 = dataArr[dataArr.length - 1].Location1 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status25 = dataArr[dataArr.length - 1].Location2 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label27 = dataArr[dataArr.length - 1].Location2 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status35 = dataArr[dataArr.length - 1].Location3 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label37 = dataArr[dataArr.length - 1].Location3 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status45 = dataArr[dataArr.length - 1].Location4 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label47 = dataArr[dataArr.length - 1].Location4 > 7 ? "不中" : "中";


        var other0Arr = [];
        for (i = 0; i < predata.numbers.length; i++) {
            if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) > 1 && dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) < 8) other0Arr.push('<span class="label label-success">中</span>');
            else other0Arr.push('<span class="label label-danger">否</span>');
        }

        dataArr[dataArr.length - 1].Other0 = other0Arr.join('&nbsp;');

        var other1Arr = [];
        for (i = 0; i < predata.numbers.length; i++) {
            if (i < 5) {
                if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) < 5) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
            else {
                if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) > 4) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
        }
        dataArr[dataArr.length - 1].Other1 = other1Arr.join('&nbsp;');
    }

    var ji = 0;
    var ou = 1;

    var tongji0 = 0;
    var tongji00 = 0;
    var tongji1 = 0;
    var tongji11 = 0;

    var index2 = 0;
    var tongji2 = 0;
    var tongji22 = 0;
    for (i = dataArr.length - 2; i > -1; i--) {
        dataArr[i].Location0 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum0) + 1;
        dataArr[i].Location1 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum1) + 1;
        dataArr[i].Location2 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum2) + 1;
        dataArr[i].Location3 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum3) + 1;
        dataArr[i].Location4 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum4) + 1;
        //dataArr[i].Result = dataArr[i].Location > 5 ? "大" : "小";

        if (dataArr[i + 1].Status05 == 1) {
            dataArr[i].Status05 = dataArr[i].Location0 > 5 ? -1 : 1;
            dataArr[i].Label07 = dataArr[i].Location0 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status05 = dataArr[i].Location0 < 6 ? 1 : -1;
            dataArr[i].Label07 = dataArr[i].Location0 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status15 == 1) {
            dataArr[i].Status15 = dataArr[i].Location1 > 5 ? -1 : 1;
            dataArr[i].Label17 = dataArr[i].Location1 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status15 = dataArr[i].Location1 < 6 ? 1 : -1;
            dataArr[i].Label17 = dataArr[i].Location1 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status25 == 1) {
            dataArr[i].Status25 = dataArr[i].Location2 > 5 ? -1 : 1;
            dataArr[i].Label27 = dataArr[i].Location2 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status25 = dataArr[i].Location2 < 6 ? 1 : -1;
            dataArr[i].Label27 = dataArr[i].Location2 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status35 == 1) {
            dataArr[i].Status35 = dataArr[i].Location3 > 5 ? -1 : 1;
            dataArr[i].Label37 = dataArr[i].Location3 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status35 = dataArr[i].Location3 < 6 ? 1 : -1;
            dataArr[i].Label37 = dataArr[i].Location3 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status45 == 1) {
            dataArr[i].Status45 = dataArr[i].Location4 > 5 ? -1 : 1;
            dataArr[i].Label47 = dataArr[i].Location4 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status45 = dataArr[i].Location4 < 6 ? 1 : -1;
            dataArr[i].Label47 = dataArr[i].Location4 < 4 ? "不中" : "中";
        }

        var other0Arr = [];
        for (j = 0; j < dataArr[i].numbers.length; j++) {
            if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[j]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[j]) < 8) other0Arr.push('<span class="label label-success">中</span>');
            else other0Arr.push('<span class="label label-danger">否</span>');
        }
        dataArr[i].Other0 = other0Arr.join('&nbsp;');

        var other1Arr = [];
        for (k = 0; k < dataArr[i].numbers.length; k++) {
            if (k < 5) {
                if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[k]) < 5) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
            else {
                if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[k]) > 4) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
        }
        dataArr[i].Other1 = other1Arr.join('&nbsp;');

        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ji]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ji]) < 8) dataArr[i].Other2 = '<span class="label label-success">中</span>';
        else dataArr[i].Other2 = '<span class="label label-danger">否</span>';
        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ou]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ou]) < 8) dataArr[i].Other3 = '<span class="label label-success">中</span>';
        else dataArr[i].Other3 = '<span class="label label-danger">否</span>';

        dataArr[i].Locationo23 = (ji + 1) + ',' + (ou + 1);

        ji += 2;
        ou += 2;
        if (ji > 8) ji = 0;
        if (ou > 9) ou = 1;

        var numtime = dataArr[i].time.split(':')[1].split('');
        var numres = parseInt(numtime[0]) + parseInt(numtime[1]);
        if (numres > 10) numres = numres % 10;
        if (dataArr[i].numbers.indexOf(numres) > 1 && dataArr[i].numbers.indexOf(numres) < 8) {
            dataArr[i].Other4 = '<span class="label label-success">中</span>';
            if (tongji0 > 5) {
                tongji00++;
                dataArr[i].Locationo450 = tongji00;
            }
            tongji0 = 0;
        }
        else {
            dataArr[i].Other4 = '<span class="label label-danger">否</span>';
            tongji0++;
        }

        numtime = dataArr[i + 1].time.split(':')[1].split('');
        numres = parseInt(numtime[0]) + parseInt(numtime[1]);
        if (numres > 10) numres = numres % 10;
        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[numres - 1]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[numres - 1]) < 8) {
            dataArr[i].Other5 = '<span class="label label-success">中</span>';
            if (tongji1 > 5) {
                tongji11++;
                dataArr[i].Locationo451 = tongji11;
            }

            tongji1 = 0;
        }
        else {
            dataArr[i].Other5 = '<span class="label label-danger">否</span>';
            tongji1++;
        }

        dataArr[i].Other6N = dataArr[i + 1].numbers[index2];
        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[index2]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[index2]) < 8) {
            dataArr[i].Other6 = '<span class="label label-success">中</span>';
            if (tongji2 > 5) {
                tongji22++;
                dataArr[i].Locationo6 = tongji22;
            }

            tongji2 = 0;
        }
        else {
            dataArr[i].Other6 = '<span class="label label-danger">否</span>';
            tongji2++;
        }

        index2++;
        if (index2 > 9) index2 = index2 % 10;
    }
    return dataArr;
}


function dealpk10data1(dataArr, predata) {
    var o7index = 0;
    var o7arr = [1, 2, 3, 4];
    if (!isEmptyObject(predata)) {
        predata.Sum0 = predata.numbers[0] + predata.numbers[9];
        predata.Sum0 = predata.Sum0 <= 10 ? predata.Sum0 : predata.Sum0 % 10;

        predata.Sum1 = predata.numbers[1] + predata.numbers[8];
        predata.Sum1 = predata.Sum1 <= 10 ? predata.Sum1 : predata.Sum1 % 10;

        predata.Sum2 = predata.numbers[2] + predata.numbers[7];
        predata.Sum2 = predata.Sum2 <= 10 ? predata.Sum2 : predata.Sum2 % 10;

        predata.Sum3 = predata.numbers[3] + predata.numbers[6];
        predata.Sum3 = predata.Sum3 <= 10 ? predata.Sum3 : predata.Sum3 % 10;

        predata.Sum4 = predata.numbers[4] + predata.numbers[5];
        predata.Sum4 = predata.Sum4 <= 10 ? predata.Sum4 : predata.Sum4 % 10;

        dataArr[dataArr.length - 1].Location0 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum0) + 1;
        dataArr[dataArr.length - 1].Location1 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum1) + 1;
        dataArr[dataArr.length - 1].Location2 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum2) + 1;
        dataArr[dataArr.length - 1].Location3 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum3) + 1;
        dataArr[dataArr.length - 1].Location4 = dataArr[dataArr.length - 1].numbers.indexOf(predata.Sum4) + 1;

        //dataArr[dataArr.length - 1].Result = dataArr[dataArr.length - 1].Location > 5 ? "大" : "小";
        dataArr[dataArr.length - 1].Status05 = dataArr[dataArr.length - 1].Location0 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label07 = dataArr[dataArr.length - 1].Location0 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status15 = dataArr[dataArr.length - 1].Location1 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label17 = dataArr[dataArr.length - 1].Location1 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status25 = dataArr[dataArr.length - 1].Location2 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label27 = dataArr[dataArr.length - 1].Location2 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status35 = dataArr[dataArr.length - 1].Location3 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label37 = dataArr[dataArr.length - 1].Location3 > 7 ? "不中" : "中";

        dataArr[dataArr.length - 1].Status45 = dataArr[dataArr.length - 1].Location4 > 5 ? -1 : 1;
        dataArr[dataArr.length - 1].Label47 = dataArr[dataArr.length - 1].Location4 > 7 ? "不中" : "中";


        var other0Arr = [];
        for (i = 0; i < predata.numbers.length; i++) {
            if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) > 1 && dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) < 8) other0Arr.push('<span class="label label-success">中</span>');
            else other0Arr.push('<span class="label label-danger">否</span>');
        }

        dataArr[dataArr.length - 1].Other0 = other0Arr.join('&nbsp;');
        var other1Arr = [];
        for (i = 0; i < predata.numbers.length; i++) {
            if (i < 5) {
                if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) < 5) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
            else {
                if (dataArr[dataArr.length - 1].numbers.indexOf(predata.numbers[i]) > 4) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
        }
        dataArr[dataArr.length - 1].Other1 = other1Arr.join('&nbsp;');
    }

    if (dataArr[dataArr.length - 1].numbers.indexOf(o7arr[o7index]) != 1 && dataArr[dataArr.length - 1].numbers.indexOf(o7arr[o7index]) != 6) dataArr[dataArr.length - 1].Other7 = '<span class="label label-success">中</span>';
    else dataArr[dataArr.length - 1].Other7 = '<span class="label label-danger">否</span>';
    o7index++;

    var ji = 0;
    var ou = 1;

    var tongji0 = 0;
    var tongji00 = 0;
    var tongji1 = 0;
    var tongji11 = 0;

    var index2 = 0;
    var tongji2 = 0;
    var tongji22 = 0;
    var zhongArr = [0, 2, 3, 4, 5, 7, 9];

    var oper0 = 0;
    var opersum0 = 0;
    var operloc = 0;
    for (i = dataArr.length - 2; i > -1; i--) {
        dataArr[i].Location0 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum0) + 1;
        dataArr[i].Location1 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum1) + 1;
        dataArr[i].Location2 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum2) + 1;
        dataArr[i].Location3 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum3) + 1;
        dataArr[i].Location4 = dataArr[i].numbers.indexOf(dataArr[i + 1].Sum4) + 1;
        //dataArr[i].Result = dataArr[i].Location > 5 ? "大" : "小";

        if (dataArr[i + 1].Status05 == 1) {
            dataArr[i].Status05 = dataArr[i].Location0 > 5 ? -1 : 1;
            dataArr[i].Label07 = dataArr[i].Location0 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status05 = dataArr[i].Location0 < 6 ? 1 : -1;
            dataArr[i].Label07 = dataArr[i].Location0 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status15 == 1) {
            dataArr[i].Status15 = dataArr[i].Location1 > 5 ? -1 : 1;
            dataArr[i].Label17 = dataArr[i].Location1 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status15 = dataArr[i].Location1 < 6 ? 1 : -1;
            dataArr[i].Label17 = dataArr[i].Location1 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status25 == 1) {
            dataArr[i].Status25 = dataArr[i].Location2 > 5 ? -1 : 1;
            dataArr[i].Label27 = dataArr[i].Location2 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status25 = dataArr[i].Location2 < 6 ? 1 : -1;
            dataArr[i].Label27 = dataArr[i].Location2 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status35 == 1) {
            dataArr[i].Status35 = dataArr[i].Location3 > 5 ? -1 : 1;
            dataArr[i].Label37 = dataArr[i].Location3 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status35 = dataArr[i].Location3 < 6 ? 1 : -1;
            dataArr[i].Label37 = dataArr[i].Location3 < 4 ? "不中" : "中";
        }

        if (dataArr[i + 1].Status45 == 1) {
            dataArr[i].Status45 = dataArr[i].Location4 > 5 ? -1 : 1;
            dataArr[i].Label47 = dataArr[i].Location4 > 7 ? "不中" : "中";
        }
        else {
            dataArr[i].Status45 = dataArr[i].Location4 < 6 ? 1 : -1;
            dataArr[i].Label47 = dataArr[i].Location4 < 4 ? "不中" : "中";
        }

        var other0Arr = [];
        var zhongArrTemp = [];
        var buyball0 = dataArr[i + 1].numbers[0] + dataArr[i + 1].numbers[9];
        if (buyball0 > 10) buyball0 = buyball0 % 10;
        if (buyball0> 5) {
            zhongArrTemp = [3, 4, 5, 6, 7, 8, 9];
            dataArr[i].Loc0 = '后';
        }
        else {
            zhongArrTemp = [0, 1, 2, 3, 4, 5, 6];
            dataArr[i].Loc0 = '前';
        }

        if (zhongArrTemp.indexOf(dataArr[i].numbers.indexOf(buyball0)) > -1) {
            other0Arr.push('<span class="label label-success">中</span>');
            dataArr[i].oper0 = 0.5;
        }
        else {
            other0Arr.push('<span class="label label-danger">否</span>');
            dataArr[i].oper0 = -1;
            if (dataArr[i + 1].opersum0 % 1 != 0)
                dataArr[i].oper0 = -1.5;
        }
        // for (j = 0; j < dataArr[i].numbers.length; j++) {
        //     if (zhongArrTemp.indexOf(dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[j])) > -1) {
        //         other0Arr.push('<span class="label label-success">中</span>');
        //         if (operloc % 10 == j)
        //             dataArr[i].oper0 = 0.5;
        //     }
        //     else {
        //         other0Arr.push('<span class="label label-danger">否</span>');
        //         if (operloc % 10 == j) {
        //             dataArr[i].oper0 = -1;
        //             if (/*dataArr[i + 1].opersum0 > 1 &&*/ dataArr[i + 1].opersum0 % 1 != 0)
        //                 dataArr[i].oper0 = -1.5;
        //         }
        //     }
        // }
        // operloc++;
        dataArr[i].opersum0 = dataArr[i + 1].opersum0 + dataArr[i].oper0;
        dataArr[i].Other0 = other0Arr.join('&nbsp;');

        if (dataArr[i].numbers.indexOf(o7arr[o7index]) != 1 && dataArr[i].numbers.indexOf(o7arr[o7index]) != 6) dataArr[i].Other7 = '<span class="label label-success">中</span>';
        else dataArr[i].Other7 = '<span class="label label-danger">否</span>';
        o7index++;
        if (o7index > 3) {
            o7index = 0;
        }

        var other1Arr = [];
        for (k = 0; k < dataArr[i].numbers.length; k++) {
            if (k < 5) {
                if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[k]) < 5) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
            else {
                if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[k]) > 4) other1Arr.push('<span class="label label-success">中</span>');
                else other1Arr.push('<span class="label label-danger">否</span>');
            }
        }
        dataArr[i].Other1 = other1Arr.join('&nbsp;');

        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ji]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ji]) < 8) dataArr[i].Other2 = '<span class="label label-success">中</span>';
        else dataArr[i].Other2 = '<span class="label label-danger">否</span>';
        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ou]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[ou]) < 8) dataArr[i].Other3 = '<span class="label label-success">中</span>';
        else dataArr[i].Other3 = '<span class="label label-danger">否</span>';

        dataArr[i].Locationo23 = (ji + 1) + ',' + (ou + 1);

        ji += 2;
        ou += 2;
        if (ji > 8) ji = 0;
        if (ou > 9) ou = 1;

        var numtime = dataArr[i].time.split(':')[1].split('');
        var numres = parseInt(numtime[0]) + parseInt(numtime[1]);
        if (numres > 10) numres = numres % 10;
        if (dataArr[i].numbers.indexOf(numres) > 1 && dataArr[i].numbers.indexOf(numres) < 8) {
            dataArr[i].Other4 = '<span class="label label-success">中</span>';
            if (tongji0 > 5) {
                tongji00++;
                dataArr[i].Locationo450 = tongji00;
            }
            tongji0 = 0;
        }
        else {
            dataArr[i].Other4 = '<span class="label label-danger">否</span>';
            tongji0++;
        }

        numtime = dataArr[i + 1].time.split(':')[1].split('');
        numres = parseInt(numtime[0]) + parseInt(numtime[1]);
        if (numres > 10) numres = numres % 10;
        if (dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[numres - 1]) > 1 && dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[numres - 1]) < 8) {
            dataArr[i].Other5 = '<span class="label label-success">中</span>';
            if (tongji1 > 5) {
                tongji11++;
                dataArr[i].Locationo451 = tongji11;
            }

            tongji1 = 0;
        }
        else {
            dataArr[i].Other5 = '<span class="label label-danger">否</span>';
            tongji1++;
        }

        dataArr[i].Other6N = dataArr[i + 1].numbers[index2];
        if (zhongArr.indexOf(dataArr[i].numbers.indexOf(dataArr[i + 1].numbers[index2])) > -1) {
            dataArr[i].Other6 = '<span class="label label-success">中</span>';
            if (tongji2 > 5) {
                tongji22++;
                dataArr[i].Locationo6 = tongji22;
            }

            tongji2 = 0;
        }
        else {
            dataArr[i].Other6 = '<span class="label label-danger">否</span>';
            tongji2++;
        }

        index2++;
        if (index2 > 9) index2 = index2 % 10;


        dataArr[i].JG09 = dataArr[i].numbers[0] + dataArr[i].numbers[9] - dataArr[i + 1].numbers[0] - dataArr[i + 1].numbers[9];
        dataArr[i].JG012 = dataArr[i].numbers[0] + dataArr[i].numbers[1] + dataArr[i].numbers[2] - dataArr[i + 1].numbers[0] - dataArr[i + 1].numbers[1] - dataArr[i + 1].numbers[2];
    }
    return dataArr;
}

exports.buyset = function (req, res, next) {
    var action = req.body.action;
    if (action == "getVcode") {
        getVcode(req.body.url, function (data) {
            res.json(data);
        });
    }
    else if (action == "login") {
        dologin(req.body.url, req.body.username, req.body.password, req.body.vcode, req.body.cookies, function (data) {
            res.json(data);
        });
    }
    else if (action == "test") {
        var options = {
            url: req.body.url + 'user/Refresh_Credits.aspx',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
                'Cookie': req.body.cookies
            },
            gzip: true
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                var resObj = JSON.parse(body);
                if (resObj.status != 'OK') {
                    res.json({ "status": 0, msg: "url或cookie错误. body:" + body });
                }
                else {
                    res.json({ "status": 1, money: resObj.Current_Credits_kc, msg: "当前可用额度为" + resObj.Current_Credits_kc })
                }
            }
            else {
                res.json({ "status": 0, msg: "url或cookie错误.error:" + error });
            }
        });
    }
    else if (action == "save") {
        var user = req.session.user;
        var date = new Date().Format("yyyy-MM-dd");
        var setting = req.body;
        setting.date = date;
        setting.uid = user._id;
        buySetting.newOrUpdate(setting, function (err, result) {
            if (err) {
                console.log(err);
                res.json({ status: 500, msg: err });
            } else {
                res.json({ "status": 1, msg: "保存成功." });
            }
        })
    }
    else {
        res.json({ 'status': '0', msg: '未知的动作' });
    }
};

function getVcode(surl, callback) {
    var j = request.jar();
    var options = {
        url: surl,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
        },
        followRedirect: false,
        jar: j,
        gzip: true
    };
    request(options, function (error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                $ = cheerio.load(body);
                var prefix = $('a').attr('href');
                options.url += prefix;
                request(options, function (error, reswithprefix, body) {
                    options.url = surl + 'user/ValidateImage.aspx?time=' + Math.random();
                    options.encoding = null;
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var type = response.headers["content-type"];
                            var prefix = "data:" + type + ";base64,";
                            var base64 = new Buffer(body, 'binary').toString('base64');
                            callback({ 'status': '1', cookies: j.getCookieString(options.url), data: prefix + base64, msg: '获取验证码成功' });
                        }
                        else {
                            callback({ 'status': '0', msg: '获取验证码失败, error:' + error });
                        }
                    });
                });
            }
            else if (response.statusCode == 302) {
                options.url = surl + 'user/ValidateImage.aspx?time=' + Math.random();
                options.encoding = null;
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var type = response.headers["content-type"];
                        var prefix = "data:" + type + ";base64,";
                        var base64 = new Buffer(body, 'binary').toString('base64');
                        callback({ 'status': '1', cookies: j.getCookieString(options.url), data: prefix + base64, msg: '获取验证码成功' });
                    }
                    else {
                        callback({ 'status': '0', msg: '获取验证码失败, error:' + error });
                    }
                });
            }
            else {
                callback({ 'status': '0', msg: '获取验证码失败, statusCode:' + response.statusCode });
            }
        } else {
            callback({ 'status': '0', msg: '获取验证码失败, error:' + error });
        }
    });
}

function dologin(surl, username, password, vcode, cookies, callback) {
    var j = request.jar();
    var jcookie = request.cookie(cookies);
    var url = surl + 'user/login_validate.aspx';
    j.setCookie(jcookie, url);
    var options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
            'Cookie': cookies
        },
        form: { loginName: username, loginPwd: password, ValidateCode: vcode },
        followRedirect: false,
        jar: j,
        encoding: null,
        gzip: true
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var html = iconv.decode(body, 'gb2312')
            if (html.indexOf("帳號或密碼不正確") > -1) {
                callback({ "status": 0, msg: "账号或密码错误." });
                return;
            }
            else if (html.indexOf("輸入驗證碼") > -1) {
                callback({ "status": 0, msg: "验证码错误." });
                return;
            }
            else {
                options.url = surl + 'user/main.aspx';
                options.form = { 'cbxRead': '', 'agree': 'yes' };
                options.encoding = 'utf8';
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback({ "status": 1, cookies: j.getCookieString(options.url), msg: "登录成功." });
                    }
                    else {
                        callback({ "status": 0, msg: "登录成功，跳转到首页失败." });
                    }
                });
            }
        }
        else {
            callback({ "status": 0, msg: "登录失败. error:" + error });
        }
    });
}

exports.buysetupdate = function (req, res, next) {
    var setting = req.body;
    buySetting.updateEntity(setting, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ status: 500, msg: err });
        } else {
            res.json({ "status": 1, msg: "保存成功." });
        }
    })
};

exports.buysetshot = function (req, res, next) {
    var user = req.session.user;
    buySetting.getSettingByQuery({ uid: user._id, date: req.query.date }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({});
        }

        res.json(result);
    });
};

exports.buylog = function (req, res, next) {
    var user = req.session.user;
    buyRecord.getRecordByQuery({ uid: user._id, time: new RegExp(req.query.date) }, function (err, result) {
        if (err) {
            res.json({});
        }

        res.json(result);
    });
};

exports.openclose = function (req, res, next) {
    var _id = req.body.id;
    var status = req.body.status;
    buySetting.updateStatus(_id, status, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ status: 500, msg: err });
        } else {
            res.json({ "status": 1, msg: "保存成功." });
        }
    });
};

exports.servertime = function (req, res, next) {
    res.json({ diff: (+new Date() - req.query.localtime) / 1000 });
};


exports.getcurmoney = function (req, res, next) {
    var user = req.session.user;
    buySetting.getSettingByQuery({ uid: user._id, date: new Date().Format('yyyy-MM-dd') }, function (err, result) {
        res.json({ money: result == null || result.length < 1 ? 0 : result[0].money });
    });
};