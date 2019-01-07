//添加编辑的控制器
appModule.controller('modalcustomertypeController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.group = dataService;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Customertype/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customertype/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customertype/del_page_data';
            break;
        default:
            alert.show('Action Error!', 'Error');
            break;
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    $scope.save = function (status) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 1) {
            $scope.params.append('idcustomertype', $scope.Source.selectItem.idcustomertype);
            $scope.params.append('typename', $scope.Source.selectItem.typename);
            $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);

        } else if ($scope.Source.Action == 0) {
            $scope.params.append('typename', $scope.Source.selectItem.typename);
            $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idcustomertype', $scope.Source.selectItem.idcustomertype);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        //更新service数据源
                        dataService.addData("customertypeData", {
                            _kid:data,
                            typename: $scope.Source.selectItem.typename,
                            labelclass: $scope.Source.selectItem.labelclass,
                            del: 0,
                            index: 0,
                            idcustomertype: data
                        });
                        alert.show('添加成功', '添加客户');
                        if (status != 1) {
                            $uibModalInstance.close('ok');
                        }
                        break;
                    }
                    //添加失败
                    alert.show('添加失败', '添加客户类型');
                    break;
                case 1:
                    if (data == 1 || data > 1) {
                        //修改成功            
                        dataService.updateData("customertypeData", $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改客户');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改客户');
                    break;
                case 2:
                    //删除
                    if (data == 1 || data > 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除客户');
                        dataService.delData("customertypeData", dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除客户');
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);