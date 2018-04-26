// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == 'notify') {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'assets/images/icon72.png',
            title: request.title,
            message: request.message,
        });
    }

    if (request.cmd == 'cqzlxz') {
        var data = `lotteryid:1
                    curmid:50
                    flag:save
                    poschoose:
                    lt_project_modes:3
                    pmode:2
                    lt_project[]:{'type':'digital','methodid':14,'codes':'{${request.nums.join('&')}}','nums':35,'omodel':2,'times':1,'money':0.7,'mode':3,'desc':'[后三码_组六] ${request.nums.join(',')}','selStr':'','ctStr':''}
                    lt_issue_start:${request.preiod}
                    lt_total_nums:35
                    lt_total_money:0.7
                    lt_trace_times_margin:1
                    lt_trace_margin:50
                    lt_trace_times_same:1
                    lt_trace_diff:1
                    lt_trace_times_diff:2
                    lt_trace_count_input:10
                    lt_trace_money:0
                `;

        //$.ajax()

        sendResponse(data);
    }
});