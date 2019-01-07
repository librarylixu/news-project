//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize']);
//主控制器
appModule.controller('detailBulletunController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    if (!$scope.service.privateDateObj.bulletinData[_id]) {
        return;
    }
    //取客户
    $scope.bulletin = $scope.service.privateDateObj.bulletinData[_id];
    
    //刷新按钮
    $scope.refresh = refresh;
   
}]);