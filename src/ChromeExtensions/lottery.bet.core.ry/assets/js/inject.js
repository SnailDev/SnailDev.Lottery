console.log("注入成功");
var customEvent = document.createEvent('Event');
customEvent.initEvent('myCustomEvent', true, true);
var hiddenDiv = document.getElementById('myCustomEventDiv');
var times = 0;

/* 抢红包注入代码，官方虽然检测不到，但是账户资金多数来源红包，容易被认为红包套利，封号 */
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
