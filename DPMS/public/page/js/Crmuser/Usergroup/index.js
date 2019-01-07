/*zhangs
2018-10-19
用户组
*/

//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngVerify',  'ui.select']);

//主控制器
appModule.controller('crmUsergroupController', ['$scope', '$q','dataService',  function ($scope,$q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源  
    //获取对象obj的长度
    $scope.length = function (obj) {
        return Object.keys(obj).length;
    };
    /*
        查询数据
    */
    $scope.select = function (flag) {
        var parameter = {};
        parameter['$json'] = true;
        select_usergroup(parameter).then(function (data) {
            angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                if (value.pid != '0' && !value.__parentname) {
                    $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid]);
                }
                value.__refusers = [];
                value.__refidObj = {};//key是用户id,value是关系表id
                for (var i in $scope.service.privateDateObj.refuserData) {
                    if ($scope.service.privateDateObj.refuserData[i].groupid == key) {
                        value.__refidObj[$scope.service.privateDateObj.refuserData[i].userid] = $scope.service.privateDateObj.refuserData[i].idref_user_group;
                        value.__refusers.push($scope.service.privateDateObj.refuserData[i].userid);
                    }
                };
            });
        });
    }
    /*
 查询用户组与用户关系数据
*/
    $scope.refselectuser = function () {
        var params = {};
        params['$json'] = true;
        dataService.postData(__URL + 'Crmuser/RefuserRefgroup/select_page_data', params).then(function (data) {
            $scope.service.privateDateObj.refuserData = data;
            //查询用户数据
            $scope.selectuser();
        }, function (error) {
            console.log(error);
        });
    }
    /**
  *查询用户数据
*/
    $scope.selectuser = function () {
        var params = {};
        params['$json'] = true;
        select_user(params).then(function () {
            //页面加载完成后，查询数据
            $scope.select();
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
    //模态框
    $scope.usergroupModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".usergroupmodaltemplate",
        openButton: ".usergroupmodaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "80vw"
    });
    //添加按钮
    $scope.add = function (node) {
        //新模态框呼出
        $scope.usergroupModal.open();
        $scope.usergroupModal.title = '新建用户';
        if ($scope.Action != 0) {
            $scope.selectItem = {};
        }
        $scope.Action = 0;
        $scope.selectItem.refusers = 1;      
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.Action = 1;
        //新模态框呼出
        $scope.usergroupModal.open();
        $scope.usergroupModal.title = '修改用户组';
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.selectItem.pwd = '';       
    }
    //权限按钮
    $scope.authInfo = function (node) {
        $scope.service.title = "修改用户组";
        $scope.modalHtml = 'Crmuser/Usergroup/auth_modal';
        $scope.modalController = 'modalEimusergroupAuthController';
        $scope.service.selectItem = node;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (node) {
        var userLength = '';
        if (node.__refusers.length > 0) {
            userLength = '该用户组下关联了' + node.__refusers.length + '个用户，';
        }
        var index = parent.layer.open({
            content: '确认删除用户组【' + node.groupname + '】，' + userLength + '是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除用户组',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['idusergroup'] = node.idusergroup;
                $scope.service.postData(__URL + 'Crmuser/Usergroup/delete_page_data', params).then(function (data) {
                    if (data) {
                        parent.layer.msg('删除成功', { icon: 1 });
                        node._kid = node.idusergroup;
                        $scope.service.delData('usergroupData', node);
                    }
                });
                parent.layer.close(index);
            }
        });


    }
    //查询用户与用户组关系表
    $scope.refselectuser();

    //模态框js代码
    /*
        保存信息
        status 0一次添加 1连续添加 不关闭窗口 2删除  3 用户和用户角色cheked改变状态保存
        */
    $scope.save = function () {
        var url = __URL + 'Crmuser/';
        switch ($scope.Action) {
            case 0:
                url += 'Usergroup/add_page_data';
                break;
            case 1:
                url += 'Usergroup/update_page_data';
                break;
        }
        var params = {};
        var num = 0;
        if ($scope.Action == 1) {
            //如果是修改信息，就需要传id
            params['idusergroup'] = $scope.selectItem.idusergroup;
        }
        angular.forEach($scope.selectItem, function (value, key) {
            if (key.indexOf('__') < 0 && value != $scope.service.selectItem[key]) {
                params[key] = value;
                num++;
            }
        });
        if (num == 0) {
            //关系编辑
            $scope.save_refuser();
            return;
        }
        $scope.service.postData(url, params).then(function (data) {
            switch ($scope.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        parent.layer.msg('添加失败', { icon: 5 });
                        break;
                    }
                    $scope.selectItem.idusergroup = data;
                    $scope.selectItem._kid = data;
                    //修改成功                            
                    dataService.addData('usergroupData', $scope.selectItem);
                    //关系编辑
                    $scope.save_refuser();
                    $scope.usergroupModal.close();
                    parent.layer.msg('添加成功', { icon: 6 });
                    break;
                case 1:
                    if (data > 0) {
                        $scope.selectItem._kid = $scope.selectItem.idusergroup;
                        //修改成功                            
                        dataService.updateData('usergroupData', $scope.selectItem);
                        //关系编辑
                        $scope.save_refuser();
                        $scope.usergroupModal.close();
                        parent.layer.msg('修改成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    parent.layer.msg('修改失败', { icon: 5 });
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    /*
  保存关联用户的关系信息      
 */
    $scope.save_refuser = function () {

        var url;
        if ($scope.service.selectItem.__refusers.length != 0) {
            angular.forEach($scope.service.selectItem.__refusers, function (value) {
                if ($scope.selectItem.__refusers.indexOf(value) < 0) {
                    if ($scope.service.selectItem.__refidObj[value]) {
                        var params = {};
                        params['idref_user_group'] = $scope.service.selectItem.__refidObj[value];
                        url = __URL + 'Crmuser/RefuserRefgroup/del_page_data';
                        $scope.service.postData(url, params).then(function (data) {
                            //与用户关系添加
                            if (data < 0) {
                                parent.layer.msg('用户[' + $scope.service.privateDateObj.usersData[value].description + ']关联取消失败', { icon: 5 });
                                return;
                            }
                            //更新存储关联用户id的数组
                            $scope.service.selectItem.__refusers.splice($scope.service.selectItem.__refusers.indexOf(value), 1);
                            //删除关系表中对应的数据
                            delete $scope.service.privateDateObj.refuserData[$scope.service.selectItem.__refidObj[value]];
                            $uibModalInstance.close('ok');
                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                        var params = {};
                        params['groupid'] = $scope.selectItem.idusergroup;
                        params['userid'] = value;
                        $scope.service.postData(url, params).then(function (data) {
                            //与用户关系添加
                            if (data < 0) {
                                parent.layer.msg('用户[' + $scope.service.privateDateObj.usersData[value].description + ']关联添加失败', { icon: 5 });
                                return;
                            }
                            //更新存储关联用户id的数组
                            $scope.service.selectItem.__refusers.push(value);
                            //添加数据到关系表中
                            $scope.service.privateDateObj.refuserData[data] = {
                                idref_user_group: data, userid: value, groupid: $scope.service.idusergroup
                            };
                            //添加临时存储关系的id obj的数据
                            $scope.service.selectItem.__refidObj[value] = data;

                            $uibModalInstance.close('ok');
                        }, function (error) {
                            console.log(error);
                        });
                    }

                }
            });
        }
        if ($scope.selectItem.__refusers.length != 0) {
            angular.forEach($scope.selectItem.__refusers, function (value) {
                if ($scope.service.selectItem.__refusers.indexOf(value) < 0) {
                    //判断是否关系表中存在该条关系，在的表示该条数据是删除的数据，否则为新增的数据
                    if ($scope.service.selectItem.__refidObj[value]) {
                        var params = {};
                        params["idref_user_group"] = $scope.service.selectItem.__refidObj[value];
                        url = __URL + 'Crmuser/RefuserRefgroup/delete_page_data';
                        $scope.service.postData(url, params).then(function (data) {
                            //与用户关系添加
                            if (data < 0) {
                                parent.layer.msg('用户[' + $scope.service.privateDateObj.usersData[value].description + ']关联取消失败', { icon: 5 });
                                return;
                            }
                            //更新存储关联用户id的数组
                            $scope.service.selectItem.__refusers.splice($scope.service.selectItem.__refusers.indexOf(value), 1);
                            //删除关系表中对应的数据
                            delete $scope.service.privateDateObj.refuserData[$scope.service.selectItem.__refidObj[value]];
                            $uibModalInstance.close('ok');
                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                        var params = {};
                        params['groupid'] = $scope.selectItem.idusergroup;
                        params['userid'] = value;
                        $scope.service.postData(url, params).then(function (data) {
                            //与用户关系添加
                            if (data < 0) {
                                parent.layer.msg('用户[' + $scope.service.privateDateObj.usersData[value].description + ']关联添加失败', { icon: 5 });
                                return;
                            }
                            //更新存储关联用户id的数组
                            $scope.service.selectItem.__refusers.push(value);
                            //添加数据到关系表中
                            $scope.service.privateDateObj.refuserData[data] = {
                                idref_user_group: data, userid: value, groupid: $scope.service.idusergroup
                            };
                            //添加临时存储关系的id obj的数据
                            $scope.service.selectItem.__refidObj[value] = data;

                            $scope.usergroupModal.close();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            });
        }


    };

}])   
    .controller('modalEimusergroupAuthController', ["$scope",  'dataService',  function ($scope, dataService) {
        $scope.service = dataService;
        $scope = angular.copy(dataService);
        $scope.selectAuth = function () {
            var params = {};
            params['$json'] = true;
            $scope.service.postData(__URL + '', params).then(function (data) {


            });
        }
    }]);
