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



var ijcurrentissue;
var issueshtml = "";
var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

var currentjihua = '无';
var currentmoney = "0";

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

<<<<<<< HEAD
            // if (issueshtml == "") {
            //     issueshtml = $(window.frames["main"].document).find(".WinnerNumList").html();
            // }
            // else {
            //     issueshtml = $(issueshtml).prepend(`<li>${ijcurrentli.html()}</li>`).prop('outerHTML');
            // }
            issueshtml = $(window.frames["main"].document).find(".WinnerNumList").html(); // 目前只针对5期

            // var rehao = getRandomArrayElements(sscanlaysis(caizhongInfo), 1);
            // var lenghao = nums.concat(rehao).filter(v => !nums.includes(v) || !rehao.includes(v));
=======
            issueshtml = parseHtml(caizhongInfo);

            var loghtml = generatejihualog(caizhongInfo);
            //if (loghtml != '') log(`<div class='info'>${ijissue}：${loghtml}</div>`);
            generateyiloutimes(caizhongInfo);


            generatejihua(caizhongInfo);
>>>>>>> edf6e6fe683ca9163bfc29a6b9c95c48c9495b40


<<<<<<< HEAD
            var kaijianghao = ijcurrentli.find('.HistoryNum i.star').text().split('');
            var lastjahuaarr = lastjihua.split('||');

            var outmoney1 = 0;//outmoney;
            if (lastjahuaarr.length == 3) {
                outmoney1 = outmoney;
                if (lastjahuaarr[0].indexOf(kaijianghao[0]) > -1)// && lastjahuaarr[1].indexOf(kaijianghao[1]) > -1 && lastjahuaarr[2].indexOf(kaijianghao[2]) > -1)
                    outmoney += 18;
                if (lastjahuaarr[1].indexOf(kaijianghao[1]) > -1)
                    outmoney += 18;
                if (lastjahuaarr[2].indexOf(kaijianghao[2]) > -1)
                    outmoney += 18;
            }

            var touzhuhao = [];
            for (var j = 0; j < 3; j++) {
                // var shishinums = [];
                // for (var i = 1; i < 5; i++) {
                //     var nextitem = parseInt(kaijianghao[j]) + i;
                //     var preitem = parseInt(kaijianghao[j]) - i;

                //     nextitem = nextitem > 9 ? nextitem - 10 : nextitem;
                //     preitem = preitem < 0 ? preitem + 10 : preitem;

                //     shishinums.push(nextitem);
                //     shishinums.push(preitem);
                // }
                // touzhuhao.push(getRandomArrayElements(shishinums, 3).sort().join(','));
                touzhuhao.push(kaijianghao.sort().join(','));
            }

            //if (outmoney == 0 || outmoney - outmoney1 > 0)
                currentjihua = touzhuhao.join('||');
            inmoney += 18;

            if (outmoney - inmoney > maxmoney) maxmoney = outmoney - inmoney;
            if (outmoney - inmoney < minmoney) minmoney = outmoney - inmoney;

            // if (parseFloat(currentmoney) >= 1.68 || gcurrentmoney >= 1.68) {
            //     if (currentmoney.indexOf('正在读取..') > -1) currentmoney = $("#cpmoney").html();
            //     if (currentmoney.indexOf('正在读取..') < 0) gcurrentmoney = currentmoney;
            //     autobuy(nextissue, touzhuhao);
            // }
            // autobuy(nextissue, touzhuhao);
=======
            // 自动下注逻辑
            if (parseFloat(currentmoney) > 300 && $("#autobuyswitch").attr("checked") == "checked") {
                var buynums = [];
                // buynums.push(touzhuhao);
                // buynums.push(touzhuhao1);
                // buynums.push(touzhuhao2);

                autobuy(nextissue, buynums);
            }
>>>>>>> edf6e6fe683ca9163bfc29a6b9c95c48c9495b40
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

<<<<<<< HEAD
function sendMessageToBackground(cmd, title, message) {
    chrome.runtime.sendMessage({ cmd: cmd || 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
=======
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
        console.log(touzhuhao);
        touzhuhao1 = [3, 5, 8];//sscanlaysisre(caizhongInfo);
    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        var rehao = unique(sscanlaysisre(caizhongInfo).sort());
        //var lenghao = unique(sscanlaysisleng(caizhongInfo).sort());

        touzhuhao = rehao;
        // touzhuhao1 = rehao.filter(v => !lenghao.includes(v));
        // var nums = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
        // var lenghao1 = getRandomArrayElements(unique(sscanlaysisleng(caizhongInfo)), 1);
        // touzhuhao2 = numbers(5);//nums.filter(v => !lenghao1.includes(v));//unique($.merge(unique(sscanlaysisre(caizhongInfo)), unique(sscanlaysisleng(caizhongInfo))).sort());
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

        yinli += zhongjianghao.length * 7 - jihuahao.length * 2;

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

function generateyiloutimes(caizhongInfo) {
    var res = "";

    var ijcurrentli = $(window.frames["main"].document).find(".WinnerNumList ul li").eq(0);
    var kaijianghao = [];
    if (caizhongInfo.indexOf("时彩") > -1 || caizhongInfo.indexOf("分彩") > -1) {
        kaijianghao = ijcurrentli.find('.HistoryNum').text().substring(2, 5).split('');
    }
    else if (caizhongInfo.indexOf("11选5") > -1) {
        kaijianghao = ijcurrentli.find('.HistoryNum').text().match(/.{2}/g);
    }

    var jihuahao = ["2", "3", "5", "8"];
    var zhongjianghao = jihuahao.filter(v => kaijianghao.includes(v));
    //console.log(zhongjianghao);
    // if (zhongjianghao.indexOf("2") > -1 && zhongjianghao.indexOf("3") > -1) { log(`<div class='info'><a href="javascript:void(0);">23 的遗漏次数为${times23} </a> </div>`); times23 = 0; inittimes(); } else { times23 += 1; }
    // if (zhongjianghao.indexOf("2") > -1 && zhongjianghao.indexOf("5") > -1) { log(`<div class='info'><a href="javascript:void(0);">25 的遗漏次数为${times25} </a> </div>`); times25 = 0; inittimes(); } else { times25 += 1; }
    // if (zhongjianghao.indexOf("2") > -1 && zhongjianghao.indexOf("8") > -1) { log(`<div class='info'><a href="javascript:void(0);">28 的遗漏次数为${times28} </a> </div>`); times28 = 0; inittimes(); } else { times28 += 1; }
    // if (zhongjianghao.indexOf("3") > -1 && zhongjianghao.indexOf("5") > -1) { log(`<div class='info'><a href="javascript:void(0);">35 的遗漏次数为${times35} </a> </div>`); times35 = 0; inittimes(); } else { times35 += 1; }
    // if (zhongjianghao.indexOf("3") > -1 && zhongjianghao.indexOf("8") > -1) { log(`<div class='info'><a href="javascript:void(0);">38 的遗漏次数为${times38} </a> </div>`); times38 = 0; inittimes(); } else { times38 += 1; }
    // if (zhongjianghao.indexOf("5") > -1 && zhongjianghao.indexOf("8") > -1) { log(`<div class='info'><a href="javascript:void(0);">58 的遗漏次数为${times58} </a> </div>`); times58 = 0; inittimes(); } else { times58 += 1; }
    if (zhongjianghao.length > 1) {
        chrome.runtime.sendMessage({ cmd: 'logwatch', category: "ryffc", periods: "-----", numbers: kaijianghao.join(','), times: times2358 }, function (response) { });
        //logwatch("ryffc", "message", "2358", times2358); //https bug
        log(`<div class='info'><a href="javascript:void(0);">2358 的遗漏次数为${times2358} </a> </div>`);
        buyIndex = 0;
        inittimes();
    } else {
        if (buyIndex > 3)
            buyIndex = 0;
        else
            buyIndex++;
        times2358++;
    }

    return res;
}

function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
>>>>>>> edf6e6fe683ca9163bfc29a6b9c95c48c9495b40
    });
}

function logwatch(category, periods, numbers, times) {
    var data = { "category": category, "periods": periods, "numbers": numbers, "times": times };
    console.log(data);
    $.ajax({
        url: 'http://lottery.develophelper.com/api/logwatch',
        type: 'post',
        data: data,
        success: function (data, status) {

        },
        error: function (data, status) {

        }
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

var buyIndex = -1;
var buyArr = [1, 1, 2, 5, 10];// [1, 2, 4, 9, 19, 42]
function autobuy(period, nums) {
    //var data1 = "lotteryid=1&curmid=50&flag=save&poschoose=&lt_project_modes=3&pmode=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A14%2C'codes'%3A'" +/*0%261%262%263%264%265%266*/nums.join('%26') + "'%2C'nums'%3A35%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A0.7%2C'mode'%3A3%2C'desc'%3A'%5B%E5%90%8E%E4%B8%89%E7%A0%81_%E7%BB%84%E5%85%AD%5D+" +/*0%2C1%2C2%2C3%2C4%2C5%2C6*/nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=35&lt_total_money=0.7&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=2&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3483%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A1%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A0.2%2C'mode'%3A2%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E5%85%AB%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=1&lt_total_money=0.2&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A252%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A5.04%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=252&lt_total_money=5.04&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums.join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums.join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=126&lt_total_money=2.52&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";
    //var data = "lotteryid=22&curmid=4450&flag=save&poschoose=&lt_project_modes=3&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[0].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[0].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[1].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[1].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A3477%2C'codes'%3A'" + nums[2].join('%26') + "'%2C'nums'%3A126%2C'omodel'%3A1%2C'times'%3A1%2C'money'%3A2.52%2C'mode'%3A3%2C'desc'%3A'%5B%E4%BB%BB%E9%80%89%E5%A4%8D%E5%BC%8F_%E4%BA%94%E4%B8%AD%E4%BA%94%5D+" + nums[2].join('%2C') + "'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&lt_issue_start=" + period + "&lt_total_nums=378&lt_total_money=7.56&lt_trace_times_margin=1&lt_trace_margin=50&lt_trace_times_same=1&lt_trace_diff=1&lt_trace_times_diff=2&lt_trace_count_input=10&lt_trace_money=0";

    var data = `lotteryid=16&
                curmid=2580&
                flag=save&
                poschoose=&
                lt_project_modes=2&
                pmode=2&
                lt_project%5B%5D=%7B'type'%3A'digital'%2C'methodid'%3A2552%2C'codes'%3A'2%263%265%268'%2C'nums'%3A6%2C'omodel'%3A2%2C'times'%3A${buyArr[buyIndex]}%2C'money'%3A${1.2 * buyArr[buyIndex]}%2C'mode'%3A2%2C'desc'%3A'%5B%E4%B8%8D%E5%AE%9A%E8%83%86_%E5%90%8E%E4%B8%89%E4%BA%8C%E7%A0%81%E4%B8%8D%E5%AE%9A%E8%83%86%5D+2%2C3%2C5%2C8'%2C'selStr'%3A''%2C'ctStr'%3A''%7D&
                lt_issue_start=${period}&
                lt_total_nums=6&
                lt_total_money=1.2&
                lt_trace_times_margin=1&
                lt_trace_margin=50&
                lt_trace_times_same=1&
                lt_trace_diff=1&
                lt_trace_times_diff=2&
                lt_trace_count_input=5&
                lt_trace_money=0`;
    /*
    lotteryid:16
    curmid:2580
    flag:save
    poschoose:
    lt_project_modes:2
    pmode:2
    lt_project%5B%5D:%7B'type'%3A'digital'%2C'methodid'%3A2552%2C'codes'%3A'2%263%265%268'%2C'nums'%3A6%2C'omodel'%3A2%2C'times'%3A1%2C'money'%3A1.2%2C'mode'%3A2%2C'desc'%3A'%5B%E4%B8%8D%E5%AE%9A%E8%83%86_%E5%90%8E%E4%B8%89%E4%BA%8C%E7%A0%81%E4%B8%8D%E5%AE%9A%E8%83%86%5D+2%2C3%2C5%2C8'%2C'selStr'%3A''%2C'ctStr'%3A''%7D
    lt_issue_start:20180224-0908
    lt_total_nums:6
    lt_total_money:1.2
    lt_trace_times_margin:1
    lt_trace_margin:50
    lt_trace_times_same:1
    lt_trace_diff:1
    lt_trace_times_diff:2
    lt_trace_count_input:5
    lt_trace_money:0
    
    lotteryid:16
    curmid:2580
    flag:save
    poschoose:
    lt_project_modes:2
    pmode:2
    lt_project[]:{'type':'digital','methodid':2552,'codes':'2&3&5&8','nums':6,'omodel':2,'times':2,'money':2.4,'mode':2,'desc':'[不定胆_后三二码不定胆] 2,3,5,8','selStr':'','ctStr':''}
    lt_issue_start:20180224-0910
    lt_total_nums:6
    lt_total_money:2.4
    lt_trace_times_margin:1
    lt_trace_margin:50
    lt_trace_times_same:1
    lt_trace_diff:1
    lt_trace_times_diff:2
    lt_trace_count_input:5
    lt_trace_money:0
    */

    $.ajax({
        type: 'POST',
        url: "./?controller=game&action=play",
        timeout: 30000,
        data: data.replace(/\s+/g, ""),
        success: function (r_data) {
            //var data1 = $.parseJSON(r_data);
            console.log(r_data);
        }
    });
    //window.postMessage({ cmd: 'autobuy', data: data.replace(/\s+/g, "") }, '*');
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




// 简单的日志
function log(info) {
    info = info || '';

    var logDiv = document.getElementById('logDiv');
    if (!logDiv) {
        logDiv = document.createElement('div');
        logDiv.id = 'logDiv';
        logDiv.className = 'chrome-plugin-simple-tip';
        logDiv.style.top = 200 + 250 + 'px';
        logDiv.style.maxHeight = 250 + 'px';
        document.body.appendChild(logDiv);

        $('#logDiv').css('overflow', 'auto');
    }

    $('#logDiv').append(info);
}

function switchs(info) {
    info = info || '';

    var switchDiv = document.getElementById('switchDiv');
    if (!switchDiv) {
        switchDiv = document.createElement('div');
        switchDiv.id = 'switchDiv';
        switchDiv.className = 'chrome-plugin-simple-tip';
        switchDiv.style.top = 50 + 'px';
        //switchDiv.style.maxHeight = 50 + 'px';
        document.body.appendChild(switchDiv);

        $('#switchDiv').css('overflow', 'auto');
    }

    $('#switchDiv').append(info);
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
                if (result < 1 && result > -1) {   //if (result < 2 && result > -2) {
                    var yucehao = parseInt(lastNums[i]) + result;
                    if (yucehao < 12 && yucehao > 0)
                        res.push(Nums11x5Handle(yucehao));
                }
            }
        }

        // var lastNums0 = $(issueshtml).find('li').eq(0).find('i.star').text().match(/.{2}/g);
        // var lastNums1 = $(issueshtml).find('li').eq(1).find('i.star').text().match(/.{2}/g);
        // var lastNums2 = $(issueshtml).find('li').eq(2).find('i.star').text().match(/.{2}/g);
        // var lastNums3 = $(issueshtml).find('li').eq(3).find('i.star').text().match(/.{2}/g);
        // var lastNums4 = $(issueshtml).find('li').eq(4).find('i.star').text().match(/.{2}/g);

        // var $lis = $(issueshtml).find('li');
        // var kaijianghao = $lis.eq(0).find('i.star').text().match(/.{2}/g);


        // for (var i = 0; i < kaijianghao.length; i++) {
        //     for (var j = 1; j < lis.length; j++) {

        //     }
        // }

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