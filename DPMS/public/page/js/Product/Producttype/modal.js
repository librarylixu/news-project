
//添加编辑权限的控制器
appModule.controller('modelProducttypeController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
   $scope.service = dataService;
    //把自己的型号找到并赋值为选中状态
   if ($scope.Source.Action == 3) {
       angular.forEach($scope.Source.productmodelData, function (value, key) {
            if (value['typeid'] == $scope.Source.selectItem['idproducttype']) {
                $scope.Source.productmodelData[key].checked = true;
                //删除\修改的时候会用到这个字段的
                $scope.Source.productmodelData[value['typeid']].idproductmodel = value['idproductmodel'];
            }
       });
    }
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmproduct/Producttype/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmproduct/Producttype/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmproduct/Producttype/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmproduct/Producttype/update_page_data';
            break;
        default:
            alert.show('Action Error!');   
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
    $scope.product = [1, 0];
    $scope.save = function (product) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 3) {
            //勾选
            if (product.checked) {
                $scope.url = __URL + 'Crmproduct/Productmodel/update_page_data';
                $scope.params.append('idproductmodel', product.idproductmodel);
                $scope.params.append('typeid', $scope.Source.selectItem['idproducttype']);
            } else {
                //取消勾选
                $scope.params.append("idproductmodel", product.idproductmodel);
                $scope.params.append('typeid', '');
                $scope.url = __URL + 'Crmproduct/Productmodel/update_page_data';
            }
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idproducttype', $scope.Source.selectItem.idproducttype);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idproducttype', $scope.Source.selectItem.idproducttype);
            }
            $scope.params.append('name', $scope.Source.selectItem.name);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        alert.show('添加失败', '添加产品类型');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('producttypeData', {
                        _kid: data,
                        name: $scope.Source.selectItem.name,
                        del: 0,
                        index: 0,
                        idproducttype: data
                    });
                    dataService.addData('producttypeArray', {
                        _kid: data,
                        name: $scope.Source.selectItem.name,
                        del: 0,
                        index: 0,
                        idproducttype: data
                    });
                   
                    if (product == 0) {
                        //product 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加产品类型');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加产品类型');
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        dataService.updateData('producttypeData', $scope.Source.selectItem);
                        dataService.updateData('producttypeArray', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改产品类型');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改产品类型');

                    break;
                case 2:
                    //删除
                    if (data == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除产品类型');
                        dataService.delData('producttypeData', dataService.selectItem);
                        dataService.delData('producttypeArray', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除产品类型');
                    break;
                case 3:
                    //与产品型号添加
                    if (data > 0) {
                        if (product.checked) {
                            //更新service中的关系数据源
                            $scope.service.productmodelData[product.idproductmodel] = {
                                idproductmodel: product.idproductmodel,
                                name: product.name,
                                typeid: $scope.Source.selectItem.idproducttype,
                            };
                        } else {
                            delete $scope.service.productmodelData[product.idproductmodel];
                            delete product.idproductmodel;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品类型与产品型号关系');
                    product.checked = !product.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    /*
    创建型号--点击事件
    data 成功后得回调、
    关闭模态框会返回'ok'
*/
    $scope.addProductClick = function () {
        $scope.service.title = "添加新的产品型号";
        $scope.modalHtml = __URL + 'Crmproduct/Productmodel/openmodal';
        $scope.modalController = 'modalProductmodelController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.productmodelData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.productmodelData[key] == undefined) {
                        $scope.Source.productmodelData[key] = angular.copy($scope.service.productmodelData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    //修改型号--点击事件
    $scope.updatemodel = function (product) {
        $scope.service.title = "修改产品型号";
        $scope.modalHtml = __URL + 'Crmproduct/Productmodel/openmodal';
        $scope.modalController = 'modalProductmodelController';
        $scope.service.selectItem = product;
        $scope.service.Action = 1;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                //此处刷新一下数据源
            }
        });
    }
    //删除型号--点击事件
    $scope.removemodel = function (product) {
        $scope.service.title = '删除产品型号';
        $scope.modalHtml = __URL + 'Crmproduct/Productmodel/openmodal';
        $scope.modalController = 'modalProductmodelController';
        $scope.service.selectItem = product;
        $scope.service.Action = 2;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                delete $scope.Source.productmodelData[product.idproductmodel];
            }
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
