var userlistModule = angular.module('userlistModule', ['ui.bootstrap']);
userlistModule.service('userlistDataService', function () {
    //返回用户数据源对象
    return [];
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
userlistModule.controller('userlistController', ['$scope', '$uibModal', 'userlistDataService', function ($scope, $uibModal, userlistDataService) {
    $scope.userlistPageResult = userlistDataService;//要显示到页面上的数据源
    $scope.userlistResult = [];//实际的数据源
    //查询数据
    $scope.select = function () {
        axios.post(__URL + 'Eimbase/Userlist/select_page_data', {})
          .then(function (response) {
              $scope.userlistResult = response.data;
              $scope.$apply(function () {
                  //切分一下数组,显示到table中,每页显示 $scope.pageCount 条
                  $scope.userlistPageResult = $scope.userlistResult.slice(0, $scope.pageCount);
                  $scope.pages = calculateIndexes(response.data.length, $scope.pageCount);
              });
          })
          .catch(function (error) {
              console.log(error);
          });
    }
    //查询用户组
    $scope.selectusergroup = function () {
        var params = new URLSearchParams();
        params.append('json', 1);
        axios.post(__URL + 'Eimbase/Usergroup/select_usergroup_page', params)
          .then(function (response) {
              $scope.$apply(function () {
                  $scope.userGroupList = response.data;

              });
          })
          .catch(function (error) {
              console.log(error);
          });
    }
    /*
    分页
    */
    $scope.pageCount = 10;//每页显示几条
    $scope.pages = [];//一共有多少页
    $scope.pageNowCount = 1;//当前第几页
    //翻页事件
    $scope.pageBtnClick = function (index) {
        if (index != $scope.pageNowCount) {
            if (index < 1) {
                $scope.pageNowCount = 1;
            } else {
                $scope.pageNowCount = index;
            }
            //要跳过的位置                   
            var sIndex = ($scope.pageNowCount - 1) * $scope.pageCount;
            sIndex = (sIndex < 0) ? 0 : sIndex;
            //当前页显示的位置
            var eIndex = sIndex + $scope.pageCount;
            $scope.userlistPageResult = $scope.userlistResult.slice(sIndex, eIndex);
            console.log($scope.userlistPageResult);
        }
    }
    //当前选中行的全部数据
    $scope.selectItem = { user: {}, title: '', grouplist: {}, selectGroup: {} };
    //添加按钮
    $scope.add = function () {
        $scope.selectItem.user = {};
        $scope.selectItem.title = '新建用户';
        $scope.selectItem.grouplist = $scope.userGroupList;
        $scope.open();
    }
    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //编辑用户
    $scope.updateInfo = function (item) {
        $scope.selectTempItem = item;
        $scope.selectItem.title = '编辑用户';
        $scope.selectItem.user = angular.copy($scope.selectTempItem);
        $scope.selectItem.grouplist = $scope.userGroupList;
        $scope.open();
    }
    //启用禁用状态切换
    $scope.changestatus = function (item) {
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
        $scope.selectTempItem = item;
        i = $scope.userlistResult.indexOf($scope.selectTempItem);
        $scope.userlistResult[i] = item;
        $scope.selectItem = { user: {} };
        axios.post(__URL + "Eimbase/Userlist/update_page_data", params)
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
    //锁定状态切换
    $scope.changelockstatus = function (item) {
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
        $scope.selectTempItem = item;
        i = $scope.userlistResult.indexOf($scope.selectTempItem);
        $scope.userlistResult[i] = item;
        $scope.selectItem = { user: {} };
        axios.post(__URL + "Eimbase/Userlist/update_page_data", params)
             .then(function (response) {
                 if (response.data.lastOp.inc == 1) {
                     
                     parent.layer.msg('修改成功', { icon: 6 });
                    
                 } else {
                     parent.layer.msg('修改失败', { icon: 5 });
                 }
             })
             .catch(function (error) {
                 try {
                     parent.layer.msg('404.错误了!!', { icon: 5 });
                 } catch (e) {

                 }
                 console.log(error);
             });
        $scope.postdata = {};
       
    };
    //删除数据
    $scope.del = function (item) {
        var del_index = parent.layer.confirm('是否删除该账户?', function (index) {
            var params = new URLSearchParams();
            params.append('_id', item._id.$id);
            axios.post(__URL + "Eimbase/Userlist/del_page_data", params)
              .then(function (response) {
                  if (response.data.lastOp.inc == 1) {
                      parent.layer.msg('删除成功', { icon: 6 });
                      $scope.$apply(function () {
                          var i = $scope.userlistResult.indexOf(item);
                          $scope.userlistResult.splice(i, 1);
                      });
                  } else {
                      parent.layer.msg('删除失败', { icon: 5 });
                  }
                  parent.layer.close(del_index);
              })
              .catch(function (error) {
                  parent.layer.msg('404.错误了!!', { icon: 5 });
                  console.log(error);
              });
        });
    }

    /*
    
    */
    $scope.orderType = '';
    $scope.order = '';
    //排序
    $scope.changOrder = function (type) {
        $scope.orderType = type;
        if ($scope.order === '') {
            $scope.order = '-';
        } else {
            $scope.order = '';
        }
    }
    /*模态框*/
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'addUser.html',
            controller: 'addUserController',
            animation: true,
            keyboard: true,
            backdrop: "static",
            //  size: size,
            //给模态框控制器传值
            resolve: {
                source: function () {
                    return $scope.selectItem;
                }
            }
        });
        //模态框结束的回调函数
        modalInstance.result.then(function (value) {
            //close 方法的回调
            if (value.Action == 1) {
                //添加事件
                parent.layer.msg(value.value, { icon: 6 });
            } else {
                var i = $scope.userlistPageResult.indexOf($scope.selectTempItem);
                $scope.userlistPageResult[i] = value;
                $scope.selectItem = {};
                parent.layer.msg('OK', { icon: 6 });
            }

        }, function () {
            $scope.selectItem = {};
            parent.layer.msg('CEL', { icon: 5 });

        });
    };


    $scope.select();
    $scope.selectusergroup();

   
}]);
//current ：当前页码，length：总页码，displayLength：显示长度      @return  array[1,2,3,4,5,6,7,8]
var calculateIndexes = function (length, displayLength) {
    var allPageCount = Math.ceil(length / displayLength);
    var indexes = [];
    for (var i = 1; i <= allPageCount; i++) {
        indexes.push(i);
    }
    return indexes;
};
//testController
userlistModule.controller('addUserController', ["$scope", "$uibModalInstance", "source", function ($scope, $uibModalInstance, source) {
    $scope.Source = angular.copy(source);
    $scope.Action = 1;//动作  0 修改 1 添加
    if (angular.equals({}, source.user)) {
        //添加用户,初始化数据结构
        /*性别W女 M男*/
        /*继承用户组密码规则权限*/
        $scope.Source.user = {
            sex: 'M',
            is_inherit_usergroup_authority: 0,
        };
    }
    /*
    添加用户
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.addUser = function (status) {
        console.log($scope.Source);

        var params = new URLSearchParams();
        angular.forEach($scope.Source.user, function (value, key) {
            params.append(key, value);
        });
        //是不是超级管理员
        if ($scope.Source.selectGroup._id == 1) {
            params.append('usertype', 1);
        } else {
            params.append('usertype', 0);
            params.append('usergroup', $scope.Source.selectGroup._id);
        }
        //
        axios.post(__URL + 'Eimbase/Userlist/add_page_data', params)
         .then(function (response) {
             console.log(response);
             if ($scope.Action == 1 && response.data.ok == 1) {
                 //status 0一次添加 1连续添加 不关闭窗口
                 if (status == 0) {
                     $uibModalInstance.close({ Action: 1, value: '添加成功' });
                 } else {
                     $scope.$apply(function () {
                         $scope.Source.user.username = '';
                     });
                     try {
                         parent.layer.msg('添加成功', { icon: 6 });
                     } catch (e) {

                     }
                 }
             }


             //  $uibModalInstance.close($scope.Source);
         })
         .catch(function (error) {
             console.log(error);
         });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /*用户过期时间*/
    $scope.invalidtime = '';
    /*用户组选中*/
    $scope.Source.selectGroup = 0;//先给一个默认值
    $scope.objToArray = function (data) {
        var arr = [{ _id: 1, groupname: '超级管理员' }];
        angular.forEach(data, function (value, key) {
            value._id = value._id.$id;
            this.push(value);
            //如果是编辑,这里要存储一下选中的用户组
            if (!angular.equals({}, $scope.Source.user) && $scope.Source.user.usergroup == value._id) {
                $scope.Source.selectGroup = value;
                // $scope.invalidtime = '';
            }
        }, arr);
        if ($scope.Source.selectGroup == 0) {
            //说明没被选中,在添加的时候默认选中第一个用户组.
            $scope.Source.selectGroup = arr[0];
        }
        return arr;
    }
    $scope.userGroupList = $scope.objToArray(angular.copy($scope.Source.userGroupList));

    //账号其他信息隐藏
    $scope.hideOther = true;

}]);