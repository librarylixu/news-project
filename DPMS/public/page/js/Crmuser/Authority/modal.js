//添加编辑权限的控制器
appModule.controller('modelAuthorityController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;

    //把自己的用户找到并赋值为选中状态
    angular.forEach($scope.Source.refusertypeData, function (value, key) {
        if (value['authid'] == $scope.Source.selectItem['idauthority']) {
            $scope.Source.usertypeData[value['utypeid']].checked = true;
            //删除\修改的时候会用到这个字段的
            $scope.Source.usertypeData[value['utypeid']].idref_utype_auth = value['idref_utype_auth'];
        }
    });
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmuser/Authority/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Authority/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmuser/Authority/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmuser/RefutypeRefauth/add_page_data';//添加权限与用户角色关系
            break;
        case 4:
            $scope.url += 'Crmuser/RefauthRefapp/add_page_data';//添加权限与页面关系   *************  页面展示还没确定等确定好在做
            break;
        default:
            alert('Action Error!');
            break;
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.save = function (user) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 3) {
            //勾选
            if (user.checked) {
                $scope.url = __URL + 'Crmuser/RefutypeRefauth/add_page_data';
                $scope.params.append('utypeid', user.idusertype);
                $scope.params.append('authid', $scope.Source.selectItem.idauthority);
            } else {
                //取消勾选
                $scope.params.append("idref_utype_auth", user.idref_utype_auth);
                $scope.url = __URL + 'Crmuser/RefutypeRefauth/del_page_data';
            }
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idauthority', $scope.Source.selectItem.idauthority);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idauthority', $scope.Source.selectItem.idauthority);
            }
            $scope.params.append('authname', $scope.Source.selectItem.authname);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加权限');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('authorityData', {
                        idauthority: data,
                        authname: $scope.Source.selectItem.authname,
                        del: 0,
                    });
                    if (user == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加权限');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加权限');
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData('authorityData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改权限');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改权限');

                    break;
                case 2:
                    //删除
                    if (data > 0) {
                        dataService.delData('authorityData', dataService.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除权限');
                        break;
                    }
                    alert.show('删除失败', '删除权限');
                    break;
                case 3:
                    //与用户关系添加
                    if (data > 0) {
                        if (user.checked) {
                            user.idref_utype_auth = data;
                            //更新service中的关系数据源
                            $scope.service.refusertypeData[data] = {
                                idref_utype_auth: data,
                                authid: $scope.Source.selectItem['idauthority'],
                                utypeid: user.idusertype
                            };
                        } else {
                            delete $scope.service.refusertypeData[user.idref_utype_auth];
                            delete user.idref_utype_auth;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加权限与用户角色关系');
                    user.checked = !user.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    $scope.saveAppinfo = function () {
        $scope.service.postData(__URL + 'Crmuser/Appinfo/select_page_data', {}).then(function (data) {
            $scope.service.appinfoData = data;          
        }, function (error) {
            console.log(error);
        });
    }
    /*
      创建新权限--点击事件
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
                var tempKeys = Object.keys($scope.service.usertypeData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usertypeData[key] == undefined) {
                        $scope.Source.usertypeData[key] = angular.copy($scope.service.usertypeData[key]);
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
    $scope.saveAppinfo();
}]);