/*
自定义的会话类型指令
$scope.service.devicesessiontypeids 保存所有已选类型id，同时根据该数组中的id勾选会话类型
*/
app.directive('eimDevicesessioontype', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/refDeviceSessionType',
        replace: true,
        //scope: {
        //    //是否显示设备会话类型的详细配置，添加设备时使用
        //    configchecked: '=configchecked'
        //},
        controller: function ($scope) {
            //console.log("eimDevicesessioontype");
            //保存所有已选类型id，同时根据该数组中的id勾选会话类型
            if ($scope.service.devicesessiontypeids == undefined || $scope.service.devicesessiontypeids.length <= 0) {
                $scope.service.devicesessiontypeids = [];
            }
            //是否显示设备会话类型的详细配置，添加设备时使用
            //$scope.is_show_config_directive = $scope.configchecked ? true : false;
            //console.log($scope.devicesessiontypeData);
            $scope.ngchange_devicesessiontype = function (obj, item) {
                if (obj.target.checked) {
                    $scope.service.devicesessiontypeids.push(item.iddevicesessiontype);
                } else {  
                    var index = $scope.service.devicesessiontypeids.indexOf(item.iddevicesessiontype);
                    $scope.service.devicesessiontypeids.splice(index, 1);
                }
                return obj.target.checked;
            }
        }
    }
});
