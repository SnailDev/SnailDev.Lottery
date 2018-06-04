// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // if (request.cmd == 'notify') {
    //     chrome.notifications.create(null, {
    //         type: 'basic',
    //         iconUrl: 'assets/images/icon72.png',
    //         title: request.title,
    //         message: request.message,
    //     });
    // }

    if (request.cmd == 'getorderinfo') {
        var orderinfo = {};
        if (localStorage.orderinfo) {
            orderinfo = JSON.parse(localStorage.orderinfo);
        }
        sendResponse(orderinfo);
    }

    if (request.cmd == 'setorderinfo') {
        localStorage.orderinfo = JSON.stringify(request.data);
        sendResponse(request.data);
    }
});