//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize', 'textAngular', 'ui.select']);
appModule.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        taOptions.toolbar[0].splice(3);
        taOptions.toolbar[3] = [];
        return taOptions;
    }]);
});
//主控制器
appModule.controller('detailShipmentsController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //存一份userid
    $scope.service.userid = _userid;
    //取工单
    $scope.shipmentsData = $scope.service.privateDateObj.shipmentsData[_id] ? $scope.service.privateDateObj.shipmentsData[_id] : $scope.service.privateDateObj.shipmentscloseData[_id];
    //这里去查询设备序列号信息
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('refship', _id);
        $scope.service.postData(__URL + 'Crmschedule/Shipmentsdevice/select_page_data', params).then(function (data) {
            $scope.service.shipdeviceData = data;
            //产品
            select_product(params);
            //产品型号
            select_productmodel(params);
            //项目供货清单数据
            select_project_devicelist(params);
        });
    }
    $scope.select();
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //打印按钮
    $scope.print = function () {
        window.print();
    }
    //取消按钮
    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
}]);