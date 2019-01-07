angular.module('AceApp')
.controller('eimDsviewsetController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源 
    $scope.Source = angular.copy(dataService);//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    /*
        查询（本页面使用）数据
        flag 1 强制刷新
    */
    $scope.select = function () {
        select_dsviewsetlist().then(function () {
            $scope.Source.data =angular.copy( $scope.service.privateDateObj.dsviewsetData[0]);
        });
    }
    //打开同步页面按钮
    $scope.opensyncModel = function () {     
            $scope.service.title = '同步设备';
            $scope.service.openModal('Eimdevice/Dsviewset/open_sync_model', 'modaldsviewsetController');
    }
    /*
    保存信息
    */
    $scope.save = function () {
        var params = {};
        var num = 0;
        if ($scope.Source.Action == 1) {
            //如果是修改信息，就需要传id
            if ($scope.Source.data.iddsviewset) {
                params['iddsviewset'] = $scope.Source.data.iddsviewset;
            }          
        }
        angular.forEach($scope.Source.data, function (value, key) {
            if (value != $scope.service.privateDateObj.dsviewsetData[0][key]) {
                params[key] = $scope.Source.data[key];
                num++;
            }
        });
        $scope.Source.postData(__URL + "Eimsystemsetting/Dsviewset/" + $scope.Source.data.iddsviewset ? "update_page_data" : "add_page_data", params).then(function (data) {           
            if (data > 0) {
                if ($scope.Source.data.iddsviewset) {                  
                    $scope.Source.data._kid = $scope.Source.data.iddsviewset;
                    $scope.service.privateDateObj.dsviewsetData[0] = angular.copy($scope.Source.data);
                } else {
                    $scope.Source.data.iddsviewset = data;
                    $scope.service.privateDateObj.dsviewsetData[0] = angular.copy($scope.Source.data);
                }                      
                        layer.msg('保存成功', { icon: 6 });
                        return;
                    }
                    //修改失败
                    layer.msg('修改失败', { icon: 5 });
                   
        }, function (error) {
            console.log(error);
        });
    };
    
    
    //页面加载完成后，查询数据
    $scope.select();
}]).controller('modaldsviewsetController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {    
    $scope.service = dataService;
    //已选的要同步的设备
    $scope.service.synclist = {};
    //获取所有DSV设备
    $scope.getAlldsvinfo = function () {
        $scope.service.postData(__URL + "Eimsystemsetting/Dsviewset/sync_postgres_devices", $scope.service.privateDateObj.dsviewsetData[0]).then(function (res) {
            $scope.alldsvData = res;
        });       
    }
    $scope.getAlldsvinfo();
   
    //同步勾选设备信息
    $scope.syncDevice = function () {
        if (Object.keys($scope.service.synclist).length > 0) {
            var params=JSON.stringify($scope.synclist);
            $scope.service.postData(__URL + 'Eimsystemsetting/Dsviewset/save_sel_syncdevice',params).then(function (data) {
                if (data > 0) {
                    layer.msg('同步成功', { icon: 6 });
                }
            });
        }
    }
    /*
    保存信息
    */
    $scope.save = function () {
        var params = {};
        var num = 0;
        params.sel_data = JSON.stringify($scope.service.synclist);
        $scope.service.postData(__URL + 'Eimsystemsetting/Dsviewset/save_sel_syncdevice', params).then(function (data) {
            if (Object.keys(data).length > 0) {               
                angular.forEach(data, function (value, key) {
                    if (key.indexOf("err")>-1) {
                        $scope.display = true;
                        $scope.alldsvData[value].error = true;
                    }
                });
                layer.msg('同步成功', { icon: 6 });
            } else {
                //修改失败
                layer.msg('同步失败', { icon: 5 });
            }

        }, function (error) {
            console.log(error);
        });
    };
    //选中需要同步的设备，并存储
    $scope.checkDevice = function (item) {
        if ($scope.service.synclist[item.oid]) {
            delete $scope.service.synclist[item.oid]
        } else {
            $scope.service.synclist[item.oid] = item;
        }
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);





