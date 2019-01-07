var usergroupModule = angular.module('usergroupModule',
    ['ui.bootstrap', 'ui.grid', 'ui.grid.grouping',
     'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.treeBase', 'treeControl', 'ngSanitize']);
usergroupModule.service('usergroupDataService', ['$http', '$q', '$uibModal', function ($http, $q, $uibModal) {
    publicDataService($q, this, $uibModal);
}]);

usergroupModule.factory('alert', ['$uibModal', function ($uibModal) {
    return publicAlertService($uibModal);
}]);

//主控制器
usergroupModule.controller('usergroupController', ['$scope', 'i18nService', 'usergroupDataService', 'uiGridGroupingConstants', 'uiGridConstants', 'alert', function ($scope, i18nService, usergroupDataService, uiGridGroupingConstants, uiGridConstants, alert) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = usergroupDataService;//要显示到页面上的数据源
    //表格配置对象
    $scope.gridOptions = publicControllerGridOptions();
    //用来过渡的数据源
    $scope.data = [];

    /*
        查询数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('json', '1');
        $scope.service.postData(__URL + 'Eimbase/Usergroup/select_page_data', params).then(function (data) {
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

    ///递归寻找子级
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
    $scope.levelSplit = publicControllerLevelSplit;

    //表格列头
    $scope.gridOptions.columnDefs = [
      {
          name: '_id.$id', displayName: '', width: '5%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<i class="fa fa-user bigger-120"></i>'
          }
      },
      { name: 'groupname', displayName: '用户组', width: '25%', enableFiltering: true, cellClass: 'text-left', cellTemplate: '<span data-ng-bind-html="grid.appScope.levelSplit(row,this)"></span>' },
      {
          name: 'group_index', displayName: '权限', width: '25%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a class="addref top-5" title="建立用户组与用户关系" ng-click="grid.appScope.addusers(grid, row, col, rowRenderIndex, colRenderIndex)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i>&nbsp;关联用户</a>'
          }
      },
      {
          name: 'group_parentid', displayName: '访问权限', width: '25%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a class="system" title="访问EIM系统的权限"  ng-click="grid.appScope.edit(grid, row, col, rowRenderIndex, colRenderIndex)" href="javascript:;"><i class="glyphicon glyphicon-th-list"></i>&nbsp;访问权限</a>'
          }
      },
      {
          name: 'group_type', displayName: '操作', width: '20%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a href="javascript:;" class="green top-5"  ng-click="grid.appScope.updateInfo(row)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5"  ng-click="grid.appScope.remove(row)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
          }
      },

    ];
    //刷新按钮
    $scope.refresh = refresh;

    //添加按钮
    $scope.add = function () {
        $scope.service.title = '新建用户组';
        $scope.modalHtml = 'saveusergroup.html';
        $scope.modalController = 'saveUsergroupController';
        $scope.service.selectGroupItem = 0;
        publicControllerAdd($scope);
    }
    //点击编辑按钮
    $scope.edit = function (grid, row, col, rowRenderIndex, colRenderIndex, i) {

        var anniu = 2;
        if (colRenderIndex == 2) {
            anniu = "权限"
        } else if (colRenderIndex == 3) {
            anniu = "访问权限";
        } else if (colRenderIndex == 4) {
            if (i == 0) {
                anniu = "操作中的删除";
            } else if (i == 1) {
                anniu = "操作中的编辑";
                $scope.service.openModal('saveusergroup.html', 'saveUsergroupController').then(
                               function (data) {
                                   //close 方法的回调
                               },
                               function (data) {
                                   try {
                                       parent.layer.msg(data, { icon: 5 });
                                   } catch (e) {

                                   }
                               });
            }
        }

        alert.show("第" + rowRenderIndex + "行的" + anniu + "按钮", '您点击了');
        console.log(grid, row, col, rowRenderIndex, colRenderIndex);
        console.log(grid.getCellValue(row, col));

    };

    //修改按钮
    $scope.updateInfo = function (rowData) {
        $scope.service.title = "修改用户组";
        $scope.modalHtml = 'saveusergroup.html';
        $scope.modalController = 'saveUsergroupController';
       
        $scope.service.selectItem = rowData.entity;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (rowData) {

        $scope.service.title = '删除用户组';
        $scope.modalHtml = 'saveusergroup.html';
        $scope.modalController = 'saveUsergroupController';
        $scope.service.selectItem = $scope.service.selectItem = rowData.entity;
        publicControllerDel($scope);
    }
    $scope.updateData = function () {
        var sIndex = ($scope.pageNowCount - 1) * $scope.pageCount;
        sIndex = (sIndex < 0) ? 0 : sIndex;
        //当前页显示的位置
        var eIndex = sIndex + $scope.pageCount;
        $scope.usergroupDataService = $scope.usergroup.slice(sIndex, eIndex);
        console.log($scope.usergroupDataService);
    }
    treeRowHeaderAlwaysVisible: false,
    // angular.element(document.getElementsByClassName('grid')[0]).css('height',angular.element(document.getElementsByClassName('grid')[0]).css('height')-30+'px');

    //添加用户到用户组
    $scope.addusers = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '添加用户到用户组';
        $scope.modalHtml = 'refusers.html';
        $scope.modalController = 'treeController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerAdd($scope);       
    };


    //页面加载完成后，查询数据
    $scope.select();
}]);
//添加编辑用户组的控制器
usergroupModule.controller('saveUsergroupController', ["$scope", "$uibModalInstance", 'usergroupDataService','alert', function ($scope, $uibModalInstance, usergroupDataService,alert) {
    $scope.Source = angular.copy(usergroupDataService);
    $scope.group = usergroupDataService;
    $scope.selectGroupItem = 0;
    if ($scope.Source.selectItem['group_parentid'] != '0') {
        $scope.selectGroupItem = usergroupDataService.oldData[$scope.Source.selectItem['group_parentid']];
    }   
    $scope.url = __URL + 'Eimbase/Usergroup/';
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
    //
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.save = function (status) {
        var params = new URLSearchParams();
       
        //编辑时使用
        if ($scope.Source.Action == 1) {
            params.append('_id', $scope.Source.selectItem._id.$id);
            params.append('groupname', $scope.Source.selectItem.groupname);
            params.append('group_type', 'User');
            
        } else if ($scope.Source.Action == 0) {
            params.append('groupname', $scope.Source.selectItem.groupname);
            params.append('group_type', 'User');
        } else if ($scope.Source.Action == 2) {
            params.append('_id', $scope.Source.selectItem._id.$id);
        }
        //分组
        if ($scope.selectGroupItem&&$scope.Source.Action !== 2) {
            //如果选择过分组
            params.append('group_index', $scope.selectGroupItem.group_index + 1);
            params.append('group_parentid', $scope.selectGroupItem._id.$id);
            $scope.Source.selectItem.group_index = $scope.selectGroupItem.group_index + 1;
            $scope.Source.selectItem.group_parentid = $scope.selectGroupItem._id.$id;
        } else if ($scope.selectGroupItem==undefined && $scope.Source.Action !== 2) {
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
                   
                    //更新父级数据源
                    angular.forEach(usergroupDataService.allData, function (value, key) {
                        if (value._id.$id == data.group_parentid) {
                            value.childCount++;
                        }
                    });
                        
                    //更新service数据源 
                    data.$$treeLevel = data.group_index;
                    usergroupDataService.allData.push(data);
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        $scope.group.selectItem = {};
                        alert.show('添加成功', '添加用户组');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data['updatedExisting']) {
                        //修改成功   
                        var i = usergroupDataService.allData.indexOf(usergroupDataService.selectItem);
                        if (i > -1) {
                            usergroupDataService.allData[i] = $scope.Source.selectItem;
                        }
                      
                        //usergroupDataService.updateData($scope.Source.selectItem);
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
                    if (data.lastOp.inc == 1) {
                        //更新父级数据源
                        angular.forEach(usergroupDataService.allData, function (value, key) {
                            if (value._id.$id == usergroupDataService.selectItem.group_parentid) {
                                value.childCount--;
                            }
                        });
                         usergroupDataService.delData(usergroupDataService.selectItem);
                      
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
        $uibModalInstance.close();
    };
}]);
//tree的控制器
usergroupModule.controller('treeController', ['$scope', "$uibModalInstance", 'usergroupDataService','alert', function ($scope, $uibModalInstance, usergroupDataService,alert) {
    $scope.Source = usergroupDataService;

    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //初始化用户组的数据
    var usergroupSource = {};
    //初始化用户组的数据
    $scope.usergroup = function () {
        var params = new URLSearchParams();
        params.append('json', 1);
        $scope.Source.postData(__URL + 'Eimbase/Usergroup/select_page_data', params).then(function (data) {
            usergroupSource = data;
            $scope.ref();
        }, function (error) {
            console.log(error);
        });
    }

 
    //初始化账户的数据
    $scope.userlist = [];
    $scope.getuserlist = function () {
        $scope.Source.postData(__URL + 'Eimbase/Userlist/select_page_data', {}).then(function (data) {
            $scope.userlist = data;
            $scope.usergroup();
        }, function (error) {
            console.log(error);
        });
    }
    //当前组的ID
    $scope.thisGid = $scope.Source.selectItem._id.$id;
    //刷新数据源
    $scope.ref = function () {
        $scope.usergroup1 = angular.copy(usergroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.userlist, function (value, key) {
            if (value.usergroup == 0) {
                if ($scope.usergroup1["5a4444fc0d71b54850dc4d53"].children != undefined) {
                    $scope.usergroup1["5a4444fc0d71b54850dc4d53"].children.push(value);
                } else {
                    $scope.usergroup1["5a4444fc0d71b54850dc4d53"].children = [value];
                }
            } else {
                if ($scope.usergroup1[value.usergroup].children != undefined) {
                    $scope.usergroup1[value.usergroup].children.push(value);
                } else {
                    $scope.usergroup1[value.usergroup].children = [value];
                }
            }
            
        });
        //因为tree需要[] 而不是  {}  ,所以需要转换一下，同时，在转换的时候，将当前组给屏蔽掉
        var myusergroup = [];
        angular.forEach($scope.usergroup1, function (value, key) {
            if (key != $scope.thisGid) {
                this.push(value);
            }
        }, myusergroup);
        $scope.myusergroup = myusergroup;
    }
    //关联当前用户到当前分组
    $scope.showSelected = function (node) {
        if (node.usertype == '0') {
            node.usergroup = $scope.thisGid;
            $scope.ref();
        }

    };
    //取消选中的用户与当前组的关系
    $scope.unRef = function (item) {
        //这里注意了，取消之后，当前的这个用户要分到 ‘未分组’中去。 0_id这里表示未分组的ID
        item.usergroup = 0;
        $scope.ref();
    }
    $scope.getuserlist();
}]);
