
angular.module('AceApp', ['datePicker'])
.controller('eimEimworklogController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    //字符串转换为时间戳
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
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
            minDate: new Date(2000,01,01),
            startingDay: 1
        };
        $scope.dateOptions2 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2045,01,01),
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
 
    /*
        查询（本页面使用）数据
        refresh 
                1 点击查询按钮(需传参数：maxSize：)
                2强制刷新
        flag   翻页页码数 (需传参数： thisPageCount）
        当第一次查询时：
    */
    $scope.select = function (refresh, flag) {
        var params = {};
        params['$json'] = true;
        if (!refresh&&!flag) {
            $scope.maxSize = 5;
            $scope.bigCurrentPage = 1;
        }       
        if (refresh) {
            if (refresh == 2) {
                $scope.start = new Date();
                $scope.end = new Date();
                $scope.bigCurrentPage = 1;
            } 
            params.sTime = parseInt(Date.parse($scope.start) / 1000).toFixed(0);
            params.eTime = parseInt(Date.parse($scope.end) / 1000).toFixed(0);
        }       
        if (flag) {
            params.thisPageCount = flag;
        }
        params.pageCount = $scope.maxSize;
            $scope.service.postData( __URL + 'Eimaudit/Eimworklog/select_auditlog_data',params).then(function (data) {
                //总条数
                $scope.bigTotalItems = parseInt(data.count);
                if ($scope.bigTotalItems > $scope.maxSize) {
                    $scope.num = Math.ceil($scope.bigTotalItems / $scope.maxSize);
                } else {
                    $scope.num = 1;
                }
               
                $scope.service.eimworklogData = data.data;
            });         
       
    }
    //查找其他数据
    $scope.selectData = function () {
        var params = {};
        params['$json'] = true;
        select_user(params);
        select_sessioncenterlist(params);
    }
    //页面加载完成后，查询数据
    $scope.select();
    $scope.selectData();
    //查看审计记录
    $scope.openAuthrecord = function (item) {
        $scope.service.title = '查看审计记录';
        $scope.modalHtml = __URL + 'Eimaudit/Eimworklog/openAuthfile';
        $scope.modalController = 'modalAuthfileController';
        $scope.service.selectItem = item;
        publicControllerUpdate($scope);
    }
}]).controller('modalAuthfileController', ['$scope', '$uibModalInstance', 'dataService', '$q', function ($scope,$uibModalInstance, dataService, $q) {
    $scope.service = dataService;
    $scope.Source = angular.copy(dataService);
    var sessioncenterip = '';
    //时间戳转字符串
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
    $scope.select = function (flag) {
         var params = {};
         params['$json'] = true;
         params['workid'] = $scope.service.selectItem.ideimworklog;
         $scope.service.postData(__URL + 'Eimaudit/Authfile/select_page_data', params).then(function (data) {
             $scope.service.authfileData = data;
         });
         if ($scope.service.selectItem.sessioncenterid) {
             var params = {};
             params['idsessioncenterlist'] = $scope.service.selectItem.sessioncenterid;
             $scope.service.postData(__URL + 'Eimsystemsetting/Sessioncenterlist/select_page_data', params).then(function (data) {
                 sessioncenterip = data[0].ip;
             });
         }
         select_user(params);
    }
    //查看回放记录
    $scope.openPlayback = function (item) {
        var params = { 'file': item.filepath, 'type': $scope.service.selectItem.sessiontypename };
        if (sessioncenterip) {
            params.sessioncenterip = sessioncenterip;
        }
        P_Post(__URL + 'Eimsessiontools/Sessiontool/open_playback_page', params, '_blank');
    }
    $scope.select();
     
    //取消按钮
    $scope.btn_cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);


