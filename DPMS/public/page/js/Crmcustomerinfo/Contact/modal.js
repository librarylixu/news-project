//添加编辑的控制器
/*
modal+业务+Controller

新增一个字段 _kid 值为当前数据源id的值
*/
appModule.controller('modalContactController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //把自己的用户找到并赋值为选中状态
    if ($scope.Source.Action == 3) {
        //如果refusers没有值所有没有关联则返回
        if ($scope.Source.contactData[$scope.Source.selectItem['idcontact']].refusers != null && $scope.Source.contactData[$scope.Source.selectItem['idcontact']].refusers != '') {
            //将得到的refusers字符串转成数组并进行循环赋值checked
            $scope.Source.useridArr = $scope.Source.contactData[$scope.Source.selectItem['idcontact']].refusers.split(',');
            for (i = 0; i < $scope.Source.useridArr.length; i++) {
                $scope.Source.usersData[$scope.Source.useridArr[i]].checked = true;
            }
        }
    }
    $scope.url = __URL;
    //新增一个字段 _kid 值为当前数据源id的值
    $scope.Source.selectItem._kid = $scope.Source.selectItem.idcontact;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Contact/add_page_data';
            break;
        case 1:  
            $scope.url += 'Crmcustomerinfo/Contact/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Contact/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmcustomerinfo/Contact/update_page_data';
            break;
        default:
            alert.show('Action Error!', 'Error');
            $uibModalInstance.dismiss('cancel');
            break;
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.save = function (status) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 3) {
            //关联用户
            $scope.url = __URL + 'Crmcustomerinfo/Contact/update_page_data';
            $scope.params.append('idcontact', $scope.Source.selectItem.idcontact);
            if (status.checked) {
                if ($scope.service.contactData[$scope.Source.selectItem.idcontact].refusers) {
                    if ($scope.service.contactData[$scope.Source.selectItem.idcontact].refusers.indexOf('null,') != -1) {
                        $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers = $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers.replace('null,', "");
                    }
                    $scope.params.append('refusers', $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers + ',' + status.idusers);
                } else {
                    $scope.params.append('refusers', status.idusers);
                }
            } else {
                //取消勾选
                var index = $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers.split(",").indexOf(status.idusers);
                var user_arr = $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers.split(",");
                user_arr.splice(index, 1);
                $scope.params.append('refusers', user_arr.join(","));
            }
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idcontact', $scope.Source.selectItem.idcontact);
        } else {
            $scope.params.append('name', $scope.Source.selectItem.name);
            if ($scope.Source.Action == 1) {
                //修改,必须传id
                $scope.params.append('idcontact', $scope.Source.selectItem.idcontact);
            }
            if ($scope.Source.selectItem.phone != undefined) {
                $scope.params.append('phone', $scope.Source.selectItem.phone);
            }
            if ($scope.Source.selectItem.mobilephone != undefined) {
                $scope.params.append('mobilephone', $scope.Source.selectItem.mobilephone);
            }
        }

        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        if (Object.prototype.toString.call($scope.service.contactData) == '[object Array]') {
                            $scope.service.contactData = {};
                        }
                        //更新service数据源
                        dataService.addData('contactData', {
                            _kid:data,
                            name: $scope.Source.selectItem.name,
                            del: 0,
                            phone: $scope.Source.selectItem.phone,
                            mobilephone: $scope.Source.selectItem.mobilephone,
                            userid: $scope.service.userid,
                            refusers:$scope.service.userid,
                            idcontact: data
                        });
                       
                        alert.show('添加成功', '添加联系人');
                        if (status != 1) {
                            $uibModalInstance.close('ok');
                        }
                        break;
                    }
                    //添加失败
                    alert.show('添加失败', '添加联系人');
                    break;
                case 1:
                    if (data == 1 || data > 1) {
                        //修改成功
                        dataService.updateData('contactData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改联系人');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改联系人');
                    break;
                case 2:
                    //删除
                    if (data == 1 || data > 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除联系人');
                        dataService.delData('contactData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除联系人');
                    break;
                case 3:
                    //与用户关系添加
                    if (data > 0) {
                        if (status.checked) {
                            //更新service中的关系数据源
                            if ($scope.service.contactData[$scope.Source.selectItem.idcontact].refusers) {
                                $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers = $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers + ',' + status.idusers;
                            } else {
                                $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers = status.idusers;
                            }
                        } else {
                            $scope.service.contactData[$scope.Source.selectItem.idcontact].refusers = user_arr.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加联系人与用户关系');
                    status.checked = !status.checked;
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
        dataService.title = "添加新的用户";
        $scope.modalHtml = __URL + 'Crmuser/Users/openmodal';
        $scope.modalController = 'modalUsersController';
        dataService.Action = 0;
        dataService.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys(dataService.usersData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usersData[key] == undefined) {
                        $scope.Source.usersData[key] = angular.copy(dataService.usersData[key]);
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