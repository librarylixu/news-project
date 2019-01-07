angular.module('AceApp')
.controller('eimAssetsdeviceController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;   
    /*
        查询（本页面使用）数据
    */
    $scope.select = function (flag) {
        var params = new URLSearchParams();
        params.append('$json', true);
        if (flag == 1 || $scope.service.assetsdeviceData == undefined) {
            select_assetsdevice(params).then(function (res) {
                //$scope.service.assetsdeviceData
                //console.log($scope.service[res]);
                layer.msg('数据已刷新', { icon: 6 });
            });
        }
        //查询会话方式
        if (flag == 1 || $scope.service.devicesessiontypeData == undefined) {
            select_devicesessiontype(params).then(function (res) {
                //$scope.service.devicesessiontypeData
                //console.log($scope.service[res]);            
            });
        }
        //查询用户组数据
        if (flag == 1 || $scope.service.usergroupData == undefined) {
            select_usergroup(params).then(function (res) {
                //$scope.service.usergroupData
                //console.log($scope.service[res]);
            });
        }
        //查询设备型号
        if (flag == 1 || $scope.service.modeltypeData == undefined) {
            select_modeltype(params).then(function (res) {
                //$scope.service.modeltypeData
                //console.log($scope.service[res]);
            });
        }

    }  

    
    //添加按钮
    $scope.btn_add = function () {
        $scope.service.title = '添加资产设备';
        $scope.modalHtml = __URL + 'Eimdevice/Assetsdevicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        //$scope.service.modalPlacement = "right";
        //$scope.service.modalSize = "lg";
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.btn_update = function (row) {
        $scope.service.title = '修改资产设备';
        $scope.modalHtml = __URL + 'Eimdevice/Assetsdevicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        //$scope.service.modalPlacement = "right";
        //$scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //关联用户组按钮
    $scope.btn_refgroup = function (row) {
        $scope.service.title = '关联用户组';
        $scope.modalHtml = __URL + 'Eimdevice/Assetsdevicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        $scope.service.selectItem = row;
        $scope.service.ref = 'refgroup';
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.btn_del = function (row) {
        $scope.service.title = '删除资产设备';
        $scope.modalHtml = __URL + 'Eimdevice/Assetsdevicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        //$scope.service.modalPlacement = "right";
        //$scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerDel($scope);
    }

    $scope.select(0);
}])
.controller('modalAssetsdeviceController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
      
    //当前设备的会话类型
    if ($scope.service.selectItem.devicesessiontypeids == undefined) {
        $scope.service.selectItem.devicesessiontypeids = [];
    } else {
        if (Object.prototype.toString.call($scope.service.selectItem.devicesessiontypeids) == '[object Array]') {
            $scope.service.selectItem.devicesessiontypeids = $scope.service.selectItem.devicesessiontypeids;
        } else {
            $scope.service.selectItem.devicesessiontypeids = $scope.service.selectItem.devicesessiontypeids.split(',');
        } 
    }
    //打开用户组页面时才去组件
    if (dataService.Action != 2 && $scope.Source.ref == 'refgroup') {
        //选中的用户组
        if ($scope.Source.selectItem.refugroup && Object.prototype.toString.call($scope.service.selectItem.refugroup) == '[object String]') {
            $scope.Source.selectItem.refugroup = $scope.Source.selectItem.refugroup.split(',');
        }
        $scope.tempData = [];
        //临时数据源，中间的大圈
        $scope.tempData = [];
        /*
        组建父子之间的关系结构
        */
        $scope.createNewData = function () {
            angular.forEach($scope.Source.usergroupData, function (value, key) {
                var i = value.pid;
                if (i == -1 || i == '0') {
                    value.isParent = true;
                    $scope.tempData.push(value);
                    return;
                    //$scope.service.oldusergroupData[i] == undefined  : 此处为了防止找不到pid得情况，从而导致js报错，页面数据丢失
                } else if ($scope.Source.usergroupData[i] == undefined) {
                    value.isParent = true;
                    $scope.tempData.push(value);
                    return;
                } else if ($scope.Source.usergroupData[i].children == undefined) {
                    $scope.Source.usergroupData[i].children = [value];
                    $scope.Source.usergroupData[i].isParent = true;
                } else {
                    $scope.Source.usergroupData[i].children.push(value);
                    $scope.Source.usergroupData[i].isParent = true;
                }
            });
            //console.log($scope.tempData);
            return $scope.tempData;
        }

        //组件最终的tree数据源
        $scope.service.usergroupdata = $scope.createNewData();
        //选中某项
        $scope.refgroupArr = function (event,item) {
            if (event.target.checked) {
                $scope.Source.selectItem.refugroup.push(item.idusergroup);

            } else {
                var index = $scope.Source.selectItem.refugroup.indexOf(item.idusergroup);
                $scope.Source.selectItem.refugroup.splice(index, 1);
            }
        };
       
    }
    //控制会话打开方式是否选中
    $scope.isSelected = function (id) {
        return $scope.service.selectItem.devicesessiontypeids.indexOf(id) >= 0;
    };

    switch ($scope.service.Action) {
        case 0:
            //添加默认值
            $scope.service.selectItem.isenterpwd = 0;
            break;
        default:

    }
    
    
    
    /*
    

    ////查询设备类型
    //$scope.selectdevicetype = function () {
    //    var params = new URLSearchParams();
    //    params.append('$json', true);
    //    select_devicetype(params).then(function (res) {
    //        //$scope.service.devicetypeData
    //        console.log($scope.service[res]);
    //        //$scope.service.selectItem.devicetypeid = 3;
    //        //$scope.service.producttypeArrData = P_objecttoarray($scope.service[res]);
    //    });
    //}
    //$scope.selectdevicetype();
    //$scope.checked_devicetypeid = function () {
    //    $scope.selectmodeltype($scope.service.selectItem.devicetypeid);
    //}
    ////查询设备型号
    //$scope.selectmodeltype = function (devicetypeid) {
    //    var params = new URLSearchParams();
    //    params.append('$json', true);
    //    params.append('typeid', devicetypeid);
    //    select_modeltype(params).then(function (res) {
    //        //$scope.service.modeltypeData
    //        console.log($scope.service[res]);
    //    });
    //}
        */


    
    //查询会话控制中心
    $scope.selectsessioncenterData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_sessioncenterlist(params).then(function (res) {
            //$scope.service.sessioncenterData
           // console.log($scope.service[res]);
        });
    }
    $scope.selectsessioncenterData();
    //多选会话方式 组建当前设备的会话类型
    $scope.ngchange_devicesessiontype = function (obj, item) {
        if (obj.target.checked) {
            $scope.service.selectItem.devicesessiontypeids.push(item.iddevicesessiontype);

        } else {
            var index = $scope.service.selectItem.devicesessiontypeids.indexOf(item.iddevicesessiontype);
            $scope.service.selectItem.devicesessiontypeids.splice(index, 1);
        }
        //console.log($scope.service.selectItem.devicesessiontypeids.join(','));
    }
    //会话类型详细配置 - 弹框
    $scope.btn_configinfo = function (sessiontype) {
        $scope.service.title = '会话类型详细配置';
        $scope.modalHtml = __URL + 'Eimdevice/Assetsdevicelist/openmodalconfig';
        $scope.modalController = 'modalconfigdevicesessiontypeController';
        $scope.service.selectItem.sessiontype = sessiontype;
        $scope.service.openModal($scope.modalHtml, $scope.modalController);
    }
    //保存按钮
    $scope.btn_save = function () {
        //console.log($scope.service.settings);
        //return;       
        var params = new URLSearchParams();
        var url;       
        if ($scope.Source.Action == 0 || $scope.Source.Action == 1) {
            url = 'Eimdevice/Assetsdevicelist/add_page_data';
            if ($scope.Source.Action == 1) {
                url = 'Eimdevice/Assetsdevicelist/update_page_data';
                if ($scope.Source.ref == 'refgroup') {
                    params.append("idassetslist", $scope.Source.selectItem.idassetslist);//资产设备id
                    params.append("refugroup", $scope.Source.selectItem.refugroup.join(','));//关联用户组id
                }
            }
            if (!$scope.Source.ref) {
                angular.forEach($scope.Source.selectItem, function (value, key) {
                    if (value) {
                        params.append(key, value);
                    }

                });
                params.append("modeltypeid", 39);//资产设备型号id
                params.append("devicesessiontypeids", $scope.service.selectItem.devicesessiontypeids.join(','));//会话型号id
            }
        } else {

            url = 'Eimdevice/Assetsdevicelist/del_page_data';
            params.append("idassetslist", $scope.Source.selectItem.idassetslist);//资产设备id
        }
        //$fetchSql
        //params.append('$fetchSql', true);
        dataService.postData(__URL + url, params).then(function (data) {
            switch ($scope.Source.Action){
                case 0:
                    if (data > 0) {
                        layer.msg("添加成功", { icon: 6 });
                        $scope.Source.selectItem._kid = data;
                        dataService.addData('assetsdeviceData', $scope.Source.selectItem);
                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        layer.msg("编辑成功", { icon: 6 });
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idassetslist;
                        if ($scope.service.ref) {
                            $scope.Source.selectItem.refugroup = $scope.Source.selectItem.refugroup.join(',');
                        }
                        dataService.updateData('assetsdeviceData', $scope.Source.selectItem);
                    } else {
                        layer.msg("编辑失败", { icon: 5 });
                    }                  
                    break;
                case 2:
                    if (data > 0) {
                        layer.msg("删除成功", { icon: 6 });
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idassetslist;
                        dataService.delData('assetsdeviceData', $scope.Source.selectItem);
                    } else {
                        layer.msg("删除失败", { icon: 5 });
                    }
                   
                    break;
            }
            $uibModalInstance.close('ok');
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.btn_cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('modalconfigdevicesessiontypeController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);//要显示到页面上的数据源
    $scope.service = dataService;
    if (Object.prototype.toString.call($scope.service.selectItem.sessiontype) == '[object String]') {
        $scope.service.selectItem.sessiontype.setting = JSON.parse($scope.service.selectItem.sessiontype.setting);
    }
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
    if ($scope.service.selectItem.sessiontype == undefined || $scope.service.selectItem.sessiontype == "") {
        $scope.service.selectItem.sessiontype.setting = {};
        switch ($scope.service.selectItem.sessiontype.typename) {
            case 'RDP': case 'xRDP':
                //该方式并不会将select默认选中，如果rdpConfig中select默认值改变，必须手动修改html页对应属性的默认值
                $scope.service.selectItem.sessiontype.setting = rdpConfig;
                break;
            case 'VNC':
                $scope.service.selectItem.sessiontype.setting = vncConfig;
                break;
            case 'SSH':
                $scope.service.selectItem.sessiontype.setting = sshConfig;
                break;
            case 'TELNET':
                $scope.service.selectItem.sessiontype.setting = telnetConfig;
                break;
            case 'KVM':
                $scope.service.selectItem.sessiontype.setting = kvmConfig;
                break;
            default:
        }
    } else {
        var ConfigData = {};
        if (Object.prototype.toString.call($scope.service.selectItem.sessiontype) == '[object Object]') {
            ConfigData = $scope.service.selectItem.sessiontype;
        } else {
            ConfigData = JSON.parse($scope.service.selectItem.sessiontype);
        }
        ConfigData = $scope.init_boolean(ConfigData, false);
        if (Object.prototype.toString.call($scope.service.selectItem.sessiontype.setting) == '[object Object]') {
            $scope.service.selectItem.sessiontype.setting = ConfigData.setting;
        } else {
            $scope.service.selectItem.sessiontype.setting = JSON.parse(ConfigData.setting);
        }
        
    }
    //全屏幕按钮
    $scope.btn_useFullScreen = function () {
        $scope.service.selectItem.sessiontype.setting.width = screen.width;
        $scope.service.selectItem.sessiontype.setting.height = screen.height;
    }
    $scope.btn_save = function (typename) {
        var params = new URLSearchParams();
        if ($scope.service.selectItem.sessiontype.typename != 'VNC') {
            angular.forEach($scope.service.selectItem.sessiontype.setting,function(value,key){
                if (value === true) {
                    $scope.service.selectItem.sessiontype.setting[key] = 'on';
                } else {
                    $scope.service.selectItem.sessiontype.setting[key] = 'off';
                }                   
            });           
        }
        params.append('iddevicesessiontype', $scope.service.selectItem.sessiontype.iddevicesessiontype);
        params.append('setting', JSON.stringify($scope.service.selectItem.sessiontype.setting));
        //$fetchSql
        //params.append('$fetchSql', true);
        dataService.postData(__URL + 'Eimsystemsetting/Devicesessiontype/update_page_data', params).then(function (data) {
            if (data > 0) {
                layer.msg("修改成功", { icon: 6 });
               
                $uibModalInstance.close('ok');
            } else {
                angular.forEach($scope.Source.selectItem.sessiontype, function (key, value) {
                    $scope.service.selectItem.sessiontype[key]= value;
                });              
                layer.msg("修改失败", { icon: 5 });
            }

            $scope.service.selectItem.sessiontype = JSON.stringify($scope.service.selectItem.sessiontype);
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.config_cancel = function () {
        if (Object.prototype.toString.call($scope.service.selectItem.sessiontype.setting) == '[object Object]') {
            $scope.service.selectItem.sessiontype = JSON.stringify($scope.service.selectItem.sessiontype);
        }       
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('eimsessionController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.btn_open_session = function (row) {
        console.log(row);
    }
}]);