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



var ijcurrentissue;
var issueshtml = "";
var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

var currentjihua = '无';
var currentjihua1 = "无";
var currentjihua2 = "无";

var touzhuhao = [];
var touzhuhao1 = [];
var touzhuhao2 = [];

function initCustomEventListen() {
    var hiddenDiv = document.getElementById('myCustomEventDiv');
    if (!hiddenDiv) {
        hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        hiddenDiv.id = 'myCustomEventDiv';
        document.body.appendChild(hiddenDiv);
    }
    hiddenDiv.addEventListener('myCustomEvent', function () {
        var eventData = document.getElementById('myCustomEventDiv').innerText;

        var currentmoney = $("#cpmoney").html();
        var caizhongInfo = `<div class='info'>彩种信息：${$(window.frames["main"].document).find(".GameIssue h1").html()}</div>`;
        var hongbaoInfo = `<div class='info'>红包信息：${eventData}</div>`;

        var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
        var ijissue = ijcurrentli.find('.HistoryIssues').text().split('-')[1];
        var nextissue = $(window.frames["main"].document).find("#current_issue").text();//.split('-')[1];

        if (ijcurrentissue != ijissue) {
            ijcurrentissue = ijissue;

<<<<<<< HEAD
            issueshtml = $(window.frames["main"].document).find(".WinnerNumList").html(); // 目前只针对5期
            if (caizhongInfo.indexOf("11选5") > -1) {
                var issuesObj = $(issueshtml);
                for (var i = 0; i < 5; i++) {
                    var liObj = issuesObj.find('li').eq(i);
                    var historyIssues = liObj.find('.HistoryIssues').text();
                    var historyNum = liObj.find('.HistoryNum').text().match(/.{2}/g);

                    liObj.find('.HistoryIssues').html(historyIssues.split('-')[1]);
                    liObj.find('.HistoryNum').html('<i>01</i><i>02</i><i>03</i><i>04</i><i>05</i><i>06</i><i>07</i><i>08</i><i>09</i><i>10</i><i>11</i></span>');

                    liObj.find('.HistoryNum i').each(function (i, e) {
                        if (historyNum.indexOf($(e).text()) > -1) {
                            $(e).addClass('star');
                        }
                    });
                }
                issueshtml = issuesObj.prop('outerHTML');

                var loghtml = '';
                if (currentjihua != "无") {
                    var jihuahao = currentjihua.split(',');
                    var kaijianghao = ijcurrentli.find('.HistoryNum').text().match(/.{2}/g);
                    var zhongjianghao = jihuahao.filter(v => kaijianghao.includes(v));

                    loghtml += `<a href="javascript:void(0);" title="计划号：${currentjihua} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案0--->选${jihuahao.length}中${zhongjianghao.length} </a>   `;
                }
                if (currentjihua1 != "无") {
                    var jihuahao1 = currentjihua1.split(',');
                    var kaijianghao = ijcurrentli.find('.HistoryNum').text().match(/.{2}/g);
                    var zhongjianghao = jihuahao1.filter(v => kaijianghao.includes(v));

                    loghtml += `<a href="javascript:void(0);" title="计划号：${currentjihua1} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案1--->选${jihuahao1.length}中${zhongjianghao.length} </a>`;
                }
                if (currentjihua2 != "无") {
                    var jihuahao2 = currentjihua2.split(',');
                    var kaijianghao = ijcurrentli.find('.HistoryNum').text().match(/.{2}/g);
                    var zhongjianghao = jihuahao2.filter(v => kaijianghao.includes(v));

                    loghtml += `<a href="javascript:void(0);" title="计划号：${currentjihua2} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案2--->选${jihuahao2.length}中${zhongjianghao.length} </a>`;
                }

                if (loghtml != '') log(`<div class='info'>${ijissue}：${loghtml}</div>`);

                var rehao = unique(sscanlaysisre(caizhongInfo).sort());
                var lenghao = unique(sscanlaysisleng(caizhongInfo).sort());
                var touzhuhao = rehao;
                var touzhuhao1 = rehao.filter(v => !lenghao.includes(v));
                var touzhuhao2 = unique($.merge(unique(sscanlaysisre(caizhongInfo)), unique(sscanlaysisleng(caizhongInfo))).sort());

                currentjihua = touzhuhao.length > 0 ? touzhuhao.join(',') : "无";
                currentjihua1 = touzhuhao1.length > 0 ? touzhuhao1.join(',') : "无";
                currentjihua2 = touzhuhao2.length > 0 ? touzhuhao2.join(',') : "无";
            }

            // if (parseFloat(currentmoney) > 1) {
            //     autobuy(nextissue, touzhuhao.sort());
            // }
=======
            issueshtml = parseHtml(caizhongInfo);

            var loghtml = generatejihualog(caizhongInfo);
            if (loghtml != '') log(`<div class='info'>${ijissue}：${loghtml}</div>`);


            generatejihua(caizhongInfo);


            if (parseFloat(currentmoney) > 8) {
                var buynums = [];
                buynums.push(touzhuhao);
                buynums.push(touzhuhao1);
                buynums.push(touzhuhao2);
                

                //autobuy(nextissue, buynums);
            }
>>>>>>> edf6e6fe683ca9163bfc29a6b9c95c48c9495b40
        }


        var kaijiangInfo = `<div class='WinnerNumList'>${issueshtml}</div>`;
        var jihuaInfo = `<div class='info'>本期计划0：${currentjihua}</div><div class='info'>本期计划1：${currentjihua1}</div><div class='info'>本期计划2：${currentjihua2}</div>`;

        tip(caizhongInfo + hongbaoInfo + jihuaInfo + kaijiangInfo);

        if (hongbaoInfo.indexOf('本次发现红包') > -1) sendMessageToBackground('友情提示', '发现红包，正在准备抢红包');
    });
}

function parseHtml(caizhongInfo) {
    var res = $(window.frames["main"].document).find(".WinnerNumList").html(); // 目前只针对5期
    if (caizhongInfo.indexOf("时彩") > -1 || caizhongInfo.indexOf("分彩") > -1) {

    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        var issuesObj = $(res);
        for (var i = 0; i < 5; i++) {
            var liObj = issuesObj.find('li').eq(i);
            var historyIssues = liObj.find('.HistoryIssues').text();
            var historyNum = liObj.find('.HistoryNum').text().match(/.{2}/g);

            liObj.find('.HistoryIssues').html(historyIssues.split('-')[1]);
            liObj.find('.HistoryNum').html('<i>01</i><i>02</i><i>03</i><i>04</i><i>05</i><i>06</i><i>07</i><i>08</i><i>09</i><i>10</i><i>11</i></span>');

            liObj.find('.HistoryNum i').each(function (i, e) {
                if (historyNum.indexOf($(e).text()) > -1) {
                    $(e).addClass('star');
                }
            });
        }
        res = issuesObj.prop('outerHTML');
    }

    return res;
}

function generatejihua(caizhongInfo) {
    if (caizhongInfo.indexOf("时彩") > -1 || caizhongInfo.indexOf("分彩") > -1) {
        var liObj = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
        var historyNum = liObj.find('.HistoryNum i').text();

        touzhuhao = unique(historyNum.substring(2, 5).split(''));
        touzhuhao1 = sscanlaysisre(caizhongInfo);
    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        var rehao = unique(sscanlaysisre(caizhongInfo).sort());
        var lenghao = unique(sscanlaysisleng(caizhongInfo).sort());

        touzhuhao = rehao;
        touzhuhao1 = rehao.filter(v => !lenghao.includes(v));
        var nums = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
        var lenghao1 = getRandomArrayElements(unique(sscanlaysisleng(caizhongInfo)), 1);
        touzhuhao2 = numbers(5);//nums.filter(v => !lenghao1.includes(v));//unique($.merge(unique(sscanlaysisre(caizhongInfo)), unique(sscanlaysisleng(caizhongInfo))).sort());
    }

    currentjihua = touzhuhao.length > 0 ? touzhuhao.join(',') : "无";
    currentjihua1 = touzhuhao1.length > 0 ? touzhuhao1.join(',') : "无";
    currentjihua2 = touzhuhao2.length > 0 ? touzhuhao2.join(',') : "无";
}

function generatejihualog(caizhongInfo) {
    var res = "";

    var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
    var kaijianghao = [];
    if (caizhongInfo.indexOf("时彩") > -1 || caizhongInfo.indexOf("分彩") > -1) {
        kaijianghao = ijcurrentli.find('.HistoryNum').text().substring(2, 5).split('');
    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        kaijianghao = ijcurrentli.find('.HistoryNum').text().match(/.{2}/g);
    }

    if (currentjihua != "无") {
        var jihuahao = currentjihua.split(',');
        var zhongjianghao = jihuahao.filter(v => kaijianghao.includes(v));

        res += `<a href="javascript:void(0);" title="计划号：${currentjihua} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案0--->选${jihuahao.length}中${zhongjianghao.length} </a>   `;
    }
    if (currentjihua1 != "无") {
        var jihuahao1 = currentjihua1.split(',');
        var zhongjianghao = jihuahao1.filter(v => kaijianghao.includes(v));

        res += `<a href="javascript:void(0);" title="计划号：${currentjihua1} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案1--->选${jihuahao1.length}中${zhongjianghao.length} </a>`;
    }
    if (currentjihua2 != "无") {
        var jihuahao2 = currentjihua2.split(',');
        var zhongjianghao = jihuahao2.filter(v => kaijianghao.includes(v));

        res += `<a href="javascript:void(0);" title="计划号：${currentjihua2} 开奖号：${kaijianghao.join(',')} 中奖号：${zhongjianghao.join(',')}">方案2--->选${jihuahao2.length}中${zhongjianghao.length} </a>`;
    }
    return res;
}

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}

function unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}

function autobuy(period, nums) {
    //var data1 = "lotteryid=1&curmid=50&flag=save&poschoose=&lt_project_modes=3&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A14%2C'codes'%3A'" +/*0%261%262%263%264%265%266*/nums.join('%26') + "'%2C'nums'%3A35%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A0.7%2C'mode'%3A3%2C'desc'%3A'%5B%E5%90%8E%E4%B8%89%E7%A0%81_%E7%BB%84%E5%85%AD%5D+" +/*0%2C1%2C2%2C3%2C4%2C5%2C6*/nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=35&lt_total_money=0.7&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3483%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A1%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A0.2%2C'mode'%3A2%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E5%85%AB%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=1&lt_total_money=0.2&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A252%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A5.04%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=252&lt_total_money=5.04&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=126&lt_total_money=2.52&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[0].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[0].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[1].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[1].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[2].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[2].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=378&lt_total_money=7.56&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";

    window.postMessage({ cmd: 'autobuy', data: data }, '*');
}

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


// 简单的消息通知
function tip(info) {
    info = info || '';

    var tipDiv = document.getElementById('tipDiv');
    if (!tipDiv) {
        tipDiv = document.createElement('div');
        tipDiv.id = 'tipDiv';
        tipDiv.className = 'chrome-plugin-simple-tip';
        tipDiv.style.top = 150 + 'px';
        document.body.appendChild(tipDiv);
    }

    $('#tipDiv').html(info);
}




// 简单的日志
function log(info) {
    info = info || '';

    var logDiv = document.getElementById('logDiv');
    if (!logDiv) {
        logDiv = document.createElement('div');
        logDiv.id = 'logDiv';
        logDiv.className = 'chrome-plugin-simple-log';
        logDiv.style.top = 150 + 'px';//200 + 250 + 'px';
        logDiv.style.maxHeight = 250 + 'px';
        document.body.appendChild(logDiv);

        $('#logDiv').css('overflow', 'auto');
    }

    $('#logDiv').append(info);
}

function sscanlaysisre(caizhongInfo) {
    var res = [];
    if (caizhongInfo.indexOf("时彩") > -1 || caizhongInfo.indexOf("分彩") > -1) {
        var info = $(issueshtml).find('i.star').text().split('').reduce((p, k) => (p[k]++ || (p[k] = 1), p), {});
        var max = 0;
        for (var key in info) {
            if (max < info[key]) {
                max = info[key]; //max始终储存次数最大的那个
            }
        }

        for (var key in info) {
            if (info[key] == max) {
                res.push(key);
            }
        }
    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        var lastNums = $(issueshtml).find('li').eq(0).find('i.star').text().match(/.{2}/g);
        var lastlastNums = $(issueshtml).find('li').eq(1).find('i.star').text().match(/.{2}/g);
        for (var i = 0; i < lastNums.length; i++) {
            for (var j = 0; j < lastlastNums.length; j++) {
                var result = parseInt(lastNums[i]) - parseInt(lastlastNums[j]);
                if (result < 2 && result > -2) {
                    var yucehao = parseInt(lastNums[i]) + result;
                    if (yucehao < 12 && yucehao > 0)
                        res.push(Nums11x5Handle(yucehao));
                }
            }
        }
    }

    return res;
}

function sscanlaysisleng(caizhongInfo) {
    var res = [];
    if (caizhongInfo.indexOf("11选5") > -1) {
        var nums = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
        var lastNums = nums.filter(v => !$(issueshtml).find('li').eq(0).find('i.star').text().match(/.{2}/g).includes(v));
        var lastlastNums = nums.filter(v => !$(issueshtml).find('li').eq(1).find('i.star').text().match(/.{2}/g).includes(v));
        var lastlastlastNums = nums.filter(v => !$(issueshtml).find('li').eq(2).find('i.star').text().match(/.{2}/g).includes(v));

        for (var i = 0; i < lastNums.length; i++) {
            for (var j = 0; j < lastlastNums.length; j++) {
                for (var k = 0; k < lastlastlastNums.length; k++) {
                    var result = parseInt(lastNums[i]) - parseInt(lastlastNums[j]);
                    var result1 = parseInt(lastlastNums[j]) - parseInt(lastlastlastNums[k]);
                    if (result < 2 && result > -2 && result1 < 2 && result1 > -2) {
                        var yucehao = parseInt(lastNums[i]) + result;
                        if (yucehao < 12 && yucehao > 0)
                            res.push(Nums11x5Handle(yucehao));
                    }
                }
            }
        }
    }

    return res;
}

function Nums11x5Handle(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num + '';
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    initCustomEventListen();
});

function numbers(numbercount) {
    //var numbercount = 10;
    var maxnumbers = 11;

    var res = [];

    for (var i = 1; i <= numbercount; i++) {
        res.push(Nums11x5Handle(Math.round(Math.random() * (maxnumbers - 1)) + 1));
    }

    res = unique(res).sort();

    if (res.length == numbercount)
        return res;
    else
        return numbers(numbercount);
}