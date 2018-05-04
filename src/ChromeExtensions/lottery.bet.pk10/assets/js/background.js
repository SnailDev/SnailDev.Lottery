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

    if (request.cmd == 'getoptions') {
        var betoptions = {};
        if (localStorage.betoptions) {
            betoptions = JSON.parse(localStorage.betoptions);
        }
        sendResponse(betoptions);
    }
});