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

function gethistroy(callback) {
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
            var trslength = trs.length > 18 ? 18 : trs.length;
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
            console.table(historys);

            if (callback) callback(historys);
        }
    });
}

function getbuyloc(betnum, callback) {
    gethistroy(function (historys) {
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
                            if (currentMoney >= parseFloat(lotteryMoney)) {
                                step = 0;

                                if (betoptions.delaybet == 1)
                                    delaybet = false;
                            }
                            else {
                                step++;
                                if (step > 3) step = 0;
                                if (step == 2 && betoptions.step3 == 0) step = 0;
                                if (step == 3 && betoptions.step4 == 0) step = 0;
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



                        var betmoney = Math.floor(parseInt(betoptions.buyunit) * steprates[step]);
                        var needmoney = selectNumAI ? betmoney * 5 : betmoney * 7;
                        console.log("步骤：" + (step + 1) + ',单个位置投注金额：' + betmoney + ',总投注金额：' + needmoney);

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
                            var numbet = parseInt(betoptions.num);
                            getbuyloc(numbet, function (reslocs) {
                                var postdata = {
                                    lotteryId: lotteryId,
                                    betParameters: []
                                };

                                if (!selectNumAI) {
                                    var loc3 = Math.floor(Math.random() * 10 + 1);
                                    while (loc3 == betoptions.loc1 || loc3 == betoptions.loc2) {
                                        loc3 = Math.floor(Math.random() * 10 + 1);
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
                                    var entropy = reslocs[reslocs.length - 1] - reslocs[reslocs.length - 2];
                                    var start = 1;
                                    var end = 10;
                                    // if (entropy > -4 && entropy < 1) {
                                    //     start = 1; end = 5;
                                    // }
                                    // else if (entropy > 0 && entropy < 5) {
                                    //     start = 6; end = 10;
                                    // } else if (entropy < -3) {
                                    //     start = 6; end = 10;
                                    // }
                                    // else {
                                    //     start = 1; end = 5;
                                    // }

                                    if (entropy < -5) {
                                        start = 6; end = 10;
                                    }
                                    else if (entropy > 5) {
                                        start = 1; end = 5;
                                    }
                                    else {
                                        console.log('未达到下注标准，不投注');
                                        return;
                                    }

                                    // 可能要对ids和lines的length做验证 测试稳定性后再谈
                                    for (var i = start; i < end + 1; i++) {
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
                            });
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