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

var lastissue;
var nextissue;
var jihua;
var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var unitArr = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 7, 7, 7, 7];
var step = 0;

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
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
        var _doc = $(window.frames["mainFrame"].document);
        if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_1.png') == -1) {
            console.log('检测到彩种不是重庆时时彩，不做任何操作.');
            return;
        }

        if (lastissue != _doc.find('#lastissue').text() && isNumber(_doc.find('#lastdigit5').text())) {
            lastissue = _doc.find('#lastissue').text();
            nextissue = _doc.find('#curissue').text();

            console.log('当前期数：' + lastissue);

            var kaijiang = [
                Number(_doc.find('#lastdigit1').text()),
                Number(_doc.find('#lastdigit2').text()),
                Number(_doc.find('#lastdigit3').text()),
                Number(_doc.find('#lastdigit4').text()),
                Number(_doc.find('#lastdigit5').text())
            ];
            console.log('当前开奖号码：' + kaijiang.join(','));

            if (jihua) {
                console.log('本期计划为:' + jihua.join(','));
                var zhong = jihua.filter(v => kaijiang.includes(v));

                if (zhong.length == 3) {
                    console.error('中奖号为：' + zhong.join(',') + '，已中奖');
                    step = 0;
                }
                else {
                    //console.log('中奖号为：' + zhong.join(',') + '，' + (zhong.length == 3 ? '已中奖' : '未中奖'));
                    console.log('中奖号为：' + zhong.join(',') + '，未中奖');
                    step++;

                    if (step > 24) step = 0;
                }
            }

            jihua = getRandomArrayElements(nums, 3).sort();
            console.log(nextissue + '计划：' + jihua.join(','));

            var money = Number($('#walletamount').text());
            if (money > unitArr[step])
                autobuy(Number(lastissue) + 1 + '', jihua.join(''), GenerateGuid(), unitArr[step]);
            else
                console.log('当前金额小于：' + unitArr[step]);
        }
    }, 10000);
}

function autobuy(period, number, tgid, unit) {
    var postdata = {
        "LotteryGameID": 1,
        "SerialNumber": period,
        "Bets": [{
            "BetTypeCode": 103,
            "BetTypeName": "",
            "Number": number,
            "Position": "",
            "Unit": 1,
            "Multiple": unit,
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