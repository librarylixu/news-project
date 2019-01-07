//张赛
//2018-02-01
//项目状态

//添加编辑删除的控制器
appModule.controller('modalProjectstatusController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.group = dataService;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmproject/Projectstatus/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmproject/Projectstatus/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmproject/Projectstatus/del_page_data';
            break;
        default:
            alert('Action Error!');
            break;
    }
    /*
        $scope.params.append('', '');
        负责给默认值
    */

    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    */
    /*状态*/
    $scope.status = [1, 0];
    $scope.save = function (status) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 1) {
            //如果是修改信息，就需要传id
            $scope.params.append('idprojectstatus', $scope.Source.selectItem.idprojectstatus);
        }
        $scope.params.append('name', $scope.Source.selectItem.name);
        $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加状态');
                        break;
                    }
                    //更新service数据源

                    dataService.addData('projectstatusData', {
                        _kid: data,
                        name: $scope.Source.selectItem.name,
                        labelclass: $scope.Source.selectItem.labelclass,
                        del: 0,
                        index: 0,
                        idprojectstatus: data
                    });

                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加状态');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加状态');
                    break;
                case 1:
                    if (data >= 0) {
                        //修改成功                        
                        dataService.updateData('projectstatusData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改状态');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改状态');

                    break;
                case 2:
                    //删除
                    if (data >= 0) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除状态');
                        dataService.delData('projectstatusData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除状态');
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





