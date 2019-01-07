var accetsDeviceModule = angular.module('accetsDeviceModule',
    ['ui.bootstrap', 'ui.grid', 'ui.grid.edit', 'ui.grid.grouping',
     'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize']);


accetsDeviceModule.service('crmPageModuleDataService', ['$http', '$q', '$uibModal', function ($http, $q, $uibModal) {
    publicDataService($q, this, $uibModal);
}]);

accetsDeviceModule.factory('alert', ['$uibModal', function ($uibModal) {
    return publicAlertService($uibModal);
}]);
//要在表格中显示的字段及名称，提取出来便于更改和查看
function columns() {
    return [{
        name: 'idusertype', displayName: '', width: '20%', enableFiltering: false, cellClass: 'text-center',
        cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            return '<i class="fa fa-user bigger-120"></i>'
        }
    },
     { name: 'type', displayName: '设置名称', width: '30%', enableFiltering: true, cellClass: 'text-center' },
     {
         name: 'value', displayName: '值', width: '30%', enableFiltering: false, cellClass: 'text-center',        
     },
     
     {
         name: 'group_type', displayName: '操作', width: '20%', enableFiltering: false, cellClass: 'text-left',
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<a href="javascript:;" class="green top-5"  ng-click="grid.appScope.updateInfo(row)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5"  ng-click="grid.appScope.remove(row)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
         }
     }];
}

//主控制器
crmPageModule.controller('crmPageController', ['$scope', 'i18nService', 'crmPageModuleDataService', 'uiGridGroupingConstants', 'uiGridConstants', 'alert', function ($scope, i18nService, crmPageModuleDataService, uiGridGroupingConstants, uiGridConstants, alert) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = crmPageModuleDataService;//要显示到页面上的数据源
    /*
        查询用户角色（本页面使用）数据
    */
    $scope.select = function () {
        $scope.service.postData(__URL + 'Crmuser/AppUserPreference/select_page_data', {}).then(function (data) {
            $scope.service.allData = data;
            $scope.gridOptions.data = $scope.service.allData;
        }, function (error) {
            console.log(error);
        });
    }
}]);