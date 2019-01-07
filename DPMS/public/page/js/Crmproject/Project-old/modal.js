//添加编辑项目的控制器
appModule.controller('saveProjectController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert,  $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    
    //临时数据源，中间的大圈
    $scope.tempData = [];
    //回车保存新建客户
    $scope.saveAddCustomer = function (e) {

        //IE 编码包含在window.event.keyCode中，Firefox或Safari 包含在event.which中
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.save(0);

        }
    };
    /*
    组建父子之间的关系结构
    */
    $scope.createNewData = function () {
        angular.forEach($scope.Source.usergroupData, function (value, key) {
            var i = value.pid;
            if (i == -1 || i == '0') {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
                //$scope.service.oldusergroupData[i] == undefined  : 此处为了防止找不到pid得情况，从而导致js报错，页面数据丢失
            } else if ($scope.Source.usergroupData[i] == undefined) {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
            } else if ($scope.Source.usergroupData[i].children == undefined) {
                $scope.Source.usergroupData[i].children = [value];
                $scope.Source.usergroupData[i].isParent = true;
            } else {
                $scope.Source.usergroupData[i].children.push(value);
                $scope.Source.usergroupData[i].isParent = true;
            }
        });
        console.log($scope.tempData);
        return $scope.tempData;
    }
  
    //选中某项
    $scope.showSelected = function (sel) {
        $scope.selectedNode = sel;
        sel.checked = !sel.checked;
        $scope.save($scope.selectedNode);
        console.log($scope.Source.Action);
    };
    //查找到匹配的选项并选中
    $scope.selectOptions = function (ids_arr,totalData,checkedName) {
        for (var id=0; id < ids_arr.length; id++) {
            totalData[ids_arr[id]].checked = true;
           checkedName.push(value);
        }
    }
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
   

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
   
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };
   

    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmproject/Project/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmproject/Project/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmproject/Project/update_page_data';
            break;
        case 3:
            $scope.url += 'Crmproject/Project/update_page_data';//修改项目状态
            //把自己的用户找到并赋值为选中状态
            $scope.userChecked = [];
            angular.forEach($scope.Source.projectstatusData, function (value, key) {
                if (key == $scope.Source.selectItem.statusid) {
                    value.checked = true;
                    $scope.statusChecked.push(value);
                }
            });
            break;
        
      
        case 4:
            $scope.url += 'Crmproject/Project/update_page_data';//添加项目与用户关系
            //把自己的用户找到并赋值为选中状态
            //关联的所有用户id
            $scope.userIds = $scope.Source.selectItem['refusers'].split(",");
            $scope.userChecked = [];
            $scope.selectOptions($scope.userIds, $scope.Source.usersData, $scope.userChecked);
            break;
        case 5:
            $scope.url += 'Crmproject/Project/update_page_data';//添加项目与用户角色关系
            //把自己的用户角色找到并赋值为选中状态
            //关联的所有用户角色id
            $scope.usertypeIds = $scope.Source.selectItem['refutypes'].split(",");
            $scope.usertypeChecked = [];
            $scope.selectOptions($scope.usertypeIds, $scope.Source.usertypeData, $scope.usertypeChecked);
            break;
        case 6:
            $scope.url += 'Crmproject/Project/update_page_data';//添加项目与用户组关系            
            //把自己的用户组找到并赋值为选中状态
            //关联的所有用户组id
            $scope.ugroupIds = $scope.Source.selectItem['refugroups'].split(",");
            $scope.usergroupChecked = [];
            $scope.selectOptions($scope.ugroupIds, $scope.Source.usergroupData, $scope.usergroupChecked);
            //组件最终的tree数据源
            $scope.service.treedata = $scope.createNewData();
            break;
        case 7:
            $scope.url += 'Crmproject/Project/update_page_data';//添加项目与联系人关系
            //把自己的联系人找到并赋值为选中状态
            //关联的所有联系人id
            $scope.contactIds = $scope.Source.selectItem['refcontacts'].split(",");
            $scope.contactChecked = [];
            $scope.selectOptions($scope.contactIds, $scope.Source.contactData, $scope.contactChecked);
            break;
        case 8:
            $scope.url += 'Crmproject/Project/update_page_data';//添加项目与客户关系
            //把自己的客户找到并赋值为选中状态
            //关联的所有客户id
            $scope.customerIds = $scope.Source.selectItem['refcustomers'].split(",");
            $scope.customerChecked = [];
            $scope.selectOptions($scope.customerIds, $scope.Source.customerinfoData, $scope.customerChecked);
            break;
        default:
            parent.layer.msg('Action Error!', { icon: 5 });
            break;
    }
    /*
    保存信息
    project在添加本数据时 0一次添加 1连续添加 不关闭窗口
    project在添加关系数据时 project.checked  true为选中，false为未选中
    */
    //需要提交的字段
    $scope.columns = ['idproject', 'name', 'cusid', 'clientname', 'statusid', 'mark', 'userid', 'principal'];
  
    $scope.save = function (project) {
        $scope.params = new URLSearchParams();
        $scope.newdata = {};
        if ($scope.Source.Action == 2) {
            $scope.params.append('idproject', $scope.Source.selectItem.idproject);
            $scope.params.append('del', 1);//表中有del字段，修改为1 表示已经删除了
        } else if ($scope.Source.Action == 0) {
          
            //组建要提交的参数
            for (var i = 0; i < $scope.columns.length; i++) {
                if ($scope.Source.selectItem[$scope.columns[i]] != undefined && $scope.Source.selectItem[$scope.columns[i]] != null) {
                    //组建传给后台的数据
                    $scope.params.append($scope.columns[i], $scope.Source.selectItem[$scope.columns[i]]);
                    //组建更新参数数据
                    $scope.newdata[$scope.columns[i]] = $scope.Source.selectItem[$scope.columns[i]];
                }
            }           
            //此处进行额外判断:是否该权限下的项目信息中是否有重复得项目
            for (var i = 0; i < $scope.service.projectData.length; i++) {
                if ($scope.service.projectData[i].name == $scope.Source.selectItem['name'] && $scope.Source.Action == 0) {
                    //添加失败,该用户角色以存在
                    parent.layer.msg('添加失败,该项目[' + $scope.Source.selectItem['name'] + ']已存在', { icon: 5 });
                    return;
                }
            }
        }
        
    $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data.id < 1) {
                        //添加失败
                        parent.layer.msg('添加失败', { icon: 5 });
                        break;
                    }
                    $scope.addNewData = {
                        _kid: data.id,
                        idproject: data.id,
                        guid: data.guid,
                        name: $scope.Source.selectItem.name,
                        userid: $scope.service.userid,
                        createtime: new Date(),
                        starttime: 0,
                        endtime: 0,
                        clientname: '',
                        principal: '',
                        refannexs: '',
                        refcontactData: [],
                        refcontacts: '',
                        refcustomerData: [],
                        refcustomers: '',
                        refproductData: [],
                        refproductlist: null,
                        refstatusData: [],
                        refugroups: null,
                        refuserData: [],
                        refusergroupData: [],
                        refusers: null,
                        refusertypeData: [],
                        refutypes: null,
                        statusid: null,
                    }
                    dataService.addData('projectData', $scope.addNewData);                   
                    
                    if (project == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        $scope.service.updateInfo($scope.service.projectData[data.id]);
                        break;
                    }
                    break;
                case 1:
                    if (data>0) {
                        //修改成功    
                        $scope.Source.selectItem.updatetime = data.updatetime;
                        dataService.updateData('projectData', $scope.newdata);
                        $uibModalInstance.close('ok');
                        break;
                    }
                    //修改失败
                    parent.layer.msg('修改失败', { icon: 5 });

                    break;
                case 2:
                    //删除
                    if (data> 0) {
                        $uibModalInstance.close('ok');
                        parent.layer.msg('删除成功', { icon: 6 });
                        delete $scope.service.projectData[$scope.Source.selectItem.idproject];
                        //dataService.delData('projectData', $scope.Source.selectItem);
                        break;
                    }
                    parent.layer.msg('删除失败', { icon: 5 });
                    break;
                case 3:
                    //项目状态修改
                    if (data > 0) {                        
                            //更新Source中的数据源
                        $scope.Source.selectItem.statusid = project.idprojectstatus;                        
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
                case 4:
                    //关联用户
                    if (data > 0) {
                        if (project.checked) {
                            //更新Source中的关系数据源
                            if ($scope.Source.selectItem.refusers) {
                                $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers + ',' + project.idusers;
                            } else {
                                $scope.Source.selectItem.refusers = project.idusers;
                            }
                           
                        } else {
                            $scope.Source.selectItem.refusers = $scope.userIds.join(",");
                        }
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
                case 5:
                    //关联用户角色
                    if (data > 0) {
                        if (project.checked) {
                            //更新Source中的关系数据源
                            if ($scope.Source.selectItem.refutypes) {
                                $scope.Source.selectItem.refutypes = $scope.Source.selectItem.refutypes + ',' + project.idusertype;
                            } else {
                                $scope.Source.selectItem.refutypes =  project.idusertype;
                            }
                            
                        } else {
                            $scope.Source.selectItem.refutypes = $scope.usertypeIds.join(",");
                        }
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
                case 6:
                    //关联用户组
                    if (data > 0) {
                        if (project.checked) {
                            //更新Source中的关系数据源
                            if ($scope.Source.selectItem.refugroups) {
                                $scope.Source.selectItem.refugroups = $scope.Source.selectItem.refugroups + ',' + project.idusergroup;
                            } else {
                                $scope.Source.selectItem.refugroups =  project.idusergroup;
                            }
                            
                        } else {
                            $scope.Source.selectItem.refugroups =  $scope.ugroupIds.join(",");
                        }
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
                    case 7:
                    //关联联系人
                    if (data > 0) {
                        if (project.checked) {
                            //更新Source中的关系数据源
                            if ($scope.Source.selectItem.refcantacts) {
                                $scope.Source.selectItem.refcantacts = $scope.Source.selectItem.refcontects + ',' + project.idcontact;
                            } else {
                                $scope.Source.selectItem.refcantacts =  project.idcontact;
                            }
                           
                        } else {
                            $scope.Source.selectItem.refcantacts = $scope.contactIds.join(",");
                        }
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
                    case 8:
                    //关联客户
                    if (data > 0) {
                        if (project.checked) {
                            //更新Source中的关系数据源
                            if ($scope.Source.selectItem.refcustomers) {
                                $scope.Source.selectItem.refcustomers = $scope.Source.selectItem.refcustomers + ',' + project.idcustomerinfo;
                            } else {
                                $scope.Source.selectItem.refcustomers =project.idcustomerinfo;
                            }
                            
                        } else {
                            $scope.Source.selectItem.refcustomers = $scope.customerIds.join(",");
                        }
                        break;
                    }
                    parent.layer.msg('关系添加失败', { icon: 5 });
                    project.checked = !project.checked;
                    break;
            }
           
        }, function (error) {
            console.log(error);
        });
    };
    
    /*
       创建项目状态--点击事件
       data 成功后得回调、
       关闭模态框会返回'ok'
   */
    $scope.addProjectstatusClick = function () {
        $scope.service.title = "添加新的项目状态";
        $scope.modalHtml = __URL + 'Crmproject/Customerstatus/openmodal';
        $scope.modalController = 'modalCustomerstatusController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.projectstatusData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.projectstatusData[key] == undefined) {
                        $scope.Source.projectstatusData[key] = angular.copy($scope.service.projectstatusData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }

    /*
      创建用户--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUserClick = function () {
        $scope.service.title = "添加新的用户";
        $scope.modalHtml = __URL + 'Crmuser/Users/openmodal';
        $scope.modalController = 'modalUsersController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.usersData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usersData[key] == undefined) {
                        $scope.Source.usersData[key] = angular.copy($scope.service.usersData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户角色--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUserTypeClick = function () {
        $scope.service.title = "添加新的用户角色";
        $scope.modalHtml = __URL + 'Crmuser/Usertype/openmodal';
        $scope.modalController = 'modalUsertypeController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.usertypeData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usertypeData[key] == undefined) {
                        $scope.Source.usertypeData[key] = angular.copy($scope.service.usertypeData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户组--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUsergroupClick = function (node) {
        $scope.service.selectItem = '';
        $scope.service.title = '新建用户组';
        $scope.modalHtml = __URL + 'Crmuser/Usergroup/openmodal';
        $scope.modalController = 'modalUsergroupController';
        if (node != undefined) {
            $scope.service.selectItem = node;
        }
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
               
            }
        });
    
       
    }
    /*
     创建新联系人--点击事件
     data 成功后得回调、
     关闭模态框会返回'ok' 
     */
    $scope.addContactClick = function () {
        $scope.service.title = "添加新的联系人";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Contact/openmodal';
        $scope.modalController = 'modalContactController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.contactData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.contactData[key] == undefined) {
                        $scope.Source.contactData[key] = angular.copy($scope.service.contactData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
   创建新联系人--点击事件
   data 成功后得回调、
   关闭模态框会返回'ok'
   */
    $scope.addCustomerinfoClick = function () {
        $scope.service.title = "添加新的联系人";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'modalContactController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.contactData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.contactData[key] == undefined) {
                        $scope.Source.contactData[key] = angular.copy($scope.service.contactData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);