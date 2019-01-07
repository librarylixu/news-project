/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ngVerify',  'ui.select', 'textAngular']);
//主控制器
appModule.controller('crmSystemlogController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //初始化翻页数据
    $scope.maxSize = _maxSize;
    $scope.thisPageCount = _thisPageCount;
    //存一份userid（当前仅用来判断是否是管理员）
    $scope.service.userid = userid;
    $scope.service.logtypeSelect = 'customer';
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.service.start = new Date();
        $scope.service.end = new Date();
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
            minDate: $scope.service.start,
            startingDay: 1
        };
        //打开事件选择框的方法
        $scope.open1 = function () {
            $scope.dateOptions1.maxDate = $scope.service.end;
            $scope.popup1.opened = true;
        }
        //打开事件选择框的方法
        $scope.open2 = function () {
            $scope.dateOptions2.minDate = $scope.service.start;
            $scope.popup2.opened = true;
        }
    };
    //初始化时间插件
    $scope.initDatepiker();
    //查询日志数据源
    /*
    根据条件查询where  { 'stime':1234567,'etime':1234567}
    $scope.num页面上显示共x页
    $scope.service.start开始时间
    $scope.service.end结束时间
    $scope.maxSize每页显示多少条
    */
    $scope.select = function (where) {
        var params = new URLSearchParams();
        if (where && where != undefined) {
            //组件where
            for (key in where) {
                if (key == 'sTime' || key == 'eTime') {
                    where[key] = Date.parse(where[key]) / 1000;
                }
                params.append(key, where[key]);
            }
        }
        //params.time = {'sTime' : where.sTime, 'eTime' : where.eTime};
        //当前第几页
        if (!$scope.bigCurrentPage) {
            $scope.bigCurrentPage = 1;
        }
        params.append("thisPageCount", $scope.bigCurrentPage);
        params.append('pageCount', $scope.maxSize);
        $scope.service.postData(__URL + 'Crmlog/Systemlog/select_page_data', params).then(function (data) {
            //总条数
            $scope.bigTotalItems = parseInt(data.count);
            if ($scope.bigTotalItems > $scope.maxSize) {
                $scope.num = Math.ceil($scope.bigTotalItems / $scope.maxSize);
            } else {
                $scope.num = 1;
            }
            $scope.service.SystemlogData = data.data;
            //查询其他展示的数据
            $scope.selectother();
        });
    }
    //根据条件进行查询
    $scope.selectwhere = function () {
        var where = {};
        //结果
        if ($scope.service.logtypeSelect) {
            where.selecttype = $scope.service.logtypeSelect;
        }
        //操作人
        if ($scope.service.usersSelect) {
            where.userid = $scope.service.usersSelect.idusers;
        }
        //结果
        if ($scope.service.resultSelect) {
            where.result = $scope.service.resultSelect;
        }        //类型
        if ($scope.service.typeSelect) {
            where.type = $scope.service.typeSelect;
        }
        //开始时间
        if ($scope.service.start) {
            where.sTime = $scope.service.start;
        }
        //结束时间
        if ($scope.service.end) {
            where.eTime = $scope.service.end;
        }
        //调用查询方法
        $scope.select(where);
    }
    //查询其他展示的数据
    $scope.selectother = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //查询用户
        select_user(params);
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //查询页面数据源
    //var where = { 'sTime': 1530432686, 'eTime': 1535962286, 'result': 1 };
    $scope.select();
    //检测返回的结果
    $scope.isresult = function (data, type) {
        var bind = '';
        var classtype = '';
        switch(data.result)
        {
            case 0:
                bind = '失败';
                classtype = 'label label-warning';
                break;
            case 1:
                bind = '成功';
                classtype = 'label label-info';
                break;
            case 2:
                bind = '未知';
                classtype = 'label label-default';
        }
        //甄别是要什么class还是数据
        if (type == 1) {
            return bind;
        } else {
            return classtype;
        }
    }
    //判断日志的种类
    $scope.iflogtype = function (item, type) {
        var bind = '';
        var classtype = '';
        if (item.hasOwnProperty('customerid')) {
            bind = "客户";
            classtype = 'label label-warning';
        } else if (item.hasOwnProperty('projectid')) {
            bind = "项目";
            classtype = 'label label-info';
        } else{
            bind = "工单";
            classtype = 'label label-default';
        }
        //甄别是要什么class还是数据
        if (type == 1) {
            return bind;
        } else {
            return classtype;
        }
    }
    //判断日志的操作类型
    $scope.systemtype = function (typenum,type) {
        var bind = '';
        var classtype = '';
        switch (typenum) {
            case 0:
                bind = '添加';
                classtype = 'label label-warning';
                break;
            case 1:
                bind = '修改';
                classtype = 'label label-info';
                break;
            case 2:
                bind = '删除';
                classtype = 'label label-default';
            case 3:
                bind = '查询';
                classtype = 'label label-success';
        }
        //甄别是要什么class还是数据
        if (type == 1) {
            return bind;
        } else {
            return classtype;
        }
    }
    //查看流线图按钮
    $scope.selectchart = function () {
        parent.YL.open('charts');
    }
    //刷新按钮
    $scope.refresh = refresh;
}])

