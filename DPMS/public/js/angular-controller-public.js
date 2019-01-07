/*
AngularController层的公用方法
*/

/*
ui-Grid 表格配置对象

*/
var publicControllerGridOptions =function(vm){ 
    return {
        
        enableFiltering: false,//是否可筛选
        enablePagination: true, //是否分页，默认为true
        enablePaginationControls: true, //使用默认的底部分页
        paginationPageSizes: [10, 15, 20, 50, 100, 500, 1000], //每页显示个数可选项
        paginationCurrentPage: 1, //当前页码
        paginationPageSize: 1000, //每页显示个数
        enableSorting: true, //是否排序
        useExternalSorting: false, //是否使用自定义排序规则
        enableGridMenu: true, //是否显示grid 菜单
        showGridFooter: true, //是否显示grid footer
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
       onRegisterApi : function (gridApi) {
           vm.gridApi = gridApi;
        },
    //    exporterAllDataFn: function(){
    //    return getPage(1,$scope.gridOptions.totalItems);
    //},
    
        //exporterSuppressColumns: ['cusRefcontact', 'cusReftype', 'cusReflevel', 'cusRefindustry', 'cusRefsource', 'cusRefstage', 'cusRefstatus', 'cusRefcompany', 'cusRefcredit', 'cusRefmarket', 'cusRefcity', 'cusRefannex', 'cusRefshipaddress', 'cusRefuser', 'cusRefusertype', 'cusRefusergroup'],//过滤不需要的列 
        //----------- 选中 ----------------------
        //enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
        //enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
        //enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
        //enableRowSelection: true, // 行选择是否可用，默认为true;
        //enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
        //enableSelectionBatchEvent: true, //默认true
        //isRowSelectable: function (row) { //GridRow
        //    if (row.entity.age > 45) {
        //        row.grid.api.selection.selectRow(row.entity); // 选中行
        //    }
        //},
        //modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
        //multiSelect: true,// 是否可以选择多个,默认为true;
        //noUnselect: false,//默认false,选中后是否可以取消选中
        //selectionRowHeaderWidth: 30,//默认30 ，设置选择列的宽度； 
        };
}
/*
数据源的添加方法
会弹出窗口
@vm  : $scope
*/
var publicControllerAdd = function (vm) {
    vm.service.Action = 0;
    vm.service.openModal(vm.modalHtml, vm.modalController);
}
/*
数据源的修改方法
会弹出窗口
@vm  : $scope
*/
var publicControllerUpdate = function (vm) {
    vm.service.Action = 1;
    vm.service.openModal(vm.modalHtml, vm.modalController);
}
/*
数据源的删除方法
*/
var publicControllerDel = function (vm) {
    vm.service.Action = 2;
    vm.service.openModal(vm.modalHtml, vm.modalController);
}
/*
用于关联使用
会弹出窗口
@vm  : $scope
vm.service.Action 自己指定
*/
var publicControllerRef = function (vm) {
    vm.service.openModal(vm.modalHtml, vm.modalController);
}
/*
页面刷新方法
*/
var refresh = function () {
    location.replace(location.href);
}

/*
ui-grid
每一行在渲染的时候，把子集的数量加上

eg:cellTemplate: '<span ng-bind-html="grid.appScope.levelSplit(row,this)"></span>'
*/

var publicControllerLevelSplit = function (rowdata, rowObj) {
    var cellValue = rowdata.entity[rowObj.col.name];
    //如果有子集
    if (rowdata.entity.childCount > 0) {
        cellValue += "(" + rowdata.entity.childCount + ")";
    }
    //如果是根节点
    if (rowdata.entity.$$treeLevel == 0) {
        //rowObj.col.name指的是列头的name值
        return cellValue;
    }
    //如果是子节点
    var value = "|";
    var befor = "";
    if (rowdata.entity.level) {
        for (var i = 0; i < rowdata.entity.level; i++) {
            value += "--";
            befor += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
    } else {
        for (var i = 0; i < rowdata.entity.group_index; i++) {
            value += "--";
            befor += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
    }
   
    value += cellValue;
    return befor + value;
}


