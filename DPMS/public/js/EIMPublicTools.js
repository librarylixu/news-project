/*EIM公共方法*/
/** 格式化输入字符串**/
//用法1: "hello{0}".format('world')；返回'hello world'
//用法2: 我是{name}，今年{age}.format({name:"loogn",age:22});
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }

    var data = arguments;        //如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        //如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replace("{" + key + "}", value);
        }
    }
    return result;
}

//移除数组中的元素
/**params
*arr 要操作的数组
*val 要删除的元素


**/
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

//将时间戳转换成几个月前，几周前，几天前，几分钟前的形式
/**params
*dateTimeStamp 需要转换的时间戳
* 
**/
function getDateDiff(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){return;}
	var yearC =diffValue/year;
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	if(yearC>=1){
		result="" + parseInt(yearC) + "年前";
	}else if(monthC>=1){
		result="" + parseInt(monthC) + "月前";
	}else if(weekC>=1){
		result="" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
		result=""+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
		result=""+ parseInt(hourC) +"小时前";
	}
	else if(minC>=1){
		result=""+ parseInt(minC) +"分钟前";
	}else
	result="刚刚";
	return result;
}




/**
         * ajax封装
         * url string 发送请求的地址
         * data object 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
         * async bool 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
         *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
         * type string 请求方式("POST" 或 "GET")， 默认为 "GET"
         * dataType string  预期服务器返回的数据类型，常用的如：xml、html、json、text
         * successfn function 成功回调函数 data
         * errorfn function 失败回调函数 emg
         */
function ajaxasyn(url, data, async, type, dataType, successfn, errorfn) {
    async = (async == null || async == "" || typeof (async) == "undefined") ? "true" : async;
    type = (type == null || type == "" || typeof (type) == "undefined") ? "post" : type;
    dataType = (dataType == null || dataType == "" || typeof (dataType) == "undefined") ? "json" : dataType;
    data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
    $.ajax({
        type: type,
        async: async,
        data: data,
        url: url,
        dataType: dataType,
        success: function (d) {
            successfn(d);
        },
        error: function (e) {
            errorfn(e);
        }
    });
}
//post提交,以form表单提交的方式
//URL地址
//PARAMS 对象  { key: value }
function public_post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

//数组去重
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}


/*弹出层*/
/*
	参数解释：
	title	标题
	url		请求的url
	id		需要操作的数据id
	w		弹出层宽度（缺省调默认值）
	h		弹出层高度（缺省调默认值）
    endfn   层销毁后触发的回调
*/
function layer_show(title, url, w, h, endfn) {
    if (title == null || title == '') {
        title = false;
    };
    if (url == null || url == '') {
        url = "404.html";
    };
    if (w == null || w == '') {
        w = 800;
    };
    if (h == null || h == '') {
        h = ($(window).height() - 50);
    };
    layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        fix: false, //不固定
        maxmin: true,
        scrollbar: false,//屏蔽滚动条
        shade: 0.4,
        title: title,
        content: url,
        end: function (dom) {
            if (endfn != null && endfn != '') {
                endfn(dom);
            }
        }
    });
}
/*关闭弹出框口*/
function layer_close() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
/*弹出新的tab页标签*/
//function Hui_admin_tab(obj) {
//    if ($(obj).attr('_href')) {
//        var bStop = false;
//        var bStopIndex = 0;
//        var _href = $(obj).attr('_href');
//        var _titleName = $(obj).attr("data-title");
//        var topWindow = $(window.parent.document);
//        var show_navLi = topWindow.find("#min_title_list li");
//        show_navLi.each(function () {
//            if ($(this).find('span').attr("data-href") == _href) {
//                bStop = true;
//                bStopIndex = show_navLi.index($(this));
//                return false;
//            }
//        });
//        if (!bStop) {
//            creatIframe(_href, _titleName);
//            min_titleList();
//        }
//        else {
//            show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
//            var iframe_box = topWindow.find("#iframe_box");
//            iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src", _href);
//        }
//    }
//}
//function min_titleList() {
//    var topWindow = $(window.parent.document);
//    var show_nav = topWindow.find("#min_title_list");
//    var aLi = show_nav.find("li");
//};
//function creatIframe(href, titleName) {
//    var topWindow = $(window.parent.document);
//    var show_nav = topWindow.find('#min_title_list');
//    show_nav.find('li').removeClass("active");
//    var iframe_box = topWindow.find('#iframe_box');
//    show_nav.append('<li class="active"><span data-href="' + href + '">' + titleName + '</span><i></i><em></em></li>');
//    var taballwidth = 0,
//		$tabNav = topWindow.find(".acrossTab"),
//		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
//		$tabNavitem = topWindow.find(".acrossTab li"),
//		$tabNavmore = topWindow.find(".Hui-tabNav-more");
//    if (!$tabNav[0]) { return }
//    $tabNavitem.each(function (index, element) {
//        taballwidth += Number(parseFloat($(this).width() + 60))
//    });
//    $tabNav.width(taballwidth + 25);
//    var w = $tabNavWp.width();
//    if (taballwidth + 25 > w) {
//        $tabNavmore.show()
//    }
//    else {
//        $tabNavmore.hide();
//        $tabNav.css({ left: 0 })
//    }
//    var iframeBox = iframe_box.find('.show_iframe');
//    iframeBox.hide();
// //   iframe_box.append('<div class="show_iframe"><div class="loading"></div><iframe frameborder="0" src=' + href + '></iframe></div>');
//    var showBox = iframe_box.find('.show_iframe:visible');
//    showBox.find('iframe').load(function () {
//        showBox.find('.loading').hide();
//    });
//}


/*
<script src="{$Think.const.BOOTSTRAP_URL}bootstrap/lib/Lobibox/js/lobibox.min.js"></script>  
<link rel="stylesheet" href="{$Think.const.BOOTSTRAP_URL}bootstrap/lib/Lobibox/css/Lobibox.min.css">
*/
//右下角弹出告警消息
function show_alert_Message(type, msgobj) {
    //type:info/warning/error/success
    /*
    msgobj
    {
            size: 'mini',
            msg: 'Lorem ipsum dolor sit amet hears farmer indemnity inherent.'
    }

    {
            title: 'title',
            msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
        }
    */
    Lobibox.notify(type, msgobj);
}

//判断浏览器类型
function P_browser_type() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
//判断是否是ie浏览器或ie内核浏览器
function P_browser_iekernel() {
    //ie?    
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        //是  
        return true;
    } else {
        //不是   
        return false;
    }
}
//判断浏览器是否支持Canvas
function is_canvasSupport() {
    return !!document.createElement('canvas').getContext;
}


//弹框警告
/*
*   lobibox.min.js    弹框警告
*   @type 弹框类型 [info,warning,error,success]
*   @size 大小 [mini,]
*   @msg 弹框内容
*/
function P_open_box(type, size, msg) {
    Lobibox.notify(type, {
        size: size,
        msg: msg
    });
}

//初始化文件
function layuiInit() {
    layui.use('form', function () {
        var form = layui.form();
    });
}


//关闭当前layer窗口
function closelayerForm() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    // parent._openapp_cancel(index);
}


////点击出现input编辑框
//$("#form-view").on("click", function () {
//    $(this).addClass("hidden");
//    $("#form-field-mask-2").removeClass("hidden");
//});
//$("#form-field-mask-2").on("click", function () {
//    $(this).addClass("hidden");
//    $("#form-view").removeClass("hidden");
//});



//POST提交
/*
*功能： 模拟form表单的提交
*参数： URL 跳转地址 PARAMTERS 参数
*返回值：
*/
function P_Post(URL, PARAMTERS, _openType) {
    //创建form表单
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    //如需打开新窗口，form的target属性要设置为'_blank'
    if (_openType) {
        temp_form.target = _openType;//_self , _blank
    } else {
        temp_form.target = "_blank";
    }
    
    temp_form.method = "post";
    temp_form.style.display = "none";
    //添加参数
    for (var item in PARAMTERS) {
        var opt = document.createElement("textarea");
        opt.name = item;
        opt.value = PARAMTERS[item];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    //提交数据
    temp_form.submit();
}


//获取当前时间 - 获取当前的日期时间 默认格式“yyyy-MM-dd HH:mm:ss”
/*
seperator:分隔符包括 - 
format : 格式 包括yyyy-MM-dd HH:MM:SS 和 yyyy-MM-dd
*/
function P_getNowFormatDate(seperator, format) {
    var date = new Date();
    var seperator1 = (seperator == null || seperator == "" || typeof (seperator) == "undefined") ? "-" : seperator;
    var _format = (format == null || format == "" || typeof (format) == "undefined") ? "yyyy-MM-dd HH:MM:SS" : format;
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    if (_format == "yyyy-MM-dd") {
        currentdate = currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }
    return currentdate;
}
//获取当前时间，格式：HH:mm:ss
function P_getNowTime(date) {

    if (date == undefined) {
        date = new Date();
    }
    var H = date.getHours(); //获取小时
    var M = date.getMinutes(); //获取分钟
    var S = date.getSeconds();//获取秒
    var MS = date.getMilliseconds();//获取毫秒
    return H + ":" + M + ":" + S;
}

//中国标准时间转换为字符串2010-10-10 08:00:00，格式：HH:mm:ss
function P_getMyTime(date) {
    date = new Date(date);
    var Y = date.getFullYear(); //获取年
    var Mon = date.getMonth() + 1; //获取月
    var D = date.getDate();//获取日
    var H = date.getHours(); //获取小时
    var M = date.getMinutes(); //获取分钟
    var S = date.getSeconds();//获取秒
    var MS = date.getMilliseconds();//获取毫秒

    if (Mon < 10) {
        Mon = "0" + Mon;
    }
    if (D < 10) {
        D = "0" + D;
    }
    return Y + '-' + Mon + '-' + D+' ';
}

//将时间字符串转换为格式过的字符串时间
function P_format(usedDay, fmt) {
    var usedDate = new Date(usedDay);
    var o = {
        "Y+": usedDate.getYear() - 100,//年
        "M+": usedDate.getMonth() + 1, //月份   
        "d+": usedDate.getDate(), //日   
        "h+": usedDate.getHours(), //小时   
        "m+": usedDate.getMinutes(), //分   
        "s+": usedDate.getSeconds(), //秒   
        "q+": Math.floor((usedDate.getMonth() + 3) / 3), //季度   
        "S": usedDate.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (usedDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//时间戳转字符串
/*
php方法 time（）；获取现在时间 得到 10位数
js new Date（）；获取现在时间 Date.getTime() ; 得到13位数字
new Date('13位的数字')；得到现在时间的Date对象
php传到js的时间戳 要*1000可以正确解读
var time = new Date(parseInt(phptime)*1000)
T  参数表示为年月日后加T      2016-01-11T16:00:00
*/
function formatDate(time,T) {
    var now;
    var par = ' ';
    if (time < 10000000000) {
        now = new Date(time * 1000) 
    } else {
        now = new Date(time)
    }
    var year = now.getYear() - 100;
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var Month, _date, Hour, Minute, Second, Year;
    if (year.toString().length < 2) {
        Year = "0" + year;
    } else {
        Year = year;
    }
    if (month.toString().length < 2) {
       Month = "0" + month;
    } else {
        Month = month;
    }
    if (date.toString().length < 2) {       
         _date= "0" + date;
    } else {
        _date = date;
    }
    if (hour.toString().length < 2) {

       Hour = "0" + hour;
    } else {
        Hour =  hour;
    }
    if (minute.toString().length < 2) {

         Minute = "0" + minute;
    } else {
        Minute = minute;
    }
    if (second.toString().length < 2) {

        Second = "0" + second;
    } else {
        Second = second;
    }
    if (T == true) {
        par = 'T';
    }else if(T == 'yyyy-mm-dd'){
        return "20" + Year + "-" + Month + "-" + _date;
    }

    return "20" + Year + "-" + Month + "-" + _date + par + Hour + ":" + Minute + ":" + Second;
}

/*
服务器获取的CST时间转换为JS的GMT时间
*/
//Thu Aug 18 20:38:54 CST 2016，时间格式转换  
//输出格式：yyyy-MM-dd HH:mm:ss  
//Thu Aug 18 2016 20:38:54 GMT+0800  
function P_getTaskTime(strDate) {   
    if(null==strDate || ""==strDate){  
        return "";  
    }  
    var dateStr=strDate.trim().split(" ");  
    var strGMT = dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[5]+" "+dateStr[3]+" GMT+0800";  
    var date = new Date(Date.parse(strGMT));  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();    
    minute = minute < 10 ? ('0' + minute) : minute;  
    var second = date.getSeconds();  
    second = second < 10 ? ('0' + second) : second;        
    return y+"-"+m+"-"+d+" "+h+":"+minute+":"+second;  
};  

//页面刷新
function _reload() {
    location.replace(location.href);
    parent.changeHeight();
}

/*
开启会话
*/
//开启会话前检测浏览器
function P_check_browser(sessiontype) {
    //webshell会话需要浏览器支持
    if (sessiontype == "ssh" || sessiontype == "telnet") {
        //因苹果浏览器安全限制，不支持弹框会话，在开启会话时限制判断浏览器类型
        var mybrowser = P_check_browser();
        if (mybrowser == "Safari") {
            layer.msg("请使用Chrome浏览器或Firefox浏览器");
            return false;
        }
        //判断浏览器是否支持canvas
        if (!is_canvasSupport()) {
            layer.alert('当前浏览器版本过低，建议升级或使用 Chrome 浏览器 ', {
                skin: 'layui-layer-lan'
              , closeBtn: 0
              , anim: 4 //动画类型
            });
            return false;
        }
    }
    return true;
}


//验证打开方式
function _try() {
   

    try {
        _layer = parent.layer;
        if (_layer.open == undefined) {
            _layer = layer;
        }
    } catch (e) {
        //异常处理
        _layer = layer;
    }
}

//length：总页码，displayLength：显示长度      @return  array[1,2,3,4,5,6,7,8]
var P_calculateIndexes = function (length, displayLength) {
    var allPageCount = Math.ceil(length / displayLength);
    var indexes = [];
    for (var i = 1; i <= allPageCount; i++) {
        indexes.push(i);
    }
    return indexes;
};

//对象转数组 object 转 array
function P_objecttoarray(object) {
    var tmp = [];
    for (var key in object) {
        //key是属性,object[key]是值
        tmp.push(object[key]);//往数组中放属性
    }
    return tmp;
}
//开启资产设备会话前，检查浏览器是否支持H5等
function P_checkBrowser() {
    if (hi5.browser.isChromeApp)
        return 'ok';
    var msg = '';
    try {
        document.createElement('canvas').getContext('2d');
    } catch (e) {
        msg = '该浏览器不支持Canvas,建议使用Chrome或升级浏览器版本.\n\n';
    }
    var noWebSocket = !('WebSocket' in window) && !('MozWebSocket' in window);
    var userAgent = navigator.userAgent;
    var isFirefox = userAgent.indexOf('Firefox') != -1;
    if (noWebSocket) {
        msg += "该浏览器不支持WebSocket,建议使用Chrome或升级浏览器版本.\n\n";
        if (isFirefox) {
            msg += '请更新至Firefox 6或更高版本.\n\n';
        } else if (userAgent.indexOf('Opera') != -1) {
            msg += '请打开“opera：config＃启用WebSockets”（在链接字段中输入）使“启用WebSocket”成为选中状态并重新启动Opera.\n\n';
        } else if (userAgent.indexOf('MSIE') != -1) {
            msg += '请安装Google Chrome Frame.\n\n';
        }
    }
    if (msg.length > 0)
        return msg;
    //hi5.notifications.notify(msg);
    return 'ok';
};
//删除字符串中html标签
var publicDelhtmltags = function () {

}
//lix 处理货币的方法
function P_formateNumber(value) {
    var num = parseInt(value);
    if (num >= 10000 && num < 100000000) {
        var snum = (num / 10000).toFixed(1);
        // alert(snum);
        return snum + '万';
    } else if (num >= 100000000) {
        var snum = (num / 100000000).toFixed(1);
        return snum + '亿';
    } else {
        return num;
    }
};


