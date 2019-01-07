/*张赛
2018-01-03
客户信誉
*/

//添加编辑删除的控制器
appModule.controller('modalCustomercreditController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;    
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Customercredit/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customercredit/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customercredit/del_page_data';
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
           $scope.params.append('idcustomercredit', $scope.Source.selectItem.idcustomercredit);
       }
      $scope.params.append('name', $scope.Source.selectItem.name);
      $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加信誉');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('customercreditData', {
                        _kid: data,
                        name: $scope.Source.selectItem.name,
                        labelclass: $scope.Source.selectItem.labelclass,
                        del: 0,
                        index:0,
                        idcustomercredit: data
                    });
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加信誉');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加信誉');
                    break;
                case 1:
                    if (data >= 0) {
                        //修改成功                        
                        dataService.updateData('customercreditData',$scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改信誉');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改信誉');

                    break;
                case 2:
                    //删除
                    if (data >= 0) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除信誉');
                        dataService.delData('customercreditData',dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除信誉');
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
