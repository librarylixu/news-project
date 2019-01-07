/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap']);
//主控制器
appModule.controller('crmBulletinController', ['$scope','dataService', '$q', function ($scope,dataService, $q) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    /*
        查询公告板（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_bulletin(params).then(function (res) {
            $scope.service.bulletinArrData = P_objecttoarray($scope.service.privateDateObj.bulletinData);
        });
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //查询
    $scope.select();
}])

