//开启会话
angular.module('AceApp')
.controller('eimsshsessionController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.service = dataService;
    //测试数据
    $scope.service.selectItem = {
        ipaddress: "192.168.7.100",
        loginuser: "root",
        loginpwd: "xincheneim2415",
        xcsessionip: "192.168.7.110:1336",
        sessionstatus: 0,
        isenterpwd: 0,
        refenterpwd: "1,2",
    };
    /*
        开启会话流程：
        1.检测浏览器是否支持H5
        2.检查是否需要授权*
        3.检查当前设备是否已开启会话
            3.1 选择开启会话的方式（抢占、加入、监控）
                3.1.1 抢占
                3.1.2 加入
                    询问开启会话者是否允许他人加入当前会话
                3.1.3 监控
        4.检测当前设备开启会话时，是否需要手动输入帐号密码
            (判断是否需要手动输入密码，如果为真，则根据refenterpwd检查需要手动输入密码的用户)
            4.1手动输入帐号密码
        5.检测帐号密码是否已设置
        6.检测是否存在密码规则*
        7.检测是否存在多个密码规则*
        8.创建工单
        9.开启会话
    */

    //检测浏览器
    var is_Browser = P_checkBrowser();
    if (is_Browser == "ok") {
        layer.msg(is_Browser, { icon: 5 });
        return;
    }
    //检查当前设备是否已开启会话 0：空闲，1：使用中
    if ($scope.service.selectItem.sessionstatus == 1) {


        return;
    }
    //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
    if ($scope.service.selectItem.isenterpwd == 1) {

        return;
    }
    //检测设备帐号密码是否已设置
    if ($scope.service.selectItem.loginuser || $scope.service.selectItem.loginpwd) {
        //请设置帐号密码
        return;
    }

    //创建工单
    $scope.CreateSessionWorkLog = function () {

        var params = new URLSearchParams();
        params.append(key, value);
        var url = "";
        dataService.postData(__URL + url, params).then(function (data) {
            if (data > 0) {
                
            } else {
                layer.msg("工单添加失败，请重试", { icon: 5 });
                return;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //开启会话
    $scope.open_session = function () {
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        var protocol = ('https:' == location.protocol) ? 'wss://' : 'ws://';
        var gw = $scope.service.selectItem.xcsessionip;
        var s = "server=192.168.7.100&port=22&user=root&pwd=xincheneim2415&mapClipboard=on&fontSize=13&terminalType=xterm&clear=Clear&clear=Delete&save=Save&connect=Connect";
        var r = new svGlobal.SSH(protocol + gw + '/SSH?' + s, wWidth, wHeight);
        r.onclose = function () {
            r.hide();
            //$id('login').style.display = 'block';
        };
        r.addSurface(new svGlobal.LocalInterface());
        r.onerror = function (e) {
            console.log(e.name + ':' + e.message);
        };
        r.run();
    }
    //加入会话
    $scope.join_session = function () {

    }






    $scope.btn_add = function () {
        
    }


}]);




