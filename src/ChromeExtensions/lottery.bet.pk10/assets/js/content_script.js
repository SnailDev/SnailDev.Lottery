var lotteryId = 4;
var betoptions = {};
var currentMoney = 0;
var previssue = '';
var curissue = '';
var ids = [];
var lines = [];

var steprates = [1, 1.5, 2, 4];
var step = 0;

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

function starttimedtask() {
    setInterval(function () {
        getoptions(function (betoptions) {
            //console.log(betoptions);
            betoptions = betoptions;
            //betoptions.buyunit = 2;

            console.log('任务开关状态：' + (betoptions.switch == '1' ? '已开启' : '已停止'));
            if (betoptions.switch == 1) {
                if (previssue != $('#prev-issue').text()) {
                    previssue = $('#prev-issue').text();
                    curissue = $('#current-issue').text();

                    console.log(curissue + '进行投注计划');

                    var lotteryMoney = $('#j-balance').text().substr(1);
                    if (parseFloat(lotteryMoney) != NaN) {
                        console.log('当前可用金额为：' + lotteryMoney);

                        if (currentMoney != 0) {
                            if (currentMoney > lotteryMoney) {
                                step = 0;
                            }
                            else {
                                step++;
                                if (step > 3) step = 0;
                                if (step == 2 && betoptions.step3 == 0) step = 0;
                                if (step == 3 && betoptions.step4 == 0) step = 0;
                            }
                        }

                        currentMoney = lotteryMoney;
                        var betmoney = Math.floor(parseInt(betoptions.buyunit) * steprates[step]);
                        var needmoney = betmoney * 7;
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

                            var loc3 = Math.floor(Math.random() * 10 + 1);
                            while (loc3 == betoptions.loc1 || loc3 == betoptions.loc2) {
                                loc3 = Math.floor(Math.random() * 10 + 1);
                            }

                            var postdata = {
                                lotteryId: lotteryId,
                                betParameters: []
                            };

                            var numbet = parseInt(betoptions.num);
                            console.log('杀掉位置：' + betoptions.loc1 + ',' + betoptions.loc2 + ',' + loc3);

                            // 可能要对ids和lines的length做验证 测试稳定性后再谈
                            for (var i = 1; i < 11; i++) {
                                if (i == betoptions.loc1 ||
                                    i == betoptions.loc2 ||
                                    i == loc3) continue;

                                // {"id":1133,"BetContext":"5","Lines":"9.85","BetType":1,"Money":"10.00","IsTeMa":false,"IsForNumber":false}
                                postdata.betParameters.push({
                                    id: ids[i - 1][numbet - 1],
                                    BetContext: '5',
                                    Lines: lines[i - 1][numbet - 1],
                                    BetType: 1,
                                    Money: betmoney.toFixed(2),
                                    IsTeMa: false,
                                    IsForNumber: false
                                });
                            }

                            // console.log(postdata);
                            $.ajax({
                                type: 'POST',
                                url: "/bet/bet",
                                contentType: "application/json",
                                timeout: 30000,
                                data: JSON.stringify(postdata),
                                success: function (r_data) {
                                    //var data1 = $.parseJSON(r_data);
                                    console.log(r_data);
                                }
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

    // 开启定时任务
    starttimedtask();
});

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}