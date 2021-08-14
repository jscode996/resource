	var isShowRecomm =true;

   var isShowRecomm2 =false;

     var preudParam="";

	function preinit(con){

		var checkCode=$("#checkCodeId").val();
		var ud=getCookie("UMID");
             var reqid=$("#reqid").val();
             preudParam="&ud="+ud+"&reqid="+reqid;

              $.ajax({  
           type : "post", 
           dataType:"json",
            url : "/dm/ptinfo.php?ud="+ud+"&reqid="+reqid,  
            data :  {
			"checkCode":checkCode,
				"con":con,
		},  
            success : function(sdata){  
                if(sdata&&sdata.code){
        						$("#codeId").val(sdata.code);

        						$("#taoInfoUrl").val(sdata.taoInfoUrl)
        						init();
        				}
            },error : function(){  
                $("#loadingId").html("<h2>对不起，该商品未收录或加载异常！</h2>");
            
            }
       });




	}




	function init(){

		//showLocalShopUrl();
		if($("#taoInfoUrl").val()){

			getTaoInfo();
		}else{

			queryHis();
		}

		var timestamp = Date.parse(new Date());

		var code=$("#codeId").val();
		var t=$("#tid").val();
		  $.post(localJsPreUrl+"/dm/coupon.php?code="+code+"&nnd=1&t="+t+preudParam,{},

			  function(sdata){
			    if(sdata){

			    	var title=sdata.title;

			    	if(!$("#titleId").text()&&title){
			    		$("#titleId").html("商品名：<span id='titlespId'>"+title+"</span>");
			    		//$("#taTitleId").val(title);

			    	}

			    	var data=sdata.list;
				if(!data){
				   data=[];
				}
			    	var count=data.length;
			    	var html="";
			    	for(var i=0;i<data.length;i++){
			    		var item=data[i];
			    		var couponAmount=item.couponAmount;
			    		var minLimitPrice=item.minLimitPrice;
			    		var title="满"+minLimitPrice+"减"+couponAmount;
			    		var aid=item.aid;
					var curl='http://go.hisprice.cn/vv/dm/couponClick.php?aid='+aid+"&couponAmount="+couponAmount+"&minLimitPrice="+minLimitPrice+"&t="+preudParam;

					var addYincangCss="";
                                       var couponImgStr='<div class="coupon-img"></div>';
			    		var couponTxtStyle="";
			    		
					var addYincangCss="";
			    		if(minLimitPrice==couponAmount){
			    			addYincangCss=' style="background: #FF7F00;"';
			    		}
			    		var ctype=item.ctype;
			    		if("tdj"==ctype){ // taodianjin
			    			title=couponAmount+"元";
			    			couponImgStr='<div class="">淘礼金<br>红包</div>';
			    			addYincangCss="";
			    			couponTxtStyle='style="text-align: center;"';
			    		}

			    		var liStr='<li  class="etao-coupon etao-mtemplate-coupon1"  aid="'+aid+'" minLimitPrice="'+minLimitPrice+'" couponAmount="'+couponAmount+'" ><a  target="_blank" href="'+curl+'" rel="noreferrer"  style="display: flex;color: #fff;" ><div '+addYincangCss+'  class="coupon-item coupon-left"> '+
			    	couponImgStr+' </div><div '+addYincangCss+' class="coupon-item coupon-right"> <div  '+couponTxtStyle+' class="coupon-txt">'+title+'</div> <div class="txt"  >立即领取&gt;</div> </div></a> </li> ';
			    		html+=liStr;

			    	}
			    	if(count>0){
			    		$("#afp").show();
			    		$("#coupCountId").text(count);
							$("#relateHId").show();
			    	}

			        $('#coupUl').html(html);
			    	var isTaoke=sdata.isTaoke;
			    	if(isTaoke){
			    		 $('#taFlagId').val("1");

				        if("jd"==sdata.type&&sdata.lid){
						$locGoUrl="http://go.hisprice.cn/go/link.php?id="+sdata.lid+"&type=jd"+preudParam;
						 $("#golinkId").attr("href",$locGoUrl);

                                        }else  if("tao"==sdata.type&&sdata.lid){
                                                $locGoUrl="http://go.hisprice.cn/go/jump.php?id="+sdata.lid+"&type=tb"+preudParam;
                                                 $("#golinkId").attr("href",$locGoUrl);

                                        }

							if(isShowRecomm){
									queryRecommend();
							}

			    	}else{
			    		var taFlagId=$("#taFlagId").val();
			    		if("3"==taFlagId){
			    			$('#taFlagId').val("2");
								if(isShowRecomm2){
										queryRecommend2();
								}

			    		}else{
			    			$('#taFlagId').val("2");
			    		}


			    	}
			    }

			},
			"json");


	}

	function checkForm(){
		 var val=$("#kValId").val();
		 if(!val||val.indexOf("请输入商品的网页地址")>-1){
			   alert("请输入商品的网页地址");
			  return false;
		}
		 return true;
	}

	function showLocalShopUrl(){
		var k= getQueryString("k");
		k=decodeURIComponent(k);
		var shortUrl=getShortTitle(k,40);
		$("#localShopUrlId").attr("href",k).text(shortUrl);



	}


	function getQueryString(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}


	function queryRecommend(){

		var code=$("#codeId").val();
		var t=$("#tid").val();
		  $.post(localJsPreUrl+"/dm/couponRecomm.php?isRecommend=1&code="+code+"&t="+t+preudParam,{},

			  function(sdata){
                               if(sdata&&sdata.list){
			        	recommendPut(sdata,1);

                               }else{
                                   $('#taFlagId').val("2");
                                if(isShowRecomm2){ 
				  queryRecommend2();
				}

                              }

			},
			"json");

	}

	function addScriptTag(src) {
	    var script = document.createElement("script");
	    script.setAttribute("type", "text/javascript");
	    script.src = src;
	    document.body.appendChild(script);
	}

	function recommendCallBack (sdata) {

		recommendPut(sdata,2,2);
	}


	function recommendPut (sdata,flag) {

		 if(sdata&&sdata.list){
			 	var style=getCookie("taStyle");
			 	if(!style){
			 		style=2;
			 	}
				// var wWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
         var wWidth = $("#recommDivId").width();
				 var isWap=$("#isWap").val();
         console.log("wWidth:"+wWidth)

  if(wWidth<400){
   isWap=1;
     
}

		    	var data=sdata.list;
		    	var count=data.length;
		    	if(count==0){

		    		return;
		    	}

		    	var html='<div style="color:red" >相关推荐</div>';
		    	if(style==2){
		    		html+='<div class="body"><ul id="viewslist">';
		    	}else{
		    		html+='<div class="recommendList">';
		    	}
		    	var liHtmls="";
		    	var shortTitleLenMin=999;
		    	for(var i=0;i<data.length;i++){
		    		var item=data[i];
 				if(item.sku_id){
		    			flag=3;
		    		}
		    		var couponAmount=item.couponAmount;
		    		var priceAfterCoupon=item.priceAfterCoupon;
		    		var promotionPrice=item.promotionPrice;
		    		var title=item.itemName;
		    		var pic=item.pic;
		    		var monthSellCount=item.monthSellCount;
		    		var itemId=item.itemId;
		    		if(flag==2){
		    			 promotionPrice=item.zk_final_price;
			    		 couponAmount=item.couponAmount;
			    		 priceAfterCoupon=promotionPrice-couponAmount;
			    		 title=item.title;
			    		 pic=item.pict_url;
			    		 monthSellCount=item.volume;
			    		 itemId=item.num_iid;

		    		}else if(flag==3){  
		    			
		    			 couponAmount=0;
			    		 priceAfterCoupon=item.sku_price;
			    		 promotionPrice=item.sku_price;
			    		 title=item.ad_title;
			    		 pic="https://img1.360buyimg.com/n6/"+item.image_url;
			    		 monthSellCount=0;		
			    		 itemId=item.sku_id;
		    			
		    		}

		    		var shortTitle=getShortTitle(title);

		    		var aHref="";
		    		
				if(flag==3){ 
		    			aHref= "http://go.hisprice.cn/jd/m/myJdJump.php?f=vhis&action=jdJump&skuId="+itemId+preudParam;
		    			
		    		}else{
		    		
				    //	aHref="/data/pub/jump.php?f=vhis&hasCoupon=1&iid="+itemId;	
		    	            aHref="http://go.hisprice.cn/vv/dm/goCorr.php?f=vhis&iid="+itemId+preudParam;	
                               }
				
				var smallPic=pic+"_200x200.jpg";
	
				if(flag==3){
		    			smallPic=pic;
		    		}
		    		
		    		var liStr='';
		    		var halfwWidth=wWidth/4.3;
						if(isWap){
							halfwWidth=wWidth/2.2;
						}
		    	

				if(style==2){
		    			 var line1 ='<h4> 现价 <s>¥'+promotionPrice+'</s> 券后价 <big>¥'+priceAfterCoupon+'</big></h4>';
		    			 var line2 = '<div class="quan">优惠券<br>	<span>'+couponAmount+'</span></div> ';
		    			 if(flag==3){
		    				 line2="";
		    				 line1 = '<h4> <big>¥'+priceAfterCoupon+'</big></h4>';
		    			 }
		    			 liStr='<li style="width: '+halfwWidth+'px;" ><div class="img"><a  target="_blank" rel="noreferrer"  href="'+aHref+'"><img src="'+smallPic+'" style="width: '+halfwWidth+'px;height:'+halfwWidth+'px;"> </a></div><div class="txt"> <h2><a target="_blank" rel="noreferrer"   href="'+aHref+'">'+shortTitle+'</a></h2>  '+
		    			 line1+' </div> '+line2+'</li>';	 
		    			 
		    		}else {
		    			 var line ='<span class="huanf" style="color: #FFFFFF;">券:'+couponAmount+'元</span> 现价:￥'+promotionPrice+' <span style="color:red" >券后价:￥'+priceAfterCoupon+'</span>';
		    			 if(flag==3){
		    				 
		    				 line =' <span style="color:red" >￥'+priceAfterCoupon+'</span>';
		    			 }
		    			 liStr='<div><p> <a target="_blank" rel="noreferrer"   href="'+aHref+'">'+shortTitle+'</a><br> '+line+'  </p> </div> ';
				    		 
		    		 }
		    		


		    		if(shortTitle.length<shortTitleLenMin){
		    			shortTitleLenMin=shortTitle.length;
		    			liHtmls=liStr+liHtmls;
		    		}else{
		    			liHtmls+=liStr;
		    		}


		    	}
		    	html+=liHtmls;

		    	 if(style==2){
		    		 html+='</ul>';
		    	 }
		    	html+='</div>';

		    	if(style==2){
		    		 $('#recommDivId').html(html);
		    	}else{
		    		 $('#recommendId').html(html);
		    	}

		 }
	}

	function goRecommendStyle(style){

		setCookie("taStyle",style);
		var s=$("#sid").val();
			  $.post("pub.json?type=changeRecomm&recommFlag="+style+"&s="+s,{},

				  function(sdata){


					 location.reload();

			  	},
		"json");

	}

	function queryRecommend2(){

		var taFlagId=$("#taFlagId").val();

		var title = $("#titlespId").text();
		console.log("title:"+title);
		if("2"==taFlagId&&title){
			var i=$("#taId").val();
			title = encodeURI(title);
			addScriptTag('http://xun3.tool168.cn/dc/getRecommonByT.php?i='+i+'&t='+title);
		}else{
			$("#taFlagId").val("3");
			console.log("no");
		}

	}



	function queryHis(){

		var pram = "";
		if( $("#addPramaId").val()){
			pram = "&"+$("#addPramaId").val();
		}

		var adddata="";
		if($("#addTitleId").val()){
			var title = $("#addTitleId").val();
			title = encodeURIComponent(title);
			adddata="&title="+title;
		}

		var timestamp = Date.parse(new Date());

		var code=$("#codeId").val();
		var t=$("#tid").val();
		var url=localJsPreUrl+"/dm/historynew.php?code="+code+"&t="+t+pram+adddata+preudParam;
		addScriptTag(url);
		/*
		  $.post(,data,

			  function(data){
			    if(data){
						if(data.indexOf("chart(")>-1){

							$("#loadingId").hide();
				    	$("#container").show();
				    	eval(data);

						}else{

									$("#loadingId").html("<h2>对不起，该商品未收录或加载异常！</h2>");
						}


			    }
					if(isShowRecomm2){
				    		var t1 = window.setTimeout("queryRecommend2()",100);
					// window.clearTimeout(t1);

					 console.log("tno2");
					}

			},
			"text");
*/


	}


	function getTaoInfo(){

		var url=$("#taoInfoUrl").val();

		$.ajax({
			   async:false,
			   url: url,
			   type: "GET",
			   dataType: 'jsonp',
			   jsonp: 'jsoncallback',
			   jsonpCallback: "mtopjsonp1",
			 //  data: qsData,
			   timeout: 5000,
			   beforeSend: function(){

			   },
			   success: function (json) {
				   var add="";
				   var title="";
				   var shopType ="";
				   if(json.data){
					   var data=json.data;
					   if(data.item){
						    title=data.item.title;

						   var seller = data.seller;
						   shopType = seller.shopType;

					   }

					   if(data.apiStack&&data.apiStack.length>0){
						   var esiItem=data.apiStack[0];
						   var value = esiItem.value;
						   var bToObj=JSON.parse(value);
						   var result2 = bToObj.price;
						   var priceMap2 = result2.price;
						   var priceText= priceMap2.priceText;

						   if(title&&shopType&&priceText){
							   add="shopType="+shopType+"&price="+priceText;
							   $("#addPramaId").val(add);
							   $("#addTitleId").val(title);

						   }
					   }


				   }


			   },
			    complete: function(XMLHttpRequest, textStatus){
			   // $.unblockUI({ fadeOut: 10 });
			    	queryHis();
			   },
			   error: function(xhr){

			   }
		});


	}


	function getShortTitle(title,maxNum){

		if(!maxNum){
			maxNum=50;
		}

		//var maxNum=50;
		 if (title.length > maxNum) {
			 title= title.replace(/\s+/g, "").substr(0, maxNum) + "...";
		  }

		return title;
	}

	function getCookie(c_name) {

		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1)
					c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
	}

	function setCookie(name, value) {
		var exp = new Date();
		exp.setTime(exp.getTime() + 14 * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + encodeURIComponent(value)
				+ ";expires=" + exp.toGMTString() + ";path=/";
		return true;
	};

function show(ob){

	var t=$("#tid").val();
	var aid=$(ob).attr("aid");
	var minLimitPrice=$(ob).attr("minLimitPrice");
	var couponAmount=$(ob).attr("couponAmount");
	var url=localJsPreUrl+'/dm/couponClick.php?aid='+aid+"&couponAmount="+couponAmount+"&minLimitPrice="+minLimitPrice+"&t="+t;
	//	window.location
	window.open(url);
}



function isIos() {
    return browser.versions.ios || browser.versions.iPhone || browser.versions.iPad
}

var browser = {
	    versions: function () {
	        var u = navigator.userAgent, app = navigator.appVersion;
	        return { //移动终端浏览器版本信息
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf("Adr"), //android终端或uc浏览器
	            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
	            iPad: u.indexOf('iPad') > -1, //是否iPad
	            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
	        };
	    }(),
	    language: (navigator.browserLanguage || navigator.language).toLowerCase()
	};

function ChartDataproce(ddd,isLocMax)
{
    var data = [], dat = [];
	var price=ddd[0][1];
	var i=0;
	var m=new Date().getTime();
	if(isLocMax){
		m=ddd[ddd.length-1][0];
	}
	var day=1000*3600*24;
	for(var n=0;n<ddd.length;n++)
	{
		if(m>=ddd[n][0]){
			if(price!=ddd[n][1])
			{
				dat=[];
				if(ddd[n-1][0]!=ddd[n][0])
					dat[0]=ddd[n][0]-day;
				else
					dat[0]=ddd[n][0];
				dat[1]=price;
				data[i]=dat;
				i++;
			}
			dat=[];
			dat[0]=ddd[n][0];
			dat[1]=ddd[n][1];
			 dat[2]=ddd[n][2];
			data[i]=dat;
			price=ddd[n][1]
			i++;
		}

	}

	i=data.length-1;
	if(i>0 && data[i][0]<m){
			dat=[];
			dat[0]=m;
			dat[1]=data[i][1];
			dat[2]=data[i][2];
			data.push(dat);
	}

	return data;
}

 function setMinMax(data) {
	var min=1000000000;
	var max=0;
	for(var i=0;i<data.length;i++)
	{
		 var p=data[i][1];
		 if(p<min){
			   min=p;
		}
		if(p>max){
			max=p;
		}

	}

	$("#minMaxDivId").show();
	$("#minId").text(min);
	$("#maxId").text(max);
}

 function Datachart(ddd,ij,isLocMax) {
	//var ddd= eval("(["+usdeur+"])")
	var dat1;
	var data=[];
	var dat2;
	//var m=new Date().getTime()-120*24*60*60*1000;
	var i=0,mind,maxd,v,mm=[],vDate, date;
	mind=ddd[0][0];
	maxd=new Date().getTime();
	if(isLocMax){
			maxd=ddd[ddd.length-1][0];
	}
	v=(maxd-mind)/ij ;
	for(var n=0;n<ij;n++)
	{
		vDate =new Date(v*n+mind);
		date = (vDate.getMonth() + 1) + "-" + vDate.getDate();
		mm.push([v*n+mind,date]);
	}
		vDate=new Date(maxd);
		date = (vDate.getMonth() + 1) + "-" + vDate.getDate();
	mm[0][1]="";
	mm.push([v*n+mind,date]);
	return mm;
  }
  function chart(usdeur,surl,type,isLocMax){
		console.log(isLocMax);
	  var data= eval("(["+usdeur+"])")
	  var mm = Datachart(data, 6,isLocMax);
	  data=ChartDataproce(data,isLocMax);
		setMinMax(data);

  	  popchart(data,"container",0,mm,20,12);
	//$("#container .flot-base").css("left",5);
	//$("#container .flot-base").css("top",8);
	//$("#container .flot-text ).css("top",8);
	$("#container .flot-text ").css("left",-10);
	$("#container .flot-text .flot-x-axis").css("top",8);
	$("#container .flot-text .flot-x-axis").css("left",-5);
//	popchart(data,"container1",0,mm,20,10);
	//$("#container1 .flot-base").css("left",5);
//	$("#container1 .flot-base").css("top",8);
//	$("#container1 .flot-text ").css("left",-8);
//	$("#container1 .flot-text .flot-x-axis").css("top",12);
//	$("#container1 .flot-text .flot-x-axis").css("left",-10);

  }


function popchart(data,idtxt,jg,mm,fx,fy)//placeholder,x调整，y调整
{
	var dom, mid,i=data.length-1,xx,yy;
	if(typeof mm==="undefined" && mm==null)
		mm={ mode: "time", timezone: "browser", timeformat: "%m-%d", tickLength: 0};
		else
		mm= {ticks: mm,labelWidth:90};
	if(typeof fx==="undefined")
		fx=0;
	if(typeof fy==="undefined")
		fy=0;
	plot = $.plot("#"+idtxt, [{ data: data }],
		{
			series: {
				lines: {  show: true ,lineWidth:2 }

			},
			crosshair: {
				mode: "x"
			},
			colors: ["#FF4040", "#0022FF"],
			grid: {
				hoverable: true,
				autoHighlight: true,
				borderWidth: 0,
				clickable: true,
				margin: 15,
				labelMargin: 2
			},
			yaxis: {

			},
			xaxis: mm,
			legend: {
				 margin:0
			}

		});
		mid=idtxt+"tooltip";
		var legends = $("#"+idtxt+" .legendLabel");
		$("#"+idtxt+" .legend table").css("top",-12);
		$("#"+idtxt+" .legend div").css("top",-13);
		legends.each(function () {
			// fix the widths so they don't jump around
			$(this).css('width', 90);
		});

		$("#"+idtxt).bind("plothover", function (event, pos, item) {
			var i, j, dataset,x,y ,w,h,w1,h1;
			var x1,y1;
			var series
			if (item) {
				dataset = plot.getData();
				series = item.series;
				var vDate =new Date(item.datapoint[0]);
				var date = vDate.getFullYear() + "-" + (vDate.getMonth() + 1) + "-" + vDate.getDate();
				var hw= plot.pointOffset({ x: item.series.data[item.dataIndex][0], y: item.series.data[item.dataIndex][1] })
				w=plot.width()+50;
				h=plot.height()+10;
			//	$("#"+mid).html(""+date+"<br>价格："+ parseFloat(item.datapoint[1].toFixed(2)));
				  var cinfo=item.series.data[item.dataIndex][2];
                                if(cinfo){
               
                      			 $("#"+mid).html(""+date+"<br>价格："+ parseFloat(item.datapoint[1].toFixed(2))+"<br>"+ cinfo);      
                                 }else{
 
            			    $("#"+mid).html(""+date+"<br>价格："+ parseFloat(item.datapoint[1].toFixed(2)));
                		 }
            				

				w1=$("#"+mid).width();
				h1=$("#"+mid).height();
				y1=hw.top+3;
				x1=hw.left+3;
				if(x1+w1>w)
					x1-=w1+6;
				if(y1+h1>h)
					y1-=h1+6;


				/*w=$(document.body).width()-120;
				y = item.pageY-$("#"+idtxt).offset().top+fy;
				x = item.pageX-$("#"+idtxt).offset().left+fx;
				x1=
				if(item.pageX>w)
					x=w-$("#"+idtxt).offset().left+fx;*/
				$("#"+mid).css({top:y1, left: x1}).fadeIn(200);

			}	else {
					$("#"+mid).hide();
				}
		});

		$("<div id='"+mid+"'></div>").css({
			"width":"100px",
			position: "absolute",
			display: "none",
			border: "1px solid #FFCC66",
			padding: "2px",
			"background-color": " #FFEBBF",
			opacity: 0.80,
			"z-index":"999999"
		}).appendTo($("#"+idtxt).parent());


		$("<div id='A"+mid+"'></div>").css({
			position: "absolute",
			padding: "2px",
			opacity: 0.80,
			"z-index":"999999"
		}).appendTo($("#"+idtxt).parent());
		var dd=plot.pointOffset({ x: data[i][0], y: data[i][1] });
		$("#A" + mid).html(data[i][1]).css({ top: dd.top - 10, left: dd.left })

		var minprice = data[0][1];
		var minj = 0;
		for (j = 0; j <= i; j++) {
		    if (minprice > parseFloat(data[j][1])) {
		        minprice = parseFloat(data[j][1]);
		        minj = j;
            }
		}
		if (minprice < parseFloat(data[i][1])) {
		    $("<div id='L" + mid + "'></div>").css({
		        position: "absolute",
		        padding: "2px",
		        opacity: 0.80,
		        "z-index": "999999"
		    }).appendTo($("#" + idtxt).parent());
		    var dd2 = plot.pointOffset({ x: data[minj][0], y: data[minj][1] });
		    var dd1 = plot.pointOffset({ x: data[0][0], y: minprice });
		    var dd3 = plot.pointOffset({ x: data[i - 1][0], y: minprice });
		    $("#L" + mid).html(data[minj][1]).css({ top: dd2.top, left: dd3.left })
		    var context = plot.getCanvas();
		    var ctx = context.getContext('2d');
		    ctx.save();
		    ctx.translate(0.5, 0.5);
		    ctx.lineWidth = 1;
		    ctx.strokeStyle = '#AAAAAA';
		    ctx.beginPath();
		    var xpos = dd3.left - dd1.left;  //得到横向的宽度;
		    var ypos = dd3.top - dd1.top;  //得到纵向的高度;
            numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / 5);

		    for (var ii = 0; ii <= numDashes; ii++) {
                if (ii % 2 === 0) {
                    ctx.moveTo(dd1.left + (xpos / numDashes) * ii, dd1.top + (ypos / numDashes) * ii);
                    //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
                } else {
                    ctx.lineTo(dd1.left + (xpos / numDashes) * ii, dd1.top + (ypos / numDashes) * ii);
                }
            }
		    ctx.stroke();
		    ctx.restore();

		}

}
