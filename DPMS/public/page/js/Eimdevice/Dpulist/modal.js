
appModule.controller('modalDpulistController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;
    $scope.hideOther = true;//隐藏其他属性
    switch ($scope.Source.Action) {
        case 0:
            if ($scope.service.modeltypeData) {
                //取对象第一个值obj[Object.keys(obj)[0]]
                $scope.Source.selectItem.modeltype = $scope.service.modeltypeData[Object.keys($scope.service.modeltypeData)[0]];
            }
            $scope.url += 'Eimdevice/Dpulist/add_page_data';
            break;
        case 1:
            $scope.url += 'Eimdevice/Dpulist/update_page_data';
            break;
        case 2:
            $scope.url += 'Eimdevice/Dpulist/update_page_data';
            break;
        default:
            alert.show('Action Error!');
            break;
    }
    //快速添加新的设备类型
    $scope.Addmodeltype = function () {
        //添加设备型号时需查询出设备类型 
        var parameter = new URLSearchParams();
        parameter.append('$json', true);
        parameter.append('$where', JSON.stringify({ 'iddevicetype': 9 }));
        $scope.service.postData(__URL + 'Eimdevice/Devicetype/select_page_data', parameter).then(function (data) {
            $scope.service.devicetypeData = data;
            $scope.service.title = "添加新的设备型号";
            $scope.modalHtml = __URL + 'Eimdevice/Modeltype/openmodal';
            $scope.modalController = 'modalModeltypeController';
            $scope.service.Action = 0;
            $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) { });
        }, function (error) {
            console.log(error);
        });

    }

    //保存操作
    $scope.save = function (cuslevel) {
        var params = new URLSearchParams();
        if ($scope.Source.Action != 0) {
            params.append('iddpulist', $scope.Source.selectItem.iddpulist);
        }
        if ($scope.Source.Action == 2) {
            params.append('del', 1);
        } else {
            angular.forEach($scope.Source.selectItem, function (value, key) {
                if ($scope.Source.Action == 0 && key == "modeltype") {
                    params.append("modeltypeid", value.idmodeltype);
                    params.append("devicetype", value.modelname);
                } else {
                    params.append(key, value);
                }
            });
        }

        $scope.Source.postData($scope.url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data <= 0) {
                        //添加失败
                        alert.show('添加失败', '添加PDU设备');
                        break;
                    }
                    //更新service数据源
                    var additem = $scope.Source.selectItem;
                    additem._kid = data;
                    additem.iddpulist = data;
                    additem.networkstatus = 0;
                    additem.index = 0;
                    additem.modeltypeid = $scope.Source.selectItem.modeltype.idmodeltype;
                    additem.devicetype = $scope.Source.selectItem.modeltype.modelname;
                    additem.isParent = true;
                    additem.children = [];
                    dataService.addData('dpulistArr', additem);
                    alert.show('添加成功', '添加PDU设备');
                    //非连续添加，则关闭弹框
                    if (cuslevel == 0) {
                        $uibModalInstance.close('ok');
                    }
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        $scope.Source.selectItem._kid = data;
                        dataService.updateData('dpulistArr', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改PDU设备');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改PDU设备');
                    break;
                case 2:
                    //删除
                    if (data >= 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除PDU设备');
                        dataService.selectItem._kid = $scope.Source.selectItem.iddpulist;
                        dataService.delData('dpulistArr', $scope.service.selectItem);   
                        break;
                    }
                    alert.show('删除失败', '删除PDU设备');
                    break;
            }
        }, function (error) {
            console.log(error);
        });

    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);



//获取按钮
var _dpu_port_attr = {};
var _dpu_buttons = {};
function get_attr_button() {
    var url = __APP + "/Eim/Authority/async_get_dpu_port_attr";
    ajaxasyn(url, {}, true, 'POST', 'json', function (portdata) {
        //组建端口信息
        _dpu_port_attr = portdata;
    }, function (errorMsg) {
        parent.layer.msg('端口属性初始化失败，请重试', { icon: 5 });
    });
    url = __APP + "/Eim/Authority/async_get_dup_port_button";
    ajaxasyn(url, {}, true, 'POST', 'json', function (portdata) {
        //组建端口信息
        _dpu_buttons = portdata;
    }, function (errorMsg) {
        parent.layer.msg('端口属性初始化失败，请重试', { icon: 5 });
    });
}




var table = {};
function datatable_bind() {
    table = $('#example').DataTable({
        "destroy": true,
        "processing": true,//DataTables载入数据时，是否显示‘进度’提示
        "serverSide": true,//是否启动服务器端数据导入
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": __URL + '/HuiDpu/async_get_dpu_list_bind'
        },
        //当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "deferRender": true,
        "iDisplayLength": _dt_pagelength,
        "language": dataLanguage,
        //当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
        "deferRender": true,
        //状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
        "bStateSave": true,
        //自动宽度
        "autoWidth": false,
        "columns": [
            { data: "_id", title: '_id', visible: false },
            { data: "", title: '' },
            { data: "Dpustatus", title: '网络状态', sClass: "center" },
            { data: "dpuname", title: '设备名称', orderable: false },
            { data: "dpuaddress", title: '设备地址', orderable: false },
            { data: "dputype", title: '设备类型', sClass: "center", orderable: false },
            { data: "dpuAcurrent", title: '电流(A)', sClass: "center", orderable: false },
            { data: "voltage", title: '电压(V)', sClass: "center", orderable: false },
            { data: "power", title: '功率(W)', sClass: "center", orderable: false },
            { data: "contactpeople", title: '负责人', orderable: false },
            { data: "", title: '操作', sClass: "center", orderable: false },
            { data: "SN", title: '序列号', orderable: false, visible: false },
        ],
        "columnDefs": [
             {
                 "targets": 1,
                 "orderable": false,
                 "class": 'details-control',
                 "defaultContent": '',
                 "data": null,
             }, {
                 "targets": 2, "data": null,
                 //"defaultContent": '<div class="text-center"><i class="Hui-iconfont Hui-iconfont-xianshiqi f-20"></i></div>',
                 "orderable": false,
                 "render": function (data, type, row) {
                     var _html = '<span class="label ">离线</span>';
                     if (data) {
                         _html = '<span class="label label-success">在线</span>';
                     }
                     return _html;
                 }
             }, {
                 "targets": 10, "data": null,
                 "render": function (data, type, row) {

                     $btn = '<a id="btn100015" title="刷新端口状态" href="javascript:;" onclick="" class="refresh ml-5" style="text-decoration:none">\
                                         <i class="glyphicon glyphicon-repeat bigger-120"></i>\
                                     </a>&nbsp;&nbsp;';
                     $btn += '<a id="btn100018" title="编辑" href="javascript:;" class="edit ml-5 green" style="text-decoration:none">\
                                         <i class="glyphicon glyphicon-pencil bigger-120"></i>\
                                     </a>&nbsp;&nbsp;';
                     $btn += '<a title="删除" href="javascript:;" class="delete ml-5 red" style="text-decoration:none">\
                                        <i class="glyphicon glyphicon-trash bigger-120"></i>\
                                    </a>&nbsp;&nbsp;';
                     $btn += '<a title="上移" href="javascript:;" class="sort_up ml-5 ">\
                                            <i class="glyphicon glyphicon-arrow-up bigger-120"></i>\
                                        </a>&nbsp;&nbsp;';
                     $btn += '<a title="下移" href="javascript:;"  class="sort_down ml-5 ">\
                                                            <i class="glyphicon glyphicon-arrow-down bigger-120"></i>\
                                                        </a>';
                     return $btn;
                 }
             }]
    });
    initTableEvent();
}
//表格点击事件
var _sel_dpudata = {};
function initTableEvent() {
    $('#example tbody').off("click");
    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            //row.data();该行数据

            _sel_dpudata = row.data();
            async_get_dpu_port_info(_sel_dpudata._id, row, row.data());

            //var alert_content = "";
            //for (var i = 0; i < 5; i++) {
            //    var h = $("#alert_content").html();
            //    var c = format1(h);
            //    alert_content += c;
            //}
            //row.child(alert_content).show();

            tr.addClass('shown');
        }
    });
    $('#example tbody').on('click', 'a', function (event) {
        var data = table.row($(this).parents('tr')).data();
        var targetname = this.className.toString();
        if (targetname.indexOf("refresh") > -1) {
            onRefreshPortStatus(data.dpuaddress, data.SN, data.dpuname);
        } else if (targetname.indexOf("edit") > -1) {
            onEditDPUBox(data._id);
        } else if (targetname.indexOf('delete') > -1) {
            member_del(this, data._id, data.dpuaddress);
        } else if (targetname.indexOf('sort_up') > -1) {
            btn_onclick_edit_deviceindex(data._id, 1);
        } else if (targetname.indexOf('sort_down') > -1) {
            btn_onclick_edit_deviceindex(data._id, -1);
        }
    });
}

//查询
function btn_query_data() {
    var postdata = new Object();
    postdata.dpuname = $("input[name=dpuname]").val();
    postdata.dpuaddress = $("input[name=dpuaddress]").val();
    postdata.Dpustatus = $("select[name=Dpustatus]").val();
    postdata.start = 0;
    table.settings()[0].ajax.data = postdata;
    table.page(0);//设置分页栏第几页
    table.ajax.reload(null, false);
}

//异步查询端口信息
var _port_data = {};
function async_get_dpu_port_info(dpuid, rowData, row) {
    if (_port_data.hasOwnProperty(dpuid)) {
        var portdata = _port_data[dpuid];
        var html = "";
        for (value in portdata) {
            html += create_port_html(portdata[value], row);
        }
        rowData.child(html).show();
        return;
    }
    var loadlayer = parent.layer.msg('正在刷新，请稍后...', { icon: 16, time: 20000 });//
    var url = __URL + "/HuiDpu/async_get_dpu_port_list";
    var postdata = {};
    postdata.Dpuguid = dpuid;
    ajaxasyn(url, postdata, true, 'POST', 'json', function (portdata) {
        _port_data[dpuid] = portdata;
        //组建端口信息
        var html = "";
        for (value in portdata) {
            html += create_port_html(portdata[value], row);
        }
        rowData.child(html).show();
        parent.layer.close(loadlayer);//关闭加载框
    }, function (errorMsg) {
        parent.layer.msg('端口信息获取失败', { icon: 5 });
    });
}

function create_port_html(d, row) {
    var html = '<div  class="col-xs-12  widget-container-col">' +
                     '<div class="widget-box collapsed">' +
                         '<div class="widget-header widget-header-small " >' + format(d) +
                             '<h6 class="widget-title transparent " style="margin-top:10px;">' + btn_html(d, row) + '</h6>' +
                             '<div class="widget-toolbar">' +
                                 '<a href="#" data-action="collapse" class="f-r pd-10" title="查看相信信息" style="line-height:29px;">' +
                                     '<i class="ace-icon fa fa-plus" data-icon-show="fa-plus" data-icon-hide="fa-minus"></i>' +
                                 '</a>' +
                             '</div>' +
                         '</div>' +
                         '<div class="widget-body">' +
                             '<div class="widget-main">' +
                                 '<p class="alert alert-info"></p>' +
                             '</div>' +
                         '</div>' +
                     '</div>' +
                 '</div>';
    // html = html.format({switchflag:d.Portstatus, dpuid: row._id, dputype: row.dputype, dpuaddress: row.dpuaddress, writestr: row.writecommunity, portid: d._id, portnum: d.Portnumber, snmpoid: d.snmpcurrentoid, statusstr: d.StatusOidvaluetype, sn: row.SN, port_id: d._id, dpuname: row.dpuname, Portnumber: d.Portnumber });
    return html;
}
//组件子集信息
function format(d) {
    var _html = "";
    var order_port = _dpu_port_attr.order;
    var attr_port = _dpu_port_attr.attr;
    for (var i = 0; i < order_port.length; i++) {
        if (!d.hasOwnProperty(order_port[i])) {
            continue;
        }
        var key = order_port[i];
        var value = d[key];
        if (attr_port[key].hasOwnProperty(value)) {
            _html += '<span>' + attr_port[key].name + '</span>&nbsp' + attr_port[key][value] + '&nbsp;|&nbsp;&nbsp;';
        } else {
            _html += '<span>' + attr_port[key].name + '</span>&nbsp' + value + '&nbsp;|&nbsp;&nbsp;';
        }
    }
    return _html;
}
//组件子集信息
function btn_html(d, row) {
    var _html = "";
    var order_port = _dpu_buttons.order.DPU6008D.child;
    var attr_port = _dpu_buttons.attr;
    for (var i = 0; i < order_port.length; i++) {
        var key = order_port[i];
        var value = attr_port[key];
        value = value.format({ dpuid: row._id, dputype: row.dputype, dpuaddress: row.dpuaddress, writestr: row.writecommunity, portid: d._id, portnum: d.Portnumber, snmpoid: d.snmpcurrentoid, statusstr: d.StatusOidvaluetype, sn: row.SN, port_id: d._id, dpuname: row.dpuname, Portnumber: d.Portnumber })
        _html += value;
    }
    return _html;
}

//开启隐藏端口
function action(name) {
    var value = $("#" + name).css("display");
    if (value == "none") {
        $("#" + name).css("display", "table-row");
    } else {
        $("#" + name).css("display", "none");
    }
}
//添加
function onAddDPUBox() {
    parent.layer_show('添加设备', __URL + '/HuiDpu/get_dpu_add_page', '400', '500', function (dom) {
        if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
            window.location.reload();
        }
    });
}
//设备配置
function onDeviceSystemSet(dpuid, dpuip) {
    parent.layer_show('设备配置', __URL + '/HuiDpu/get_dpu_system_set_page?dpuid=' + dpuid + '&dpuip=' + dpuip, '700', '400', function (dom) { });
}
//手动刷新DPU60008D端口状态
function onRefreshPortStatus(dpuip, dpusn, dname) {
    var loadlayer = parent.layer.msg('正在刷新，请稍后...', { icon: 16, time: 20000 });//
    var url = __URL + "/HuiDpu/RefreshPortStatus";
    ajaxasyn(url, { "dpuip": dpuip, "dpusn": dpusn, "dpuname": dname }, true, 'POST', 'json', function (msg) {
        if (msg == 'ok') {
            parent.layer.msg('刷新成功', { icon: 6 });//
            var t = setTimeout("window.location.reload()", 1000);//1s后刷新当前页面
        } else if (msg == "snerror") {
            parent.layer.msg('无法识别的设备', { icon: 5 });
        } else {
            layer.msg('刷新失败', { icon: 5 });
        }
        parent.layer.close(loadlayer);//关闭加载框
    }, function (errorMsg) {
        parent.layer.close(loadlayer);//关闭加载框
        var index = layer.open({
            type: 1,
            title: '错误信息',
            content: errorMsg.responseText,
            maxmin: true
        });
        layer.full(index);
    });
}

function onEditDPUBox(dpuid) {
    parent.layer_show('修改设备', __URL + '/HuiDpu/get_dpu_add_page?id=' + dpuid, '', '350', function (dom) {
        if (layer.ajaxflag != null && layer.ajaxflag == 'ok') {
            window.location.reload();
        }
    });
}
//DPU关注
function onDpuMark(dpuid, dpuip) {
    var markvalue = '';
    if ($('#lblmark-' + dpuid).html() == '已关注') {
        markvalue = 'false';
    } else {
        markvalue = 'true';
    }
    var url = __URL + '/HuiDpu/edit_dpu';
    var data = { 'id': dpuid, 'dpuaddress': dpuip, 'Mark': markvalue };
    ajaxasyn(url, data, true, 'POST', 'json', function (msg) {
        if (msg == 'ok') {
            layer.msg((markvalue == "false" ? '取消关注成功' : '添加关注成功'), { icon: 6 });
            //window.location.reload();//刷新当前页面
            //不刷新页面，更新表格数据-未完成
            $('#lblmark-' + dpuid).html(markvalue == "false" ? '未关注' : '已关注');
            $('#lblmark-' + dpuid).css('background-color', (markvalue == "false" ? ' #dd514c' : '#5eb95e'));
            $('#lblmark-' + dpuid).attr('title', (markvalue == "false" ? '添加关注' : '取消关注'));
        } else {
            layer.msg('关注失败', { icon: 5 });
        }
    }, function (errormsg) {
        var index = layer.open({
            type: 1,
            title: '错误信息',
            content: errorMsg.responseText,
            maxmin: true
        });
        layer.full(index);
    });
}
/*DPU-删除*/
function member_del(obj, id, ip) {
    var confirm_del = parent.layer.confirm('是否删除IP为[ ' + ip + ' ]的设备？', function (index) {
        ajaxasyn(__URL + '/HuiDpu/delete_dpu', { "id": id, "ip": ip }, true, 'POST', 'json', function (msg) {
            if (msg == "ok") {
                //如果删除的当前行已展开节点信息，则将子节点隐藏
                if ($("#dpu-" + id).css("display") != 'none') {
                    action('dpu-' + id);
                }
                $(obj).parents("tr").remove();
                layer.msg('删除成功', { icon: 6 });
                parent.layer.close(index);
            } else {
                layer.msg('删除失败', { icon: 5 });//5:哭脸
            }
        }, function (errorMsg) {
            var index = parent.layer.open({
                type: 1,
                title: '错误信息',
                content: errorMsg.responseText,
                // content: data,
                maxmin: true
            });
            layer.full(index);
        });
    });
}
//DPU排序
function btn_onclick_edit_deviceindex(d_id, index) {
    var postdata = {};
    postdata.device_id = d_id;
    postdata.index = index;
    ajaxasyn(__URL + "/HuiDpu/async_dpu_device_sort", postdata, true, 'POST', 'json', function (msg) {
        if (msg == "ok") {
            window.location.reload();
        } else {
            layer.msg('排序失败', { icon: 5 });//
        }
    }, function (errmsg) {

        layer.msg('排序失败', { icon: 5 });//
    });
}

/*
    端口开关
    switchflag：执行操作[ON or OFF]
    dpuid：DPU ID
    dputype：DPU 类型
    dpuip：DPU IP
    writestr：DPU writecommunity
    portid：端口 id
    portnum：端口号
    snmpoid：端口 Snmpstatusoid
    statusstr：端口 StatusOidvaluetype
    sn：DPU SN
*/
function portSwitch(switchflag, dpuid, dputype, dpuip, writestr, portid, portnum, snmpoid, statusstr, sn) {
    //alert(sn);
    var index;
    if ($('#lbldpustatus-' + dpuid).html() == "离线") {
        layer.msg('离线不可操作，请检查设备网络状态！', { icon: 2, time: 5000 });
        //return;
    }
    index = parent.layer.prompt({
        formType: 1,//prompt风格，支持0-2
        title: '输入密码，并确认'
    }, function (pass, index, elem) {
        parent.layer.close(index);
        var loadlayer = parent.layer.msg('请稍后...', { icon: 16, time: 20000 });//点击确定执行端口操作，
        var portswitchdata = {};
        portswitchdata.pwd = pass;//先将密码后台，验证是否匹配，匹配时才执行端口开关重启操作
        portswitchdata.DPUIP = dpuip;
        portswitchdata._id = portid;//端口id
        portswitchdata.PORTOID = snmpoid;
        portswitchdata.Writecommunity = writestr;
        portswitchdata.Statustype = statusstr;
        portswitchdata.PORTNUMBER = portnum;
        portswitchdata.DPUID = dpuid;
        portswitchdata.dputype = dputype;//新增DPU6000系列
        portswitchdata.dpusn = sn;//新增DPU序列号判断
        switch (dputype) {
            case "DPU2012": case "DPU3008": case "DPU3012":
                portswitchdata.Status = switchflag;
                break;
            case "MPI8": case "MPH2-8":
            case "DPU6008A": case "DPU6008B": case "DPU6008C": case "DPU6008D"://2016-03-28 11:32:25 添加DPU6000系列支持
                portswitchdata.Status = (switchflag == "ON" ? 1 : 0);//1=开；0=关
                break;
        }
        ajaxasyn(__URL + '/HuiDpu/dpu_port_switch', portswitchdata, true, 'POST', 'json',
            function (successMsg) {
                parent.layer.close(loadlayer);//关闭加载框
                if (successMsg == "pwd") {
                    parent.layer.close(index);
                    parent.layer.msg('密码错误，执行失败！', { icon: 5 });

                    return;
                } else if (successMsg.toLocaleLowerCase() == "snerror") {
                    parent.layer.close(index);
                    parent.layer.msg('无法识别的设备！', { icon: 5 });

                } else if (successMsg.toLocaleLowerCase() == "ok") {
                    parent.layer.close(index);
                    parent.layer.msg('执行成功！', { icon: 6 });

                    //更改表格数据
                    $("#portstatus-" + portid).css('background-color', ((switchflag == "OFF" || switchflag == '0') ? ' #dd514c' : '#5eb95e'));
                    $("#portstatus-" + portid).html((switchflag == "OFF" || switchflag == '0') ? ' OFF' : 'ON');
                } else {
                    parent.layer.msg('执行失败！', { icon: 5 });
                }
            }, function (errorMsg) {
                layer.close(loadlayer);//关闭加载框
                var index = layer.open({
                    type: 1,
                    title: '服务器错误信息',
                    content: errorMsg.responseText,
                    maxmin: true
                });
                layer.full(index);
            });
    });
}


/*
    2016年4月19日 18:16:08 添加DPU6111的支持
*/

//DPU6111开关
/*
   端口开关
   switchflag：执行操作[ON or OFF]
   dpuid：DPU ID
   dputype：DPU 类型
   dpuip：DPU IP
   portnum：端口号
*/
function portSwitchDPU6111(switchflag, dpustatus, dpuid, dputype, dpuip) {
    if (dpustatus == "") {
        layer.msg('请检查设备状态！', { icon: 6 });
        return;
    }
    var loadlayer;
    var promptindex = parent.layer.prompt({
        title: '输入密码，并确认',
        formType: 1 //prompt风格，支持0-2
    }, function (pass) {
        parent.layer.close(promptindex);
        loadlayer = parent.layer.msg('请稍后...', { icon: 16, time: 20000 });//
        var postdata = new Object();
        postdata.DPUID = dpuid;
        postdata.pwd = pass;//先将密码后台，验证是否匹配，匹配时才执行端口开关重启操作
        postdata.DPUIP = dpuip;
        postdata.PORTNUMBER = 1;
        postdata.Status = switchflag;
        var url = __URL + "/HuiDpu/dpu_port_switch_dpu6111";
        ajaxasyn(url, postdata, true, 'POST', 'json',
              function (successMsg) {
                  parent.layer.close(loadlayer);//关闭加载框
                  if (successMsg == "pwd") {
                      parent.layer.msg('密码错误，执行失败！', { icon: 5 });
                      return;
                  }
                  if (successMsg == "ok") {
                      parent.layer.msg('执行成功！', { icon: 6 });
                      $("#portstatusdpu6111-" + dpuid).removeClass(switchflag == "OFF" ? "label-success" : "label-danger");
                      $("#portstatusdpu6111-" + dpuid).addClass(switchflag == "OFF" ? "label-danger" : "label-success");
                      $("#portstatusdpu6111-" + dpuid).html(switchflag);
                  } else {
                      parent.layer.msg('执行失败！', { icon: 5 });
                  }
              }, function (errorMsg) {
                  parent.layer.close(loadlayer);//关闭加载框
                  var index = layer.open({
                      type: 1,
                      title: '服务器错误信息',
                      content: errorMsg.responseText,
                      maxmin: true
                  });
                  layer.full(index);
              });
    });
}


