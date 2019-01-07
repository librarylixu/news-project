//添加编辑权限的控制器
appModule.controller('modelAppinfoController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmuser/Appinfo/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Appinfo/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmuser/Appinfo/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmuser/RefmenuRefbtn/add_page_data';//添加权限与用户角色关系
            //把自己的按钮找到并赋值为选中状态
            angular.forEach($scope.Source.refbtnsData, function (value, key) {
                if (value['appid'] == $scope.Source.selectItem['idappinfo']) {
                    $scope.Source.btnsData[value['btnid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.btnsData[value['btnid']].idref_menu_btn = value['idref_menu_btn'];
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
        var reg = new RegExp("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");//网址格式
                   
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idappinfo', $scope.Source.selectItem.idappinfo);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idappinfo', $scope.Source.selectItem.idappinfo);
            }
            //添加时做判断，防止没传时会存'undefined'
            if ($scope.Source.selectItem.module != undefined && reg.test($scope.Source.selectItem.module)) {
                $scope.params.append('module', $scope.Source.selectItem.module);
            } else if ($scope.Source.selectItem.module != undefined && !reg.test($scope.Source.selectItem.module)) { 
                $scope.Source.selectItem.module='/index.php/' +$scope.Source.selectItem.module;
                $scope.params.append('module', $scope.Source.selectItem.module);
            }
            if ($scope.Source.selectItem.controller != undefined) {
                $scope.params.append('controller', $scope.Source.selectItem.controller);
            }
            if ($scope.Source.selectItem.function != undefined) {
                $scope.params.append('function', $scope.Source.selectItem.function);
            }
            if ($scope.Source.selectItem.image != undefined) {
                $scope.params.append('image', $scope.Source.selectItem.image);
            }
            if ($scope.Source.selectItem.name != undefined) {
                $scope.params.append('name', $scope.Source.selectItem.name);
            }
            if ($scope.Source.selectItem.description != undefined) {
                $scope.params.append('description', $scope.Source.selectItem.description);
            }
            if ($scope.Source.selectItem.apptitle != undefined) {
                $scope.params.append('apptitle', $scope.Source.selectItem.apptitle);
            }
            if ($scope.Source.selectItem.appclass != undefined) {
                $scope.params.append('appclass', $scope.Source.selectItem.appclass);
            }
            if ($scope.Source.selectItem.opentype != undefined) { 
                $scope.params.append('opentype', $scope.Source.selectItem.opentype);
            }
            if ($scope.Source.selectItem.appinfindex != undefined) {
                $scope.params.append('appinfindex', $scope.Source.selectItem.appinfindex);
            }
            if ($scope.Source.selectItem.isshowurl != undefined) {
                $scope.params.append('isshowurl', $scope.Source.selectItem.isshowurl);
            }
            if ($scope.Source.selectItem.background != undefined) {
                $scope.params.append('background', $scope.Source.selectItem.background);
            }
            if ($scope.Source.selectItem.icontype != undefined) {
                $scope.params.append('icontype', $scope.Source.selectItem.icontype);
            }
            if ($scope.Source.selectItem.plugin != undefined) {
                $scope.params.append('plugin', $scope.Source.selectItem.plugin);
            }
            if ($scope.Source.selectItem.resizable != undefined) {
                $scope.params.append('resizable', $scope.Source.selectItem.resizable);
            }
            if ($scope.Source.selectItem.single != undefined) {
                $scope.params.append('single', $scope.Source.selectItem.single);
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加页面');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('appinfoData', {
                        _kid: data,
                        idappinfo: data,
                        module: $scope.Source.selectItem.module,
                        controller: $scope.Source.selectItem.controller,
                        "function": $scope.Source.selectItem.function,
                        image: $scope.Source.selectItem.image,
                        opentype: $scope.Source.selectItem.opentype,
                        name: $scope.Source.selectItem.name,
                        description: $scope.Source.selectItem.description,
                        apptitle: $scope.Source.selectItem.apptitle,
                        appclass: $scope.Source.selectItem.appclass,
                        del: 0,
                        index: 0,
                    });
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加页面');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData('appinfoData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改页面');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改页面');

                    break;
                case 2:
                    //删除
                    if (data > 0) {
                        dataService.delData('appinfoData', dataService.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除页面');
                        break;
                    }
                    alert.show('删除失败', '删除页面');
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.Refbtns = function (btns) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 3) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (btns.checked) {
            $scope.url = __URL + 'Crmuser/RefmenuRefbtn/add_page_data';
            $scope.params.append('btnid', btns.idsys_btns);
            $scope.params.append('appid', $scope.Source.selectItem.idappinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_menu_btn", btns.idref_menu_btn);
            $scope.url = __URL + 'Crmuser/RefmenuRefbtn/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data > 0) {
                //alert.show('关系添加成功', '添加客户与联系人关系');
                if (btns.checked) {
                    //给复选框赋值,否则将无法删除
                    btns.idref_menu_btn = data;
                    //更新service中的关系数据源
                    $scope.service.refbtnsData[data] = {
                        idref_menu_btn: data,
                        appid: $scope.Source.selectItem['idappinfo'],
                        btnid: btns.idsys_btns,
                        index: 0
                    };
                } else {
                    delete $scope.service.refbtnsData[btns.idref_menu_btn];
                    delete btns.idref_menu_btn;
                }
            } else {
                alert.show('关系添加失败', '添加客户与联系人关系');
                btns.checked = !btns.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }

    /*
      创建新权限--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
  */
    $scope.addAuthClick = function () {
        $scope.service.title = "添加新的权限";
        $scope.modalHtml = __URL + 'Crmcustomeruser/Appinfo/openmodal';
        $scope.modalController = 'modalAppinfoController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.appinfoData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.contactData[key] == undefined) {
                        $scope.Source.contactData[key] = angular.copy($scope.service.contactData[key]);
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