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

var timer;
var lastissue;
var nextissue;
var jihua;
var step = 0;
var multiple = 1;
var maxMoney = 1500;
var buySwitch = false;
var isSupport = false;

var gameid, gametype;

var unitArr = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 7, 7, 7, 7];

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
    timer = setInterval(function () {
        var _doc = $(window.frames["mainFrame"].document);
        if (lastissue != _doc.find('#lastissue').text() && isNumber(_doc.find('#lastdigit5').text())) {
            lastissue = _doc.find('#lastissue').text();
            nextissue = _doc.find('#curissue').text();

            console.log('当前期数：' + lastissue);

            var touzhuNum;
            if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_1.png') > -1) {
                console.log('彩种：重庆时时彩.');

                setcqbuy();
                touzhuNum = docqbusiness(_doc);
            }
            if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_6.png') > -1) {
                console.log('彩种：蓝冠分分彩.');

                setlgffbuy();
                touzhuNum = docqbusiness(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_12.png') > -1) {
                console.log('彩种：上海11选5.');

                setsh11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_10.png') > -1) {
                console.log('彩种：广东11选5.');

                setgd11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_11.png') > -1) {
                console.log('彩种：山西11选5.');

                setsx11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_13.png') > -1) {
                console.log('彩种：山东11选5.');

                setsd11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_14.png') > -1) {
                console.log('彩种：蓝冠分分11选5.');

                setlgff11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_38.png') > -1) {
                console.log('彩种：新疆11选5.');

                setxj11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_51.png') > -1) {
                console.log('彩种：江苏11选5.');

                setjs11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_53.png') > -1) {
                console.log('彩种：辽宁11选5.');

                setln11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_54.png') > -1) {
                console.log('彩种：河北11选5.');

                sethb11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else if (_doc.find('#gameLogoImg').attr('src').indexOf('czlogo_65.png') > -1) {
                console.log('彩种：黑龙江11选5.');

                sethlj11x5buy();
                touzhuNum = do11x5business(_doc);
            }
            else {
                console.log('该彩种暂时不支持.');
                // window.clearInterval(timer);
                return;
            }

            if (buySwitch) {
                var money = Number($('#walletamount').text());
                if (money > maxMoney) {
                    console.log('当前金额大于：' + maxMoney + '，自动下注将自动关闭.');
                    buySwitch = false;
                }
                else if (money > unitArr[step]) {
                    autobuy(nextissue.split(' ')[1], touzhuNum, GenerateGuid(), unitArr[step]);
                }
                else {
                    console.log('当前金额小于：' + unitArr[step] + '，自动下注将自动关闭.');
                    buySwitch = false;
                }
            }
            else {
                console.log('自动下注已关闭，不下注');
            }
        }
    }, 10000);
}

function setcqbuy() {
    gameid = 1;
    gametype = 103;
}

function setlgffbuy() {
    gameid = 6;
    gametype = 103;
}

// 上海
function setsh11x5buy() {
    gameid = 12;
    gametype = 1049;
}

// 广东
function setgd11x5buy() {
    gameid = 10;
    gametype = 1049;
}

// 山西
function setsx11x5buy() {
    gameid = 11;
    gametype = 1049;
}

// 山东
function setsd11x5buy() {
    gameid = 13;
    gametype = 1049;
}

// 新疆
function setxj11x5buy() {
    gameid = 38;
    gametype = 1049;
}

// 江苏
function setjs11x5buy() {
    gameid = 51;
    gametype = 1049;
}

// 辽宁
function setln11x5buy() {
    gameid = 53;
    gametype = 1049;
}

// 河北
function sethb11x5buy() {
    gameid = 54;
    gametype = 1049;
}

// 黑龙江
function sethlj11x5buy() {
    gameid = 65;
    gametype = 1049;
}

// 蓝冠分分11x5
function setlgff11x5buy() {
    gameid = 14;
    gametype = 1045;
}

function docqbusiness(_doc) {
    var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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

            if (step > unitArr.length) step = 0;
        }
    }

    jihua = getRandomArrayElements(nums, 3).sort();
    console.log(nextissue + '计划：' + jihua.join(','));

    return jihua.join('');
}

function do11x5business(_doc) {
    var nums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

    var kaijiang = [
        _doc.find('#lastdigit1').text(),
        _doc.find('#lastdigit2').text(),
        _doc.find('#lastdigit3').text(),
        _doc.find('#lastdigit4').text(),
        _doc.find('#lastdigit5').text()
    ];
    console.log('当前开奖号码：' + kaijiang.join(','));

    if (jihua) {
        console.log('本期计划为:' + jihua.join(','));
        var zhong = jihua.filter(v => kaijiang.includes(v));

        if (zhong.length == 5) {
            console.error('中奖号为：' + zhong.join(',') + '，已中奖');
            step = 0;
        }
        else {
            //console.log('中奖号为：' + zhong.join(',') + '，' + (zhong.length == 3 ? '已中奖' : '未中奖'));
            console.log('中奖号为：' + zhong.join(',') + '，未中奖');
            //step++;

            if (step > unitArr.length) step = 0;
        }
    }

    jihua = getRandomArrayElements(nums, 5).sort();
    console.log(nextissue + '计划：' + jihua.join(','));

    return jihua.join(' ');
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
            "Unit": 0.1,
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

function setBuySetings(mult = 1, st = 1, maxmoney = 1500) {
    if (mult > 20) {
        console.log('设置失败，倍数不能大于20.');
        return;
    }
    if (st < 1) {
        console.log('设置失败，起始步数不能小于1.');
        return;
    }

    multiple = mult;
    step = st - 1;
    maxMoney = maxmoney;

    console.log('设置成功，倍数：' + multiple + '，起始步数：' + st + '，金额上限：' + maxMoney);
}

function startBuy() {
    buySwitch = true;
    console.log('success.');
}

function stopBuy() {
    buySwitch = false;
    console.log('success.');
}