//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize', 'textAngular']);
appModule.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        taOptions.toolbar[0].splice(3);
        taOptions.toolbar[3] = [];
        return taOptions;
    }]);
});
//主控制器
appModule.controller('detailCustomerrefcompanyController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //初始化工单信息数据源
    $scope.service.groupuserworkorderData = {};
    //初始化工单状态
    $scope.service.statusData = {
        '0': { id: '0', name: '未确认', type: 'label-warning' },
        '1': { id: '1', name: '进行中', type: 'label-default' },
        '2': { id: '2', name: '待结单', type: 'label-info' },
        '3': { id: '3', name: '已完成', type: 'label-success' },
        '4': { id: '4', name: '已中止', type: 'label-danger' }
    };
    //判断是否是空对象/空对象
    $scope.isnullpoject = function (data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
            if (data.length == 0) {
                return true;
            }
        } else {
            if (JSON.stringify(data) == '{}') {
                return true;
            }
        }
        return false;
    }
    //获取对象的长度
    $scope.projectlength = function (data) {
        return Object.keys(data).length;
    }
    /**
    *根据当前客户id，去查询客户的信息，如果没有值，service.customerinfoData为null，否则为对象
   **/
    $scope.selectRefcustomer = function () {
        var params = new URLSearchParams();
        params.append('idcustomerinfo', _id);
        params.append('$find', true);
        params.append('$findall', true);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/select_page_data', params).then(function (data) {
            $scope.service.customerinfoData = data;
            //查询相关数据
            $scope.selectData();
        })
    }
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, 'yyyy-mm-dd');
    }
    /*
    查询相关所有数据
    */
    $scope.selectData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('$findall', true);
        if ($scope.service.privateDateObj.usersData && Object.keys($scope.service.privateDateObj.usersData).length < 1) {
            //用户
            select_user(params);
        }
        if ($scope.service.privateDateObj.customerstageData && Object.keys($scope.service.privateDateObj.customerstageData).length < 1) {
            //客户阶段
            select_customer_stage(params);
        }
        if ($scope.service.privateDateObj.customermarketData && Object.keys($scope.service.privateDateObj.customermarketData).length < 1) {
            //客户市场大区分类
            select_customer_market(params);
        }
        if ($scope.service.privateDateObj.customercreditData && Object.keys($scope.service.privateDateObj.customercreditData).length < 1) {
            //客户信用等级
            select_customer_credit(params);
        }
        if ($scope.service.privateDateObj.customerstatusData && Object.keys($scope.service.privateDateObj.customerstatusData).length < 1) {
            //客户状态
            select_customer_status(params);
        }
        if ($scope.service.privateDateObj.customertypeData && Object.keys($scope.service.privateDateObj.customertypeData).length < 1) {
            //客户类型
            select_customer_type(params);
        }
        if ($scope.service.privateDateObj.customersourceData && Object.keys($scope.service.privateDateObj.customersourceData).length < 1) {
            //客户来源
            select_customer_source(params);
        }
        if ($scope.service.privateDateObj.customerindustryData && Object.keys($scope.service.privateDateObj.customerindustryData).length < 1) {
            //客户行业
            select_customer_industry(params);
        }
        if ($scope.service.privateDateObj.customerlevelData && Object.keys($scope.service.privateDateObj.customerlevelData).length < 1) {
            //客户级别
            select_customer_level(params);
        }
        if ($scope.service.privateDateObj.customerstatusData && Object.keys($scope.service.privateDateObj.customerstatusData).length < 1) {
            //查询项目状态
            select_project_status(params);
        }
        if ($scope.service.privateDateObj.contactData && Object.keys($scope.service.privateDateObj.contactData).length < 1) {
            //联系人
            select_customer_contact(params);
        }
        //查询项目
        $scope.selectproject();
        //查询工单
        $scope.selectworkorder();
    }
    //根据客户的id查询项目
    $scope.selectproject = function () {
        var params = new URLSearchParams();
        params.append('refcustomers', _id);
        params.append('$json', true);
        params.append('$findall', true);
        params.append('$findinset', true);
        select_project(params);
    }
    //根据客户的id查询工单
    $scope.selectworkorder = function () {
        var params = new URLSearchParams();
        params.append('refcustomerid', _id);
        params.append('$json', true);
        params.append('$findall', true);
        params.append('$findinset', true);
        select_workorder(params).then(function (res) {
            //此处组件以user分组的数据
            angular.forEach($scope.service.workorderData['data'], function (value, key) {
                if ($scope.service.groupuserworkorderData[value.assignid] == undefined) {
                    $scope.service.groupuserworkorderData[value.assignid] = [];
                }
                $scope.service.groupuserworkorderData[value.assignid].push(value);
            });
        });
    }
    //打开项目详细页
    $scope.openproject = function (row) {
        window.Win10_child.openUrl(__URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid, row.title);
    }
    //打开工单详细页
    $scope.openwork = function (row) {
        window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid, row.title);
    }

    //查询
    $scope.selectRefcustomer();
    //刷新按钮
    $scope.refresh = refresh;
    //打印按钮
    $scope.print = function () {
        window.print();
    }
    //取消按钮
    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
}]);