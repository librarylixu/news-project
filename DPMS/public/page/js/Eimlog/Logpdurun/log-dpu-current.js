/*

    DPMS\Home\View\h-ui-dpms\log-dpu-current.html
*/
$(function () {
    table_bind();
});

var table = null;
function table_bind() {
    if (table != null) {
        table.destroy();
        $('#table_dpu_current').empty();
    }
    table = $('#table_dpu_current').DataTable({
        "destroy": true,//销毁
        "autoWidth": false,//如果已经指定了列宽,那么自动计算就关闭，提高性能
        "processing": true,
        "bFilter": false, //关闭右上角检索
        "ajax": {
            "dataType": 'json',
            "type": "POST",
            "url": __APP + '/Eimbase/Logdputotalcurrent/async_get_dpu_current_data',
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
            { title: 'DPU名称', "class": 'text-center' ,data:''},
            { title: 'DPUIP地址' ,data:''},
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
    postdata.Dpus = $("#seldpus").val();
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
    if ($("#DataTables_Table_0_info").html() == "无记录") {
        parent.layer.msg('没有数据', { icon: 5 });
        return;
    } else {
        $("#savetablediv").show();
    }
}

//导出保存
function exportlogsave() {
    var postdata = new Object();
    postdata.sTime = $("#txtstime").val();
    postdata.eTime = $("#txtetime").val();
    postdata.Dpus = $("#seldpus").val();
    postdata.sValue = $("#txtsvalue").val();
    postdata.eValue = $("#txtevalue").val();
    postdata.a_task = $("#txta_task").val();
    postdata.Title = $("#txtTitle").val();
    postdata.sheetTitle = $("#txtsheetTitle").val();
    //postdata.count = $("#txtcount").val();
    var url = "__MODULE__/HuiLog/export_dpu_current_log";
    var loadlayer = parent.layer.msg('请稍后...', { icon: 16, time: 20000 });//
    ajaxasyn(url, postdata, true, 'POST', 'json', function (msg) {
        parent.layer.close(loadlayer);//关闭加载框
        if (msg != "no") {
            var href = "__MODULE__/Api/download_file/FileName/" + msg;
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




