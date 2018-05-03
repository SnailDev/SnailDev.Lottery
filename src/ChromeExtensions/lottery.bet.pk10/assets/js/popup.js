$('#saveBtn').click(function () {
	var loc1 = $('#loc1').val();
	var loc2 = $('#loc2').val();
	var num = $('#num').val();

	if (loc1 == loc2) {
		$('#msg').text('设置有误');
		return;
	}

	var betoptions = {
		loc1: loc1,
		loc2: loc2,
		num: num
	}

	localStorage.betoptions = JSON.stringify(betoptions);

	$('#msg').text('保存成功.');
});

$(function () {
	var betoptions = JSON.parse(localStorage.betoptions);
	console.log(betoptions);

	if (betoptions) {
		var loc1 = $('#loc1').val(betoptions.loc1);
		var loc2 = $('#loc2').val(betoptions.loc2);
		var num = $('#num').val(betoptions.num);

		$('#msg').text('加载成功.');
	}
	else{
		$('#msg').text('请设置.');
	}
});