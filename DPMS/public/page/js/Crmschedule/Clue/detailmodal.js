//初始化modal并定义service
appModuleInit(['ui.bootstrap']);
//主控制器
appModule.controller('detailClueController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //存一份userid
    $scope.service.userid = _userid;
    if (Object.keys($scope.service.privateDateObj.clueData).length==0) {
        var params = { $json: true };
        select_clue(params).then(function (res) {
            $scope.clueData = $scope.service.privateDateObj.clueData[_id];
        });
    } else {
        //取商机
        $scope.clueData = $scope.service.privateDateObj.clueData[_id] ? $scope.service.privateDateObj.clueData[_id] : $scope.service.privateDateObj.closeclueData[_id];
    }
    
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

    //查询历史记录（详细页）
    $scope.selectcluelog = function () {
        var params = new URLSearchParams();
        params.append('refclue', _id);
        //status = 1 强制查询
        select_cluerecord(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            $scope.service.privateDateObj.cluelogData = data;
        });
    }
    //查询历史记录
    $scope.selectcluelog();
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
    //发布历史记录
    $scope.savecluelog = function () {
        if (ue.getContent() == undefined || ue.getContent() == '') {
            parent.layer.msg('请不要发布空的历史记录！');
            return;
        }
        $scope.cluelog = ue.getContent();
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmsetting/Cluerecord/insert_page_data";
        $scope.message = '由'+ $scope.service.privateDateObj.usersData[$scope.service.userid].description +'发表：'+$scope.cluelog;
        params.append('refclue', $scope.clueData.idclue);
        params.append('message', $scope.message);
        $scope.service.postData(url, params).then(function (data) {
            if (data['ok'] > 0) {
                //处理正常结果
                //更新数据源
                $scope.selectItem = {};
                $scope.selectItem.message = $scope.message;
                $scope.selectItem.refclue = $scope.clueData.idclue;
                $scope.selectItem.time = data.time; 
                $scope.service.privateDateObj.cluelogData.push($scope.selectItem);
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