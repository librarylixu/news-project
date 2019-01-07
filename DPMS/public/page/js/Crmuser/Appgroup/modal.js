//添加编辑页面分组的控制器
appModule.controller('modelAppgroupController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmuser/Appgroup/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Appgroup/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmuser/Appgroup/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmuser/RefmenuRefbtn/add_page_data';//添加权限与用户角色关系
            //把自己的按钮找到并赋值为选中状态
            angular.forEach($scope.Source.refappData, function (value, key) {
                if (value['groupid'] == $scope.Source.selectItem['idappgroup']) {
                    $scope.Source.appinfoData[value['appid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.appinfoData[value['appid']].idref_appgroup_app = value['idref_appgroup_app'];
                }
            });
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
        if ($scope.Source.Action == 2) {
            $scope.params.append('idappgroup', $scope.Source.selectItem.idappgroup);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idappgroup', $scope.Source.selectItem.idappgroup);
            }
            $scope.params.append('appgroupname', $scope.Source.selectItem.appgroupname); 
            $scope.params.append('imagesrc', $scope.Source.selectItem.imagesrc);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加页面分组');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('appgroupData', {
                        _kid: data,
                        idappgroup: data,
                        appgroupname: $scope.Source.selectItem.appgroupname,
                        imagesrc: $scope.Source.selectItem.imagesrc,
                        del: 0,
                        index: 0,
                        labelclass: $scope.Source.selectItem.labelclass,
                    });
                    if (user == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加页面分组');
                        break;
                    }
                    alert.show('添加成功', '添加页面分组');
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData('appgroupData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改页面分组');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改页面分组');

                    break;
                case 2:
                    //删除
                    if (data > 0) {
                        dataService.delData('appgroupData', dataService.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除页面分组');
                        break;
                    }
                    alert.show('删除失败', '删除页面分组');
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.Refapp = function (app) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 3) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (app.checked) {
            $scope.url = __URL + 'Crmuser/RefappgroupRefapp/add_page_data';
            $scope.params.append('appid', app.idappinfo);
            $scope.params.append('groupid', $scope.Source.selectItem.idappgroup);
        } else {
            //取消勾选
            $scope.params.append("idref_appgroup_app", app.idref_appgroup_app);
            $scope.url = __URL + 'Crmuser/RefappgroupRefapp/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data > 0) {
                //alert.show('关系添加成功', '添加页面分组与页面关系');
                if (app.checked) {
                    //给复选框赋值,否则将无法删除
                    app.idref_appgroup_app = data;
                    //更新service中的关系数据源
                    $scope.service.refappData[data] = {
                        idref_appgroup_app: data,
                        groupid: $scope.Source.selectItem['idappgroup'],
                        appid: app.idappinfo,
                    };
                } else {
                    delete $scope.service.refappData[app.idref_appgroup_app];
                    delete app.idref_appgroup_app;
                }
            } else {
                alert.show('关系添加失败', '添加页面分组与页面关系');
                app.checked = !app.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }

    /*
      创建新页面--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
  */
    $scope.addPageClick = function () {
        $scope.service.title = "添加新的页面";
        $scope.modalHtml = __URL + 'Crmuser/Appinfo/openmodal';
        $scope.modalController = 'modelAppinfoController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.appinfoData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.appinfoData[key] == undefined) {
                        $scope.Source.appinfoData[key] = angular.copy($scope.service.appinfoData[key]);
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