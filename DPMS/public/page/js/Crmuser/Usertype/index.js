//初始化module并定义service
appModuleInit(['ui.bootstrap',  'ngVerify', 'datePicker', 'ui.select', 'ngSanitize']);

/*
   service 数据源
   数据表名称+Data或业务名称+Data
   crmusertypeData
   */
//主控制器
appModule.controller('crmUsertypeController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$q = $q;
    _$scope = $scope;
    $scope.select = function () {
        var params = {};
        params.$json = true;
        select_usertype(params).then(function () {
            $scope.selectrefuser();
            $scope.selectusergroup();
           
        });
    }


    //模态框
    $scope.usertypeModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".usertypemodaltemplate",
        openButton: ".usertypemodaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "80vw"
    });

    //添加按钮
    $scope.add = function () {
        //新模态框呼出
        $scope.usertypeModal.open();
        $scope.usertypeModal.title = '新建用户角色';
        $scope.selectItem = {};
        $scope.Action = 0;
    }

    //修改按钮
    $scope.updateInfo = function (row) {     
        $scope.Action = 1;
        //新模态框呼出
        $scope.usertypeModal.open();
        $scope.usertypeModal.title = '修改用户角色';       
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        
    }

    //删除按钮
    $scope.remove = function (row) {
        var index = parent.parent.layer.open({
            content: '确认删除用户角色【' + row.typename + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['400px'],
            title: '删除用户角色',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params.idusertype=row.idusertype;
                $scope.service.postData(__URL + 'Crmuser/Usertype/del_page_data', params).then(function (data) {
                    if (data) {
                        parent.parent.layer.msg('删除成功', { icon: 1 });
                        //$scope.service.delData('usertypeData', row);
                        row._kid = row.idusertype;
                        $scope.service.delData('usertypeData', row);
                    }
                });
                parent.parent.layer.close(index);
            }
        });
    }
    //查询关系--用户角色与用户
    $scope.selectrefuser = function () {
        var params = {};
        params.$json=true;
        select_user(params).then(function () {
            dataService.postData(__URL + 'Crmuser/RefuserRefutype/select_page_data', params).then(function (data) {
                $scope.service.refuserData = data;
                //关联用户
                angular.forEach($scope.service.refuserData, function (value, key) {
                    if ($scope.service.privateDateObj.usertypeData[value.utypeid]) {
                        if (!$scope.service.privateDateObj.usertypeData[value.utypeid].__refusers) {
                            $scope.service.privateDateObj.usertypeData[value.utypeid].__refusers = [];
                            $scope.service.privateDateObj.usertypeData[value.utypeid].__refuserobj = {};
                        }
                        $scope.service.privateDateObj.usertypeData[value.utypeid].__refusers.push(value.userid);
                        $scope.service.privateDateObj.usertypeData[value.utypeid].__refuserobj[key] = value.userid;
                    }
                });
            }, function (error) {
                console.log(error);
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
    //查询用户组
    $scope.selectusergroup = function () {
        var params = {};
        params.$json=true;
        select_usergroup(params).then(function () {
            angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                if (value.pid != '0' && !value.__parentname) {
                    $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid]);
                }
            });
            //查询关系
            $scope.selectrefusergroup();
        });
    }
    //查询用户组与用户角色的关系
    $scope.selectrefusergroup = function () {
        var params = {};
        params.$json = true;
        dataService.postData(__URL + 'Crmuser/RefusertyRefgroup/select_page_data', params).then(function (data) {
            $scope.service.refusergroupData = data;
            //关联用户组
            angular.forEach($scope.service.refusergroupData, function (value, key) {
                if ($scope.service.privateDateObj.usertypeData[value.typeid]) {
                    if (!$scope.service.privateDateObj.usertypeData[value.typeid].__refusergroup) {
                        $scope.service.privateDateObj.usertypeData[value.typeid].__refusergroup = [];
                        $scope.service.privateDateObj.usertypeData[value.typeid].__refusergroupobj = {};
                    }
                    $scope.service.privateDateObj.usertypeData[value.typeid].__refusergroup.push(value.groupid);
                    $scope.service.privateDateObj.usertypeData[value.typeid].__refusergroupobj[key] = value.groupid;
                }
            });
        }, function (error) {
            console.log(error);
        });
    }
    //查询关系--用户角色与权限
    $scope.selectrefauth = function () {
        var params = {};
        params.$json = true;
        select_authority(params).then(function (params) {
            dataService.postData(__URL + 'Crmuser/RefutypeRefauth/select_page_data', params).then(function (data) {
                $scope.service.refuserauthData = data;
                //关联权限
                angular.forEach($scope.service.refuserauthData, function (value, key) {
                    if ($scope.service.privateDateObj.usertypeData[value.utypeid]) {
                        if (!$scope.service.privateDateObj.usertypeData[value.utypeid].__refauths) {
                            $scope.service.privateDateObj.usertypeData[value.utypeid].__refauths = [];
                            $scope.service.privateDateObj.usertypeData[value.utypeid].__refauths = {};
                        }
                        $scope.service.privateDateObj.usertypeData[value.utypeid].__refauths.push(value.authid);
                        $scope.service.privateDateObj.usertypeData[value.utypeid].__refauthobj[key] = value.authid;
                    }
                });
               
            }, function (error) {
                console.log(error);
            });
        });
        
    }
    $scope.select();

    //模态框js
    //模态框js方法以及变量
    //保存用户关系
    $scope.saveUser = function () {
        if (!$scope.service.selectItem.__refuses) {
            $scope.service.selectItem.__refuses = [];
        }
        if (!$scope.selectItem.__refuses) {
            $scope.selectItem.__refuses = [];
        }
        if ($scope.selectItem.__refuses.sort().toString() == $scope.service.selectItem.__refuses.sort().toString()) {
            return;
        }
        var deleteurl;
        var addurl;
        var url;
        //保存用户__refusers
        addurl = __URL + 'Crmuser/RefuserRefutype/add_page_data';
        deleteurl = __URL + 'Crmuser/RefuserRefutype/delete_page_data';
        var refdataobj = { obj: '__refuserobj', arr: '__refuses', idname: idref_user_utype }
        angular.forEach($scope.selectItem.__refuses, function (value) {
            if (!$scope.service.selectItem.__refuserobj[value]) {
                url = addurl;
                var params = {};
                params['userid'] = value;
                params['utypeid'] = $scope.selectItem.idusertype;
                //保存方法
                $scope.saveData(url, params, 0, value);
            }
        });
        angular.forEach($scope.service.selectItem.__refuses, function (value) {
            var params = {};
            if ($scope.selectItem.__refuses.indexOf(value) < 0) {
                if ($scope.selectItem.__refuserobj[value]) {
                    params["idref_user_utype"] = $scope.selectItem.__refuserobj[value];
                    url = deleteurl;
                    //保存方法
                    refdataobj.refid=$scope.selectItem.__refuserobj[value];
                    $scope.saveData(url, params, 1, value, refdataobj);
                }
            }
        });
    }
    //保存用户组关系
    $scope.saveGroup = function () {
        if (!$scope.service.selectItem.__refgroupids) {
            $scope.service.selectItem.__refgroupids = [];
        }
        if (!$scope.selectItem.__refgroupids) {
            $scope.selectItem.__refgroupids = [];
        }
        if ($scope.selectItem.__refgroupids.sort().toString() == $scope.service.selectItem.__refgroupids.sort().toString()) {
            return;
        }
        var deleteurl;
        var addurl;
        var url;
        //保存用户组__refgroupids
        addurl = __URL + 'Crmuser/RefusertypeRefgroup/add_page_data';
        deleteurl = __URL + 'Crmuser/RefusertypeRefgroup/delete_page_data';
        var refdataobj = { obj: '__refgroupobj', arr: '__refgroupids', idname: idref_usertype_group };
        angular.forEach($scope.selectItem.__refgroupids, function (value) {
            if (!$scope.service.selectItem.__refgroupobj[value]) {
                url = addurl;
                var params = {};
                params['groupid'] = value;
                params['typeid'] = $scope.selectItem.idusertype;
                //保存方法
                $scope.saveData(url, params, 0, value, refdataobj);
            }
        });
        angular.forEach($scope.service.selectItem.__refgroupids, function (value) {
            var params = {};
            if ($scope.selectItem.__refgroupids.indexOf(value) < 0) {
                if ($scope.selectItem.__refgroupobj[value]) {
                    params["idref_usertype_group"] = $scope.selectItem.__refgroupobj[value];
                    url = deleteurl;
                    //保存方法
                    refdataobj.refid=$scope.selectItem.__refgroupobj[value];
                    $scope.saveData(url, params, 1, value, refdataobj);
                }
            }
        });
    }
    //保存权限关系
    $scope.saveAuth = function () {
        if (!$scope.service.selectItem.__refauths) {
            $scope.service.selectItem.__refauths = [];
        }
        if (!$scope.selectItem.__refauths) {
            $scope.selectItem.__refauths = [];
        }
        if ($scope.selectItem.__refauths.sort().toString() == $scope.service.selectItem.__refauths.sort().toString()) {
            return;
        }
        var deleteurl;
        var addurl;
        var url;
        //保存用户组__refgroupids
        addurl = __URL + 'Crmuser/RefusertypeRefauth/add_page_data';
        deleteurl = __URL + 'Crmuser/RefusertypeRefauth/delete_page_data';
        var refdataobj = { obj: '__refauthobj', arr: '__refauths', idname: 'idref_usertype_auth' };
        angular.forEach($scope.selectItem.__refauths, function (value) {
            if (!$scope.service.selectItem.__refauthobj[value]) {
                url = addurl;
                var params = {};
                params['authid'] = value;
                params['utypeid'] = $scope.selectItem.idusertype;
                //保存方法
               
                $scope.saveData(url, params, 0, value,refdataobj);
            }
        });
        angular.forEach($scope.service.selectItem.__refauths, function (value) {
            var params = {};
            if ($scope.selectItem.__refauths.indexOf(value) < 0) {
                if ($scope.selectItem.__refauthobj[value]) {
                    params["idref_usertype_auth"] = $scope.selectItem.__refauthobj[value];
                    url = deleteurl;
                    //保存方法
                    refdataobj.refid = $scope.selectItem.__refauthobj[value];
                    $scope.saveData(url, params, 1, value, refdataobj);
                }
            }
        });
    }
    /*
    保存信息
    */
    $scope.save = function () {

        var params = {};
        if ($scope.Action == 1) {
            params.idusertype = $scope.selectItem.idusertype;
        }
        angular.forEach($scope.selectItem, function (value, key) {
            if (key.indexOf('__') < 0 && value != $scope.selectItem[key]) {
                params[key] = value;
            }
        });       
        if (Object.keys(params).length < 2) {
            //保存用户组与角色关系
            $scope.saveGroup();
            //保存用户权限与角色关系
            $scope.saveAuth();
            //保存用户与角色关系
            $scope.saveUser();
            return;
        }
        $scope.service.postData(__URL + 'Crmuser/Usertype/' + $scope.Action == 0 ? 'add_page_data' : 'edit_page_data', params).then(function (data) {
            switch ($scope.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        parent.layer.msg('添加用户角色失败', { icon: 5 })
                        break;
                    }
                    $scope.selectItem._kid = data;
                    $scope.selectItem.idusertype = data;
                    //更新service数据源
                    dataService.addData('usertypeData', $scope.selectItem);
                    $scope.usertypeModal.close();
                    parent.layer.msg('添加用户角色成功', { icon: 6 });
                case 1:
                    if (data > 0) {
                        //修改成功   
                        $scope.selectItem._kid = $scope.selectItem.idusertype;
                        dataService.updateData('usertypeData', $scope.selectItem);
                        $scope.usertypeModal.close();
                        parent.layer.msg('修改用户角色成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    parent.layer.msg('修改用户角色失败', { icon: 5 });
                    break;
            }
            //保存用户组与角色关系
            $scope.saveGroup();
            //保存用户权限与角色关系
            $scope.saveAuth();
            //保存用户与角色关系
            $scope.saveUser();
        }, function (error) {
            console.log(error);
        });
    };
    //保存到后台的方法
    $scope.saveData = function (url, params, action,refdataobj) {
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                //修改成功  
                if (action == 0) {
                    if (!$scope.selectItem[refdataobj.obj]) {
                        $scope.selectItem[refdataobj.obj] = {};
                    }
                    $scope.selectItem[refdataobj.obj][refdataobj.refid] = data;
                    $scope.selectItem._kid = $scope.selectItem.idusertype;
                    $scope.service.updateData('usertypeData', $scope.selectItem);
                    $scope.service.addData('refusergroupData', { _kid: data, refdataobj['obj']: data, groupid: value, typeid: $scope.selectItem.idusertype });
                    $scope.usertypeModal.close();
                    parent.layer.msg('用户组关系添加成功', { icon: 6 });
                } else {
                    delete $scope.selectItem.__refgroupobj[value];
                    $scope.selectItem._kid = $scope.selectItem.idusertype;
                    $scope.service.updateData('usertypeData', $scope.selectItem);
                    $scope.service.delData('refusergroupData', { _kid: refid, idref_user_group: refid, groupid: value, userid:$scope.selectItem.idusertype });
                    $scope.usertypeModal.close();
                    parent.layer.msg('用户组关系删除成功', { icon: 6 });
                }
                return;
            }
            //修改失败
            parent.layer.msg('用户组关系修改失败', { icon: 5 });

        }, function (error) {
            console.log(error);
        });
    }
}]);
