angular.module('AceApp')
.controller('eimDevicesessiontypeController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    /*
        查询（本页面使用）数据
    */
    $scope.select = function (flag) {
        var params = {};
        params['$json']= true;      
        select_devicesessiontype(params);
    }
    //修改按钮
    $scope.btn_updateInfo = function (row) {
        $scope.service.title = "修改设备会话类型";
        $scope.modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodal';
        $scope.modalController = 'modaldevicesessiontypeController';
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.btn_deleteInfo = function (row) {
        var index = layer.open({
            content: '确认删除设备会话类型【' + row.typename + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除设备会话类型',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['idmodeltype'] = row.iddevicesessiontype;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/del_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        row._kid = row.iddevicesessiontype;
                        $scope.service.delData('devicesessiontypeData', row);
                    }
                });
                layer.close(index);
            }
        });
    }
    //详细配置  -  会话控制中心详细配置
    $scope.btn_configinfo = function (row) {
        $scope.service.title = '会话类型详细配置';
        var modalHtml;
        switch (row.iddevicesessiontype) {
            case '1':
               modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodalsshconfig';
                break;
            case '2':
               modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodaltelnetconfig';
                break;
            case '3':
                modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodalrdpconfig';
                break;
            case '5':
                modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodalvncconfig';
                break;
            case '9':
                modalHtml = 'Eimsystemsetting/Devicesessiontype/openmodalrdpconfig';
                break;
            default:
                layer.msg('暂无配置项', { icon: 0 });
                break;
        }
        if (modalHtml) {
            $scope.modalController = 'modalconfigdevicesessiontypeController';
            $scope.service.selectItem = row;
            $scope.service.openModal(modalHtml, $scope.modalController);
        }     
    }
    //页面加载完成后，查询数据
    $scope.select();
}]).controller('modaldevicesessiontypeController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;   
    /*
    保存信息   
    */
    $scope.save = function (cuslevel) {
        var params = new URLSearchParams();
        params.append('iddevicesessiontype', $scope.Source.selectItem.iddevicesessiontype);
        angular.forEach($scope.Source.selectItem, function (value,key) {
            if (value != $scope.service.selectItem[key]) {
                params.append(key, value);
            }
        });     
       $scope.Source.postData(__URL + 'Eimsystemsetting/Devicesessiontype/update_page_data', params).then(function (data) {
           if (data == 1) {
               //修改成功                        
               $scope.Source.selectItem._kid = $scope.Source.selectItem.iddevicesessiontype;
               dataService.updateData('devicesessiontypeData', $scope.Source.selectItem);
               $uibModalInstance.close('ok');
               layer.msg('修改成功', { icon: 6 });
               return;
           }
           //修改失败
           layer.msg('修改失败', { icon: 5 });
       }, function (error) {
           console.log(error);
       });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]).controller('modalconfigdevicesessiontypeController', ['$scope', '$uibModalInstance', 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);//要显示到页面上的数据源
    $scope.service = dataService;
    /*
    gateway:请使用“on”和“off”作为布尔类型的值，不要使用 true 和 false。
    修改bool类型值
    flag: 为true则将bool型值转 on off，为false则将on off转true false
    */
    $scope.init_boolean = function (obj, flag) {
        angular.forEach(obj, function (value, key) {
            //将bool型数据值以on off保存
            if (flag) {
                if (typeof value == "boolean") {
                    obj[key] = value ? "on" : "off";
                }
            } else {
                if (value == "on" || value == "off") {
                    obj[key] = value == "on" ? true : false;
                }
            }
        });
        return obj;
    }
    //页面加载时 如果没有配置则去默认值
    if (!$scope.Source.selectItem.setting) {
       $scope.Source.selectItem.setting = {};
        switch ($scope.Source.selectItem.iddevicesessiontype) {
            case '3':
                //该方式并不会将select默认选中，如果rdpConfig中select默认值改变，必须手动修改html页对应属性的默认值
               $scope.Source.selectItem.setting = rdpConfig;
                break;
            case '5':
               $scope.Source.selectItem.setting = vncConfig;
                break;
            case '1':
               $scope.Source.selectItem.setting = sshConfig;
                break;
            case '2':
               $scope.Source.selectItem.setting = telnetConfig;
                break;
            case '6':
               $scope.Source.selectItem.setting = kvmConfig;
                break;
            default:

        }

        var ConfigData = $scope.init_boolean($scope.Source.selectItem.setting, false);
       $scope.Source.selectItem.setting = ConfigData;
    } else {
        var ConfigData = JSON.parse($scope.Source.selectItem.setting);
        ConfigData = $scope.init_boolean(ConfigData, false);
       $scope.Source.selectItem.setting = ConfigData;
    }
    //全屏幕按钮
    $scope.btn_useFullScreen = function () {
       $scope.Source.selectItem.setting.width = screen.width;
       $scope.Source.selectItem.setting.height = screen.height;
    }
    //根据typename区分保存内容
    $scope.btn_save = function () {
        var saveConfigData = angular.copy($scope.Source.selectItem.setting);
        saveConfigData = $scope.init_boolean(saveConfigData, true);
        switch ($scope.Source.selectItem.iddevicesessiontype) {
            case '3': case '4':
                //过滤默认值
                if (saveConfigData.width == 0) {
                    delete saveConfigData.width;
                }
                if (saveConfigData.height == 0) {
                    delete saveConfigData.height;
                }
                break;
            case '5':
                //vnc会话不需要将true false 转换为 on off
                saveConfigData = $scope.init_boolean(saveConfigData, false);
                break;
            case '1':
                //过滤默认值
                if (saveConfigData.width == 0) {
                    delete saveConfigData.width;
                }
                if (saveConfigData.height == 0) {
                    delete saveConfigData.height;
                }
                break;          
            default:
        }
        var params = {};
        params['iddevicesessiontype']= $scope.service.selectItem.iddevicesessiontype;
        params['setting']=JSON.stringify(saveConfigData);
        //将配置转为json保存
        $scope.Source.postData(__URL + 'Eimsystemsetting/Devicesessiontype/update_page_data', params).then(function (data) {
            if (data == 1) {
                $scope.service.selectItem.setting = JSON.stringify(saveConfigData);
                //添加失败
                layer.msg('保存成功', { icon: 6 });
                $uibModalInstance.close();
                return;
            }
            layer.msg('保存失败', { icon: 5 });
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]); 




