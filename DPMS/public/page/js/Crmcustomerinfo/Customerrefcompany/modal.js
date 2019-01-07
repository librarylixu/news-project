
//添加编辑客户信息的控制器
appModule.controller('modelCustomerrefcompanyController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;
    if ($scope.service.customerrefcompanyData&&$scope.service.customerrefcompanyData.length != 0) {
        for (i = 0; i < $scope.service.customerrefcompanyData.length; i++) {
            if ($scope.service.idcustomerinfo == $scope.service.customerrefcompanyData[i]['customerid']) {
                //修改操作
                $scope.service.selectItem.idcustomercompany = $scope.service.customerrefcompanyData[i]['idcustomercompany'];
                $scope.service.selectItem.customerpanyPageData = $scope.service.customerrefcompanyData[i];
                break;
            } else {
                //添加操作
                $scope.service.selectItem.customerid = $scope.service.idcustomerinfo;
            }
        }
    } else {
        //添加操作
        $scope.Source.Action = 0;
        $scope.service.selectItem.customerid = $scope.service.idcustomerinfo;
    }

    switch ($scope.Source.Action) {
        case 0: 
            $scope.url += 'Crmcustomerinfo/Customerrefcompany/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customerrefcompany/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customerrefcompany/del_page_data';
            break;
        default:
            alert.show('Action Error!');
            break;
    }
    //页面需要保存或修改的字段
    $scope.columns = ['range', 'brand', 'cusbase', 'business', 'capital', 'turnover', 'buslicense', 'bank', 'Bankaccount', 'landtax', 'tax', 'legalname', 'legalphone', 'legalmphone', 'description'];
    /*
    保存信息
    @cuslevel
    添加本页面得数据时： cuslevel 0一次添加 1连续添加 不关闭窗口
    在添加关系时： checked得属性，true为选中状态和false为为选中状态
    */
    $scope.save = function (cuslevel) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idcustomercompany', $scope.service.selectItem.idcustomercompany);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idcustomercompany', $scope.service.selectItem.idcustomercompany);
            }
            //组建要提交的参数
            for (var i = 0; i < $scope.columns.length; i++) {
                if ($scope.service.selectItem.customerpanyPageData[$scope.columns[i]] != undefined && $scope.service.selectItem.customerpanyPageData[$scope.columns[i]] != null) {
                    //组建传给后台的数据
                    $scope.params.append($scope.columns[i], $scope.service.selectItem.customerpanyPageData[$scope.columns[i]]);
                    
                }
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        alert.show('添加失败', '添加公司信息');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('customerrefcompanyData', {
                        _kid: data,
                        range: $scope.service.selectItem.customerpanyPageData.range,
                        brand: $scope.service.selectItem.customerpanyPageData.brand,
                        cusbase: $scope.service.selectItem.customerpanyPageData.cusbase,
                        business: $scope.service.selectItem.customerpanyPageData.business,
                        capital: $scope.service.selectItem.customerpanyPageData.capital,
                        turnover: $scope.service.selectItem.customerpanyPageData.turnover,
                        buslicense: $scope.service.selectItem.customerpanyPageData.buslicense,
                        bank: $scope.service.selectItem.customerpanyPageData.bank,
                        Bankaccount: $scope.service.selectItem.customerpanyPageData.Bankaccount,
                        landtax: $scope.service.selectItem.customerpanyPageData.landtax,
                        tax: $scope.service.selectItem.customerpanyPageData.tax,
                        legalname: $scope.service.selectItem.customerpanyPageData.legalname,
                        legalphone: $scope.service.selectItem.customerpanyPageData.legalphone,
                        legalmphone: $scope.service.selectItem.customerpanyPageData.legalmphone,
                        description: $scope.service.selectItem.customerpanyPageData.description,
                        labelclass: $scope.service.selectItem.customerpanyPageData.labelclass,
                        del: 0,
                        index: 0,
                        idcustomercompany: data
                    });
                    if (cuslevel == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加公司信息');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加公司信息');
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        dataService.updateData('customerrefcompanyData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改公司信息');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改公司信息');

                    break;
                case 2:
                    //删除
                    if (data >= 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除公司信息');
                        dataService.delData('customerrefcompanyData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除公司信息');
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
