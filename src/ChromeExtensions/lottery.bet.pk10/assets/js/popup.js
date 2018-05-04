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

$('#saveBtn').click(function () {
	var betoptions = $('form').serializeObject();
	if (loc1 == loc2) {
		$('#msg').text('设置有误');
		return;
	}

	localStorage.betoptions = JSON.stringify(betoptions);

	$('#msg').text('保存成功.');
});

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
	if (loc1 == loc2) {
		$('#msg').text('设置有误');
		return;
	}

	localStorage.betoptions = JSON.stringify(betoptions);

	$('#msg').text('成功.');
});

$(function () {
	var betoptions = JSON.parse(localStorage.betoptions);
	//console.log(betoptions);

	if (betoptions) {
		$('#loc1').val(betoptions.loc1);
		$('#loc2').val(betoptions.loc2);
		$('#num').val(betoptions.num);
		$('#step3').val(betoptions.step3);
		$('#step4').val(betoptions.step4);
		$('#switch').val(betoptions.switch);
		$('#buyunit').val(betoptions.buyunit);

		$('#runBtn').val(betoptions.switch == '0' ? '运行' : '停止');

		$('#msg').text('加载成功.');
	}
	else {
		$('#msg').text('请设置.');
	}
});