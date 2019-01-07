
angular.module('AceApp', ['datePicker'])
.controller('eimSystemrunlogController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    /*每页显示几条*/
    $scope._pageCount = 5;
    /*分页栏的区间*/
    $scope._thisPageArray = [];
    /*当前第几页*/
    //$scope.service._thisPageCount = 1;
    /*重置分页栏可选的页数区间*/
    $scope.__setPageControl = function () {
        $scope._thisPageArray = [];
        for (var i = -2; i < 3; i++) {
            if (($scope.service._thisPageCount + i) <= Math.ceil($scope.service.systemrunlogData['count'] / $scope._pageCount)) {
                if ($scope.service._thisPageCount + i > 0) {
                    $scope._thisPageArray.push($scope.service._thisPageCount + i);
                }
            } else {
                break;
            }
        }
    }
    /*
        查询（本页面使用）数据
        flag 1 强制刷新
    */
    $scope.select = function (flag) {
        var params = new URLSearchParams();
        params.append('pageCount', $scope._pageCount);
        if (flag == 1 || $scope.service.systemrunlogData == undefined) {
            //$scope.service.systemrunlogData['count'] = $scope.service.systemrunlogData['count'];
            select_systemrunlog(params).then(function (res) {
                layer.msg('数据已刷新', { icon: 6 });
                $scope.service._thisPageCount = 1;
                $scope.__setPageControl();
            });
        }
        if ($scope.service.systemrunlogData != undefined) {
            $scope.__setPageControl();
        }
        
    }
    /*
    仅做根据时间段清空/查询日志功能
        $scope.dates.stoday开始时间
        $scope.dates.etoday结束时间
        type 0为查询日志   1为清空日志
    */
    $scope.operationlog = function (type) {
        var params = new URLSearchParams();
        params.append('pageCount', $scope._pageCount);//每页显示几条
        //params.append('thisPageCount', $scope.service._thisPageCount);//当前第几页
        if ($scope.dates.stoday != undefined && $scope.dates.stoday != '') {
            params.append('sTime', $scope.dates.stoday.unix());
        }
        if ($scope.dates.etoday != undefined && $scope.dates.etoday != '') {
            params.append('eTime', $scope.dates.etoday.unix());
        }
        //时间都输入正确之后判断是查询操作还是清空日志操作
        var url = '';
        if (type == 0) {
            url = __URL + 'Eimlog/Systemrunlog/select_page_data';
        } else if (type == 1) {
            //如果是清空日志的话需要额外判断
            if ($scope.dates.stoday == '' || $scope.dates.etoday == '' || $scope.dates.stoday == undefined || $scope.dates.etoday == undefined) {
                layer.msg('请填写完整时间段！', { icon: 5 });
                return;
            }
            //检测结束时间是否大于开始时间
            if ($scope.dates.etoday._i < $scope.dates.stoday._i) {
                layer.msg('您填写的时间有误！', { icon: 5 });
                return;
            }
            url = __URL + 'Eimlog/Systemlog/del_page_data';
        }
        $scope.service.postData(url, params).then(function (data) {
            if (type == 0) {
                layer.msg('数据已刷新', { icon: 6 });
                $scope.service.systemrunlogData = data;
                $scope.__setPageControl();
            } else {
                if (data.n > 0) {
                    layer.msg('清除成功', { icon: 6 });
                } else {
                    layer.msg('清除失败,当前时间段没有日志', { icon: 5 });
                }
            }
        });
    }
    //四舍五入
    $scope.ceilint = function(index){
        return Math.ceil(index);;
    }
    //页面加载完成后，查询数据
    $scope.select(0);

    //组件时间插件
    $scope.today = new Date();
    //$scope.endDay = $scope.today.setDate($scope.today.getDate() + 1);
    $scope.stoday = moment($scope.today);

    $scope.etoday = angular.copy($scope.stoday).add(1, 'days');
    $scope.dates = {
    };
    $scope.dates.maxStoday = $scope.dates.etoday;
    //观察name 当一个model值发生改变的时候 都会触发第二个函数
    $scope.$watch('dates', function (newValue, oldValue) {
        if (newValue.etoday !== oldValue.etoday) {
            //$scope.dates.maxStoday = angular.copy(newValue.etoday);
            $scope.$applyAsync(function () {
                $scope.dates.maxStoday = angular.copy(newValue.etoday);

            });
        }
    }, true);
    //------

    //查询翻页后数据
    $scope.selectData = function () {
        var params = new URLSearchParams();
        params.append('pageCount', $scope._pageCount);//每页显示几条
        params.append('thisPageCount', $scope.service._thisPageCount);//当前第几页
        if ($scope.dates.stoday != undefined && $scope.dates.stoday != '') {
            params.append('sTime', $scope.dates.stoday.unix());
        }
        if ($scope.dates.etoday != undefined && $scope.dates.etoday != '') {
            params.append('eTime', $scope.dates.etoday.unix());
        }  
        select_systemrunlog(params).then(function (res) {
            //layer.msg('数据已刷新', { icon: 6 });
            $scope.__setPageControl();
        });
    }
    
   
    /*分页栏页数点击事件*/
    $scope.setPage = function (index) {
        $scope.service._thisPageCount = Math.ceil(index);
        $scope.selectData();
       // $scope.__setPageControl();
    }   
    /*翻页事件*/
    $scope.nextPage = function (pageindex) {
        if ($scope.service._thisPageCount +pageindex<1) {
            $scope.service._thisPageCount = 1;
        }
        else if ($scope.service._thisPageCount + pageindex > Math.ceil($scope.service.systemrunlogData['count'] / $scope._pageCount)) {
            $scope.service._thisPageCount = Math.ceil($scope.service.systemrunlogData['count'] / $scope._pageCount);
        } else {
            $scope.service._thisPageCount += pageindex;
        }
        $scope.selectData();
       // $scope.__setPageControl();             
        
    }


    //打开页面时调用一下，防止切换页面时翻页按钮丢失
    //$scope.__setPageControl();
    //console.log($scope._thisPageArray);
}]);


