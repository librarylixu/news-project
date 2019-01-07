//二级联动
function dpuchange(thisobj) {
    $("#selport").empty();
    //清空其它2个下拉框
    //$("#selport").options.length=0;
    var index1 = thisobj.selectedIndex;
    if (index1 == 0 || thisobj.value == '') {	//当选择的为 “请选择” 时
        $("#selport").append("<option value=''>请选择</option>");
    } else {
        $.each(dpusource[0][thisobj.value].Dpuports, function (index, data) {
            $("#selport").append("<option value='" + data + "'>端口：" + (index + 1) + "</option>");
        });
    }
}

//var pages = {$all_page_num};
$(function () {
    //dpu下拉
    $("#seldpu").append("<option value=''>请选择</option>");
    $("#selport").append("<option value=''>请选择</option>");
    $.each(dpusource[0], function (index, data) {
        $("#seldpu").append("<option value='" + data._id + "'>" + data.dpuname + "</option>");
        //alert("<option value='"+data._id.$id+"'>"+data.dpuname+"</option>");
    });
    //查询返回选中
    $("#seldpu").val($("#seldpu").attr('dpuvalue'));
    dpuchange($("select option:selected")[0]);
    $("#selport").val($("#selport").attr('portvalue'));
    table_bind();
});

var table = null;
function table_bind() {
    if (table != null) {
        table.destroy();
        $('#table_port_current').empty();
    }
    table = $('#table_port_current').DataTable({
        "destroy": true,//销毁
        "autoWidth": false,//如果已经指定了列宽,那么自动计算就关闭，提高性能
        "processing": true,
        "bFilter": false, //关闭右上角检索
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": __APP + '/Eimbase/Logportcurrent/async_get_port_current_data',
            //"data": postdata
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
            { title: 'DPU名称', data:'dpuname'},
            { title: '端口号', data: 'Ports' },
            { title: '电流值(A)', data: 'CurrentValue' },
            { title: '时间', data: 'Time' }
        ],
    });
    table.on('page.dt', function (data) {
        var nowPage = table.page();
        var pageCount = table.page.len();
        // // 刷新表格数据，分页信息不会重置   重新提交的话，需要将当前页,和页数传给后台php
        var table_PostData = get_sync_PostData();
        table_PostData.start = (nowPage) * pageCount;
        table.settings()[0].ajax.data = table_PostData;
    });
}

function get_sync_PostData() {
    var postdata = new Object();
    postdata.sTime = $("#txtstime").val();
    postdata.eTime = $("#txtetime").val();
    postdata.Dpus = $("#seldpu").val();
    postdata.Ports = $("#selport").val();
    postdata.sValue = $("#txtsvalue").val();
    postdata.eValue = $("#txtevalue").val();
    return postdata;
}

//查询按钮
function on_query_data() {
    var parms = get_sync_PostData();
    parms.start = 0;
    table.settings()[0].ajax.data = parms;
    table.page(0);//设置分页栏第几页
    table.ajax.reload(null, false);
}



















//导出
function onExportClick() {
    //if (pages == 0) {
    //    layer.msg('没有数据', { icon: 5 });
    //    return;
    //} else {
    //    $("#savetablediv").show();
    //}
}

//导出保存
function exportlogsave() {
    //serializeArray:输出以数组形式序列化表单值的结果
    //var formloglist = $("#formlog").serializeArray();
    //var formexportlist = $("#formexport").serializeArray();
    var postdata = new Object();
    postdata.sTime = $("#txtstime").val();
    postdata.eTime = $("#txtetime").val();
    postdata.Dpus = $("#seldpu").val();
    postdata.Ports = $("#selport").val();
    postdata.sValue = $("#txtsvalue").val();
    postdata.eValue = $("#txtevalue").val();
    postdata.a_task = $("#txta_task").val();
    postdata.Title = $("#txtTitle").val();
    postdata.sheetTitle = $("#txtsheetTitle").val();
    postdata.count = $("#txtcount").val();
    var url = __URL + "/HuiLog/export_port_current_log";
    var loadlayer = parent.layer.msg('请稍后...', { icon: 16, time: 20000 });//
    ajaxasyn(url, postdata, true, 'POST', 'json', function (msg) {
        parent.layer.close(loadlayer);//关闭加载框
        if (msg != "no") {
            var href = __URL + "Api/download_file/FileName/" + msg;
            window.open(href);
        } else {
            parent.layer.msg('操作失败', { icon: 5 });//5:哭脸
        }
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
















/**
* ajax封装
* url 发送请求的地址
* data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
* async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
*       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
* type 请求方式("POST" 或 "GET")， 默认为 "GET"
* dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
* successfn 成功回调函数 data
* errorfn 失败回调函数 emg
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

