angular.module('AceApp')
.controller('eimSessioncenterController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    /*
        查询（本页面使用）数据
        flag 1 强制刷新
    */
    $scope.select = function (flag) {
        var params = {};
        params['$json'] = true;
        select_sessioncenterlist(params);
    }
    //添加按钮
    $scope.btn_add = function () {
        $scope.service.title = '新建会话控制中心';
        $scope.modalHtml = 'Eimsystemsetting/Sessioncenterlist/openmodal';
        $scope.modalController = 'modalsessioncenterController';
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.btn_updateInfo = function (row) {
        $scope.service.title = "修改会话控制中心";
        $scope.modalHtml = 'Eimsystemsetting/Sessioncenterlist/openmodal';
        $scope.modalController = 'modalsessioncenterController';
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.btn_deleteInfo = function (row) {
        var index = layer.open({
            content: '请确认是否删除【' + row.name + '】中心？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['470px'],
            title: '删除控制中心',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['idsessioncenter'] = row.idsessioncenterlist;
                $scope.service.postData(__URL + 'Eimsystemsetting/Sessioncenterlist/del_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('删除成功', { icon: 1 });
                        row._kid = row.idsessioncenterlist;
                        $scope.service.delData('sessioncenterData', row);
                    }
                });
                layer.close(index);
            }
        });
    }
    //详细配置  -  会话控制中心详细配置
    $scope.btn_configinfo = function (row) {
        $scope.service.title = '会话控制中心详细配置';
        $scope.modalHtml ='Eimsystemsetting/Sessioncenterlist/openmodalconfig';
        $scope.modalController = 'modalconfigController';
        $scope.service.selectItem = row;
        $scope.service.openModal($scope.modalHtml, $scope.modalController);
    }
    ////应用配置 将Gateway的config配置以文件的形式保存到指定目录
    //$scope.btn_saveConfig = function (configdata) {
    //    //console.log(configdata.configtxt);
    //    var params = {};
    //    params['configtxt']= configdata.configtxt;
    //    var url = __URL + 'Eimsystemsetting/Sessioncenterlist/saveconfigfile';
    //    $scope.service.postData(url, params).then(function (data) {
    //        if (true) {
    //            console.log(data);
    //        }
    //    });
    //}

    $scope.btn_open_sessions = function (row) {
        var modalHtml = __URL + 'Eimsystemsetting/Sessioncenterlist/open_session_config_page?id=' + row.idsessioncenterlist;
        var layerindex = layer.open({
            type: 2,
            title: row.name + ' 活动连接',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            //area: ['893px', '600px'],
            content: modalHtml
        });
        layer.full(layerindex);
    }
    //页面加载完成后，查询数据
    $scope.select();
}]).controller('modalsessioncenterController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL;  
    switch ($scope.Source.Action) {
        case 0:
            $scope.Source.selectItem.licensecount = $scope.service.privateDateObj.licensedata[5];
            $scope.url += 'Eimsystemsetting/Sessioncenterlist/add_page_data';
            break;
        case 1:
            $scope.Source.selectItem.licensecount = $scope.service.privateDateObj.licensedata[$scope.Source.selectItem.licensecount];
            $scope.url += 'Eimsystemsetting/Sessioncenterlist/update_page_data';
            break;
       
        default:
            alert.show('Action Error!');
            break;
    }
    /*
    保存信息
    @cuslevel
    添加本页面得数据时： cuslevel 0一次添加 1连续添加 不关闭窗口
    在添加关系时： checked得属性，true为选中状态和false为为选中状态
    */
    $scope.save = function (cuslevel) {
        var params = {};
        var num=0;
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                params['idsessioncenterlist']= $scope.Source.selectItem.idsessioncenterlist;
            }
            angular.forEach($scope.Source.selectItem,function(value,key){
                if(value!=$scope.service.selectItem[key]){
                    params[key]= $scope.Source.selectItem[key];
                    num++;
                }
            });                 
        $scope.Source.postData($scope.url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 0) {
                        //添加失败
                        layer.msg('添加失败', { icon: 5 });
                        break;
                    }
                    $scope.Source.selectItem.idsessioncenterlist=data;
                    $scope.Source.selectItem._kid=data;
                    //更新service数据源
                    dataService.addData('sessioncenterData', $scope.Source.selectItem);
                    //status 0一次添加 
                    $uibModalInstance.close('ok');
                    layer.msg('添加成功', { icon: 6 });
                    break;
                case 1:
                    if (data == 1) {
                        //修改成功                        
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idsessioncenterlist;
                        dataService.updateData('sessioncenterData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg('修改成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    layer.msg('修改失败', { icon: 5 });
                    break;
                        }
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]).controller('modalconfigController', ['$scope', 'dataService', '$uibModalInstance', 'ngVerify', function ($scope, dataService, $uibModalInstance, ngVerify) {
    $scope.Source = angular.copy(dataService);//要显示到页面上的数据源
    $scope.service = dataService;

    if (!$scope.Source.selectItem.configtxt) {
        $scope.Source.configData = configData;
    } else {
        $scope.Source.configData = JSON.parse($scope.Source.selectItem.configtxt);
    }

    $scope.btn_save = function () {
        var saveConfigData = angular.copy($scope.Source.configData);
        if (saveConfigData.bindAddr) {
            delete saveConfigData.bindAddr;
        }
        var params = {};
        params['idsessioncenterlist']= $scope.service.selectItem.idsessioncenterlist;
        params['configtxt']= JSON.stringify(saveConfigData);
        $scope.Source.postData(__URL + "Eimsystemsetting/Sessioncenterlist/update_page_data", params).then(function (data) {
            if (data == 1) {
                $scope.service.selectItem.configtxt = JSON.stringify(saveConfigData);
                layer.msg('保存成功', { icon: 6 });
                $uibModalInstance.close();
                return;
            }
            //修改失败
            layer.msg('保存失败', { icon: 5 });
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);





