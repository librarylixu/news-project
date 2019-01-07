var devicegroupModule = angular.module('devicegroupModule', ['ui.bootstrap', 'ui.grid','ui.grid.grouping',
     'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.treeBase', 'treeControl','ngSanitize']);
devicegroupModule.service('devicegroupDataService', function ($http,$q, $uibModal) {
    
    publicDataService($q, this, $uibModal);
});
devicegroupModule.controller('devicegroupController', ['$scope', '$uibModal', 'i18nService', 'devicegroupDataService', 'uiGridGroupingConstants', 'uiGridConstants', function ($scope, $uibModal, i18nService, devicegroupDataService, uiGridGroupingConstants, uiGridConstants) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = devicegroupDataService;//要显示到页面上的数据源
    //表格配置对象
    $scope.gridOptions = publicControllerGridOptions();
    //用来过渡的数据源
    $scope.data = [];

    //查询数据
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('json','1');
        $scope.service.postData(__URL + 'Eimbase/Devicegroup/select_page_data', params).then(function (data) {
            //第一层状态，无序的数组  data    
            $scope.service.oldData = data;
            //去组建数据源
            angular.forEach($scope.service.oldData, function (value, key) {
                //这里追加一个childCount属性用来表示有几个子集
                value.childCount = 0;
                if (value.group_parentid == '0') {
                    $scope.data.push(value);
                    return;
                }
                else if ($scope.service.oldData[value.group_parentid].child == undefined) {
                    $scope.service.oldData[value.group_parentid].child = [value];
                } else {
                    $scope.service.oldData[value.group_parentid].child.push(value);
                }
            });
            //重新排序数据源
            angular.forEach($scope.data, function (value, key) {
                var level = 0;
                value.$$treeLevel = 0;
                $scope.service.allData.push(value);
                //去寻找下一级
                if (value.child != undefined) {
                    $scope.findOne(value, level);
                }
            });
            //最终数据赋给表格
            $scope.gridOptions.data = $scope.service.allData;
        }, function (error) {
            console.log(error);
        });
    }
   
    //递归寻找子级
    $scope.findOne = function (Fnode, level) {
        angular.forEach(Fnode.child, function (value) {
            //计数，用来表示有几个子集
            Fnode.childCount += 1;
            var mlevel = (level + 1);
            value.$$treeLevel = mlevel;
            $scope.service.allData.push(value);
            if (value.child != undefined) {
                $scope.findOne(value, mlevel);
            }
        });
        return Fnode.childCount;
    }
   
    //每一行在渲染的时候，把子集的数量加上
    //每一行在渲染的时候，把子集的数量加上
    $scope.levelSplit = publicControllerLevelSplit;
   
    //表格列头
    $scope.gridOptions.columnDefs = [
      {
          name: '_id.$id', displayName: '', width: '5%', enableFiltering: false,cellClass:'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {

              return '<i class="fa fa-desktop bigger-120"></i>'
          }
      },
      { name: 'groupname', displayName: '设备组', width: '25%', enableFiltering: true, cellClass: 'text-left', cellTemplate: '<span data-ng-bind-html="grid.appScope.levelSplit(row,this)"></span>' },
      {
          name: 'group_parentid', displayName: '所属父级', width: '25%', enableFiltering: false, cellClass: 'text-center',
          
      },
      {
          name: 'group_index', displayName: '权限', width: '25%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a class="label radius" title="添加设备关系" ng-click="grid.appScope.refDeviceBtn(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="fa fa-exchange" aria-hidden="true"></i>&nbsp;关联设备</a>&nbsp;&nbsp;<a class="label radius" title="添加用户组关系" ng-click="grid.appScope.refUserGroupBtn(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="fa fa-exchange" aria-hidden="true"></i>&nbsp;关联用户组</a>'
          }
      },      
      {
          name: 'group_type', displayName: '操作', width: '20%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a href="javascript:;" class="green top-5"  ng-click="grid.appScope.update(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5"  ng-click="grid.appScope.remove(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
          }
      },

    ];
   
    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '添加设备组';
        $scope.modalHtml = 'saveDeviceGroup.html';
        $scope.modalController = 'saveDeviceGroupController';
        publicControllerAdd($scope);           
    }
    //修改按钮
    $scope.update = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = "修改设备组";
        $scope.modalHtml = 'saveDeviceGroup.html';
        $scope.modalController = 'saveDeviceGroupController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerUpdate($scope);       
    }
    //关联设备按钮
    $scope.refDeviceBtn = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = "关联设备";
        $scope.modalHtml = 'saveDevice.html';
        $scope.modalController = 'refDeviceController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerUpdate($scope);      
    }
    //关联用户组按钮
    $scope.refUserGroupBtn = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = "关联用户组";
        $scope.modalHtml = 'saveUserGroup.html';
        $scope.modalController = 'refUserGroupController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '删除设备组';
        $scope.modalHtml = 'saveDeviceGroup.html';
        $scope.modalController = 'saveDeviceGroupController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerDel($scope);
       
    }   
    //页面加载完成后，查询数据
    $scope.select();
}]);

//添加、编辑
devicegroupModule.controller('saveDeviceGroupController', ["$scope", "$uibModalInstance", 'devicegroupDataService', function ($scope, $uibModalInstance, devicegroupDataService) {
    $scope.Source = angular.copy(devicegroupDataService);
    $scope.group = devicegroupDataService;
    $scope.selectGroupItem = 0;
    if ($scope.Source.selectItem['group_parentid'] != '0') {
        $scope.selectGroupItem = devicegroupDataService.oldData[$scope.Source.selectItem['group_parentid']];
    }
   
    $scope.url = __URL + 'Eimbase/Devicegroup/';
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'add_page_data';

            break;
        case 1:
            $scope.url += 'update_page_data';
            break;
        case 2:
            $scope.url += 'del_page_data';
            break;
        default:
            alert('Action Error!');
            break;
    }
    /*
        $scope.params.append('', '');
        负责给默认值
    */
    $scope.params = new URLSearchParams();
    //保存按钮
    $scope.save = function (status) {
        var params = new URLSearchParams();
        //编辑时使用
        if ($scope.Source.Action == 1) {
            params.append('_id', $scope.Source.selectItem._id.$id);
            params.append('groupname', $scope.Source.selectItem.groupname);
            params.append('group_type', 'Device');

        } else if ($scope.Source.Action == 0) {
            params.append('groupname', $scope.Source.selectItem.groupname);
            params.append('group_type', 'Device');
        } else if ($scope.Source.Action == 2) {
            params.append('_id', $scope.Source.selectItem._id.$id);
        }
        //分组
        if ($scope.selectGroupItem && $scope.Source.Action !== 2) {
            //如果选择过分组
            params.append('group_index', $scope.selectGroupItem.group_index + 1);
            params.append('group_parentid', $scope.selectGroupItem._id.$id);
            $scope.Source.selectItem.group_index = $scope.selectGroupItem.group_index + 1;
            $scope.Source.selectItem.group_parentid = $scope.selectGroupItem._id.$id;
        } else if ($scope.selectGroupItem == undefined && $scope.Source.Action !== 2) {
            //如果从未选择过分组。默认是根节点
            params.append('group_index', 0);
            params.append('group_parentid', 0);
            $scope.Source.selectItem.group_index = 0;
            $scope.Source.selectItem.group_parentid = 0;
        }
        
        $scope.Source.postData($scope.url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加用户组');
                        break;
                    }
                    //更新service数据源
                    //devicegroupDataService.addData($scope.Source.selectItem);
                    if (status == 0) {
                        //更新父级数据源
                        angular.forEach(devicegroupDataService.allData, function (value, key) {
                            if (value._id.$id == data.group_parentid) {
                                value.childCount++;
                            }
                        });

                        //更新service数据源 
                        data.$$treeLevel = data.group_index;
                        devicegroupDataService.allData.push(data);
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        $scope.group.selectItem = {};
                        alert.show('添加成功', '添加用户组');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data['updateExisting']) {
                        //修改成功                        
                        //devicegroupDataService.updateData($scope.Source.selectItem);
                        var i = devicegroupDataService.allData.indexOf(devicegroupDataService.selectItem);
                        if (i > -1) {
                            devicegroupDataService.allData[i] = $scope.Source.selectItem;
                        }
                        $scope.group.selectItem = {};
                        alert.show('修改成功', '修改用户组');
                        $uibModalInstance.close('ok');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改用户组');
                    break;
                case 2:
                    //删除
                    if (data.lastOpt.inc == 1) {
                        devicegroupDataService.delData($scope.Source.selectItem);
                        alert.show('删除成功', '删除用户组');
                        $scope.group.selectItem = {};
                        $uibModalInstance.close();
                        break;
                    }
                    alert.show('删除失败', '删除用户组');
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $scope.group.selectItem = {};
        $uibModalInstance.dismiss('cancel');
    };
}]);
//关联设备

devicegroupModule.controller('refDeviceController', ['$scope', "$uibModalInstance", "devicegroupDataService", function ($scope, $uibModalInstance, devicegroupDataService) {
    $scope.Source= devicegroupDataService;

    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //初始化设备组的数据
    var devicegroupSource = {};
    //查询设备组的数据
    $scope.devicegroup = function () {
        var params = new URLSearchParams();
        params.append('json', 1);
        $scope.Source.postData(__URL + 'Eimbase/Devicegroup/select_page_data', params).then(function (data) {
            devicegroupSource =data;
            $scope.devicelist_data();
        }, function (error) {
            console.log(error);
        });
    }

    //查询资产设备的数据
    $scope.devicelist_data = function () {
        $scope.Source.postData(__URL + 'Eimdevice/Accetsdevice/select_page_data', {}).then(function (data) {
            $scope.devicelist = data;
            $scope.ref();
        }, function (error) {
            console.log(error);
        });
    }

   
    ////初始化设备的数据
    //$scope.devicelist = [
    //{
    //    _id: 1, name: 'a', group_index: '5a38d1e90d71b5980e472d3a', type: 'device',
    //},
    //    { _id: 2, name: 'b', group_index: '5a38d1e90d71b5980e472d3a', type: 'device', },
    //    { _id: 3, name: 'c', group_index: '5a267a100d71b543747b37bc', type: 'device', },
    //    { _id: 4, name: 'd', group_index: '5a267a100d71b543747b37bc', type: 'device', },
    //     { _id: 5, name: 'admin', group_index: '5a267a100d71b543747b37bc', type: 'device', }
    //];
    
   
    //初始化用户组的数据
    //var devicegroupSource = {
    //    '1_id': { _id: 1, groupname: 'A', type: 'group', },
    //    '2_id': { _id: 2, groupname: 'B', type: 'group', },
    //    '3_id': { _id: 3, groupname: 'C', type: 'group', },
    //    '0_id': { _id: 4, groupname: '未分组', type: 'group', },
    //};
    
    //查询设备组组的数据
    //$scope.getdevicelist = function () {
    //    var params = new URLSearchParams();
    //    $scope.service.postData(__URL + 'Eimbase/Devicegroup/select_page_data', {}).then(function (data) {
    //        $scope.devicegroupSource = data;

    //    }, function (error) {
    //        console.log(error);
    //    });
    //}
    //$scope.userlist = [
    //    { _id: 1, name: 'a', gid: '1_id', type: 'user', },
    //    { _id: 2, name: 'b', gid: '2_id', type: 'user', },
    //    { _id: 3, name: 'c', gid: '1_id', type: 'user', },
    //    { _id: 4, name: 'd', gid: '1_id', type: 'user', },
    //     { _id: 5, name: 'admin', gid: '3_id', type: 'user', }
    //];
    //当前组的ID
    $scope.thisGid = $scope.Source.selectItem._id.$id;
    //刷新数据源
    $scope.ref = function () {
        $scope.devicegroup1 = angular.copy(devicegroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.devicelist, function (value, key) {
            if ($scope.devicegroup1[value.group_index].children != undefined) {
                $scope.devicegroup1[value.group_index].children.push(value);
            } else {
                $scope.devicegroup1[value.group_index].children = [value];
            }
        });
        //因为tree需要[] 而不是  {}  ,所以需要转换一下，同时，在转换的时候，将当前组给屏蔽掉
        var mydevicegroup = [];
        angular.forEach($scope.devicegroup1, function (value, key) {
            if (key != $scope.thisGid) {
                this.push(value);
            }
        }, mydevicegroup);
        $scope.mydevicegroup = mydevicegroup;
       
    }
    //关联当前设备到当前设备分组
    $scope.showSelected = function (node) {
        if (node.type == 'device') {
            node.group_index = $scope.thisGid;
            $scope.ref();
        }

    };
    //取消选中的用户与当前组的关系
    $scope.unRef = function (item) {
        //这里注意了，取消之后，当前的这个用户要分到 ‘未分组’中去。 '5a2679770d71b5d8737b37bb'这里表示未分组的ID
        item.group_index = '5a2679770d71b5d8737b37bb';
        $scope.ref();
    }
    
    $scope.devicegroup();
}]);
//关联用户组
devicegroupModule.controller('refUserGroupController', ['$scope', "$uibModalInstance", "devicegroupDataService", function ($scope, $uibModalInstance, devicegroupDataService) {
    $scope.Source = devicegroupDataService;

    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //初始化设备组的数据
    var devicegroupSource = {};
    //查询设备组组的数据
    $scope.devicegroup = function () {
        var params = new URLSearchParams();
        params.append('json', 1);
        $scope.Source.postData(__URL + 'Eimbase/Devicegroup/select_page_data', params).then(function (data) {
            devicegroupSource = data;
            $scope.ref();
        }, function (error) {
            console.log(error);
        });
    }

    //初始化设备的数据
    $scope.usergroup = [];
    $scope.usergrouplist = function () {
        $scope.Source.postData(__URL + 'Eimbase/Usergroup/select_page_data', {}).then(function (data) {
            $scope.usergroup = data;
            $scope.devicegroup();
        }, function (error) {
            console.log(error);
        });
    }



    //初始化用户组的数据
    //var devicegroupSource = {
    //    '1_id': { _id: 1, groupname: 'A', type: 'group', },
    //    '2_id': { _id: 2, groupname: 'B', type: 'group', },
    //    '3_id': { _id: 3, groupname: 'C', type: 'group', },
    //    '0_id': { _id: 4, groupname: '未分组', type: 'group', },
    //};

    //查询设备组组的数据
    //$scope.getdevicelist = function () {
    //    var params = new URLSearchParams();
    //    $scope.service.postData(__URL + 'Eimbase/Devicegroup/select_page_data', {}).then(function (data) {
    //        $scope.devicegroupSource = data;

    //    }, function (error) {
    //        console.log(error);
    //    });
    //}
    //$scope.userlist = [
    //    { _id: 1, name: 'a', gid: '1_id', type: 'user', },
    //    { _id: 2, name: 'b', gid: '2_id', type: 'user', },
    //    { _id: 3, name: 'c', gid: '1_id', type: 'user', },
    //    { _id: 4, name: 'd', gid: '1_id', type: 'user', },
    //     { _id: 5, name: 'admin', gid: '3_id', type: 'user', }
    //];
    //当前组的ID
    $scope.thisGid = $scope.Source.selectItem._id.$id;
    //刷新数据源
    $scope.ref = function () {
        $scope.devicegroup1 = angular.copy(devicegroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.usergroup, function (value, key) {
            if (value.usergroup == 0) {
                if ($scope.devicegroup1['5a2678bb0d71b5d0737b37b8'].children != undefined) {
                    $scope.devicegroup1['5a2678bb0d71b5d0737b37b8'].children.push(value);
                } else {
                    $scope.devicegroup1['5a2678bb0d71b5d0737b37b8'].children = [value];
                }
            } else {
                if ($scope.devicegroup1[value.usergroup].children != undefined) {
                    $scope.devicegroup1[value.usergroup].children.push(value);
                } else {
                    $scope.devicegroup1[value.usergroup].children = [value];
                }
            }
            
        });
        //因为tree需要[] 而不是  {}  ,所以需要转换一下，同时，在转换的时候，将当前组给屏蔽掉
        var mydevicegroup = [];
        angular.forEach($scope.devicegroup1, function (value, key) {
            if (key != $scope.thisGid) {
                this.push(value);
            }
        }, mydevicegroup);
        $scope.mydevicegroup = mydevicegroup;

    }
    //关联当前设备到当前用户组
    $scope.showSelected = function (node) {
        if (node.group_type == 'User') {
            node.group_index = $scope.thisGid;
            $scope.ref();
        }

    };
    //取消选中的用户组与当前组的关系
    $scope.unRef = function (item) {
        //这里注意了，取消之后，当前的这个用户组要分到 ‘未分组’中去。 '5a2679770d71b5d8737b37bb'这里表示未分组的ID
        item.group_index = 0;
        $scope.ref();
    }
    $scope.usergrouplist();
   
}]);