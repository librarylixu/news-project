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

var usergroupModule = angular.module('usergroupModule', ['ui.bootstrap', 'treeControl']);
usergroupModule.service('usergroupDataService', ['$http', '$q', function ($http, $q) {
    service($q, this);
}]);
usergroupModule.controller('usergroupController', ['$scope', '$uibModal', 'usergroupDataService', function ($scope, $uibModal, usergroupDataService) {
    $scope.service = usergroupDataService;//要显示到页面上的数据源
    
    /*
    查询数据
    */
    $scope.select = function () {
        $scope.service.postData(__URL + 'Eimbase/Usergroup/select_page_data', {}).then(function (data) {
            $scope.service.allData = data;
            $scope.usergroup = $scope.service.allData;//实际的数据源
            $scope.usergroupDataService = $scope.service.allData;//实际的数据源

          //  $scope.usergroupDataService = $scope.usergroup.slice(0, $scope.pageCount);
            $scope.pages = calculateIndexes($scope.usergroup.length, $scope.pageCount);
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
        $scope.service.title = '新建用户组';
        $scope.service.Action = 0;
        $scope.open();
    }
    //修改按钮
    $scope.updateInfo = function (item) {
        $scope.service.title = "修改用户组";
        $scope.service.Action = 1;
        $scope.service.selectItem = item;
        $scope.open();
    }
    //删除按钮
    $scope.remove = function (item) {

        alert('是否删除用户组[' + item.groupname + ']?');


        var params = new URLSearchParams();
        params.append('_id', item._id.$id);
        $scope.service.postData(__URL + "Eimbase/Usergroup/del_page_data", params).then(function (data) {
            if (data.lastOp.inc == 1) {
                var i = $scope.service.allData.indexOf(item);
                if (i > -1) {
                    $scope.service.allData.splice(i, 1);
                }
                parent.layer.msg('删除成功', { icon: 6 });
            } else {
                parent.layer.msg('删除失败', { icon: 5 });
            }
            parent.layer.close(del_index);
        }, function (error) {
            console.log(error);
        });

        //var del_index = parent.layer.confirm('是否删除用户组[' + item.groupname + ']?', function (index) {
            
            
        //});
    }
    $scope.updateData = function () {
        var sIndex = ($scope.pageNowCount - 1) * $scope.pageCount;
        sIndex = (sIndex < 0) ? 0 : sIndex;
        //当前页显示的位置
        var eIndex = sIndex + $scope.pageCount;
        $scope.usergroupDataService = $scope.usergroup.slice(sIndex, eIndex);
        console.log($scope.usergroupDataService);
    }
    //分页
    $scope.pageCount = _dt_pagelength;//每页显示几条
    $scope.pages = [];//一共有多少页
    $scope.pageNowCount = 1;//当前第几页
    $scope.sIndex = 0; //数据分页时用到,跳过多少条
    //翻页事件
    $scope.pageBtnClick = function (index) {
        if (index != $scope.pageNowCount) {
            if (index < 1) {
                $scope.pageNowCount = 1;
            } else if (index > $scope.pages.length) {
                $scope.pageNowCount = $scope.pages.length;
            }else {
                $scope.pageNowCount = index;
            }
            $scope.updateData();
        }
    }
       
    /*模态框
    action 0 修改 1添加
    */
    $scope.open = function () {
        $scope.service.openModal('saveusergroup.html', 'saveUsergroupController', $uibModal).then(
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
usergroupModule.controller('saveUsergroupController', ["$scope", "$uibModalInstance", 'usergroupDataService', function ($scope, $uibModalInstance, usergroupDataService) {
    $scope.Source = angular.copy(usergroupDataService);
    $scope.url = __URL + 'Eimbase/Usergroup/' + ($scope.Source.Action == 0 ? 'add_page_data' : 'update_page_data');      
    /*
    保存信息   
    status 0一次添加 1连续添加 不关闭窗口
    */
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
        params.append('group_type', 'User');
        params.append('group_index', 0);
        params.append('group_parentid', 0);
        $scope.Source.postData($scope.url, params).then(function (data) {
            if ($scope.Source.Action == 1 && data['updatedExisting']) {                
                //把_id属性在添加上,防止表格中定位不到行
                usergroupDataService.updateData($scope.Source.selectItem);
                alert('保存成功');
                $uibModalInstance.close('ok');
            } else if ($scope.Source.Action == 0 && data._id != undefined) {
                //status 0一次添加 1连续添加 不关闭窗口
                if (status == 0) {
                    alert('添加成功');
                    usergroupDataService.addData(data);
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
//current ：当前页码，length：总页码，displayLength：显示长度      @return  array[1,2,3,4,5,6,7,8]
var calculateIndexes = function (length, displayLength) {
    var allPageCount = Math.ceil(length / displayLength);
    var indexes = [];
    for (var i = 1; i <= allPageCount; i++) {
        indexes.push(i);
    }
    return indexes;
};