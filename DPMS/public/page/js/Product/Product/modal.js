//添加编辑权限的控制器
appModule.controller('modelProductController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    if ($scope.service.Action == 0 && $scope.service.addType == 2) {
        $scope.Source.selectItem = '';
    }
    
    if ($scope.service.selectItem&&$scope.service.selectItem.children) {
        $scope.selected_model = $scope.service.selectItem.children;
    }
    if ($scope.service.selectItem && $scope.service.selectItem.selected) {
        $scope.Source.selectItem.selected.children = null;
        $scope.selected_product = $scope.Source.selectItem.selected;
    }
   
   
    $scope.Source.popoverisopens = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//20
    $scope.popoverisopen = function (index) {
        angular.forEach($scope.Source.popoverisopens, function (value, key) {
            $scope.Source.popoverisopens[key] = false;
        });
        if (index != undefined) {
            $scope.Source.popoverisopens[index] = true;
        }
    }
    $scope.popoverisopen();
    //项目提示框title和代码段路径
    $scope.dynamicPopover = {
        templateUrl: __URL + 'Crmproduct/Product/product_model',
        title_abbreviation: '修改简称',
        title_description: '修改产品描述',
        title_product: '修改产品名称',
        title_manufacturers: '修改制造商',
        title_typedescription: '修改型号描述',
        title_plist: '修改列表价',
        title_peu: '修改EU底价',
        title_psi: 'SI底价',
        title_pinter: '内部核算价'
    };
    //附件管理数据
    $scope.selectAnnx = function () {
        $scope.params = new URLSearchParams();
        $scope.params.append('$json', true);
        $scope.service.postData(__URL + 'Crmsetting/Annex/select_page_data', $scope.params).then(function (data) {
            $scope.service.annexData = data;
            $scope.service.showAnnx();
        }, function (error) {
            console.log(error);
        });
    }
    //附件展示
    $scope.service.showAnnx = function () {
        $scope.productAnnx = [];
        if (!$scope.refannexs) {
            if ($scope.service.selectItem.refannexs) {
                $scope.refannexs = $scope.service.selectItem.refannexs.split(",");
            } else {
                $scope.refannexs = [];
            }

        }
        angular.forEach($scope.refannexs, function (value, key) {
            $scope.productAnnx.push($scope.service.annexData[value]);
        });
    }
    //附件下载
    $scope.downLoad = function (annex) {
        
        window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);
        

    }
    //附件上传
    $scope.upLoad = function (annex) {
        $scope.service.title = '上传附件';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.uploadannex = true;
        publicControllerAdd($scope);
    }
    //附件图片路径
    $scope.publicFilterAnnexName = function (itemName) {
        return publicFilterAnnexName(itemName);
    }
    //附件与项目关系
    $scope.service.refAnnex = function (idannex, index) {
        var params = new URLSearchParams();
        params.append('idproduct', $scope.Source.selectItem.idproduct);
        if (index == 1) {
            //删除
            removeByValue($scope.refannexs, idannex);
        } else {
            $scope.refannexs.push(idannex);
        }
        params.append('refannexs', $scope.refannexs.join(","));
        $scope.service.postData(__URL + 'Crmproduct/Product/update_page_data', params).then(function (data) {
            if (data < 1) {
                if (index == 1) {
                    alert.show('Error!', '解除附件关系');
                    $scope['close' + idannex] = undefined;
                } else {
                    alert.show('Error!', '添加附件关系');

                }

            } else {
                if (index == 1) {
                    //解除关系
                    $scope['close' + idannex] = false;
                } else {
                    //添加关系
                    $scope.selectAnnx();
                }
            }

        }, function (error) {
            console.log(error);
        });

    }
    switch ($scope.Source.Action) {
        case 0:
            if ($scope.service.addType == 2) {
                $scope.url = __URL + 'Crmproduct/Productmodel/add_page_data';
            } else{
                $scope.url = __URL + 'Crmproduct/Product/add_page_data';
            }

            break;
        case 1:
            if ($scope.service.addType == 1) {
                $scope.url = __URL + 'Crmproduct/Product/update_page_data';
                $scope.selectAnnx();
            } else if ($scope.service.addType == 2) {
                $scope.url = __URL + 'Crmproduct/Productmodel/update_page_data';
            }

            break;
        case 2:
            if ($scope.service.addType == 1) {
                $scope.url = __URL + 'Crmproduct/Product/del_page_data';
            } else if ($scope.service.addType == 2) {
                $scope.url = __URL + 'Crmproduct/Productmodel/del_page_data';
            }

            break;
        default:
            alert.show('Action Error!');
            break;
    }

    /*
    保存信息
    */
    /*状态*/
    $scope.save = function () {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 0) {           
                //添加
            $scope.params.append('name', $scope.Source.selectItem.name);
            if ($scope.service.addType == 2) {
                $scope.params.append('productid', $scope.service.selectItem.idproduct ? $scope.service.selectItem.idproduct : null);
            }           
           
        } else if ($scope.Source.Action == 1) {
            switch ($scope.service.addType) {              
                case 1:
                    //编辑产品
                    $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                    if ($scope.Source.editType == 1) {
                        $scope.params.append('name', $scope.Source.selectItem.name);
                    } else if ($scope.Source.editType == 2) {
                        $scope.params.append('abbreviation', $scope.Source.selectItem.abbreviation);
                    } else if ($scope.Source.editType == 3) {
                        $scope.params.append('description', $scope.Source.selectItem.description);
                    }
                    break;
                case 2:
                    //编辑型号
                    $scope.params.append('idproductmodel', $scope.Source.selectItem.idproductmodel);
                    if ($scope.Source.editType == 1) {
                        $scope.params.append('name', $scope.Source.selectItem.name);
                    } else if ($scope.Source.editType == 5) {
                        $scope.params.append('manufacturers', $scope.Source.selectItem.manufacturers);
                    } else if ($scope.Source.editType == 6) {
                        $scope.params.append('description', $scope.Source.selectItem.description);
                    } else if ($scope.Source.editType == 7) {
                        $scope.params.append('plist', $scope.Source.selectItem.plist);
                    } else if ($scope.Source.editType == 8) {
                        $scope.params.append('peu', $scope.Source.selectItem.peu);
                    } else if ($scope.Source.editType == 9) {
                        $scope.params.append('psi', $scope.Source.selectItem.psi);
                    } else if ($scope.Source.editType == 10) {
                        $scope.params.append('pinter', $scope.Source.selectItem.pinter);
                    }

                    break;
            }

        } else if ($scope.Source.Action == 2) {
            switch ($scope.service.addType) {              
                case 1:
                    $scope.params.append('idproduct', $scope.Source.selectItem.idproduct);
                    break;
                case 2:
                    $scope.params.append('idproductmodel', $scope.Source.selectItem.idproductmodel);
                    break;
            }

        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data <= 0) {
                        if ($scope.service.addType==1) {
                            //添加失败
                            alert.show('添加失败', '添加产品');
                            break;
                        } else {
                            //添加失败
                            alert.show('添加失败', '添加产品型号');
                            break;
                        }

                        break;
                    }
                    if ($scope.service.addType == 1) {
                        //更新service数据源
                        $scope.Source.selectItem._kid = data;
                        $scope.Source.selectItem.idproduct = data;
                        dataService.addData('productData', $scope.Source.selectItem);
                        $scope.idproduct = data;
                       
                    } else {

                        //添加产品型号成功
                        //更新service数据源
                        $scope.addNewData = {
                            _kid: data,
                            name: $scope.Source.selectItem.name,
                            del: 0,
                            index: 0,
                            idproductmodel: data,
                            
                        }

                        dataService.addData('productmodelData', $scope.addNewData);

                        $scope.Source.selectItem = $scope.service.productmodelData[$scope.addNewData._kid];
                        $scope.Source.selectItem.selected = $scope.service.selectItem;
                        $scope.service.productData[$scope.service.selectItem.idproduct].children.push($scope.Source.selectItem);
                        
                    }
                    $uibModalInstance.close('ok'); 
                    $scope.service.updateInfo($scope.Source.selectItem);
                    break;
                case 1:

                   if ($scope.service.addType == 1) {
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproduct;
                        dataService.updateData('productData', $scope.Source.selectItem);
                        if ($scope.Source.selectItem.name != undefined) {
                            $scope.service.selectItem.name = $scope.Source.selectItem.name;
                        }
                        if ($scope.Source.selectItem.description != undefined) {
                            $scope.service.selectItem.description = $scope.Source.selectItem.description;
                        }
                        if ($scope.Source.selectItem.abbreviation != undefined) {
                            $scope.service.selectItem.abbreviation = $scope.Source.selectItem.abbreviation;
                        }
                        // $scope.service.pagedata();
                        break;
                    } else if ($scope.service.addType == 2) {
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproductmodel;
                        dataService.updateData('productmodelData', $scope.Source.selectItem);
                        if ($scope.Source.selectItem.name != undefined) {
                            $scope.service.selectItem.name = $scope.Source.selectItem.name;
                        }
                        if ($scope.Source.selectItem.manufacturers != undefined) {
                            $scope.service.selectItem.manufacturers = $scope.Source.selectItem.manufacturers;
                        }
                        if ($scope.Source.selectItem.description != undefined) {
                            $scope.service.selectItem.description = $scope.Source.selectItem.description;
                        }
                        if ($scope.Source.selectItem.plist != undefined) {
                            $scope.service.selectItem.plist = $scope.Source.selectItem.plist;
                        }
                        if ($scope.Source.selectItem.peu != undefined) {
                            $scope.service.selectItem.peu = $scope.Source.selectItem.peu;
                        }
                        if ($scope.Source.selectItem.psi != undefined) {
                            $scope.service.selectItem.psi = $scope.Source.selectItem.psi;
                        }
                        if ($scope.Source.selectItem.pinter != undefined) {
                            $scope.service.selectItem.pinter = $scope.Source.selectItem.pinter;
                        }
                        break;
                    }

                    break;
                case 2:

                   if ($scope.service.addType == 1) {
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproduct;
                        dataService.delData('productData', $scope.Source.selectItem);
                        $scope.service.selectItem = $scope.Source.selectItem;
                        // $scope.service.pagedata();
                        alert.show('删除成功', '产品');
                    } else if ($scope.service.addType == 2) {
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproductmodel;
                        dataService.delData('productmodelData', $scope.Source.selectItem);
                        $scope.service.selectItem = $scope.Source.selectItem;
                        // $scope.service.pagedata();
                        alert.show('删除成功', '产品型号');
                    }
                    break;

            }
           // $scope.service.pagedata();
        }, function (error) {
            console.log(error);
        });
    };

    //保存产品-型号的关系
    $scope.refSave = function (item,selecttype) {
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmproduct/Productmodel/update_page_data';

        switch ($scope.Source.addType) {            
            case 1:
                $scope.params.append('idproductmodel', item.idproductmodel);
                if (selecttype == 1) {
                    $scope.params.append('productid', '');
                } else {
                    $scope.params.append('productid', $scope.Source.selectItem.idproduct);
                }
                break;
            case 2:
                if (item.idproduct == $scope.selected_product.idproduct) {
                    return;
                }
                $scope.params.append('idproductmodel', $scope.Source.selectItem.idproductmodel);
                $scope.params.append('productid', item.idproduct);               
                break;           
            default:
                alert.show('Action Error!');
                break;
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.service.addType) {
                case 0:
                    if (data < 1) {
                        //添加失败
                        if ($scope.Source.addType == 1) {
                            alert.show('关联失败', '关联产品信号');
                            break;
                        } else {
                            alert.show('关联失败', '关联产品');
                            break;
                        }                      
                    }

                   
                    break;
                case 1:
                    if (data < 1) {
                       
                        //修改失败
                        alert.show('修改失败', '产品类型');
                        break;
                    }
                    if ($scope.Source.addType == 1) {
                        if (selecttype == 0) {                          
                            item.productid = $scope.Source.selectItem.idproduct;
                        } else {                            
                           
                            var index = item
                            $scope.service.productData[$scope.Source.selectItem.idproduct].children.
                             item.productid = null;
                        }
                    } else {
                        $scope.service.selectItem.productid = item.idproduct;
                    }
                    

                    dataService.updateData('productmodelData', item);
                    
                    break;
                case 2:
                    if (data < 1) {
                        //删除失败
                        alert.show('删除失败', '产品型号');
                        break;
                    }
                   
                    $scope.Source.selectItem._kid = $scope.Source.selectItem.idproductmodel;
                    $scope.Source.selectItem.productid = item.idproduct;
                    dataService.updateData('productmodelData', $scope.Source.selectItem);
                    $scope.service.productData[item.idproduct].children.push($scope.Source.selectItem);
                    angular.forEach($scope.service.productData[$scope.selected_product.idproduct].children, function (value) {
                        if (value.idproductmodel == $scope.Source.selectItem.idproductmodel){
                            var i = $scope.service.productData[$scope.selected_product.idproduct].children.indexOf(value);
                            $scope.service.productData[$scope.selected_product.idproduct].children.splice(i, 1);
                        }
                    });
                    console.log($scope.service.productData);
                    //console.log("当前准备关联的idproduct" + item.idproduct);
                    //console.log("之前的idproduct" + $scope.selected_product.idproduct);
                    $scope.selected_product.idproduct = item.idproduct;
   
                    break;               

            }
           // $scope.service.pagedata();
        }, function (error) {
            console.log(error);
        });


    }

    /*
        创建型号--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addProductmodelClick = function () {
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
                $scope.service.productmodelArrData = P_objecttoarray($scope.service.productmodelData)
            }
        });
    }

    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /*
    2018年3月21日 14:04:45
    添加产品类型
    注：产品类型-产品-产品型号，的关系都存在产品型号表里
    关联产品时，需将产品型号表里的typeid根据关联的产品id修改为当前产品类型id，
    */

    //添加产品类型时，组建产品及产品型号teee
    $scope.product_model_tree = function () {
        console.log($scope.service);
        $scope.service.modalproductdata = {};
        angular.forEach($scope.service.productmodelData, function (value, key) {
            //只显示有产品型号的产品信息
            if ($scope.service.productData.hasOwnProperty(value.productid)) {
                $scope.service.modalproductdata[value.productid] = $scope.service.productData[value.productid];
            }
        });
        console.log($scope.service.productData);
        $scope.service.modalproductdata = P_objecttoarray($scope.service.modalproductdata)
    }
    $scope.product_model_tree();

}]);
