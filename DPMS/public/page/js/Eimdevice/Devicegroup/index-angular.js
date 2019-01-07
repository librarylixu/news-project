//初始化modal并定义service
angular.module('AceApp')
/*主控制器*/
.controller('eimDevicegroupController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    //查找父级组
    $scope.buildParentname = function (node, parentnode,allDataname) {
        if (node.pid && node.pid != '0') {
            if (!node.__parentname) {
                node.__parentname = parentnode.groupname;
            } else {
                node.__parentname = parentnode.groupname + '->' + node.__parentname;
            }
            if (parentnode.pid && parentnode.pid != '0') {
                $scope.buildParentname(node, $scope.service.privateDateObj[allDataname][parentnode.pid],allDataname);
            }
        } else {
            if (!node.__parentname) {
                node.__parentname = '';
            }
        }
    }
    /**
     *查询设备组数据
    **/
    $scope.select = function () {
        var parameter = {};
        parameter['$json']= true;
        select_devicegroup(parameter).then(function (res) {
            angular.forEach($scope.service.privateDateObj.devicegroupData, function (value, key) {                
                value.__refdpudevices = [];
                value.__refkvmdevices = [];
                angular.forEach($scope.service.privateDateObj.dpulistData, function (val, k) {
                    if (val.refdgroup) {
                        if (val.refdgroup.split) {
                            val.refdgroup = val.refdgroup.split(',');
                        }
                        for (var j = 0; j < val.refdgroup.length; j++) {
                            if (val.refdgroup[j] == key && value.__refdevices.indexOf(val.refdgroup[j]) < 0) {
                                value.__refdpudevices.push(val.refdgroup[j]);
                                break;
                            }
                        }
                    }
                });
                angular.forEach($scope.service.privateDateObj.kvmlistData, function (val, k) {
                    if (val.refdgroup) {
                        if (val.refdgroup.split) {
                            val.refdgroup = val.refdgroup.split(',');
                        }
                        for (var j = 0; j < val.refdgroup.length; j++) {
                            if (val.refdgroup[j] == key && value.__refdevices.indexOf(val.refdgroup[j]) < 0) {
                                value.__refkvmdevices.push(val.refdgroup[j]);
                                break;
                            }
                        }
                    }
                });
                if (!value.__parentname) {
                    $scope.buildParentname(value, $scope.service.privateDateObj.devicegroupData[value.pid], 'devicegroupData');
                }
                
            });
        });
    };
    /**
     *查询用户数据
    **/
    $scope.selectuser = function () {
        var params = {};
        params['$json']= true;
        select_user(params).then(function (res) {
           //获取设备组信息
            $scope.select();
        });
    };
    /**
     *查询用户组数据
    **/
    $scope.selectgroup = function () {
        var params = {};
        params['$json'] = true;
        select_usergroup(params).then(function (data) {
            angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                if (!value.__parentname) {
                    $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid], 'usergroupData');
                }              
            });
            //查询用户
            $scope.selectuser();
        }, function (error) {
            console.log(error);
        });
    };
    /**
      *查询资产设备数据
    **/
    $scope.selectdevice = function () {
        var params = {};
        params['$json'] = true;
        select_kvmdevicelist(params);
        select_dpulist(params);
        //查询用户组
        $scope.selectgroup();
    }
    //查询资产设备数据
    $scope.selectdevice();
    //添加按钮
    $scope.add = function (node, status) {
        $scope.service.selectItem = {};
        $scope.service.title = '新建设备组';
        $scope.modalHtml = 'Eimdevice/Devicegroup/openmodal';
        $scope.modalController = 'modalDevicegroupController';
        publicControllerAdd($scope);
    };
    //修改按钮
    $scope.updateInfo = function (node) {
        $scope.service.title = "修改设备组";
        $scope.modalHtml =  'Eimdevice/Devicegroup/openmodal';
        $scope.modalController = 'modalDevicegroupController';       
        $scope.service.selectItem = node;
        publicControllerUpdate($scope);
    };
    //删除按钮
    $scope.remove = function (node) {
        var deviceLength = '';
        if (node.__refdevices.length > 0) {
            deviceLength = '该设备组下关联了' + node.__refdevices.length + '个设备，';
        }
        var index = layer.open({
            content: '确认删除设备组【' + node.groupname + '】，' + deviceLength + '是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除设备组',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['iddevicegroup'] = node.iddevicegroup;
                $scope.service.postData(__URL + 'Eimdevice/Devicegroup/delete_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        node._kid = node.iddevicegroup;
                        $scope.service.delData('devicegroupData', node);
                    }
                });
                layer.close(index);
            }
        });
    };
    //页面加载完成后，查询数据
    $scope.select();
}])
/*模态框控制器（增删改查）*/
.controller('modalDevicegroupController', ["$scope", "$uibModalInstance", 'dataService', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL + 'Eimdevice/';
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Devicegroup/add_page_data';
           
            break;
        case 1:
            $scope.url += 'Devicegroup/update_page_data';
            if ($scope.Source.selectItem.refusers && $scope.Source.selectItem.refusers.split) {
                $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers.split(',');
            }
            if ($scope.Source.selectItem.refugroup && $scope.Source.selectItem.refugroup.split) {
                $scope.Source.selectItem.refugroup = $scope.Source.selectItem.refugroup.split(',');
            }
            break;       
        default:
            alert('Action Error!');
            break;
    }
    /*
    保存信息
    */
    $scope.save = function () {
        var params = {};
        var num = 0;
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                params['iddevicegroup']= $scope.Source.selectItem.iddevicegroup;
            }
            angular.forEach($scope.Source.selectItem,function(value,key){
                if(key.indexOf('__')<0&&value!=$scope.service.selectItem[key]){
                    params[key]= value;
                    num++;
                }
            });
            if (num == 0) {
                if ($scope.Source.selectItem.__refdevices) {
                    //保存设备与设备组关系
                    $scope.saveAssetslist();
                } else {
                    layer.msg('您未修改任何数据', { icon: 0 });
                }
                return;
            }
        $scope.Source.postData($scope.url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加设备组');
                        break;
                    }
                    $scope.Source.selectItem.iddevicegroup=data;
                    $scope.Source.selectItem._kid = data;
                    if ($scope.Source.selectItem.pid == 0) {
                        $scope.Source.selectItem.__parentname = '';
                    } else {
                        $scope.Source.selectItem.__parentname = $scope.service.privateDateObj.devicegroupData[$scope.Source.selectItem.pid].__parentname + '->' + $scope.service.privateDateObj.devicegroupData[$scope.Source.selectItem.pid].groupname;
                    }
                   
                    $scope.service.addData('devicegroupData', $scope.Source.selectItem);
                    //保存设备与设备组关系
                    $scope.saveAssetslist();
                        $uibModalInstance.close('ok');
                        layer.msg('添加成功', { icon: 6 });                  
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.iddevicegroup;
                        $scope.service.updateData('devicegroupData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg('修改成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    layer.msg('修改失败', { icon: 5 });
                    break;               
            }
        }, function (error) {
            console.log(error);
        });
    };
    //保存设备组与设备的关系
    $scope.saveAssetslist = function () {
        var url;
        angular.forEach($scope.Source.selectItem.__refdevices, function () {                      
            $scope.Source.privateDateObj.assetsdeviceData[value].refdgroup.push($scope.Source.selectItem.iddevicegroup);
            var param = {};
                param['idassetslist']= value;
                param['refdgroup']= $scope.Source.privateDateObj.assetsdeviceData[value].refdgroup.join(',');
                $scope.service.postData(__URL + 'Eimdevice/Assetsdevicelist/update_page_data', param).then(function (data) {
                    if (data > 0) {
                        $scope.service.updateData('assetsdeviceData', $scope.Source.privateDateObj.assetsdeviceData[value]);
                        layer.msg('设备关系修改成功', { icon: 6 });
                    }
                });          
        });
        angular.forEach($scope.service.selectItem.__refdevices, function () {
            if ($scope.Source.selectItem.__refdevices.indexOf(value) < 0) {
                var index = $scope.Source.privateDateObj.assetsdeviceData[value].refdgroup.indexOf(",");
                $scope.Source.privateDateObj.assetsdeviceData[value].refdgroup.splice(index, 1);
                param['idassetslist']= value;
                param['refdgroup']= $scope.Source.privateDateObj.assetsdeviceData[value].refdgroup.join(',');
                $scope.service.postData(__URL + 'Eimdevice/Assetsdevicelist/update_page_data', param).then(function (data) {
                    if (data > 0) {
                        $scope.service.selectItem.__refdevices.push(value);
                        $scope.service.updateData('assetsdeviceData', $scope.Source.privateDateObj.assetsdeviceData[value]);
                        layer.msg('设备关系修改成功', { icon: 6 });
                    }
                });
            }
        });       
    }   
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
