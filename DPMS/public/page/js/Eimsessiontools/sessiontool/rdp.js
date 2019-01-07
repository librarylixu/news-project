/*
    1.根据工单id查找当前工单
    2.根据工单内容开启会话
*/
var sessiondata;
var ws;
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
        console.log(sessiondata);
        //json串转object对象
        sessiondata.deviceinfo = JSON.parse(sessiondata.deviceinfo);
        sessiondata.settings = JSON.parse(sessiondata.settings);
        //查询会话控制中心
        if (sessiondata.sessioncenterid != undefined && sessiondata.sessioncenterid != "") {
            var postdata = new Object();
            postdata.idsessioncenterlist = sessiondata.sessioncenterid;
            ajaxasyn(__URL + "Eimsystemsetting/Sessioncenterlist/select_page_data", postdata, true, 'POST', 'json', function (sessioncenterdata) {
                
                //sessiondata.sessioncentername = sessiondata.name;
                sessiondata.sessioncenterip = sessioncenterdata[0].ip;
                sessiondata.sessioncenterport = sessioncenterdata[0].port;
                console.log(sessioncenterdata[0]);
               
                try{
                    ws = new WebSocket("ws://" + location.hostname + ":" + '1334');
                    ws.onopen = function () {
                        ws.send(JSON.stringify({ sign: "sessionstatussync" }));

                    };
                    ws.onmessage = function (evt) {
                        console.log(evt.data);
                        if (JSON.parse(evt.data).result == "shakehandsok") {
                            var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.rdpv';
                            ws.send(JSON.stringify({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                        }
                    };
                    Connect_RDP();
                } catch (err) {
                    alert('连接失败！');
                    return;
                }
               
               
            }, function (errmsg) {
                layer.open({
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
                ws = new WebSocket("ws://" + sessiondata.sessioncenterip + ":" + '1334');
                ws.onopen = function () {
                    ws.send(JSON.stringify({ sign: "sessionstatussync" }));

                };
                ws.onmessage = function (evt) {

                    if (JSON.parse(evt.data).result == "shakehandsok") {
                        var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.rdpv';
                        ws.send(JSON.stringify({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                    }
                }
                Connect_RDP();
                } catch (e) {
                    alert("连接失败！");
                return;
            }
           
        }

    }, function (errmsg) {
        layer.open({
            title: "提示",
            content: '会话信息获取失败，请重新尝试！',
            end: function (index, layero) {
                window.close();
            }
        });
    });
}

function Connect_RDP() {
    sessiondata.settings = sessiondata.settings.RDP;
    //console.log(sessiondata);
    //return;
    //sessiondata.deviceinfo.loginpwd = "xincheneim2415";
    sessiondata.settings.__record_name = 'rdp_' + (new Date()).valueOf();
    sessiondata.settings.Session_Task_Id = _workid;

    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    if (sessiondata.settings.width != undefined && sessiondata.settings.width != "") {
        wWidth = parseInt(sessiondata.settings.width);
    }
    if (sessiondata.settings.height != undefined && sessiondata.settings.height != "") {
        wHeight = parseInt(sessiondata.settings.height);
    }
    var protocol = ('https:' == location.protocol) ? 'wss://' : 'ws://';
    var gw = sessiondata.sessioncenterip + ":" + sessiondata.sessioncenterport;
    var s = "";
    s += "server=" + sessiondata.deviceinfo.ip;
    s += "&user=" + sessiondata.deviceinfo.loginuser;
    s += "&pwd=" + sessiondata.deviceinfo.loginpwd;
    for (var k in sessiondata.settings) {
        s += "&" + k + "=" + sessiondata.settings[k];
    }
    /*
    server=192.168.7.110&port=3389&user=Administrator&pwd=Abcd1234!&keyboard=2052&width=0&height=0
        &fullBrowser=Full%20browser&fullScreen=Full%20screen&server_bpp=16
        &timezone=(GMT%2B08%3A00)%20W.%20Australia%20Standard%20Time&playSound=0&soundPref=0&mapClipboard=on
        &mapPrinter=on&mapDisk=on&startProgram=noapp&=Open&clear=Clear&delete=Delete&save=Save&connect=Connect

        ws://www.ppkive.com:1336/RDP?server=192.168.7.110&port=3389&user=Administrator
        &pwd=Abcd1234!&keyboard=2052&width=0&height=0&fullBrowser=Full%20browser
        &fullScreen=Full%20screen&server_bpp=16&timezone=(GMT%2B08%3A00)%20W.%20Australia%20Standard%20Time
        &playSound=0&soundPref=0&mapClipboard=on&mapPrinter=on&mapDisk=on&startProgram=noapp&=Open
        &clear=Clear&delete=Delete&save=Save&connect=Connect&=on
    */
    console.log(s);
    var server_bpp = sessiondata.settings.server_bpp;
    var r = svManager.getInstance();
    if (r == null) {
        r = new svGlobal.Rdp(protocol + gw + '/RDP?' + s, wWidth, wHeight, server_bpp);
    } else {
        var apps = r.getRunninApps();
        var len = apps.length;
        var isApp = sessiondata.startProgram == "noapp";
        var warn = r.isRemoteApp() && (!isApp);
        if (warn) {
            var s = 'Warning: A RemoteApp session is still active.\n\n';
            s += '\nPlease open a new Window for new sessions.\n';
            layer.open({
                title: "提示",
                content: s,
                end: function (index, layero) {
                    window.close();
                }
            });
        }
    }

    r.onclose = function (expected) {
        console.log('close, expected:' + expected);
    };
    var sur = new svGlobal.LocalInterface();
    r.addSurface(sur);
    sur.onremoteappicon = function (win, bitmap) {
        if (sur.toolbar && win.isMainWin() && bitmap.getWidth() == 32) {
            var id = 'win' + win.id;
            if (sur.toolbar.querySelector('#' + id)) {
                return;
            }
            var img = sur.toolbar.addButton(bitmap.getDataURL(), function () {
                win.activate(1);
            });
            img.id = id;
            img.title = win.titleInfo;
            img.style.width = '32px';
            img.style.height = '32px';
            img.addEventListener('mouseover', function () {
                img.title = win.titleInfo;
            }, false);
            setTimeout(function () {
                win.activate(1);
            }, 333);
        }
    };

    sur.onremoteappclose = function (win) {
        if (sur.toolbar) {
            var id = 'win' + win.id;
            var img = sur.toolbar.querySelector('#' + id);
            if (img) {
                sur.toolbar.removeChild(img);
            }
        }
    };
    r.onerror = function (e) {
        ws.onmessage = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据				  
            var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.rdpv';
            ws.send(JSON.stringify({type: "error", workid: _workid, auditfilename: filepath, userid: _USERID }));
            //  alert("数据发送中...");
        };
        
        console.log(e.name + ':' + e.message);                              
    };

    r.onready = function () {
        // r.startPing(2, 2);
    };

    r.onnoresponse = function () {
        console.log('no onnoresponse');
    };
    r.run();
    //新增审计记录
   // createAudit();
    window.document.title = sessiondata.deviceinfo.devicename + " RDP 会话";
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
//新增审计记录
//function createAudit() {
//    var postdata = new Object();
//    postdata.workid = _workid;
//    postdata.type = 'vedio';
//    postdata.filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.rdpv';
//    postdata.sessiontype = sessiondata.starttype;
//    ajaxasyn(__URL + "Eimaudit/Authfile/add_page_data", postdata, true, 'POST', 'json', function (data) {

//    }, function (errmsg) {
//        layer.msg("审计记录创建失败！", { icon: 5 });
//        });
//    }
