//添加编辑客户的控制器
appModule.controller('modalcustomermapController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    // 页面加载完成后调用
    $timeout(function () {
        // 百度地图API功能
        function G(id) {
            return document.getElementById(id);
        }
        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京", 12);     // 初始化地图,设置城市和地图级别。
        $scope.service.search = [];
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{
		    "input": "input"
		, "location": map
		});
        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            $scope.setPlace();
        });
        $scope.setPlace = function (myValue) {
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
        //添加地图类型控件
        map.addControl(new BMap.MapTypeControl({
            mapTypes: [
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]
        }));
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    }, 100);

    //刷新地图
    $scope.refmap = function () {
        // 百度地图API功能
        function G(id) {
            return document.getElementById(id);
        }
        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京", 12);     // 初始化地图,设置城市和地图级别。
        $scope.service.search = [];
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{
		    "input": "input"
		, "location": map
		});
        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            $scope.setPlace();
        });
        $scope.setPlace = function (myValue) {
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
        //添加地图类型控件
        map.addControl(new BMap.MapTypeControl({
            mapTypes: [
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]
        }));
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
