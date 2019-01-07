appModule.controller('modalWorkorderController', ["$scope", "$uibModalInstance", 'dataService', '$timeout', 'ngVerify', 'textAngularManager', function ($scope, $uibModalInstance, dataService, $timeout, ngVerify, textAngularManager) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //关联的客户
    $scope.customers_arr = [];
    //关联的项目
    $scope.projectarr = [];
    //关联的联系人
    $scope.contactarr = [];
    //关联的用户
    $scope.userarr = [];
    var message;
    //----时间插件start----
    //给时间戳插件赋值
    if ($scope.Source.selectItem.expectationendtime && $scope.Source.selectItem.expectationendtime !== '0' && $scope.Source.selectItem.expectationendtime != 'null') {
        var date = new Date($scope.Source.selectItem.expectationendtime * 1000);
        $scope.Source.dt = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
    } 
    //控制日期选择框的显示与否
    $scope.popup = { opened: false };    
    //时间插件配置项
    $scope.dateOptions = {
       // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2045, 01, 01),
        minDate: new Date(),
        startingDay: 1
    };
    //打开事件选择框的方法
    $scope.open = function () {
        $scope.popup.opened = true;
    }
    //----时间插件end----
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
   
    
    /*
    获取关联的客户/项目/用户数据
    dataid  数据的id  refcustomerid
    alldata  数据源   customerinfoData
    keyid    判断是否只要keyid的数据
    */
    $scope.getrefalldata = function (refdataid, alldata,keyid) {
        if ($scope.Source.selectItem[refdataid] == null || $scope.Source.selectItem[refdataid] instanceof Array) {

            return [];
        }
        var arrdata = [];
        var newData = [];
        arrdata = $scope.Source.selectItem[refdataid].split(',');
        if (keyid == true) {
            return arrdata;
        }
        for (i = 0; i < arrdata.length; i++) {
            newData.push($scope.service.privateDateObj[alldata][arrdata[i]]);
        }
        return newData;
    }
    //打开模态框获取指派人数据
    $assignarr = $scope.getrefalldata('assignid', 'usersData', false);//获取指派人的关联信息
    $scope.Source.selectItem.assignid = $assignarr[0];
    //获取勾选后的数组对象转成字符串
    $scope.getstrData = function(data,id){        
        var arrData = [];
        $scope.Source.dataid = id;
        angular.forEach(data , function (value, key) {
            arrData.push(value[$scope.Source.dataid]);
        })
        return arrData.join(',');
    }
    $scope.save = function () {
        var param = new URLSearchParams();
        var url = __URL + 'Crmschedule/Workorder/update_page_data';       
        if ($scope.service.Action == '0') {                     
            url = __URL + 'Crmschedule/Workorder/add_page_data';
            param.append('title', $scope.Source.selectItem.title);
            param.append('assignid', $scope.selectItem.assignid.idusers);
            angular.forEach($scope.selectItem, function (value,key) {

            });
           
        } else if ($scope.service.Action == '1') {
            param.append('idworkorder', $scope.Source.selectItem.idworkorder);
            param.append('updatetime', (new Date().getTime() / 1000).toFixed(0));
            if ($scope.Source.selectItem.refcustomerid != $scope.service.selectItem.refcustomerid) {
                param.append('title', $scope.Source.selectItem.title);               
            }
            if ($scope.Source.selectItem.assignid.idusers != $scope.service.selectItem.assignid) {
                param.append('assignid', $scope.Source.selectItem.assignid.idusers);
            }
        } else if ($scope.service.Action == '2') {
            url = __URL + 'Crmschedule/Workorder/del_page_data';
            param.append('idworkorder', $scope.Source.selectItem.idworkorder);
        }
        if ($scope.Source.selectItem.refcustomerid && $scope.Source.selectItem.refcustomerid != $scope.service.selectItem.refcustomerid) {
            //循环等到已经勾选的id
            $scope.Source.selectItem.refcustomerid = $scope.getstrData($scope.Source.selectItem.refcustomerid, 'idcustomerinfo');
            param.append('refcustomerid', $scope.Source.selectItem.refcustomerid);
        }
        if ($scope.Source.selectItem.refprojectid && $scope.Source.selectItem.refprojectid != $scope.service.selectItem.refprojectid) {
            //循环等到已经勾选的id
            $scope.Source.selectItem.refprojectid = $scope.getstrData($scope.Source.selectItem.refprojectid,'idproject');
            param.append('refprojectid', $scope.Source.selectItem.refprojectid);
        }
        if ($scope.Source.selectItem.refcontactid && $scope.Source.selectItem.refcontactid != $scope.service.selectItem.refcontactid) {
            //循环等到已经勾选的id
            $scope.Source.selectItem.refcontactid = $scope.getstrData($scope.Source.selectItem.refcontactid,'idcontact');
            param.append('refcontactid', $scope.Source.selectItem.refcontactid);          
        }              
        if ($scope.Source.dt && $scope.service.selectItem.expectationendtime != ($scope.Source.dt.getTime() / 1000).toFixed(0)) {
            param.append('expectationendtime', ($scope.Source.dt.getTime() / 1000).toFixed(0));
        }
        if ($scope.Source.selectItem.refusers && $scope.Source.selectItem.refusers != $scope.service.selectItem.refusers) {
            //循环等到已经勾选的id
            $scope.Source.selectItem.refusers = $scope.getstrData($scope.Source.selectItem.refusers,'idusers');
            param.append('refusers', $scope.Source.selectItem.refusers);          
        }
            
        $scope.service.postData(url, param).then(function (data) {
            //因为要返回guid所以在添加的时候改变了返回值，[{id:4},{guid:xxx}]
            if ($scope.Source.Action == 0) {
                $scope.Source.selectItem.guid = data.guid;
                data = data.id;
            }
            if (data > 0) {
                parent.layer.msg('保存成功！');
                var markUrl;
                var param = new URLSearchParams();
                var postdata = {
                    _kid: $scope.service.Action == '0' ? data : $scope.Source.selectItem.idworkorder,
                    idworkorder: $scope.service.Action == '0' ? data : $scope.Source.selectItem.idworkorder,
                    title: $scope.Source.selectItem.title,
                    userid: $scope.service.userid,
                    guid:$scope.Source.selectItem.guid,
                    refcustomerid: $scope.Source.selectItem.refcustomerid ? $scope.Source.selectItem.refcustomerid : null,
                    refprojectid: $scope.Source.selectItem.refprojectid ? $scope.Source.selectItem.refprojectid : null,
                    refcontactid: $scope.Source.selectItem.refcontactid ? $scope.Source.selectItem.refcontactid : null,
                    assignid: $scope.Source.selectItem.assignid ? $scope.Source.selectItem.assignid.idusers : null,
                    expectationendtime: $scope.Source.dt ? ($scope.Source.dt.getTime() / 1000).toFixed(0) : null,
                    refusers: $scope.Source.selectItem.refusers ? $scope.Source.selectItem.refusers : null,
                    createtime: Date.parse(new Date()) / 1000,
                    status:$scope.service.Action == '0' ?0:$scope.Source.selectItem.status,
                    del: 0,
                    index: 0,
                }
                if ($scope.service.Action == '1') {
                    dataService.updateData('workorderArrData', postdata);
                    dataService.updateData('workorderData', postdata);
                    markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';                    
                    if ($scope.Source.mark != message) {
                        param.append("workid", $scope.Source.selectItem.idworkorder);
                        param.append("guid", $scope.Source.selectItem.guid);
                        param.append("causedescription", $scope.Source.mark);
                    } else {
                        //如果没修改内容那就没必要传到后台了
                        $uibModalInstance.dismiss('cancel');
                        return;
                    }
                } else if ($scope.service.Action == '0') {
                    //先去给count数加一
                    $scope.service.workorderData['count'] = parseInt($scope.service.workorderData['count']) + 1;
                    dataService.addData('workorderArrData', postdata);
                    dataService.addData('workorderData', postdata);
                    markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
                    param.append("workid", postdata.idworkorder);
                    param.append("guid", $scope.Source.selectItem.guid);
                    param.append("causedescription", $scope.Source.mark);
                } else if ($scope.service.Action == '2') {
                    dataService.delData('workorderArrData', $scope.service.selectItem);
                    markUrl = __URL + 'Crmschedule/Workordermessage/del_page_data';
                    param.append("workid", $scope.Source.selectItem.idworkorder);
                }
                $scope.service.postData(markUrl, param).then(function (data) {
                    if (data < 0) {
                        parent.layer.msg('工单内容保存失败');
                        return;
                    }
                    //更新工单内容数据源
                    $scope.service.mark = $scope.Source.mark;
                });
                $uibModalInstance.dismiss('cancel');
            } else {
                parent.layer.msg('保存失败！');
            }
        });
       

    }
   
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //保存 - 客户关系
    $scope.save_customer = function (item, action) {
        if ($scope.customers_arr == undefined) {
            $scope.customers_arr = [];
        }
        //添加客户关系
        if (action.toString() == "0") {
            //如果当前添加的客户已做关联，则不需要重复添加
            if ($scope.customers_arr.indexOf(item.idcustomerinfo) > -1) {
                return;
            }
            $scope.customers_arr.push(item.idcustomerinfo);
        } else if (action.toString() == "1") {
            //删除客户关系
            var index = $scope.customers_arr.indexOf(item.idcustomerinfo);
            $scope.customers_arr.splice(index, 1);//删除
            //判断是否删除了所有客户，是，则清空联系人
            if ($scope.customers_arr.length == 0) {
                $scope.projectarr = [];
                $scope.contactarr = [];
            }
        }
        $scope.selectproject();
        $scope.selectcontact();
    }
    //保存 - 项目关系
    //action 0 添加，1 删除，2 直接根据$scope.projectarr保存
    $scope.save_project = function (item, action) {
        if ($scope.projectarr == undefined) {
            $scope.projectarr = [];
        }
        //添加客户关系
        if (action.toString() == "0") {
            //如果当前添加的客户已做关联，则不需要重复添加
            if ($scope.projectarr.indexOf(item.idproject) > -1) {
                return;
            }
            $scope.projectarr.push(item.idproject);
        } else if (action.toString() == "1") {
            //删除客户关系
            var index = $scope.projectarr.indexOf(item.idproject);
            if (index > -1) {
                $scope.projectarr.splice(index, 1);//删除
            }
            //判断是否删除了所有客户，是，则清空联系人
            if ($scope.projectarr.length == 0) {
                $scope.contactarr = [];
            }
        } else if (action.toString() == "2") {
            params.append('refprojectid', $scope.projectarr.join(","));
        }
        $scope.selectcontact();
    }
    //保存 - 联系人关系
    $scope.save_contact = function (item, action) {
        if ($scope.contactarr == undefined) {
            $scope.contactarr = [];
        }
        //添加客户关系
        if (action.toString() == "0") {
            //如果当前添加的客户已做关联，则不需要重复添加
            if ($scope.contactarr.indexOf(item.idcontact) > -1) {
                return;
            }
            $scope.contactarr.push(item.idcontact);
        } else if (action.toString() == "1") {
            //删除客户关系
            var index = $scope.contactarr.indexOf(item.idcontact);
            if (index > -1) {
                $scope.contactarr.splice(index, 1);//删除
            }
        }
    }
    /*
        工单其他属性设置
        客户-项目-联系人
        查询规则：根据客户查询项目、根据项目查询联系人
        查询步骤：
        缓存项目数据，当更改客户时，查询缓存中是否存在当前客户的项目，不存则，则查询数据库
        缓存联系人数据，当更改项目时，查询缓存中是否存在当前项目的联系人，不存在，则查询数据库
    */
    //缓存项目数据
    $scope.projectdata = {};
    //缓存联系人数据
    $scope.usersdata = {};
    /*
    查询联系人数据 根据项目过滤联系人
    此处做了额外操作----
    根据项目关联的联系人id查询联系人信息
    */
    $scope.selectcontact = function (customer) {
        //组建已关联项目关联的联系人id
        var contactarrs = [];
        var contactstr = '';
        if ($scope.Source.selectItem.refprojectid && $scope.Source.selectItem.refprojectid[0] != undefined && $scope.Source.selectItem.refprojectid.length > 0) {
            angular.forEach($scope.Source.selectItem.refprojectid, function (value, key) {
                if (value.refdecision || value.refinformant || value.reftechnical || value.refusing) {
                    contactstr = value.refdecision + ',' + value.refinformant + ',' + value.reftechnical + ',' + value.refusing;
                    contactarrs = contactarrs.concat(contactstr.split(','));
                }
            });
        } else {
            angular.forEach($scope.Source.selectItem.refcustomerid, function (value, key) {
                if (value.refcontactids != undefined && value.refcontactids.length > 0) {
                    contactarrs = contactarrs.concat(value.refcontactids.split(','));
                }
            });
        }

        contactarrs = unique(contactarrs);//数组去重 
        var contact_arr = contactarrs.join(',');
        if (contact_arr == '') {
            $scope.Source.contactArrData = [];
            return;
        }
        var params = new URLSearchParams();
        //params.append('$where', JSON.stringify({ idcontact: contactarrs.join(',') }));
        //params.append('idcontact', contact_arr);    
        params.append('$json', true);
        params.append('$in', true);
        //params.append('$findall', true);
        //params.append('$where', JSON.stringify({ idcontact: contact_arr }));
        params.append('idcontact', contact_arr);
        select_customer_contact(params).then(function (res) {
            //把全部的联系人，转换一下，用array存储
            $scope.Source.contactArrData = P_objecttoarray($scope.service[res]);
            //将数据添加进去 
            $scope.Source.selectItem.refcontactid = [];
            //赋值已选项
            angular.forEach($scope.contactarr, function (value, key) {
                if ($scope.Source.privateDateObj[res].hasOwnProperty(value)) {
                    $scope.Source.selectItem.refcontactid.push($scope.service[res][value]);
                } else {
                    var index = $scope.projectarr.indexOf(value);
                    $scope.projectarr.splice(index, 1);//删除
                }
            });
        });
    }
    /*
    查询项目数据
    根据客户过滤项目
    先查询项目数据，等待回调之后在查询关系数据
    */
    $scope.selectproject = function () {
        var params = new URLSearchParams();
        params.append('$findall', true);
        params.append('$json', true);

        params.append('$findinset', true);
        params.append('refcustomers', $scope.customers_arr.join(','));
        //params.append('$fetchSql', true);
        select_project(params).then(function (res) {
            //console.log($scope.Source[res]);
            //把全部的用户组，转换一下，用array存储
            $scope.Source.projectArrData = P_objecttoarray($scope.service[res]);

            $scope.Source.selectItem.refprojectid = [];
            //赋值已选项
            angular.forEach($scope.projectarr, function (value, key) {
                if ($scope.Source[res].hasOwnProperty(value)) {
                    $scope.Source.selectItem.refprojectid.push($scope.service[res][value]);
                } else {
                    var index = $scope.projectarr.indexOf(value);
                    $scope.projectarr.splice(index, 1);//删除
                }
            });
            //赋值完成后，根据项目查询联系人
            $scope.selectcontact();
        });
    }
    //在修改或删除的时候再去获取需要的数据
    if ($scope.Source.Action > 0) {
        $scope.getMark();//获取工单内容
        $scope.customers_arr = $scope.getrefalldata('refcustomerid', 'customerinfoData', true);//获取客户的关联id
        $scope.projectarr = $scope.getrefalldata('refprojectid', 'projectData', true);//获取项目的关联id
        $scope.contactarr = $scope.getrefalldata('refcontactid', 'contactData', true);//获取联系人的关联id
        $scope.userarr = $scope.getrefalldata('refusers', 'usersData', true);//获取用户的关联id
        $scope.Source.selectItem.refcustomerid = $scope.getrefalldata('refcustomerid', 'customerinfoData', false);//获取客户的关联信息
        $scope.Source.selectItem.refprojectid = $scope.getrefalldata('refprojectid', 'projectData', false);//获取项目的关联信息
        //可能会遍历出数组中存在undefined的值，暂时这么做，后期进行一下优化
        if ($scope.Source.selectItem.refprojectid && $scope.Source.selectItem.refprojectid.indexOf(undefined) > -1) {
            $scope.Source.selectItem.refprojectid.splice($scope.Source.selectItem.refprojectid.indexOf(undefined), 1);
        }
        $scope.Source.selectItem.refcontactid = $scope.getrefalldata('refcontactid', 'contactData', false);//获取联系人的关联信息
        if ($scope.Source.selectItem.refprojectid && $scope.Source.selectItem.refcontactid.indexOf(undefined) > -1) {
            $scope.Source.selectItem.refcontactid.splice($scope.Source.selectItem.refcontactid.indexOf(undefined), 1);
        }
        $scope.Source.selectItem.refusers = $scope.getrefalldata('refusers', 'usersData', false);//获取用户的关联信息
        //如果在修改的时候有默认的客户数据，那么自动去组件关联的项目和联系人数据
        if ($scope.Source.selectItem.refcustomerid != undefined) {
            $scope.selectproject();
        }
        //如果在修改的时候有默认的项目数据，那么自动去组件联系人的数据
        if ($scope.Source.selectItem.refprojectid != undefined || $scope.Source.selectItem.refcustomerid != undefined) {
            $scope.selectcontact();
        }
    }

}]);