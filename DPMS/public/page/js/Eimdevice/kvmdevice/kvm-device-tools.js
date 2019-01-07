/*
2017年8月29日18:50:54
KVM设备管理页面公共js

*/

//刷新按钮
$('#refresh').off('click');
$("#refresh").click(function () {
    _reload();
});
//添加 KVM设备弹框
function btn_add_device() {
    parent.layer_show('添加设备', __APP + '/Eimdevice/Kvmdevice/page_get_add_device_page', '400', '450', function (dom) {
        if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
            window.location.reload();
        }
    });
}



/*
    同步UMG设备
		1.将同步命令写入文件,
		2.后台服务执行命令,返回执行结果的文件路径
		3.查询该文件查看执行结果
*/
//umg设备同步
function btn_refresh_umg(doid, ip, dname) {
    var url = __APP + "/Eim/DpmsSetting/device_sync_page?doid=" + doid + "&ip=" + ip + "&dname=" + dname + "&devicetype=umg";
    //parent.layer_show('同步设备', url, '300', '300', function (dom) {
    //    if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
    //        window.location.reload();
    //    }
    //});
    parent.layer.open({
        type: 2,//可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '同步设备',
        content: url,
        area: ['300px', '300px'],
        shadeClose: true,
        shade: false,
        end: function () {
            if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
                window.location.reload();
            }
        }
    });

    return;
}


//编辑 事件
function btn_edit_device(_id) {
    var url = __APP + '/Eimdevice/Kvmdevice/page_get_edit_device_page?id=' + _id;
    var _index = layer.open({
        type: 2,
        title: '编辑设备',
        area: ["617px", "495px"],
        maxmin: false, //开启最大化最小化按钮
        content: url,
        end: function (dom) {
            if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
                window.location.reload();
            }
        }
    });
    layer.full(_index);
}

//编辑 子集设备编辑
function btn_port_edit_device(doid) {
    parent.layer_show('设备编辑', __APP + '/Eimdevice/Kvmdevice/page_get_edit_child_device_page?deviceOid=' + doid, '', '550', function (dom) {
        if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
            window.location.reload();
        }
    });
}
//删除 事件 包括子集设备
function btn_del_device(doid, ip, dname) {
    var confirmstr = "是否删除设备名称为 [ " + dname + " ] 的设备？";
    if (dname == "") {
        confirmstr = "是否删除IP为[" + ip + "]的设备？";
    }
    parent.layer.confirm(confirmstr, function (index) {
        ajaxasyn(__URL + '/HuiKVM/delKVMdevice', { "deviceoid": doid, "ip": ip }, true, 'POST', 'json', function (msg) {
            if (msg == "ok") {
                parent.layer.msg('删除成功', { icon: 6 });
                _reload();
            } else {
                parent.layer.msg('删除失败', { icon: 5 });//5:哭脸
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
    });
}

function get_device_session_btn_html_list(action_button, attrs_html, device, pdevice) {
    var session_btn_html = "";
    var device_dname = device.hasOwnProperty("kvmDeviceName") && device.kvmDeviceName != "" ? device.kvmDeviceName : device.deviceName;
    var eID = device.EID;
    var btn=[];
    $.each(action_button, function (k, v) {
        if (v.constructor == Array&&eID.substring(0, 3) == k) {                         
                    btn = action_button[k];
                    return false;                         
        } else {
            btn = action_button;
        };
       
       
    });

   
    for (var i = 0; i < btn.length; i++) {
        var key = btn[i];
        session_btn_html += "&nbsp;" + attrs_html[key].format({
            doid: device.deviceOid,
            poid: pdevice.deviceOid,
            did: device._id,
            ipAddress: device.ipAddress,
            unitType: pdevice.unitType,
            syncFlag: device.syncFlag,
            dname: device_dname
        }) + "&nbsp;";
    }
    return session_btn_html;
}

//设备排序
function btn_sort_device(d_oid, index) {
    var postdata = {};
    postdata.deviceOid = d_oid;
    postdata.index = index;
    ajaxasyn(__URL + "/HuiKVM/async_kvm_device_sort", postdata, true, 'POST', 'json', function (msg) {
        if (msg == "ok") {
            parent.layer.msg('排序成功', { icon: 6 });
            _reload();
        } else {
            parent.layer.msg('排序失败', { icon: 5 });
        }
    }, function (errmsg) {
        parent.layer.msg('排序失败', { icon: 5 });
    });
}