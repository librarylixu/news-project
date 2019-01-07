angular.module('AceApp')
.controller('eimDpulistController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;
    $scope.service.treevalue = 'devicegroup';
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    //要开启会话的设备数据
    $scope.service.gatewayData = [];
    
    /*
        查询（本页面使用）数据
    */
    $scope.select = function (refresh) {
        var params = {};
        params['$json']= true;
        //端口号
        select_dpuportlist(params, refresh).then(function (res) {
            //dpu
            select_dpulist(params, refresh).then(function () {
                layer.msg('加载完毕', { icon: 6 });
            });
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
        angular.forEach($scope.service.privateDateObj.dpulistData, function (value, key) {
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
        $scope.service.title = '添加DPU';
        $scope.modalHtml = 'Eimdevice/Dpulist/openmodal';
        $scope.modalController = 'modalDpulistController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = '修改DPU';
        $scope.modalHtml = 'Eimdevice/Dpulist/openmodal';
        $scope.modalController = 'modalDpulistController';
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
            content: '确认删除DPU【' + node.devicename + '】设备，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除DPU',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['iddpulist'] = node.iddpulist;
                $scope.service.postData(__URL + 'Eimdevice/Dpulist/del_page_data', params).then(function (data) {
                    if (data > -1) {
                        layer.msg('删除成功', { icon: 1 });
                        node._kid = node.iddpulist;
                        $scope.service.delData('dpulistData', node);
                    }
                });
                layer.close(index);
            }
        });
    }

    //同步设备按钮
    $scope.btn_synchronization = function (row) {
        //加载层-风格4
        var index = layer.msg('加载中', { icon: 16, shade: 0.01, time: 2000000 });
        var rowarr = [];
        var params = {};
        //把需要的命令及参数组建好传给后台
        params['type']= 'syncpdu\r\n' + row.iddpulist;
        dataService.postData(__URL + 'Eimdevice/Esxserverlist/sync_write_vm', params).then(function (time) {
            $scope.num = 0;
            $scope.sync_read_file(time, $scope.num, index);  
        });
    };
    //同步时，读取同步状态文件的接口
    $scope.sync_read_file = function (time, index) {
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
                    layer.msg('同步超时', { icon: 0 });
                }
            } else {
                //重新加载数据，更新数据源
                var params = {};
                params['$json']=true;
                select_dpulist(params, 1);
                layer.close(index);//关闭加载              
                layer.msg("同步成功！", { icon: 6 });
            }
        });
    }
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Eimbase/Directive/bacth_import';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'dpulist';
        $scope.service.name = 'DPU设备';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    $scope.select(0);
}])
.controller('modalDpulistController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
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
       
    }
    switch ($scope.service.Action) {
        case 0:
            //初始化
            //添加默认值
            $scope.Source.selectItem.isenterpwd = 0;
            $scope.Source.selectItem.seldevicetypeid = 9;
            $scope.checked_devicetypeid();
            break;
        case 1:
            if ($scope.service.selectItem.iddpulist) {
                if ($scope.Source.selectItem.isenterpwd == 1) {
                    $scope.Source.selectItem.isenterpwd = true;
                } else {
                    $scope.Source.selectItem.isenterpwd = false;
                }
                //初始化也设备类型选中数据
                $scope.Source.selectItem.seldevicetypeid = $scope.service.privateDateObj.modeltypeData[$scope.Source.selectItem.modeltypeid].typeid;
                //初始化设备型号可选项
                $scope.checked_devicetypeid(1);

            }

            break;
        default:
            break;

    }
    //保存按钮
    $scope.btn_save = function () {
        var params = {};
        // params.append("$fetchSql", true);
        var url = __URL + 'Eimdevice/Dpulist/add_page_data';
        if ($scope.Source.Action == 1) {
            if ($scope.service.selectItem.iddpulist) {
                url = __URL + 'Eimdevice/Dpulist/update_page_data';
                params["iddpulist"]=$scope.Source.selectItem.iddpulist;//dpu id    
            } else {
                url = __URL + 'Eimdevice/kvmportlist/update_page_data';
                params["iddpuportlist"]=$scope.Source.selectItem.iddpuportlist;//dpu id   
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
                        $scope.Source.selectItem.iddpulist = data;
                        
                        dataService.addData('dpulistData', $scope.Source.selectItem);

                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        layer.msg("编辑成功", { icon: 6 });

                        $scope.Source.selectItem._kid = $scope.Source.selectItem.iddpulist ? $scope.Source.selectItem.iddpulist : $scope.Source.selectItem.iddpulist;
                       
                        if ($scope.Source.selectItem.iddpulist) {
                            dataService.updateData('dpulistData', $scope.Source.selectItem);
                        } else {
                            dataService.updateData('dpuportlistData', $scope.Source.selectItem);
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
    });
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
        var url = __URL + 'Eimdevice/Dpulist/preview';
        $scope.service.openModal(url, 'dpupreviewController');
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
 .controller('dpupreviewController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
     $scope.service = dataService;//要显示到页面上的数据源   
     $scope.dpupreviewData = [];
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
                     $scope.dpupreviewData.push(simpleData);
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
             for (var i = 0; i < $scope.dpupreviewData.length; i++) {
                 $scope.addUser($scope.dpupreviewData[i]);
             }
         } else if (type == 1) {
             if ($scope.dpupreviewData.length == 0) {
                 layer.msg('没选择任何数据', { icon: 0 });
             }
             //循环添加所有数据数据库
             for (var i = 0; i < $scope.dpupreviewData.length; i++) {
                 $scope.addUser($scope.dpupreviewData[i]);
             }

         } else if (type == 2) {

             $scope.addUser(rowData, 2);
         }
         console.log($scope.dpupreviewData);

     }

     $scope.addUser = function (user, type) {
         var params = {};
         //组建每条数据的参数
         angular.forEach(user, function (value, key) {
             params[key] = value;
         });
         dataService.postData(__URL + "Eimdevice/Dpulist/add_page_data", params).then(function (data) {
             //当添加失败时，
             if (data < 0) {
                 errData.push(user);
                 console.log(user);
                 return;
             } else if (data > 0) {
                 user.iddpulist = data;
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