var lotteryId = 4;
var betContext = '5';
var betoptions = {};
var currentMoney = 0;
var previssue = '';
var curissue = '';
var ids = [];
var lines = [];

var steprates = [1, 1.5, 2, 4];
var step = 0;
var delaybet = true;
var selectNumAI = false;

var numbet = 1;
var start = 6;
var end = 10;

// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'assets/js/inject.js';
    //console.log(jsPath);
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

function gethistroy(count, callback) {
    ///home/History?lotteryId=4
    console.log('正在获取开奖记录...')
    $.ajax({
        type: 'GET',
        url: "/home/History?lotteryId=" + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            //console.log(r_data);
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length > count ? count : trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.期数 = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                historys.push(history);
            }

            console.log('获取成功.');
            // console.table(historys);

            if (callback) callback(historys);
        }
    });
}

function getbuyloc(betnum, callback) {
    gethistroy(18, function (historys) {
        var dataArrs = [[], [], [], [], [], [], [], [], [], []];
        // //var datalength = historys.length > 10 ? 10 : historys.length;
        // for (var i = 0; i < historys.length; i++) {
        //     for (var j = 0; j < dataArrs.length; j++) {
        //         dataArrs[j].push(historys[i]['number' + (j + 1)]);
        //     }
        // }

        // console.log(dataArrs);

        // // 出现次数统计
        // for (var i = 0; i < dataArrs.length; i++) {
        //     var tongjiObj = {};
        //     for (var j = 0; j < dataArrs[i].length; j++) {
        //         !tongjiObj[dataArrs[i][j]] ? tongjiObj[dataArrs[i][j]] = 1 : tongjiObj[dataArrs[i][j]] += 1;
        //     }

        //     console.log(Object.values(tongjiObj).sort());
        //     console.log(tongjiObj);
        // }

        // 出现位置统计
        for (var j = 0; j < dataArrs.length; j++) {
            for (var i = historys.length - 1; i > -1; i--) {
                dataArrs[j].push(Object.values(historys[i]).indexOf(j + 1));
            }
        }

        console.log(dataArrs[betnum - 1]);

        if (callback) callback(dataArrs[betnum - 1]);
    });
}

function starttimedtask() {
    setInterval(function () {
        getoptions(function (betoptions) {
            //console.log(betoptions);
            betoptions = betoptions;
            //betoptions.buyunit = 2;

            console.log('任务开关状态：' + (betoptions.switch == '1' ? '已开启' : '已停止'));
            if (betoptions.switch == 1) {
                if (previssue != $('#prev-issue').text() && $('#j-orders').text().substr(1) == '0.00') {
                    previssue = $('#prev-issue').text();
                    curissue = $('#current-issue').text();

                    console.log(curissue + '进行投注计划');

                    var lotteryMoney = $('#j-balance').text().substr(1);
                    if (parseFloat(lotteryMoney) != NaN) {
                        console.log('当前可用金额为：' + lotteryMoney);

                        if (currentMoney != 0) {
                            if (!selectNumAI) {
                                if (currentMoney >= parseFloat(lotteryMoney)) {
                                    step = 0;

                                    if (betoptions.delaybet == 1)
                                        delaybet = false;
                                }
                                else {
                                    step++;
                                    if (step >= steprates.length) step = 0;
                                    if (step == 2 && betoptions.step3 == 0) step = 0;
                                    if (step == 3 && betoptions.step4 == 0) step = 0;
                                }
                            }
                            else {
                                if (currentMoney >= parseFloat(lotteryMoney)) {
                                    step++;
                                    if (step >= steprates.length) step = 0;

                                    if (betoptions.delaybet == 1)
                                        delaybet = false;
                                }
                                else {
                                    step = 0;
                                }
                            }

                            if (betoptions.delaybet == 0)
                                delaybet = true;
                        }

                        currentMoney = parseFloat(lotteryMoney);
                        if (currentMoney <= parseFloat(betoptions.minmoney)) {
                            console.log('当前可用金额小等于' + betoptions.minmoney + '元,不再进行投注.');
                            return;
                        }
                        if (currentMoney >= parseFloat(betoptions.maxmoney)) {
                            if (betoptions.delaybet == 0) {
                                console.log('当前可用金额大等于' + betoptions.maxmoney + '元,不再进行投注.');
                                return;
                            }
                        }
                        if ((betoptions.delaybet == 1) && !delaybet) {
                            console.log('已进行过延长投注,不再进行投注.');
                            return;
                        }


                        var betmoney = Math.ceil(parseInt(betoptions.buyunit) * steprates[step]);
                        var needmoney = selectNumAI ? betmoney * 4 : betmoney * 7;

                        if (currentMoney < needmoney) {
                            console.log('当前可用金额小于' + needmoney + '元,不再进行投注.')
                        }
                        else {
                            ids = [];
                            lines = [];
                            for (var i = 3; i < 5; i++) {
                                $('#j-n' + i + ' .j-betting tbody').each(function (i, e) {
                                    var id = [];
                                    var line = [];
                                    $(e).find('tr').each(function (i, e) {
                                        if (i > 9) return true;
                                        id.push(parseInt($(e).attr('data-id')));
                                        line.push($(e).attr('data-odds'));
                                    })

                                    ids.push(id);
                                    lines.push(line);
                                });
                            }
                            // console.log(ids);
                            // console.log(lines);

                            //    gethistroy(5, function (historys) {
                            var postdata = {
                                lotteryId: lotteryId,
                                betParameters: []
                            };

                            if (!selectNumAI) {
                                console.log("步骤：" + (step + 1) + ',单个位置投注金额：' + betmoney + ',总投注金额：' + needmoney);
                                numbet = parseInt(betoptions.num);
                                // var loc3 = Number(previssue.substr(previssue.length - 1, 1)) + 1;
                                // //var loc3 = Math.floor(Math.random() * 10 + 1);
                                // while (loc3 == betoptions.loc1 || loc3 == betoptions.loc2) {
                                //     loc3 = Math.floor(Math.random() * 10 + 1);
                                //     loc3++;
                                //     loc3 = loc3 > 10 ? loc3 % 10 : loc3;
                                // }
                                var loc3;
                                var historyperiodsnum = previssue.split('');
                                for (var j = historyperiodsnum.length - 1; j > -1; j--) {
                                    loc3 = historyperiodsnum[j];
                                    if (loc3 == 0) loc3 = 10;

                                    if (loc3 != betoptions.loc1 && loc3 != betoptions.loc2) {
                                        break;
                                    }
                                }

                                console.log('杀掉位置：' + betoptions.loc1 + ',' + betoptions.loc2 + ',' + loc3 + '  压码：' + numbet);

                                // 可能要对ids和lines的length做验证 测试稳定性后再谈
                                for (var i = 1; i < 11; i++) {
                                    if (i == betoptions.loc1 ||
                                        i == betoptions.loc2 ||
                                        i == loc3) continue;

                                    // {"id":1133,"BetContext":"5","Lines":"9.85","BetType":1,"Money":"10.00","IsTeMa":false,"IsForNumber":false}
                                    postdata.betParameters.push({
                                        id: ids[i - 1][numbet - 1],
                                        BetContext: betContext,
                                        Lines: lines[i - 1][numbet - 1],
                                        BetType: 1,
                                        Money: betmoney.toFixed(2),
                                        IsTeMa: false,
                                        IsForNumber: false
                                    });
                                }
                            } else {
                                //if (step == 0) {
                                // var dataArrs = [[], []];
                                // for (var i = 0; i < historys.length; i++) {
                                //     for (var j = 1; j < 11; j++) {
                                //         if (j < 6)
                                //             dataArrs[0].push(historys[i]['number' + j]);
                                //         else
                                //             dataArrs[1].push(historys[i]['number' + j]);
                                //     }
                                // }

                                // var tongjiObjArr = [];
                                // for (var i = 0; i < dataArrs.length; i++) {
                                //     var tongjiObj = {};
                                //     for (var j = 0; j < dataArrs[i].length; j++) {
                                //         !tongjiObj[dataArrs[i][j]] ? tongjiObj[dataArrs[i][j]] = 1 : tongjiObj[dataArrs[i][j]] += 1;
                                //     }
                                //     tongjiObjArr.push(tongjiObj);
                                // }

                                // console.log(tongjiObjArr);

                                // var count = 0;
                                // for (var i = 0; i < tongjiObjArr.length; i++) {
                                //     var tempArr = Object.values(tongjiObjArr[i]);
                                //     if (tempArr.slice(0).sort()[tempArr.length - 1] > count) {
                                //         count = tempArr.slice(0).sort()[tempArr.length - 1];
                                //         var tempIndex = tempArr.indexOf(count);
                                //         numbet = Object.keys(tongjiObjArr[i])[tempIndex];

                                //         // 排除变态码
                                //         while (tongjiObjArr[i][numbet] && tongjiObjArr[i][numbet] >= count) {
                                //             numbet++;
                                //             if (numbet > 10) numbet = numbet % 10;
                                //         }

                                //         if (i > 0) {
                                //             start = 1;
                                //             end = 5;
                                //         }
                                //         else {
                                //             start = 6;
                                //             end = 10;
                                //         }
                                //     }
                                // }
                                var history = {};
                                $('#prev-bs i').each(function (index, numberItem) {
                                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                                });

                                var _locs = [1, 10];
                                //console.log(history);
                                numbet = history.number1 + history.number10;
                                if (numbet > 10) numbet = numbet % 10;

                                if (_locs.indexOf(numbet) == -1)
                                    _locs.push(numbet);

                                var _curloc = Object.values(history).indexOf(numbet) + 1;
                                if (_locs.indexOf(_curloc) == -1)
                                    _locs.push(_curloc);

                                betmoney = Math.ceil(betmoney * 4 / _locs.length);
                                console.log("步骤：" + (step + 1) + ',单个位置投注金额：' + betmoney + ',总投注金额：' + (betmoney * _locs.length));
                                // if (numbet < 6) {
                                //     start = 1;
                                //     end = 5;
                                // }
                                // else {
                                //     start = 6;
                                //     end = 10;
                                // }
                                //}
                                _locs.sort(function (a, b) { return a - b });
                                console.log(numbet + ';[' + _locs.join(',') + ']');

                                // 可能要对ids和lines的length做验证 测试稳定性后再谈
                                // for (var i = start; i < end + 1; i++) {
                                for (var i = 0; i < _locs.length; i++) {
                                    // {"id":1133,"BetContext":"5","Lines":"9.85","BetType":1,"Money":"10.00","IsTeMa":false,"IsForNumber":false}
                                    postdata.betParameters.push({
                                        id: ids[_locs[i] - 1][numbet - 1],
                                        BetContext: betContext,
                                        Lines: lines[_locs[i] - 1][numbet - 1],
                                        BetType: 1,
                                        Money: betmoney.toFixed(2),
                                        IsTeMa: false,
                                        IsForNumber: false
                                    });
                                }
                            }
                            // console.log(postdata);
                            $.ajax({
                                type: 'POST',
                                url: "/bet/bet",
                                contentType: "application/json",
                                timeout: 30000,
                                data: JSON.stringify(postdata),
                                success: function (r_data) {
                                    if (r_data.result == 1) {
                                        console.log('下注状态：成功')
                                    }
                                    else {
                                        console.log('下注状态：失败，原因：' + r_data.msg);
                                    }
                                }
                            });
                            //  });
                        }
                    }
                    else {
                        console.log('获取当前可用金额失败.')
                    }
                }
            }
        });
    }, 10000);
}

function getoptions(callback) {
    chrome.runtime.sendMessage({ cmd: 'getoptions' }, function (response) {
        callback(response);
    });
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    console.log('注入成功.');
    // // 注入自定义JS(暂时不用)
    // injectCustomJs();

    // // 获取历史开奖
    // gethistroy();

    // // 获取下注位置
    // getbuyloc(1);

    // 开启定时任务
    starttimedtask();
});

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}

function tj(date) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);

            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);
            var dataArrs = [[], [], [], [], [], [], [], [], [], []];
            // 出现位置统计
            for (var j = 0; j < dataArrs.length; j++) {
                for (var i = historys.length - 1; i > -1; i--) {
                    dataArrs[j].push(Object.values(historys[i]).indexOf(j + 1));
                }
            }

            var tongjiObjArr = [];
            for (var i = 0; i < dataArrs.length; i++) {
                var tongjiObj = {};
                for (var j = 0; j < dataArrs[i].length; j++) {
                    !tongjiObj[dataArrs[i][j]] ? tongjiObj[dataArrs[i][j]] = 1 : tongjiObj[dataArrs[i][j]] += 1;
                }
                tongjiObjArr.push(tongjiObj);
            }

            var resObjArr = [];
            for (var i = 0; i < 10; i++) {
                var resObj = { 数字: (i + 1) };
                if (i % 2 == 0) {
                    resObj.前 = tongjiObjArr[i]['' + (i + 1)];
                    resObj.后 = tongjiObjArr[i + 1]['' + (i + 1)];
                } else {
                    resObj.前 = tongjiObjArr[i - 1]['' + (i + 1)];
                    resObj.后 = tongjiObjArr[i]['' + (i + 1)];
                }
                resObjArr.push(resObj);
            }

            console.table(resObjArr);
        }
    });
}

function tjAI(date, firststep, laststep) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);

            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            var start;
            var end;

            var numbet = historys[historys.length - 1].number1 + historys[historys.length - 1].number10;
            if (numbet > 10) numbet = numbet % 10;

            if (numbet < 6) {
                start = 1;
                end = 5;
            }
            else {
                start = 6;
                end = 10;
            }

            var outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 0 };
            var outtimesArr = [];
            for (var i = historys.length - 2; i > -1; i--) {
                if (outtimes.times == 0) {
                    outtimes.starttime = historys[i].time;
                    outtimes.period = historys[i].periods
                }

                if (Object.values(historys[i]).indexOf(numbet) >= start && Object.values(historys[i]).indexOf(numbet) <= end) {
                    numbet = historys[i].number1 + historys[i].number10;
                    if (numbet > 10) numbet = numbet % 10;

                    if (numbet < 6) {
                        start = 1;
                        end = 5;
                    }
                    else {
                        start = 6;
                        end = 10;
                    }

                    outtimesArr.push(outtimes);
                    outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 0 };
                }
                else {

                    outtimes.times++;

                    // if (outtimes.times == 4) {
                    //     //     numbet = historys[i].number1 + historys[i].number10;
                    //     //     if (numbet > 10) numbet = numbet % 10;

                    //     if (numbet > 5) {
                    //         start = 1;
                    //         end = 5;
                    //     }
                    //     else {
                    //         start = 6;
                    //         end = 10;
                    //     }

                    //     //     outtimesArr.push(outtimes);
                    //     //     outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 1 };
                    // }
                }
            }

            outtimesArr.sort(function (a, b) { return a.period - b.period });
            console.log(outtimesArr);

            var failtimes = 0;
            for (var j = 0; j < outtimesArr.length - 1; j++) {
                if (outtimesArr[j].times > firststep && outtimesArr[j + 1].times > laststep) {
                    failtimes++;
                }
            }
            if (failtimes > 0) {
                console.log('验证不通过.次数：' + failtimes);
            } else {
                console.log('验证通过.');
            }


            console.log('结束.')

            // console.log('最大连续不中次数：' + outtimesArr[outtimesArr.length - 1].times);
            // console.log('最大连续不中开始期号：' + outtimesArr[outtimesArr.length - 1].period);
            // console.log('最大连续不中开始时间：' + outtimesArr[outtimesArr.length - 1].starttime);
            // console.log('最大连续不中购买情况：' + outtimesArr[outtimesArr.length - 1].numbet + ':' + outtimesArr[outtimesArr.length - 1].start + ':' + outtimesArr[outtimesArr.length - 1].end);
        }
    });
}

function tjAIFL(date, loc, numbets, callback) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);

            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            var outtimes = { times: 0 };
            var outtimesArr = [];
            for (var i = historys.length - 2; i > -1; i--) {
                if (outtimes.times == 0) {
                    outtimes.starttime = historys[i].time;
                    outtimes.period = historys[i].periods
                }

                if (numbets.indexOf(Object.values(historys[i])[loc]) > -1) {
                    outtimesArr.push(outtimes);
                    outtimes = { times: 0 };
                }
                else {
                    outtimes.times++;
                }
            }

            console.log(outtimesArr);
            outtimesArr.sort(function (a, b) { return a.times - b.times });

            // console.log('最大连续不中次数：' + outtimesArr[outtimesArr.length - 1].times);
            // console.log('最大连续不中开始期号：' + outtimesArr[outtimesArr.length - 1].period);
            // console.log('最大连续不中开始时间：' + outtimesArr[outtimesArr.length - 1].starttime);
            if (callback) callback(outtimesArr[outtimesArr.length - 1].times);

            // console.log('结束.');
        }
    });
}

function tjAISW(date, nolocs) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);

            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            var numbet = historys[historys.length - 1].number1 + historys[historys.length - 1].number10;
            if (numbet > 10) numbet = numbet % 10;


            var outtimes = { numbet: numbet, times: 0, type: 0 };
            var outtimesArr = [];
            for (var i = historys.length - 2; i > -1; i--) {


                if (outtimes.times == 0) {
                    outtimes.starttime = historys[i].time;
                    outtimes.period = historys[i].periods
                }

                if (locs.indexOf(Object.values(historys[i]).indexOf(numbet)) > -1) {
                    outtimesArr.push(outtimes);
                    outtimes = { numbet: numbet, times: 0, type: 0 };
                }
                else {
                    outtimes.times++;
                }
            }

            console.log(outtimesArr);
            outtimesArr.sort(function (a, b) { return a.times - b.times });

            console.log('最大连续不中次数：' + outtimesArr[outtimesArr.length - 1].times);
            console.log('最大连续不中开始期号：' + outtimesArr[outtimesArr.length - 1].period);
            console.log('最大连续不中开始时间：' + outtimesArr[outtimesArr.length - 1].starttime);



            console.log('结束.');
        }
    });
}

function tjAINoWait(date, firststep) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);

            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            var start;
            var end;

            var numbet = historys[historys.length - 1].number1 + historys[historys.length - 1].number10;
            if (numbet > 10) numbet = numbet % 10;

            if (numbet < 6) {
                start = 1;
                end = 5;
            }
            else {
                start = 6;
                end = 10;
            }

            var outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 0 };
            var outtimesArr = [];
            for (var i = historys.length - 2; i > -1; i--) {
                if (outtimes.times == 0) {
                    outtimes.starttime = historys[i].time;
                    outtimes.period = historys[i].periods
                }

                if (Object.values(historys[i]).indexOf(numbet) >= start && Object.values(historys[i]).indexOf(numbet) <= end) {
                    numbet = historys[i].number1 + historys[i].number10;
                    if (numbet > 10) numbet = numbet % 10;

                    if (numbet < 6) {
                        start = 1;
                        end = 5;
                    }
                    else {
                        start = 6;
                        end = 10;
                    }

                    outtimesArr.push(outtimes);
                    outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 0 };
                }
                else {

                    outtimes.times++;

                    if (outtimes.times == firststep) {
                        numbet = historys[i].number1 + historys[i].number10;
                        if (numbet > 10) numbet = numbet % 10;

                        if (numbet > 5) {
                            start = 1;
                            end = 5;
                        }
                        else {
                            start = 6;
                            end = 10;
                        }

                        outtimesArr.push(outtimes);
                        outtimes = { numbet: numbet, start: start, end: end, times: 0, type: 1 };
                    }
                }
            }

            outtimesArr.sort(function (a, b) { return a.period - b.period });
            console.log(outtimesArr);

            var failtimes = 0;
            for (var j = 0; j < outtimesArr.length - 1; j++) {
                if (outtimesArr[j].times == firststep && outtimesArr[j + 1].times == firststep) {
                    failtimes++;
                }
            }
            if (failtimes > 0) {
                console.log('验证不通过.次数：' + failtimes);
            } else {
                console.log('验证通过.');
            }


            console.log('结束.')
        }
    });
}

function tjAISpec(date) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);
            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            if (historys.length < 5) {
                console.log('样本数小于5，无法统计.');
                return;
            }
            for (var k = historys.length - 5; k > 0; k--) {
                var locs;
                var numbet;
                var dataArrs = [[], []];

                for (var i = 0; i < 5; i++) {
                    for (var j = 1; j < 11; j++) {
                        if (j < 6)
                            dataArrs[0].push(historys[k + i]['number' + j]);
                        else
                            dataArrs[1].push(historys[k + i]['number' + j]);
                    }
                }

                var tongjiObjArr = [];
                for (var i = 0; i < dataArrs.length; i++) {
                    var tongjiObj = {};
                    for (var j = 0; j < dataArrs[i].length; j++) {
                        !tongjiObj[dataArrs[i][j]] ? tongjiObj[dataArrs[i][j]] = 1 : tongjiObj[dataArrs[i][j]] += 1;
                    }
                    tongjiObjArr.push(tongjiObj);
                }

                console.log(tongjiObjArr);

                var count = 0;
                for (var i = 0; i < tongjiObjArr.length; i++) {
                    var tempArr = Object.values(tongjiObjArr[i]);
                    if (tempArr.slice(0).sort()[tempArr.length - 1] > count) {
                        count = tempArr.slice(0).sort()[tempArr.length - 1];
                        var tempIndex = tempArr.indexOf(count);
                        numbet = Number(Object.keys(tongjiObjArr[i])[tempIndex]);

                        // // 排除变态码
                        // while (tongjiObjArr[i][numbet] && tongjiObjArr[i][numbet] >= count) {
                        //     numbet++;
                        //     if (numbet > 10) numbet = numbet % 10;
                        // }

                        if (i > 0) {
                            locs = [1, 2, 3, 7, 8, 9, 10];
                        }
                        else {
                            locs = [1, 2, 3, 4, 8, 9, 10]
                        }
                    }
                }

                if (locs.indexOf(Object.values(historys[k - 1]).indexOf(numbet)) > -1) {
                    console.error(historys[k - 1].periods + ':' + numbet + ':' + start + ':' + end + ':' + '中中中');
                }
                else {
                    console.warn(historys[k - 1].periods + ':' + numbet + ':' + start + ':' + end + ':' + '否否否');
                }
            }


            console.log('结束.')
        }
    });
}

function tjAISpecJG(date, numbet) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            //console.table(historys);
            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            if (historys.length < 5) {
                console.log('样本数小于5，无法统计.');
                return;
            }
            for (var k = historys.length - 10; k > 0; k--) {
                var dataArrs = [[], [], [], [], [], [], [], [], [], []];

                for (var i = 0; i < 10; i++) {
                    for (var j = 1; j < 11; j++) {
                        dataArrs[j - 1].push(historys[k + i]['number' + j]);
                    }
                }

                var tongjiObjArr = [];
                for (var i = 1; i < 11; i++) {
                    var tongjiObj = {};
                    for (var j = 0; j < 10; j++) {
                        tongjiObj[j + 1] = dataArrs[j].indexOf(i);

                        if (tongjiObj[j + 1] == -1) tongjiObj[j + 1] = 10;
                    }
                    tongjiObjArr.push(tongjiObj);
                }

                //console.table(tongjiObjArr);
                var jgs = Object.values(tongjiObjArr[numbet - 1]);
                var jgstemp = jgs.slice(0).sort(function (a, b) { return a - b; });
                var locs = [];
                for (var i = 0; i < jgstemp.length - 3; i++) {
                    locs.push(Number(Object.keys(tongjiObjArr[numbet - 1])[jgs.indexOf(jgstemp[i])]));
                }

                //console.log(locs);

                if (locs.indexOf(Object.values(historys[k - 1]).indexOf(numbet)) > -1) {
                    console.error(historys[k - 1].periods + ':' + numbet + ':' + locs.join('^') + ':' + '中中中');
                }
                else {
                    console.warn(historys[k - 1].periods + ':' + numbet + ':' + locs.join('^') + ':' + '否否否');
                }
            }

            console.log('结束.')
        }
    });
}

function openAI(s) {
    selectNumAI = true;
    steprates = s;
    console.log('AI开启成功.');
}

function getNumbets(date, callback) {
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            var tongjiArr = [];
            var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            for (var k = 0; k < nums.length; k++) {
                var outtimes = { num: nums[k], times: 0 };
                var outtimesArr = [];
                for (var i = historys.length - 2; i > -1; i--) {
                    if (outtimes.times == 0) {
                        outtimes.starttime = historys[i].time;
                        outtimes.period = historys[i].periods
                    }

                    if (nums[k] == Object.values(historys[i])[1]) {
                        outtimesArr.push(outtimes);
                        outtimes = { num: nums[k], times: 0 };
                    }
                    else {
                        outtimes.times++;
                    }
                }

                outtimesArr.sort(function (a, b) { return a.times - b.times });
                //console.log(outtimesArr);
                tongjiArr.push(outtimesArr[outtimesArr.length - 1]);
            }

            tongjiArr.sort(function (a, b) { return a.times - b.times });
            //console.log(tongjiArr);

            if (callback) callback([tongjiArr[tongjiArr.length - 1].num, tongjiArr[tongjiArr.length - 2].num, tongjiArr[tongjiArr.length - 3].num, tongjiArr[tongjiArr.length - 4].num]);
        }
    });
}

function tjTB(date) {
    var lastdate = new Date(date);//获取当前时间  
    lastdate.setDate(lastdate.getDate() - 1);//设置天数 -1 天  
    var time = lastdate.Format("yyyy-MM-dd");
    //console.log(time);
    getNumbets(time, function (numbets) {
        console.log(numbets);
        //console.log(date);
        tjAIFL(date, 1, numbets, function (data) {
            console.log(data);
        });
    });
}


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function tjqs(date) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = Number(that.find('.td-hd').text());

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);

            var start;
            var end;
            var numbet = 0;

            var numbetobj = getnumbet(historys[historys.length - 1], historys[historys.length - 2]);

            if (numbetobj.jg < 2) {
                numbet = numbetobj.num;
                var numbetindex = getnumbetindex(historys[historys.length - 2], numbet);

                if (numbetindex < 6) {
                    start = 1;
                    end = 5;
                }
                else {
                    start = 6;
                    end = 10;
                }
            }

            var outtimes = { times: 0 };
            var outtimesArr = [];
            for (var i = historys.length - 2; i > -1; i--) {
                if (numbet > 0) {
                    if (outtimes.times == 0) {
                        outtimes.starttime = historys[i].time;
                        outtimes.period = historys[i].periods
                    }

                    if (Object.values(historys[i]).indexOf(numbet) >= start && Object.values(historys[i]).indexOf(numbet) <= end) {
                        numbet = 0;
                        outtimesArr.push(outtimes);
                        outtimes = { times: 0 };
                    }
                    else {
                        outtimes.times++;
                    }
                }

                if (numbet == 0) {
                    var numbetobj = getnumbet(historys[historys.length - 1], historys[historys.length - 2]);
                    if (numbetobj.jg < 2) {
                        numbet = numbetobj.num;
                        var numbetindex = getnumbetindex(historys[historys.length - 2], numbet);

                        if (numbetindex < 6) {
                            start = 1;
                            end = 5;
                        }
                        else {
                            start = 6;
                            end = 10;
                        }
                    }
                }
            }

            outtimesArr.sort(function (a, b) { return a.times - b.times });
            console.log(outtimesArr);

            console.log('最大连续不中次数：' + outtimesArr[outtimesArr.length - 1].times);
            console.log('最大连续不中开始期号：' + outtimesArr[outtimesArr.length - 1].period);
            console.log('最大连续不中开始时间：' + outtimesArr[outtimesArr.length - 1].starttime);
            console.log('最大连续不中购买情况：' + outtimesArr[outtimesArr.length - 1].numbet + ':' + outtimesArr[outtimesArr.length - 1].start + ':' + outtimesArr[outtimesArr.length - 1].end);
        }
    });
}

function getnumbet(predata, curdata) {
    var predatavalues = Object.values(predata);
    var curdatavalues = Object.values(curdata);

    var objArr = [];
    for (var i = 1; i < 11; i++) {
        objArr.push({
            num: predatavalues[i],
            jg: Math.abs(curdatavalues.indexOf(predatavalues[i]) - i)
        });
    }

    objArr.sort(function (a, b) { return a.jg - b.jg });

    return objArr[0];
}

function getnumbetindex(curdata, numbet) {
    return Object.values(curdata).indexOf(numbet);
}

function tj7ball(date, ball, locs) {
    if (date.length != 10) { console.log('日期格式有误.'); return; }
    console.log('正在获取' + date + '开奖记录...')
    $.ajax({
        type: 'GET',
        url: '/home/History?' + 'v=' + (+new Date()) + '&date=' + date + '&lotteryId=' + lotteryId,
        timeout: 30000,
        success: function (r_data) {
            var historys = [];
            var trs = $(r_data).find('#history_detail tbody tr');
            var trslength = trs.length;
            for (var i = 0; i < trslength; i++) {
                var that = $(trs[i]);
                var history = {};

                history.periods = that.find('.td-hd').text();

                that.find('span').each(function (index, numberItem) {
                    history['number' + (index + 1)] = Number($(this).attr('class').replace('icon bj', ''));
                });

                history.time = that.find('td').eq(1).text().replace('\r\n', '').trim();

                historys.push(history);
            }

            console.log('获取成功.');
            console.log('统计样本：' + historys.length + '\r\n当前开奖期号：' + historys[0].periods);


            var value = 0;
            for (var i = historys.length - 1; i > 0; i--) {
                var historyperiodsnum = historys[i].periods.split('').map(function (data) {
                    return +data;
                });

                var lastloc;
                for (var j = historyperiodsnum.length - 1; j > -1; j--) {
                    if (locs.indexOf(historyperiodsnum[j]) == -1) {
                        lastloc = historyperiodsnum[j];
                        if (lastloc == 0) lastloc = 10;
                        break;
                    }
                }

                var buyloc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(v => !locs.includes(v));
                buyloc = buyloc.filter(v => v != lastloc);

                if (buyloc.indexOf(Object.values(historys[i - 1]).indexOf(ball)) > -1) {
                    value = value + 0.5;
                    console.error('期号：' + historys[i - 1].periods + '，购买位置：' + buyloc.join(',') + '，已中奖，值：' + value);
                }
                else {
                    value = value % 1 == 0 ? value - 1 : value - 1.5;
                    console.log('期号：' + historys[i - 1].periods + '，购买位置：' + buyloc.join(',') + '，未中奖，值：' + value);
                }
            }
        }
    });
}