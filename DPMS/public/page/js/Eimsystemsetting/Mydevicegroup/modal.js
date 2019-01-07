/*模态框控制器（增删改查）*/
angular.module('AceApp')
.controller('modalMydevicegroupController', ["$scope", "$uibModalInstance", 'dataService', function ($scope, $uibModalInstance, dataService) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.selectGroupItem = 0;
    //需要传给页面数据更新的参数
    var newdata = {};

    //查找父级组并选中
    $scope.findParent = function (_data, node, _id) {
        //查找父级，并选中
        for (var i = 0; i < _data.length; i++) {

            _data[i].checked = false;

            if (_data[i].idmydevicegroup == _id) {
                _data[i].checked = true;
                return;

            } else if (_data[i].children && _data[i].children.length > 0) {
                $scope.findParent(_data[i].children, node, _id);
            }
        }
    }
    //查找父级,并更新數據源
    $scope.findParentdata = function (_data, node, _id) {
        //查找父级，并选中
        for (var i = 0; i < _data.length; i++) {
            if (_data[i].idmydevicegroup == _id) {
                if (_data[i].children !== undefined && _data[i].children !== null) {
                    _data[i].children.push(node);
                } else {
                    _data[i].children = [node];
                }
                return;

            } else if (_data[i].children && _data[i].children.length > 0) {
                $scope.findParent(_data[i].children, node, _id);
            }
        }
    }
    //选中某项
    $scope.showSelected = function (sel) {
        sel.checked = !sel.checked;
        $scope.selectGroupItem = sel;
    };

    $scope.url = __URL + 'Eimsystemsetting/';
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Mydevicegroup/add_page_data';
            if ($scope.Source.selectItem) {
                $scope.Source.selectItem.groupname += '---子集组';
                //生不带来----论checked属性的一生
                $scope.findParent($scope.Source.treemydevicegroupdata, $scope.Source.selectItem, $scope.Source.selectItem.idmydevicegroup);
                $scope.selectGroupItem = $scope.Source.selectItem;
            }
            break;
        case 1:
            $scope.url += 'Mydevicegroup/update_page_data';
            //生不带来----论checked属性的一生
            $scope.findParent($scope.Source.treemydevicegroupdata, $scope.Source.selectItem, $scope.Source.selectItem.pid);
            break;
        case 2:
            $scope.url += 'Mydevicegroup/del_page_data';
            break;
        default:
            alert('Action Error!');
            break;
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口 2删除  3 用户和用户角色cheked改变状态保存
    */
    /*状态*/
    $scope.save = function () {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.params.append('idmydevicegroup', $scope.Source.selectItem.idmydevicegroup);
            $scope.params.append('pid', $scope.Source.selectItem.idmydevicegroup);
            $scope.params.append('$or', true);
        } else if ($scope.Source.Action == 0 || $scope.Source.Action == 1) {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idmydevicegroup', $scope.Source.selectItem.idmydevicegroup);
            }
                $scope.params.append('groupname', $scope.Source.selectItem.groupname);
            if ($scope.selectGroupItem != 0) {
                $scope.params.append('pid', $scope.selectGroupItem.idmydevicegroup);
                $scope.Source.selectItem.pid = $scope.selectGroupItem.idmydevicegroup;
            } else {
                $scope.params.append('pid', 0);
                $scope.Source.selectItem.pid = 0;
            }
        }


        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data == undefined) {
                        //添加失败
                        alert.show('添加失败', '添加设备组');
                        break;
                    }
                    //死不带去----论checked属性的一生
                    $scope.Source.selectItem.checked = false;
                    //$scope.Source.selectItem = data;
                    $uibModalInstance.close('ok');
                    $scope.Source.selectItem.groupname = $scope.service.selectItem.groupname;
                    layer.msg('添加成功', { icon: 6 });
                    $scope.service.treemydevicegroupdata.push($scope.Source.selectItem);

                    //更新service数据源 
                    //$scope.findParentdata($scope.service.treemydevicegroupdata, $scope.Source.selectItem, $scope.selectGroupItem.idmydevicegroup);
                    //1连续添加 不关闭窗口
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功
                        //死不带去----论checked属性的一生
                        $scope.Source.selectItem.checked = false;
                        if ($scope.Source.selectItem.pid == 0) {
                            $scope.Source.selectItem._kid = $scope.Source.selectItem.idmydevicegroup;
                            dataService.updateData('treemydevicegroupdata', $scope.Source.selectItem);
                        } else {
                            //当编辑完成后，当前组父级发生了改变，就把原来组的当前组删掉，然后添加当前组到新的父级组
                            angular.forEach($scope.service.treemydevicegroupdata, function (val, k) {
                                if (val.children == undefined || val.children == null) {
                                    val.children = [];
                                }
                                //原来组的当前组删掉
                                if (val.idmydevicegroup == $scope.service.selectItem.pid && val.children !== undefined) {
                                    removeByValue(val.children, $scope.service.selectItem);
                                }
                                //添加当前组到新的父级组
                                if (val.idmydevicegroup == $scope.Source.selectItem.pid && val.children !== undefined) {

                                    val.children.push($scope.Source.selectItem);
                                }
                            });
                        }

                        $uibModalInstance.close('ok');
                        layer.msg('修改成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    layer.msg('修改失败', { icon: 5 });
                    break;
                case 2:
                    //删除
                    if (data > 0) {

                        if ($scope.Source.selectItem.pid == 0) {
                            $scope.Source.selectItem._kid = $scope.Source.selectItem.idmydevicegroup;
                            dataService.delData('treemydevicegroupdata', $scope.service.selectItem);
                        } else {
                            angular.forEach($scope.service.treemydevicegroupdata, function (val, k) {
                                if (val.idmydevicegroup == $scope.service.selectItem.pid && val.children !== undefined) {
                                    removeByValue(val.children, $scope.service.selectItem);
                                }
                            });
                        }
                        layer.msg('删除成功', { icon: 6 });
                        $uibModalInstance.close();
                        break;
                    }
                    layer.msg('删除失败', { icon: 5 });
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
}])