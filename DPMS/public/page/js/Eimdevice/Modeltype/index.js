//'datePicker', 'colorpicker.module'
angular.module('AceApp')
.controller('eimModeltypeController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    /*
        查询（本页面使用）数据
    */
    $scope.select = function () {
        var params = {};
        params['$json']= true;        
        select_modeltype(params).then(function (res) {
            angular.forEach($scope.service.privateDateObj.modeltypeData, function (value, key) {
                if (key=='devicesessiontypeids' && value.split) {
                    value = value.split(',');
                }
            });
        });
      
            select_devicetype(params);       
            //查询会话方式
            select_devicesessiontype(params);
    }
    //添加按钮
    $scope.btn_add = function () {
        $scope.service.title = "添加设备型号";
        $scope.modalHtml ='Eimdevice/Modeltype/openmodal';
        $scope.modalController = 'modalModeltypeController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = "修改设备型号";
        $scope.modalHtml = 'Eimdevice/Modeltype/openmodal';
        $scope.modalController = 'modalModeltypeController';
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    $scope.btn_del = function (row) {
        var index = layer.open({
            content: '确认删除设备类型【' + row.modelname + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除设备型号',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['idmodeltype'] = row.idmodeltype;
                $scope.service.postData(__URL + 'Eimdevice/Modeltype/delete_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        row._kid = row.idmodeltype;
                        $scope.service.delData('modeltypeData', row);
                    }
                });
                layer.close(index);
            }
        });
    }
    //页面加载完成后，查询数据
    $scope.select();
}]).controller('modalModeltypeController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //控制详细配置按钮显示与否（该按钮在资产设备页面中使用，在此页面不适用）
    $scope.service.is_show_config_directive = false;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Eimdevice/Modeltype/add_page_data';
            break;
        case 1:
            $scope.url += 'Eimdevice/Modeltype/update_page_data';
            break;       
        default:
            alert.show('Action Error!', 'Error');
            $uibModalInstance.dismiss('cancel');
            break;
    }
    /*
    保存信息
    @cuslevel
    添加本页面得数据时： cuslevel 0一次添加 1连续添加 不关闭窗口
    在添加关系时： checked得属性，true为选中状态和false为为选中状态
    */
    $scope.save = function () {
        var params = {};
        var num=0;
        if ($scope.Source.Action == 1) {          
            params['idmodeltype']= $scope.Source.selectItem.idmodeltype;
        }
        angular.forEach($scope.Source.selectItem, function (value, key) {            
            if (key.indexOf('__') < 0 && value != $scope.service.selectItem[key]) {
                if (value&&value.join) {
                     value = value.join(",");
                }
                num++;
               params[key]= value;
            }
        });
        if (!$scope.Source.selectItem.labelclass) {
            $scope.params['labelclass']= '#5661c9';
            num++;
        }
        $scope.Source.postData($scope.url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        $scope.Source.selectItem._kid = data;
                        $scope.Source.selectItem.idmodeltype = data;
                        dataService.addData('modeltypeData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg("添加成功", { icon: 6 });
                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idmodeltype;
                        $scope.service.modeltypeData[$scope.Source.selectItem.idmodeltype] = angular.copy($scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg('修改成功', { icon: 6 });
                    } else {
                        layer.msg("修改失败", { icon: 5 });
                    }
                    break;               
            }
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);





