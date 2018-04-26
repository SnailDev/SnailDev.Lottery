console.log("注入成功");
var customEvent = document.createEvent('Event');
customEvent.initEvent('myCustomEvent', true, true);
var hiddenDiv = document.getElementById('myCustomEventDiv');
var times = 0;

function getHongbaoList() {
    $.ajax({
        type: 'POST',
        url: './?controller=promotions&action=hongbaolist',
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            times++;

            if (data['isOpen'] > 0) {
                if (Cookies.get('qianghongbao') != data['isOpen']) {
                    $(".redpacket-ls").removeClass("closed");
                    $(".redpacket-ls").removeClass("disabled");
                    $(".redpacket-bom").html('');
                    $(".redpacket-bom").html('<a href="javascript:void(0);" class="gethongbao" onclick="getHongbao(' + data['isOpen'] + ');">抢红包</a>');

                    hiddenDiv.innerText = "尝试获取红包" + times + "次，本次发现红包";
                    getHongbao(data['isOpen']);  // 流程自动化，跳过点击按钮操作
                }
            } else {
                hiddenDiv.innerText = "尝试获取红包" + times + "次，本次未发现红包";
                $(".redpacket-ls").addClass("closed");
                $(".redpacket-ls").addClass("disabled");
                $(".redpacket-bom").html('');
                $(".redpacket-bom").html('<span class="notyet">本轮红包已被抢完<br>等待下一个大奖</span>');
            }
            var n = data['list'].length;
            var str = "";
            if (n > 0) {
                $("#hongbaolist").html("");
                for (var i = 0; i < n; i++) {
                    var t = '<li class="first">恭喜 ' + data['list'][i]['username'] + '，在' + data['list'][i]['lotteryname'] + '' + data['list'][i]['issue'] + '期 中赢得' + data['list'][i]['money'] + '元</li>';
                    if (i != 0) {
                        t = '<li>恭喜 ' + data['list'][i]['username'] + '，在' + data['list'][i]['lotteryname'] + '' + data['list'][i]['issue'] + '期 中赢得' + data['list'][i]['money'] + '元</li>';
                    }
                    str = str + t;
                }
                $("#hongbaolist").html(str);
            }

            hiddenDiv.dispatchEvent(customEvent);
        }
    });
}

function getHongbao(id) {
    $.ajax({
        type: 'POST',
        url: './?controller=promotions&action=hongbao',
        data: {
            hbid: id
        },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            if (data['code'] == 0 || data['code'] == 2) {
                layer.alert(data['message'], {
                    title: '温馨提示',
                    skin: 'layui-layer-molv',
                    icon: 0
                });

                console.log(data['message']);
                hiddenDiv.innerText = data['message'];
            } else if (data['code'] == 3) {
                $(".redpacket-ls").addClass("closed");
                $(".redpacket-ls").addClass("disabled");
                $(".redpacket-bom").html('');
                $(".redpacket-bom").html('<span class="notyet">本轮红包已被抢完<br>等待下一个大奖</span>');
                layer.alert(data['message'], {
                    title: '温馨提示',
                    skin: 'layui-layer-molv',
                    icon: 0
                });

                console.log(data['message']);
                hiddenDiv.innerText = data['message'];
            } else if (data['code'] == 1) {
                $(".redpacket-ls").addClass("closed");
                $(".redpacket-ls").addClass("disabled");
                $(".redpacket-bom").html('');
                $(".redpacket-bom").html('<span class="notyet">本轮红包已抢<br>等待下一个大奖</span>');
                layer.alert(data['message'], {
                    title: '温馨提示',
                    skin: 'layui-layer-molv',
                    icon: 1
                });

                console.log(data['message']);
                hiddenDiv.innerText = data['message'];
            }
            $(".redpacket-ls").addClass("closed");
            if (data['code'] != 2)
                Cookies.set('qianghongbao', id, {
                    expires: 30
                });

            hiddenDiv.dispatchEvent(customEvent);
            getHongbaoList();
        },
        error: function () {
            layer.alert("网络异常！", {
                title: '温馨提示',
                skin: 'layui-layer-molv',
                icon: 0
            });

            console.log("网络异常！");
            getHongbao(id);
        }
    });
}

(function () {
    function autobuy(data) {
        $.ajax({
                type: 'POST',
                url: "./?controller=game&action=play",
                timeout: 30000,
                data: data,
                success: function(r_data) {
                    //var data1 = $.parseJSON(r_data);
                    console.log(r_data);
                }
            });
    }

    window.addEventListener("message", function(e)
    {
        var data = e.data;
        if( typeof(data)=="object" && data.cmd == 'autobuy')
        {
            //console.log(data.data);
            autobuy(data.data);
        }
        
    }, false);

})();



/*
Request URL:https://www.ry202.com/?controller=game&action=play
Request Method:POST
Status Code:200 
Remote Address:107.154.196.57:443
Referrer Policy:no-referrer-when-downgrade
Response Headers
content-encoding:gzip
content-type:text/html; charset=UTF-8
date:Fri, 08 Dec 2017 08:58:58 GMT
server:ok
status:200
strict-transport-security:max-age=31536000
vary:Accept-Encoding
x-cdn:Incapsula
x-iinfo:2-3101859-3100902 PNNN RT(1512723537346 0) q(0 0 0 -1) r(1 1) U6
Request Headers
:authority:www.ry202.com
:method:POST
:path:/?controller=game&action=play
:scheme:https

accept-encoding:gzip, deflate, br
accept-language:en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4
content-length:540
content-type:application/x-www-form-urlencoded; charset=UTF-8
cookie:visid_incap_1154735=V6w9BT0cS/ukY9hUxQIxv8IT5FkAAAAAQUIPAAAAAAD9L0yty11BOPMAmgLyqApB; _ga=GA1.2.783080064.1508467878; nalert=562; PHPSESSID=abl2sn62qra9h7jh76qqdjgni3; nlbi_1154735=Iw9gGcG2MSxl7I7UuJVqFQAAAAABQC20zOvIE689aD7col5c; pmode_selected_value=2; incap_ses_798_1154735=G4e9MHMhfwy7k9Cv2hATCzq7JFoAAAAAr1vBEQa9woqY/JTqU7ssJw==; incap_ses_256_1154735=cg1jF99kAzODS5luqX6NA0RGJVoAAAAAySv+T2pVQIgl27pF+KvnKg==; qianghongbao=1133; incap_ses_244_1154735=yaBDUxRidEQSuVkJvNxiA14YKVoAAAAAXrb+1j1eMcC4SzE52aMvTA==; _sessionHandler=50b9c38bd4f3bd956f30a812a8b0b84e607dd59e; incap_ses_810_1154735=CZ4wYPmwBi50vrdavLI9C+jrKVoAAAAAoO3Wllo6uh38UCqF+67hgg==; sscmoshi=3; last_lottery_url=https%3A%2F%2Fwww.ry202.com%2F%3Fcontroller%3Ddefault%26action%3Dbet%26navv%3Dssc; LPVID=BkMzQxODM3MjlhYjAwNjdi; LPSID-25332694=IyY9EHqBS6G1yGOIO2wNFw; modes=3
origin:https://www.ry202.com
referer:https://www.ry202.com/?nav=ssc
user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
x-requested-with:XMLHttpRequest
Query String Parameters
view source
view URL encoded
controller:game
action:play
Form Data
view source
view URL encoded
lotteryid:1
curmid:50
flag:save
poschoose:
lt_project_modes:3
pmode:2
lt_project[]:{'type':'digital','methodid':14,'codes':'2&3&4','nums':1,'omodel':2,'times':1,'money':0.02,'mode':3,'desc':'[后三码_组六] 2,3,4','selStr':'','ctStr':''}
lt_issue_start:20171208-067
lt_total_nums:1
lt_total_money:0.02
lt_trace_times_margin:1
lt_trace_margin:50
lt_trace_times_same:1
lt_trace_diff:1
lt_trace_times_diff:2
lt_trace_count_input:10
lt_trace_money:0
*/