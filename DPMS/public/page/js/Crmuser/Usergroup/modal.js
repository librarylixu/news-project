/*李旭
2018-01-08
用户组
*/

//添加编辑用户组的控制器
appModule.controller('modalUsergroupController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.selectGroupItem = 0;
    //需要传给页面数据更新的参数
    var newdata = {};

    //查找父级组并选中
    $scope.findParent = function (_data, node,_id) {
        //查找父级，并选中
        for (var i = 0; i < _data.length; i++) {

            _data[i].checked = false;            
            
            if (_data[i].idusergroup == _id) {
                _data[i].checked = true;
                return ;

            } else if (_data[i].children && _data[i].children.length > 0) {
                $scope.findParent(_data[i].children, node,_id);
            }
        }


    }
    //查找父级,并更新數據源
    $scope.findParentdata = function (_data, node, _id) {
        //查找父级，并选中
        for (var i = 0; i < _data.length; i++) {
            if (_data[i].idusergroup == _id) {
                if (_data[i].children !== undefined && _data[i].children !== null) {
                    _data[i].children.push(node);
                } else {
                    _data[i].children = [node];
                  }
                return ;

            } else if (_data[i].children && _data[i].children.length > 0) {
                $scope.findParent(_data[i].children, node, _id);
            }
        }


    }
    //把自己的角色找到并赋值为选中状态
    $scope.selectUsertype = function () {
        angular.forEach($scope.Source.refusertypeData, function (value, key) {
            if (value['groupid'] == $scope.Source.selectItem['idusergroup']) {
                $scope.Source.usertypeData[value['typeid']].checked = true;
                //删除\修改的时候会用到这个字段的
                $scope.Source.usertypeData[value['typeid']].idref_usertype_group = value['idref_usertype_group'];
            }
        });
    }
    //用户选择状态
    $scope.selectuser = function () {
        //把自己的用户找到并赋值为选中状态
        $scope.Source.selectItem.usersData = [];//选中项
        angular.forEach($scope.Source.refuserData, function (value, key) {
            if (value['groupid'] == $scope.Source.selectItem['idusergroup']) {
                $scope.Source.selectItem.usersData.push($scope.Source.usersData[value.userid]);
                //删除\修改的时候会用到这个字段的
                if ($scope.Source.usersData[value['userid']]) {
                    $scope.Source.usersData[value['userid']].idref_user_group = value['idref_user_group'];
                }
            }
        });
    }

    //选中某项
    $scope.showSelected = function (sel) {      
        sel.checked = !sel.checked;
        $scope.selectGroupItem = sel;
    };

    $scope.url = __URL + 'Crmuser/';
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Usergroup/add_page_data';
            if ($scope.Source.selectItem) {
                $scope.Source.selectItem.groupname += '---子集组';
                //生不带来----论checked属性的一生
                $scope.findParent($scope.Source.treedata, $scope.Source.selectItem, $scope.Source.selectItem.idusergroup);
                $scope.selectGroupItem = $scope.Source.selectItem;
            }
            break;
        case 1:
            $scope.url += 'Usergroup/update_page_data';
            //生不带来----论checked属性的一生
            $scope.findParent($scope.Source.treedata, $scope.Source.selectItem, $scope.Source.selectItem.pid);
            $scope.selectGroupItem = $scope.Source.selectItem;
            break;
        case 2:
            $scope.url += 'Usergroup/del_page_data';
           
            break;
        case 3:
            //选中状态
            $scope.selectUsertype();
            $scope.url += 'RefuserRefutype/add_page_data';//添加用户组与用户角色的关系

            break; 
        case 4:
            //选中状态
            $scope.selectuser();
          //  $scope.url += 'RefuserRefutype/add_page_data';//添加用户组与用户角色的关系

            break;
        default:
            alert.show('Action Error!');
            break;
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口 2删除  3 用户和用户角色cheked改变状态保存
    */
    /*状态*/
    $scope.status = [0,1,2,3];
    $scope.save = function (status,refdata) {


        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idusergroup', $scope.Source.selectItem.idusergroup);
            $scope.params.append('pid', $scope.Source.selectItem.idusergroup);
            $scope.params.append('$or', true);
        } else if ($scope.Source.Action == 0 || $scope.Source.Action==1) {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idusergroup', $scope.Source.selectItem.idusergroup);
            }
            $scope.params.append('groupname', $scope.Source.selectItem.groupname);
            if ($scope.Source.Action == 0) {
                $scope.params.append('pid', $scope.selectGroupItem.idusergroup);
                $scope.params.append('level', parseInt($scope.selectGroupItem.level) + 1);
                $scope.Source.selectItem.pid = $scope.selectGroupItem.idusergroup;
                $scope.Source.selectItem.level = parseInt($scope.selectGroupItem.level) + 1;
            } else if ($scope.Source.Action == 1) {
                $scope.params.append('pid', $scope.selectGroupItem.pid);
                $scope.params.append('level', parseInt($scope.selectGroupItem.level));
                $scope.Source.selectItem.pid = $scope.selectGroupItem.pid;
                $scope.Source.selectItem.level = parseInt($scope.selectGroupItem.level);
            }
        } else if ($scope.Source.Action == 3) {//保存用户角色关系
            //勾选
            if (refdata.checked) {
                $scope.url = __URL + 'Crmuser/RefusertyRefgroup/add_page_data';
                $scope.params.append('groupid', $scope.Source.selectItem.idusergroup); 
                $scope.params.append('typeid', refdata.idusertype);
            } else {
                //取消勾选
                $scope.params.append("idref_usertype_group",refdata.idref_usertype_group);
                $scope.url = __URL + 'Crmuser/RefusertyRefgroup/del_page_data';
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加用户组');
                        break;
                    }
                    //死不带去----论checked属性的一生
                    $scope.Source.selectItem.checked = false;
                    $scope.Source.selectItem = data;
                   
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                       
                        alert.show('添加成功', '添加用户组');
                        break;
                    }else{
                        $scope.Source.selectItem.groupname = $scope.service.selectItem.groupname;
                        alert.show('添加成功', '添加用户组');
                    }
                   
                    //更新service数据源 
                     $scope.findParentdata($scope.service.treedata, $scope.Source.selectItem, $scope.selectGroupItem.idusergroup);
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功
                        //死不带去----论checked属性的一生
                        $scope.Source.selectItem.checked = false;
                        if ($scope.Source.selectItem.pid == 0) {
                            dataService.updateData('treedata', $scope.Source.selectItem);
                        } else {
                            //当编辑完成后，当前组父级发生了改变，就把原来组的当前组删掉，然后添加当前组到新的父级组
                            angular.forEach($scope.service.treedata, function (val, k) {
                                if (val.children == undefined || val.children == null) {
                                    val.children = [];
                                }
                                //原来组的当前组删掉
                                if (val.idusergroup == $scope.service.selectItem.pid && val.children !== undefined) {
                                    removeByValue(val.children, $scope.service.selectItem);
                                }
                                //添加当前组到新的父级组
                                if (val.idusergroup == $scope.Source.selectItem.pid && val.children !== undefined) {
                                   
                                    val.children.push($scope.Source.selectItem);
                                }
                            });
                        }
                        
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改用户组');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改用户组');
                    break;
                case 2:
                    //删除
                    if (data > 0) {
                       
                        if ($scope.Source.selectItem.pid == 0) {
                           
                            dataService.delData('treedata', $scope.service.selectItem);
                        } else {
                            angular.forEach($scope.service.treedata, function (val, k) {
                                if (val.idusergroup == $scope.service.selectItem.pid && val.children !== undefined) {
                                    removeByValue(val.children, $scope.service.selectItem);
                                }
                            });
                        }
                       
                        
                        alert.show('删除成功', '删除用户组');
                        $uibModalInstance.close();
                        break;
                    }
                  
                    alert.show('删除失败', '删除用户组');
                    break;
                    break;
                case 3:
                    //与用户角色关系添加
                    if (data > 0) {
                        if (refdata.checked) {
                            refdata.idref_user_utype = data;
                            //更新service中的关系数据源
                            $scope.service.refuserData[data] = {
                                idref_user_utype: data,
                                utypeid: $scope.Source.selectItem['idusertype'],
                                userid: refdata.idusers
                            };
                        } else {
                            delete $scope.service.refusertypeData[refdata.idref_user_utype];
                            delete refdata.idref_user_utype;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户角色与用户关系');
                    refdata.checked = !refdata.checked;
                    break;
                case 4:
                    //与用户关系添加
                    if (data > 0) {
                        if (refdata.checked) {
                            refdata.idref_user_utype = data;
                            //更新service中的关系数据源
                            $scope.service.refuserData[data] = {
                                idref_user_utype: data,
                                utypeid: $scope.Source.selectItem['idusertype'],
                                userid: refdata.idusers
                            };
                        } else {
                            delete $scope.service.refuserData[refdata.idref_user_utype];
                            delete refdata.idref_user_utype;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加用户角色与用户关系');
                    refdata.checked = !refdata.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };

    /*
       保存关联用户
       refdata:当前操作的数据，action:1勾选，0取消勾选
      */
    $scope.save_refuser = function (refdata, action) {
        $scope.params = new URLSearchParams();
        var url;
        if ($scope.Source.Action == 3) {//保存用户关系
            //勾选
            if (action == 1) {
                url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                $scope.params.append('groupid', $scope.Source.selectItem.idusergroup);
                $scope.params.append('userid', refdata.idusers);
            } else {
                //取消勾选
                $scope.params.append("idref_user_group", refdata.idref_user_group);
                url = __URL + 'Crmuser/RefuserRefgroup/del_page_data';
            }
        }
        $scope.Source.postData(url, $scope.params).then(function (data) {
            //与用户关系添加
            if (data > 0) {
                if (!$scope.service.selectItem.userCount) {
                    $scope.service.selectItem.userCount = 1;
                }
                if (action) {
                    refdata.idref_user_utype = data;
                    //更新service中的关系数据源
                    $scope.service.refuserData[data] = {
                        idref_user_utype: data,
                        utypeid: $scope.Source.selectItem['idusertype'],
                        userid: refdata.idusers
                    };
                    $scope.service.selectItem.userCount++;
                } else {
                    delete $scope.service.refuserData[refdata.idref_user_utype];
                    delete refdata.idref_user_utype;
                    $scope.service.selectItem.userCount--;
                }
                return;
            }

            alert.show('关系添加失败', '添加用户组与用户关系');
            //refdata.checked = !refdata.checked;
            if (action) {
                var index = $scope.Source.selectItem.usersData.indexOf(refdata);
                if (index >= 0) {
                    $scope.Source.selectItem.usersData.split(index, 1);
                }

            } else {
                $scope.Source.selectItem.usersData.push(refdata);
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
                    if ($scope.Source.crmusertypeData[key] == undefined) {
                        $scope.Source.crmusertypeData[key] = angular.copy($scope.service.crmusertypeData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }

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
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);