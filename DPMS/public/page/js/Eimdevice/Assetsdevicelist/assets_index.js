_try();
$(function () {
    datatable_bind();
    //判断浏览器是否支持canvas
    if (!is_canvasSupport()) {
        layer.alert('当前浏览器版本过低，建议升级或使用 Chrome 浏览器 ', {
            skin: 'layui-layer-lan'
          , closeBtn: 0
          , anim: 4 //动画类型
        });
        return;
    }

   
   
   
});
var postdata = {};
var values = {};
function build_value(_this) {
    var data = table.row($(_this).parents('tr')).data();
    var check_status = $(_this).prop("checked");
    if (check_status == true) {
        values['_id'+data._id.$id]=$(_this);
    } else {
      //  var _ids = Object.keys(values);获取obj所有键名

       delete values['_id' + data._id.$id];//删除键对应的val

    }    
}
function _click() {
   
    postdata = {};
   var value_num= Object.keys(values);
   if (value_num.length < 2) {
        _layer.msg("请选择至少两个设备",{icon:2});
        return;
    }
    var flag = false;
    var html = "";
    $.each(values, function (i, val) {
        var data = table.row(val.parents('tr')).data();
        //组建提交数据
        var val_obj = {};
        val_obj.deviceoid = data.deviceOid;
       // val_obj.sessiontype = 'rdp';       
        val_obj.devicetype = "ASSETS";
        if (Object.getOwnPropertyNames(data.manageMode).length == 1) {
            var input_html = "";
            $.each(data.manageMode, function (key) {
                val_obj.sessiontype = key;
                input_html = '<input class="session_input" name="input_'+i+'" value="' + key + '"  disabled   style="width:200px;"/>';
            });
            //组建html询问框       
            html += '<div class="clearfix" style="margin-top:10px;"><label class="col-xs-4 text-right" style="color:blue; margin-left:10px;">' + data.DeviceName + ':</label>' +
                     '<div class="col-xs-5 text-left">' + input_html + '</div></div>';
        }
      else  if (Object.getOwnPropertyNames(data.manageMode).length > 1) {
            flag = true;
            val_obj.sessiontype = [];
            var input_html  = "<select  class='session_select' style='width:200px;' name='select_"+i+"'>";
            $.each(data.manageMode, function (key) {
                val_obj.sessiontype.push(key);
                input_html += "<option value=" + key + ">" + key + "</option>";
            });
            input_html += "</select>";
            //组建html询问框       
            html += '<div class="clearfix" style="margin-top:10px;"><label class="col-xs-4 text-right" style="color:blue; margin-left:10px;">' + data.DeviceName + ':</label>' +
                    '<div class="col-xs-5 text-left">' + input_html + '</div></div>';
        }
        postdata["data" + i] = val_obj;
        

    });
    if (flag == true) {
      
        _layer.open({
            type: 1,
            title: '打开会话方式',
            closeBtn: 0,
            area: ['50%', '40%'],
            btn: ['确定', '取消'],
            shadeClose: true,
            content: html,
            yes: function (index, layero) {                           
                var selects = $(layero[0]).find(".session_select");               
                $.each(selects, function (j, select) {
                    var num = $(select).prop("name").substring(7);
                    postdata["data" + num].sessiontype = $(select).find("option:selected").val();
                    //  console.log(postdata["data" + num].sessiontype);

                });
                open_more_page(postdata);
               
                _layer.close(index);
            }
            , btn2: function (index) {
               // alert(2);
                _layer.close(index);
            }
        });
    } else {
        open_more_page(postdata);
       
    }

    


};

function open_more_page(postdata) {
    ajaxasyn(__URL + '/SplitScreenMonitor/async_get_session_parms', postdata, true, 'POST', 'json', function (msg) {
        if (msg.success == false) {
            layer.msg(msg.showinfo, { icon: 2 });
            return;
        } else if (msg.constructor.name === "Array") {
          
            var obj = {};
            var taskid_str = "";
            var url = __URL + '/SplitScreenMonitor/get_splitScreenMonitoring_page';
            $.each(msg, function (i, v) {
                taskid_str += (v.taskid + ',');
                obj["dname" + v.taskid] = v.title;
            });
            obj.taskid = taskid_str;

            P_Post(url, obj);
        }
    }, function (errorMsg) {
        var index = layer.open({
            type: 1,
            title: '错误信息',
            content: errorMsg.responseText,
            maxmin: true
        });
        layer.full(index);
    });
}
function datatable_bind() {
    var column_0 = "<i class='fa fa-desktop bigger-120'></i>";
    var column_t = "";
    if (_multisessionMode == 1) {
        column_0 = '<label class="pos-rel">\
								<input type="checkbox"  class="ace"  name="devices" onChange=" build_value(this);" />\
								<span class="lbl"></span>\
								</label>';
        column_t = '<a class="blue" onClick="_click()" style="font-weight:400">会话</button>&nbsp;&nbsp;<a href="javascript:;" class="blue" onClick="checked_all()">全</a>/<a href="javascript:;" class="blue" onClick="reverse_checked()">反</a>';
    }
    _btn_icon = JSON.parse(_btn_icon);
    table = $('.table-sort').DataTable({
        "destroy": true,//销毁        
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": __APP + '/Eimdevice/Accetsdevice/Sync_get_AssetsDevice_data'
        },
        //"pageLength": parseInt(_dt_pagelength),//改变初始页面长度(每页的行数)

        "lengthChange": true,
        "paging": true,
        //当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "deferRender": true,
        //状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
        "bStateSave": true,
        "autoWidth": false,//自动宽度
        "language": dataLanguage,
        "iDisplayLength": _dt_pagelength,//默认显示的记录数  
        "lengthMenu": _dt_lengthMenu,//表格显示行数选项，根据_dt_pagelength设置初始值
        "columns": [
            { title: column_t, 'width': '8%' },
            { title: '设备名称', data: 'DeviceName' },
            { title: 'IP地址', data: 'DeviceIPAddress' },
            { title: '负责人', data: 'Contactpeople' },
            { title: '备注', data: 'remark' },
            { title: '操作', data: 'manageMode' },
            { title: '编辑'},
        ],
        "columnDefs": [{
            "targets": 0, "data": null,'className':'text-center',
            "defaultContent": column_0,
            "orderable": false
        }, {
            "targets": 5, "orderable": false,
            "render": function (data, type, row) {
                var _html = '';
                for (var name in data) {
                    img = _btn_icon[name];
                    _html += '<div id="div_operath" style="display:inline-block;"><img alt="' + img + '"  width="18" height="18" src="' + __IMGPATH + "sessionIcon/" + img + '"  />&nbsp;<a href="javascript:;" class="session"  title="{0}">{1}&nbsp;</a></div>'.format(name, name);
                }
                return _html;
            }
        }, {
            "targets": 6, "orderable": false,
            defaultContent: btn_edit,

        }]
    });
    initTableEvent();
}
//全选
function checked_all() {
    var inputs = $("input[name=devices]");
    $.each(inputs,function (i,input) {
        if (!$(input).prop("checked")) {
            $(input).prop("checked",true);
            var data = table.row($(this).parents('tr')).data();
            values['_id' + data._id.$id] = $(this);
        }
    });
}
//反选
function reverse_checked() {
    var inputs = $("input[name=devices]");
    $.each(inputs,function (i, input) {
        var data = table.row($(this).parents('tr')).data();
        if ($(input).prop("checked")) {
            $(input).prop("checked", false);
            delete values['_id' + data._id.$id];//删除键对应的val
           
        } else {
            $(input).prop("checked", true);
            values['_id' + data._id.$id] = $(this);
        }
    });
}
    //表格点击事件
    function initTableEvent() {
        $('.table-sort tbody').off('click');
        $('.table-sort tbody').on('click', 'a', function (event) {
            var data = table.row($(this).parents('tr')).data();
            var targetname = event.target.className.toString();
            if (targetname.indexOf("update") > -1) {
                onEditDeviceBox(data.deviceOid);
            } else if (targetname.indexOf("delete") > -1) {
                btnDelDevice(event.target, data._id.$id, data.DeviceIPAddress, data.deviceOid);
            } else if (targetname.indexOf("session") > -1) {
                _openSesseion(event.target.title, data.deviceOid, data.DeviceName, data.DeviceIPAddress);
            }
        });
    }

    //添加设备btn
    function onAddAccetsDeviceBox() {
        var url = __URL + '/HuiKVM/get_add_AssetsDevice_page';
        //var id = "iframe_get_add_AssetsDevice_page";
        //parent.addTabs({ id: id, title: "添加", url: url, close: true });

        //parent.layer_show('添加设备', url, '30%', '80%', function (dom) {
        //    if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
        //        window.location.reload();
        //    }
        //});


        var index = _layer.open({
            type: 2,
            title: '添加设备',
            area:['60%','80%'],
            maxmin: false, //开启最大化最小化按钮
            content: url,
            end: function (dom) {
                if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
                    window.location.reload();
                }
            }
        });
        //layer.full(index);

        //layer_show('添加资产设备', __URL + '/HuiKVM/get_add_AssetsDevice_page', '', '350', function (dom) {
        //    if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
        //        window.location.reload();
        //    }
        //});
    }
    //编辑设备
    function onEditDeviceBox(doid) {
        var url = __URL + '/HuiKVM/get_add_AssetsDevice_page?doid=' + doid;
        var index = _layer.open({
            type: 2,
            area: ['85%', '100%'],
            title: '编辑资产设备',
            maxmin: false, //开启最大化最小化按钮
            content: url,
            end: function (dom) {
                if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
                    window.location.reload();
                }
            }
        });
        layer.full(index);
    }
    //删除设备
    function btnDelDevice(objthis, did, dip, doid) {
        var del_index=_layer.confirm('是否删除IP为[ ' + dip + ' ]的设备？', function (index) {
            ajaxasyn(__URL + '/HuiKVM/del_AssetsDevice_data', { "deviceid": did, "ip": dip, "deviceOid": doid }, true, 'POST', 'json', function (msg) {
                if (msg == "ok") {
                    $(objthis).parents("tr").remove();
                    _layer.msg('删除成功');
                } else {
                    _layer.msg('删除失败');
                }
                _layer.close(del_index);
            }, function (errorMsg) {
                var index = layer.open({
                    type: 1,
                    title: '错误信息',
                    content: errorMsg.responseText,
                    maxmin: true
                });
                layer.full(index);
            });
        });
    }

    //引导
    function btn_help() {
        // Set up tour
        $('body').pagewalkthrough({
            name: 'introduction',
            steps: [{
                wrapper: '#DataTables_Table_0_length', popup: { content: '#walkthrough-1', type: 'tooltip', position: 'bottom' }
            }, {
                wrapper: '#DataTables_Table_0_filter', popup: { content: '#walkthrough-2', type: 'tooltip', position: 'bottom' }
            }, {
                wrapper: '#DataTables_Table_0', popup: { content: '#walkthrough-4', type: 'tooltip', position: 'bottom' }
            }, {
                wrapper: '#DataTables_Table_0_info', popup: { content: '#walkthrough-3', type: 'tooltip', position: 'bottom' }
            }, ]
        });
        // Show the tour
        $('body').pagewalkthrough('show');
    }







    /*
      开启会话
      1.查询会话密码
      2.判断密码-一个，多个，没有
      3.判断会话类型 ssh TELNET rdp
      3.开启会话
    */
    //1.发起会话 - 流程控制开始
    var _devicename = "";//记录开启会话的设备名称
    var _serverip = __serverip;
    function _openSesseion(sessiontype, d_oid, dname, d_ip) {
        //2017-08-09 16:40:01 优化开启会话
        var device = {};
        device.dname = dname;
        device.dtype = "ASSETS";
        device.deviceOid = d_oid;
        device.viewOnly = "false";//vnc会话需要
        Open_Session(sessiontype, device);
        return;
    
        ////因苹果浏览器安全限制，不支持弹框会话，在开启会话时限制判断浏览器类型
        //var mybrowser = P_check_browser();
        //if (mybrowser == "Safari") {
        //    parent.layer.msg("请使用Chrome浏览器或Firefox浏览器");
        //    return;
        //}
        ////判断浏览器是否支持Canvas
        //if (!is_canvasSupport()) {
        //    parent.layer.alert('当前浏览器版本过低，建议升级或使用 Chrome 浏览器', {
        //        skin: 'layui-layer-lan',
        //        closeBtn: 0,
        //        anim: 4
        //    });
        //    return;
        //}
        //if (_serverip == "") {
        //    parent.layer.open({
        //        title: '提示',
        //        content: '开启会话失败，请先配置服务器IP地址'
        //    });
        //    return;
        //}
        //_devicename = dname;
        ////2.获取密码
        //_get_pwd(d_oid, sessiontype);
    }

    ////2.获取密码，是否存在密码，返回密码ID
    //function _get_pwd(doid, sessiontype) {
    //    //查看是否有密码可以访问
    //    ajaxasyn(__URL + "/HuiKVM/get_openSession_pwd", { 'deviceoid': doid }, true, 'POST', 'json', function (msg) {
    //        _setEnmuPwd(msg, sessiontype, doid);
    //    }, function (errmsg) {
    //        var index = parent.layer.open({
    //            type: 1,
    //            title: '错误信息',
    //            content: errmsg.responseText,
    //            maxmin: true
    //        });
    //        layer.full(index);
    //    });
    //}

    ////2.1判断密码
    //function _setEnmuPwd(result_pwdid, sessiontype, d_oid) {
    //    if (result_pwdid == "no" || result_pwdid == "error" || result_pwdid == "pwd") {
    //        layer.msg('请检查密码配置！', { icon: 5 });
    //        return;
    //    } else if (typeof (result_pwdid) == "object") {
    //        //2.1 分支：多个密码返回用户选择的密码
    //        result_pwdid = _enmuPwd(result_pwdid, sessiontype, d_oid);
    //    } else {
    //        //开启会话
    //        _openUrl(sessiontype, d_oid, result_pwdid, "false");
    //    }
    //}

    ////2.2枚举密码 ，判断是否可以会话 返回选择后的密码id
    //function _enmuPwd(pwdlist, sessiontype, d_oid) {
    //    var layerhtml = "";
    //    for (var i = 0; i < pwdlist.length; i++) {
    //        var pwdid = pwdlist[i]._id.$id;
    //        var loginname = pwdlist[i].loginname;
    //        var loginpwd = pwdlist[i].loginpwd;
    //        var remark = pwdlist[i].remark;
    //        layerhtml += "<div class='container-fluid'>\
    //            <div class='radio-box'>\
    //            <input id='inputpwd-{P_id}' name='pwd' type='radio' value='{P_pwdid}' loginname='{P_loginname}' loginpwd='{P_loginpwd}'/>\
    //            <label for='inputpwd-{P_idd}' style='cursor:pointer;' >{P_loginname2} : {P_remark}</label>\
    //            </div></div>".format({ P_id: i, P_pwdid: pwdid, P_loginname: loginname, P_loginpwd: loginpwd, P_idd: i, P_loginname2: loginname, P_remark: remark });
    //    }
    //    parent.layer.confirm("请选择用于开启会话的帐号：" + layerhtml, { title: '提示', zIndex: layer.zIndex }, function (index) {
    //        //do something
    //        var pwdid = $('input:radio[name="pwd"]:checked').val();
    //        if (pwdid == null) {
    //            layer.msg("请选择密码");
    //            return;
    //        }
    //        //关闭密码弹框
    //        parent.layer.close(index);
    //        //开启会话
    //        _openUrl(sessiontype, d_oid, pwdid, "false");
    //    });
    //}

    ////4.开启会话
    //function _openUrl(sessiontype, d_oid, pwdid, viewOnly) {
    //    var loadlayer = layer.msg('正在开启会话，请稍后...', { icon: 16, time: 5000 });
    //    var parmobj = {};
    //    parmobj.viewOnly = viewOnly;//VNC会话需要
    //    parmobj.deviceoid = d_oid;//资产设备存设备oid
    //    parmobj.pwdid = pwdid;//密码ID
    //    parmobj.deviceflag = "ASSETS";//表示资产设备
    //    parmobj.sessiontype = sessiontype; //SSH TELNET RDP VNC iLO4
    //    var url = __URL + '/HuiKVM/openSession';
    //    ajaxasyn(url, parmobj, true, 'POST', 'json', function (msg) {
    //        if (msg.indexOf("xinchen://AAAAAAAAAA") != -1) {
    //            window.location.href = msg;
    //        } else if (msg == "apprelease") {
    //            parent.layer.msg("请关联应用发布服务器");
    //            return;
    //        } else if (msg == "pwd") {
    //            parent.layer.msg("请选择密码");
    //            return;
    //        } else if (msg.indexOf("sessiontype") >= 0) {
    //            parent.layer.msg("未识别的会话类型:" + msg);
    //            return;
    //        } else {
    //            parent.layer.close(loadlayer);
    //            openWebSShWindows(msg, sessiontype.toLowerCase(), 'user');
    //        }
    //    }, function (errorMsg) {
    //        var index = parent.layer.open({
    //            type: 1,
    //            title: '错误信息',
    //            content: errorMsg.responseText,
    //            maxmin: true
    //        });
    //        parent.layer.full(index);
    //    });
    //}

    ////Web Shell 会话
    //function openWebSShWindows(taskid, sessiontype, usertype) {
    //    var _titleName = _devicename + "-" + sessiontype.toUpperCase() + " 会话";

    //    //GET提交
    //    ////弹出浏览器新tab页
    //    //var _href_ = __URL + "/HuiWebshell/open_gateway_session?taskid=" + taskid + "&title=" + _titleName + "&sessiontype=" + sessiontype + "&usertype=" + usertype;
    //    ////window.open(_href_);
    //    //window.open(_href_, "", "width=800,height=600,resizable=no,scrollbars=no");

    //    //POST提交
    //    var url = __URL + "/HuiWebshell/open_gateway_session";
    //    var postdata = {};
    //    postdata.taskid = taskid;
    //    postdata.title = _titleName;
    //    postdata.sessiontype = sessiontype;
    //    postdata.usertype = usertype;
    //    P_Post(url, postdata);
    //}



    $("#btn100026").click(function () {
        _reload();
    });
