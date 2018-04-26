var currentTime;
var stime;
var timediff;
$.get('/api/servertime?localtime=' + (+new Date()), function (res) {
    timediff = res.diff;

    var timer = setInterval(function () {    //开启定时器
        currentTime = $('#table tbody tr td').eq(1).text();
        stime = 415 - parseInt((+new Date() - (+new Date((new Date().getFullYear() + '-' + currentTime).replace(/-/g, "/")))) / 1000 + timediff);
        $('#show').html('<em style="color:red;">' + stime + "</em> 秒后开奖");
        if (stime == 0 || stime == -20) {
            refreshData();
        }
    }, 1000);
    $("#datetimepicker").datepicker({
        todayBtn: "linked",
        todayHighlight: true,
        toggleActive: true,
        autoclose: true,
        endDate: "<%= date %>"
    }).on("changeDate", function (e) {
        refreshData();
    });

    function refreshData() {
        clearInterval(timer);

        $('#table').bootstrapTable('showLoading');
        $.get('/api/pk101?date=' + $('#datetimepicker').val() + '&type=' + type + '&t=' + Math.random(), function (res) {
            $('#table').bootstrapTable('load', res);
            $('#table').bootstrapTable('hideLoading');

            currentTime = $('#table tbody tr td').eq(1).text();
            if ($('#datetimepicker').val() == date) {
                timer = setInterval(function () {    //开启定时器
                    currentTime = $('#table tbody tr td').eq(1).text();
                    stime = 415 - parseInt((+new Date() - (+new Date((new Date().getFullYear() + '-' + currentTime).replace(/-/g, "/")))) / 1000 + timediff);
                    $('#show').html('<em style="color:red;">' + stime + "</em> 秒后开奖");
                    if (stime == 0 || stime == -20) {
                        refreshData();
                    }
                }, 1000);
                $('#show').show();
            }
            else {
                console.log($('#datetimepicker').val());
                $('#show').hide();
            }
        });
    }
});