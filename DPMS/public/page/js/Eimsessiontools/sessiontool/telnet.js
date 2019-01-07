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
    postdata.$Decryption = true;
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
            ajaxasyn(__URL + "Eimsystemsetting/Sessioncenterlist/select_page_data", postdata, true, 'POST', 'json', function (sessioncenterdata) {
                sessiondata.sessioncentername = sessioncenterdata[0].name;
                sessiondata.sessioncenterip = sessioncenterdata[0].ip;
                sessiondata.sessioncenterport = sessioncenterdata[0].port;
                try {
                    ws = new WebSocket("ws://" + location.hostname + ":" + '1334');
                    ws.onopen = function () {
                        // Web Socket 已连接上，使用 send() 方法发送数据				  
                        var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.telnetv';
                        ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                        // console.log({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID })
                        //  alert("数据发送中...");
                    };
                    Connect_SSH();
                } catch (err) {
                    alert('连接失败！');
                    return;
                }
                console.log(sessioncenterdata);

                Connect_SSH();
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
                    var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.telnetv';
                    ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "start", workid: _workid, auditfilename: filepath, userid: _USERID }));
                    // console.log({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID })
                    //  alert("数据发送中...");
                };
                Connect_SSH();
            } catch (err) {
                alert('连接失败！');
                return;
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

function Connect_SSH() {    
    sessiondata.settings = sessiondata.settings.TELNET;
    //console.log(sessiondata);
    //return;
    //sessiondata.deviceinfo.loginpwd = "xincheneim2415";
    sessiondata.settings.__record_name = 'telnet_' + (new Date()).valueOf() ;
    sessiondata.settings.Session_Task_Id = _workid;

    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    if (!sessiondata.settings.width) {
        wWidth = sessiondata.settings.width;
    }
    if (!sessiondata.settings.height) {
        wHeight = sessiondata.settings.height;
    }
    var protocol = ('https:' == location.protocol) ? 'wss://' : 'ws://';
    var gw = sessiondata.sessioncenterip + ":" + sessiondata.sessioncenterport;
    var s = "";
    s += "server=" + sessiondata.deviceinfo.ip;
    for (var k in sessiondata.settings) {
        s += "&" + k + "=" + sessiondata.settings[k];
    }
    var parms = protocol + gw + '/TELNET?' + s;
    /*    
    ws://www.ppkive.com:1336/TELNET?server=192.168.7.191&port=23&mapClipboard=on&fontSize=13
    &clear=Clear&clear=Delete&save=Save&connect=Connect
    */
    var r = new svGlobal.TELNET(parms, wWidth, wHeight);
    r.onclose = function () {
        r.hide();
    };
    r.addSurface(new svGlobal.LocalInterface());
    r.onerror = function (e) {      
        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据				  
            var filepath = '../recording/' + P_getMyDate() + "/" + sessiondata.settings.__record_name + '.telnetv';
            ws.send(JSON.stringify({ sign: 'sessionstatussync', type: "error", workid: _workid, auditfilename: filepath, userid: _USERID }));
            // console.log({ type: "start", workid: _workid, auditfilename: filepath, userid: _USERID })
            //  alert("数据发送中...");
        };
        console.log(e.name + ':' + e.message);
    };
    r.run();
    //新增审计记录
    createAudit();
    window.document.title = sessiondata.deviceinfo.devicename + " Telnet 会话";
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
//    postdata.filepath = '../recording/'+P_getMyDate()+"/"+sessiondata.settings.__record_name+'.telnetv';
//    postdata.sessiontype = sessiondata.starttype;
//    ajaxasyn(__URL + "Eimaudit/Authfile/add_page_data", postdata, true, 'POST', 'json', function (data) {

//    }, function (errmsg) {
//        layer.msg("审计记录创建失败！", { icon: 5 });
//    });
//}







