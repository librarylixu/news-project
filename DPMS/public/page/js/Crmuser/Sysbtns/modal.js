/*张赛
2018-01-08
按钮管理
*/

//添加编辑权限的控制器
appModule.controller('modalSysbtnsController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.group = dataService;
    //控制账号输入框的只读性
    $scope.readonly = true;
    if (dataService.Action == 0 || dataService.Action == 1) {
        $scope.readonly = false;

    }
       
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmuser/Sysbtns/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmuser/Sysbtns/update_page_data';
            break;
        case 2:

            $scope.url += 'Crmuser/Sysbtns/del_page_data';
            break;       
        default:
            alert('Action Error!');
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
    $scope.save = function (usertype) {
        $scope.params = new URLSearchParams();
       if ($scope.Source.Action == 2) {
           $scope.params.append('idsysbtns', $scope.Source.selectItem.idsysbtns);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idsysbtns', $scope.Source.selectItem.idsysbtns);
            }
            $scope.params.append('bname', $scope.Source.selectItem.bname);
            $scope.params.append('content', $scope.Source.selectItem.content);
           
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
                    dataService.addData('sysbtnsData',$scope.Source.selectItem);
                    if (status == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加权限');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData("sysbtnsData", $scope.Source.selectItem);
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
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除权限');
                        dataService.delData('sysbtnsData',dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除权限');
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