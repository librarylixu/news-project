/*
    1.根据工单id查找当前工单
    2.根据工单内容开启会话
*/
var sessiondata;
select_workinfo();
function select_workinfo() {
    var postdata = new Object();
    postdata.ideimworklog = _workid;
    postdata.$json = true;
    ajaxasyn(__URL + "Eimaudit/Eimworklog/select_data_opensession", postdata, true, 'POST', 'json', function (data) {
        sessiondata = data[_workid];
        if (sessiondata.status == 1) {
            alert('工单待审批');
            return;
        } else if (sessiondata.status == 2) {
            alert('工单执行中');
            return;
        } else if (sessiondata.status == 3) {
            alert('工单已结束');
            return;
        }
        //json串转object对象
        sessiondata.deviceinfo = JSON.parse(sessiondata.deviceinfo);
        sessiondata.settings = JSON.parse(sessiondata.settings);
        if (sessiondata.sessioncenterid != undefined && sessiondata.sessioncenterid != "") {
            var postdata = new Object();
            postdata.idsessioncenterlist = sessiondata.sessioncenterid;
            postdata.$json = true;
            ajaxasyn(__URL + "Eimsystemsetting/Sessioncenterlist/select_page_data", postdata, true, 'POST', 'json', function (sessioncenterdata) {
                sessiondata.sessioncentername = sessioncenterdata[0].name;
                sessiondata.sessioncenterip = sessioncenterdata[0].ip;
                sessiondata.sessioncenterport = sessioncenterdata[0].port;
               
                try {
                    ws = new WebSocket("ws://" + location.hostname + ":" + '1334');
                    ws.onopen = function () {
                        // Web Socket 已连接上，使用 send() 方法发送数据				  
                        var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.vncv';
                        ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                        // console.log({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID })
                        //  alert("数据发送中...");
                    };
                    Connect_VNC();
                } catch (e) {
                    alert("连接失败！");

                };
                console.log(sessioncenterdata);
                
            }, function (errmsg) {
                parent.layer.open({
                    title: "提示",
                    content: '会话控制中心获取失败，请重新尝试！',
                    end: function (index, layero) {
                        window.close();
                    }
                });
            })
        } else {
            sessiondata.sessioncenterip = location.hostname;
            sessiondata.sessioncenterport = "1336";
            try {
                ws = new WebSocket("ws://" + location.hostname + ":" + '1334');
                ws.onopen = function () {
                    // Web Socket 已连接上，使用 send() 方法发送数据				  
                    var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.vncv';
                    ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                    // console.log({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID })
                    //  alert("数据发送中...");
                };
                Connect_VNC();
            } catch (e) {
                alert("连接失败！");

            }
        }
    }, function (errmsg) {
        parent.layer.open({
            title: "提示",
            content: '会话信息获取失败，请重新尝试！',
            end: function (index, layero) {
                window.close();
            }
        });
    });
}

function Connect_VNC() {
    sessiondata.settings = sessiondata.settings.VNC;
    //console.log(sessiondata);
    //return;
    //sessiondata.deviceinfo.loginpwd = "xincheneim2415";
    sessiondata.settings.__record_name = 'vnc_' + (new Date()).valueOf();
    sessiondata.settings.Session_Task_Id = _workid;

    var protocol = ('https:' == location.protocol) ? 'wss://' : 'ws://';
    var gw = sessiondata.sessioncenterip + ":" + sessiondata.sessioncenterport;
    var s = "";
    s += "server=" + sessiondata.deviceinfo.ip;
    s += "&user=" + sessiondata.deviceinfo.loginuser;
    s += "&pwd=" + sessiondata.deviceinfo.loginpwd;
    for (var k in sessiondata.settings) {
        s += "&" + k + "=" + sessiondata.settings[k];
    }
    //结合pluin 需传入两个参数：__record_name,Session_Task_Id
    s += "&__record_name=" + sessiondata.deviceinfo.devicename + "_vnc";
    var parms = protocol + gw + '/VNC?' + s;
    /*
    ws://www.ppkive.com:1336/VNC?server=192.168.7.110&port=5900&user=admin&pwd=admin&touchpad=false
        &encoding=ZRLE&quality=5&compression=6&UseCopyRect=true&trackCursorLocally=true&ignoreCursor=true
        &color=16&share=true&mapClipboard=true&recording=false&repeaterPort=5901&clear=Clear&clear=Delete
        &save=Save&connect=Connect

    ws://www.ppkive.com:1336/VNC?server=192.168.7.110&user=admin&pwd=admin&port=5900&mapClipboard=true
    &sessionRecord=1&encoding=ZRLE&quality=5&compression=6&UseCopyRect=true&color=16&share=true
    &touchpad=false&trackCursorLocally=true&ignoreCursor=true&recording=false&repeaterPort=5901
    &clear=Clear&save=Save&connect=Connect

        server=192.168.7.110&port=5900&user=admin&pwd=admin&touchpad=false&encoding=ZRLE&quality=5&compression=6
        &UseCopyRect=true&trackCursorLocally=true&ignoreCursor=true&color=16&share=true&mapClipboard=true&recording=false
        &repeaterPort=5901&clear=Clear&clear=Delete&save=Save&connect=Connect
    */
    console.log(parms);
    var r = new svGlobal.Vnc(parms);
    r.onclose = function () {
        r.hide();
    };
    r.addSurface(new svGlobal.LocalInterface());
    r.onerror = function (e) {
        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据				  
            var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.vncv';
            ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "error", workid: _workid, auditfilename: filepath, userid: _USERID }));
            //  alert("数据发送中...");
        };
        console.log(e.name + ':' + e.message);
    };
    r.onresolutionchange = function (w, h) {
        console.log('Resolution changed, w:' + w + ' h:' + h);
    };
    r.onautherror = function (error) {
        console.log('auth error');
        if (error) {
            console.log('error code:' + error.code + ' message:' + error.message);
        }
    };
    r.run();
    //添加审计记录
   // createAudit();
    window.document.title = sessiondata.deviceinfo.devicename + " VNC 会话";
}
//获取当前日期
function P_getMyDate() {
    date = new Date();
    var Y = date.getFullYear(); //获取年
    var Mon = date.getMonth() + 1; //获取月
    var D = date.getDate();//获取日

    if (Mon < 10) {
        Mon = "0" + Mon;
    }
    if (D < 10) {
        D = "0" + D;
    }
    return Y + Mon + D;
}
////新增审计记录
//function createAudit() {
//    var postdata = new Object();
//    postdata.workid = _workid;
//    postdata.type = 'vedio';
//    postdata.filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.vncv';
//    postdata.sessiontype = sessiondata.starttype;                                                                                        
//    ajaxasyn(__URL + "Eimaudit/Authfile/add_page_data", postdata, true, 'POST', 'json', function (data) {

//    }, function (errmsg) {
//        layer.msg("审计记录创建失败！", { icon: 5 });
//    });
//}






