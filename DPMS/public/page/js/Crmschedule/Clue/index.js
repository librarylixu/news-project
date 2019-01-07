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
appModule.controller('crmClueController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.clueData == undefined || Object.keys($scope.service.privateDateObj.clueData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    //存一份userid（当前仅用来判断是否是管理员）
    $scope.service.userid = _USERID;
    //给默认项初始化
    $scope.selectItem = {};
    //进来将角标值改为0，
    var apps = parent.YL.util.dataCopy('apps');
    parent.YL.vue.$set(parent.YL.vue, 'apps', apps);
    apps['eim-' + _appid].badge = 0;
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
        }       0
        return tmp;
    }
    //tags的数据源
    $scope.tagsData = [];
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.clueArrData = [];
        } else {
            $scope.service.clueArrData = P_objecttoarray($scope.service.privateDateObj.clueData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.clueData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'type') {
                    id = 'id';
                } else if ($scope.tagsData[svalue].key == 'status') {
                    id = 'id';
                } else {
                    id = 'idusers';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.clueArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
        if (type == 'type') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'type' });
            if ($scope.service.privateDateObj.cluetypeData[item.value.id] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'status') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'status' });
            if ($scope.service.privateDateObj.workerorderStatus[item.value.id] == item.value) {
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
        查询商机（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append("$json", true);
        select_user(params).then(function (res) {
            params.append('$in',true);
            params.append('status','0,1,2');
            select_clue(params).then(function (res) {
                //如果没有项目的时候会查询到一个空数组，将空数组变成空对象
                if (Object.prototype.toString.call($scope.service.privateDateObj.clueData) == '[object Array]' && $scope.service.privateDateObj.clueData.length < 1) {
                    $scope.service.privateDateObj.clueData = {};
                    $scope.service.clueArrData = [];
                } else {
                    $scope.service.clueArrData = $scope.P_objecttoarray($scope.service.privateDateObj.clueData);
                }
                //获取产品型号数据    
                //select_productmodel(params);
                //关闭加载层
                parent.layer.closeAll('loading');
            });
        });
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
   
    //模态框
    $scope.clueModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".workerordermodaltemplate",
        openButton: ".workerordertemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
   
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        $scope.clueModal.open();
        $scope.clueModal.title = '添加商机';
        if ($scope.Action != 0 || $scope.selectItem.idclue) {
            $scope.selectItem = { assignid: $scope.service.userid };
            //防止点击了修改之后又点击添加编辑框中有值的问题
            ue.setContent('');
        }
        //给指派人附一个初始值（登录人自己）
        $scope.service.selectItem.assignid = $scope.service.userid;
        $scope.Action = 0;
        //查询产品数据
        var params = new URLSearchParams();
        params.append('$json', true);
        select_product(params);
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.clueModal.open();
        $scope.clueModal.title = '修改工单';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //在初始化之前先把值给清空
        ue.setContent($scope.service.selectItem.mark);
        //把抄送人数据转成数组
        if ($scope.selectItem.refusers && $scope.selectItem.refusers.split) {
            $scope.selectItem.refusers = $scope.selectItem.refusers.split(",");
        }
        //查询产品数据
        var params = new URLSearchParams();
        params.append('$json', true);
        select_product(params);
    }
    //删除按钮
    $scope.remove = function (row) {       
        var index = parent.layer.open({
            content: '是否要删除此商机，是否确认？',
            btn: ['确认删除', '我再想想'],
         icon: 6,
         area: ['400px'],
         title: '删除商机信息',
         yes: function (index, layero) {
            //按钮【按钮一】的回调
            var params = new URLSearchParams();
            params.append('idclue', row.idclue);
            $scope.service.postData(__URL + 'Crmschedule/Clue/del_page_data', params).then(function (data) {
                if (data) {
                    parent.layer.msg('删除成功', { icon: 1 });
                    $scope.service.delData('clueArrData', row);
                    row._kid = row.idclue;
                    delete $scope.service.privateDateObj.clueData[row._kid];
                }
            });
            parent.layer.close(index);
        }
        });
    }

    //认领商机
    $scope.alertConfirm = function (item) {
        var index = parent.layer.open({
            content: '是否认领此商机？'
           , btn: ['确认', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '认领商机'
           , yes: function (index, layero) {
               //此处设置一下状态
               $scope.cluestatus = '2';
               //按钮【按钮一】的回调
               $scope.saveCluerecordResult(item, '2', '由[' + $scope.service.privateDateObj.usersData[item.assignid].description + ']认领了此商机！');
               parent.layer.close(index);
           }
        });
    }
    //模态框
    $scope.closeclueModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".closecluemodaltemplate",
        openButton: ".workerordertemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "40vw"
    });
    //关闭商机
    $scope.alertOver = function (item) {
        $scope.closeclueModal.open();
        $scope.closeclueModal.title = '关闭商机';
        $scope.service.selectItem = item;
        $scope.selectItem = angular.copy(item);
        $scope.cluestatus = 3;
    }
    //打开已关闭得出差
    $scope.selectclose = function () {
        parent.YL.open('eimselectdetailed', {
            title: '已关闭商机',
            url: __URL + 'Crmschedule/Clue/clueclose'
        });
    }
    //保存历史记录之前，先判断是否状态已经改变
    $scope.saveCluerecordResult = function (item, status, message) {
        $scope.save(item, status).then(function (data) {
            //处理状态修改条件达不到时
            if (data instanceof Object && data['key']) {
                item.status = data['value'].status;
                parent.layer.msg('您的数据已过期，请刷新页面后再更改');
                return;
            }
            item.status = $scope.cluestatus;
            //保存历史记录的方法
            $scope.saveCluerecordData(item.idclue, message);
        });
    }

    //保存历史记录
    /**
      *orderid,mark
    **/
    $scope.saveCluerecordData = function (orderid, mark) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmsetting/Cluerecord/insert_page_data";
        params.append('refclue', orderid);
        params.append('message', mark ? mark : '');
        $scope.service.postData(url, params).then(function (data) {
            if (data.ok > 0) {
                //处理正常结果
                defer.resolve(data);
            } else {
                parent.layer.msg('保存历史记录失败', { icon: 2 });
                //处理异常结果
                defer.reject(data);
            }
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //修改工单状态    savealldata参数表示是否要更新所有的数据
    $scope.save = function (data, status,savealldata) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Clue/update_page_data";
        params.append('idclue', data.idclue);
        params.append('status', status);
        if (savealldata) {
            angular.forEach(data, function (value, key) {
                params.append(key, value);
            });    
        }
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                parent.layer.msg((status == '2' ? '认领' : '关闭') + '成功', { icon: 1 });
                $scope.closeclueModal.close();
            }
            $scope.selectItem._kid = $scope.selectItem.idclue;
            $scope.selectItem.userid = $scope.service.userid;
            $scope.selectItem.status = $scope.service.cluestatus;
            dataService.updateData('clueArrData', $scope.selectItem);
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
            title: row.customername,
            url: __URL + 'Crmschedule/Clue/selectdetailed?id=' + row.idclue + '&guid=' + row.guid+'&datauserid='+row.userid
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
        var url = __URL + 'Crmschedule/Clue/update_page_data';
        if ($scope.Action == 0) {
            url = __URL + 'Crmschedule/Clue/add_page_data';
        } else if ($scope.Action == '1') {
            param.append('idclue', $scope.selectItem.idclue);
            //这里需要多一层判断--如果已经有指派人了，并且不是自己的时候 ************ 这里使用的逻辑有点不清楚，之后再来改
            if ($scope.service.selectItem.assignid != $scope.service.userid && $scope.service.selectItem.assignid != $scope.selectItem.assignid && $scope.service.selectItem.status < 3) {
                parent.layer.msg('此商机已经关联给【' + $scope.service.privateDateObj.usersData[$scope.service.selectItem.assignid].description + '】，需要对方关闭或中止您才可以再指派');
                return;
            }
        }
        //get到百度编辑器中的备注
        $scope.selectItem.mark = ue.getContent();
        //默认都会有一个指派，但是默认会指派给自己，当是自己的时候就是未指派,如果是其他人那就是已指派的状态
        if ($scope.selectItem.assignid != $scope.service.userid) {
            $scope.selectItem.status = 1;
        }
        angular.forEach($scope.selectItem, function (value, key) {
            if (value && value != $scope.service.selectItem[key] && key.indexOf('__') < 0) {
                param.append(key, value);
                num++;
            }
        });
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            var markUrl;

            if ($scope.Action == '1') {
                if (data > 0) {
                    $scope.selectItem._kid = $scope.selectItem.idclue;
                    $scope.selectItem.userid = $scope.service.userid;
                    dataService.updateData('clueArrData', $scope.selectItem);
                    //更新数据源
                    $scope.service.privateDateObj.clueData[$scope.selectItem.idclue] = angular.copy($scope.selectItem);
                    parent.layer.msg('保存成功！', { icon: 1 });
                    $scope.clueModal.close();
                } else {
                    parent.layer.msg('保存失败！');
                }
            } else if ($scope.Action == '0') {
                if (data['id']) {
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.idclue = data.id;
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.selectItem.status = (($scope.selectItem.userid == $scope.selectItem.assignid)?0:1);
                    dataService.addData('clueArrData', $scope.selectItem);
                    //因为有返回data的参数所以更改一下更新数据源的方法
                    $scope.service.privateDateObj.clueData[data.id] = $scope.selectItem;
                    parent.layer.msg('保存成功！', {icon:1});
                    $scope.clueModal.close();
                } else {
                    parent.layer.msg('添加失败！');
                }

            };
        });
    }
}])

