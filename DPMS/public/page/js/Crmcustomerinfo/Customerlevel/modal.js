
//添加编辑权限的控制器
appModule.controller('modalCustomerlevelController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Customerlevel/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customerlevel/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customerlevel/del_page_data';
            break;
        default:
            alert.show('Action Error!');
            break;
    }
    /*
    保存信息
    @cuslevel
    添加本页面得数据时： cuslevel 0一次添加 1连续添加 不关闭窗口
    在添加关系时： checked得属性，true为选中状态和false为为选中状态
    */
    $scope.save = function (cuslevel) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idcustomerlevel', $scope.Source.selectItem.idcustomerlevel);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idcustomerlevel', $scope.Source.selectItem.idcustomerlevel);
            }
            //
            $scope.params.append('levelname', $scope.Source.selectItem.levelname);
            $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        alert.show('添加失败', '添加等级');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('customerlevelData', {
                        _kid: data,
                        levelname: $scope.Source.selectItem.levelname,
                        labelclass:$scope.Source.selectItem.labelclass,
                        del: 0,
                        index: 0,
                        idcustomerlevel: data
                    });
                    if (cuslevel == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加等级');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加等级');
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        dataService.updateData('customerlevelData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改等级');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改等级');

                    break;
                case 2:
                    //删除
                    if (data >= 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除等级');
                        dataService.delData('customerlevelData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除等级');
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
