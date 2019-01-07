/*
    2017-04-10 10:04:21
    KVM设备管理页面新布局
*/
$(document).ready(function () {
    init_kvm_device_show_field_and_button();

});
//子集设备显示字段数据源
var _kvm_device_show_field = new Object();
//设备显示按钮数据源
var _kvm_device_show_button = new Object();
//初始化子集设备需要显示的字段及所有设备按钮的数据源
function init_kvm_device_show_field_and_button() {
    ajaxasyn(__APP + '/Eimbase/Authority/async_get_kvm_show_field_button', {}, true, 'POST', 'json', function (data) {
        if (data.hasOwnProperty("field")) {
            _kvm_device_show_field = data.field;
        }
        if (data.hasOwnProperty("button")) {
            _kvm_device_show_button = data.button;
        }
        datatable_bindding_parnet();

    }, function (errorMsg) { });
}



var table = null;
//绑定表格父级设备
function datatable_bindding_parnet() {
    var pagelength = _dt_pagelength == "" ? 10 : parseInt(_dt_pagelength);
    if (table != null) {
        table.destroy();
        $('#example').empty();
    }
    table = $('#example').DataTable({
        "destroy": true,//销毁   
        "autoWidth": false,//如果已经指定了列宽,那么自动计算就关闭，提高性能
        //"processing": true,
        "bFilter": false, //关闭右上角检索
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": __URL + '/Kvmdevice/async_get_kvm_data_source',
        },
        //"pageLength": parseInt(_dt_pagelength),
        //当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "deferRender": true,
        "bDeferRender": true,
        "pagingType": "full_numbers",//分页栏样式
        "serverSide": true,   //启用服务器端分页
        //状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
        "bStateSave": true,
        "language": dataLanguage,
        "iDisplayLength": _dt_pagelength,//默认显示的记录数  
        "lengthMenu": _dt_lengthMenu,//表格显示行数选项，根据_dt_pagelength设置初始值
        "columns": [
            { title: '_id', data: "_id" },
            { title: 'deviceOid', data: "deviceOid" },
            { title: '', data: "" },
            { title: '状态', data: "NetWorkStatus" },
            { title: '设备名称', data: "dname" },
            { title: '类型', data: "DeviceType" },
            { title: 'IP地址', data: "ipAddress" },
            { title: '目标设备', data: "unitType" },
            { title: '操作', data: "" },
        ],
        "columnDefs": [{
            "targets": 0,
            "visible": false,
            "orderable": false,
            "sClass": "center",
        }, {
            "targets": 1,
            "visible": false,
            "orderable": false,
            "sClass": "center",
        }, {
            "targets": 2,
            "orderable": false,
            "searching": true,
            "class": 'details-control',
            "defaultContent": '',
            "data": null,
        }, {
            "targets": 3,
            "sClass": "center",
            "data": null,
            "orderable": false,
            "render": function (data, type, row) {
                var _html = '';
                if (data.status == 1) {
                    _html += '<img src="{0}devicecurrenton.png" title="在线" />'.format(_IMGURL);
                } else {
                    _html += '<img src="{0}devicecurrentoff.png" title="断开" />'.format(_IMGURL);
                }
                return _html;
            },
            "sDefaultContent": "", //此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错  
        }, {
            "targets": 4,
            "sClass": "name-edit",
            "data": null,
            "render": function (data, type, row) {
                var classname = (_usertype == "1" ? "" : "hidden");
                return '<span class="editable" id="e-mail" style="display: inline-block;width: 70%;">' + row.dname + '</span>\
                            <input type="text" class="input-text radius size-S hidden" style="width: 70%;" />\
                            <i class="ace-icon fa fa-pencil bigger-120 blue edit ' + classname + '" title="修改"  onclick="cell_edit(0,this)"></i>&nbsp\
                            <i class="ace-icon fa fa-mail-reply bigger-120 blue back hidden" title="返回" onclick="cell_edit(2,this)"></i>&nbsp;\
                            <i class="ace-icon fa fa-floppy-o bigger-120 blue save hidden " title="保存" _id="' + row._id + '" old_value="' + row.dname + '"\
                                NetWorkStatus="' + row.NetWorkStatus + '" onclick="cell_edit(1, this)"></i>';
            }
        }, {
            "targets": 5,
            "sClass": "center",
        }, {
            "targets": 6,
            "sClass": "center",
        }, {
            "targets": 7,
            "sClass": "center",
        }, {
            "targets": 8,
            "sClass": "",
            "orderable": false,
            'defaultContent': '',
            "data": null,
            "render": function (data, type, row, meta) {
                return get_table_buttons(row);
            },
            "order": [[1, 'asc']]
        }]
    });
    //监听事件
    datatable_event();
    //全局搜索
    $("input[type=search]").on('keyup click', function () {
        filterGlobal();
    });
}

//全局搜索
function filterGlobal() {
    $('#example').DataTable().search(
        $('input[type=search]').val(),
        false,
        true
    ).draw();
}


//添加表格监听事件
var _parent_device = new Object();
function datatable_event() {
    //分页
    table.on('page.dt', function (data) {
        var nowPage = table.page();
        var pageCount = table.page.len();
        // // 刷新表格数据，分页信息不会重置   重新提交的话，需要将当前页,和页数传给后台php 
        var table_PostData = get_sync_PostData();
        table_PostData.start = (nowPage) * pageCount;
        table.settings()[0].ajax.data = table_PostData;
        //table.ajax.reload(null, false);
    });
    $('#example tbody').off('click');
    // 监听 展开 or 关闭 点击事件
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            var data = row.data();//行数据源
            _parent_device["_id"] = data._id;
            _parent_device["deviceOid"] = data.deviceOid;
            _parent_device["NetWorkStatus"] = data.NetWorkStatus;
            _parent_device["deviceName"] = data.dname;
            _parent_device["DeviceType"] = data.DeviceType;
            _parent_device["ipAddress"] = data.ipAddress;
            _parent_device["unitType"] = data.unitType;
            // Open this row
            //异步回调结束后执行
            async_kvm_device_by_parentid(data.deviceOid, row);
            tr.addClass('shown');
        }
    });
    //监听 修改 、删除 等按钮事件
    $('#example tbody').on('click', 'a', function (event) {
        var data = table.row($(this).parents('tr')).data();
        var targetname = this.className.toString();
        if (targetname.indexOf("update") > -1) {
            btn_edit_device(data._id);
        } else if (targetname.indexOf("delete") > -1) {
            //父级设备删除
            if (typeof (data) != "undefined") {
                btn_del_device(data.deviceOid, data.ipAddress, data.dname);
            } else {
                //子集设备删除
                var doid = $(this).attr("doid");
                var dname = $(this).attr("dname");
                btn_del_device(doid, "", dname);
            }
        } else if (targetname.indexOf("sort_up") > -1) {
            btn_sort_device(data.deviceOid, 1);
        } else if (targetname.indexOf("sort_down") > -1) {
            btn_sort_device(data.deviceOid, -1);
        } else if (targetname.indexOf("open_session") > -1) {
            if ($(this).attr("poid") == "" || $(this).attr("poid") == null) {
                $(this).attr("poid", _parent_device["deviceOid"]);
            }
            var sessiontype = $(this).attr("session_type");
            var p_oid = $(this).attr("poid");
            var doid = $(this).attr("doid");
            var did = $(this).attr("did");
            _deviceName = $(this).attr("dname");
            var dstatus = $(this).attr("dstatus");
            var open_device = {};
            open_device.dtype = "KVM";
            open_device.dname = _deviceName;
            open_device["deviceOid"] = doid;
            open_device.parentID = p_oid;
            open_device.did = did;
            open_device.port_status = dstatus;
            Open_Session(sessiontype, open_device);

        } else if (targetname.indexOf("tongbu") > -1) {
            //UMG设备同步
            btn_refresh_umg(data.deviceOid, data.ipAddress, data.dname)
        } else if (targetname.indexOf("port_edit") > -1) {
            //子集设备修改
            var doid = $(this).attr("doid");
            btn_port_edit_device(doid);
        } else if (targetname.indexOf("batch_edit") > -1) {
            //子集设备批量修改
            var doid = data.deviceOid;
            btn_port_batch_edit_device(doid);
        } else if (targetname.indexOf("acs_record") > -1) {
            //子集设备批量修改
            var doid = $(this).attr("doid");
            acs_review(doid);
        }
    });
}
function acs_review(doid) {

    var url = __APP + '/Eim/SessionAudit/get_recording_page?deviceoid=' + doid;
    parent.layer_show('浏览记录列表', url, '600', '450', function (dom) { });
}



//            //OpenKVM_MPU_Session(p_oid, sessiontype, doid, did, dstatus);
//组建主表格按钮
function get_table_buttons(device) {
    var button_html = "";
    try {
        var dtype = device.DeviceType;//设备类型
        var dutype = device.unitType;//设备型号
        var orders = _kvm_device_show_button.order;//所有设备类型（型号）需要显示的按钮
        if (!orders.hasOwnProperty(dtype)) {
            return button_html;
        }
        var orders_dtype = orders[dtype];//当前设备类型所需要显示的按钮
        if (!orders_dtype.hasOwnProperty(dutype)) {
            return button_html;
        }
        var orders_button = orders_dtype[dutype].device;//当前设备型号需要显示的所有按钮
        var attrs_button_htmls = _kvm_device_show_button.attr;
        for (var i = 0; i < orders_button.length; i++) {
            button_html += attrs_button_htmls[orders_button[i]] + "&nbsp;";
        }
    } catch (e) {
        alert(e.name + ": " + e.message);
        button_html = "";
    }
    return button_html;
}
//查询按钮
function btn_search_device() {
    var postdata = new Object();
    postdata.devicetype = $("#selKVMDeviceType").val();
    postdata.start = 0;
    table.settings()[0].ajax.data = postdata;
    table.page(0);//设置分页栏第几页
    table.ajax.reload(null, false);
}



//
function btn_port_batch_edit_device(doid) {
    parent.layer_show('设备批量编辑', __URL + '/HuiKVM/kvm_device_child_batch_edit_page?deviceOid=' + doid, '', '350', function (dom) {
        if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
            window.location.reload();
        }
    });
}





/*
组建子集设备
_child_device 记录子集设备
_child_device[父级设备_id] = 子集设备集合
*/
//组建子集设备
var _child_device = new Object();
var child_htmls = new Object();
//展开父级时，查询子集设备，每次查询时，判断_child_device是否存在该设备的子集设备，不存在，则查询，存在，则直接绑定
function async_kvm_device_by_parentid(doid, row) {
    //判断是否存在该设备的子集设备,存在，则直接绑定，不再查询数据库  _parent_device._id = 父级设备_id
    if (_child_device.hasOwnProperty(_parent_device._id)) {
        var child_device = _child_device[_parent_device._id];
        parent.layer.closeAll();
        //判断指定参数是否是一个空对象。
        if ($.isEmptyObject(child_device)) {
            parent.layer.msg('没有设备信息', { icon: 6 });
            return;
        }
        row.child(child_htmls[_parent_device._id]).show();
        return;
    }
    var loadlayer = parent.layer.msg('正在刷新，请稍后...', { icon: 16, time: 30000 });//
    ajaxasyn(__URL + "/Kvmdevice/page_async_get_kvm_data", { "deviceOid": doid }, true, 'POST', 'json', function (data) {
        parent.layer.closeAll();
        //第一次查询保存
        _child_device[_parent_device._id] = data;
        //判断指定参数是否是一个空对象。
        if ($.isEmptyObject(data)) {
            parent.layer.msg('没有设备信息', { icon: 6 });
            return;
        }
        var child_html = "";
        for (var key in data ) {
            var html = children_html_format(data[key]);
            if (html != "") {
                child_html += html;
            }
        }
        child_htmls[_parent_device._id] = child_html;//记录子集设备的html，下次展开时直接展示该html信息
        row.child(child_html).show();
    }, function (errmsg) {
        var index = layer.open({
            type: 1,
            title: '错误信息',
            content: errmsg.responseText,
            maxmin: true
        });
        layer.full(index);
    });
}
//组建子集设备HTML
function children_html_format(d) {
    // `d` is the original data object for the row 
    //显示字段
    var kvmfield = get_child_device_show_field_html(d);
    if (kvmfield == "") {
        return "";
    }
    //功能按钮
    var btn_obj = get_device_session_btn_html(d);
    //详细信息
    var detailed_html = get_detailed_html();
    var group_name = "";
    //          '<div id="div_btn" class="widget-title">' + btn_obj + '</div>' +
    //'<div id="div_btn" class="widget-toolbar pad-10">' + btn_obj + '</div>' +
    return '<div id="div_' + d.deviceOid + '" class="col-xs-12  widget-container-col">' +
                   '<div class="widget-box collapsed">' +
                       '<div class="widget-header widget-header-small ">' + kvmfield +
                            '<h6 class="widget-title transparent " style="line-height:29px;">' + btn_obj + '</h6>' +
                            '<div class="f-r hidden" style="width:15%;line-height:23px;padding-top:6px;">设备所在组：<p class="badge badge-grey">' + group_name + '</p></div>' +
                       '</div>' +
                       '<div class="widget-body hidden">' +
                           '<div class="widget-main hidden">' +
                                '<p class="alert alert-info">' + detailed_html +
                                '</p>' +
                            '</div>' +
                       '</div>' +
                   '</div>' +
               '</div>';
}
//组建子集设备需要显示的字段
function get_child_device_show_field_html(device) {
    var field_html = "";
    var p_dtype = _parent_device.DeviceType;
    var p_dutype = _parent_device.unitType;
    if (!_kvm_device_show_field.order.hasOwnProperty(p_dtype)) {
        return field_html;
    }
    var devicetypes = _kvm_device_show_field.order[p_dtype];
    if (!devicetypes.hasOwnProperty(p_dutype)) {
        return field_html;
    }
    var device_show_field = devicetypes[p_dutype];
    for (var i = 0; i < device_show_field.length; i++) {
        //显示的类别（设备名称、端口号等）
        var key = device_show_field[i];
        var value = _kvm_device_show_field.attr[key];
        var name = value.name;
        //端口状态的键
        var status_key = ("id_" + device[key]).replace(/\s/g, "");
        //显示电影状态的设备端口号的类名
        var classNamePortNum;
        //端口状态
        var syncFlagClassName = "";
        var portNum;
        //不显示当前设备的电源状态
        if (key == "NetWorkStatus") {
            //组建端口号           
            classNamePortNum = value['id_' + device[key]];
        } else if (key == "portNumber") {
            //当遍历端口号时
            portNum = device[key];
            //组建端口号
            field_html += "<span class='" + classNamePortNum + "' style='min-width:30px;margin-right:10px;'>" + portNum + "</span>&nbsp;&nbsp;&nbsp;";
        } else if (key == "syncFlag") {
            var status_info;
            var text;
            if (value.hasOwnProperty(status_key)) {
                //取status_key值
                status_info = value[status_key];
                text = status_info.text;
                syncFlagClassName = status_info.classname;
            } else {
                status_info = "";
                text = "";
            }
            //组建状态指示 class='" + syncFlagClassName + "'
            field_html += "<span  style='display:inline-block; width:39px;'>" + text + "</span>&nbsp;&nbsp;&nbsp;";
        } else if (key == "kvmDeviceName") {
            var device_name = device.kvmDeviceName == "" || device.kvmDeviceName == undefined ? device.deviceName : device.kvmDeviceName;
            //包含汉字，则除2，汉字占两个字节
            var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (reg.test(device_name)) {
                _deviceNameCount = parseInt(_deviceNameCount / 2);
            }
            device_name = omit(device_name, _deviceNameCount);
            field_html += "<span class='blue' title='" + device_name + "' style='display:inline-block;font-weight:700;width:" + _deviceNameLength + "px;'>" + device_name + "</span>&nbsp;&nbsp;&nbsp;";
        }
        //else {
        //    var device_name = device[key];
        //    //包含汉字，则除2，汉字占两个字节
        //    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        //    if (reg.test(device_name)) {
        //        _deviceNameCount = parseInt(_deviceNameCount / 2);
        //    }
        //    device_name = omit(device_name, _deviceNameCount);
        //    field_html += "<span class='blue' title='" + device[key] + "' style='display:inline-block;font-weight:700;width:" + _deviceNameLength + "px;'>" + device_name + "</span>&nbsp;&nbsp;&nbsp;";
        //}
    }
    return field_html;
}
//简写
function omit(_name, num) {
    if (_name.length > num) {
        _name = _name.substring(0, num);
        _name += '…';
    }
    return _name;
}
function get_device_session_btn_html_list(action_button, attrs_html, device, pdevice) {
    var session_btn_html = "";
    var device_dname = device.hasOwnProperty("kvmDeviceName") && device.kvmDeviceName != "" ? device.kvmDeviceName : device.deviceName;
    for (var i = 0; i < action_button.length; i++) {
        var key = action_button[i];
        session_btn_html += "&nbsp;" + attrs_html[key].format({
            doid: device["deviceOid"],
            poid: pdevice["deviceOid"],
            did: device["_id"],
            unitType: pdevice["unitType"],
            syncFlag: device["syncFlag"],
            dname: device_dname,
        }) + "&nbsp;";
    }
    return session_btn_html;
}
//组建会话按钮，不同类型设备，会话按钮不同
function get_device_session_btn_html(device) {
    var session_btn_html = "";
    try {
        var dtype = _parent_device.DeviceType;
        var dutype = _parent_device.unitType;
        var orders = _kvm_device_show_button.order;//所有设备类型（型号）需要显示的按钮
        if (!orders.hasOwnProperty(dtype)) {
            return session_btn_html;
        }
        var orders_dtype = orders[dtype];//当前设备类型所需要显示的按钮
        if (!orders_dtype.hasOwnProperty(dutype)) {
            return session_btn_html;
        }
        var action_button = orders_dtype[dutype].action;//父级设备的所有按钮
        var attrs_html = _kvm_device_show_button.attr;
        if (action_button.hasOwnProperty("length")) {
            return get_device_session_btn_html_list(action_button, attrs_html, device, _parent_device);
        }
        for (var i in action_button) {
            if (device.EID.indexOf(i) == -1) {
                continue;
            }
            return get_device_session_btn_html_list(action_button[i], attrs_html, device, _parent_device);
        }
    } catch (e) {
        alert(e.name + ": " + e.message);
        session_btn_html = "";
    }
    return session_btn_html;
}
//组建详细【巡检】信息
function get_detailed_html() {
    var html = '';
    //var html = '<label>设备标识：</label><span class="editable" id="e-mail" style="display: inline-block;width: 200px;"></span>\
    //                        <input type="text" class="input-text radius size-S hidden" style="width: 200px;" />\
    //                        <i class="ace-icon fa fa-pencil bigger-120 blue edit" title="修改" onclick="edit(0,this)"></i>&nbsp\
    //                        <i class="ace-icon fa fa-mail-reply bigger-120 blue back hidden" title="返回" onclick="edit(2,this)"></i>&nbsp;\
    //                        <i class="ace-icon fa fa-floppy-o bigger-120 blue save hidden " title="保存" onclick="edit(1, this)"></i>';
    return html;
}

//单元格编辑按钮
function cell_edit(i, _this) {
    var Span = $(_this).siblings("span");
    var Input = $(_this).siblings("input");
    var save = $(_this).siblings(".save");
    var back = $(_this).siblings(".back");
    var edit = $(_this).siblings(".edit");
    var _html = Span.text();
    //编辑
    if (i === 0) {
        //隐藏span,显示input;把span中的内容赋给input
        Span.addClass("hidden");
        $(_this).addClass("hidden");
        Input.removeClass("hidden").val(Span.text());
        save.removeClass("hidden");
        back.removeClass("hidden");
        edit.addClass("hidden");

    } else if (i === 1) {
        //保存        
        var _id = $(save.context).attr("_id");
        var NetWorkStatus = $(save.context).attr("NetWorkStatus");
        var old_value = $(save.context).attr("old_value");
        var new_value = Input.val();
        edit.removeClass("hidden");
        //隐藏input,显示span;把input中的内容赋给input
        Input.addClass("hidden");
        $(_this).addClass("hidden");
        back.addClass("hidden");
        save.addClass("hidden");
        edit.removeClass("hidden");
        Span.removeClass("hidden").html(new_value);
        //保存
        async_edit_device_name(_id, old_value, new_value, NetWorkStatus);

    } else if (i === 2) {
        //返回
        Input.addClass("hidden");
        $(_this).addClass("hidden");
        back.addClass("hidden");
        save.addClass("hidden");
        edit.removeClass("hidden");
        Span.removeClass("hidden").html(_html);
    }
    //layer.msg('修改成功', { icon: 6 });

}
//修改设备名称，父级 and 子集 设备通用
function async_edit_device_name(did, oldvalue, newvalue, networkstatus) {
    var editobj = new Object();
    editobj._id = did;
    editobj.oldkvmDeviceName = oldvalue;//
    editobj.kvmDeviceName = newvalue;//只修改别名
    editobj.NetWorkStatus = networkstatus;
    ajaxasyn(__URL + "/HuiKVM/updateKVMDevice", editobj, true, 'POST', 'json', function (msg, status) {
        if (msg == "ok") {
            parent.layer.msg('修改成功', { icon: 6 });
        } else {
            parent.layer.msg('修改失败', { icon: 5 });//5:哭脸
        }
    }, function (xmlhttprequest, status) {
        var index = layer.open({
            type: 1,
            title: '错误信息',
            content: xmlhttprequest.responseText,
            maxmin: true
        });
        layer.full(index);
    });
}




