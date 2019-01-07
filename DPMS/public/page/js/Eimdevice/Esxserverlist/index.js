angular.module('AceApp')
.controller('eimEsxserverController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    //要开启会话的设备数据
    $scope.service.gatewayData = [];
    $scope.service.treevalue = "devicegroup"
    /*
        查询（本页面使用）数据
    */
    $scope.select = function (refresh) {
        var params = {};
        params['$json']= true;
        //虚拟机
        select_vmdevicelist(params, refresh).then(function (res) {
            //宿主机
            select_esxserverlist(params, refresh);
        });
        
        //会话打开方式
        select_devicesessiontype(params).then(function (res) {
            $scope.service.Directive_SessionButtonData = angular.copy($scope.service[res]);
        });
        select_user(params);
        //用户类型
      //  select_usertype(params);        
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
        angular.forEach($scope.service.privateDateObj.esxserverData, function (value, key) {
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
        $scope.service.title = '添加ESX虚拟机';
        $scope.modalHtml = 'Eimdevice/Esxserverlist/openmodal';
        $scope.modalController = 'modalEsxserverController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = '修改ESX虚拟机';
        $scope.modalHtml = 'Eimdevice/Esxserverlist/openmodal';
        $scope.modalController = 'modalEsxserverController';
        $scope.service.selectItem = row;
        angular.forEach($scope.service.selectItem, function (value, key) {
            if ((key == 'refusers' || key == 'refugroup' || key == 'refdgroup' || key == 'refenterpwd') && value && value.split) {
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
                params['idesxserverlist'] = node.idesxserverlist;
                $scope.service.postData(__URL + 'Eimdevice/Esxserverlist/del_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        node._kid = node.idesxserverlist;
                        $scope.service.delData('esxserverData', node);
                    }
                });
                layer.close(index);
            }
        });
    }
    //同步设备按钮 row 当前操作行数据，num 开关pdu使用
    $scope.btn_synchronization = function (row, num) {
        //加载层-风格4
        var index = layer.msg('加载中', { icon: 16, shade: 0.01, time: 2000000 });
        var rowarr = [];
        var params = {};
        //把需要的命令及参数组建好传给后台
        if (num == '1') {
            params['type']= 'executeesxi\r\n' + row.idvmdevicelist + '\r\nPowerOn';
        } else if (num == '2') {
            params['type']= 'executeesxi\r\n' + row.idvmdevicelist + '\r\nPowerOff';
        } else if (num == '3') {
            params['type']= 'executeesxi\r\n' + row.idvmdevicelist + '\r\nSuspend';
        } else {
            params['type']= 'syncesxi\r\n' + row.idesxserverlist;
        }
        dataService.postData(__URL + 'Eimdevice/Esxserverlist/sync_write_vm', params).then(function (time) {
            $scope.num = 0;
            $scope.sync_read_file(time, $scope.num, index);
        });
    };    
    //同步时，读取同步状态文件的接口
    $scope.sync_read_file = function (time,index) {
        var params = {};
        //把需要的命令及参数组建好传给后台
        params['time']= time;
        dataService.postData(__URL + 'Eimdevice/Esxserverlist/sync_read_vm', params).then(function (result) {
            if (result == -1) {
                if ($scope.num < 60) {//此处60是等待同步时长为60秒，以后要放到系统设置中去设置，超时时长
                    setTimeout(function () { $scope.sync_read_file(time, $scope.num) }, 1000);
                    $scope.num++;
                } else {
                    layer.close(index);//关闭加载
                    if (num == '1') {
                        layer.msg('开机超时', { icon: 0 });
                    } else if (num == '2') {
                        layer.msg('关机超时', { icon: 0 });
                    } else if (num == '3') {
                        layer.msg('挂起超时', { icon: 0 });
                    } else {
                        layer.msg('同步超时', { icon: 0 });
                    }
                    
                }
            } else {
                var params = new URLSearchParams();
                params.append('$json', true);
                select_vmdevicelist(params, 1);
                layer.close(index);//关闭加载
                if (num == '1') {
                    layer.msg('开机成功', { icon: 0 });
                } else if (num == '2') {
                    layer.msg('关机成功', { icon: 0 });
                } else if (num == '3') {
                    layer.msg('挂起成功', { icon: 0 });
                } else {
                    layer.msg('同步成功', { icon: 0 });
                }               
            }
        });
    }

    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Eimbase/Directive/bacth_import';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'esxserverlist';
        $scope.service.name = '虚拟机设备';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    $scope.select(0);
}])
.controller('modalEsxserverController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    /*
        模态框
    */
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //组建设备类型可选项
    $scope.builddevicetype = function () {
        //设备类型可选项数据
        $scope.OptiondevicetypeData = {};
        angular.forEach($scope.service.privateDateObj.devicetypeData, function (value, key) {
            if (key < 9&&key>5) {
                $scope.OptiondevicetypeData[key] = value;
            }
        });
    }
    $scope.builddevicetype();
    //选择设备类型时触发，组建设备型号可选项
    $scope.checked_devicetypeid = function (num) {
        if (!num) {
            $scope.Source.selectItem.modeltypeid = '';
        }
        $scope.OptionalmodeltypeData = {};
        $scope.service.devicesessiontypeids = [];
        angular.forEach($scope.service.privateDateObj.modeltypeData, function (value, key) {
            if (value.typeid == $scope.Source.selectItem.seldevicetypeid) {
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
        //devicesessiontypeids
        if (!$scope.Source.selectItem.modeltypeid) {
            $scope.Source.devicesessiontypeData = {};
            return;
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
            $scope.Source.selectItem.seldevicetypeid = 6;
            $scope.checked_devicetypeid();
            break;
        case 1:
            if ($scope.service.selectItem.idesxserverlist) {
                if ($scope.Source.selectItem.isenterpwd == 1) {
                    $scope.Source.selectItem.isenterpwd = true;
                } else {
                    $scope.Source.selectItem.isenterpwd = false;
                }
                //初始化也设备类型选中数据
                $scope.Source.selectItem.seldevicetypeid = $scope.service.privateDateObj.modeltypeData[$scope.Source.selectItem.modeltypeid].typeid;
                //初始化设备型号可选项
                $scope.checked_devicetypeid(1);
                
            } else {
                //当前设备的会话类型 自定义指令使用 修改时，显示当前设备类型下所有会话类型，然后根据将已选择的会话类型选中
                if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.split) {
                    $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.split(',');

                }
            }

            break;
        default:
            break;

    }   
    //保存按钮
    $scope.btn_save = function () {
        var params = {};
      // params.append("$fetchSql", true);
        var url = __URL + 'Eimdevice/Esxserverlist/add_page_data';
        if ($scope.Source.Action == 1) {
            if ($scope.service.selectItem.idesxserverlist) {
                url = __URL + 'Eimdevice/Esxserverlist/update_page_data';
                params["idesxserverlist"]= $scope.Source.selectItem.idesxserverlist;//宿主机id    
            } else {
                url = __URL + 'Eimdevice/Vmdevicelist/update_page_data';
                params["idvmdevicelist"]= $scope.Source.selectItem.idvmdevicelist;//宿主机id   
            }         
        }       
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if (key != 'seldevicetypeid') {
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
            }
            
        });
        dataService.postData(url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        layer.msg("添加成功", { icon: 6 });
                        $scope.Source.selectItem._kid = data;
                        $scope.Source.selectItem.idesxserverlist = data;
                        if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.join) {
                            $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.join(',');
                        }
                        dataService.addData('esxserverData', $scope.Source.selectItem);

                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        layer.msg("编辑成功", { icon: 6 });

                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idesxserverlist ? $scope.Source.selectItem.idesxserverlist : $scope.Source.selectItem.idvmdevicelist;
                        if ($scope.Source.selectItem.devicesessiontypeids && $scope.Source.selectItem.devicesessiontypeids.join) {
                            $scope.Source.selectItem.devicesessiontypeids = $scope.Source.selectItem.devicesessiontypeids.join(',');
                        }
                        if ($scope.Source.selectItem.idesxserverlist) {
                            dataService.updateData('esxserverData', $scope.Source.selectItem);
                        } else {
                            dataService.updateData('vmdeviceData', $scope.Source.selectItem);
                        }
                        
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
            //从选中会话方式中删除
            $scope.Source.selectItem.devicesessiontypeids.splice($scope.Source.selectItem.devicesessiontypeids.indexOf(row.iddevicesessiontype), 1);           
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
.controller('modalOpensessionsController', ['$scope', "$uibModalInstance", 'dataService', function ($scope, $uibModalInstance, dataService) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    angular.forEach($scope.service.gatewayData, function (value) {
        $scope.service.CreateSessionWorkLog(value, $scope.service.Directive_SessionButtonData[i]);
    })

    //取消按钮
    $scope.btn_cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('modaluploadfileController', ['$scope', 'dataService', "$uibModalInstance", 'FileUploader', function ($scope, dataService, $uibModalInstance, FileUploader) {
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
        var url = __URL + 'Eimdevice/Esxserverlist/preview';
        $scope.service.openModal(url, 'esxpreviewController');
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
 .controller('esxpreviewController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
        $scope.service = dataService;//要显示到页面上的数据源   
        $scope.esxpreviewsData = [];
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
                        $scope.esxpreviewsData.push(simpleData);
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
                for (var i = 0; i < $scope.esxpreviewsData.length; i++) {
                    $scope.addUser($scope.esxpreviewsData[i]);
                }
            } else if (type == 1) {
                if ($scope.esxpreviewsData.length == 0) {
                    layer.msg('没选择任何数据', { icon: 0 });
                }
                //循环添加所有数据数据库
                for (var i = 0; i < $scope.esxpreviewsData.length; i++) {
                    $scope.addUser($scope.esxpreviewsData[i]);
                }

            } else if (type == 2) {

                $scope.addUser(rowData, 2);
            }
            console.log($scope.esxpreviewsData);

        }

        $scope.addUser = function (user, type) {
            var params = {};
            //组建每条数据的参数
            angular.forEach(user, function (value, key) {
                params[key] = value;
            });
            dataService.postData(__URL + "Eimdevice/Esxserverlist/add_page_data", params).then(function (data) {
                //当添加失败时，
                if (data < 0) {
                    errData.push(user);
                    console.log(user);
                    return;
                } else if (data > 0) {
                    user.idesxserverlist = data;
                    if (type == 2) {
                        layer.msg('添加成功', { icon: 6 });
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