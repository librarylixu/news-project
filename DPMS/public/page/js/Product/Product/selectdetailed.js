//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ui.grid', 'ui.grid.emptyBaseLayer', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ngVerify', 'datePicker', 'ui.select', 'colorpicker.module', 'ngSanitize']);
appModule.controller('detailProductController', ['$scope', '$q', 'i18nService', 'dataService', 'uiGridConstants', 'alert', function ($scope, $q, i18nService, dataService, uiGridConstants, alert) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;

    //查询产品
    $scope.selectproduct = function () {
        //产品数据
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('id', _id);
        select_product(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            //console.log($scope.service.productData);
            $scope.service.selectedItemProduct = data[_id];
            $scope.selectannex();
        });
    } 
    //查询型号数据
    $scope.selectproductmodel = function () {
        //产品数据
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('productid', _id);
        select_productmodel(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            //console.log($scope.service.productmodelData);
            $scope.service.productmodelData = data;
        });
        $scope.selectproduct();
    }
    //查询附件
    $scope.selectannex = function () {
        var params = new URLSearchParams();
        //params.append('$json', true);
        params.append('$in', true);
        //params.append('$fetchSql', true);
        params.append('idannex', $scope.service.selectedItemProduct.refannexs);
        select_annex(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            $scope.productAnnx = data;
            console.log($scope.service.annexData);
        });
    }

    $scope.selectproductmodel();

    //附件下载
    $scope.downLoad = function (annex) {
        window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);      
    }
    //附件图片路径
    $scope.publicFilterAnnexName = function (itemName) {
        return publicFilterAnnexName(itemName);
    }
    
    //刷新按钮
    $scope.refresh = refresh;
}])