/**
*js for 首页（index_new）
*2017-06-21
*/

        var layer;
//弹窗变tab页面接口
var addTabs;
(function ($) {
    layui.use('layer', function () {
        layer = layui.layer;
    });
    addTabs = function (options) {
        //var rand = Math.random().toString();
        //var id = rand.substring(rand.indexOf('.') + 1);
        // var url = window.location.protocol + '//' + window.location.host;
        // options.url = options.url;
        var option_id = options.id;
        var id;
        if (option_id.length > 18) {
            id = "tab_" + option_id.substring(0, 18);
        } else {
            id = "tab_" + option_id;
        }
        
        $(".active").removeClass("active");
        //如果TAB不存在，创建一个新的TAB
        if (!$("#" + id)[0]) {
            //固定TAB中IFRAME高度
            mainheight = $(document.body).height() - 100;
            //创建tab的title
            title = '<li role="presentation" id="tab_' + id + '"><a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab"><i class="' + options.icon + '"></i>&nbsp;&nbsp;' + options.title
                + '&nbsp; <i class="glyphicon glyphicon-remove smaller-50"  tabclose="' + id + '" style="margin-left:20px;" ></i></a></li>';
            //是否允许关闭
            //if (options.close) {
            //    title += ;
            //}
            //title += ;
            //是否指定TAB内容

            var content = '<div role="tabpanel" class="tab-pane" id="' + id + '"><iframe src="' + options.url + '"  id="iframe_' + id + '"  width="100%"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes" height="' + mainheight +'"></iframe></div>';

            //加入TABS
            $(".nav-tabs").append(title);
            $(".tab-content").append(content);
                  
        }
        //激活TAB
        $("#tab_" + id).addClass('active');
        $("#" + id).addClass("active");
    };
    //计算iframe的高度
    var mainheight = $(document.body).height() - 100;
    //赋值给iframe的高度
    $('.main-left,.main-right').height(mainheight);
    //点击带有addtabs属性的标签时，触发添加tab的方法
    $("[addtabs]").click(function () {
        //if ($(".submenu span").text() === $(this).attr('title'))

        addTabs({ id: $(this).attr("id"), title: $(this).attr('title'), close: true });

    });

    //点击带有tabclose属性的值
    $(".nav-tabs").on("click", "[tabclose]", function (e) {
        id = $(this).attr("tabclose");
        closeTab(id);
    });
    //点击子菜单，添加新的tab 并打开对应页面
    $('.eimmenu').click(function () {
        if (this.tagName.toUpperCase() != 'LI') {
            return;
        }

        var _id = $(this.children[0]).attr('data-id');
        var _title = this.children[0].children[1].innerText;
        var _url = $(this.children[0]).attr('data-href');

        //兼容火狐38.0.5.5623版本
        if (_title == undefined) {
            _title = $(this.children[0].children[1]).text();
        }
       
        addTabs({ id: _id, title: _title, url: _url, close: true });       
               
        $(this).addClass("active").parent().parent().addClass("active");
        // this.children[0].children[0].className
    });
    mainHeight = $("body").height() - 100;
    $("#index iframe").css("height", mainHeight);
})(jQuery);
var closeTab = function (id) {
    //如果关闭的是当前激活的TAB，激活他的前一个TAB
    if ($("#min-title li.active").attr('id') == "tab_" + id) {
        $("#tab_" + id).prev().addClass('active');
        $("#" + id).prev().addClass('active');
    }
    //关闭TAB
    $("#tab_" + id).remove();
    $("#" + id).remove();
};
   
var config = new Object();
var friendList;//好友列表
var socket = new Object();
var layimObj = new Object();
//获取基础参数
function initPage() {
    if (_onlineStatus == '0') {
        return;
    }
    ajaxasyn(_URL + '/OnlineChat/Async_get_onchat_info', '', '', 'post', '',
        function (data) {
            config.maxLength = data.maxLength; //最长发送的字符长度
            config.brief = false; //是否简约模式（默认false，如果只用到在线客服，且不想显示主面板，可以设置 true）
            config.title = data.MinTxt == '0' ? username : data.MinTxt; //主面板最小化后显示的名称
            config.min = data.MainStatus; //用于设定主面板是否在页面打开时，始终最小化展现。默认false，即记录上次展开状态。
            config.minRight = null;//【默认不开启】用户控制聊天面板最小化时、及新消息提示层的相对right的px坐标，如：minRight= '200px'
            config.isfriend = true; //是否开启好友（默认true，即开启）
            config.isgroup = true; //是否开启群组（默认true，即开启）
            config.right = '30px';//默认0px，用于设定主面板右偏移量。该参数可避免遮盖你页面右下角已经的bar。

            //config.find = '/find/'; //查找好友/群的地址（如果未填则不显示）
            config.copyright = data.copyright;

            /*3.0*/
            config.isAudio=true; //开启聊天工具栏音频
            config.isVideo= true; //开启聊天工具栏视频
            //扩展工具栏
            config.tool= [{
                alias: 'code'
              , title: '代码'
              , icon: '&#xe64e;'
            }];
            config.initSkin= '2.jpg'; //1-5 设置初始背景
            config.skin= ['aaa.jpg']; //新增皮肤
            config.notice = true; //是否开启桌面消息提醒，默认false
            config.voice = false; //声音提醒，默认开启，声音文件为：default.mp3
            // config.msgbox = layui.cache.dir + 'css/modules/layim/html/msgbox.html'; //消息盒子页面地址，若不开启，剔除该项即可
            //config.find = layui.cache.dir + 'css/modules/layim/html/find.html';//发现页面地址，若不开启，剔除该项即可
            config.chatLog = _URL + '/OnlineChat/get_chat_log'; //聊天记录页面地址，若不开启，剔除该项即可

            try {
                socket = new WebSocket('ws://{IP}:1235'.format({ IP: data.ServerIP }));
            } catch (e) {
                showMsg("请管理员检查服务器通讯状态", 3);
                console.log(e.message);
            }
            initChate();

        }, function (error) {
            alert("Init Error!");
        })
}

function initChate() {

    try {
        ajaxasyn(_URL + '/OnlineChat/init', '', '', 'post', '', successfn, errorfn)
    } catch (e) {
        showMsg('初始化失败', 2);
        console.log(e.message);
    }
}

function successfn(data) {
    friendList = data;
    config.init = {
        url: _URL + '/OnlineChat/init'
                  , type: 'post' //默认get，一般可不填
                  , data: {} //额外参数
    };
    //获取群员接口
    config.members = {
        url: _URL + '/OnlineChat/getGroupUsers' //接口地址（返回的数据格式见下文）
        , type: 'post' //默认get，一般可不填
        , data: {} //额外参数
    };
    //上传图片接口（返回的数据格式见下文）
    config.uploadImage = {
        url:_URL + '/OnlineChat/uploadFile' //接口地址（返回的数据格式见下文）
                , type: 'post' //默认post
    };
    //上传文件接口（返回的数据格式见下文）
    config.uploadFile = {
        url: _URL + '/OnlineChat/uploadFile' //接口地址（返回的数据格式见下文）
            , type: 'post' //默认post
    };
    config.chatLog = _URL + '/OnlineChat/get_chat_log'; //聊天记录地址（如果未填则不显示）

    //初始化聊天
    layimObj= layui.use('layim', function (layim) {
        //建立WebSocket通讯
        _websocket(layim);
        layim.on('ready',ready);
        layim.on('online', status);
        layim.on('sendMessage', sendMessage);
        //监听签名修改
        layim.on('sign', function (value) {
            //console.log(value);
        });
        //监听查看群员
        layim.on('members', function (data) {
            //console.log(data);
        });
        //监听聊天窗口的切换
        layim.on('chatChange', function (res) {
            var type = res.data.type;
            console.log(res.data.id)
            if (type === 'friend') {
                //模拟标注好友状态
                //layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
            } else if (type === 'group') {
                //模拟系统消息
                layim.getMessage({
                    system: true
                  , id: res.data.id
                  , type: "group"
                  , content: '模拟群员' + (Math.random() * 100 | 0) + '加入群聊'
                });
            }
        });

        layim.config(config);
        //获取未读消息
        get_unReadMsg(layim);
        // layim.setChatMin();
        // var d=layim.cache();//获取所有好友
        // console.log(d) ;
        //监听自定义工具栏点击，以添加代码为例
        layim.on('tool(code)', function (insert, send, obj) { //事件中的tool为固定字符，而code则为过滤器，对应的是工具别名（alias）
            layer.prompt({
                title: '插入代码'
              , formType: 2
              , shade: 0
            }, function (text, index) {
                layer.close(index);
                insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
            });
        });
    });



}
function errorfn(data) {

}
//接收消息事件
function _websocket(layim) {
    try {
        socket.send(JSON.stringify({
            username: username //消息来源用户名
          , avatar: __IMGPATH + "cmd_24px.png" //消息来源用户头像
          , id: userid //聊天窗口来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
          , type: "init" //聊天窗口来源类型，从发送消息传递的to里面获取,init表示第一次登录
          , content: "online" //消息内容
        }));
    } catch (e) {
        showMsg('上线消息发送失败', 3);
        console.log(e.message);
    }

    //连接成功时触发
    socket.onopen = function () {
        console.log('XXX连接成功');
    };

    //监听收到的消息
    socket.onmessage = function (res) {
        try {
            var data = res.data;
            data = eval('(' + data + ')');
            if (data.type == 'init') {
                setOnlineStatus(data.id, data.status);
                // showMsg(data.username + '上线了',2);    此处可进行设置上线 离线提醒
                return;
            }
            else if (data.type == 'refresh') {
                setAllOffLine();
                for (var i = 0; i < data.data.length; i++) {
                    setOnlineStatus(data.data[i].id, 1);
                }
            }
            else if ((data.type == 'friend') || (data.type == 'group' && getGroupExists(data.id, data.mid))) {
                data.timestamp = new Date().getTime();
                layim.getMessage(data);
            }
        } catch (e) {
            console.log("Onmessage Error:" + e.message);
        }
    };
    socket.onerror = function (data) {
        console.log('error');
        console.log(data);
    };
    socket.onclose = function (data) {
        console.log('onclose');
        console.log(data);
    };
}

//聊天窗口事件 发消息事件
function sendMessage(res) {
    try {
        res.type = res.to.type;
        socket.send(JSON.stringify(res));
    } catch (e) {
        showMsg('消息发送失败', 2);
        console.log(e.message);
    }

}

//状态切换
function status(status) {
    socket.send(JSON.stringify({ type: status }));
}
//判断浏览器是否支持Canvas
function is_canvasSupport() {
    return !!document.createElement('canvas').getContext;
}

//初始化完毕后加载该方法
function ready(options) {
    if (!is_canvasSupport()) {
        layer.alert('当前浏览器版本过低，建议升级或使用 Chrome 浏览器', {
            skin: 'layui-layer-lan',
            closeBtn: 0,
            anim: 4
        });
        return;
    }
    try {
        socket.send(JSON.stringify({ type: "refresh" }));
    } catch (e) {
        showMsg('消息发送失败', 2);
        console.log(e.message);
    }            
    //do something 获取在线状态 并修改各用户的在线状态  options是当前所有的数据
    layimObj.layim.msgbox(15); //模拟消息盒子有新消息，实际使用时，一般是动态获得
    $('#test').click(function () {
        layimObj.layim.showMainLayim(1);
    });
}
//群组是否存在
function getGroupExists(groupid, myid) {
    for (var i = 0; i < friendList.data.group.length; i++) {
        if (groupid == friendList.data.group[i].id && myid != userid) {
            return 1;
        }
    }
    return 0;
}
//设置所有人离线
function setAllOffLine() {
    for (var i = 0; i < friendList.data.friend.length; i++) {
        if (friendList.data.friend[i].list == null) {
            continue;
        }
        for (var j = 0; j < friendList.data.friend[i].list.length; j++) {
            setOnlineStatus(friendList.data.friend[i].list[j].id, 0);
        }
    }
}
//右下角弹出消息
function showMsg(msg, time) {
    layer.msg(msg, {
        icon: 6,
        time: 1000 * time,
        offset: 'b'
    }, function () {
        //do something

    });
}
//设置好友在线、离线状态
function setOnlineStatus(id, status) {
    if (status) {
        $('#layim-friend' + '' + id).removeClass('layim-list-gray');
        return;
    }
    $('#layim-friend' + id).addClass('layim-list-gray');
}
//获取未读消息
function get_unReadMsg(layim) {
    var parameter = { tid: userid, ReadStatus: false }
    ajaxasyn(_URL + '/OnlineChat/get_unReadMessage', parameter, '', 'post', '',
    function (data) {
        try {
            for (var i = 0; i < data.length; i++) {
                layim.getMessage(data[i]);
            }
        } catch (e) {
            alert(e.message);
        }
    }, function (error) {
        alert(error);
    })
}



   
var serviceip = "";
$(function () {
    //如果为第一次登录，提示用户是否修改密码
    if ( _Lastlogintime == "0") {
        var dellayerindex = layer.confirm('您好，你是第一次登录本系统，是否修改密码？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            $("#a_update_pwd").click();
            layer.close(dellayerindex);
        });

    }
});

//引导
function btn_help() {
    // Set up tour
    $('body').pagewalkthrough({
        name: 'introduction',
        steps: [//
        {
            popup: { content: '#walkthrough-1', type: 'modal' }
        },  {
            wrapper: '#userinfo', popup: { content: '#walkthrough-2', type: 'tooltip', position: 'center' }
        }, {
            wrapper: '#ace-settings-container', popup: { content: '#walkthrough-3', type: 'tooltip', position: 'center' }
        },{
            wrapper: '#sidebar', popup: { content: '#walkthrough-4', type: 'tooltip', position: 'center' }
        }, {
            wrapper: '#min-title', popup: { content: '#walkthrough-5', type: 'tooltip', position: 'center' }
        }, {
            popup: { content: '#walkthrough-6', type: 'modal' }
        },]
    });
    // Show the tour
    $('body').pagewalkthrough('show');
}
   
//密码复杂度策略提示
$(function () {
    if (_waring_info != "") {
        P_open_box("warning", "mini", _waring_info);
    }
});
var connect_html = '<p class="text-center">Copyright © <a href="http://www.qinghong.net.cn" target="_blank"><span class="language-55">北京昕辰清虹科技有限公司</span></a> &nbsp;All Rights Reserved.2016-2019<br><span class="language-56">客服中心:400-685-1010 技术热线:010-64126508</span></p>';
function openConnect() {           
    layer.open({
        type: 1,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '联系我们',
        content: connect_html,
        area:["30%","20%"]
    });
}

    
//通知信息接口
   
(function () {
    function lobiBox() {
        //通知
        Lobibox.notify('info', {
            title: 'Info title',
            msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
        });
        //警告
        Lobibox.notify('warning', {
            title: 'Warning title',
            msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
        });
        //错误
        Lobibox.notify('error', {
            title: 'Error title',
            msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
        });
        //成功
        Lobibox.notify('success', {
            title: 'Success title',
            msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'

        });


        //基本版--迷你版
        Lobibox.notify('default', {
            size: 'mini',
            msg: 'Lorem ipsum dolor sit amet hears farmer indemnity inherent.'
        });
        //警告--迷你带图片版
        Lobibox.notify('warning', {
            img: __IMGPATH + '2.jpg',
            size: 'mini',
            msg: 'Lorem ipsum dolor sit amet hears farmer indemnity inherent.'
        });
        //带标题mini版--错误
        Lobibox.notify('error', {
            size: 'mini',
            title: 'Lorem ipsum',
            msg: 'Lorem ipsum dolor sit amet hears farmer indemnity inherent.'
        });
        //mini圆角版
        Lobibox.notify('success', {
            size: 'mini',
            rounded: true,
            delayIndicator: false,
            msg: 'Lorem ipsum dolor sit amet hears farmer indemnity inherent.'
        });
    }
})();

function changeHeight() {
    var mainHeight = $("body").height() - 100;
    var tab_id = $(".tab-pane.active").attr("id");
    var _id = "iframe_" + tab_id;
     console.log($("#" + _id).height());
   // $("#" + _id).css("height", mainHeight+"px");
    $("#"+_id).height(mainHeight);
    console.log($("#" + _id).height());
  //  $(tab_id).css("height", mainHeight);
}
