angular.module('AceApp')
.controller('eimSystemsettingController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    $scope.Source = angular.copy(dataService);
    $scope.save = function (type, isChange) {
        var page_json = { type:type,value: angular.copy($scope.Source.privateDateObj.systemsettingData[type].value) };
        if (isChange) {          
            angular.forEach($scope.Source.privateDateObj.systemsettingData[type].value, function (value, key) {               
                if (Object.prototype.toString.call($scope.Source.privateDateObj.systemsettingData[type].value) == '[object Array]') {
                    $scope.Source.privateDateObj.systemsettingData[type].value[key]= value.join(",");
                }              
            });            
        }
        var params = {};
        params.type = type;
       
        if (Object.prototype.toString.call($scope.Source.privateDateObj.systemsettingData[type].value) == '[object Object]') {
            params.value = JSON.stringify($scope.Source.privateDateObj.systemsettingData[type].value);
        } else {
            if (type == 'ruleexpirtime') {
                if ($scope.service.privateDateObj.systemsettingData.ruleexpirtime.value != ($scope.dt.getTime() / 1000).toFixed(0)) {
                    //将标准时间转换成时间戳
                    params.value = Date.parse($scope.dt) / 1000;
                }
            } else {
                params.value = angular.copy($scope.Source.privateDateObj.systemsettingData[type].value);
            }
        }      
        $scope.service.postData(__URL + "Eimsystemsetting/Systemsetting/update_page_data", params).then(function (data) {
            if (data > 0) {
                page_json._kid = page_json.type;
                $scope.service.updateData('systemsettingData', page_json);
                parent.privateDateObj.systemsettingData = $scope.service.privateDateObj.systemsettingData;
                layer.msg('修改成功', { icon: 6 });
            } else {
                layer.msg('修改失败', { icon: 5 });
            }
        });
    }
}]);