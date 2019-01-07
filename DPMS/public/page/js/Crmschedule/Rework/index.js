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
appModule.controller('crmReworkController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.reworkData == undefined || Object.keys($scope.service.privateDateObj.reworkData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    //进来将角标值改为0，
    //var apps = parent.YL.util.dataCopy('apps');
    //parent.YL.vue.$set(parent.YL.vue, 'apps', apps);
    //apps['eim-' + _appid].badge = 0;
    //存一份userid（当前仅用来判断是否是管理员）
    $scope.service.userid = userid;
    //给默认项初始化
    $scope.selectItem = {};
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
    //项目
    $scope.selectShipmentsData = {};
    //获取维修设备---点击添加或编辑时组件的页面数据
    $scope.getreworkdevice = function (data) {
        data.__refprojectdevicelist = [];
        for (var item in $scope.service.privateDateObj.reworkdeviceData) {
            if ($scope.service.privateDateObj.reworkdeviceData[item].refrework == data.idrework && !$scope.service.privateDateObj.reworkdeviceData[item].__deleted) {
                //模态框用作数据是否需要编辑
                $scope.service.privateDateObj.reworkdeviceData[item].__update = false;
                data.__refprojectdevicelist.push($scope.service.privateDateObj.reworkdeviceData[item]);
            }
        }
    }
    //转数组
    $scope.P_objecttoarray = function (object) {
        var tmp = [];
        for (var key in object) {
            //组建主页面负责人检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].userid]) {
                $scope.selectUserData[object[key].userid] = $scope.service.privateDateObj.usersData[object[key].userid];
            }
            //组建主页面检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].assignid]) {
                $scope.selectAssignData[object[key].assignid] = $scope.service.privateDateObj.usersData[object[key].assignid];
            }
            //组建主页面出货清单检索可选项
            if ($scope.service.privateDateObj.shipmentsData[object[key].refship]) {
                $scope.selectShipmentsData[object[key].refship] = $scope.service.privateDateObj.shipmentsData[object[key].refship];
            }
            //key是属性,object[key]是值
            tmp.push(object[key]);//往数组中放属性
        }       
        return tmp;
    }
    //tags的数据源
    $scope.tagsData = [];
    //大检索--根据序列号检索
    $scope.serialselect = function () {
        //先检测检索框中是否有值
        if (!$scope.filtername) {
            parent.layer.msg("请输入后再点击搜索！");
            return;
        }
        //这里我加个等待

        //如果有值去后台查询去，这个查询采用like查询，可能会导致缓慢延迟等现象。
        var params = new URLSearchParams();
        params.append('serials', $scope.filtername);
        params.append('$find', true);
        $scope.service.postData(__URL + 'Crmschedule/Reworkdevice/select_like_data', params).then(function (data) {
            //不管查没查到先把数据清空
            $scope.service.reworkArrData = [];
            if (data) {
                for (var d = 0; d < data.length; d++) {
                    $scope.service.reworkArrData.push($scope.service.privateDateObj.reworkData[data[d].refrework]);
                }
            }
        });
    }
    //大检索---根据序列号检索（给添加修改框使用的）
    $scope.serialfilter = function () {
        //先检测检索框中是否有值
        if (!$scope.filternamesave) {
            parent.layer.msg("请输入后再点击搜索！");
            return;
        }
        //如果有值去后台查询去，这个查询采用like查询，可能会导致缓慢延迟等现象。
        var params = new URLSearchParams();
        params.append('serials', $scope.filternamesave);
        params.append('$find', true);
        $scope.service.postData(__URL + 'Crmschedule/Shipmentsdevice/select_like_data', params).then(function (data) {
            if (data) {
                $scope.service.selectItem.refship = data.refship;
                parent.layer.msg('已为您检索到出货清单');
            } else {
                parent.layer.msg('未找到这条出货清单');
            }
        });
    }
    //监听函数，如果序列号查询是空的那就把之前的值还他
    $scope.$watch('filtername', function (newValue, oldValue) {
        if (newValue === '') {
            $scope.service.reworkArrData = $scope.P_objecttoarray($scope.service.privateDateObj.reworkData);
            return;
        }
    });
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.reworkArrData = [];
        } else {
            $scope.service.reworkArrData = P_objecttoarray($scope.service.privateDateObj.reworkData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.reworkData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'userid') {
                    id = 'idusers';
                } else if ($scope.tagsData[svalue].key == 'assignid') {
                    id = 'idusers';
                } else if ($scope.tagsData[svalue].key == 'refshipments') {
                    id = 'idshipments';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.reworkArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
        if (type == 'user') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'userid' });
            if ($scope.selectUserData[item.value.idusers] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'assign') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'assignid' });
            if ($scope.selectAssignData[item.value.idusers] == item.value) {
                $scope[type] = {};
                $scope.tagSearch();
            }

        } else if (type == 'refshipments') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'refshipments' });
            if ($scope.selectShipmentsData[item.value.idproject] == item.value) {
            $scope[type] = {};
            $scope.tagSearch();
        }
        }
    }
    //删除一条筛选条件
    $scope.removeTag = function (item) {
        var index = $scope.tagsData.indexOf(item);
       if (item.key == 'userid') {
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
       } else if (item.key == 'refshipments') {
            if (index > -1) {
               $scope.tagsData.splice(index, 1);
               $scope.tagSearch();
               try {
                   var _i = $scope.service.refshipments.indexOf(item.value);
                   $scope.service.refshipments.splice(_i, 1);
               } catch (e) {
                   console.log("$scope.service.refshipments.splice:" + e);
               }
           }
       }
    }
    /*
        查询返修清单（本页面使用）数据
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
                    //查询返修清单
                    select_rework(params).then(function (res) {
                        $scope.service.reworkArrData = $scope.P_objecttoarray($scope.service.privateDateObj.reworkData);
                        //查询其他相关数据
                        $scope.selectother();
                    });
                    //关闭加载层
                    parent.layer.closeAll('loading');
                });
            })
        });
    }
    //查询相关数据
    $scope.selectother = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //联系人
        select_customer_contact(params)
        //产品
        select_product(params);
        //产品型号
        select_productmodel(params);
        //项目供货清单数据
        select_project_devicelist(params);
        //出货清单
        select_shipments(params).then(function (res) {
            //查询出货清单----这里特殊权限，所以强制查询
            var shipparams = new URLSearchParams();
            //把返修清单中的refship拿出来，去出货清单中找
            var idship = '';
            for (item in $scope.service.privateDateObj.reworkData) {
                if ($scope.service.privateDateObj.reworkData[item].refship) {
                    idship += $scope.service.privateDateObj.reworkData[item].refship + ',';
                }
            }
            //截去最后一个"，"
            var reg = /,$/gi;
            idship = idship.replace(reg, "");
            shipparams.append('$json', true);
            shipparams.append('$findall', true);
            shipparams.append('idshipments', idship);
            select_shipments(shipparams, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                for(key in data){
                    $scope.service.privateDateObj.shipmentsData[key] = data[key];
                }
            });
        });
        //查询返修设备
        select_reworkdevice(params);
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.dt = new Date();
        if ($scope.selectItem.estimatedendtime && $scope.selectItem.estimatedendtime !== '0' && $scope.selectItem.estimatedendtime != 'null') {
            var date = new Date($scope.selectItem.estimatedendtime * 1000);
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
    $scope.reworkModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".reworkmodaltemplate",
        openButton: ".reworktemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        $scope.reworkModal.open();
        $scope.reworkModal.title = '添加返修清单';
        if ($scope.Action != 0 || $scope.selectItem.idrework) {
            $scope.selectItem = {};
            //防止点击了修改之后又点击添加编辑框中有值的问题
            ue.setContent('');
        }
        $scope.Action = 0;
        //初始化维修设备
        $scope.selectItem.__refprojectdevicelist = [];
        $scope.initDatepiker();
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.reworkModal.open();
        $scope.reworkModal.title = '修改返修清单';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //给编辑器赋值
        if ($scope.selectItem.phenomenon) {
            ue.setContent($scope.selectItem.phenomenon);
        }
        //初始化抄送人
        if ($scope.selectItem.refusers && $scope.selectItem.refusers.split) {
            $scope.selectItem.refusers = $scope.selectItem.refusers.split(",");
        }
        //初始化维修设备
        $scope.getreworkdevice($scope.selectItem);
        $scope.initDatepiker();
    }
    //删除按钮
    $scope.remove = function (row) {       
        var index = parent.layer.open({
            content: '确认删除返修清单，是否确认？',
         btn: ['确认', '我再想想'],
         icon: 6,
         area: ['400px'],
         title: '删除返修清单信息',
         yes: function (index, layero) {
            //按钮【按钮一】的回调
            var params = new URLSearchParams();
            params.append('idrework', row.idrework);
            $scope.service.postData(__URL + 'Crmschedule/Rework/del_page_data', params).then(function (data) {
                if (data) {
                    parent.layer.msg('删除成功', { icon: 1 });
                    $scope.service.delData('reworkArrData', row);
                    row._kid = row.idrework;
                    delete $scope.service.privateDateObj.reworkData[row._kid];
                }
            });
            parent.layer.close(index);
        }
        });
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: "返修清单",
            url: __URL + 'Crmschedule/Rework/selectdetailed?id=' + row.idrework + '&guid=' + row.guid
        });
    }
    //查看客户详细按钮 -- 这个方法没有被用到，因为前台找不到guid。所以暂时无法跳转
    $scope.selectcustomerdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmcustomerinfo/Customerinfo/selectdetailed?id=' + row.idcustomerinfo + '&guid=' + row.guid
        });
    }
    //查看项目详细按钮
    $scope.selectshipdetailed = function(row){
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmschedule/Shipments/selectdetailed?id=' + row.idshipments + '&guid=' + row.guid
        });
    }
    //查看项目详细按钮
    $scope.selectprojectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid
        });
    }
    //页面加载完成后，查询数据
    $scope.select();
   
    //保存操作
    $scope.saveData = function () {
        var param = new URLSearchParams();
        var num = 0;
        var url = __URL + 'Crmschedule/Rework/update_page_data';
        if ($scope.Action == 0) {
            url = __URL + 'Crmschedule/Rework/add_page_data';
        } else if ($scope.Action == '1') {
            param.append('idrework', $scope.selectItem.idrework);
        }
        //保存之前判定一下指派人不是自己
        if ($scope.Action == 0 && $scope.service.userid == $scope.selectItem.assignid) {
            parent.layer.msg('指派人不能是自己！');
            return;
        }
        //将维修设备设置为必填项
        if ($scope.Action == 0 && ($scope.selectItem.__refprojectdevicelist == undefined || $scope.selectItem.__refprojectdevicelist.length < 1)) {
            parent.layer.msg('维修设备不能为空！');
            return;
        }
        //get到百度编辑器中的内容
        $scope.selectItem.phenomenon = ue.getContent();
        //吧service中的值给它
        $scope.selectItem.refship = $scope.service.selectItem.refship;
        param.append('refship', $scope.selectItem.refship);
        angular.forEach($scope.selectItem, function (value, key) {
            if (value && value != $scope.service.selectItem[key]) {
                //处理user
                if (key == 'refusers') {
                    value = value.join(',');
                }
                param.append(key, value);
                num++;
            }
        });
        if ($scope.dt && $scope.dt.getTime) {
            //将标准时间转换成时间戳
            $scope.dt = Date.parse($scope.dt) / 1000;
            if ($scope.service.selectItem.estimatedendtime != $scope.dt.toFixed(0)) {
                param.append('estimatedendtime', $scope.dt);
                num++;
            }
        } else if ($scope.dt && !$scope.dt.getTime) {
            if ($scope.dt != $scope.service.selectItem.estimatedendtime) {
                param.append('estimatedendtime', $scope.dt);
                num++;
            }
        }
        if (num == 0) {
            return;
        }
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            if ($scope.Action == '1') {
                if (data > 0) {
                    if ($scope.dt != $scope.service.selectItem.contracttime) {
                        $scope.selectItem.contracttime = $scope.dt;
                    }
                    $scope.selectItem._kid = $scope.selectItem.idrework;
                    dataService.updateData('reworkArrData', $scope.selectItem);
                    //更新数据源
                    $scope.service.privateDateObj.reworkData[$scope.selectItem.idrework] = angular.copy($scope.selectItem);
                    $scope.reworkModal.close();
                } else {
                    parent.layer.msg('保存失败！');
                }
            } else if ($scope.Action == '0') {
                if (data['id']) {
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.idrework = data.id;
                    $scope.selectItem.estimatedendtime = $scope.dt;
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.status = "0";
                    dataService.addData('reworkArrData', $scope.selectItem);
                    //因为有返回data的参数所以更改一下更新数据源的方法
                    $scope.service.privateDateObj.reworkData[data.id] = $scope.selectItem;
                    $scope.reworkModal.close();
                } else {
                    parent.layer.msg('添加失败！');
                }

            };
            //添加/修改出货设备
            $scope.bulidProductlist();
        });
    }
    //认领返修
    $scope.alertConfirm = function (item) {
        var index = parent.layer.open({
            content: '确认由我去完成此返修吗，是否确认？'
           , btn: ['确认', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '确认返修'
           , yes: function (index, layero) {
               //这里调用修改方法
               $scope.savestatusData(0, item);
               parent.layer.close(index);
           }
        });
    }
    //完成返修模态框
    $scope.reworkuploadModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".reworkuploadmodaltemplate",
        openButton: ".reworkuploadtemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
    //结果描述百度编辑器
    var description = UE.getEditor('description', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
    });
    //完成返修
    $scope.alertUpload = function (item) {
        $scope.reworkuploadModal.open();
        $scope.reworkuploadModal.title = '完成返修清单';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = item;
        $scope.selectItem = angular.copy(item);
        //初始化维修设备
        $scope.getreworkdevice($scope.selectItem);
    }
    //关闭返修
    $scope.alertOver = function (item) {
        var index = parent.layer.open({
            content: '确认要关闭返修吗，是否确认？'
           , btn: ['确认', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '关闭返修'
           , yes: function (index, layero) {
               //这里调用修改方法
               $scope.savestatusData(2, item);
               parent.layer.close(index);
           }
        });
    }
    /*
        用于修改状态数据 -- 认领/提交/关闭
        type 用于区分是什么操作 0：认领 1：提交 2：关闭
        data 要保存的值
    */
    $scope.savestatusData = function (type, data) {
        var param = new URLSearchParams();
        var url = __URL + 'Crmschedule/Rework/update_page_data';
        param.append('idrework', data.idrework);
        var status;
        if (type == 0) {
            //认领
            data.status = 1;
            param.append('starttime', Date.parse(new Date())/1000);
        }else if(type == 1){
            //完成返修
            data.status = 2;
            //获得结果描述文本
            param.append('description',description.getContent());
            //修改返修设备
            for (var i = 0; i < $scope.selectItem.__refprojectdevicelist.length;i++){
                $scope.selectItem.__refprojectdevicelist[i].__update = true;
            }
            //修改清单
            $scope.bulidProductlist();
            //关闭模态框
            $scope.reworkuploadModal.close();
        }else{
            //关闭返修
            data.status = 3;
            param.append('endtime', Date.parse(new Date()) / 1000);
        }
        //参数--状态
        param.append('status', data.status);
        //开始保存
        $scope.service.postData(url, param).then(function (result) {
            if (result) {
                //更新数据源
                dataService.updateData('reworkArrData', data);
                $scope.service.privateDateObj.reworkData[data.idrework] = angular.copy(data);
            } else {
                parent.layer.msg('保存失败！');
            }
        });
    }
    //添加产品清单--新增产品后触发的事件
    $scope.addProductlist = function () {
        if (!$scope.selectItem.__refprojectdevicelist) {
            $scope.selectItem.__refprojectdevicelist = [];
        }
        var newData = { addData: true, productnumber: 1};
        var flag = true;
        for (var i = 0; i < $scope.selectItem.__refprojectdevicelist.length; i++) {
            if (!$scope.selectItem.__refprojectdevicelist[i].productmodelid || !$scope.selectItem.__refprojectdevicelist[i].productnumber) {
                flag = false;
                parent.layer.msg("请将上一条维修信息填写完整！", { icon: 0 });
                break;
            }
        };
        if (flag) {
            $scope.selectItem.__refprojectdevicelist.push(newData);
        }
    }
    //删除产品清单
    $scope.delProductlist = function (item) {
        if (item.addData) {
            var index = $scope.selectItem.__refprojectdevicelist.indexOf(item);
            $scope.selectItem.__refprojectdevicelist.splice(index, 1);
        } else {
            item.__delelte = true;
        }
    }
    //判断产品清单保存的动作（增删改）
    $scope.bulidProductlist = function () {
        if (!$scope.selectItem.__refprojectdevicelist || $scope.selectItem.__refprojectdevicelist.length < 1) {
            return;
        }
        $scope.newdata = {
            add: [],
            upd: [],
            del: []
        };
        //组建需要批量操作的数据
        if ($scope.selectItem.__refprojectdevicelist.length > 0) {
            for (var i = 0; i < $scope.selectItem.__refprojectdevicelist.length; i++) {
                var value = $scope.selectItem.__refprojectdevicelist[i];
                value.__index = i;
                //__deleted表示真的已经删除了,不需要再看了
                if (value.__deleted) {
                    continue;
                }
                if (value.__delelte) {
                    $scope.newdata.del.push({ idreworkdevice: value.idreworkdevice, __index: i });

                } else if (!value.idreworkdevice) {
                    if (!value.productmodelid || !value.productnumber) {
                        parent.layer.closeAll('tips');
                        parent.layer.msg("请将出货信息填写完整后再保存", { icon: 0 });
                        break;
                    }
                    value.refrework = $scope.selectItem.idrework;
                    $scope.newdata.add.push(value);
                    //$scope.saveProductlist(0, value);
                } else if (value.__update) {
                    // $scope.saveProductlist(2, value);
                    $scope.newdata.upd.push(value);

                }
            };
        }
        $scope.saveProductlist();
    }
    //保存产品清单
    $scope.saveProductlist = function () {
        $scope.__refprojectdevicelist = $scope.selectItem.__refprojectdevicelist
        var url = __URL + 'Crmschedule/Reworkdevice/batchOperation';
        var params = new URLSearchParams();
        params.append('data', JSON.stringify($scope.newdata));
        $scope.service.postData(url, params).then(function (data) {
            //保存是否全部成功
            $scope.isTip = true;
            angular.forEach(data['add'], function (value) {
                if (value.id) {
                    $scope.__refprojectdevicelist[value.index].idreworkdevice = value.id;
                    $scope.__refprojectdevicelist[value.index].__update = false;
                    $scope.__refprojectdevicelist[value.index].addData = false;
                    $scope.service.privateDateObj.reworkdeviceData[value.id] = angular.copy($scope.__refprojectdevicelist[value.index]);

                } else {
                    $scope.isTip = false;
                    parent.layer.msg('[' + $scope.service.privateDateObj.productData[$scop.service.privateDateObj.productmodelData[$scope.__refprojectdevicelist[value.index].productmodelid].productid].name + ']没有添加成功，请重试！')
                }
            });

            angular.forEach(data['upd'], function (value) {
                if (value.status) {
                    $scope.__refprojectdevicelist[value.index].__update = false;
                    $scope.service.privateDateObj.projectdevicelistData[value.status.idreworkdevice] = value.status;
                    $scope.service.privateDateObj.projectdevicelistData[value.status.idreworkdevice].__update = false;
                }
                else {
                    $scope.isTip = false;
                    //提示,有一项没修改成功
                    parent.layer.msg('[' + $scope.service.privateDateObj.productData[$scop.service.privateDateObj.productmodelData[$scope.__refprojectdevicelist[value.index].productmodelid].productid].name + ']没有修改成功，请重试！')
                }
            });
            angular.forEach(data['del'], function (value) {
                if (value.status) {
                    //__deleted表示真的已经删除了,不需要再让保存代码去执行删除了
                    $scope.__refprojectdevicelist[value.index].__deleted = true;
                    $scope.service.privateDateObj.projectdevicelistData[$scope.__refprojectdevicelist[value.index].idreworkdevice].__deleted = true;
                } else {
                    $scope.isTip = false;
                    //提示,有一项没删除成功
                    parent.layer.msg('[' + $scope.service.privateDateObj.productData[$scop.service.privateDateObj.productmodelData[$scope.__refprojectdevicelist[value.index].productmodelid].productid].name + ']没有删除成功，请重试！')
                }
            });
            if ($scope.isTip) {
                parent.layer.msg('清单保存成功！', { icon: 6 });
            }
        });
    }
}])

