var userlistModule = angular.module('userlistModule', ['ui.bootstrap', 'ui.grid', 'ui.grid.edit', 'ui.grid.grouping',
     'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ui.grid.treeBase', 'ngSanitize']);
userlistModule.service('userlistDataService', function ($http, $q, $uibModal) {
    publicDataService($q, this, $uibModal);
});
//弹窗
userlistModule.factory('alert', ['$uibModal', function ($uibModal) {
    return publicAlertService($uibModal);
}]);
//这里定义了一个对象属性，存储了分组的数据，为了提供给过滤器使用
userlistModule.genderHash = {
    //'5a29165c0d71b55516915063': '1111111'
};
//过滤条件
userlistModule.filter('zfilter', function () {
    return function (input) {
        var result;
        var match;
        if (!input) {
            return '';
        } else if (result = userlistModule.genderHash[input]) {
            return result;
        } else if ((match = input.match(/(.+)( \(\d+\))/)) && (result = userlistModule.genderHash[match[1]])) {
            return result + match[2];
        } else {
            return input;
        }
    };
});
userlistModule.directive('equals', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            function validateEqual(myValue) {
                var valid = (myValue === scope.$eval(attrs.equals));
                ngModelCtrl.$setValidity('equal', valid);
                return valid ? myValue : undefined;
            }
            ngModelCtrl.$parsers.push(validateEqual);
            ngModelCtrl.$formatters.push(validateEqual);
            scope.$watch(attrs.equals, function () {
                ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
            })
        }
    }
});
//把service注入
userlistModule.controller('userlistController', ['$scope', '$uibModal', 'i18nService', 'userlistDataService', 'uiGridGroupingConstants', 'uiGridConstants','alert', function ($scope, $uibModal, i18nService, userlistDataService, uiGridGroupingConstants, uiGridConstants,alert) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = userlistDataService;//要显示到页面上的数据源
    //表格配置对象
    $scope.gridOptions = publicControllerGridOptions();
    //列头
    $scope.columnDefs = [
              {
                  name: '_id.$id', displayName: '', width: '5%', enableFiltering: false, cellClass: 'text-center',
                  cellTemplate:'<span data-ng-bind-html="grid.appScope.nowstatus(row,this,\'icon\')"></span>'
              },
              { name: 'username', displayName: '账号', width: '5%', enableFiltering: true, cellClass: 'text-center' },
             
              {
                  name: 'lastlogintime', displayName: '登录时间', width: '10%', type: Date, enableFiltering: true, cellClass: 'text-center',
                  cellTemplate: '<span data-ng-bind-html="grid.appScope.nowstatus(row,this,\'time\')"></span>'                     
              },
              {
                  name: 'login_error_time', displayName: '有效期', type:Date,width: '10%', enableFiltering: true, cellClass: 'text-center',
                  cellTemplate: '<span data-ng-bind-html="grid.appScope.nowstatus(row,this,\'time\')"></span>'

              },
              {
                  name: 'updatetime', displayName: '最近修改时间', type: Date, width: '10%', enableFiltering: true, cellClass: 'text-center',
                  cellTemplate: '<span data-ng-bind-html="grid.appScope.nowstatus(row,this,\'time\')"></span>'

               },                 
               {
                   name: 'status', displayName: '状态', width: '5%', enableFiltering: false, cellClass: 'text-center',

                   cellTemplate: '<span data-ng-bind-html="grid.appScope.nowstatus(row,this,\'status\')" ng-click="grid.appScope.changestatus(row,this)"></span>'
               },

               {
                   name: 'lock_status', displayName: '操作', width: '10%', enableFiltering: false, cellClass: 'text-left',
                   cellTemplate: '<div data-ng-bind-html="grid.appScope.nowstatus(row,this,\'handle\')"></div>'
                     
               },
              
    ];
   
    //查询用户组数据
    $scope.usergroup_data = function () {
        var params = new URLSearchParams();
        params.append('json', '1');
        $scope.service.postData(__URL + 'Eimbase/Usergroup/select_page_data', params).then(function (data) {
            $scope.service.oldData = data;
            //用户组分组数据
            $scope.usergroupData = data;

            //计算出来有几层嵌套
            $scope.groupLevel = 0;
            /*             
          1.这里要找出一共有几层嵌套
          2.组建过滤器的过滤参数
          */
            angular.forEach($scope.usergroupData, function (value, key) {
                if (value.group_index > $scope.groupLevel) {
                    $scope.groupLevel = value.group_index;
                }
                //组建过滤器的过滤参数
                //'gid1': '昕辰公司'
                userlistModule.genderHash[value._id.$id] = value.groupname;
            });

            $scope.count = 35 / ($scope.groupLevel + 1) + "%";
            //重新组建列头，将需要分组的列追加
            for (var i = 0; i <= $scope.groupLevel; i++) {
                var tcolumn = {
                    name: '分组' + (i + 1),
                    width: '35%',
                    field: "getgroup(" + i + ")",
                    cellFilter: 'zfilter',
                    grouping: {
                        groupPriority: i
                    },
                    //重要这个排序一定要加上
                    sort: { priority: i, direction: 'asc' },
                };

                tcolumn.width = $scope.count;
                $scope.columnDefs.push(tcolumn);
            }

            //账户数据获取和分组数据的组建
            $scope.select();
            
            }, function (error) {
                console.log(error);
            });
    }
    //获取当前行的组id
    $scope.service.returnGroupID = function (row, group_index) {
        if (row.usergroup == '0' || $scope.usergroupData[row.usergroup].group_index <= group_index) {
            return row.usergroup;
        }
        if ($scope.usergroupData[row.usergroup].group_index > group_index) {
            var node = $scope.findOne($scope.usergroupData[row.usergroup], group_index);
            return node['_id']['$id'];
        }
        return row.usergroup;
    }
    //查询账号数据
    $scope.select = function () {        
        $scope.service.postData(__URL + 'Eimbase/Userlist/select_page_data', {}).then(function (data) {
            //存储的原始数据，以便分组下拉框调用       
            $scope.service.allData = data;
            //给每一行数据追加一个字段
            angular.forEach($scope.service.allData, function (value, key) {
                value.getgroup = function (group_index) {
                    return $scope.service.returnGroupID(this, group_index);
                }
            });
            //表格列头 
            $scope.gridOptions.columnDefs = $scope.columnDefs;
            $scope.gridOptions.data = $scope.service.allData;//最终的数据源         
        }, function (error) {
            console.log(error);
        });
    }
    //时间戳转换
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
  
    //递归方法，找到父节点
    $scope.findOne = function (node, group_index) {
        var tn = $scope.usergroupData[node.group_parentid];
        if (tn == undefined) {
            return node;
        }
        if (tn.group_index == group_index) {
            return tn;
        } else {
            return $scope.findOne(tn, group_index);
        }
    }
  
   
    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '新建用户组';
        $scope.modalHtml = 'addUser.html';
        $scope.modalController = 'addUserController';
        publicControllerAdd($scope);
    }
    //编辑用户
    $scope.updateInfo = function (rowdata,_this) {
        $scope.service.title = "编辑用户";
        $scope.modalHtml = 'addUser.html';
        $scope.modalController = 'addUserController';
        $scope.service.selectItem = rowdata.entity;
        publicControllerUpdate($scope);
    }

    //确认当前状态 参数i 0状态启用1状态禁用2锁定状态3是否为账号信息4父级未定义5父级定义
    $scope.nowstatus = function (rowdata, _this, status) {
        if (rowdata.entity._id==undefined) {
            return '';
        }
        console.log(rowdata);
        var html='';
        if (status == 'status' && rowdata.entity.lock_status==0) {
            if(rowdata.entity.status == "Enable"){
                html = '<span class="label label-success radius" ng-click="grid.appScope.changestatus(row,this)"  title="启用">启用</span>';
            }else if(rowdata.entity.status == "Disable"){
                html = '<span class="label label-danger radius" ng-click="grid.appScope.changestatus(row,this)" title="禁用">禁用</span>';
            }
        } else if (status == 'status' && rowdata.entity.lock_status == 1) {
            html = '<span class="label radius" ng-click="grid.appScope.changestatus(row,this)" title="锁定"><i class="fa fa-lock"></i></span>';
        } else if (status == 'time' && rowdata.entity.lastlogintime) {
            var time = formatDate(rowdata.entity.lastlogintime);
            html = '<span>' + time + '</span>';
        } else if (status == 'time' && rowdata.entity.updatetime) {
            var time = formatDate(rowdata.entity.updatetime);
            html = '<span>' + time + '</span>';
        } else if (status == 'time' && rowdata.entity.login_error_time) {
            var time = formatDate(rowdata.entity.login_error_time);
            html ='<span>'+time+'</span>';
        } else if (status == 'icon' && rowdata.entity._id!==undefined) {
        
            html ='<i class="fa fa-user bigger-120"></i>';
        } else if (status == 'handle' && rowdata.entity.lock_status !== undefined) {

            html = '<a href="javascript:;" class="green top-5"  ng-click="grid.appScope.updateInfo(row,this)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5"  ng-click="grid.appScope.del(row,this)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
        }
            return html;
    };

    //启用禁用状态切换
    $scope.changestatus = function (rowObj,_this) {
        var item = rowObj.entity;
        var params = new URLSearchParams();
        var num = "";
            params.append('_id', item._id.$id);
            if (item.status == "Enable") {
                num = "Disable";
                params.append('status', 'Disable');
            } else {
                num = "Enable";
                params.append('status', 'Enable');
            }
            item.status = num;
            $scope.service.selectTempItem = item;
            i = $scope.service.allData.indexOf($scope.selectTempItem);
            $scope.service.allData[i] = item;
            //$scope.selectItem = { user: {} };
            axios.post(__URL + "Eimbase/Userlist/update_page_data", params)
                 .then(function (response) {
                     if (response.data.lastOp.inc == 1) {
                         try {
                            alert.show('修改成功');
                         } catch (e) {

                         }
                     } else {

                         try {
                             alert.show('修改失败');
                             
                         } catch (e) {

                         }

                     }
                 })
                 .catch(function (error) {
                     try {
                         alert.show('404.错误了!!');
                     } catch (e) {

                     }
                     console.log(error);
                 });
        
    };
    //锁定状态切换
    $scope.changelockstatus = function (rowObj, _this) {
        var item = rowObj.entity;
        var params = new URLSearchParams();
        params.append('_id', item._id.$id);
        var num = '';
        if (item.lock_status == "0") {
            num = '1';
            params.append('lock_status', '1');
        } else {
            num = "0";
            params.append('lock_status', '0');
        }
        item.lock_status = num;
        $scope.service.selectTempItem = item;
        i = $scope.service.allData.indexOf($scope.selectTempItem);
        $scope.service.allData[i] = item;
        //$scope.selectItem = { user: {} };
        axios.post(__URL + "Eimbase/Userlist/update_page_data", params)
             .then(function (response) {
                 if (response.data.lastOp.inc == 1) {
                     try {
                         alert.show('修改成功');
                     } catch (e) {

                     }
                 } else {

                     try {
                         alert.show('修改失败');
                             
                     } catch (e) {

                     }

                 }
             })
                 .catch(function (error) {
                     try {
                         alert.show('404.错误了!!');
                     } catch (e) {

                     }
                     console.log(error);
                 });
        $scope.postdata = {};
       
    };
    $scope.del = function (rowData, _this) {
        $scope.service.title = '删除用户组';
        $scope.modalHtml = 'addUser.html';
        $scope.modalController = 'addUserController';
        $scope.service.selectItem =rowData.entity;
        publicControllerDel($scope);
        
    };
  
    $scope.usergroup_data();
}]);
//testController
userlistModule.controller('addUserController', ["$scope", "$uibModalInstance", 'userlistDataService','alert', function ($scope, $uibModalInstance,userlistDataService,alert) {
    $scope.Source = angular.copy(userlistDataService);
    $scope.group = userlistDataService;
    /*用户组选中*/
    $scope.selectGroupItem = 0;
    if ($scope.Source.selectItem['usergroup'] != '0') {
        $scope.selectGroupItem = userlistDataService.oldData[$scope.Source.selectItem['usergroup']];
    }
    $scope.Action = 1;//动作  0 修改 1 添加
    if (angular.equals({}, userlistDataService.user)) {
        //添加用户,初始化数据结构
        /*性别W女 M男*/
        /*继承用户组密码规则权限*/
        $scope.Source.user = {
            sex: 'M',
            is_inherit_usergroup_authority: 0,
        };
    }
    $scope.url = __URL + 'Eimbase/Userlist/';
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
    添加用户
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.save = function (status) {
        console.log($scope.Source);
        var params = new URLSearchParams();

        angular.forEach($scope.Source.selectItem, function (value, key) {
            if (($scope.Source.Action == 1 || $scope.Source.Action == 2) && key == '_id') {
                //如果是修改信息，就需要传id
                params.append(key, $scope.Source.selectItem._id.$id);
            } else if ($scope.Source.Action!==2) {
                params.append(key, value);
            }
        });
        //是不是超级管理员
        if ($scope.selectGroupItem._id.$id == 1) {
            params.append('usertype', 1);
        } else {
            params.append('usertype', 0);
            params.append('usergroup', $scope.selectGroupItem._id.$id);
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
                    // userlistDataService.addData($scope.Source.selectItem);
                    data.getgroup = function (group_index) {
                        return $scope.group.returnGroupID(this, group_index);
                    }
                      userlistDataService.allData.push (data);
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
                      
                        var i = userlistDataService.allData.indexOf(userlistDataService.selectItem);
                            if (i > -1) {
                                userlistDataService.allData[i] = $scope.Source.selectItem;
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
                    if (data.lastOp.inc == 1) {
                        userlistDataService.delData(userlistDataService.selectItem);
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
    $scope.cancel = function () {
        $scope.group.selectItem = {};
        $uibModalInstance.close('ok');
    };

    /*用户过期时间*/
    $scope.invalidtime = '';       
    $scope.objToArray = function (data) {
        var arr = [{ _id: 1, groupname: '超级管理员' }];
        angular.forEach(data, function (value, key) {
            value._id = value._id.$id;
            this.push(value);
            //如果是编辑,这里要存储一下选中的用户组
            if (!angular.equals({}, $scope.Source.selectItem) && $scope.Source.selectItem.usergroup == value._id.$id) {
                $scope.selectGroupItem = value;
                // $scope.invalidtime = '';
            }
        }, arr);
        if ($scope.Source.selectGroupItem == 0) {
            //说明没被选中,在添加的时候默认选中第一个用户组.
            $scope.Source.selectGroupItem = arr[0];
        }
        return arr;
    }
    $scope.Source.userGroupList = $scope.objToArray(angular.copy($scope.Source.userGroupList));

    //账号其他信息隐藏
    $scope.hideOther = true;

}]);