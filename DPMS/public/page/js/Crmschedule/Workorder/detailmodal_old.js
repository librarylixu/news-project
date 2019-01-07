//添加编辑项目的控制器
appModule.controller('detailWorkorderController', ["$scope", 'dataService', '$uibModalInstance', 'alert', function ($scope, dataService, $uibModalInstance, alert) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //配置富文本编辑器
    $scope.ue = UE.getEditor('container_message', {
        toolbars: [
            ['fullscreen',
            //文字操作                          
            'bold', //加粗  
            'italic', //斜体
            'underline', //下划线
            'strikethrough', //删除线
            'forecolor', //字体颜色
            'backcolor', //背景色
            'formatmatch', //格式刷
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'insertorderedlist', //有序列表
            'insertunorderedlist', //无序列表               
            //表格
            'inserttable', //插入表格 
            'deletetable', //删除表格
            //其他功能
            'insertcode', //代码语言
            'fontfamily', //字体
            'fontsize', //字号
            'paragraph', //段落格式  
            'template', //模板
            'attachment', //附件 
            'emotion', //表情
            'map', //Baidu地图
            'snapscreen', //截图 
            ]
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        zIndex: 10000
    });
    //等编辑器准备就绪之后，再去查询
    $scope.ue.addListener('ready', function (container_message) {
        $scope.selectMessage();//查询工单
    });
    //查询工单内容
    $scope.selectMessage = function () {
        if ($scope.Source.selectItem.message != undefined) {
            return;
        }
        var param = new URLSearchParams();
        param.append('workid', $scope.Source.selectItem.idworkorder);
        $scope.service.postData(__URL + 'Crmschedule/Workordermessage/select_page_data', param).then(function (data) {
            //该工单的内容数据
            $scope.Source.selectItem.message = data;
            dataService.updateData('workorderData', $scope.Source.selectItem);
            //加载文本编辑器的初始化内容
            if ($scope.Source.selectItem.message.message != undefined && $scope.Source.selectItem) {
                $scope.ue.setContent($scope.Source.selectItem.message.message);
            }
            //禁用全屏以外的任何按钮  判断：该工单是否已经结束了/该工单是否是本人创建
            if ($scope.Source.selectItem.status >= 2 && $scope.Source.selectItem.userid == $scope.service.userid) {
                $scope.ue.setDisabled('fullscreen');
            }
        }, function (error) {
            console.log(error);
        });
    }
    /*保存工单内容*/
    $scope.addPagemessage = function () {
        var param = new URLSearchParams();
        param.append('message', UE.getEditor('container_message').getContent());
        param.append('workid', $scope.Source.selectItem.idworkorder);
        $scope.service.postData(__URL + 'Crmschedule/Workordermessage/update_page_data', param).then(function (data) {
            if (data.updatedExisting == true || data.upserted.$id.length > 20) {
                dataService.updateData('workorderData', $scope.Source.selectItem);
                if (data.updatedExisting) {
                    alert.show('修改成功', '工单内容');
                } else {
                    alert.show('添加成功', '工单内容');
                }
            } else {
                //失败了
                alert.show('修改失败', '工单内容');
            }
        }, function (error) {
            console.log(error);
        });
    }
    //查找到匹配的选项并选中
    $scope.selectOptions = function (ids_arr, totalData, checkedName, idname) {
        for (var data = 0; data < totalData.length; data++) {
            for (var id = 0; id < ids_arr.length; id++) {
                //totalData[ids_arr[id]].checked = true;
                if (ids_arr[id] == totalData[data][idname]) {
                    checkedName.push(totalData[data]);
                }

            }
        }
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
    //时间戳转换为字符串
    $scope.service.changeDate = function (time) {
        if (time == 1) {
            $scope.service.starttime = new Date(parseInt($scope.service.selectItem.starttime) * 1000);
        } else if (time == 2) {
            $scope.service.endtime = new Date(parseInt($scope.service.selectItem.endtime) * 1000);
        } else if (time == 3) {
            $scope.service.starttime = new Date(parseInt($scope.service.selectItem.starttime) * 1000);
            $scope.service.endtime = new Date(parseInt($scope.service.selectItem.endtime) * 1000);
        }
    }
    //获取所有的状态信息（顺序排列）
    $scope.getstatusname = ['待处理', '进行中', '终止', '已结束'];
    //此处做打开方式的展示
    //更改状态值，数据库存为   0待处理1进行中2终止3已结束
    //num 0 获取html类型字符串/1  获取状态对应的文字
    $scope.getLabelClass = function (status, num) {
        //获取class
        if (num == 0) {
            if (status == "0") {
                $scope.refname = '<span class="label"  style="cursor:pointer;background-color:#5661c9">' + '待处理' + '</span>';
            } else if (status == "1") {
                $scope.refname = '<span class="label"  style="cursor:pointer;background-color:#c95694">' + '进行中' + '</span>';
            } else if (status == "2") {
                $scope.refname = '<span class="label"  style="cursor:pointer;background-color:#3997a8">' + '终止' + '</span>';
            } else if (status == "3") {
                $scope.refname = '<span class="label"  style="cursor:pointer;background-color:#c90894">' + '已结束' + '</span>';
            } else {
                $scope.refname = '<span class="label"  style="cursor:pointer;background-color:#075900">' + '暂无状态' + '</span>';
            }
        } else if (num == 1) {
            if (status == "0") {
                $scope.refname = '待处理';
            } else if (status == "1") {
                $scope.refname = '进行中';
            } else if (status == "2") {
                $scope.refname = '终止';
            } else if (status == "3") {
                $scope.refname = '已结束';
            } else {
                $scope.refname = '暂无状态';
            }
        }
        return $scope.refname;
    }

    //根据表里userid获取工单创建人
    $scope.getusername = function () {
         return $scope.service.usersData[$scope.service.userid].username;
    }
    //根据表里refcustomerid获客户
    $scope.getcustomer = function (customerid, name) {
        for (i = 0; i < $scope.service.customerData.length; i++) {
            if ($scope.service.customerData[i].idcustomerinfo == customerid) {
                if (name) {
                    return $scope.service.customerData[i].name;
                } else {
                    return $scope.service.customerData[i];
                }

            }
        }
    }
    //根据表里refprojectid获客户
    $scope.getproject = function (projectid, name) {
        for (i = 0; i < $scope.service.projectData.length; i++) {
            if ($scope.service.projectData[i].idproject == projectid) {
                if (name) {
                    return $scope.service.projectData[i].name;
                } else {
                    return $scope.service.projectData[i];
                }

            }
        }
    }
    $scope.service.changeDate(3);
    //获取关联详细信息 
    //       状态   用户   用户角色   用户组   联系人   客户
    //type    0      1       2         3       4       5
    //action  3      4       5         6       7       8
    $scope.returnHtml = function (row, type) {
        $scope.refname = '';
        if (type == 0) {
            //状态
            $scope.refname = $scope.getLabelClass(row.status, 0);
            return $scope.refname;
        } else if (type == 1) {
            //用户
            //  $scope.refname += '<a class="addref top-5" title="建立项目与用户关系" ng-click="refuser()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            if (!row.refusers) {
                return;
            }
            var user_arr = row.refusers.split(",");
            //$scope.makeRefHtml(user_arr, $scope.service.usersData, 'idusers', "username");
            $scope.usersSelected = [];
            $scope.selectOptions(user_arr, $scope.service.usersData, $scope.usersSelected, 'idusers');


        } else if (type == 2) {
            //用户角色
            //   $scope.refname += '<a class="addref top-5" title="建立项目与用户角色关系" ng-click="refusertype()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            if (!row.refutypes) {
                return;
            }
            var type_arr = row.refutypes.split(",");
            //$scope.makeRefHtml(type_arr, $scope.service.usertypeData, 'idusertype', "typename");
            $scope.usertypeSelected = [];
            $scope.selectOptions(type_arr, $scope.service.usertypeData, $scope.usertypeSelected, 'idusertype');
        } else if (type == 3) {
            //用户组
            //  $scope.refname += '<a class="addref top-5" title="建立项目与用户组关系" ng-click="refusergroup()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            if (!row.refugroups) {
                return;
            }
            var usergroup_arr = row.refugroups.split(",");
            // $scope.makeRefHtml(usergroup_arr, $scope.service.usergroupData, 'idusergroup', "groupname");
            $scope.usergroupSelected = [];
            $scope.selectOptions(usergroup_arr, $scope.service.usergroupData, $scope.usergroupSelected, 'idusergroup');
        } else if (type == 5) {
            //联系人
            //  $scope.refname += '<a class="addref top-5" title="建立项目与联系人关系" ng-click="refcontact()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            if (!row.refcontactid) {
                return;
            }
            var contact_arr = row.refcontactid.split(",");
            //$scope.makeRefHtml(contact_arr, $scope.service.contactData, 'idcontact', "name");
            $scope.contactSelected = [];
            $scope.selectOptions(contact_arr, $scope.service.contactData, $scope.contactSelected, 'idcontact');
        } else if (type == 6) {
            //客户
            // $scope.refname += '<a class="addref top-5" title="建立项目与客户关系" ng-click="refcustomer()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            $scope.refname = $scope.getcustomer(row.refcustomerid, 1)
            if (!row.refcustomerid) {
                return;
            }
            return $scope.refname;
        } else if (type == 7) {
            //项目
            // $scope.refname += '<a class="addref top-5" title="建立项目与客户关系" ng-click="refcustomer()" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            $scope.refname = $scope.getproject(row.refprojectid, 1);
            if (!row.refprojectid) {
                return;
            }
            return $scope.refname;
        }
        //  return $scope.refname;
    };
    //获取此处是在进行哪个步骤的操作
    $scope.changeStatus = function (row) {
        if (row == 0) {
            $scope.Source.Action = 0;
        } else if (row == 1) {
            $scope.Source.Action = 1;
        } else if (row == 2) {
            $scope.Source.Action = 2;
        } else if (row == 3) {
            $scope.Source.Action = 3;
        } else if (row == 4) {
            $scope.Source.Action = 4;
            $scope.service.status = $scope.getLabelClass($scope.service.selectItem.status, 1);
        } else if (row == 5) {
            $scope.Source.Action = 5;
        } else if (row == 6) {
            $scope.Source.Action = 6;
        } else if (row == 7) {
            $scope.Source.Action = 7;
        } else if (row == 8) {
            $scope.Source.Action = 8;
            $scope.service.customer = $scope.getcustomer($scope.service.selectItem.refcustomerid);
        } else if (row == 9) {
            $scope.Source.Action = 9;
            $scope.service.project = $scope.getproject($scope.service.selectItem.refprojectid);
        }

    }
    //项目提示框title和代码段路径
    $scope.dynamicPopover = {
        templateUrl: __URL + 'Crmschedule/Workorder/statusChange',
        title_status: '修改工单状态',
        title_message: '修改工单内容',
        title_name_add: '添加工单标题',
        title_name: '修改工单标题',
        title_clientname: '修改最终用户',
        title_principal: '修改主要负责人',
        title_customer: '修改关联客户'
    };
    $scope.save = function (item, model, type, action) {
        $scope.params = new URLSearchParams();
        $scope.newdata = {};
        $scope.params.append('idworkorder', $scope.Source.selectItem.idworkorder);
        $scope.url = "Crmschedule/Workorder/update_page_data";
        if (type == 0) {
            $scope.url = "Crmschedule/Workorder/add_page_data";
            $scope.params.append('title', $scope.Source.selectItem.title);
        } else if (type == 1) {
            //编辑
            if ($scope.Source.selectItem.title != undefined) {
                $scope.params.append('title', $scope.Source.selectItem.title);
            }
            if ($scope.Source.selectItem.message != undefined) {
                $scope.params.append('message', $scope.Source.selectItem.message);
            }
        } else if (type == 3) {
            var status = 0;
            //勾选---切换状态
            if (item == "待处理") {
                status = '0';
            } else if (item == "进行中") {
                status = '1';
            } else if (item == "终止") {
                status = '2';
            } else if (item == "已结束") {
                status = '3';
            }
            if (action == 0) {
                $scope.params.append('status', status);
            }
        }
        else if (type == 4) {
            //勾选---关联用户
            if (action == 0) {
                if ($scope.Source.selectItem.refusers) {
                    $scope.params.append('refusers', $scope.Source.selectItem.refusers + ',' + item.idusers);
                } else {
                    $scope.params.append('refusers', item.idusers);
                }

            } else {
                //取消勾选            
                var index = $scope.Source.selectItem.refusers.split(",").indexOf(item.idusers);
                var user_arr = $scope.Source.selectItem.refusers.split(",");
                user_arr.splice(index, 1);
                $scope.params.append('refusers', user_arr.join(","));
            }
        } else if (type == 5) {
            //关联角色
            if (action == 0) {
                if ($scope.Source.selectItem.refutypes) {
                    $scope.params.append('refutypes', $scope.Source.selectItem.refutypes + ',' + item.idusertype);
                } else {
                    $scope.params.append('refutypes', item.idusertype);
                }

            } else {
                //取消勾选
                var index = $scope.Source.selectItem.refutypes.split(",").indexOf(item.idusertype);
                var usertype_arr = $scope.Source.selectItem.refutypes.split(",");
                usertype_arr.splice(index, 1);
                $scope.params.append('refutypes', usertype_arr.join(","));
            }
        } else if (type == 6) {
            //关联用户组
            if (action == 0) {
                if ($scope.Source.selectItem.refugroups) {
                    $scope.params.append('refugroups', $scope.Source.selectItem.refugroups + ',' + item.idusergroup);
                } else {
                    $scope.params.append('refugroups', item.idusergroup);
                }

            } else {
                //取消勾选
                var index = $scope.Source.selectItem.refugroups.split(",").indexOf(item.idusergroup);
                var usergroup_arr = $scope.Source.selectItem.refugroups.split(",");
                usergroup_arr.splice(index, 1);
                $scope.params.append('refugroups', usergroup_arr.join(","));
            }
        } else if (type == 7) {
            //关联联系人
            if (action == 0) {
                if ($scope.Source.selectItem.refcontactid) {
                    $scope.params.append('refcontactid', $scope.Source.selectItem.refcontactid + ',' + item.idcontact);
                } else {
                    $scope.params.append('refcontactid', item.idcontact);
                }

            } else {
                //取消勾选
                var index = $scope.Source.selectItem.refcontactid.split(",").indexOf(item.idcontact);
                var contacts_arr = $scope.Source.selectItem.refcontactid.split(",");
                contacts_arr.splice(index, 1);
                $scope.params.append('refcontactid', contacts_arr.join(","));

            }
        } else if (type == 8) {
            //关联客户
            $scope.params.append('refcustomerid', item.idcustomerinfo);
            $scope.service.selectItem.refcustomerid = item.idcustomerinfo;
        } else if (type == 9) {
            //编辑开始时间
            $scope.params.append('starttime', $scope.dates.stoday.unix());
        } else if (type == 10) {
            //编辑结束时间
            $scope.params.append('endtime', $scope.dates.etoday.unix());
        } else if (type == 11) {
            //关联项目
            $scope.params.append('refprojectid', item.idproject);
            $scope.service.selectItem.refprojectid = item.idproject;
        }
        $scope.Source.postData(__URL + $scope.url, $scope.params).then(function (data) {
            switch (type) {
                case 0:
                    //工单添加
                    if (data > 0) {
                        //  service.selectItem.idproject = data;
                        dataService.addData('projectData', {
                            _kid: data,
                            idproject: data,
                            name: $scope.Source.selectItem.name,
                            del: 0,
                            index: 0,
                        });
                        var params = new URLSearchParams();
                        params.append("$json", true);
                        $scope.Source.postData(__URL + "Crmschedule/Workorder/select_page_data", params).then(function (newdata) {
                            $scope.service.selectItem = newdata[data];
                            $scope.Source.selectItem = newdata[data];
                        });
                        alert.show('添加成功', '添加');
                        break;
                    }
                case 1:
                    //项目单项修改
                    if (data > 0) {

                        //更新Source中的数据源
                        $scope.service.selectItem = $scope.Source.selectItem;
                    }
                    alert.show('修改成功', '修改');
                    break;
                case 3:
                    //工单状态修改
                    if (data > 0) {
                        //更新Source中的数据源
                        $scope.service.selectItem.status = status;
                        //此处增加如果状态为终止或已结束则更改结束时间
                        if (status == 2 || status == 3) {
                            $scope.service.selectItem.endtime = moment().unix();
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加工单与工单状态关系');
                    break;
                case 4:
                    //关联用户
                    if (data > 0) {
                        if (action == 0) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers + ',' + item.idusers;
                        } else {
                            $scope.Source.selectItem.refusers = $scope.usersSelected.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户关系');
                    break;
                case 5:
                    //关联用户角色
                    if (data > 0) {
                        if (action == 0) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refutypes = $scope.Source.selectItem.refutypes + ',' + item.idusertype;
                        } else {
                            $scope.Source.selectItem.refutypes = $scope.usertypeSelected.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户角色关系');
                    break;
                case 6:
                    //关联用户组
                    if (data > 0) {
                        if (action == 0) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refugroups = $scope.Source.selectItem.refugroups + ',' + item.idusergroup;
                        } else {
                            $scope.Source.selectItem.refugroups = $scope.usergroupSelected.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与用户组关系');
                    break;
                case 7:
                    //关联联系人
                    if (data > 0) {
                        if (action == 0) {
                            //更新Source中的关系数据源
                            $scope.Source.selectItem.refcantacts = $scope.Source.selectItem.refcontects + ',' + item.idcontact;
                        } else {
                            $scope.Source.selectItem.refcantacts = $scope.contactSelected.join(",");
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与联系人关系');
                    break;
                case 8:
                    //关联客户
                    if (data > 0) {
                        if (action == 0) {
                            //更新Source中的关系数据源
                            $scope.service.selectItem.refcustomerid = item.idcustomerinfo;



                        } else {
                            $scope.service.selectItem.refcustomerid = $scope.Source.selectItem.idcustomerinfo;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加产品与客户关系');
                    break;
                case 9:
                    //修改开始时间
                    if (data > 0) {
                        if (item == 'starttime') {
                            $scope.service.selectItem.starttime = $scope.dates.stoday.unix();
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加开始时间');
                    break;
                case 10:
                    //修改结束时间
                    if (data > 0) {
                        if (item == 'endtime') {
                            $scope.service.selectItem.endtime = $scope.dates.etoday.unix();
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加结束时间');
                    break;
            }

        }, function (error) {
            console.log(error);
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    /*
      创建项目状态--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
  */
    $scope.addProjectstatusClick = function () {
        $scope.service.title = "添加新的项目状态";
        $scope.modalHtml = __URL + 'Crmproject/Projectstatus/openmodal';
        $scope.modalController = 'modalProjectstatusController';
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

    //时间插件
    $scope.dates = {}
    if ($scope.service.selectItem.starttime && $scope.service.selectItem.starttime !== '' && $scope.service.selectItem.starttime !== '0') {
        $scope.today = new Date(parseInt($scope.service.selectItem.starttime) * 1000);
        //默认显示的开始时间
        $scope.dates.stoday = moment($scope.today);
    }

    if ($scope.service.endtime && $scope.service.selectItem.endtime !== '' && $scope.service.selectItem.endtime !== '0') {
        $scope.dates.etoday = moment(new Date(parseInt($scope.service.selectItem.endtime) * 1000));
    }



}]);