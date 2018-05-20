console.log("注入成功");
// var customEvent = document.createEvent('Event');
// customEvent.initEvent('myCustomEvent', true, true);
// var hiddenDiv = document.getElementById('myCustomEventDiv');


// bet: function(t, e) {
//     return i.ajax({
//         url: "/bet/bet",
//         data: JSON.stringify({
//             lotteryId: t,
//             betParameters: e
//         })
//     }, u.bet.loading)
// },
(function () {
    function autobuy(data) {
        //console.log(data);
        $.ajax({
            type: 'POST',
            url: "./?controller=game&action=play",
            timeout: 30000,
            data: data,
            success: function (r_data) {
                //var data1 = $.parseJSON(r_data);
                console.log(r_data);
            }
        });
    }

    window.addEventListener("message", function (e) {
        var data = e.data;
        if (typeof (data) == "object" && data.cmd == 'autobuy') {
            //console.log(data.data);
            autobuy(data.data);
        }

    }, false);

})();