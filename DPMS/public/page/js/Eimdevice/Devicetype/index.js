angular.module('AceApp')
.controller('eimDevicetypeController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
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
        select_devicetype(params).then(function (res) {
            angular.forEach($scope.service.privateDateObj.modeltypeData, function (value, key) {
                if ($scope.service.privateDateObj.devicetypeData[value.typeid]) {
                    if (!$scope.service.privateDateObj.devicetypeData[value.typeid].__modeltypeid) {
                        $scope.service.privateDateObj.devicetypeData[value.typeid].__modeltypeid = [];
                    }
                    $scope.service.privateDateObj.devicetypeData[value.typeid].__modeltypeid.push(key);
                }
            });           
        });
    }
    //查询型号数据
    $scope.selectmodeltype = function () {
        var params = {};
        params['$json'] = true;
        select_modeltype(params).then(function (res) {
            $scope.select();
        });
    }
    //添加按钮
    $scope.add = function (row) {
        $scope.service.title = "添加设备类型";
        $scope.modalHtml ='Eimdevice/Devicetype/openmodal';
        $scope.modalController = 'modalDevicetypeController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = "修改设备类型";
        $scope.modalHtml ='Eimdevice/Devicetype/openmodal';
        $scope.modalController = 'modalDevicetypeController';
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //修改按钮
    $scope.del = function (row) {
        var index = layer.open({
            content: '确认删除设备类型【' + row.typename + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除设备类型',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['iddevicetype'] = row.iddevicetype;
                $scope.service.postData(__URL + 'Eimdevice/Devicetype/delete_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        row._kid = row.iddevicetype;
                        $scope.service.delData('devicetypeData', row);
                    }
                });
                layer.close(index);
            }
        });
    }
    //页面加载完成后，查询数据
   
    $scope.selectmodeltype();
}]).controller('modalDevicetypeController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL + 'Eimdevice/Devicetype/add_page_data';
    
    /*
    保存信息
    */
    $scope.save = function () {
        $scope.params = {};
        var num = 0;
        if ($scope.service.Action == 1) {
            $scope.params.append('iddevicetype', $scope.Source.selectItem.iddevicetype);
            $scope.url = __URL + 'Eimdevice/Devicetype/update_page_data';
        }
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if (key.indexOf('__')<0&&value != $scope.service.selectItem[key]) {
                $scope.params[key]=value;
                num++;
            }
        });       
        if (!$scope.Source.selectItem.labelclass) {
            $scope.params['labelclass']= '#5661c9';
            num++;
        }
        if (num == 0) {            
            $scope.modelchange(0);
            return;
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data > 0) {
                if ($scope.service.Action == 1) {
                    $scope.service.devicetypeData[$scope.Source.selectItem.iddevicetype] = angular.copy($scope.Source.selectItem);
                    //修改成功
                    layer.msg('修改成功', { icon: 6 });                    
                } else {
                    $scope.Source.selectItem.iddevicetype = data;
                    $scope.Source.selectItem._kid = data;
                    dataService.addData('devicetypeData', $scope.Source.selectItem);
                    //修改成功
                    layer.msg('添加成功', { icon: 6 });
                }
                $scope.modelchange();
                $uibModalInstance.close('ok');
                return;
            }
            //修改失败
            layer.msg($scope.service.Action == 1 ? '修改' : '添加' + '失败', { icon: 5 });
        }, function (error) {
            console.log(error);
        });
    };
    /*
    关联设备型号
    */
    $scope.modelchange = function (num) {
        var params = {};
        if ($scope.Source.selectItem.__modeltypeid != $scope.service.selectItem.__modeltypeid) {            
            angular.forEach($scope.Source.selectItem.__modeltypeid, function (value) {
                if ($scope.Source.selectItem.__modeltypeid.indexOf(value) < 0) {
                    params['idmodeltype']=value;
                    $scope.saveModeltype(params, value);
                }               
            });
        } else {
            if (num == 0) {
                layer.msg('您未修改任何内容', { icon: 0 });
            }
            return;
        }        
    }
    //保存型号关系id的方法
    $scope.saveModeltype = function (params, __modeltypeid) {
        $scope.Source.postData(__URL + 'Eimdevice/Modeltype/update_page_data', params).then(function (data) {
            //与设备类型添加关系
            if (data > 0) {
                if (__modeltypeid) {
                    //更新service中的关系数据源
                    $scope.service.modeltypeData[__modeltypeid].typeid = $scope.Source.selectItem.iddevicetype;
                }
            } else {
                layer.msg('型号关系修改失败', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);;


