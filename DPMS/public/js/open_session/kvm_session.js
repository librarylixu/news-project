/*
    2017-07-19 13:03:24 
    开启会话流程
    KVM设备 和 资产设备开启会话均可调用该流程
    开启会话公共参数：
    sessiontype = 会话类型
    device = {};
    device.dname = 设备名称
    device.dtype = 设备类型（KVM 、ASSETS）
    device.deviceOid = 设备OID
    KVM 设备开启会话所需参数：
    device.parentID = 设备父级id
*/


// 开启会话
var _open_session_device = "";//当前开启会话的设备信息
var _sessiontype = "";
function Open_Session(sessiontype, device) {
    sessiontype = sessiontype.toLowerCase();
    //webshell会话需要浏览器支持
    if (sessiontype == "ssh" || sessiontype == "telnet") {
        //因苹果浏览器安全限制，不支持弹框会话，在开启会话时限制判断浏览器类型
        var mybrowser = P_check_browser();
        if (mybrowser == "Safari") {
            parent.layer.msg("请使用Chrome浏览器或Firefox浏览器");
            return;
        }
        //判断浏览器是否支持canvas
        if (!is_canvasSupport()) {
            parent.layer.alert('当前浏览器版本过低，建议升级或使用 Chrome 浏览器 ', {
                skin: 'layui-layer-lan'
              , closeBtn: 0
              , anim: 4 //动画类型
            });
            return;
        }
    }
    _open_session_device = device;
    if (device.dtype == "KVM") {
        switch (device.port_status) {
            case "Active":
                parent.layer.confirm("是否抢占会话？", { title: '提示' }, function (index) {
                    //关闭密码弹框
                    parent.layer.close(index);
                    btn_open_session(sessiontype);
                });
                break;
            default:
                btn_open_session(sessiontype);
        }
    } else {
        btn_open_session(sessiontype);
    }
}
//开启会话
function btn_open_session(sessiontype) {
    if (_serverip == "") {
        parent.layer.open({
            title: '提示',
            content: '请先配置服务器IP地址'
        });
        return;
    }
    _sessiontype = sessiontype;
    //存在说明为KVM设备
    if (_open_session_device.hasOwnProperty("parentID")) {
        //1.检查设备序列号是否在授权中
        check_device_sn(_open_session_device.parentID);
        //if (check_device_sn(_open_session_device.parentID)) {
        //    layer.msg("无法识别的设备，请检查设备序列号！");
        //    return;
        //}
    } else {
        //2.获取密码
        _get_pwd();
    }
}
//检查设备序列号 参数：父级设备oid
function check_device_sn(p_d_oid) {
   
    ajaxasyn(__APP + "/Eim/SessionTools/async_check_device_sn", { 'deviceoid': p_d_oid }, true, 'POST', 'json', function (msg) {
        if (msg == "ok") {
            //2.获取密码
            _get_pwd();
        } else {
            parent.layer.alert('无法识别的设备，请检查设备序列号！', {
                closeBtn: 0,
                //anim: 4 //动画类型
            });
        }
    }, function (errmsg) {
        parent.layer.msg("检测设备序列号异常，请重试！");
        return;
    });
}
//2.获取密码
function _get_pwd() {
    var postdata = {};
    postdata.sessiontype = _sessiontype;
    if (_open_session_device.dtype == "KVM") {
        postdata.p_oid = _open_session_device.parentID;
        postdata.deviceoid = _open_session_device.deviceOid;
    } else if (_open_session_device.dtype == "ASSETS") {
        postdata.deviceoid = _open_session_device.deviceOid;
        postdata.deviceflag = "ASSETS";//表示资产设备
        if (_open_session_device.hasOwnProperty("viewOnly")) {
            postdata.viewOnly = _open_session_device.viewOnly;//vnc会话需要
        }
    }
    ajaxasyn(__URL + "/HuiKVM/get_openSession_pwd", postdata, true, 'POST', 'json', function (msg) {
         _setEnmuPwd(msg);       
    }, function (errmsg) {
        var index = parent.layer.open({
            type: 1,
            title: '错误信息',
            content: errmsg.responseText,
            maxmin: true
        });
        parent.layer.full(index);
    });
}
//3.判断密码
function _setEnmuPwd(result) {
    var param = {};
    if (result.showinfo) {
        parent.layer.msg(result.showinfo, { icon: 5 });
        return;
    } else if (result.isopen) {
        //3.开启会话
        open_session_by_result(result.taskid);
    } else {
        _enmuPwd(result.pwdlist, result.gatewaylist);
    }
        
}

//2.2枚举密码 ，判断是否可以会话 返回选择后的密码id
function _enmuPwd(pwdlist,gatewaylist) {
    var pwd_html = '';
    var gateway_html = '';
    var layerhtml = "";
    var _check = -1;

    for (var i = 0; i < pwdlist.length; i++) {
        var pwdid = pwdlist[i]._id.$id;
        var loginname = pwdlist[i].loginname;
        var loginpwd = pwdlist[i].loginpwd;
        var remark = pwdlist[i].remark;
        //if (i == 0) {
        //    _check = 1;
        //} else {
        //    _check = 0;
        //}
        //layerhtml += "<div class='radio-box'><label id='inputpwd-" + i + "' name='pwd' value='" + pwdid + "' loginname='" + loginname + "' loginpwd='" + loginpwd + "' style='cursor:pointer;'>" + loginname + " : " + remark + "</label></div>";
        layerhtml += "\
            <div class='radio-box'>\
            <input id='inputpwd-{P_id}' name='pwd' type='radio'  value='{P_pwdid}' loginname='{P_loginname}' loginpwd='{P_loginpwd}' checked={P_checked}/>\
            <label for='inputpwd-{P_idd}'   style='cursor:pointer;' >{P_loginname2} : {P_remark}</label>\
            </div>".format({ P_id: i, P_pwdid: pwdid, P_loginname: loginname, P_loginpwd: loginpwd, P_idd: i, P_loginname2: loginname, P_remark: remark, P_checked: _check });

    }
    pwd_html = "<div class='col-xs-6'><label class='blue strong'>请选择用于开启会话的帐号:</label><div class='radio-group'>" + layerhtml + "</div></div>";

    if (gatewaylist) {
       
        var layerhtml = "";
        var _check = 'checked';
        $.each(gatewaylist, function (i, v) {
            var _id = v._id.$id;
            var ip = v.ip;
            //layerhtml += "<div class='radio-box'><label id='inputpwd-" + i + "' name='pwd' value='" + pwdid + "' loginname='" + loginname + "' loginpwd='" + loginpwd + "' style='cursor:pointer;'>" + loginname + " : " + remark + "</label></div>";
            layerhtml += "\
            <div class='radio-box'>\
            <input id='inputgateway-{P_idd}' name='gateway' type='radio'  value='{P_id}' {P_checked} />\
            <label for='inputgateway-{P_iddd}' style='cursor:pointer;' >{P_ip}</label>\
            </div>".format({ P_id: _id, P_idd: _id, P_iddd: _id, P_ip: ip, P_checked: _check });
        });      
        gateway_html = "<div class='col-xs-6'><label class='blue strong'>请选择用于开启会话的gateway:</label><div class='radio-group'>" + layerhtml + "</div></div>";
    }
    //, zIndex: layer.zIndex 
    var parentlayerindex = parent.layer.confirm("<div class=row>" + pwd_html+gateway_html+'</div>', { title: '提示', zIndex: parent.layer.zIndex,area:['550px','300px;'] }, function (index) {
       
        var data_param = {};
        var gatewayid=parent.$('input:radio[name="gateway"]:checked').val();
        //alert(pwdid);
        //return;
        if (pwdid == null) {
            parent.layer.msg('请选择密码');
            return;
        }
        if(gatewayid!==undefined||gatewayid!==null){
            data_param.gateway=parent.$('input:radio[name="gateway"]:checked').val();
        }else{
            data_param.gateway='';
        }
        data_param.pwdid=parent.$('input:radio[name="pwd"]:checked').val();
        
        //关闭密码弹框
        parent.layer.close(parentlayerindex);
        //3.开启会话
        _openUrl(data_param);
        //return data_param;
        
    });
    
}
var pwdid;
function on_select_pwd(thisobj) {
    alert("1");
}
////点击选中
//$(function () {
//    $(document).on("click",".radio-box",function () {
//        pwdid = $(this).find("label[name='pwd']").val();
//        $(this).parent().find("label[name='pwd']").removeClass("hover");
//        $(this).find("label[name='pwd']").addClass("hover");
//    });
//});
//4.开启会话
function _openUrl(pwdid) {
    
    var parmobj = {};
    parmobj.sessiontype = _sessiontype;
    parmobj.pwdid = pwdid.pwdid;
    if (pwdid.gateway) {
        parmobj.gateway = pwdid.gateway;
    }
    parmobj.deviceoid = _open_session_device.deviceOid;
    //KVM设备
    if (_open_session_device.dtype == "KVM") {
        parmobj.parentoid = _open_session_device.parentID;        
    } else if (_open_session_device.dtype == "ASSETS") {
        parmobj.deviceflag = "ASSETS";//表示资产设备
        if (_open_session_device.hasOwnProperty("viewOnly")) {
            parmobj.viewOnly = _open_session_device.viewOnly;//vnc会话需要
        }
    }
    var url = __URL + '/HuiKVM/openSession';
    ajaxasyn(url, parmobj, true, 'POST', 'json', function (msg) {
        open_session_by_result(msg);
        
    }, function (errorMsg) {
        var index = parent.layer.open({
            type: 1,
            title: '错误信息',
            content: errorMsg.responseText,
            maxmin: true
        });
        parent.layer.full(index);
    });
}

//根据返回值类型开启会话
function open_session_by_result(msg) {
    var loadlayer = parent.layer.msg('正在开启会话，请稍后...', { icon: 16, time: 5000 });//
    try {
        //alert(msg);
        //return;
        if (msg.indexOf("xinchen://AAAAAAAAAA") != -1) {
            window.location.href = msg;
        } else if (msg == "apprelease") {
            parent.layer.msg('请先关联应用发布服务器！', { icon: 5 });
        } else if (msg == "sessiontype") {
            parent.layer.msg('未识别的会话类型！', { icon: 5 });
        } else if (msg != "no") {
            parent.layer.close(loadlayer);
            //返回taskid，用于webssh会话[msg=taskid]---Web Shell 会话
            //layer.msg('工单已创建！');
            openWebSShWindows(msg, 'user');
        } else {
            parent.layer.msg('操作失败！', { icon: 5 });
        }
    } catch (e) {
        parent.layer.msg('操作失败！', { icon: 5 });
    }
}

//Web Shell 会话
function openWebSShWindows(taskid, usertype) {
    var _titleName = _open_session_device.dname + " " + _sessiontype + " 会话";
    //POST提交
    var url = __URL + "/HuiWebshell/open_gateway_session";
    var postdata = {};
    postdata.taskid = taskid;
    postdata.title = _titleName;
    postdata.sessiontype = _sessiontype.toLocaleLowerCase();
    postdata.usertype = usertype;
    postdata.deviceid = _open_session_device.deviceOid;
    P_Post(url, postdata, '_blank');
}

