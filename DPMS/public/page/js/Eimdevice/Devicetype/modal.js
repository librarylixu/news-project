angular.module('AceApp')
.controller('modalDevicetypeController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.url = __URL + 'Eimdevice/Devicetype/add_page_data';
    /*
    保存信息
    @cuslevel
    添加本页面得数据时： cuslevel 0一次添加 1连续添加 不关闭窗口
    在添加关系时： checked得属性，true为选中状态和false为为选中状态
    */
    $scope.save = function (cuslevel) {
        $scope.params = new URLSearchParams();
        if ($scope.service.Action == 1) {
            $scope.params.append('iddevicetype', $scope.Source.selectItem.iddevicetype);
            $scope.url = __URL + 'Eimdevice/Devicetype/update_page_data';
            
        }       
        $scope.params.append('typename', $scope.Source.selectItem.typename);
        if ($scope.Source.selectItem.labelclass) {
            $scope.params.append('labelclass', $scope.Source.selectItem.labelclass);
        } else {
            $scope.params.append('labelclass', '#5661c9');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data > 0) {
                if ($scope.service.Action == 1) {
                    $scope.service.devicetypeData[$scope.Source.selectItem.iddevicetype] = angular.copy($scope.Source.selectItem);
                    
                    //修改成功
                    layer.msg('修改成功', { icon: 6 });
                   
                } else {
                    var newData = {
                        _kid: data,
                        iddevicetype:data,
                        typename: $scope.Source.selectItem.typename,
                        labelclass: $scope.Source.selectItem.labelclass ? $scope.Source.selectItem.labelclass : '#5661c9'
                    };
                    dataService.addData('devicetypeData', newData);
                    //修改成功
                    layer.msg('添加成功', { icon: 6 });
                }
                $uibModalInstance.close('ok');
                return;                
            }
            //修改失败
            layer.msg($scope.service.Action==1?'修改':'添加'+'失败', { icon: 5 });
        }, function (error) {
            console.log(error);
        });
    };
    /*
    关联设备型号
    */
    $scope.modelchange = function (modelchangeData) {
        console.log(modelchangeData);
        if ($scope.Source.Action != 1) {
            alert.show('非法操作', 'Error');
            return;
        }
        console.log(modelchangeData);
        var params = new URLSearchParams();
        var url = __URL + 'Eimdevice/Modeltype/update_page_data';
        params.append('idmodeltype', modelchangeData.idmodeltype);
        if (modelchangeData.checked) {
            //勾选
            params.append('typeid', $scope.Source.selectItem.iddevicetype);
        } else {
            //取消勾选
            params.append('typeid', '');
        }
        $scope.Source.postData(url, params).then(function (data) {
            console.log(data);
            //与设备类型添加关系
            if (data > 0) {
                if (modelchangeData.checked) {
                    //更新service中的关系数据源
                    $scope.service.modeltypeData[modelchangeData.idmodeltype].typeid = $scope.Source.selectItem.iddevicetype;
                } else {
                    $scope.service.modeltypeData[modelchangeData.idmodeltype].typeid = null;
                }
            } else {
                alert.show('关系添加失败', '添加设备类型与设备型号关系');
                modelchangeData.checked = !modelchangeData.checked;
            }
        }, function (error) {
            console.log(error);
        });

    }
    /*
    添加设备型号
    */
    $scope.Addmodeltype = function () {
        $scope.service.title = "添加新的设备型号";
        $scope.modalHtml = __URL + 'Eimdevice/Modeltype/openmodal';
        $scope.modalController = 'modalModeltypeController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {

            }
        });
    }

    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
