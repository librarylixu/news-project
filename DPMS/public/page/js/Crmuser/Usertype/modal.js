//添加编辑用户角色的控制器
appModule.controller('modalUsertypeController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //用户组tree数据临时数据源，中间的大圈
    $scope.tempData = [];
    /*
    组建用户组tree的数据父子之间的关系结构
    */
    $scope.createNewData = function () {
        angular.forEach($scope.Source.usergroupData, function (value, key) {
            var i = value.pid;
            if (i == -1 || i == '0') {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
                //$scope.service.oldusergroupData[i] == undefined  : 此处为了防止找不到pid得情况，从而导致js报错，页面数据丢失
            } else if ($scope.Source.usergroupData[i] == undefined) {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
            } else if ($scope.Source.usergroupData[i].children == undefined) {
                $scope.Source.usergroupData[i].children = [value];
                $scope.Source.usergroupData[i].isParent = true;
            } else {
                $scope.Source.usergroupData[i].children.push(value);
                $scope.Source.usergroupData[i].isParent = true;
            }
        });
        console.log($scope.tempData);
        return $scope.tempData;
    }
    //组件最终的tree数据源
    $scope.service.treedata = $scope.createNewData();
    // //用户组tree数据选中某项
    $scope.showSelected = function (sel) {
        $scope.selectedNode = sel;
        sel.checked = !sel.checked;
        $scope.save($scope.selectedNode);
        console.log($scope.Source.Action);
    };

    //把自己的用户找到并赋值为选中状态
    $scope.selectUser = function () {
        angular.forEach($scope.Source.refuserData, function (value, key) {
            if (value['utypeid'] == $scope.Source.selectItem['idusertype']) {
                if ($scope.Source.usersData[value['userid']]) {
                    $scope.Source.usersData[value['userid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.usersData[value['userid']].idref_user_utype = value['idref_user_utype'];
                }
            }
        });
    }
   
    //把自己的用户组找到并赋值为选中状态
    $scope.selectUsertype = function () {       
        angular.forEach($scope.Source.refusergroupData, function (value, key) {
            if (value['typeid'] == $scope.Source.selectItem['idusertype']) {
                $scope.Source.usergroupData[value['groupid']].checked = true;
                //删除\修改的时候会用到这个字段的
                $scope.Source.usergroupData[value['groupid']].idref_usertype_group = value['idref_usertype_group'];
            }
        });
    }
    //把自己的权限找到并赋值为选中状态
    $scope.selectAuth = function () {
        angular.forEach($scope.Source.refuserauthData, function (value, key) {
            if (value['utypeid'] == $scope.Source.selectItem['idusertype']) {
                if ($scope.Source.authorityData[value['authid']]) {
                    $scope.Source.authorityData[value['authid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.authorityData[value['authid']].idref_utype_auth = value['idref_utype_auth'];
                }
            }
        });
    }

    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmuser/Usertype/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Usertype/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmuser/Usertype/del_page_data';
            break;
        case 3:
            //设置选中状态
            $scope.selectUser();
            $scope.url += 'Crmuser/RefuserRefutype/add_page_data';//添加用户角色与用户关系
            break;
        case 4:
            
            //设置选中状态
            $scope.selectUsertype();
            $scope.url += 'Crmuser/RefusertyRefgroup/add_page_data';//添加用户角色与用户组关系
            break;
        case 5:
            //设置选中状态
            $scope.selectAuth();
            $scope.url += 'Crmuser/RefutypeRefauth/add_page_data';//添加用户角色与权限关系
            break;
        default:
            alert('Action Error!');
            break;
    }
    /*
        $scope.params.append('', '');
        负责给默认值
    */

    $scope.selectGroupItem = 0;
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口 2 删除  
    */
    /*状态*/
    $scope.status = [2,1, 0];
    $scope.save = function (user) {
        $scope.params = new URLSearchParams();
        //添加窗口
        if ($scope.Source.Action == 3) {
            //勾选
            if (user.checked) {
                $scope.url = __URL + 'Crmuser/RefuserRefutype/add_page_data';
                $scope.params.append('userid', user.idusers);
                $scope.params.append('utypeid', $scope.Source.selectItem.idusertype);
            } else {
                //取消勾选
                $scope.params.append("idref_user_utype", user.idref_user_utype);
                $scope.url = __URL + 'Crmuser/RefuserRefutype/delete_page_data';
            }
        } else if ($scope.Source.Action == 4) {
            //勾选
            if (user.checked) {
                $scope.url = __URL + 'Crmuser/RefusertyRefgroup/add_page_data';
                $scope.params.append('groupid', user.idusergroup);
                $scope.params.append('typeid', $scope.Source.selectItem.idusertype);
            } else {
                //取消勾选
                $scope.params.append("idref_usertype_group", user.idref_usertype_group);
                $scope.url = __URL + 'Crmuser/RefusertyRefgroup/del_page_data';
            }
        } else if ($scope.Source.Action == 5) {
            //勾选
            if (user.checked) {
                $scope.url = __URL + 'Crmuser/RefutypeRefauth/add_page_data';
                $scope.params.append('authid', user.idauthority);
                $scope.params.append('utypeid', $scope.Source.selectItem.idusertype);
            } else {
                //取消勾选
                $scope.params.append("idref_utype_auth", user.idref_utype_auth);
                $scope.url = __URL + 'Crmuser/RefutypeRefauth/delete_page_data';
            }
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idusertype', $scope.Source.selectItem.idusertype);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idusertype', $scope.Source.selectItem.idusertype);
            }
            $scope.params.append('typename', $scope.Source.selectItem.typename);
            //此处进行额外判断:是否数据库中有重复得用户
            for (var i = 0; i < $scope.service.usertypeData.length; i++) {
                if ($scope.service.usertypeData[i].typename == $scope.Source.selectItem['typename'] && $scope.Source.Action == 0) {
                    //添加失败,该用户角色以存在
                    alert.show('添加失败,该用户角色[' + $scope.Source.selectItem['typename'] + ']已存在', '添加用户角色');
                    return;
                }
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加用户角色');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('usertypeData', {
                         _kid: data,
                        idusertype: data,
                        typename: $scope.Source.selectItem.typename,
                    });
                    if (user == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加用户角色');
                        break;
                    }
                    alert.show('添加成功', '添加用户角色');
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功 
                        dataService.updateData('usertypeData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改用户角色');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改用户角色');

                    break;
                case 2:
                    //删除
                    if (data > 0) {
                        dataService.delData('usertypeData', dataService.selectItem);
                        alert.show('删除成功', '删除用户角色');
                        $uibModalInstance.close();
                        break;
                    }
                    alert.show('删除失败', '删除用户角色');
                    break;
                case 3:
                    //与用户关系添加
                    if (data > 0) {
                        if (user.checked) {
                            user.idref_user_utype = data;
                            //更新service中的关系数据源
                            $scope.service.refuserData[data] = {
                                idref_user_utype: data,
                                utypeid: $scope.Source.selectItem['idusertype'],
                                userid: user.idusers
                            };
                        } else {
                            delete $scope.service.refuserData[user.idref_user_utype];
                            delete user.idref_user_utype;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户角色与用户关系');
                    user.checked = !user.checked;
                    break;
                case 4:
                    //与用户组关系添加
                    if (data > 0) {
                        if (user.checked) {
                            user.idref_usertype_group = data;
                            //更新service中的关系数据源
                            $scope.service.refusergroupData[data] = {
                                idref_usertype_group: data,
                                typeid: $scope.Source.selectItem['idusertype'],
                                groupid: user.idusergroup
                            };
                        } else {
                            delete $scope.service.refusergroupData[user.idref_usertype_group];
                            delete user.idref_usertype_group;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户角色与用户组关系');
                    user.checked = !user.checked;
                    break;
                case 5:
                    //与权限关系添加
                    if (data > 0) {
                        if (user.checked) {
                            user.idref_utype_auth = data;
                            //更新service中的关系数据源
                            $scope.service.refuserauthData[data] = {
                                idref_utype_auth: data,
                                utypeid: $scope.Source.selectItem['idusertype'],
                                authid: user.idauthority
                            };
                        } else {
                            delete $scope.service.refuserauthData[user.idref_utype_auth];
                            delete user.idref_utype_auth;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户角色与权限关系');
                    user.checked = !user.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    /*
     创建用户--点击事件
     data 成功后得回调、
     关闭模态框会返回'ok'
   */
    $scope.addUserClick = function () {
        $scope.service.title = "添加新的用户";
        $scope.modalHtml = __URL + 'Crmuser/Users/openmodal';
        $scope.modalController = 'modalUsersController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.usersData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usersData[key] == undefined) {
                        $scope.Source.usersData[key] = angular.copy($scope.service.usersData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户组--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUsergroupClick = function (node) {
        $scope.service.selectItem = '';
        $scope.service.title = '新建用户组';
        $scope.modalHtml = __URL + 'Crmuser/Usergroup/openmodal';
        $scope.modalController = 'modalUsergroupController';
        if (node != undefined) {
            $scope.service.selectItem = node;
        }
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {

            }
        });


    }
    /*
   创建权限--点击事件
   data 成功后得回调、
   关闭模态框会返回'ok'
 */
    $scope.addUserauthClick = function () {
        $scope.service.title = '新建权限';
        $scope.modalHtml = __URL + 'Crmuser/Authority/openmodal';
        $scope.modalController = 'modelAuthorityController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.authorityData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.authorityData[key] == undefined) {
                        $scope.Source.authorityData[key] = angular.copy($scope.service.authorityData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
