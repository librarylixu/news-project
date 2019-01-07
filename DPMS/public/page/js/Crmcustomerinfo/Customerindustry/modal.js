
//添加编辑行业的控制器
appModule.controller('modelCustomerindustryController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
   $scope.service = dataService;
    //把自己的角色找到并赋值为选中状态
    angular.forEach($scope.Source.refusertypeData, function (value, key) {
        if (value['userid'] == $scope.Source.selectItem['idusers']) {
            $scope.Source.usertypeData[value['utypeid']].checked = true;
            //删除\修改的时候会用到这个字段的
            $scope.Source.usertypeData[value['utypeid']].idref_user_utype = value['idref_user_utype'];
        }
    });
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Customerindustry/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customerindustry/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customerindustry/del_page_data';
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
    $scope.cusindustry = [1, 0];
    $scope.save = function (cusindustry) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idcustomerindustry', $scope.Source.selectItem.idcustomerindustry);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idcustomerindustry', $scope.Source.selectItem.idcustomerindustry);                
            }
            $scope.params.append('industryname', $scope.Source.selectItem.industryname);
            $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        alert.show('添加失败', '添加行业');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('customerindustryData', {
                        _kid: data,
                        industryname: $scope.Source.selectItem.industryname,
                        del: 0,
                        index: 0,
                        idcustomerindustry: data,
                        labelclass: $scope.Source.selectItem.labelclass
                    });
                   
                    if (cusindustry == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加行业');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加行业');
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        dataService.updateData('customerindustryData',$scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改行业');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改行业');

                    break;
                case 2:
                    //删除
                    if (data == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除行业');
                        dataService.delData('customerindustryData',dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除行业');
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
