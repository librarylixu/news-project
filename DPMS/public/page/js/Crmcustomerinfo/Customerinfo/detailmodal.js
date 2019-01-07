//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize']);
//主控制器
appModule.controller('detailCustomerrefcompanyController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    if (!$scope.service.privateDateObj.customerinfoData[_id]) {
        return;
    }
    //判断是否是空对象
    $scope.isnullproject = function (data) {
        var dataarr = Object.keys(data);
        var isnull = false;
        if (dataarr.length > 0) {
            isnull = true;
        }
        return isnull;
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //取客户
    $scope.customerinfo = $scope.service.privateDateObj.customerinfoData[_id];
    //html循环的数据
    $scope.projectData = [];
    $scope.searchProject = function () {
        //根据项目的id查询项目    
        //根据客户的id把关联的项目的ids给拿到，->查询数据库
        var params = new URLSearchParams();
        params.append('$json', true);
        //根据客户的id把关联的项目的ids给拿到
        select_project(params).then(function (res) {
            if ($scope.customerinfo.__refprojects) {
                $scope.buildproject();
            } else {
                //根据客户的id把关联的项目的ids给拿到，->查询数据库
                var params = new URLSearchParams();
                params.append('refcustomers', _id);
                params.append('$json', true);
                params.append('$findall', true);
                params.append('$findinset', true);
                params.append('$fieldkey', 'idproject');
                //根据客户的id把关联的项目的ids给拿到
                select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (resultdata) {
                    //拿到结果               
                    $scope.customerinfo.__refprojects = Object.keys(resultdata);
                    $scope.buildproject();
                });
            }
        });
    }

    //组建关联的项目
    $scope.buildproject = function () {
        //组建没有访问权限的项目的id----向后台请求时使用
        var norefproject = [];
        angular.forEach($scope.customerinfo.__refprojects, function (value, key) {

            if ($scope.service.privateDateObj.projectData[value]) {
                //缓存区
                $scope.projectData.push($scope.service.privateDateObj.projectData[value]);
            } else if ($scope.service.privateDateObj.tempprojectData[value]) {
                //临时缓存区               
                $scope.projectData.push($scope.service.privateDateObj.tempprojectData[value]);
            } else {
                //组建没有权限的项目id后，去后台拿
                norefproject.push(value);
            }
        });
        //当有没有获取到的没有权限的项目时，去后台拿
        if (norefproject.length > 0) {
            //去后台拿
            var params = new URLSearchParams();
            params.append('idproject', norefproject.join(','));
            params.append('$findall', true);
            params.append('$findinset', true);
            select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                angular.forEach(data, function (value) {
                    $scope.service.privateDateObj.tempprojectData[value.idproject] = value;
                });
                $scope.projectData = $scope.projectData.concat(data);
            });
        }
    }

    //取联系人
    $scope.contactData = [];
    $scope.selectContact = function () {
        if ($scope.customerinfo.refcontactids && $scope.customerinfo.refcontactids.split) {
            $scope.customerinfo.refcontactids = $scope.customerinfo.refcontactids.split(',');
        }
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customer_contact(params).then(function (data) {
            //组建没有访问权限的联系人的id----向后台请求时使用
            var norefcontact = [];
            angular.forEach($scope.customerinfo.refcontactids, function (value) {
                if ($scope.service.privateDateObj.contactData[value]) {
                    $scope.contactData.push($scope.service.privateDateObj.contactData[value]);
                } else if ($scope.service.privateDateObj.tempcontactData[value]) {
                    $scope.contactData.push($scope.service.privateDateObj.tempcontactData[value]);
                } else {
                    if (value != '') {
                        norefcontact.push(value);    
                    }
                }
            });
            if (norefcontact.length > 0) {
                //去后台拿
                var params = new URLSearchParams();
                params.append('idcontact', norefcontact.join(','));
                params.append('$findall', true);
                params.append('$findinset', true);
                select_customer_contact(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    angular.forEach(data, function (value) {
                        $scope.service.privateDateObj.tempcontactData[value.idcontact] = value;
                    });
                    $scope.contactData = $scope.contactData.concat(data);
                });
            }
        });

    }
    //取跟进记录
    $scope.recordData = [];
    $scope.selectRecord = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('$findall', true);
        params.append('refcustomerid', $scope.customerinfo.idcustomerinfo);
        select_record(params, { 'index': 'returndata', 'status': 1 }).then(function (resultdata) {
            $scope.recordData = P_objecttoarray(resultdata);
        });
    }
    //取工单
    $scope.workorderData = {};//key 创建人 value[ 工单1，工单2]
    $scope.searchWorkorder = function () {
        //根据项目的id查询工单    
        //根据客户的id把关联的项目的ids给拿到，->查询数据库
        var params = new URLSearchParams();
        params.append('$json', true);
        //根据客户的id把关联的项目的ids给拿到
        select_workorder(params).then(function (res) {
            if ($scope.customerinfo.__refworkorders) {
                $scope.buildworkorder();
            } else {
                var params = new URLSearchParams();
                params.append('$json', true);
                params.append('$findall', true);
                params.append('$findinset', true);
                params.append('refcustomerid', $scope.customerinfo.idcustomerinfo);
                params.append('$fieldkey', 'idworkorder');
                select_workorder(params, { 'index': 'returndata', 'status': 1 }).then(function (resultdata) {
                    $scope.customerinfo.__refworkorders = Object.keys(resultdata.data);
                    $scope.buildworkorder();
                });
            }

        });
    }

    //组建关联的工单 
    $scope.buildworkorder = function () {
        //组建没有访问权限的工单的id----向后台请求时使用
        var norefwork = [];
        angular.forEach($scope.customerinfo.__refworkorders, function (value, key) {
            if ($scope.service.privateDateObj.workorderData.data[value]) {
                if (!$scope.workorderData[value.assignid]) {
                    $scope.workorderData[$scope.service.privateDateObj.workorderData.data[value].assignid] = [];
                }
                //缓存区
                $scope.workorderData[$scope.service.privateDateObj.workorderData.data[value].assignid].push($scope.service.privateDateObj.workorderData.data[value]);
            } else if ($scope.service.privateDateObj.tempworkorderData[value]) {
                //临时缓存区
                if (!$scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid]) {
                    $scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid] = [];
                }
                $scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid].push($scope.service.privateDateObj.tempworkorderData[value]);
            } else {
                //组建没有权限的工单id后，去后台拿
                norefwork.push(value);
            }
        });
    }
    //项目状态查询
    $scope.selectprojectstatus = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //项目状态
        select_project_status(params);
    }
    //用户数据查询
    $scope.selectusers = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //项目状态
        select_user(params);
    }
    //获取页面相关数据
    $scope.selectData = function () {
        //获取关联项目信息
        $scope.searchProject();
        //项目状态查询
        $scope.selectprojectstatus();
        //取联系人
        $scope.selectContact();
        //取跟进记录
        $scope.selectRecord();
        //取工单
        $scope.searchWorkorder();
        //用户数据查询
        $scope.selectusers () 
    }
    
    //数据查询
    $scope.selectData();

    //打开项目详细页
    $scope.openproject = function (row) {
        parent.YL.open({
            title: row.name,
            url: __URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid, row.title);
    }
    //打开工单详细页
    $scope.openwork = function (row) {
        parent.YL.open({
            title: row.title,
            url: __URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid, row.title);
    }
    //打开记录详细页
    $scope.openrecord = function (row) {
        parent.YL.open({
            title: row.title,
            url: __URL + 'Crmschedule/Record/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid, row.title);
    }
    $scope.recordmessage = [];
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