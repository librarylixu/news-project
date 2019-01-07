/**
*create by zhangs
*2018.09.27
*工作周报js
**/
appModuleInit(['ui.bootstrap','datePicker', 'ui.select']);
//主控制器
appModule.controller('crmweeklyController', ['$scope', '$q', 'dataService',  function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    $scope.selectData = function () {
        var params = {};
        if (!$scope.service.user) {
            $scope.display = false;
            parent.layer.msg('请选择员要查看的员工', { icon: 0 });
            return;
        }
        params.userid = $scope.service.user;
        params.stime = P_getMyTime($scope.start);
        params.etime = P_getMyTime($scope.end );
        $scope.service.postData(__URL + 'Crmsetting/Weekly/asyncGetWorkReportByUserid', params).then(function (data) {
            $scope.service.weeklyData = data;            
            $scope.display = true;
        });
    };
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //客户
        select_customerinfo(params);
        //项目
        select_project(params);
        //出差
        select_business(params);
        //用户
        select_user(params);
        //跟进记录
        select_record(params);
        //项目状态
        select_project_status(params);
    };
    $scope.select();
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.start = new Date();
        $scope.end = new Date();
        //控制日期选择框的显示与否
        $scope.popup1 = { opened: false };
        $scope.popup2 = { opened: false };
        //时间插件配置项
        $scope.dateOptions1 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(2000, 01, 01),
            startingDay: 1
        };
        $scope.dateOptions2 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2045, 01, 01),
            minDate: $scope.start,
            startingDay: 1
        };
        //打开事件选择框的方法
        $scope.open1 = function () {
            $scope.dateOptions1.maxDate = $scope.end;
            $scope.popup1.opened = true;
        }
        //打开事件选择框的方法
        $scope.open2 = function () {
            $scope.dateOptions2.minDate = $scope.start;
            $scope.popup2.opened = true;
        }
    };
    $scope.initDatepiker();
    $scope.openCustomerdetail = function (id) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.customerinfoData[id].name,
            url: __URL + 'Crmcustomerinfo/Customerinfo/selectdetailed?id=' + id + '&guid=' + $scope.service.privateDateObj.customerinfoData[id].guid
        });
    }
    $scope.openProjectdetail = function (id) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.projectData[id].name,
            url: __URL + 'Crmproject/Project/selectdetailed?id=' + id + '&guid=' + $scope.service.privateDateObj.projectData[id].guid
        });
    }
    $scope.opencloseProjectdetail = function (item) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.projectData[id].name,
            url: __URL + 'Crmproject/Project/selectdetailed?id=' + item.idproject + '&guid=' + item.guid
        });

    }
    $scope.openWorkorderdetail = function (id) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.recordData[id].name,
            url: __URL + 'Crmschedule/Record/selectdetailed?id=' + id + '&guid=' + $scope.service.privateDateObj.recordData[id].guid
        });
    }
   
    $scope.openBusinessdetail = function (id) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.businessData[id].name,
            url: __URL + 'Crmschedule/Business/selectdetailed?id=' + id + '&guid=' + $scope.service.privateDateObj.businessData[id].guid
        });
    }
    //切换员工
    $scope.changePerson = function () {
        //使数据清空
        $scope.display = false;
    }
}]);