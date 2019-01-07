
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ngVerify', 'ui.select']);
//主控制器
appModule.controller('crmUsersController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    /*
        查询用户（本页面使用）数据
    */
    $scope.select = function () {
        var params = {};
        params['$json'] = true;
        select_user(params).then(function (res) {
            $scope.service.usersArrData = P_objecttoarray($scope.service.privateDateObj.usersData);
        });
       
        select_btn(params).then(function (res) {
            //查询角色关系
            $scope.refselectusertype();
        });
    }
    //模态框
    $scope.usersModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".usersmodaltemplate",
        openButton: ".usersmodaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "80vw"
    });

    //添加按钮
    $scope.add = function () {       
        //新模态框呼出
        $scope.usersModal.open();
        $scope.usersModal.title = '新建用户';
        if ($scope.Action != 0) {
            $scope.selectItem = {};
        }
        $scope.Action = 0;
        $scope.selectItem.refusrtype = 1;
        $scope.selectItem.refusergroup = 1;
        $scope.selectItem.refcustomers = 1;
    }
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'userlist';
        $scope.service.name = '用户';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.usersModal.open();
        $scope.usersModal.title = '修改用户';       
        $scope.Action = 0;
        $scope.selectItem = row;
        $scope.selectItem.pwd = '';
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (row) {
        var index = parent.layer.open({
            content: '确认删除账号【' + row.description + '】，是否确认？'
         , btn: ['确认', '我再想想']
         , icon: 6
         , area: ['400px']
         , title: '删除账号信息'
         , yes: function (index, layero) {
             //按钮【按钮一】的回调
             var params = new URLSearchParams();
             params.append('idcustomerinfo', row.idusers);
             $scope.service.postData(__URL + 'Crmuser/Users/del_page_data', params).then(function (data) {
                 if (data) {
                     parent.layer.msg('删除成功', { icon: 1 });
                     $scope.service.delData('usersArrData', row);
                     row._kid = row.idusers;
                     $scope.service.delData('usersData', row);
                 }
             });
             parent.layer.close(index);
         }
        });
    }
    $scope.getTypeRefSouce = function () {
        //用户组
        angular.forEach($scope.service.refusergroupData, function (value, key) {
            try {
                if (!$scope.service.privateDateObj.usersData[value.userid]) {
                    return;
                }
                if (!$scope.service.privateDateObj.usersData[value.userid].__refgroupids) {
                    $scope.service.privateDateObj.usersData[value.userid].__refgroupids = [];
                    //{groupid:id_user_group}用来删除关系用的
                    $scope.service.privateDateObj.usersData[value.userid].__refgroupobj = {};
                }
                if ($scope.service.privateDateObj.usersData[value.userid].__refgroupids.indexOf(value.groupid) < 0) {
                    $scope.service.privateDateObj.usersData[value.userid].__refgroupids.push(value.groupid);
                    $scope.service.privateDateObj.usersData[value.userid].__refgroupobj[value.groupid] = key;
                }
            } catch (e) {
                console.log(e + value.userid);
            }
        });
    };
    /*
    查询与用户角色关系数据
    */
    $scope.refselectusertype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        /*
            先查询等级数据，等待回调之后在查询关系数据
        */
        select_usertype(params).then(function (res) {
            var params = new URLSearchParams();
            params.append('$json', true);
            dataService.postData(__URL + 'Crmuser/RefuserRefutype/select_page_data', params).then(function (data) {
                //查询与用户组关系数据
                $scope.refselectusergroup();
                $scope.service.refusertypeData = data;
            }, function (error) {
                console.log(error);
            });
        });
    }
    /*
        查询与用户组关系数据
        */
    $scope.refselectusergroup = function () {
        var parameter = new URLSearchParams();
        parameter.append('$json', true);
        $scope.service.postData(__URL + 'Crmuser/RefuserRefgroup/select_page_data', parameter).then(function (data) {
            $scope.service.refusergroupData = data;
            select_usergroup(parameter).then(function (data) {
                angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                    if (!value.__parentname) {
                        $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid]);
                    }
                });
                $scope.getTypeRefSouce();
            });
        });
    }
    //查找父级组
    $scope.buildParentname = function (node, parentnode) {
        if (node.pid && node.pid != '0') {
            if (!node.__parentname) {
                node.__parentname = parentnode.groupname;
            } else {
                node.__parentname = parentnode.groupname + '->' + node.__parentname;
            }
            if (parentnode.pid && parentnode.pid != '0') {
                $scope.buildParentname(node, $scope.service.privateDateObj.usergroupData[parentnode.pid]);
            }
        } else {
            if (!node.__parentname) {
                node.__parentname = '';
            }
        }
    }
   
    //页面加载完成后，查询数据
    $scope.select();

    //模态框js方法以及变量
    //保存用户组关系
    $scope.savegroup = function () {

        angular.forEach($scope.Source.selectItem.__refgroupids, function (value) {
            if (!$scope.service.selectItem[value]) {
                $scope.url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                var params = new URLSearchParams();
                params.append('groupid', value);
                params.append('userid', $scope.Source.selectItem.idusers);
                //保存方法
                $scope.saveData($scope.url, params, 0, value);
            }
        });
        angular.forEach($scope.service.selectItem.__refgroupids, function (value) {
            var params = new URLSearchParams();
            if ($scope.Source.selectItem.__refgroupids.indexOf(value) < 0) {
                if ($scope.Source.selectItem.__refgroupobj[value]) {
                    params.append("idref_user_group", $scope.Source.selectItem.__refgroupobj[value]);
                    $scope.url = __URL + 'Crmuser/RefuserRefgroup/delete_page_data';
                    //保存方法
                    $scope.saveData($scope.url, params, 1, value, $scope.Source.selectItem.__refgroupobj[value]);
                }
            }
        });
    }
    /*
    保存信息
    */
    $scope.save = function () {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 1) {
            $scope.params.append('idusers', $scope.Source.selectItem.idusers);
        }
        angular.forEach($scope.Source.selectItem, function (value, key) {
            if (key.indeOf('__') < 0 && value != $scope.Source.selectItem[key]) {
                $scope.params.append(key, value);
            }
        });
        //此处进行额外判断:是否数据库中有重复得用户
        for (var i = 0; i < $scope.service.privateDateObj.usersData.length; i++) {
            if ($scope.service.privateDateObj.usersData[i].username == $scope.Source.selectItem['username'] && $scope.Source.Action == 0) {
                //添加失败,该用户以存在
                layer.msg('添加失败,该用户[' + $scope.Source.selectItem['username'] + ']已存在', { icon: 6 });
                return;
            }
        }
        $scope.Source.postData(url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        layer.msg('添加账号失败', { icon: 5 })
                        break;
                    }
                    $scope.Source.selectItem._kid = data;
                    $scope.Source.selectItem.idusers = data;
                    $scope.Source.selectItem.createtime = (Date.parse(new Date()) / 1000).toFixed(0);
                    //更新service数据源
                    dataService.addData('usersData', $scope.Source.selectItem);
                    $uibModalInstance.close('ok');
                    layer.msg('添加账号成功', { icon: 6 });
                case 1:
                    if (data > 0) {
                        //修改成功   
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                        dataService.updateData('usersData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg('修改账号成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    layer.msg('修改账号失败', { icon: 5 });
                    break;
            }
        }, function (error) {
            console.log(error);
        });

    };
    //保存到后台的方法
    $scope.saveData = function (url, params, action, value, refid) {
        $scope.Source.postData(url, params).then(function (data) {
            if (data > 0) {
                //修改成功  
                if (action == 0) {
                    if (!$scope.Source.selectItem.__refgroupobj) {
                        $scope.Source.selectItem.__refgroupobj = {};
                    }
                    $scope.Source.selectItem.__refgroupobj[value] = data;
                    $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                    $scope.service.updateData('usersData', $scope.Source.selectItem);
                    $scope.service.addData('refusergroupData', { _kid: data, idref_user_group: data, groupid: value, userid: $scope.Source.selectItem.idusers });
                    $uibModalInstance.close('ok');
                    layer.msg('用户组关系添加成功', { icon: 6 });
                } else {
                    delete $scope.Source.selectItem.__refgroupobj[value];
                    $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                    $scope.service.updateData('usersData', $scope.Source.selectItem);
                    $scope.service.delData('refusergroupData', { _kid: refid, idref_user_group: refid, groupid: value, userid: $scope.Source.selectItem.idusers });
                    $uibModalInstance.close('ok');
                    layer.msg('用户组关系删除成功', { icon: 6 });
                }
                return;
            }
            //修改失败
            layer.msg('关系修改失败', { icon: 5 });

        }, function (error) {
            console.log(error);
        });
    }
}]);