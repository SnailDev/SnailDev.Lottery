$.prototype.serializeObject = function () {
	var a, o, h, i, e;
	a = this.serializeArray();
	o = {};
	h = o.hasOwnProperty;
	for (i = 0; i < a.length; i++) {
		e = a[i];
		if (!h.call(o, e.name)) {
			o[e.name] = e.value;
		}
	}
	return o;
};

$('#runBtn').click(function () {
	var orginValue = $('#switch').val();
	if (orginValue == '0') {
		$('#switch').val(1);
		$('#runBtn').val('停止');
	} else {
		$('#switch').val(0);
		$('#runBtn').val('运行');
	}

	var betoptions = $('form').serializeObject();	
	localStorage.betoptions = JSON.stringify(betoptions);

	$('#msg').text('成功.');
});

$(function () {
	var betoptions = JSON.parse(localStorage.betoptions);
	//console.log(betoptions);

	if (betoptions) {
		$('#runBtn').val(betoptions.switch == '0' ? '运行' : '停止');

		$('#msg').text('加载成功.');
	}
	else {
		$('#msg').text('请设置.');
	}
});