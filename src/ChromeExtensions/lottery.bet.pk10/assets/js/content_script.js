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


    switchs("<div class='info'><input id='autobuyswitch' type='checkbox' value='false' /> &nbsp 购买开关</div>");
    setInterval(function () {
        var moneytemp = $("#cpmoney").html();
        console.log(moneytemp);
        if (parseFloat(moneytemp) != NaN)
            currentmoney = moneytemp;
    }, 5000);
}

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

        //var currentmoney = $("#cpmoney").html();
        var caizhongInfo = `<div class='info'>彩种信息：${$(window.frames["main"].document).find(".GameIssue h1").html()}</div>`;
        var hongbaoInfo = `<div class='info'>红包信息：${eventData}</div>`;

        var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
        var ijissue = ijcurrentli.find('.HistoryIssues').text().split('-')[1];
        var nextissue = $(window.frames["main"].document).find("#current_issue").text();//.split('-')[1];

        if (ijcurrentissue != ijissue) {
            ijcurrentissue = ijissue;


            issueshtml = parseHtml(caizhongInfo);

            var loghtml = generatejihualog(caizhongInfo);
            //if (loghtml != '') log(`<div class='info'>${ijissue}：${loghtml}</div>`);
            generateyiloutimes(caizhongInfo);


            generatejihua(caizhongInfo);

            // 自动下注逻辑
            if (parseFloat(currentmoney) > 300 && $("#autobuyswitch").attr("checked") == "checked") {
                var buynums = [];
                // buynums.push(touzhuhao);
                // buynums.push(touzhuhao1);
                // buynums.push(touzhuhao2);

                autobuy(nextissue, buynums);
            }
        }


        var kaijiangInfo = `<div class='WinnerNumList'>${issueshtml}</div>`;
        var jihuaInfo = `<div class='info'>本期计划0：${currentjihua}</div><div class='info'>本期计划1：${currentjihua1}</div><div class='info'>本期计划2：${currentjihua2}</div>`;

        //tip(caizhongInfo + hongbaoInfo + jihuaInfo + kaijiangInfo);
        var yilouInfo = `<div class='info'>2358 遗漏次数：${times2358}</div>`;
        // <div class='info'>25 遗漏次数：${times25}</div>
        // <div class='info'>28 遗漏次数：${times28}</div>
        // <div class='info'>35 遗漏次数：${times35}</div>
        // <div class='info'>38 遗漏次数：${times38}</div>
        // <div class='info'>58 遗漏次数：${times58}</div>`;

        var yinliInfo = `<div class='info'>盈利金额：${yinli}</div>`;
        var buyindexInfo = `<div class='info'>购买倍数：${buyArr[buyIndex]}</div>`;
        tip(caizhongInfo + hongbaoInfo + yilouInfo /*+ yinliInfo*/ + buyindexInfo);

        if (hongbaoInfo.indexOf('本次发现红包') > -1) sendMessageToBackground('友情提示', '发现红包，正在准备抢红包');
    });
}

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    initCustomEventListen();
});