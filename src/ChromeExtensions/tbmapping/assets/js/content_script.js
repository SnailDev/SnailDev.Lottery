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

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    console.log('注入成功.');


    $('form.container').find('div').append('<input type="text" id="mailNoInput" placeholder="输入运单号" class="search-mod__order-search-input___29Ui1" style="margin-left:30px;">');
    $('#mailNoInput').bind('input propertychange', function () {
        for (var i = 0; i < ordermappinginfodict.length; i++) {
            if (ordermappinginfodict[i].mailNo == $(this).val()) { $(this).prev().prev().prev().val(ordermappinginfodict[i].orderNo); break; }
        }
    });
});


function sendMessageToBackground(title, message) {
    chrome.runtime.sendMessage({ cmd: 'notify', title: title || '恭喜恭喜', message: message || '笑死小明了' }, function (response) {
    });
}

function getproductlist(lastStartRow, times, totaltimes) {
    if (times == 0) console.log('正在获取订单编号和运单号对应关系');
    // https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8
    // pageNum=2&pageSize=15&prePageNo=1
    // POST

    // buyerNick=&dateBegin=0&dateEnd=0&lastStartRow=673120602_9223370533818697807_46498090259120206_46498090259120206&logisticsService=&options=0&orderStatus=&pageNum=25&pageSize=15&queryBizType=&queryOrder=desc&rateStatus=&refund=&sellerNick=&prePageNo=2
    var postdata = '';//'pageNum=2&pageSize=15&prePageNo=1';
    if (times == 1) postdata = 'pageNum=2&pageSize=15&prePageNo=1';
    if (times > 1) {
        postdata = 'buyerNick=&dateBegin=0&dateEnd=0&lastStartRow=' + lastStartRow + '&logisticsService=&options=0&orderStatus=&pageNum=' + times + '&pageSize=15&queryBizType=&queryOrder=desc&rateStatus=&refund=&sellerNick=&prePageNo=' + (times - 1);
    }

    $.ajax({
        type: 'POST',
        url: "/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        timeout: 30000,
        data: postdata,
        success: function (r_data) {
            //console.log(r_data);
            var data = JSON.parse(r_data);
            for (var i = 0; i < data.mainOrders.length; i++) {
                if (data.mainOrders[i].statusInfo.text == '交易成功' && data.mainOrders[i].payInfo.postType != '(虚拟物品)') {
                    var detailUrl = data.mainOrders[i].statusInfo.url;
                    //console.log(detailUrl);
                    getproductdetail(detailUrl);
                }
            }

            if (times < totaltimes)
                getproductlist(data.query.lastStartRow, times + 1, totaltimes);
            else
                console.log('订单编号和运单号对应关系获取完成');
        }
    });
}

var ordermappinginfodict = [];
function getproductdetail(producturl) {

    var orderinfomappinginfo = { orderNo: producturl.split('bizOrderId=')[1] };

    var type = 'tmall';
    var prefix = 'var detailData =';
    var splitfix = '</script>';
    if (producturl.indexOf('trade.taobao.com') > -1) {
        type = 'taobao';
        prefix = "var data = JSON.parse('";
        splitfix = "');";
    }

    $.ajax({
        type: 'GET',
        url: producturl,
        timeout: 30000,
        success: function (r_data) {
            if (producturl.indexOf('tradearchive.taobao.com') > -1) {
                //console.log($(r_data).find('.logistics-list').text().replace(/\s+/g,''));
                orderinfomappinginfo.mailNo = $(r_data).find('.logistics-list').text().replace(/\s+/g, '').split('运单号：')[1].split('买家留言')[0];
            }
            else {
                var data = r_data.split('<script>');
                for (var i = 0; i < data.length; i++) {
                    var item = data[i].trim();
                    if (item.indexOf(prefix) == 0) {
                        var itemStr = item.split(splitfix)[0].replace(prefix, '');
                        if (type == 'taobao') {
                            itemStr = itemStr.replace(/\\\"/g, '"');
                            var itemObj = JSON.parse(itemStr);

                            orderinfomappinginfo.mailNo = itemObj.deliveryInfo.logisticsNum;
                        }
                        else {
                            var itemObj = JSON.parse(itemStr);

                            orderinfomappinginfo.mailNo = itemObj.orders.list[0].logistic.content[0].mailNo;
                        }

                        break;
                    }
                }
            }
            ordermappinginfodict.push(orderinfomappinginfo);
        }
    });
}