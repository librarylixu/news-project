/*李旭
2018-01-08
账户
*/

//添加编辑账户的控制器
    appModule.controller('modalUsersController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //把自己的角色找到并赋值为选中状态
    angular.forEach($scope.service.refusertypeData, function (value, key) {
        if (value['userid'] == $scope.selectItem['idusers'] && $scope.usertypeData[value['utypeid']] != undefined) {
            $scope.usertypeData[value['utypeid']].checked = true;
            //删除\修改的时候会用到这个字段的
            $scope.usertypeData[value['utypeid']].idref_user_utype = value['idref_user_utype'];
        }
    });
   
    //把自己的组找到并赋值为选中状态
    angular.forEach($scope.refusergroupData, function (value, key) {
        if (value['userid'] == $scope.selectItem['idusers'] && $scope.usergroupData[value['groupid']] != undefined) {
            if (value['groupid'] !== undefined) {
                $scope.usergroupData[value['groupid']].checked = true;
                //删除\修改的时候会用到这个字段的
                $scope.usergroupData[value['groupid']].idref_user_group = value['idref_user_group'];
            } else {
                $scope.usergroupData[value['ugroupid']].checked = true;
                //删除\修改的时候会用到这个字段的
                $scope.usergroupData[value['ugroupid']].idref_customer_ugroup = value['idref_customer_ugroup'];
            }
        }
    });
   
    $scope.url = __URL;
    switch ($scope.Action) {
        case 0:
            $scope.url += 'Crmuser/Users/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Users/update_page_data';
            break;
        case 2:

            $scope.url += 'Crmuser/Users/del_page_data';
            break;
        case 3:

            $scope.url += 'Crmuser/RefutypeRefauth/add_page_data';//添加用户与用户角色关系
            break;
        case 4:

            $scope.url += 'Crmuser/RefuserRefgroup/add_page_data';//添加用户与用户组关系
            break;
        case 5:

            $scope.url += 'Crmuser/RefuserRefappgroup/add_page_data';//添加用户与页面分组关系
            break;
        case 6:

            $scope.url += 'Crmcustomerinfo/RefcusRefuser/add_page_data';//添加用户与客户关系
            break;
        case 9:
            $scope.url += 'Crmproduct/Product/update_page_data';//添加用户与产品关系
            break;
        case 10:
            $scope.url += 'Crmschedule/Workorder/update_page_data';//添加用户与工单关系
            break;
        default:
            alert.show('Action Error!');
            break;
    }
    /*
        $scope.params.append('', '');
        负责给默认值
    */

    $scope.selectGroupItem = 0;
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    /*状态*/
    $scope.usertype = [1, 0];
    
    $scope.columns = ['idusers', 'username', 'pwd', 'phone', 'mail', 'mobelphone', 'emergencyphone', 'emergencyphone', 'description', 'homeaddress'];
    $scope.save = function (usertype) {      
        $scope.params = {};
        if ($scope.Action == 3) {
            //勾选
            if (usertype.checked) {
                $scope.url = __URL + 'Crmuser/RefuserRefutype/add_page_data';
                $scope.params.append('utypeid', usertype.idusertype);
                $scope.params.append('userid', $scope.selectItem.idusers);
            } else {
                //取消勾选
                $scope.params.append("idref_user_utype", usertype.idref_user_utype);
                $scope.url = __URL + 'Crmuser/RefuserRefutype/del_page_data';
            }
        } else if ($scope.Action == 4) {
            //勾选
            if (usertype.checked) {
                $scope.url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                $scope.params.append('groupid', usertype.idusergroup);
                $scope.params.append('userid', $scope.selectItem.idusers);
            } else {
                //取消勾选
                $scope.params.append("idref_user_group", usertype.idref_user_group);
                $scope.url = __URL + 'Crmuser/RefuserRefgroup/del_page_data';
            }
        }else {
            if ($scope.selectItem['pwd'] == '') {
                delete $scope.selectItem['pwd'];
            }
            //组建要提交的参数
            for (var i = 0; i < $scope.columns.length; i++) {
                if ($scope.selectItem[$scope.columns[i]] != undefined && $scope.selectItem[$scope.columns[i]] != null) {
                    //组建传给后台的数据
                    $scope.params.append($scope.columns[i], $scope.selectItem[$scope.columns[i]]);
                    //组建更新参数数据
                    newdata[$scope.columns[i]] = $scope.selectItem[$scope.columns[i]];
                }
            }
            //此处进行额外判断:是否数据库中有重复得用户
            for (var i = 0; i < $scope.service.usersData.length; i++) {
                if ($scope.service.usersData[i].username == $scope.selectItem['username'] && $scope.Action == 0) {
                    //添加失败,该用户以存在
                    alert.show('添加失败,该用户[' + $scope.selectItem['username'] + ']已存在', '添加账号');
                    return;
                }
            }
        }
        $scope.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加账号');
                        break;
                    }
                    newdata.idusers = data;
                    newdata. _kid= data,
                    newdata.createtime = new Date();
                    newdata.lastlogintime = 0;
                    newdata.updatepwdtime = 0;
                    //更新service数据源
                    dataService.addData('usersData',newdata );
                    if (usertype==0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加账号');
                        break;
                    } else if (usertype == 1) {
                        alert.show('添加成功', '添加账号');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData('usersData', $scope.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改账号');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改账号');

                    break;
                case 2:
                    //删除
                    if (data > 0) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除账号');
                        dataService.delData('usersData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除账号');
                    break;
                case 3:
                    //与用户关系添加
                    if (data > 0) {
                        if (usertype.checked) {
                            usertype.idref_user_utype = data;
                            //更新service中的关系数据源
                            $scope.service.refusertypeData[data] = {
                                idref_user_utype: data,
                                userid: $scope.selectItem['idusers'],
                                utypeid: usertype.idusertype
                            };
                        } else {
                            delete $scope.service.refusertypeData[usertype.idref_user_utype];
                            delete usertype.idref_user_utype;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加账号与用户角色关系');
                    usertype.checked = !usertype.checked;
                    break;
                case 4:
                    //与用户组关系添加
                    if (data > 0) {
                        if (usertype.checked) {
                            usertype.idref_user_group = data;
                            //更新service中的关系数据源
                            $scope.service.refusergroupData[data] = {
                                idref_user_group: data,
                                userid: $scope.selectItem['idusers'],
                                groupid: usertype.idusergroup
                            };
                        } else {
                            delete $scope.service.refusergroupData[usertype.idref_user_group];
                            delete usertype.idref_user_group;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加账号与用户组关系');
                    usertype.checked = !usertype.checked;
                    break;
                case 6:
                    //与客户关系添加
                    if (data > 0) {
                        if (usertype.checked) {
                            usertype.idref_customer_user = data;
                            //更新service中的关系数据源
                            $scope.service.refcustomerinfoData[data] = {
                                idref_customer_user: data,
                                userid: $scope.selectItem['idusers'],
                                cusid: usertype.idcustomerinfo
                            };
                        } else {
                            delete $scope.service.refcustomerinfoData[usertype.idref_customer_user];
                            delete usertype.idref_customer_user;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加账号与客户关系');
                    usertype.checked = !usertype.checked;
                    break;
                case 9:
                    //关联产品
                    if (data > 0) {
                        if (usertype.checked) {
                            //更新Source中的关系数据源
                            $scope.service.productData[usertype.idproduct].refusers = usertype.refusers + ',' + $scope.selectItem.idusers;
                        } else {
                            $scope.service.productData[usertype.idproduct].refusers = productrefuser.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户与产品关系');
                    status.checked = !usertype.checked;
                    break;
                case 10:
                    //与工单关系添加
                    if (data > 0) {
                        if (usertype.checked) {
                            //更新Source中的关系数据源
                            $scope.service.workorderData[usertype.idworkorder].refusers = usertype.refusers + ',' + $scope.selectItem.idusers;
                        } else {
                            $scope.service.workorderData[usertype.idworkorder].refusers = workorderrefuser.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加账号与工单关系');
                    usertype.checked = !usertype.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
        /*
     创建新用户角色--点击事件
     data 成功后得回调、
     关闭模态框会返回'ok'
    */
    $scope.addUsertypeClick = function () {
        $scope.service.title = '新建用户角色';
        $scope.modalHtml = __URL + 'Crmuser/Usertype/openmodal';
        $scope.modalController = 'modalUsertypeController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.crmusertypeData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.crmusertypeData[key] == undefined) {
                        $scope.crmusertypeData[key] = angular.copy($scope.service.crmusertypeData[key]);
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
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);