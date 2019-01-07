var passwordModule = angular.module('passwordModule',
    ['ui.bootstrap', 'ui.grid', 'ui.grid.edit', 'ui.grid.grouping',
     'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.treeBase', 'treeControl']);

//公共方法
function service($q, sthis) {
    //当前选中的项
    sthis.selectItem = {};
    //操作状态 0新增 1修改
    sthis.Action = 0;
    //打开模态框
    sthis.openModal = function (templateUrl, controller, $uibModal) {
        var defer = $q.defer();
        $uibModal.open({
            templateUrl: templateUrl,
            controller: controller,
            animation: true,
            keyboard: true,
            backdrop: "static"
        }).result.then(function (value) {
            defer.resolve(value);
        }, function () {
            defer.reject('Error!');
        });
        return defer.promise;
    }
    //更新选中项信息
    sthis.updateData = function (item) {
        var i = sthis.allData.indexOf(sthis.selectItem);
        if (i > -1) {
            sthis.allData[i] = item;
            //第1层梦境的造梦者
            sthis.selectItem = item;
        }
        return i;
    }
    //全部的数据源
    sthis.allData = [];
    //通用post方法
    sthis.postData = function (url, parameters) {
        var defer = $q.defer();//延迟处理
        axios.post(url, parameters)
         .then(function (response) {
             //处理正常结果
             defer.resolve(response.data);
         })
         .catch(function (error) {
             //处理异常结果
             defer.reject(error);
         });
        return defer.promise;
    }

    //通用方法,给数据源添加一个数据
    sthis.addData = function (data) {
        return sthis.allData.push(angular.copy(data));       
    }
    //通用的删除方法，将指定的元素数据源从数据源中删除
    sthis.delData = function (item) {
        var i = sthis.allData.indexOf(item);
        if (i>-1) {
            $i = sthis.allData.splice(i,1);
        }
        return i;
    }
}
passwordModule.service('passwordDataService', ['$http', '$q', function ($http, $q) {
    service($q, this);
}]);

//主控制器
passwordModule.controller('passwordController', ['$scope', '$uibModal', 'i18nService', 'passwordDataService', 'uiGridGroupingConstants', 'uiGridConstants', function ($scope, $uibModal, i18nService, passwordDataService, uiGridGroupingConstants, uiGridConstants) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = passwordDataService;//要显示到页面上的数据源
    /*
        查询数据
    */
    $scope.select = function () {
        $scope.service.postData(__URL + 'Eimpasswordrules/Password/select_page_data', {}).then(function (data) {
            $scope.service.allData = data;
            $scope.gridOptions.data = $scope.service.allData;
        }, function (error) {
            console.log(error);
        });
    }

    //表格配置对象
    $scope.gridOptions = {

        enableFiltering: true,//是否可筛选
        enablePagination: true, //是否分页，默认为true
        enablePaginationControls: true, //使用默认的底部分页
        paginationPageSizes: [10, 15, 20, 50, 100, 500, 1000], //每页显示个数可选项
        paginationCurrentPage: 1, //当前页码
        paginationPageSize: 10, //每页显示个数

        enableSorting: true, //是否排序
        useExternalSorting: false, //是否使用自定义排序规则
        enableGridMenu: true, //是否显示grid 菜单
        showGridFooter: true, //是否显示grid footer
        enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示



        //----------- 选中 ----------------------
        //enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
        //enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
        //enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
        //enableRowSelection: true, // 行选择是否可用，默认为true;
        //enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
        //enableSelectionBatchEvent: true, //默认true
        //isRowSelectable: function (row) { //GridRow
        //    if (row.entity.age > 45) {
        //        row.grid.api.selection.selectRow(row.entity); // 选中行
        //    }
        //},
        //modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
        //multiSelect: true,// 是否可以选择多个,默认为true;
        //noUnselect: false,//默认false,选中后是否可以取消选中
        //selectionRowHeaderWidth: 30,//默认30 ，设置选择列的宽度；


    };

    $scope.convertTime = function (value) {
        var t = new Date();
        var tvalue = value;
        if (tvalue < 100000000000) {
            tvalue = tvalue * 1000;
        }
        t.setTime(tvalue);
        //toLocaleDateString年月日
        //toLocaleString
        return t.toLocaleDateString();
    }
    $scope.test = function (t) {

        return 'test';
    }
    //表格列头
    $scope.gridOptions.columnDefs = [
      {
          name: '_id.$id', displayName: '图标', width: '5%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<i class="fa fa-user bigger-120"></i>'
          }
      },
      { name: 'loginname', displayName: '登录账号', width: '15%', enableFiltering: true, cellClass: 'text-center' },
      { name: 'createuser', displayName: '创建人', width: '10%', enableFiltering: true, cellClass: 'text-center' },
      {
          name: 'createtime', displayName: '创建时间', width: '10%', enableFiltering: false, cellClass: 'text-center', type: 'date',
          //cellFilter: 'date:\'yyyy-MM-dd HH:mm:ss\''
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<span ng-bind="grid.appScope.convertTime(row.entity.createtime)"></span>';
          }
      },
      {
          name: 'updatetime', displayName: '修改时间', width: '10%', enableFiltering: false, cellClass: 'text-center', type: 'date',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<span ng-bind="grid.appScope.convertTime(row.entity.updatetime)"></span>'
          }
      },
      { name: 'remark', displayName: '备注', width: '15%', enableFiltering: false, cellClass: 'text-center' },
      {
          name: 'status', displayName: '状态', width: '10%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {

              return '<a ng-if="(row.entity.status == 1)" ng-click="grid.appScope.changestatus(row.entity)" class="status label  radius label-success" title="启用">启用</a><a ng-if="(row.entity.status == 0)" ng-click="grid.appScope.changestatus(row.entity)"  class="status label  radius label-danger" title="禁用">禁用</a>'
          }
      },
      {
          name: 'group_type', displayName: '操作', width: '20%', enableFiltering: false, cellClass: 'text-center',
          cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<a href="javascript:;" class="green top-5"  ng-click="grid.appScope.edit(grid, row, col, rowRenderIndex, colRenderIndex,1)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5"  ng-click="grid.appScope.remove(grid, row, col, rowRenderIndex, colRenderIndex,0)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> &nbsp;&nbsp;<a href="javascript:;" class="red top-5" title="添加密码规则" ng-click="grid.appScope.addauthrule(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-plus bigger-120"></i></a>'
          }
      }
    ];
    //启用禁用状态切换
    $scope.changestatus = function (item) {
        var params = new URLSearchParams();
        var num = "";
        params.append('_id', item._id.$id);
        if (item.status == "1") {
            num = 0;
            params.append('status', 0);
        } else {
            num = 1;
            params.append('status', 1);
        }
        item.status = num;
        axios.post(__URL + "Eimpasswordrules/Password/update_page_data", params)
             .then(function (response) {
                 if (response.data.lastOp.inc == 1) {
                     try {

                         parent.layer.msg('修改成功', { icon: 6 });
                     } catch (e) {

                     }
                 } else {

                     try {
                         parent.layer.msg('修改失败', { icon: 5 });
                     } catch (e) {

                     }

                 }
             })
             .catch(function (error) {
                 try {
                     parent.layer.msg('404.错误了!!', { icon: 5 });
                 } catch (e) {

                 }
                 console.log(error);
             });
    };
    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '新建密码';
        $scope.service.Action = 0;
        $scope.open();
    }
    //点击编辑按钮
    $scope.edit = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        $scope.service.title = '编辑密码';
        $scope.service.Action = 1;
        $scope.open();
    }

    //删除按钮
    $scope.remove = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        $scope.service.title = '删除密码';
        $scope.service.Action = 2;
        $scope.open();
     }

    // angular.element(document.getElementsByClassName('grid')[0]).css('height',angular.element(document.getElementsByClassName('grid')[0]).css('height')-30+'px');
    /*模态框
        action 0 修改 1添加
    */
    $scope.open = function () {
        $scope.service.openModal('saveusergroup.html', 'savePasswordController', $uibModal).then(
            function (data) {
                //close 方法的回调
            },
            function (data) {
                try {
                    parent.layer.msg(data, { icon: 5 });
                } catch (e) {

                }
            });
    };
    //添加用户到用户组
    $scope.addusers = function () {
        $scope.service.openModal('refusers.html', 'treeController', $uibModal).then(function (data) {
            //成功之后要处理的回调方法
        });
    };
    //页面加载完成后，查询数据
    $scope.select();
}]);
//添加编辑用户组的控制器
passwordModule.controller('savePasswordController', ["$scope", "$uibModalInstance", 'passwordDataService', function ($scope, $uibModalInstance, passwordDataService) {
    $scope.Source = angular.copy(passwordDataService);
    $scope.url = __URL + 'Eimpasswordrules/Password/';
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
    $scope.params = new URLSearchParams();
    $scope.params.append('updatetime', '');
    $scope.params.append('remark', '');
    $scope.params.append('status', 1);

    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    /*状态*/
    $scope.status = [1, 0];
    $scope.save = function (status) {
        if ($scope.Source.Action == 2) {
            $scope.params = new URLSearchParams();
            $scope.params.append('_id', $scope.Source.selectItem._id.$id);
        } else {           
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if ($scope.Source.Action == 1 && key == '_id') {
                //如果是修改信息，就需要传id
                $scope.params.append(key, $scope.Source.selectItem._id.$id);
            } else {
                $scope.params.append(key, value);
            }
        });
        }

        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data._id == undefined) {
                        //添加失败
                        alert('添加失败');
                        break;
                    }
                    //更新service数据源
                    passwordDataService.addData(data);
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close();
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data['updatedExisting']) {
                        //修改成功                        
                        passwordDataService.updateData($scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert('修改成功');
                        break;
                    }
                    //修改失败
                    alert('修改失败');
                    break;
                case 2:
                    //删除
                    if (data.lastOp.inc == 1) {
                        passwordDataService.delData(passwordDataService.selectItem);
                        alert('删除成功');
                        $uibModalInstance.close();
                        break;
                }
                    alert('删除失败');                    
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
//tree的控制器
passwordModule.controller('treeController', ['$scope', "$uibModalInstance", 'passwordDataService', function ($scope, $uibModalInstance, source) {
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //初始化用户组的数据
    var usergroupSource = {
        '1_id': { _id: 1, groupname: 'A', type: 'group', },
        '2_id': { _id: 2, groupname: 'B', type: 'group', },
        '3_id': { _id: 3, groupname: 'C', type: 'group', },
        '0_id': { _id: 4, groupname: '未分组', type: 'group', },
    };
    //初始化用户的数据
    $scope.userlist = [
        { _id: 1, name: 'a', gid: '1_id', type: 'user', },
        { _id: 2, name: 'b', gid: '2_id', type: 'user', },
        { _id: 3, name: 'c', gid: '1_id', type: 'user', },
        { _id: 4, name: 'd', gid: '1_id', type: 'user', },
         { _id: 5, name: 'admin', gid: '3_id', type: 'user', }
    ];
    //当前组的ID
    $scope.thisGid = '1_id';
    //刷新数据源
    $scope.ref = function () {
        $scope.usergroup1 = angular.copy(usergroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.userlist, function (value, key) {
            if ($scope.usergroup1[value.gid].children != undefined) {
                $scope.usergroup1[value.gid].children.push(value);
            } else {
                $scope.usergroup1[value.gid].children = [value];
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
        if (node.type == 'user') {
            node.gid = $scope.thisGid;
            $scope.ref();
        }

    };
    //取消选中的用户与当前组的关系
    $scope.unRef = function (item) {
        //这里注意了，取消之后，当前的这个用户要分到 ‘未分组’中去。 0_id这里表示未分组的ID
        item.gid = '0_id';
        $scope.ref();
    }
    $scope.ref();
}]);
