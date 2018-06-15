// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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


var cpmoney = 0;
var ijcurrentissue = '';
var step = 0;
var unitArr = [1, 1, 1, 2, 2, 3, 4];
var jihua;

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

    setInterval(function () {
        var moneytemp = $("#cpmoney").html();
        // console.log(moneytemp);
        if (!isNaN(parseFloat(moneytemp)))
            cpmoney = moneytemp;
    }, 5000);
}

var jihuaInfo;
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

        var caizhongInfo = `<div class='info'>彩种信息：${$(window.frames["main"].document).find(".GameIssue h1").html()}</div>`;
        var hongbaoInfo = `<div class='info'>红包信息：${eventData}</div>`;

        var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
        var ijissue = ijcurrentli.find('.HistoryIssues').text().split('-')[1];
        var nextissue = $(window.frames["main"].document).find("#current_issue").text();//.split('-')[1];

        if (ijcurrentissue != ijissue) {
            ijcurrentissue = ijissue;

            jihuaInfo = ''; // 重置计划信息
            if (jihua) {
                var kaijiang = ijcurrentli.find('.HistoryNum i').text().split('').slice(2);
                var zhong = jihua.filter(v => kaijiang.includes(v));
                if (zhong.length > 0) {
                    step = 0;
                }
                else {
                    step++;
                    if (step > unitArr.length - 1) step = 0;
                }
            }

            jihua = getRandomArrayElements(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 1);
            jihuaInfo += `<div class='info'>${nextissue} 期计划：${jihua[0]}</div>`;

            if (cpmoney > (0.2 * unitArr[step])) {
                autobuy(nextissue, jihua[0])
                jihuaInfo += `<div class='info'>下注状态：成功</div>`;
            }
            else {
                jihuaInfo += `<div class='info'>下注状态：余额不足</div>`;
            }
        }

        var tipInfo = caizhongInfo + hongbaoInfo;
        if (jihuaInfo)
            tipInfo += jihuaInfo;

        tip(tipInfo);
    });
}


// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    initCustomEventListen();
});


function getoptions(callback) {
    chrome.runtime.sendMessage({ cmd: 'getoptions' }, function (response) {
        callback(response);
    });
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

function autobuy(period, num) {
    var data = `lotteryid=1&
                curmid=50&
                flag=save&
                poschoose=&
                lt_project_modes=2&
                pmode=2&
                lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A18%2C'codes'%3A'${num}'%2C'nums'%3A1%2C'omodel'%3A2%2C'times'%3A${unitArr[step]}%2C'money'%3A${(0.2 * unitArr[step]).toFixed(1)}%2C'mode'%3A2%2C'desc'%3A'%5B%E4%B8%8D%E5%AE%9A%E8%83%86_%E5%90%8E%E4%B8%89%E4%B8%80%E7%A0%81%E4%B8%8D%E5%AE%9A%E8%83%86%5D+${num}'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&
                lt_issue_start=${period}&
                lt_total_nums=1&
                lt_total_money=${(0.2 * unitArr[step]).toFixed(1)}&
                lt_trace_times_margin=1&
                lt_trace_margin=50&
                lt_trace_times_same=1&
                lt_trace_diff=1&
                lt_trace_times_diff=2&
                lt_trace_count_input=10&
                lt_trace_money=0`;


    $.ajax({
        type: 'POST',
        url: "./?controller=game&action=play",
        timeout: 30000,
        data: data.replace(/\s+/g, ""),
        success: function (r_data) {
            console.log(r_data);
        }
    });
}

//lotteryid=1&curmid=50&flag=save&poschoose=&lt_project_modes=2&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A18%2C'codes'%3A'1'%2C'nums'%3A1%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A0.2%2C'mode'%3A2%2C'desc'%3A'%5B%E4%B8%8D%E5%AE%9A%E8%83%86_%E5%90%8E%E4%B8%89%E4%B8%80%E7%A0%81%E4%B8%8D%E5%AE%9A%E8%83%86%5D+1'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=20180615-064&lt_total_nums=1&lt_total_money=0.2&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0


// lt_project[]: {'type':'digital','methodid':18,'codes':'1','nums':1,'omodel':2,'times':1,'money':0.2,'mode':2,'desc':'[不定胆_后三一码不定胆] 1','selStr':'','ctStr':''}
// lt_issue_start: 20180615-064
// lt_total_nums: 1
// lt_total_money: 0.2
// lt_trace_times_margin: 1
// lt_trace_margin: 50
// lt_trace_times_same: 1
// lt_trace_diff: 1
// lt_trace_times_diff: 2
// lt_trace_count_input: 10
// lt_trace_money: 0


// lt_project[]: {'type':'digital','methodid':18,'codes':'6','nums':1,'omodel':2,'times':2,'money':0.4,'mode':2,'desc':'[不定胆_后三一码不定胆] 6','selStr':'','ctStr':''}
// lt_issue_start: 20180615-065
// lt_total_nums: 1
// lt_total_money: 0.4
// lt_trace_times_margin: 1
// lt_trace_margin: 50
// lt_trace_times_same: 1
// lt_trace_diff: 1
// lt_trace_times_diff: 2
// lt_trace_count_input: 10
// lt_trace_money: 0