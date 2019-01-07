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
appModule.controller('crmWorkorderController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.workorderData == undefined || Object.keys($scope.service.privateDateObj.workorderData).length < 1) {
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
    //初始化评分参数
    $scope.feedback = 0;
    $scope.timely = 0;
    $scope.additional = 0;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.title = ['一星', '二星', '三星', '四星', '五星'];    
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('container', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment' ]
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset :138
    });
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
            //判断是大于2得就退出循环
            if (object[key].status > 2) {
                delete $scope.service.privateDateObj.workorderData['data'][key];
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
            $scope.service.workorderArrData = [];
        } else {
            $scope.service.workorderArrData = P_objecttoarray($scope.service.privateDateObj.workorderData['data']);
            return;
        }
        angular.forEach($scope.service.privateDateObj.workorderData['data'], function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'type') {
                    id = 'id';
                } else if ($scope.tagsData[svalue].key == 'status') {
                    id = 'id';
                } else {
                    id = 'idusers';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.workorderArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
        if (type == 'type') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'type' });
            if ($scope.service.privateDateObj.workordertypeData[item.value.id] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'status') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'status' });
            if ($scope.service.workorderstatusData[item.value.id] == item.value) {
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
        查询工单（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //项目
        select_project(params).then(function (res) {
            //客户
            select_customerinfo(params).then(function (res) {
                for (var i in $scope.service.privateDateObj.projectData) {
                    $scope.service.privateDateObj.projectData[i]
                }
                //用户
                select_user(params).then(function (res) {
                    select_workorder(params).then(function (res) {
                        //获取联系人数据
                        $scope.select_contact();
                        //如果没有项目的时候会查询到一个空数组，将空数组变成空对象
                        if (Object.prototype.toString.call($scope.service.privateDateObj.workorderData.data) == '[object Array]' && $scope.service.privateDateObj.workorderData.data.length < 1) {
                            $scope.service.privateDateObj.workorderData.data = {};
                            $scope.service.workorderArrData = [];
                        } else {
                            $scope.service.workorderArrData = $scope.P_objecttoarray($scope.service.privateDateObj.workorderData.data);
                        }
                        //把状态从新赋值，去掉3/4
                        $scope.service.workorderstatusData = angular.copy($scope.service.privateDateObj.workerorderStatus);
                        if ($scope.service.workorderstatusData['3'] && $scope.service.workorderstatusData['4']) {
                            delete $scope.service.workorderstatusData['3'];
                            delete $scope.service.workorderstatusData['4'];
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
    //获取工单内容
    $scope.getMark = function () {
        var param = new URLSearchParams();
        param.append('workid', $scope.selectItem.idworkorder);
        param.append('guid', $scope.selectItem.guid);
        $scope.service.postData(__URL + 'Crmschedule/Workordermessage/select_page_data', param).then(function (data) {
            if (data == null) {
                return;
            }
            if (data[0].causedescription) {
                $scope.selectItem.__mark = data[0].causedescription;
                $scope.service.selectItem.__mark = data[0].causedescription;
                //设置编辑器的内容
                ue.setContent(data[0].causedescription);
            }
        });
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
            if(project.refinformant){
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
            if (!$scope.selectItem.__mark) {
                $scope.getMark();//获取工单内容
            } else {
                //说明在selectItem中已经有内容的数据了，不用再查询了
                ue.setContent($scope.selectItem.__mark);//直接给编辑器赋值
            }
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
        $scope.dt = new Date();
        if ($scope.selectItem.expectationendtime && $scope.selectItem.expectationendtime !== '0' && $scope.selectItem.expectationendtime != 'null') {
            var date = new Date($scope.selectItem.expectationendtime * 1000);
            $scope.dt = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
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
    }
    
    //模态框
    $scope.workerorderModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".workerordermodaltemplate",
        openButton: ".workerordertemplatebtn",
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
        $scope.service.type = 'workorder';
        $scope.service.name = '工单';
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
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '添加工单';
        if ($scope.Action != 0 || $scope.selectItem.idworkorder) {
            $scope.selectItem = { assignid: $scope.service.userid };
            //防止点击了修改之后又点击添加编辑框中有值的问题
            ue.setContent('');
        }
        //给指派人附一个初始值（登录人自己）
        $scope.service.selectItem.assignid = $scope.service.userid;
        $scope.Action = 0;
        $scope.initDatepiker();
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '修改工单';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //在初始化之前先把值给清空
        ue.setContent('');
        $scope.initData();
    }
    //删除按钮
    $scope.remove = function (row) {       
        var index = parent.layer.open({
            content: '确认删除工单【' + row.title + '】，是否确认？',
         btn: ['确认', '我再想想'],
         icon: 6,
         area: ['400px'],
         title: '删除客户信息',
         yes: function (index, layero) {
            //按钮【按钮一】的回调
            var params = new URLSearchParams();
            params.append('idworkorder', row.idworkorder);
            $scope.service.postData(__URL + 'Crmschedule/Workorder/del_page_data', params).then(function (data) {
                if (data) {
                    parent.layer.msg('删除成功', { icon: 1 });
                    $scope.service.delData('workorderArrData', row);
                    row._kid = row.idworkorder;
                    delete $scope.service.privateDateObj.workorderData.data[row._kid];
                }
            });
            parent.layer.close(index);
        }
        });
    }

    //确认工单
    $scope.alertConfirm = function (item) {
        var index = parent.layer.open({
            content: '确认由我去完成《' + item.title + '》工单，是否确认？'
           , btn: ['确认', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '确认工单'
           , yes: function (index, layero) {
               //按钮【按钮一】的回调
               $scope.service.datatype = '5';
               $scope.saveHistrylogResult(item, { mark: '' }, '5', '1');
               parent.layer.close(index);
           }
        });
    }
    //提交工单模态框
    $scope.uploadcompleteModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".uploadcompletemodaltemplate",
        openButton: ".workerordertemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "45vw"
    });
    //提交工单
    $scope.alertUpload = function (item) {
        //打开提交工单模态框
        $scope.uploadcompleteModal.open();
        $scope.uploadcompleteModal.title = '提交工单';
        $scope.service.datatype = '6';
        $scope.selectItem = item;
        //把结果描述初始化
        $scope.selectItem.resultdescription = "";
    }
    //提交中保存按钮
    $scope.saveUpload = function () {
        //更改状态
        $scope.saveHistrylogResult($scope.selectItem, { mark: '' }, '6', '2');
        //添加结果描述
        var param = new URLSearchParams();
        param.append("workid", $scope.selectItem.idworkorder);
        param.append("guid", $scope.selectItem.guid);
        param.append("resultdescription", $scope.selectItem.resultdescription);
        var markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
        $scope.service.postData(markUrl, param).then(function (data) {
            if (data < 0) {
                parent.layer.msg('工单内容保存失败');
                return;
            } else {
                $scope.service.selectItem.resultdescription = $scope.selectItem.resultdescription;
                $scope.workerorderModal.close();
            }
        });
        $scope.uploadcompleteModal.close();
    }

    //结束工单模态框
    $scope.beforecompleteModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".beforecompletemodaltemplate",
        openButton: ".workerordertemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
    //结束工单
    $scope.alertOver = function (item) {
        $scope.beforecompleteModal.open();
        $scope.beforecompleteModal.title = '结束工单';
        $scope.service.placeholder = '请对我的工作做一个评价吧！^_^... ';
        $scope.service.datatype = 4;
        $scope.selectItem = item;
        //当用户的鼠标悬停在特定图标上时调用的可选表达式
        $scope.hoveringOver = function (value, type) {
            if (type == 1) {
                $scope.feedbackoverStar = value;
                $scope.feedbackpercent = value;
            }else if(type ==2){
                $scope.timelyoverStar = value;
                $scope.timelypercent = value;
            }else if(type == 3){
                $scope.additionaloverStar = value;
                $scope.additionalpercent = value;
            }
        };
    }
    //保存历史记录之前，先判断是否状态已经改变
    $scope.saveHistrylogResult = function (item, result, datatype, status) {
        if (datatype == 4 && status == 3) {
            if (!$scope.feedback || !$scope.timely || !$scope.additional) {
                parent.layer.msg('请给我的工作进行评分！');
                return;
            }
        }
        $scope.save(item.idworkorder, status).then(function (data) {
            //处理状态修改条件达不到时
            if (data instanceof Object && data['key']) {
                item.status = data['value'].status;
                parent.layer.msg('您的数据已过期，请刷新页面后再更改');
                return;
            }
            item.status = status;
            //这里需要做个判断如果创建人和执行人是一个人的话那就不用发了      || (item.refusers && item.refusers.length > 0)
            if (item.userid != item.assignid) {
                var index = parent.layer.msg('保存中，请稍等', { icon: 16, shade: 0.01, time: 1000000000 });
                //调用发送邮件方法    
                workorder_mail(item.idworkorder).then(function (res) {
                    //邮件发送成功
                    if (res) {
                        parent.layer.close(index);
                        parent.layer.msg('保存成功', { icon: 1 });
                    } else {
                        parent.layer.close(index);
                        parent.layer.msg('保存成功,邮件发送失败', { icon: 1 });
                    }
                });
            }
            $scope.saveHistrylogData(item.idworkorder, result.mark ? result.mark : result, datatype).then(function (data) {
            });
        });
    }

    //保存历史记录
    /**
      *orderid,mark,datatype
    **/
    $scope.saveHistrylogData = function (orderid, mark, datatype) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmsetting/Historicallog/insert_page_data";
        params.append('refid', orderid);
        params.append('text', mark ? mark : '');
        params.append('datatype', datatype);
        params.append('type', 'workorder');
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                //处理正常结果
                defer.resolve(data);
                //判断在结单的时候执行的操作
                if (datatype == '4') {
                    $scope.selectItem.status = 3;
                    $scope.beforecompleteModal.toggle();
                }
            } else {
                parent.layer.msg('评价失败', { icon: 2 });
                //处理异常结果
                defer.reject(data);
            }
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //修改工单状态
    $scope.save = function (idworkorder, status) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Workorder/update_page_data";
        params.append('idworkorder', idworkorder);
        params.append('status', status);
        params.append('datatype', $scope.service.datatype);
        params.append('updatetime', (new Date().getTime() / 1000).toFixed(0));
        if (status == '1') {
            params.append('starttime', (new Date().getTime()/1000).toFixed(0));
        } else if (status == '3') {
            params.append('feedback', $scope.feedback);
            params.append('timely', $scope.timely);
            params.append('additional', $scope.additional);
            $scope.totalscore = ((parseInt($scope.feedback) + parseInt($scope.timely) + parseInt($scope.additional)) / 3).toFixed(1);
            params.append('totalscore', $scope.totalscore);//平均分
            params.append('endtime', (new Date().getTime() / 1000).toFixed(0));
            //更新数据源
            $scope.service.privateDateObj.workorderData.data[idworkorder].feedback = $scope.feedback;
            $scope.service.privateDateObj.workorderData.data[idworkorder].timely = $scope.timely;
            $scope.service.privateDateObj.workorderData.data[idworkorder].additional = $scope.additional;
            $scope.service.privateDateObj.workorderData.data[idworkorder].totalscore = $scope.totalscore;
        }
        $scope.service.postData(url, params).then(function (data) {
           
            if (data > 0) {
                parent.layer.msg('修改成功', { icon: 1 });
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.title,
            url: __URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid, row.title);
    }
    //打开已关闭得工单
    $scope.selectclose = function () {
        parent.YL.open('eimselectdetailed', {
            title: '已关闭工单',
            url: __URL + 'Crmschedule/Workorder/workorderclose'
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
        var url = __URL + 'Crmschedule/Workorder/update_page_data';
        if ($scope.Action == 0) {
            url = __URL + 'Crmschedule/Workorder/add_page_data';
        } else if ($scope.Action == '1') {
            param.append('idworkorder', $scope.selectItem.idworkorder);
        }
        //get到百度编辑器中的内容
        $scope.selectItem.__mark = ue.getContent();
        angular.forEach($scope.selectItem, function (value, key) {
            if (!$scope.service.selectItem[key]) {
                param.append(key, value);
                num++;
            } else if (value && value.toString() != $scope.service.selectItem[key].toString() && key.indexOf('__') < 0) {
                //处理user
                if (key == 'refusers') {
                    value = value.join(',');
                }
                param.append(key, value);
                num++;
            }
        });
        if ($scope.dt) {
            //将标准时间转换成时间戳
            if ($scope.service.selectItem.expectationendtime != (Date.parse($scope.dt) / 1000).toFixed(0)) {
                param.append('expectationendtime', (Date.parse($scope.dt) / 1000));
                num++;
            }
        }
        if (num == 0) {
            if ($scope.selectItem.__mark != $scope.service.selectItem.__mark) {
                param.append("workid", $scope.selectItem.idworkorder);
                param.append("guid", $scope.selectItem.guid);
                param.append("causedescription", $scope.selectItem.__mark);
                var markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
                $scope.service.postData(markUrl, param).then(function (data) {
                    if (data < 0) {
                        parent.layer.msg('工单内容保存失败');
                        return;
                    } else {
                        $scope.service.selectItem.__mark = $scope.selectItem.__mark;
                        $scope.workerorderModal.close();
                    }
                });

            } else {
                //如果没修改内容那就没必要传到后台了
                $scope.workerorderModal.close();

            }
            return;
        }
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            var markUrl;

            if ($scope.Action == '1') {
                if (data > 0) {
                    if ((Date.parse($scope.dt) / 1000) != $scope.service.selectItem.expectationendtime) {
                        $scope.selectItem.expectationendtime = Date.parse($scope.dt) / 1000;
                    }
                    $scope.selectItem._kid = $scope.selectItem.idworkorder;
                    dataService.updateData('workorderArrData', $scope.selectItem);
                    //更新数据源
                    $scope.service.privateDateObj.workorderData.data[$scope.selectItem.idworkorder] = angular.copy($scope.selectItem);
                    //dataService.updateData('workorderData', $scope.selectItem);
                    markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
                    if ($scope.selectItem.__mark != $scope.service.selectItem.__mark) {
                        param.append("workid", $scope.selectItem.idworkorder);
                        param.append("guid", $scope.selectItem.guid);
                        param.append("causedescription", $scope.selectItem.__mark);
                        $scope.service.postData(markUrl, param).then(function (data) {
                            if (data < 0) {
                                parent.layer.msg('工单内容保存失败');
                                //问题描述添加失败，将问题描述回退到数据库中版本
                                $scope.selectItem.__mark = $scope.service.selectItem.__mark;
                                return;
                            }
                        });
                        //提示并关闭模态框
                        $scope.workerorderModal.close();
                    } else {
                        //如果没修改内容那就没必要传到后台了
                        $scope.workerorderModal.close();
                        return;
                    }

                } else {
                    parent.layer.msg('保存失败！');
                }
            } else if ($scope.Action == '0') {
                if (data['id']) {
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.idworkorder = data.id;
                    $scope.selectItem.expectationendtime = (Date.parse($scope.dt) / 1000);
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.selectItem.status = '0';
                    dataService.addData('workorderArrData', $scope.selectItem);
                    //因为有返回data的参数所以更改一下更新数据源的方法
                    $scope.service.privateDateObj.workorderData.data[data.id] = $scope.selectItem;
                    //dataService.addData('workorderData', $scope.selectItem);
                    markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
                    param.append("workid", data.id);
                    param.append("guid", $scope.selectItem.guid);
                    param.append("causedescription", $scope.selectItem.__mark);
                    $scope.service.postData(markUrl, param).then(function (data) {
                        if (data < 0) {
                            parent.layer.msg('工单内容保存失败');
                            return;
                        }
                    });
                    //这里需要做个判断如果创建人和执行人是一个人的话那就不用发了          || ($scope.selectItem.refusers && $scope.selectItem.refusers.length > 0)
                    if ($scope.selectItem.userid != $scope.selectItem.assignid) {
                        //调用发送邮件方法    
                        var index = parent.layer.msg('保存中，请稍等', { icon: 16, shade: 0.01, time: 1000000000 });
                        workorder_mail(data.id).then(function (res) {
                            //邮件发送成功
                            if (res) {
                                parent.layer.close(index);
                                parent.layer.msg('保存成功！', {icon:1});
                            } else {
                                parent.layer.close(index);
                                parent.layer.msg('保存成功,邮件发送失败', { icon: 1 });
                            }
                        });
                    }
                    $scope.workerorderModal.close();
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
}])
.controller('crmWorkorderModelController', ['$scope', 'dataService',  function ($scope, dataService) {
    $scope.service = dataService;
}]);

