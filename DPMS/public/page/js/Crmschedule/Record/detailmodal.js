//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize', 'textAngular', 'ui.select']);
appModule.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        taOptions.toolbar[0].splice(3);
        taOptions.toolbar[3] = [];
        return taOptions;
    }]);
});
//主控制器
appModule.controller('detailRecordController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //存一份userid
    $scope.service.userid = _userid;
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('tailedcontainer', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
    });
    //原因描述数据和结果描述数据初始化
    $scope.workorderDataMessage = {};
    //查询原因描述/结果描述
    $scope.selectMessage = function () {
        //检测缓存中是否已经存在了
        var isworkdata = true;
        if ($scope.service.privateDateObj.workorderDataMessage) {
            angular.forEach($scope.service.privateDateObj.workorderDataMessage, function (value) {
                if (value.workid == _id) {
                    //说明数据源中已经存在了，不需要去数据库中取了
                    isworkdata = false;
                }
            })
        }
        //说明数据库里没有，还要去查询
        if (isworkdata) {
            var params = new URLSearchParams();
            params.append('workid', _id);
            params.append('guid', $scope.recordData.guid);
            select_workorder_message(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                $scope.service.privateDateObj.workorderDataMessage = [];
                $scope.service.privateDateObj.workorderDataMessage=data;
                $scope.workorderDataMessage = data;
            });
        }
    }
    $scope.selectrecord = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_user(params).then(function (res) {
            select_customerinfo().then(function (res) {
                select_project().then(function (res) {
                    select_customer_contact(params).then(function () {
                        select_record(params).then(function () {
                            //取工单
                            $scope.recordData = $scope.service.privateDateObj.recordData[_id];

                            //查询原因描述
                            $scope.selectMessage();
                        });

                    });
                });
            });
        });

    }
    $scope.selectrecord();
    
    //发布历史记录
    $scope.saverecordlog = function () {
        if (ue.getContent() == undefined || ue.getContent() == '') {
            parent.layer.msg('请不要发布空的历史记录！');
            return;
        }
        $scope.recordlogcontent = ue.getContent();
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();

        $scope.message = '由' + $scope.service.privateDateObj.usersData[$scope.service.userid].description + '发表：' + $scope.recordlogcontent;
        params.append("workid", $scope.recordData.idworkorder);
        params.append("guid", $scope.recordData.guid);
        params.append("resulttime", parseInt(new Date().getTime() / 1000));
        params.append("resultdescription", $scope.message);
        var url = __URL + 'Crmschedule/Workordermessage/add_page_data';
        $scope.service.postData(url, params).then(function (data) {
            if (data) {
                //处理正常结果
                //更新数据源
                $scope.selectItem = {};
                $scope.selectItem.resultdescription = $scope.message;
                $scope.selectItem.resulttime = parseInt(new Date().getTime() / 1000);
                $scope.selectItem.workid = $scope.recordData.idworkorder;
                $scope.service.privateDateObj.workorderDataMessage.push($scope.selectItem);
                //把编辑框清空
                ue.setContent('');
                parent.layer.msg('发布成功', { icon: 6 });
                defer.resolve(data);
            } else {
                parent.layer.msg('发布失败', { icon: 2 });
                //处理异常结果
                defer.reject(data);
            }
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
    
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