var qtimes = 0;function autoqianghongbaotip(){qtimes ++;if ($('.hblog').length<1) { $('#FontScroll ul').html('<li><a class="show hblog" href="javascript:void(0)"><span>注入成功，尝试接受红包</span><b></b><em></em></a></li>');}else{$('.hblog').html('<span>注入成功，尝试接受红包 '+ qtimes +' 次</span><b></b><em></em>');}}
function getHongbaoList(){$.ajax({type:'POST',url:'./?controller=promotions&action=hongbaolist',timeout:10000,dataType:"json",success:function(data){autoqianghongbaotip();if(data['isOpen']>0)
{if(Cookies.get('qianghongbao')!=data['isOpen'])
{$(".redpacket-ls").removeClass("closed");$(".redpacket-ls").removeClass("disabled");$(".redpacket-bom").html('');$(".redpacket-bom").html('<a href="javascript:void(0);" class="gethongbao" onclick="getHongbao('+data['isOpen']+');">抢红包</a>');getHongbao(data['isOpen']);}}
else
{$(".redpacket-ls").addClass("closed");$(".redpacket-ls").addClass("disabled");$(".redpacket-bom").html('');$(".redpacket-bom").html('<span class="notyet">本轮红包已被抢完<br>等待下一个大奖</span>');}
var n=data['list'].length;var str="";if(n>0)
{$("#hongbaolist").html("");for(var i=0;i<n;i++)
{var t='<li class="first">恭喜 '+data['list'][i]['username']+'，在'+data['list'][i]['lotteryname']+''+data['list'][i]['issue']+'期 中赢得'+data['list'][i]['money']+'元</li>';if(i!=0)
{t='<li>恭喜 '+data['list'][i]['username']+'，在'+data['list'][i]['lotteryname']+''+data['list'][i]['issue']+'期 中赢得'+data['list'][i]['money']+'元</li>';}
str=str+t;}
$("#hongbaolist").html(str);}}});}