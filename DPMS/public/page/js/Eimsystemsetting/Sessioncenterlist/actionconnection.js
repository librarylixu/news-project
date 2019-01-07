angular.module('myapp', [])
.controller("eimsessionconfigController", ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.selectItem = {};
    $scope.service = {};
    if (idsessioncenterlist == "") {
        layer.msg("页面错误，请重试");
        return;
    }
    //根据idsessioncenterlist查询会话控制中心
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('idsessioncenterlist', idsessioncenterlist);
        //$scope.service.sessioncenterData
        var url = __URL + 'Eimsystemsetting/Sessioncenterlist/select_page_data';
        axios.post(url, params)
         .then(function (response) {
             $scope.$apply(function () {
                 $scope.service.sessioncenterData = response.data;
                 $scope.selectItem.xcsessioncenter = $scope.service.sessioncenterData[idsessioncenterlist].ip + ":" + $scope.service.sessioncenterData[idsessioncenterlist].port;
                 console.log($scope.service.sessioncenterData[idsessioncenterlist].configtxt);
                 $scope.service.sessioncenterData[idsessioncenterlist].configdata = JSON.parse($scope.service.sessioncenterData[idsessioncenterlist].configtxt);
                 $scope.selectItem.password = $scope.service.sessioncenterData[idsessioncenterlist].configdata.password;
             });
         }).catch(function (error) {
             layer.msg("页面错误，请重试");
             return;
         });

    }
    $scope.select();

    //刷新会话列表    
    $scope.btn_refresh = function () {
        /*
                //sparkConfig.config(sparkConfig.getGatewayAddr(), "sessions", "get", c)

        //var b = sparkConfig.getGatewayAddr() + "/CONF?type=sessions&action=get&gwPwd=xincheneim2415";
        //var result = hi5.tool.openWebSocket(b);
        ////sparkConfig.config(sparkConfig.getGatewayAddr(), "sessions", "get", c)
        ////function (b, a, c, d, e, f) {
        //hi5.tool.openWebSocket(b, e, d)
        */
        if ($scope.selectItem.password == undefined) {
            layer.msg("页面错误，请重试");
            return;
        }
        layer.msg('加载中...', { icon: 16, shade: 0.01 });
        sparkConfig.refreshSessions();
        //延迟加载，等待refreshSessions刷新完成后
        $timeout(function () {
            $scope.service.sessions = [];
            angular.forEach(sparkConfig.sessions.rows, function (value, key) {
                var item = {};
                item.id = value[0];
                item.server = value[1];
                item.clientip = value[2];
                item.browser = value[3];
                //CST时间转GMT时间
                item.starttime = P_getTaskTime(value[4]);
                item.numericid = value[5];
                item.user = value[6];
                item.domain = value[7];
                item.join = value[8];
                item.protocol = value[9];
                item.symlink = value[10];
                item.thumbnail = value[11];
                item.port = value[12];
                $scope.service.sessions.push(item);
            });
            layer.msg('刷新成功', { icon: 6 });
        }, 1000);
    }
    //加入会话
    $scope.btn_join_session = function (item) {
        console.log(item);
        var c = "";
        switch (item.protocol) {
            case "RFB":
                c = "joinvnc";
                break;
            case "SSH":
                c = "joinssh";
                break;
            case "TELNET":
                c = "jointelnet";
            case "RDP":
                c = "join";
        }
        var layerndex = layer.confirm('确定要加入当前会话么？', {
            btn: ['确定', '取消'] //按钮
        }, function () {

            //svManager.getInstance().requestControl();
            //return;

            //http://192.168.7.110:1336/joinssh.html?id=152365875
            var a = location.protocol + "//" + $scope.selectItem.xcsessioncenter + "/" + c + ".html?name=admin&id=" + item.id;
            window.open(a, '_blank');
            layer.close(layerndex);
        });

        //$timeout(function () {
        //    //0:所有人可控制,1:仅开启者可控制
        //    svManager.getInstance().setJoinMode(0);
        //}, 1000);

    }

    //终止会话
    //sparkConfig.config(sparkConfig.getGatewayAddr(), "sessions", "remove", c, null, "&id=882aa617-cfb6-40e1-b520-da73af57bb5b")
    $scope.btn_remove_session = function (item) {
        console.log(sparkConfig.getGatewayAddr());
        //b = b + "/CONF?type=" + a + "&action=" + c;
        //ws://www.ppkive.com:1336/CONF?type=sessions&action=remove&id=0fef49de-a7f6-4f9e-b64e-21e9b7a5df2d&gwPwd=xincheneim2415
        //sparkConfig.config(sparkConfig.getGatewayAddr(), "sessions", "remove", "", null, "&id=" + item.id);

        //var b = "ws://www.ppkive.com:1336/CONF?type=sessions&action=remove&id=706066207&gwPwd=xincheneim2415";
        //var result = hi5.tool.openWebSocket(b);
        //hi5.tool.openWebSocket("ws://www.ppkive.com:1336/CONF?type=sessions&action=remove&id=706066207&gwPwd=xincheneim2415");
        var layerindex = layer.confirm('确定要关闭当前会话么？', {
            btn: ['关闭', '取消'] //按钮
        }, function () {
            sparkConfig.notify("当前会话已被[管理员]终止，会话将在5秒后关闭", [item.numericid]);
            layer.msg('操作成功,会话将在5秒后关闭', { icon: 1 });
            $timeout(function () {
                //ws://192.168.7.252:1339/CONF?type=sessions&action=remove&id=3d71462e-d49c-48a3-9051-d5a79fd944a9&gwPwd=xincheneim2415
                var b = sparkConfig.getGatewayAddr() + "/CONF?type=sessions&action=remove&id=" + item.id + "&gwPwd=xincheneim2415";
                var result = hi5.tool.openWebSocket(b);
                layer.msg('操作成功', { icon: 1 });
            }, 5000);
        });
    }
    //发送消息
    $scope.btn_sendmsg_session = function (item) {
        layer.prompt({ title: '请输入消息内容，并确认', formType: 2 }, function (text, index) {
            var content = "来自[管理员]的消息：" + text;
            //item=0,给全部连接发送消息
            if (item == 0) {
                sparkConfig.notify(content);
            } else {
                sparkConfig.notify(content, [item.numericid]);
            }
            layer.close(index);
            layer.msg("发送成功");
        });
    }


}]);