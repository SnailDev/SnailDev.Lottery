var multiple = 1;
var _unit = 0.1;

var gameid = 19;
var gametype = 3007;
var betoptions = {};
var currentMoney = 0;
var previssue = '';
var curissue = '';
var numbet;
var numbets;

var steprates = [1, 1.5, 2, 4];
var step = 0;
var delaybet = true;

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

function isNumber(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
}

function starttimedtask() {
    setInterval(function () {
        getoptions(function (betoptions) {
            //console.log(betoptions);
            betoptions = betoptions;
            //betoptions.buyunit = 2;

            console.log('任务开关状态：' + (betoptions.switch == '1' ? '已开启' : '已停止'));
            if (betoptions.switch == 1) {
                var _doc = $(window.frames["mainFrame"].document);
                if (previssue != _doc.find('#lastissue').text()
                    && isNumber(_doc.find('#lastdigit10').text())
                        /*&& lotteryMoney != $('#walletamount').text()*/) {
                    previssue = _doc.find('#lastissue').text();
                    curissue = _doc.find('#curissue').text();

                    if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_19.png') > -1) {
                        console.log('彩种：北京赛车Pk10.');

                        console.log(curissue + '进行投注计划');

                        var lotteryMoney = $('#walletamount').text();
                        if (!isNaN(parseFloat(lotteryMoney))) {
                            console.log('当前可用金额为：' + lotteryMoney);

                            var kaijiang = [];
                            for (var i = 1; i < 11; i++) {
                                kaijiang.push(_doc.find('#lastdigit' + i).text());
                            }

                            if (currentMoney != 0) {
                                console.log(numbet);
                                console.log(numbets[kaijiang.indexOf(numbet)]);
                                if (numbets[kaijiang.indexOf(numbet)] != numbet) {
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
                            var needmoney = betmoney * _unit * 7;

                            if (currentMoney < needmoney) {
                                console.log('当前可用金额小于' + needmoney + '元,不再进行投注.')
                            }
                            else {
                                console.log("步骤：" + (step + 1) + ',单个位置投注金额：' + betmoney + ',总投注金额：' + needmoney.toFixed(2));
                                numbet = betoptions.num % 10 != 0 ? '0' + betoptions.num : '' + betoptions.num;

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
                                numbets = [];
                                for (var i = 1; i < 11; i++) {
                                    if (i == betoptions.loc1 ||
                                        i == betoptions.loc2 ||
                                        i == loc3) {
                                        numbets.push('');
                                    }
                                    else {
                                        numbets.push(numbet);
                                    }
                                }
                                autobuy(curissue.split(' ')[1], numbets.join(','), GenerateGuid(), betmoney);
                            }
                        }
                        else {
                            console.log('获取当前可用金额失败.')
                        }
                    }
                    else {
                        console.log('该彩种暂时不支持.');
                        return;
                    }
                }
            }
        });
    }, 10000);
}

function autobuy(period, number, tgid, unit) {
    var postdata = {
        "LotteryGameID": gameid,
        "SerialNumber": period,
        "Bets": [{
            "BetTypeCode": gametype,
            "BetTypeName": "",
            "Number": number,
            "Position": "",
            "Unit": _unit,
            "Multiple": unit * multiple,
            "ReturnRate": 0,
            "IsCompressed": false,
            "NoCommission": false
        }],
        "Schedules": [],
        "StopIfWin": false,
        "BetMode": 0,
        "Guid": tgid,
        "IsLoginByWeChat": false
    };

    $.ajax({
        type: 'POST',
        url: "/Bet/Confirm?tgid=" + tgid,
        contentType: "application/json",
        timeout: 30000,
        data: JSON.stringify(postdata),
        success: function (r_data) {
            if (r_data.ErrorMessageCode == 0) {
                console.log('下注状态：成功')
            }
            else {
                console.log('下注状态：失败，原因：' + r_data.ErrorMessage);
            }
        }
    });
}

var tabId = randomGuid() + randomGuid();
function GenerateGuid() {
    return tabId + "-" + randomGuid() + "-" + randomGuid() + "-" + randomGuid() + "-" + randomGuid() + randomGuid() + randomGuid()
}
function randomGuid() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
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

    // 开启定时任务
    starttimedtask();
});

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}