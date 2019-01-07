//添加编辑的控制器
/*
modal+业务+Controller

新增一个字段 _kid 值为当前数据源id的值

此控制器中仅用作了工单中的删除功能
*/
appModule.controller('modalSuggestboxController', ["$scope", "$uibModalInstance", 'dataService', function ($scope, $uibModalInstance, dataService) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);