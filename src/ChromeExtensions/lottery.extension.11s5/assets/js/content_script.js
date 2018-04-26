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
var lastjihua = '无';
var gcurrentmoney = 0;

var inmoney = -0.2;
var outmoney = 0;

var maxmoney = 0;
var minmoney = 0;

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
        if (currentmoney.indexOf('正在读取..') < 0) gcurrentmoney = currentmoney;
        var caizhongInfo = `<div class='info'>彩种信息：${$(window.frames["main"].document).find(".GameIssue h1").html()}</div>`;
        var hongbaoInfo = `<div class='info'>红包信息：${eventData}</div>`;

        var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
        var ijissue = ijcurrentli.find('.HistoryIssues').text();
        var nextissue = $(window.frames["main"].document).find('#current_issue').text();

        if (ijcurrentissue != ijissue) {
            ijcurrentissue = ijissue;

            issueshtml = $(window.frames["main"].document).find(".WinnerNumList").html(); // 目前只针对5期

            var kaijiangxinxi = $(issueshtml).find('.HistoryNum i').text().match(/.{10}/g);
            var handledom = $(issueshtml);
            for (var i = 0; i < kaijiangxinxi.length; i++) {
                var kaijiangxinxiitems = kaijiangxinxi[i].match(/.{2}/g);
                console.log(kaijiangxinxiitems);
                handledom.find('.HistoryNum').eq(i).html('<i' + ($.inArray("01", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>01</i><i' + ($.inArray("02", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>02</i><i' + ($.inArray("03", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>03</i><i' + ($.inArray("04", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>04</i><i' + ($.inArray("05", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>05</i><i' + ($.inArray("06", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>06</i><i' + ($.inArray("07", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>07</i><i' + ($.inArray("08", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>08</i><i' + ($.inArray("09", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>09</i><i' + ($.inArray("10", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>10</i><i' + ($.inArray("11", kaijiangxinxiitems) > -1 ? ' class="star"' : '') + '>11</i>');
            }
            issueshtml = handledom.prop('outerHTML');

            lastjihua = currentjihua;

            var kaijianghao = ijcurrentli.find('.HistoryNum i').text().match(/.{2}/g);
            if (lastjihua.indexOf(kaijianghao[0]) > -1 && lastjihua.indexOf(kaijianghao[1]) > -1 && lastjihua.indexOf(kaijianghao[2]) > -1 && lastjihua.indexOf(kaijianghao[3]) > -1 && lastjihua.indexOf(kaijianghao[4]) > -1)
                outmoney += 1.57;

            // var shishinums = [];
            // for (var i = 1; i < 5; i++) {
            //     var nextitem = parseInt(kaijianghao) + i;
            //     var preitem = parseInt(kaijianghao) - i;

            //     nextitem = nextitem > 9 ? nextitem - 10 : nextitem;
            //     preitem = preitem < 0 ? preitem + 10 : preitem;

            //     shishinums.push(nextitem);
            //     shishinums.push(preitem);
            // }
            var nums11s5 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
            var touzhuhao = getRandomArrayElements(nums11s5, 8).sort();//gettouzhuhao1_1();
            currentjihua = touzhuhao.join(',');
            inmoney += 0.2;

            if (outmoney - inmoney > maxmoney) maxmoney = outmoney - inmoney;
            if (outmoney - inmoney < minmoney) minmoney = outmoney - inmoney;

            if (parseFloat(currentmoney) >= 0.2 || gcurrentmoney >= 0.2) {
                if (currentmoney.indexOf('正在读取..') > -1) currentmoney = $("#cpmoney").html();
                if (currentmoney.indexOf('正在读取..') < 0) gcurrentmoney = currentmoney;
                //autobuy(nextissue, touzhuhao);
            }
            // autobuy(nextissue, touzhuhao);
        }


        var kaijiangInfo = `<div class='kaijianginfo'><div class='WinnerNumList'>${issueshtml}</div></div>`;
        var jihuaInfo = `<div class='info'>${ijcurrentissue}计划：${lastjihua}</div><div class='info'>${nextissue}期计划：${currentjihua}</div>`;
        var shouzhiInfo = `<div class='info'>当前支出：${inmoney.toFixed(2)}</div><div class='info'>当前收入：${outmoney.toFixed(2)}</div><div class='info'>最大收益：${maxmoney.toFixed(2)}</div><div class='info'>最大亏损：${minmoney.toFixed(2)}</div>`;


        tip(caizhongInfo + hongbaoInfo /*+ moneyInfo*/ + shouzhiInfo + jihuaInfo + kaijiangInfo);

        if (hongbaoInfo.indexOf('本次发现红包') > -1) sendMessageToBackground('notify', '友情提示', '发现红包，正在准备抢红包');
    });
}

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}

function autobuy(period, nums) {
    // chrome.runtime.sendMessage({ cmd: 'cqzlxz', preiod: preiod, nums: nums }, function (response) {
    //     //console.log(response);
    //     window.postMessage({"test": '你好！'}, '*');
    // });

    //var datacqssc = "lotteryid=1&curmid=50&flag=save&poschoose=&lt_project_modes=3&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A14%2C'codes'%3A'" +/*0%261%262%263%264%265%266*/nums.join('%26') + "'%2C'nums'%3A35%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A0.7%2C'mode'%3A3%2C'desc'%3A'%5B%E5%90%8E%E4%B8%89%E7%A0%81_%E7%BB%84%E5%85%AD%5D+" +/*0%2C1%2C2%2C3%2C4%2C5%2C6*/nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=35&lt_total_money=0.7&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var dataryffc = "lotteryid=16&curmid=2580&flag=save&poschoose=&lt_project_modes=3&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A2541%2C'codes'%3A'" + nums[0].split('').join('%26') + "%7C" + nums[1].split('').join('%26') + "%7C" + nums[2].split('').join('%26') + "'%2C'nums'%3A900%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A18%2C'mode'%3A3%2C'desc'%3A'%5B%E5%90%8E%E4%B8%89%E7%A0%81_%E5%A4%8D%E5%BC%8F%5D+-%2C-%2C" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=900&lt_total_money=18&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var dataryffc = "lotteryid=16&curmid=2580&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A2548%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A84%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A1.68%2C'mode'%3A3%2C'desc'%3A'%5B%E5%90%8E%E4%B8%89%E7%A0%81_%E7%BB%84%E5%85%AD%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=84&lt_total_money=1.68&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0"

    var gd11s5 = "lotteryid=8&curmid=302&flag=save&poschoose=&lt_project_modes=3&pmode=1&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A363%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=126&lt_total_money=2.52&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    var ry11s5 ="lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=2&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3483%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A1%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A0.2%2C'mode'%3A2%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E5%85%AB%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=1&lt_total_money=0.2&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    window.postMessage({ cmd: 'autobuy', data: ry11s5 }, '*');
}

function getNums() {
    var nums = []
    for (i = 0; i < 10; i++)
        for (j = 0; j < 10; j++)
            for (k = 0; k < 10; k++)
                nums.push(i + '' + j + '' + k);

    return nums;
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

function getRandom(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function getRandom1(min, max) {
    var result = Math.floor(min + Math.random() * (max - min));
    if (result < 10) {
        return "00" + result;
    } else if (result < 100) {
        return "0" + result;
    } else {
        return '' + result;
    }
}

function gettouzhuhao(caizhongInfo) {
    var touzhuhao = [];
    var rehao = getRandomArrayElements(sscanlaysis(caizhongInfo), 1);
    var lenghao = nums.concat(rehao).filter(v => !nums.includes(v) || !rehao.includes(v));
    if (rehao.length > 1) {
        touzhuhao = touzhuhao.concat(getRandomArrayElements(rehao, 2));
        touzhuhao = touzhuhao.concat(getRandomArrayElements(lenghao, 7));
    }
    else {
        touzhuhao = touzhuhao.concat(rehao);
        touzhuhao = touzhuhao.concat(getRandomArrayElements(lenghao, 8));
    }

    return touzhuhao;
}

function gettouzhuhao1() {
    var touzhuhao = [];
    while (touzhuhao.length < 100) {
        var item = getRandom1(0, 1000);
        if ($.inArray(item, touzhuhao) < 0)
            touzhuhao.push(item);
    }

    return touzhuhao;
}

function gettouzhuhao1_1() {
    var touzhuhao = [];
    var qianwei = getRandom(0, 10);
    for (i = 0; i < 10; i++)
        for (j = 0; j < 10; j++)
            touzhuhao.push(qianwei + '' + i + '' + j);

    return touzhuhao;
}

function gettouzhuhao2() {
    var touzhuhao = [];
    while (touzhuhao.length < 100) {
        var touzhuitem = [];
        for (var j = 0; j < 3; j++)
            touzhuitem.push(getRandom(0, 10));

        var item = touzhuitem.sort().join('');
        if ($.inArray(item, touzhuhao) < 0)
            touzhuhao.push(item);
    }

    return touzhuhao;
}

function gettouzhuhao3() {
    return getNums()
        .map((n, i, all) => {
            const j = i + Math.floor(Math.random() * (all.length - i));
            const v = all[j];
            all[j] = n;
            return v;
        })
        .slice(0, 100);
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

function sscanlaysis(caizhongInfo) {
    var res = [];
    // if (caizhongInfo.indexOf("重庆时时彩") > -1) {
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
    // }

    return res;
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    initCustomEventListen();
});