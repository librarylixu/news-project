angular.module('AceApp')
.controller('eimMydevicegroupController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;
    /*
        查询（本页面使用）数据
        flag 1 强制刷新
    */
    $scope.select = function (flag) {
        var params = new URLSearchParams();
        if (flag == 1 || $scope.service.oldmydevicegroupData == undefined) {
            //$scope.service.oldmydevicegroupData
            select_mydevicegroup(params).then(function (res) {
                //console.log();
                //第一层状态，无序的数组  data    
                $scope.service.oldmydevicegroupData = $scope.service[res];
                //临时数据源，中间的大圈
                $scope.service.treemydevicegroupdata = $scope.createNewData();
                //先去重新重新组建数据
                $scope.devicesData();
                
                layer.msg('数据已刷新', { icon: 6 });
            });
        }
    }
    /*
   组建父子之间的关系结构
   */
    $scope.createNewData = function () {
        var tempData = [];

        angular.forEach($scope.service.oldmydevicegroupData, function (value, key) {

            var i = value.pid;
            if (i == '0' || i == -1 || $scope.service.oldmydevicegroupData[i] == undefined) {
                value.isParent = true;
                value.usertypeCount = 0;
                tempData.push(value);
                return;
            }
            $scope.service.oldmydevicegroupData[i].isParent = true;
            if ($scope.service.oldmydevicegroupData[i].children == undefined) {
                $scope.service.oldmydevicegroupData[i].children = [value];


            } else {
                $scope.service.oldmydevicegroupData[i].children.push(value);
            }

        });

        return tempData;
    }
    //查询资产设备
    $scope.selectdevice = function () {
        $scope.service.assetsdeviceData = [];//资产
        var params = new URLSearchParams();
        params.append('$json', true);
        //判断是否关联有资产设备
        if ($scope.service.deviceidarr['asset'] != undefined && $scope.service.deviceidarr['asset'].length > 0) {
            params.append('$in', true);
            params.append('idassetslist', $scope.service.deviceidarr['asset'].join(','));
            select_assetsdevice(params);
        }
    }
    //查询kvm设备
    $scope.selectkvmlist = function () {
        $scope.service.kvmdeviceData = [];//KVM
        var params = new URLSearchParams();
        params.append('$json', true);
        //判断是否关联有资产设备
        if ($scope.service.deviceidarr['kvm']!=undefined && $scope.service.deviceidarr['kvm'].length > 0) {
            params.append('$in', true);
            params.append('idkvmlist', $scope.service.deviceidarr['kvm'].join(','));
            select_kvmdevicelist(params);
        }
    }
    //查询PDU
    $scope.selectpdulist = function () {
        $scope.service.dpulist = [];//PDU
        var params = new URLSearchParams();
        params.append('$json', true);
        //判断是否关联有资产设备
        if ($scope.service.deviceidarr['pdu']!=undefined && $scope.service.deviceidarr['pdu'].length > 0) {
            params.append('$in', true);
            params.append('iddpulist', $scope.service.deviceidarr['pdu'].join(','));
            select_dpulist(params);
        }
    }
    //查询PDU端口
    $scope.selectpduportlist = function () {
        $scope.service.dpuportlistData = [];//PDU
        var params = new URLSearchParams();
        params.append('$json', true);
        //判断是否关联有资产设备
        if ($scope.service.deviceidarr['pdu'] != undefined && $scope.service.deviceidarr['pdu'].length > 0) {
            params.append('$in', true);
            params.append('dpuid', $scope.service.deviceidarr['pdu'].join(','));
            select_dpuportlist(params);
        }
    }
    ////查询虚拟机
    //$scope.selectvmdevicelist = function () {
    //    var params = new URLSearchParams();
    //    params.append('$json', true);
    //    //判断是否关联有资产设备
    //    if ($scope.service.deviceidarr['kvm'].length > 0) {
    //        params.append('$in', true);
    //        params.append('idkvmlist', $scope.service.deviceidarr['kvm'].join(','));
    //    }
    //    select_kvmdevicelist(params).then(function (res) {
    //    });
    //}
    //重新组建数据源
    $scope.devicesData = function () {
        $scope.service.deviceidarr = {};//需要查询的各种设备id   object
        for (i = 0; i < $scope.service.oldmydevicegroupData.length; i++) {
            if ($scope.service.oldmydevicegroupData[i].deviceid == null || $scope.service.oldmydevicegroupData[i].deviceid == undefined) {
                $scope.service.oldmydevicegroupData[i].deviceid = '';
            }
            if ($scope.service.oldmydevicegroupData[i].deviceid.indexOf('kvm') > 0) {
                $scope.service.deviceidarr["kvm"] = JSON.parse($scope.service.oldmydevicegroupData[i].deviceid)["kvm"];
            }
            if ($scope.service.oldmydevicegroupData[i].deviceid.indexOf('pdu') > 0) {
                $scope.service.deviceidarr["pdu"] = JSON.parse($scope.service.oldmydevicegroupData[i].deviceid)['pdu'];
            }
            if ($scope.service.oldmydevicegroupData[i].deviceid.indexOf('asset') > 0) {
                $scope.service.deviceidarr['asset'] = JSON.parse($scope.service.oldmydevicegroupData[i].deviceid)['asset'];
            }
            if ($scope.service.oldmydevicegroupData[i].deviceid.indexOf('vmdevice') > 0) {
                $scope.service.deviceidarr['vmdevice'] = JSON.parse($scope.service.oldmydevicegroupData[i].deviceid)['vmdevice'];
            }
        }
        //查询PDU
        $scope.selectpdulist();
        //查询PDU端口
        $scope.selectpduportlist();
        //查询kvm设备
        $scope.selectkvmlist();
        //查询资产设备
        $scope.selectdevice();
        
    }
    //添加设备组按钮
    $scope.adddevicegroup = function (node) {
        $scope.service.selectItem = '';
        $scope.service.title = '新建我的设备组';
        $scope.modalHtml = __URL + 'Eimsystemsetting/Mydevicegroup/openmodal';
        $scope.modalController = 'modalMydevicegroupController';
        if (node != undefined) {
            $scope.service.selectItem = node;
        }
        publicControllerAdd($scope);
    }
    //修改设备组按钮
    $scope.updatedevicegroup = function (node) {
        $scope.service.title = "修改我的设备组";
        $scope.modalHtml = __URL + 'Eimsystemsetting/Mydevicegroup/openmodal';
        $scope.modalController = 'modalMydevicegroupController';
        $scope.service.selectItem = node;
        publicControllerUpdate($scope);
    }
    //删除设备组按钮
    $scope.removedevicegroup = function (node) {
        $scope.service.title = '删除我的设备组';
        $scope.modalHtml = __URL + 'Eimsystemsetting/Mydevicegroup/openmodal';
        $scope.modalController = 'modalMydevicegroupController';
        $scope.service.selectItem = node;
        publicControllerDel($scope);
    }
    //页面加载完成后，查询数据
    $scope.select(0);
}]);




