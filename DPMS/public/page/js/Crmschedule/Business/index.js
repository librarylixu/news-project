/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ngVerify',  'ui.select', 'textAngular']);
appModule.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        taOptions.toolbar[0].splice(3);
        taOptions.toolbar[3] = [];
        return taOptions;
    }]);
});
//主控制器
appModule.controller('crmBusinessController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.businessData == undefined || Object.keys($scope.service.privateDateObj.businessData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    //进来将角标值改为0，
    var apps = parent.YL.util.dataCopy('apps');
    parent.YL.vue.$set(parent.YL.vue, 'apps', apps);
    apps['eim-' + _appid].badge = 0;
    //存一份userid（当前仅用来判断是否是管理员）
    $scope.service.userid = userid;
    //给默认项初始化
    $scope.selectItem = {};
    //检索区，多选框备选数据源
    //创建人
    $scope.selectUserData = {};
    //执行人
    $scope.selectAssignData = {};
    //转数组
    $scope.P_objecttoarray = function (object) {
        var tmp = [];
        var refcustomerid = [];
        var refprojectid = [];
        for (var key in object) {
            //组建可显示的项目
            if (object[key].refprojectid) {
                angular.forEach(object[key].refprojectid.split(','), function (value) {
                    if (!$scope.service.privateDateObj.projectData[value] && $scope.service.privateDateObj.tempprojectData[value]) {
                        refprojectid.push(value);
                    }
                });
                if (refprojectid.length > 0) {
                    var params = new URLSearchParams();
                    params.append("$json", true);
                    params.append('idproject', refprojectid.join(','));
                    params.append('$findall', true);
                    params.append('colsetype', 1);
                    select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                        angular.forEach(data, function (value, key) {
                            $scope.service.privateDateObj.tempprojectData[key] = value;
                        });
                    });
                }
            }
            //组建可显示的客户
            if (object[key].refcustomerid) {
                angular.forEach(object[key].refcustomerid.split(','), function (value) {
                    if (!$scope.service.privateDateObj.customerinfoData[value] && $scope.service.privateDateObj.tempcustomerinfoData[value]) {
                        refcustomerid.push(value);
                    }
                });
                if (refcustomerid.length > 0) {
                    var params = new URLSearchParams();
                    params.append("$json", true);
                    params.append('idcustomerinfo', refcustomerid.join(','));
                    params.append('$findall', true);
                    select_customerinfo(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                        angular.forEach(data, function (value, key) {
                            $scope.service.privateDateObj.tempcustomerinfoData[key] = value;
                        });
                    });
                }

            }
            //判断closetype =1就退出循环
            if (object[key].closetype == 1) {
                delete $scope.service.privateDateObj.businessData[key];
                continue;
            }
            //组建主页面负责人检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].userid]) {
                $scope.selectUserData[object[key].userid] = $scope.service.privateDateObj.usersData[object[key].userid];
            }
            //组建主页面检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].assignid]) {
                $scope.selectAssignData[object[key].assignid] = $scope.service.privateDateObj.usersData[object[key].assignid];
            }
            //key是属性,object[key]是值
            tmp.push(object[key]);//往数组中放属性
        }
        return tmp;
    }
    //tags的数据源
    $scope.tagsData = [];
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.privateDateObj.businessArrData = [];
        } else {
            $scope.service.privateDateObj.businessArrData = $scope.P_objecttoarray($scope.service.privateDateObj.businessData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.businessData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'status') {
                    id = 'id';
                } else {
                    id = 'idusers';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.privateDateObj.businessArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
        if (type == 'type') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'type' });
            if ($scope.service.privateDateObj.businesstypeData[item.value.id] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'status') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'status' });
            if ($scope.service.privateDateObj.businessstatusData[item.value.id] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'assign') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'assignid' });
            if ($scope.selectAssignData[item.value.idusers] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'user') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'userid' });
            if ($scope.selectUserData[item.value.idusers] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        }
    }
    //删除一条筛选条件
    $scope.removeTag = function (item) {
        var index = $scope.tagsData.indexOf(item);
        if (item.key == 'type') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.type.indexOf(item.value);
                    $scope.service.type.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.type.splice:" + e);
                }
            }
        } else if (item.key == 'status') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.status.indexOf(item.value);
                    $scope.service.status.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.status.splice:" + e);
                }
            }
        } else if (item.key == 'userid') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.user.indexOf(item.value);
                    $scope.service.user.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.user.splice:" + e);
                }
            }
        } else if (item.key == 'assignid') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.assign.indexOf(item.value);
                    $scope.service.assign.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.assign.splice:" + e);
                }
            }
        }
    }
    /*
        查询出差（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //项目
        select_project(params).then(function (res) {
            //客户
            select_customerinfo(params).then(function (res) {
                //用户
                select_user(params).then(function (res) {
                    params.append('closetype', 0);
                    select_business(params).then(function (res) {
                        //获取联系人数据
                        $scope.select_contact();
                        //如果没有项目的时候会查询到一个空数组，将空数组变成空对象
                        if (Object.prototype.toString.call($scope.service.privateDateObj.businessData) == '[object Array]' && $scope.service.privateDateObj.businessData.length < 1) {
                            $scope.service.privateDateObj.businessData = {};
                            $scope.service.privateDateObj.businessArrData = [];
                        } else {
                            $scope.service.privateDateObj.businessArrData = $scope.P_objecttoarray($scope.service.privateDateObj.businessData);
                        }
                        //关闭加载层
                        parent.layer.closeAll('loading');
                    });
                });
            });
        });
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }

    /*
   查询联系人数据 根据项目过滤联系人
   此处做了额外操作----
   根据项目关联的联系人id查询联系人信息
   flag true:选择了项目  false根据客户筛选
   */
    $scope.selectContactData = {};
    $scope.selectcontact = function (flag) {
        var customer = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomerid];
        var project;
        var idObj = {};
        if ($scope.selectItem.refprojectid) {
            project = $scope.service.privateDateObj.projectData[$scope.selectItem.refprojectid];
        }
        if (project) {
            if (project.refinformant) {
                idObj[project.refinformant] = project.refinformant;
            }
            if (project.refdecision) {
                idObj[project.refdecision] = project.refdecision;
            }
            if (project.reftechnical) {
                idObj[project.reftechnical] = project.reftechnical;
            }
            if (project.refusing) {
                idObj[project.refusing] = project.refusing;
            }
            idObj = Object.keys(idObj);

        } else {
            if (customer.refcontactids && customer.refcontactids.split) {
                idObj = customer.refcontactids.split(',');
            } else {
                idObj = customer.refcontactids;
            }
        }
        angular.forEach(idObj, function (value) {
            $scope.selectContactData[value] = $scope.service.privateDateObj.contactData[value];
        });
    }
    /*
    查询项目数据
    根据客户过滤项目
    先查询项目数据，等待回调之后在查询关系数据
    */
    $scope.selectProjectdata = {};
    $scope.selectproject = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('$findall', true);
        params.append('$findinset', true);
        params.append('refcustomers', $scope.selectItem.refcustomerid);
        params.append('$fieldkey', 'idproject');
        select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (resultdata) {
            if (Object.keys(resultdata).length > 0) {
                angular.forEach(Object.keys(resultdata), function (value) {
                    if ($scope.service.privateDateObj.projectData[value]) {
                        $scope.selectProjectdata[value] = $scope.service.privateDateObj.projectData[value];
                    }
                });
                //赋值完成后，根据项目查询联系人
                $scope.selectcontact();
            }
        });

    }
    //打开编辑框时初始化数据
    $scope.initData = function () {
        if ($scope.Action == 1) {
            //如果在修改的时候有默认的客户数据，那么自动去组件关联的项目和联系人数据
            if ($scope.selectItem.refcustomerid) {
                $scope.selectproject();
            }
            if ($scope.selectItem.refcontactid && $scope.selectItem.refcontactid.split) {
                $scope.selectItem.refcontactid = $scope.selectItem.refcontactid.split(",");
            }

            if ($scope.selectItem.refusers && $scope.selectItem.refusers.split) {
                $scope.selectItem.refusers = $scope.selectItem.refusers.split(",");
            }
            $scope.initDatepiker();
        }
    }
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.ds = new Date();
        $scope.de = new Date();
        //开始时间
        if ($scope.selectItem.starttime && $scope.selectItem.starttime !== '0' && $scope.selectItem.starttime != 'null') {
            var date = new Date($scope.selectItem.starttime * 1000);
            $scope.ds = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
        }
        //预计结束时间
        if ($scope.selectItem.estimatetime && $scope.selectItem.estimatetime !== '0' && $scope.selectItem.estimatetime != 'null') {
            var date = new Date($scope.selectItem.estimatetime * 1000);
            $scope.de = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
        }
        //控制日期选择框的显示与否
        $scope.popup = { sopened: false, epened: false };
        //时间插件配置项
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2045, 01, 01),
            //minDate: new Date(),
            startingDay: 1
        };
        //打开事件选择框的方法
        $scope.open = function (type) {
            if (type == 0) {
                $scope.popup.sopened = true;
            } else {
                $scope.popup.eopened = true;
            }
        }
    }
    //模态框
    $scope.approvalModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".approvalmodaltemplate",
        openButton: ".approvaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "45vw"
    });
    //审批出差
    $scope.alertConfirm = function (item) {
        if ($scope.service.privateDateObj.businessData[item.idbusiness].status != 0) {
            parent.layer.msg("数据已更新，请刷新页面再继续操作", { icon: 0 });
            return;
        }
        $scope.approvalModal.open();
        $scope.approvalModal.title = '出差审批';
        $scope.Action = 1;
        $scope.service.selectItem = item;
        $scope.selectItem = angular.copy(item);
    }

    //模态框
    $scope.businessModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".businessmodaltemplate",
        openButton: ".businesstemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'business';
        $scope.service.name = '出差';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //获取联系人数据
    $scope.select_contact = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customer_contact(params);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        $scope.businessModal.open();
        $scope.businessModal.title = '添加出差';
        if ($scope.Action != 0 || $scope.selectItem.idbusiness) {
            //$scope.selectItem = { assignid: $scope.service.userid };
            $scope.selectItem = { assignid: "29" }; //*******************************这里注意一点：因为需求这里默认选则赵总，并且最重要的是根据id去绑定的值。所以写死了！！
        }
        $scope.Action = 0;
        $scope.initDatepiker();
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.businessModal.open();
        $scope.businessModal.title = '修改出差';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        $scope.initData();
    }
    //删除按钮
    $scope.remove = function (row) {
        var index = parent.layer.open({
            content: '确认删除出差【' + row.name + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['400px'],
            title: '删除出差信息',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = new URLSearchParams();
                params.append('idbusiness', row.idbusiness);
                $scope.service.postData(__URL + 'Crmschedule/Business/del_page_data', params).then(function (data) {
                    if (data) {
                        parent.layer.msg('删除成功', { icon: 1 });
                        $scope.service.delData('businessArrData', row);
                        row._kid = row.idbusiness;
                        delete $scope.service.privateDateObj.businessData[row._kid];
                    }
                });
                parent.layer.close(index);
            }
        });
    }
    //完成出差按钮
    $scope.alertOver = function (item) {
        var index = parent.layer.open({
            content: '确认提交《' + item.name + '》出差报告，提交后不可对出差报告进行编辑，是否确认？'
           , btn: ['确认提交', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '提交报告'
           , yes: function (index, layero) {
               //完成出差操作
               $scope.completebusiness(item);
               parent.layer.close(index);
           }
        });
    }
    //完成出差
    $scope.completebusiness = function (data) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Business/update_page_data";
        params.append('idbusiness', data.idbusiness);
        params.append('status', 4);
        params.append('endtime', (new Date().getTime() / 1000).toFixed(0));
        //更新数据源
        data.status = 4;
        //已关闭字段 0/1
        data.closetype = 1;
        //dataService.updateData('businessArrData', data);
        $scope.service.privateDateObj.businessData[data.idbusiness] = data;
        $scope.service.privateDateObj.businessArrData =$scope.P_objecttoarray($scope.service.privateDateObj.businessData);
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                parent.layer.msg('出差结束', { icon: 1 });
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    
    //修改出差状态
    $scope.save = function (idbusiness) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Business/update_page_data";
        params.append('idbusiness', idbusiness);
        params.append('status', $scope.selectItem.status);
        params.append('statusmark', $scope.selectItem.statusmark ? $scope.selectItem.statusmark : "");
        params.append('approvaltime', (new Date().getTime() / 1000).toFixed(0));
        //更新数据源
        dataService.updateData('businessArrData', $scope.selectItem);
        $scope.service.privateDateObj.businessData[idbusiness] = $scope.selectItem;
        $scope.service.postData(url, params).then(function (data) {

            if (data > 0) {
                parent.layer.msg('修改成功', { icon: 1 });
                //关闭模态框
                $scope.approvalModal.close();
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //关闭出差
    $scope.closetype = function (data) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        params.append('idbusiness', data.idbusiness);
        params.append('closetype', 1);
        var url = __URL + "Crmschedule/Business/update_page_data";
        $scope.service.postData(url, params).then(function (resultdata) {
            parent.layer.msg('关闭成功！', { icon: 1 });
            //更新数据源
            dataService.delData('businessArrData', data);
            //这里不要删掉service数据源中的数据，在关闭出差中还要用
            //data._kid = data.idbusiness;
            //delete $scope.service.privateDateObj.businessData[data._kid];
        })
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmschedule/Business/selectdetailed?id=' + row.idbusiness + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmschedule/Business/selectdetailed?id=' + row.idbusiness + '&guid=' + row.guid, row.title);
    }
    //打开已关闭得出差
    $scope.selectclose = function () {
        parent.YL.open('eimselectdetailed', {
            title: '已关闭出差',
            url: __URL + 'Crmschedule/Business/businessclose'
        });
    }
    
    //页面加载完成后，查询数据
    $scope.select();
    //查询所有的用户
    $scope.select_userdata = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_user(params).then(function () {
            $scope.usersCreateData = angular.copy($scope.service.privateDateObj.usersData);
            $scope.usersDoData = angular.copy($scope.usersCreateData);
        });
        //
    }
    //查询用户数据
    $scope.select_userdata();
    //保存操作
    $scope.saveData = function () {
        var param = new URLSearchParams();
        var num = 0;
        var url = __URL + 'Crmschedule/Business/update_page_data';
        if ($scope.Action == 0) {
            url = __URL + 'Crmschedule/Business/add_page_data';
        } else if ($scope.Action == '1') {
            param.append('idbusiness', $scope.selectItem.idbusiness);
        }
        angular.forEach($scope.selectItem, function (value, key) {
            if (value && value != $scope.service.selectItem[key] && key.indexOf('__') < 0) {
                //处理user
                if (key == 'refusers') {
                    value = value.join(',') + ',' + $scope.service.userid;
                }
                param.append(key, value);
                num++;
            }
        });
        //防止权限查不到
        if (!$scope.selectItem.refusers) {
            param.append("refusers", $scope.service.userid);
        }
        if ($scope.ds != $scope.service.selectItem.starttime) {
            $scope.ds = Date.parse($scope.ds) / 1000;
            if ($scope.service.selectItem.starttime != $scope.ds.toFixed(0)) {
                param.append('starttime', $scope.ds);
                num++;
            }
        }
        //开始时间

        //预计结束时间
        if ($scope.de != $scope.service.selectItem.estimatetime) {
            $scope.de = Date.parse($scope.de) / 1000;
            if ($scope.service.selectItem.estimatetime != $scope.de.toFixed(0)) {
                param.append('estimatetime', $scope.de);
                num++;
            }
        }
        //描述
        if ($scope.selectItem.mark != $scope.selectItem.__mark) {
            param.append("mark", $scope.selectItem.__mark);
            num++;
        }
        if (num == 0) {
            //如果没修改内容那就没必要传到后台了
            $scope.businessModal.close();
            return;
        }
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            var markUrl;

            if ($scope.Action == '1') {
                if (data > 0) {
                    if ($scope.ds != $scope.service.selectItem.starttime) {
                        $scope.selectItem.starttime = $scope.ds;
                    }
                    if ($scope.de != $scope.service.selectItem.estimatetime) {
                        $scope.selectItem.estimatetime = $scope.de;
                    }
                    $scope.selectItem._kid = $scope.selectItem.idbusiness;
                    if ($scope.selectItem.refusers && $scope.selectItem.refusers.length > 0 && $scope.selectItem.refusers.join) {
                        $scope.selectItem.refusers = $scope.selectItem.refusers.join(',');
                    }
                    if ($scope.selectItem.mark && $scope.selectItem.mark.length > 0 && $scope.selectItem.mark.join) {
                        $scope.selectItem.mark = $scope.selectItem.mark.join(',');
                    }
                    if ($scope.selectItem.mark && $scope.selectItem.mark.length > 0 && $scope.selectItem.mark.join) {
                        
                    }
                    dataService.updateData('businessArrData', $scope.selectItem);
                    //更新数据源
                    $scope.service.privateDateObj.businessData[$scope.selectItem.idbusiness] = angular.copy($scope.selectItem);
                    //dataService.updateData('businessData', $scope.selectItem);
                    //如果没修改内容那就没必要传到后台了
                    $scope.businessModal.close();
                    return;
                    

                } else {
                    parent.layer.msg('保存失败！');
                }
            } else if ($scope.Action == '0') {
                if (data['id']) {
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.idbusiness = data.id;
                    $scope.selectItem.starttime = $scope.ds;
                    $scope.selectItem.estimatetime = $scope.de;
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.mark = $scope.selectItem.__mark;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.selectItem.status = '0';
                    if ($scope.selectItem.refusers && $scope.selectItem.refusers.length > 0 && $scope.selectItem.refusers.join) {
                        $scope.selectItem.refusers = $scope.selectItem.refusers.join(',');
                    }
                    if ($scope.selectItem.refcontactid && $scope.selectItem.refcontactid.length > 0 && $scope.selectItem.refcontactid.join) {
                        $scope.selectItem.refcontactid = $scope.selectItem.refcontactid.join(',');
                    }
                    dataService.addData('businessArrData', $scope.selectItem);
                    //因为有返回data的参数所以更改一下更新数据源的方法
                    $scope.service.privateDateObj.businessData[data.id] = $scope.selectItem;
                    //dataService.addData('businessData', $scope.selectItem);
                    //这里需要做个判断如果创建人和执行人是一个人的话那就不用发了          || ($scope.selectItem.refusers && $scope.selectItem.refusers.length > 0)
                    if ($scope.selectItem.userid != $scope.selectItem.assignid) {
                        //调用发送邮件方法    
                        var index = parent.layer.msg('保存中，请稍等', { icon: 16, shade: 0.01, time: 1000000000 });
                        //business_mail(data.id).then(function (res) {
                        //邮件发送成功
                        //if (res) {
                        parent.layer.close(index);
                        parent.layer.msg('保存成功！', { icon: 1 });
                        //} else {
                        //    parent.layer.close(index);
                        //    parent.layer.msg('保存成功,邮件发送失败', { icon: 1 });
                        //}
                        //});
                    }
                    $scope.businessModal.close();
                } else {
                    parent.layer.msg('添加失败！');
                }

            };
        });
    }

    //保存 - 客户关系
    $scope.save_customer = function (item) {
        if ($scope.selectItem.refcustomerid != $scope.service.selectItem.refcustomerid) {
            $scope.selectItem.refprojectid = '';
            $scope.selectItem.refcontactid = [];
            $scope.selectProjectdata = {};
            $scope.selectproject();
        }
    }
    //保存 - 项目关系
    //action 0 添加，1 删除
    $scope.save_project = function (item) {
        if ($scope.selectItem.refprojectid != $scope.service.selectItem.refprojectid) {
            $scope.selectItem.refcontactid = [];
            $scope.selectContactData = {};
            $scope.selectcontact();
        }
    }
    $scope.openDetailmodel = function (id) {
        parent.YL.open('eimselectdetailed', {
            title: $scope.service.privateDateObj.customerinfoData[id].name,
            url: __URL + 'Crmcustomerinfo/Customerinfo/selectdetailed?id=' + id + '&guid=' + $scope.service.privateDateObj.customerinfoData[id].guid
        });
    }

}]);