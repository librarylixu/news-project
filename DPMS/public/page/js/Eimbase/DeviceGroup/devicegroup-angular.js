//公共方法以及数据
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
        sthis.allData.push(angular.copy(data));
    }
}

var devicegroupModule = angular.module('devicegroupModule', ['ui.bootstrap', 'treeControl']);
devicegroupModule.service('devicegroupDataService', function ($http,$q) {
    
    service($q, this);
});
devicegroupModule.controller('devicegroupController', ['$scope', '$uibModal', 'devicegroupDataService', function ($scope, $uibModal, devicegroupDataService) {
    $scope.service = devicegroupDataService;//要显示到页面上的数据源
    //分页
   // $scope.pageCount = _dt_pagelength;//每页显示几条
   // $scope.pages = [];//一共有多少页
   // $scope.pageNowCount = 1;//当前第几页
  //  $scope.sIndex = 0; //数据分页时用到,跳过多少条
    //查询数据
    $scope.select = function () {
        $scope.service.postData(__URL + 'Eimbase/Devicegroup/select_page_data', {}).then(function (data) {
            $scope.service.allData = data;
            $scope.devicegroup = $scope.service.allData;//实际的数据源
            $scope.devicegrouplistDataResult = $scope.service.allData;//实际的数据源

            //  $scope.usergroupDataService = $scope.usergroup.slice(0, $scope.pageCount);
           // $scope.pages = calculateIndexes($scope.usergroup.length, $scope.pageCount);
        }, function (error) {
            console.log(error);
        });      
    }
    //刷新按钮
    $scope.refresh = function () {
        location.replace(location.href);
    }
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '添加设备组';
        $scope.service.Action = 0;
        $scope.open();     
    }
    //修改按钮
    $scope.update = function (item) {
        $scope.service.title = "修改设备组";
        $scope.service.Action = 1;
        $scope.service.selectItem = item;
        $scope.open();       
    }
    //关联设备按钮
    $scope.refDeviceBtn = function (item) {
        $scope.service.title = "关联设备";       
        $scope.service.selectItem = item;
        $scope.refDevice();
    }
    //关联用户组按钮
    $scope.refUserGroupBtn = function (item) {
        $scope.service.title = "关联用户组";
        $scope.service.selectItem = item;
        $scope.refUsergroup();
    }
    //删除按钮
    $scope.remove = function (item) {
        //  var del_index = parent.layer.confirm('是否删除设备组[' + item.groupname + ']?', function (index) {
        alert('是否删除设备组[' + item.groupname + ']?');
            var params = new URLSearchParams();
            params.append('_id', item._id.$id);
            $scope.service.postData(__URL + "Eimbase/Devicegroup/del_page_data", params).then(function (data) {
                if (data.lastOp.inc == 1) {
                    var i = $scope.service.allData.indexOf(item);
                    if (i > -1) {
                        $scope.service.allData.splice(i, 1);
                    }
                    parent.layer.msg('删除成功', { icon: 6 });
                } else {
                    parent.layer.msg('删除失败', { icon: 5 });
                }
               // parent.layer.close(del_index);
            }, function (error) {
                console.log(error);
            });           
       
    }
    ////翻页事件
    //$scope.pageBtnClick = function (index) {
    //    if (index != $scope.pageNowCount) {
    //        if (index < 1) {
    //            $scope.pageNowCount = 1;
    //        } else if (index > $scope.pages.length) {
    //            $scope.pageNowCount = $scope.pages.length;
    //        } else {
    //            $scope.pageNowCount = index;
    //        }
    //        //要跳过的位置                   
    //        var sIndex = ($scope.pageNowCount - 1) * $scope.pageCount;
    //        $scope.sIndex = (sIndex < 0) ? 0 : sIndex;
    //    }
    //}

    //页面加载完成后，查询数据
    $scope.select();
    /*
    添加、修改相关
    */
  
    //模态框 添加-修改    action 0 修改 1添加
    $scope.open = function () {
        $scope.service.openModal('saveDeviceGroup.html', 'saveDeviceGroupController', $uibModal).then(
           function (data) {
               //close 方法的回调               
           },
           function (data) {
               alert("err")
               try {
                   parent.layer.msg(data, { icon: 5 });
               } catch (e) {

               }
           });
    }
    //模态框 关联设备
    $scope.refDevice = function () {
        $scope.service.openModal('saveDevice.html', 'refDeviceController', $uibModal).then(
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
    //模态框 关联用户组
    $scope.refUsergroup = function () {
        $scope.service.openModal('saveUserGroup.html', 'refUserGroupController', $uibModal).then(
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
}]);
////length：总页码，displayLength：显示长度      @return  array[1,2,3,4,5,6,7,8]
//var calculateIndexes = function (length, displayLength) {
//    var allPageCount = Math.ceil(length / displayLength);
//    var indexes = [];
//    for (var i = 1; i <= allPageCount; i++) {
//        indexes.push(i);
//    }
//    return indexes;
//};
//添加、编辑
devicegroupModule.controller('saveDeviceGroupController', ["$scope", "$uibModalInstance", 'devicegroupDataService', function ($scope, $uibModalInstance, devicegroupDataService) {
    $scope.Source = angular.copy(devicegroupDataService);    
    $scope.url = __URL + 'Eimbase/Devicegroup/' + ($scope.Source.Action == 0 ? 'add_page_data' : 'update_page_data');
   
    //$scope.updateData = function () {
    //    var sIndex = ($scope.pageNowCount - 1) * $scope.pageCount;
    //    sIndex = (sIndex < 0) ? 0 : sIndex;
    //    //当前页显示的位置
    //  //  var eIndex = sIndex + $scope.pageCount;
    //   // $scope.usergroupDataService = $scope.usergroup.slice(sIndex, eIndex);
    //    console.log($scope.usergroupDataService);
    //}
    //保存按钮
    $scope.save = function (status) {
        var params = new URLSearchParams();
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if ($scope.Source.Action == 1 && key == '_id') {
                //如果是修改信息，就需要传id
                params.append(key, $scope.Source.selectItem._id.$id);
            } else {
                params.append(key, value);
            }
        });
        params.append('group_type', 'Device');
        params.append('group_index', 0);
        params.append('group_parentid', 0);      
        $scope.Source.postData($scope.url, params).then(function (data) {
            if ($scope.Source.Action == 1 && data['updatedExisting']) {
                //把_id属性在添加上,防止表格中定位不到行
                devicegroupDataService.updateData($scope.Source.selectItem);
                alert('保存成功');
                $uibModalInstance.close('ok');
            } else if ($scope.Source.Action == 0 && data._id != undefined) {
                //status 0一次添加 1连续添加 不关闭窗口
                if (status == 0) {
                    alert('添加成功');
                    devicegroupDataService.addData(data);
                    $uibModalInstance.close();
                } else {
                    alert('添加成功');
                    $scope.Source.selectItem.groupname = '';
                    try {
                        parent.layer.msg('添加成功', { icon: 6 });
                    } catch (e) {

                    }
                }
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
//关联设备
devicegroupModule.controller('refDeviceController', ['$scope', "$uibModalInstance", "devicegroupDataService", function ($scope, $uibModalInstance, devicegroupDataService) {
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
        $scope.devicegroup1 = angular.copy(usergroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.userlist, function (value, key) {
            if ($scope.devicegroup1[value.gid].children != undefined) {
                $scope.devicegroup1[value.gid].children.push(value);
            } else {
                $scope.devicegroup1[value.gid].children = [value];
            }
        });
        //因为tree需要[] 而不是  {}  ,所以需要转换一下，同时，在转换的时候，将当前组给屏蔽掉
        var myusergroup = [];
        angular.forEach($scope.devicegroup1, function (value, key) {
            if (key != $scope.thisGid) {
                this.push(value);
            }
        }, myusergroup);
        $scope.mydevicegroup = myusergroup;
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
//关联用户组
devicegroupModule.controller('refUserGroupController', ['$scope', "$uibModalInstance", "devicegroupDataService", function ($scope, $uibModalInstance, devicegroupDataService) {
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
        $scope.devicegroup1 = angular.copy(usergroupSource);
        //重新组建一下数据源给页面使用,根据用户-用户组的关系进行组建  children:[用户,用户]
        angular.forEach($scope.userlist, function (value, key) {
            if ($scope.devicegroup1[value.gid].children != undefined) {
                $scope.devicegroup1[value.gid].children.push(value);
            } else {
                $scope.devicegroup1[value.gid].children = [value];
            }
        });
        //因为tree需要[] 而不是  {}  ,所以需要转换一下，同时，在转换的时候，将当前组给屏蔽掉
        var myusergroup = [];
        angular.forEach($scope.devicegroup1, function (value, key) {
            if (key != $scope.thisGid) {
                this.push(value);
            }
        }, myusergroup);
        $scope.mydevicegroup = myusergroup;
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