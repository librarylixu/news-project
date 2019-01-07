appModuleInit(['datePicker', 'ui.bootstrap', 'ngVerify', 'treeControl', 'angularFileUpload', 'ngSanitize', 'ui.select', 'colorpicker.module']);

/*
    2018年3月22日 22:43:06
    1.查询项目[$scope.select]
        1.保存项目所有id ，根据项目id查询项目关联的多有产品型号使用array[$scope.service.projectids]
        2.保存所有项目数据Object[$scope.service.projectData]
    2.查询项目状态[$scope.projectstatus](项目查询完成后，查询项目状态)
        1.两个数据源：array[$scope.service.statusArrData],object[$scope.service.projectstatusData]
    3.查询所有客户数据[$scope.selectcustomer](项目状态查询完成后，查询所有客户数据)
        包括两个数据源：array[$scope.service.customerinfoArrData],object[$scope.service.customerinfoData]
        3.1 把全部的客户，转换一下，用array存储
        3.2 查询项目关联的产品型号数据[$scope.refselectproduct]
            一个数据源object[$scope.service.refproductData]
            3.2.1 查询所有产品型号[数据源：object($scope.service.productmodelData)]
            3.2.2 根据项目id查询该项目关联的所有产品型号(关系表)[数据源：object($scope.service.refproductData)]
                3.2.2.1 查询完成后，循环数据源[$scope.service.refproductData]给产品型号数据源[$scope.service.productmodelData]添加关系字段idprojectdevicelist
                    同时计算每个项目所关联的所有产品型号的列表总价（字段refproductlist）
                    $scope.service.projectData[value.projectid].refproductlist += parseInt(value.money);                             
        3.4 查询所有联系人数据[方法：$scope.selectcontact](数据源：(object)$scope.service.contactData)
    4.查询联系人与客户关系数据，根据客户id查询关系表数据(联系人数据查询完毕后执行)
        [方法：$scope.selectrefcontact](数据源：(object)$scope.service.refcontactData)
        4.1 组建项目的属性信息[方法：$scope.initprojectinfo()]
            4.1.1 循环整个项目 将项目状态添加到项目中
            4.1.2 循环整个项目 处理项目已关联的客户和可选的联系人
            4.1.3 循环整个项目 处理项目已关联的联系人
           
    5.查询与用户关系数据
     5.1 循环整个项目将创建用户的用户名添加到项目中
*/

//主控制器
appModule.controller('crmProjectController', ['$scope', '$q', 'dataService', 'alert', function ($scope,$q, dataService, alert) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //显示到页面上的数据源
    $scope.ProjectData = [];
    //项目所有id ，根据项目id查询项目关联的多有产品型号使用
    $scope.service.projectids = [];
    $scope.service.projectData = {};
    /*
       查询项目（本页面使用）数据
   */
    $scope.select = function () { 
        var params = new URLSearchParams();
        params.append('$json', true);
        select_project(params).then(function (res) {
            $scope.service.projectids = Object.keys($scope.service[res]);
            $scope.service.projectArrData = P_objecttoarray($scope.service.projectData);
            //获取所有相关数据
            $scope.selectallData();
        });
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time) {
        if (time == undefined || time == 0) {
            return '暂无';
        } else {
            return formatDate(time);
        }

    }

    /*
    1.查询所有产品型号
    2.根据项目id查询该项目已关联的所有产品型号（关系表）
    3.循环关系，组建项目关联的产品数据源
    关系表
    */
    $scope.selectProjectdevicelist = function () {        
            var params = new URLSearchParams();
           // params.append('$in', true);
            params.append('$json', true);
            params.append('projectid', $scope.service.projectids.toString());
            dataService.postData(__URL + 'Crmproject/Projectdevicelist/select_page_data', params).then(function (data) {                
                $scope.service.refproductData = data;

                //计算项目订单总价
                $scope.makeMoney();
                //获取产品使用地省/市数据
                $scope.getCityData();
            }, function (error) {
                console.log(error);
            });
    }
    /*
 查询所有相关数据
 */
    $scope.selectallData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //查询项目状态
        select_project_status(params).then(function (res) {
            //把全部的状态，转换一下，用array存储
            $scope.service.statusArrData = P_objecttoarray($scope.service[res]);
        });
        //查询客户
        select_customerinfo(params).then(function (res) {
            //把全部的客户，转换一下，用array存储
            $scope.service.customerinfoArrData = P_objecttoarray($scope.service[res]);           
        });
           
        //查询联系人
        select_customer_contact(params);
        //用户
        select_user(params).then(function (res) {
            //把全部的用户，转换一下，用array存储
            $scope.service.userArrData = P_objecttoarray($scope.service[res]);
        });
        //产品型号表
        select_productmodel(params).then(function (res) {
            
            //查询项目关联的产品型号数据
            $scope.selectProjectdevicelist();
        });
        ////产品
        //select_product(params).then(function (res) {
        //    $scope.service.productArrData = P_objecttoarray($scope.service.productData);
        //    $scope.service.productmodelArrData = P_objecttoarray($scope.service.productmodelData);
        //    // $scope.service.pagedata();
        //    //$scope.start = true;
        //});
        
    }
  
    //计算项目订单总价
    $scope.makeMoney = function () {
        angular.forEach($scope.service.refproductData, function (value) {
            if ($scope.service.projectData[value.projectid].refproductData == undefined) {
                $scope.service.projectData[value.projectid].refproductData = [];
            }
            if ($scope.service.projectData[value.projectid].refproductlist === undefined) {
                $scope.service.projectData[value.projectid].refproductlist = 0;
            }
           
            //给模态框使用的，可以通过关系表的id进行解除关系
            $scope.service.productmodelData[value.productmodelid].idprojectdevicelist = value.idprojectdevicelist;
            // $scope.service.projectData[value.projectid].refproductData.push($scope.service[res][value.productid]);
            //计算出列表总价
            $scope.service.projectData[value.projectid].refproductlist += parseInt(value.money) * parseInt(value.number);
        });
    }
    //获取项目城市数据
    $scope.getCityData = function () {
        dataService.postData(__URL + 'Crmproject/Project/getCityData', {}).then(function (data) {
            //先将数据存一份（带key得）
            $scope.service.getCitykeyData = JSON.parse(data);
            //组件一个不带key得数组
            $scope.service.getCityedArrData = P_objecttoarray(JSON.parse(data));
        });
    }
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'project';
        $scope.service.name = '项目';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '添加项目';
        $scope.modalHtml = __URL + 'Crmproject/Project/detail';
        $scope.modalController = 'detailProjectController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = '编辑项目';
        $scope.modalHtml = __URL + 'Crmproject/Project/detail';
        $scope.modalController = 'detailProjectController';
        $scope.service.modalPlacement = "right";
        $scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //修改按钮
    $scope.service.updateInfo = function (row) {
        $scope.service.title = '编辑项目';
        $scope.modalHtml = __URL + 'Crmproject/Project/detail';
        $scope.modalController = 'detailProjectController';
        $scope.service.modalPlacement = "right";
        $scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (row) {
        $scope.service.title = '删除项目';
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem = row;
        publicControllerDel($scope);
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        window.Win10_child.openUrl(__URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid, row.name);
        //parent.Win10.openUrl(__URL + 'Crmcustomerinfo/Customerrefcompany/selectdetailed?id=' + row.idcustomerinfo, '<i class="fa fa-newspaper-o icon red"></i>');
    }
    //页面加载完成后，查询数据
    $scope.select();
}]);

