//添加编辑权限的控制器
appModule.controller('modelProductlistController', ["$scope",'alert','confirm', function ($scope,alert,confirm) {
    $scope.service.projectlistData = {};
    /*
    处理产品和型号
    给每个产品添加一个_refModelList属性，该属性存储了产品所关联的型号
    */
    $scope.productAddModel = function () {
        angular.forEach($scope.service.productmodelData, function (value, key) {
            //给每个产品关联好型号 _refModelList可以提供给页面的select使用，作为当前产品可选型号的数据源
            if ($scope._productData[value.productid]._refModelList == undefined) {
                $scope._productData[value.productid]._refModelList = [];
            }
            $scope._productData[value.productid]._refModelList.push(value);
        });
        //查询项目与产品的关系
        $scope.selectProjectdevicelist();
    }
    /*查询全部的型号*/
    $scope.selectAllModel = function () {
        if ($scope.service.productmodelData != undefined) {
            $scope.productAddModel();
            $scope.service.productmodelArrData = P_objecttoarray($scope.service.productmodelData);
            return;
        }             
        var params = new URLSearchParams();
        params.append('$json', true);
       
        //产品型号
        $scope.service.postData(__URL + 'Crmproduct/Productmodel/select_page_data', params).then(function (data) {         
            $scope.service.productmodelData = data;
            $scope.service.productmodelArrData = P_objecttoarray($scope.service.productmodelData);
            $scope.productAddModel();
            
        }, function (error) {
            console.log(error);
        });
    }

    /*查询全部的产品*/
    $scope.selectAllProduct = function () {
        if ($scope.service.productData != undefined) {
            $scope._productData = angular.copy($scope.service.productData);
            $scope._productArrData = angular.copy(P_objecttoarray($scope._productData));
            $scope.selectAllModel();
            return;
        }     
        var params = new URLSearchParams();
        params.append('$json', true);
        select_product(params).then(function (res) {
            //对象转数组,给页面select使用，作为可选的产品数据源
            $scope._productData = angular.copy($scope.service.productData);
            $scope._productArrData = angular.copy(P_objecttoarray($scope._productData));
            $scope.selectAllModel();
              
        });
    };
    
    /*
    处理产品select的选中事件
    _productObj当前选中的产品
    _refProductObj当前关系对象
    */
    $scope.changeProduct=function(_productObj,_refProductObj){      
        //关系中的可选型号列表
        _refProductObj.refModelObjList = [];
        if (_productObj != undefined && _productObj.idproduct != undefined && $scope._productData[_productObj.idproduct]._refModelList != undefined) {
            _refProductObj.refModelObjList = $scope._productData[_productObj.idproduct]._refModelList;
        }
    }

    /*
   1.查询所有该项目的清单项数据
   2.根据项目id查询该项目已关联的所有产品型号（关系表）
   3.循环关系，组建项目关联的产品数据源
   关系表
   */
    $scope.selectProjectdevicelist = function () {
        var params = new URLSearchParams();
        // params.append('$in', true);
        params.append('$json', true);
        params.append('projectid',$scope.projectid.id );
       $scope.service.postData(__URL + 'Crmproject/Projectdevicelist/select_page_data', params).then(function (data) {
           $scope.service.projectlistData = data;
           $scope.sumAllMoney();
        }, function (error) {
            console.log(error);
        });
    }

    /*选择产品型号方法
    *action  1代表编辑，2代表删除
    *item    代表当前操作行的所有数据
    **/
    $scope.saveData = function (item, action) {
        $scope.params = new URLSearchParams();
        $scope.params.append('idprojectdevicelist', item.idprojectdevicelist);
        if (action == 1) {
            $scope.url = __URL + 'Crmproject/Projectdevicelist/update_page_data';           
            $scope.params.append('productmodelid', item._selectModelObj.idproductmodel);
            $scope.params.append('number', item.number);
            $scope.params.append('money', item.money);
            $scope.Source.postData($scope.url, $scope.params).then(function (data) {                
                $scope.sumAllMoney();
            });
        } else {
            ////配置一个透明的询问框
            //layer.msg('大部分参数都是可以公用的<br>合理搭配，展示不一样的风格', {
            //    time: 20000, //20s后自动关闭
            //    btn: ['明白了', '知道了', '哦']
            //});
            confirm.show('确认删除？', '提示').then(function (data) {
                if (data == 'ok') {
                    $scope.url = __URL + 'Crmproject/Projectdevicelist/del_page_data';
                    $scope.Source.postData($scope.url, $scope.params).then(function (data) {
                        
                            if (data == 0) {
                                parent.layer.msg('移除失败,请重试', { icon: 5 });
                                return;
                            }
                            delete $scope.service.projectlistData[item.idprojectdevicelist];
                        
                        $scope.sumAllMoney();
                    });
                }
            });
           
        }
       
    }
   
    //计算总价
    $scope.sumAllMoney = function () {
        //总价
        $scope.sumMoney = 0;
        angular.forEach($scope.service.projectlistData, function (value, key) {
            $scope.sumMoney+=parseInt(value.money);
        });
    }

    //添加设备清单数据
    $scope.addProduct = function () {
        $scope.url = __URL + 'Crmproject/Projectdevicelist/add_page_data';
        $scope.params.append('projectid', $scope.projectid.id);
        $scope.params.append('productmodelid', $scope.service.productmodelArrData[0].idproductmodel);
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data<1) {
                parent.layer.msg('添加失败,请重试', { icon: 5 });
                return;
            }
            if (Object.prototype.toString.call($scope.service.projectlistData) == '[object Array]' && $scope.service.projectlistData.length == 0) {
                $scope.service.projectlistData = {};
            }
            $scope.service.projectlistData[data] = {
                idprojectdevicelist: data,
                projectid: $scope.projectid.id,
                productmodelid: $scope.service.productmodelArrData[0].idproductmodel,
                number: 1,
                money: $scope.service.productmodelArrData[0].plist,
                _edit: true,
            };
            $scope.sumAllMoney();
        });        
    }
    //获取产品数据
    $scope.selectAllProduct();      
    }]);
