
//添加编辑权限的控制器
appModule.controller('modelProductController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //去打开用户组数据时才去组件
    if (dataService.Action == 8) {
        //临时数据源，中间的大圈
        $scope.tempData = [];
        /*
        组建父子之间的关系结构
        */
        $scope.createNewData = function () {
            angular.forEach($scope.Source.usergroupData, function (value, key) {
                var i = value.pid;
                if (i == -1 || i == '0') {
                    value.isParent = true;
                    $scope.tempData.push(value);
                    return;
                    //$scope.service.oldusergroupData[i] == undefined  : 此处为了防止找不到pid得情况，从而导致js报错，页面数据丢失
                } else if ($scope.Source.usergroupData[i] == undefined) {
                    value.isParent = true;
                    $scope.tempData.push(value);
                    return;
                } else if ($scope.Source.usergroupData[i].children == undefined) {
                    $scope.Source.usergroupData[i].children = [value];
                    $scope.Source.usergroupData[i].isParent = true;
                } else {
                    $scope.Source.usergroupData[i].children.push(value);
                    $scope.Source.usergroupData[i].isParent = true;
                }
            });
            console.log($scope.tempData);
            return $scope.tempData;
        }
        //组件最终的tree数据源
        $scope.service.treedata = $scope.createNewData();
        //选中某项
        $scope.showSelected = function (sel) {
            $scope.selectedNode = sel;
            sel.checked = !sel.checked;
            $scope.save($scope.selectedNode);
            console.log($scope.Source.Action);
        };
    }
    //把自己的型号找到并赋值为选中状态
    angular.forEach($scope.Source.productmodelData, function (value, key) {
        if (value['productid'] == $scope.Source.selectItem['idproduct']) {
            $scope.Source.productmodelData[value['idproductmodel']].checked = true;
        }
    });
    //把自己的用户找到并赋值为选中状态
    if ($scope.Source.Action == 6) {
        var useridarr = $scope.Source.selectItem['refusers'].split(",");
        for (i = 0; i <= useridarr.length; i++) {
            if ($scope.Source.usersData[useridarr[i]] != undefined) {
                $scope.Source.usersData[useridarr[i]].checked = true;
            }
        }
    }
    //把自己的角色找到并赋值为选中状态
    if ($scope.Source.Action == 7) {
        var utypeidarr = $scope.Source.selectItem['refutypes'].split(",");
        for (i = 0; i <= utypeidarr.length; i++) {
            if ($scope.Source.usertypeData[utypeidarr[i]] != undefined) {
                $scope.Source.usertypeData[utypeidarr[i]].checked = true;
            }
        }
    }
    //把自己的用户组找到并赋值为选中状态
    if ($scope.Source.Action == 8) {
        var ugroupidarr = $scope.Source.selectItem['refugroups'].split(",");
        for (i = 0; i <= ugroupidarr.length; i++) {
            if ($scope.Source.usergroupData[ugroupidarr[i]] != undefined) {
                $scope.Source.usergroupData[ugroupidarr[i]].checked = true;
            }
        }
    }
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmproduct/Product/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmproduct/Product/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmproduct/Product/del_page_data';
            break;
        case 3:
            $scope.url += 'Crmproduct/Productmodel/update_page_data';
            break;
        case 4:
            $scope.url += 'Crmproduct/Productmodel/update_page_data';
            break;
        case 5:
            $scope.url += 'Crmproduct/Productmodel/del_page_data';
            break;
        case 6:
            $scope.url += 'Crmproduct/Product/update_page_data';
            break;
        case 7:
            $scope.url += 'Crmproduct/Product/update_page_data';
            break;
        case 8:
            $scope.url += 'Crmproduct/Product/update_page_data';
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
        if ($scope.Source.Action == 6) {
            //勾选---关联用户
            if (product.checked) {
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                $scope.params.append('refusers', $scope.Source.selectItem.refusers + ',' +product.idusers);
            } else {
                //取消勾选
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                var index = useridarr.indexOf(product.idusers);
                useridarr.splice(index, 1);
                $scope.params.append('refusers', useridarr.join(","));
            }
        } else if ($scope.Source.Action == 7) {
            //关联角色
            if (product.checked) {
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                $scope.params.append('refutypes', $scope.Source.selectItem.refutypes + ',' + product.idusertype);
            } else {
                //取消勾选
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                var index = utypeidarr.indexOf(product.idusertype);
                utypeidarr.splice(index, 1);
                $scope.params.append('refutypes', utypeidarr.join(","));
            }
        } else if ($scope.Source.Action == 8) {
            //关联用户组
            if (product.checked) {
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                $scope.params.append('refugroups', $scope.Source.selectItem.refugroups + ',' + product.idusergroup);
            } else {
                //取消勾选
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                var index = ugroupidarr.indexOf(product.idusergroup);
                ugroupidarr.splice(index, 1);
                $scope.params.append('refugroups', ugroupidarr.join(","));
            }
        } else if ($scope.Source.Action == 4) {
            //修改型号
            //如果是修改信息，就需要传id
            $scope.params.append('idproductmodel', $scope.Source.selectItem.idproductmodel);
            $scope.params.append('name', $scope.Source.selectItem.name);
            $scope.params.append('manufacturers', $scope.Source.selectItem.manufacturers);
            $scope.params.append('description', $scope.Source.selectItem.description);
            $scope.params.append('plist', $scope.Source.selectItem.plist);
            $scope.params.append('peu', $scope.Source.selectItem.peu);
            $scope.params.append('psi', $scope.Source.selectItem.psi);
            $scope.params.append('pinter', $scope.Source.selectItem.pinter);
        }else if ($scope.Source.Action == 5) {
            //删除型号
            $scope.params.append('idproductmodel', $scope.Source.selectItem.idproductmodel);
        }else if ($scope.Source.Action == 3) {
            //勾选
            if (product.checked) {
                $scope.params.append('idproductmodel',product.idproductmodel );
                $scope.params.append('productid', $scope.Source.selectItem.idproduct);
            } else {
                //取消勾选
                $scope.params.append('idproductmodel', product.idproductmodel);
                $scope.params.append("productid", null);
            }
        } else if ($scope.Source.Action == 2) {
            $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
            }
            $scope.params.append('name', $scope.Source.selectItem.name);
            $scope.params.append('abbreviation', $scope.Source.selectItem.abbreviation);
            $scope.params.append('description', $scope.Source.selectItem.description);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        alert.show('添加失败', '添加产品');
                        break;
                    }
                    //更新service数据源
                    dataService.addData('productData', {
                        _kid: data,
                        name: $scope.Source.selectItem.name,
                        abbreviation: $scope.Source.selectItem.abbreviation,
                        description: $scope.Source.selectItem.description,
                        del: 0,
                        index: 0,
                        idproduct: data
                    });

                    if (product == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加产品');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加产品');
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        dataService.updateData('productData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改产品');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改产品');

                    break;
                case 2:
                    //删除
                    if (data == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除产品');
                        dataService.delData('productData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除产品');
                    break;
                case 3:
                    //与产品型号添加
                    if (data > 0) {
                        if (product.checked) {
                            //更新service中的关系数据源
                            $scope.service.productmodelData[data] = {
                                productid: product.idproduct,
                            };
                        } else {
                            delete $scope.service.productmodelData[product.idproduct];
                            delete product.idproduct;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与产品型号关系');
                    product.checked = !product.checked;
                    break;
                case 4:
                    //修改型号
                    if (data > 0) {
                        //修改成功                        
                        dataService.updateData('productmodelData', $scope.Source.selectItem);
                        dataService.updateData('producttypeData', $scope.service.producttypeData);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改产品');
                        break;
                    }
                    alert.show('修改失败', '修改产品型号');
                    break;
                case 5:
                    //删除型号
                    if (data == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除产品型号');
                        dataService.delData('productmodelData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除产品型号');
                    break;
                case 6:
                    //关联用户
                    if (data > 0) {
                        if (product.checked) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers + ',' + product.idusers;
                        } else {
                            $scope.Source.selectItem.refusers = useridarr.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户关系');
                    product.checked = !product.checked;
                    break;
                case 7:
                    //关联用户角色
                    if (data > 0) {
                        if (product.checked) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refutypes = $scope.Source.selectItem.refutypes + ',' + product.idusertype;
                        } else {
                            $scope.Source.selectItem.refutypes = utypeidarr.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户关系');
                    product.checked = !product.checked;
                    break;
                case 8:
                    //关联用户组
                    if (data > 0) {
                        if (product.checked) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refugroups = $scope.Source.selectItem.refugroups + ',' + product.idusergroup;
                        } else {
                            $scope.Source.selectItem.refugroups = ugroupidarr.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户关系');
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
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
