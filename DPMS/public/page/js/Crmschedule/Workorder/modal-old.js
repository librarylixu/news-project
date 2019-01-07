//添加编辑的控制器
/*
modal+业务+Controller

新增一个字段 _kid 值为当前数据源id的值

此控制器中仅用作了工单中的删除功能
*/
appModule.controller('modalWorkorderController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //根据表里userid获取工单创建人/指派人
    $scope.getusername = function (userid) {
        if (userid!=undefined && $scope.service.usersData != undefined) {
            return $scope.service.usersData[userid].username + ': ' + $scope.service.usersData[userid].description;
        }
    }
    //项目提示框title和代码段路径
    $scope.dynamicPopover = {
        templateUrl: __URL + 'Crmschedule/Workorder/statusChange',
        title_assign: '选择指派人',
    };
    $scope.service.usersDataArr;
    //获取此处是在进行哪个步骤的操作
    $scope.changeStatus = function (row) {
        if (row == 4) {
            $scope.Source.Action = 4;
            $scope.service.assignid = $scope.getusername($scope.service.selectItem.assignid);
        }
    }
    //初始化getEditor
    if ($scope.Source.Action.toString() == "4") {
        //初始化配置富文本编辑器 
        ue = UE.getEditor('container_workorderme', {
            elementPathEnabled: false, //删除元素路径
            wordCount: false,    //删除字数统计
            toolbars: [['fullscreen']],
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            zIndex: 1
        });
        //等编辑器准备就绪之后，再去查询
        ue.addListener('ready', function (container_message) {
            $scope.selectMessage(); //查询工单原因描述 - mongo
        });
        //查询工单的内容
        $scope.selectMessage = function () {
            if ($scope.service.workorderDataMessage != undefined) {
                return;
            }
            var params = new URLSearchParams();
            params.append('workid', $scope.service.selectItem.idworkorder);
            params.append('guid', $scope.service.selectItem.guid);
            select_workorder_message(params).then(function () {
                //加载文本编辑器的初始化内容
                //_$scope.service.workorderDataMessage
                if ($scope.service.workorderData && $scope.service.workorderDataMessage != null && $scope.service.workorderDataMessage != undefined) {
                    ue.setContent($scope.service.workorderDataMessage.causedescription);
                }
                ue.setDisabled('');
            })
        }
    }

   
    //回车保存新建客户
    $scope.saveAddCustomer = function (e) {

        //IE 编码包含在window.event.keyCode中，Firefox或Safari 包含在event.which中
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            if (ngVerify.checkElement(contant, true)) {
                $scope.save();
                $scope.Source.editType = 0;
            }
        }
    };
    $scope.url = __URL;
    //新增一个字段 _kid 值为当前数据源id的值
    $scope.Source.selectItem._kid = $scope.Source.selectItem.idworkorder;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmschedule/Workorder/add_page_data';
            break;
        case 2:
            $scope.url += 'Crmschedule/Workorder/del_page_data';
            break;
        case 4:
            $scope.url += 'Crmschedule/Workorder/update_page_data';
            break;
        default:
            alert.show('Action Error!', 'Error');
            $uibModalInstance.dismiss('cancel');
            break;
    }

    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口
    李旭  --- 此处进行了一次扩展（代码优化度差，方便二次修改此处注释）
    status 在添加时用于传title 在删除时用于传id
    但是当进入到确认工单中save方法额外接受两个参数（改派）
    status为select下拉的item
    type用于区分
    确认工单（确认工单按钮）
    只需要传id
    */
    $scope.save = function (status,model,type) {
        $scope.params = new URLSearchParams();
        if($scope.Source.Action == 0){
            $scope.params.append('title', $scope.Source.selectItem.title);
        }else if ($scope.Source.Action == 2) {
            $scope.params.append('idworkorder', $scope.Source.selectItem.idworkorder);
        } else if (type == 3) {
            //检测如果指派的是自己则return
            if ($scope.service.workorderData[$scope.Source.selectItem.idworkorder].assignid == status.idusers) {
                return;
            }
            //更新数据源，但是不存数据库（存储操作改完集体存储）
            $scope.Source.selectItem.assignid = status.idusers;
            $scope.service.workorderData[$scope.Source.selectItem.idworkorder].assignid = status.idusers;
            $scope.Source.status = status;
            return;
        }else if ($scope.Source.Action == 4 && type!=3) {
            $scope.params.append('idworkorder', $scope.Source.selectItem.idworkorder);
            $scope.params.append('status', '1');
            $scope.params.append('confirm', true);//标记确认工单
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    //添加
                    if (data.id > 0) {
                        if (Object.prototype.toString.call($scope.service.workorderData) == '[object Array]') {
                            $scope.service.workorderData = {};
                        }
                       
                        dataService.addData('workorderData', {
                            _kid: data.id,
                            idworkorder: data.id,
                            title: $scope.Source.selectItem.title,
                            guid:data.guid,
                            createtime: new Date(),
                            del: 0,
                            index: 0,
                            assignid: $scope.service.userid,
                            userid: $scope.service.userid,
                        });
                        $uibModalInstance.close('ok');
                        window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/addworkorder?id=' + data.id + '&guid=' + data.guid, $scope.Source.selectItem.title);
                        //$scope.updateInfo(data);
                        break; 
                    }
                    alert.show('添加失败', '添加工单');
                    break;
                case 2:
                    //删除
                    if (data == 1 || data > 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除工单');
                        dataService.delData('workorderData', $scope.Source.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除工单');
                    break;
            }
            if ($scope.Source.Action == 4 && type!=3) {
                //确认工单
                if (data == 1 || data > 1) {
                    $scope.service.workorderData[$scope.Source.selectItem.idworkorder].status = 1;
                    $uibModalInstance.close('ok');
                    alert.show('确认成功', '确认工单');
                    return;
                }
                alert.show('确认失败', '确认工单');
            }
        }, function (error) {
            console.log(error);
        });
    };
    /*
        确认指派
        指派上面已经做完了，此处是做指派原因的保存
    */
    $scope.save_assign = function () {
        $scope.params = new URLSearchParams();
        //$scope.params['type'] = 'Workorder';
        //$scope.params['refid'] = $scope.Source.selectItem.idworkorder;
        //$scope.params['text'] = '工单改派给：'+ $scope.service.workorderData[$scope.Source.selectItem.idworkorder].assignid + ';指派原因：'+$scope.Source.mark;
        $scope.params.append('idworkorder', $scope.Source.selectItem.idworkorder);
        $scope.params.append('assignid', $scope.Source.status.idusers);
        $scope.params.append('assignname', $scope.service.usersData[$scope.Source.status.idusers].username + ': ' + $scope.service.usersData[$scope.Source.status.idusers].description);
        $scope.params.append('mark', $scope.Source.mark);
        $scope.url = __URL + 'Crmschedule/Workorder/update_page_data';
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            alert.show('指派成功', '工单指派');
            $uibModalInstance.close('ok');
            return;
        })
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        refresh();
    };
}]);