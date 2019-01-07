angular.module('AceApp')
.controller('eimAssetsdeviceController', ['$scope', 'dataService', '$q',  function ($scope, dataService, $q) {
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    //要开启会话的设备数据
    $scope.service.gatewayData = [];
    $scope.service.treevalue = 'devicegroup';
    //取消按钮
    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
    //打开模态框
    /**
    *title：模态框标题
    *rulesel ：模态框显示内容 0（密码规则选择框） 1（账号密码输入框）2（开会话的方式选择框）
    */
    $scope.service.openmodel = function (title, rulesel) {
        $scope.service.title = title;//'选择要使用的密码';
        $scope.service.rulesel = rulesel;
        $scope.service.openModal(__URL + 'Eimbase/Directive/selRule', 'eimAssetsdeviceController');
    }
    //确定
    $scope.save_rule = function (rulesel) {
        if (rulesel == 0) {
            $scope.service.rowdevice.loginuser = $scope.service.refpasswordData.login;
            $scope.service.rowdevice.loginpwd = $scope.service.refpasswordData.pwd;
            $scope.service.CreateSessionWorkLog();
            $scope.cancel();
        } else if (rulesel == 1) {
            $scope.service.rowdevice.loginuser = $scope.service.rowdevice.loginuser;
            $scope.service.rowdevice.loginpwd = $scope.service.rowdevice.loginpwd;
            $scope.service.CreateSessionWorkLog($scope.service.rowdevice,  $scope.service.rowsession);
            $scope.cancel();
        } else if (rulesel == 2) {
            if ($scope.service.refsessionData == 1) {
                //抢占
                $scope.cancel();
                $scope.service.openmodel('输入账号&密码', 1);

                return;
            }
            //} else if ($scope.Source.refsessionData == 2) {
            //    //加入


            //} else if ($scope.Source.refsessionData == 3) {
            //    //监控


            //}
        }
    }
    /*
        查询（本页面使用）数据
        refresh 为true则强制刷新
    */
    $scope.select = function (refresh) {
        var params = {};
        params['$json']= true;
        select_assetsdevice(params, refresh).then(function () {
            layer.msg('数据加载完毕', { icon: 6 });
        });
      //会话打开方式
        select_devicesessiontype(params);
        select_user(params);
        select_usertype(params);
        
        //查询设备类型
        select_devicetype(params).then(function (res) {
            //查询设备型号
            select_modeltype(params);
        });
        //查询会话控制中心
        select_sessioncenterlist(params);
       
    }
    //根据tree导航去查询数据源
    $scope.service.gettreedata = function () {
        $scope.service.directive = {};
        if ($scope.service.treevalue == "devicegroup") {
            //组件设备组
            $scope.service.directive.treedata = $scope.service.createTreeData($scope.service.devicegroupData, 'groupname');
        } else if ($scope.service.treevalue == "usergroup") {
            //组件用户组
            $scope.service.directive.treedata = $scope.service.createTreeData($scope.service.usergroupData, 'groupname');
        } 
    }
    //点击左侧树结构查询数据,查询所有表数据
    $scope.dirctive_tree_click = function (node) {
        angular.forEach($scope.service.privateDateObj.assetsdeviceData, function (value, key) {
            value.display = true;
            switch ($scope.service.treevalue) {
                case 'devicegroup':
                    if (value.refdgroup && value.refdgroup.split) {
                        value.refdgroup = value.refdgroup.split(',');
                    }
                    angular.forEach(value.refdgroup, function (val) {
                        if (val == node.iddevicegroup) {
                            value.display = false;
                        }
                    });
                    break;
                case 'usergroup':
                    if (value.refugroup && value.refugroup.split) {
                        value.refugroup = value.refugroup.split(',');

                    }
                    angular.forEach(value.refugroup, function (val) {
                        if (val == node.idusergroup) {
                            value.display = false;
                        }
                    });
                    break;
            }
        });
    }
  
    //添加按钮
    $scope.btn_add = function () {
        $scope.service.title = '添加资产设备';
        $scope.modalHtml ='Eimdevice/Devicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改资产设备按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = '修改资产设备';
        $scope.modalHtml =  'Eimdevice/Devicelist/openmodal';
        $scope.modalController = 'modalAssetsdeviceController';
        $scope.service.selectItem = row;
        angular.forEach($scope.service.selectItem, function (value,key) {
            if ((key == 'refusers' || key == 'refugroup' || key == 'refdgroup' || key == 'refenterpwd')&&value&&value.split) {
                $scope.service.selectItem[key] = value.split(',');
            }
        });
        publicControllerUpdate($scope);
    }
       
    //删除按钮
    $scope.btn_del = function (node) {       
        var index = layer.open({
            content: '确认删除【' + node.devicename + '】设备，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除设备',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params.idassetslist=node.idassetslist;
                $scope.service.postData(__URL + 'Eimdevice/Assetsdevicelist/del_page_data', params).then(function (data) {
                    if (data>0) {
                        layer.msg('删除成功', { icon: 1 });
                        node._kid = node.idassetslist;
                        $scope.service.delData('assetsdeviceData', node);
                    }
                });
                layer.close(index);
            }
        });
    }
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Eimbase/Directive/bacth_import';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'devicelist';
        $scope.service.name = '资产设备';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //同步设备按钮
    $scope.btn_synchronization = function (row) {
        //加载层-风格4
        var index = layer.msg('加载中', { icon: 16, shade: 0.01, time: 2000000 });
        var rowarr = [];
        var params = {};
        for (var key in row) {
            rowarr[key] = row[key];
            params[key]= row[key];
        }
        //把型号类型得名称组件一下传给后台
        params['modeltypename']= $scope.service.modeltypeData[row.modeltypeid].modelname;
        dataService.postData(__URL + 'Eimdevice/Devicelist/synchronization_device', params).then(function (data) {
            if (data.length > 0) {
                layer.close(index);//关闭加载
                //更新数据源
                layer.msg("同步成功！", { icon: 6 });
            } else {
                layer.close(index);//关闭加载
                layer.msg("同步失败！", { icon: 5 });
            }
        });
    }

    /*
        开启多会话
        $scope.service.gatewayData 中是已勾选后的数据array
    */
    $scope.opengateway = function () {
        //判断是多个会话
        if (Object.keys($scope.service.gatewayData).length < 2) {
            layer.msg("请打开多个会话后再试！", { icon: 5 });
            return;
        }
        //给初始值，用于做模态框判断
        //是否已开启会话
        $scope.service.isopensession = [];
        //是否手动输入账号密码
        $scope.service.ismanualinputpwd = [];
        //是否存在多个密码规则
        $scope.service.ismultiplepwdrules = [];
        //是否有多个设备会话类型
        $scope.service.issessiontype = [];
        for (var i in $scope.service.gatewayData) {
            if (i == 'removeElm') {
                return;
            }
            //检查当前设备是否已开启会话 0：空闲，1：使用中
            if ($scope.service.gatewayData[i].sessionstatus == "1") {
                //是否开启会话记录
                $scope.service.isopensession[$scope.service.gatewayData[i].idassetslist] = $scope.service.gatewayData[i];
            }

            //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
            if ($scope.service.gatewayData[i].isenterpwd == "1") {
                var enterpwdUserlist_Arr = $scope.service.gatewayData[i].refenterpwd ? $scope.service.gatewayData[i].refenterpwd.split(',') : [];
                var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                if (index < 0) {
                    //是否手动输入账号密码
                    $scope.service.ismanualinputpwd[$scope.service.gatewayData[i].idassetslist] = $scope.service.gatewayData[i];
                }
            }

            //检测设备帐号密码是否已设置
            if (!$scope.service.gatewayData[i].loginuser || !$scope.service.gatewayData[i].loginpwd) {
                //请设置帐号密码
                //组建所有关联的密码id的数据
                $scope.initData($scope.service.gatewayData[i]);
            }

        }
        //是否存在多个密码规则/是否已开启会话/是否手动输入账号密码
        if ($scope.service.isopensession.length > 0 || $scope.service.ismanualinputpwd.length > 0 || $scope.service.ismultiplepwdrules.length > 0) {
            $scope.service.title = '详细信息';
            $scope.modalHtml ='Eimdevice/Devicelist/opensessionmodel';
            $scope.modalController = 'modalOpensessionsController';
            publicControllerAdd($scope);
        }

        //layer.msg("开启成功！", { icon: 6 });
    }
    $scope.select();
}])
.controller('modalAssetsdeviceController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    /*
        模态框
    */
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
   

    //选择设备类型时触发，组建设备型号可选项
    $scope.checked_devicetypeid = function (num) {
        if (!num) {
            $scope.Source.selectItem.modeltypeid = '';
        }       
        $scope.OptionalmodeltypeData = {};
        $scope.service.devicesessiontypeids = [];
        angular.forEach($scope.service.privateDateObj.modeltypeData, function (value, key) {
            if (value.typeid == $scope.seldevicetypeid) {
                $scope.OptionalmodeltypeData[key] = value;
            }
        });
        if (!$scope.Source.selectItem.modeltypeid || $scope.Source.selectItem.modeltypeid != $scope.service.selectItem.modeltypeid) {
            if (Object.keys($scope.OptionalmodeltypeData).length < 1) {
                return;
            }
            $scope.Source.selectItem.modeltypeid = $scope.OptionalmodeltypeData[Object.keys($scope.OptionalmodeltypeData)[0]].idmodeltype;
        }
        if (num == 1) {
            //当默认进来初始化默认选中项时，参数num为1，默认选中项不移除，当设备型号切换时，没有参数num，移除掉默认选中项
            $scope.checked_modeltypeid(1);
        } else {
            $scope.checked_modeltypeid();
        }
    }
    //选择会话类型id组建可选的设备会话类型
    $scope.Source.devicesessiontypeData = {};
    $scope.checked_modeltypeid = function (num) {
        if (num != 1) {
            $scope.service.devicesessiontypeids = [];
        }
        var devicesessiontypeids = $scope.Source.modeltypeData[$scope.Source.selectItem.modeltypeid].devicesessiontypeids;
        if (devicesessiontypeids == undefined) {
            $scope.Source.devicesessiontypeData = {};
            return;
        }
        $scope.Source.devicesessiontypeData = {};
        angular.forEach(devicesessiontypeids, function (value, key) {
            if ($scope.service.devicesessiontypeData[value] != undefined) {
                $scope.Source.devicesessiontypeData[value] = angular.copy($scope.service.devicesessiontypeData[value]);
            }
        });
    }

    switch ($scope.service.Action) {
        case 0:
            //初始化
            //添加默认值
            $scope.Source.selectItem.isenterpwd = 0;          
            $scope.seldevicetypeid = 10;
            $scope.checked_devicetypeid();
            break;
        case 1:
            if ($scope.Source.selectItem.isenterpwd==1) {
                $scope.Source.selectItem.isenterpwd = true;
            } else {
                $scope.Source.selectItem.isenterpwd = false;
            }
            //初始化也设备类型选中数据
            $scope.seldevicetypeid = 10;
            //初始化设备型号可选项
            $scope.checked_devicetypeid(1);
            //当前设备的会话类型 自定义指令使用 修改时，显示当前设备类型下所有会话类型，然后根据将已选择的会话类型选中
            if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.split) {
                $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.split(',');

            }
            //把详细配置信息转换成对象
            if ($scope.Source.selectItem.sessionsetting && Object.prototype.toString.call($scope.Source.selectItem.sessionsetting) == '[object String]') {
                $scope.Source.selectItem.sessionsetting = JSON.parse($scope.Source.selectItem.sessionsetting);
            } else {
                $scope.Source.selectItem.sessionsetting = {};
            }
            
            break;
        case 2:
            break;
        default:

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
            default:
                layer.msg('暂无配置项', { icon: 0 });
                break;
        }
        if (modalHtml) {
            $scope.modalController = 'modalconfigdevicesessiontypeController';
            $scope.service.sessionsetting = row;
            $scope.service.openModal(modalHtml, $scope.modalController);
        }
    }
    //保存按钮
    $scope.btn_save = function () {
        var params = {};
        var url = __URL + 'Eimdevice/Assetsdevicelist/add_page_data';
        if ($scope.Source.Action == 1) {            
            url = __URL + 'Eimdevice/Assetsdevicelist/update_page_data';
            params["idassetslist"]= $scope.Source.selectItem.idassetslist;//资产设备id    
        }        
        $scope.Source.selectItem.sessionstatus = 0;//设备会话状态
        if (!$scope.Source.selectItem.sessionsetting) {
            $scope.Source.selectItem.sessionsetting = {};
        }
        //把详细配置信息转成字符串
        if ($scope.service.sessionsetting) {           
            $scope.Source.selectItem.sessionsetting[$scope.service.sessionsetting.typename] = $scope.service.sessionsetting.setting;
            $scope.Source.selectItem.sessionsetting = JSON.stringify($scope.Source.selectItem.sessionsetting);
        } else {
            if (Object.keys($scope.Source.selectItem.sessionsetting).length > 0) {
                $scope.Source.selectItem.sessionsetting = JSON.stringify($scope.Source.selectItem.sessionsetting);;
            } else {
                $scope.Source.selectItem.sessionsetting = '';
            }
        }
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if (value === true) {
                value = 1;
            } else if (value === false) {
                value = 0;
                $scope.Source.selectItem.refenterpwd = '';
            }
            if (value != $scope.service.selectItem[key]) {
                if (value.join) {
                    value = value.join(',');
                }
                params[key]= value;
            }
        });       
        dataService.postData(url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        layer.msg("添加成功", { icon: 6 });
                        $scope.Source.selectItem._kid = data;
                        $scope.Source.selectItem.idassetslist = data;
                        if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.join) {
                            $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.join(',');
                        }
                       dataService.addData('assetsdeviceData', $scope.Source.selectItem);

                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        layer.msg("编辑成功", { icon: 6 });                       
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idassetslist;
                        if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.join) {
                            $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.join(',');
                        }                      
                        dataService.updateData('assetsdeviceData', $scope.Source.selectItem);
                    } else {
                        layer.msg("编辑失败", { icon: 5 });
                    }

                    break;               
            }
            $uibModalInstance.close('ok');
        }, function (error) {
            console.log(error);
        });
    };
    //会话方式选中状态
    $scope.ngchange_devicesessiontype = function (row) {
        if (!$scope.Source.selectItem.devicesessiontypeids) {
            $scope.Source.selectItem.devicesessiontypeids = [];
        }       
        //取消选中
        if ($scope.Source.selectItem.devicesessiontypeids.indexOf(row.iddevicesessiontype) > -1) {
           //把配置好的自定义配置字段转成json
            if ($scope.Source.selectItem.sessionsetting && Object.prototype.toString.call($scope.Source.selectItem.sessionsetting) == '[object String]') {
                $scope.Source.selectItem.sessionsetting = JSON.parse($scope.Source.selectItem.sessionsetting);
            }
            //从选中会话方式中删除
            $scope.Source.selectItem.devicesessiontypeids.splice($scope.Source.selectItem.devicesessiontypeids.indexOf(row.iddevicesessiontype), 1);
            //清除该项默认的配置
            if ($scope.Source.selectItem.sessionsetting[row.typename]) {
                $scope.Source.selectItem.sessionsetting[row.typename] = '';               
            }
        } else {
            //选中动作，把选中项的id加到已选项里面来
            $scope.Source.selectItem.devicesessiontypeids.push(row.iddevicesessiontype);
        }       
    }
    //取消按钮
    $scope.btn_cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('modalconfigdevicesessiontypeController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    /*
    设备会话类型的详细配置 模态框
    */
    $scope.Source = angular.copy(dataService);//要显示到页面上的数据源
    $scope.service = dataService;
    if ($scope.Source.selectItem.sessionsetting && Object.prototype.toString.call($scope.Source.selectItem.sessionsetting) == '[object String]') {
        $scope.Source.selectItem.sessionsetting = JSON.parse($scope.Source.selectItem.sessionsetting);
       
    }
    if ($scope.service.sessionsetting.setting && Object.prototype.toString.call($scope.service.sessionsetting.setting) == '[object String]') {
        $scope.service.sessionsetting.setting = JSON.parse($scope.service.sessionsetting.setting);
    }
    /*
    gateway:请使用“on”和“off”作为布尔类型的值，不要使用 true 和 false。
    修改bool类型值
    flag: 为true则将bool型值转 on off，为false则将on off转true false
    */
    $scope.init_boolean = function (obj, flag) {
        angular.forEach(obj, function (value, key) {
            angular.forEach(value, function (val, k) {
                //将bool型数据值以on off保存
                if (flag) {
                    if (typeof val == "boolean") {
                        obj[k] = val ? "on" : "off";
                    }
                } else {
                    if (val == "on" || val == "off") {
                        obj[k] = val == "on" ? true : false;
                    }
                }
            });
        });
        return obj;
    }
    //赋值默认数据
    $scope.setDefaultData = function (typename) {
        switch (typename) {
            case 'RDP': case 'xRDP':
                //该方式并不会将select默认选中，如果rdpConfig中select默认值改变，必须手动修改html页对应属性的默认值
                $scope.service.sessionsetting.setting = rdpConfig;
                break;
            case 'VNC':
                $scope.service.sessionsetting.setting = vncConfig;
                break;
            case 'SSH':
                $scope.service.sessionsetting.setting = sshConfig;
                break;
            case 'TELNET':
                $scope.service.sessionsetting.setting = telnetConfig;
                break;
            case 'KVM':
                $scope.service.sessionsetting.setting = kvmConfig;
                break;
            default:
        }
    }
    //页面加载时 如果没有配置则去默认值
    if ($scope.Source.selectItem.sessionsetting) {
        //当该资产设备有相关配置数据时
        var ConfigData = $scope.init_boolean($scope.Source.selectItem.sessionsetting, false);
        if (ConfigData[$scope.service.sessionsetting.typename]) {
            $scope.service.sessionsetting.setting = ConfigData[$scope.service.sessionsetting.typename];
        } else if ($scope.service.sessionsetting.setting) {
           // $scope.service.sessionsetting.setting = $scope.service.sessionsetting.setting;
        } else {
            $scope.setDefaultData($scope.service.sessionsetting.typename);
        }
        //保留一份未修改时的数据
        $scope.service.sessionsetting.settings = angular.copy($scope.service.sessionsetting.setting);
    } else if ($scope.service.sessionsetting.setting) {
        //当资产没有相关配置，但是有会话相关配置时
        // $scope.service.sessionsetting.setting = $scope.service.sessionsetting.setting;
        //保留一份未修改时的数据
        $scope.service.sessionsetting.settings = angular.copy($scope.service.sessionsetting.setting);
    } else {
        //当资产既没有相关配置，又没有会话相关配置时
        $scope.setDefaultData($scope.service.sessionsetting.typename);
        //保留一份未修改时的数据
        $scope.service.sessionsetting.settings = angular.copy($scope.service.sessionsetting.setting);
    }
    //全屏幕按钮
    $scope.btn_useFullScreen = function () {
        $scope.service.sessionsetting.setting.width = screen.width;
        $scope.service.sessionsetting.setting.height = screen.height;
    }
    
    $scope.config_save = function () {
        if ($scope.service.sessionsetting.typename == 'RDP') {
            angular.forEach($scope.service.sessionsetting.setting, function (value, key) {
                if (key != 'credSSP') {
                    if (value === true) {
                        $scope.service.sessionsetting.setting[key] = 'on';
                    } else if (value === false) {
                        $scope.service.sessionsetting.setting[key] = 'off';
                    }
                }
            });
        }
        // $scope.Source.selectItem.sessionsetting[$scope.service.sessionsetting.typename] = $scope.service.sessionsetting.setting;
        $uibModalInstance.close();
    };
    //取消按钮
    $scope.config_cancel = function () {
        //保留一份未修改时的数据
        $scope.service.sessionsetting.setting = angular.copy($scope.service.sessionsetting.settings);
        $uibModalInstance.dismiss('cancel');
    };
}]).controller('modaluploadfileController', ['$scope', 'dataService', "$uibModalInstance", 'FileUploader', function ($scope, dataService, $uibModalInstance, FileUploader) {
    $scope.service = dataService;
    $scope.uploadStatus = false; //定义两个上传后返回的状态，成功获失败
    $scope.fileid = "";
    var uploader = $scope.uploader = new FileUploader({
        url: __URL + 'Eimbase/Batchimport/fecth_import_users',
        queueLimit: 1,     //文件个数 
        removeAfterUpload: true   //上传后删除文件
    });

    $scope.clearItems = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
    }

    uploader.onAfterAddingFile = function (fileItem) {
        $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        if (response.status) {
            $scope.uploadStatus = true;   //上传成功则把状态改为true
            $scope.service.path = response.path;
        } else {
            $scope.uploadStatus = false;
        }

    };

    $scope.UploadFile = function () {
        uploader.uploadAll();
    }
    $scope.preview = function () {
        $scope.cancel();

        $scope.service.title = '查看预览';
        var url = __URL + 'Eimdevice/Assetsdevicelist/preview';
        $scope.service.openModal(url, 'devicepreviewController');
    }
    //模板下载 
    $scope.UploadTemplate = function () {
        window.open(__URL + 'Crmsetting/Annex/downLoadtemplate?name=' + $scope.service.type);
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
    .controller('devicepreviewController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
        $scope.service = dataService;//要显示到页面上的数据源   
        $scope.devicepreviewsData = [];
        $scope.select = function () {
            var params = {};
            params.fileid = $scope.service.path;
            dataService.postData(__URL + 'Eimbase/Batchimport/readExcel', params).then(function (data) {
                var keyName = data.value[0];
                angular.forEach(data.value, function (value, key) {
                    if (key > 0 && value[0]) {
                        var simpleData = {};
                        angular.forEach(keyName, function (val, k) {
                            if (val) {
                                simpleData[val] = value[k];
                            }
                           
                        });
                        $scope.devicepreviewsData.push(simpleData);
                    }
                });
                var model = document.getElementById('previewUser').parentNode;
                model.style.marginLeft = '-200px';
                model.style.marginRight = '-200px';

            }, function (error) {
                console.log(error);
            });
        }
        //保存选项按钮
        //type  0表示保存所有数据 1表示保存选中的数据
        $scope.save = function (type, rowData) {
            //已选数据
            var currentSelection = [];
            if (type == 0) {
                //循环添加所有数据数据库
                for (var i = 0; i < $scope.devicepreviewsData.length; i++) {
                    $scope.addUser($scope.devicepreviewsData[i]);
                }
            } else if (type == 1) {
                if ($scope.devicepreviewsData.length == 0) {
                    layer.msg('没选择任何数据', { icon: 0 });
                }
                //循环添加所有数据数据库
                for (var i = 0; i < $scope.devicepreviewsData.length; i++) {
                    $scope.addUser($scope.devicepreviewsData[i]);
                }

            } else if (type == 2) {

                $scope.addUser(rowData, 2);
            }
            console.log($scope.devicepreviewsData);

        }

        $scope.addUser = function (user, type) {
            var params = {};
            //组建每条数据的参数
            angular.forEach(user, function (value, key) {               
                params[key]= value;
            });
            dataService.postData(__URL + "Eimdevice/Assetsdevicelist/add_page_data", params).then(function (data) {
                //当添加失败时，
                if (data < 0) {
                    errData.push(user);
                    console.log(user);
                    return;
                } else if (data > 0) {
                    user.idassetslist = data;
                    if (type == 2) {
                        layer.msg('添加成功', {icon:6});
                    }
                }

            }, function (error) {
                console.log(error);
            });
        }

        //页面加载完成后，查询数据
        $scope.select();
        //取消按钮
        $scope.cancel = function () {
            $scope.$dismiss('cancel');
        };
    }]);
