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
appModule.controller('crmShipmentsController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.shipmentsData == undefined || Object.keys($scope.service.privateDateObj.shipmentsData).length < 1) {
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
    $scope.selectProjectData = {};
    //获取出货设备---点击添加或编辑时组件的页面数据
    $scope.getshipdevice = function (data) {
        data.__refprojectdevicelist = [];
        for (var item in $scope.service.privateDateObj.shipmentsdeviceData) {
            if ($scope.service.privateDateObj.shipmentsdeviceData[item].refship == data.idshipments && !$scope.service.privateDateObj.shipmentsdeviceData[item].__deleted) {
                //模态框用作数据是否需要编辑
                $scope.service.privateDateObj.shipmentsdeviceData[item].__update = false;
                //把<br />换成/n
                $scope.service.privateDateObj.shipmentsdeviceData[item].serials = $scope.service.privateDateObj.shipmentsdeviceData[item].serials.replace(/<br\s*\/?>/gi, "\r\n");
                data.__refprojectdevicelist.push($scope.service.privateDateObj.shipmentsdeviceData[item]);
            }
        }
    }
    //转数组
    $scope.P_objecttoarray = function (object) {
        var tmp = [];
        for (var key in object) {
            //组建可显示的项目
            if (object[key].refprojects) {
                var params = new URLSearchParams();
                params.append("$json", true);
                params.append('idproject', object[key].refprojects);
                params.append('$findall', true);
                select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    $scope.service.privateDateObj.tempprojectData[key] = data;
                });
            }
            //组建项目所对应的客户 --- 根据项目id找客户id
            $scope.getcustomer(object[key]);
            //组建可显示的客户
            if (object[key].refcustomer) {
                var params = new URLSearchParams();
                params.append("$json", true);
                params.append('idcustomerinfo', object[key].refcustomer);
                params.append('$findall', true);
                select_customerinfo(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        $scope.service.privateDateObj.tempcustomerinfoData[key] = value;
                    });
                });
            }
            
            //组建主页面负责人检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].userid]) {
                $scope.selectUserData[object[key].userid] = $scope.service.privateDateObj.usersData[object[key].userid];
            }
            //组建主页面项目检索可选项
            if ($scope.service.privateDateObj.projectData[object[key].refprojects]) {
                $scope.selectProjectData[object[key].refprojects] = $scope.service.privateDateObj.projectData[object[key].refprojects];
            }
            //key是属性,object[key]是值
            tmp.push(object[key]);//往数组中放属性
        }       
        return tmp;
    }
    //这个是这个出货清单独有的方法，目的是根据项目找到客户的id
    $scope.getcustomer = function (data) {
        //组建项目所对应的客户 --- 根据项目id找客户id
        if (data.refprojects) {
            //保证在项目中客户字段必须有值
            if ($scope.service.privateDateObj.projectData[data.refprojects] && $scope.service.privateDateObj.projectData[data.refprojects].refcustomers != undefined) {
                data.refcustomer = $scope.service.privateDateObj.projectData[data.refprojects].refcustomers;
            }
        }
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
        //params.append('$find', true);
        $scope.service.postData(__URL + 'Crmschedule/Shipmentsdevice/select_like_data', params).then(function (data) {
            //不管查没查到先把数据清空
            $scope.service.shipmentsArrData = [];
            if (data) {
                for (var d = 0; d < data.length; d++) {
                    $scope.service.shipmentsArrData.push($scope.service.privateDateObj.shipmentsData[data[d].refship]);
                }
            }
        });
    }
    //监听函数，如果序列号查询是空的那就把之前的值还他
    $scope.$watch('filtername', function (newValue, oldValue) {
        if (newValue === '') {
            $scope.service.shipmentsArrData = P_objecttoarray($scope.service.privateDateObj.shipmentsData);
            return;
        }
    });
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.shipmentsArrData = [];
        } else {
            $scope.service.shipmentsArrData = P_objecttoarray($scope.service.privateDateObj.shipmentsData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.shipmentsData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'userid') {
                    id = 'idusers';
                } else if ($scope.tagsData[svalue].key == 'refprojects') {
                    id = 'idproject';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.shipmentsArrData.push(value);
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
        } else if (type == 'refprojects') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'refprojects' });
            if ($scope.selectProjectData[item.value.idproject] == item.value) {
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
       } else if (item.key == 'refprojects') {
            if (index > -1) {
               $scope.tagsData.splice(index, 1);
               $scope.tagSearch();
               try {
                   var _i = $scope.service.refprojects.indexOf(item.value);
                   $scope.service.refprojects.splice(_i, 1);
               } catch (e) {
                   console.log("$scope.service.refprojects.splice:" + e);
               }
           }
       }
    }
    /*
        查询出货清单（本页面使用）数据
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
                    //查询出货清单
                    select_shipments(params).then(function (res) {
                        $scope.service.shipmentsArrData = $scope.P_objecttoarray($scope.service.privateDateObj.shipmentsData);
                    });
                    //查询其他相关数据
                    $scope.selectother();
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
        //查询出货设备
        select_shipmentsdevice(params);
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.dt = new Date();
        if ($scope.selectItem.guaranteetime && $scope.selectItem.guaranteetime !== '0' && $scope.selectItem.guaranteetime != 'null') {
            var date = new Date($scope.selectItem.guaranteetime * 1000);
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
    $scope.shipmentsModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".shipmentsmodaltemplate",
        openButton: ".shipmentstemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "65vw"
    });
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        $scope.shipmentsModal.open();
        $scope.shipmentsModal.title = '添加出货清单';
        if ($scope.Action != 0 || $scope.selectItem.idshipments) {
            $scope.selectItem = {};
            //防止点击了修改之后又点击添加编辑框中有值的问题
            ue.setContent('');
        }
        $scope.Action = 0;
        //初始化出货设备
        $scope.selectItem.__refprojectdevicelist = [];
        $scope.initDatepiker();
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.shipmentsModal.open();
        $scope.shipmentsModal.title = '修改出货清单';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //给编辑器赋值
        if ($scope.selectItem.mark) {
            ue.setContent($scope.selectItem.mark);
        }
        //初始化抄送人
        if ($scope.selectItem.refusers && $scope.selectItem.refusers.split) {
            $scope.selectItem.refusers = $scope.selectItem.refusers.split(",");
        }
        //初始化出货设备
        $scope.getshipdevice($scope.selectItem);
        $scope.initDatepiker();
    }
    //删除按钮
    $scope.remove = function (row) {       
        var index = parent.layer.open({
            content: '确认删除出货清单，是否确认？',
         btn: ['确认', '我再想想'],
         icon: 6,
         area: ['400px'],
         title: '删除出货清单信息',
         yes: function (index, layero) {
            //按钮【按钮一】的回调
            var params = new URLSearchParams();
            params.append('idshipments', row.idshipments);
            $scope.service.postData(__URL + 'Crmschedule/Shipments/del_page_data', params).then(function (data) {
                if (data) {
                    parent.layer.msg('删除成功', { icon: 1 });
                    $scope.service.delData('shipmentsArrData', row);
                    row._kid = row.idshipments;
                    delete $scope.service.privateDateObj.shipmentsData[row._kid];
                }
            });
            parent.layer.close(index);
        }
        });
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: "出货清单",
            url: __URL + 'Crmschedule/Shipments/selectdetailed?id=' + row.idshipments + '&guid=' + row.guid
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
    $scope.selectprojectdetailed = function(row){
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
        var url = __URL + 'Crmschedule/Shipments/update_page_data';
        if ($scope.Action == 0) {
            url = __URL + 'Crmschedule/Shipments/add_page_data';
        } else if ($scope.Action == '1') {
            param.append('idshipments', $scope.selectItem.idshipments);
        }
        //将出货设备设置为必填项
        if ($scope.selectItem.__refprojectdevicelist == undefined || $scope.selectItem.__refprojectdevicelist.length < 1) {
            parent.layer.msg('出货设备不能为空');
            return;
        }
        //get到百度编辑器中的内容
        $scope.selectItem.mark = ue.getContent();
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
            if ($scope.service.selectItem.guaranteetime != $scope.dt.toFixed(0)) {
                param.append('guaranteetime', $scope.dt);
                num++;
            }
        } else if ($scope.dt && !$scope.dt.getTime) {
            if ($scope.dt != $scope.service.selectItem.guaranteetime) {
                param.append('guaranteetime', $scope.dt);
                num++;
            }
        }
        if (num == 0) {
            return;
        }
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            var markUrl;

            if ($scope.Action == '1') {
                if (data > 0) {
                    if ($scope.dt != $scope.service.selectItem.contracttime) {
                        $scope.selectItem.contracttime = $scope.dt;
                    }
                    $scope.selectItem._kid = $scope.selectItem.idshipments;
                    dataService.updateData('shipmentsArrData', $scope.selectItem);
                    //更新数据源
                    $scope.service.privateDateObj.shipmentsData[$scope.selectItem.idshipments] = angular.copy($scope.selectItem);
                    $scope.shipmentsModal.close();
                } else {
                    parent.layer.msg('保存失败！');
                }
            } else if ($scope.Action == '0') {
                if (data['id']) {
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.idshipments = data.id;
                    $scope.selectItem.guaranteetime = $scope.dt;
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.getcustomer($scope.selectItem);//把最终客户加上
                    dataService.addData('shipmentsArrData', $scope.selectItem);
                    //因为有返回data的参数所以更改一下更新数据源的方法
                    $scope.service.privateDateObj.shipmentsData[data.id] = $scope.selectItem;
                    $scope.shipmentsModal.close();
                } else {
                    parent.layer.msg('添加失败！');
                }

            };
            //添加/修改出货设备
            $scope.bulidProductlist();
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
                parent.layer.msg("请将上一条出货信息填写完整！", { icon: 0 });
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
                    $scope.newdata.del.push({ idprojectdevicelist: value.idprojectdevicelist, __index: i });

                } else if (!value.idprojectdevicelist) {
                    if (!value.productmodelid || !value.productnumber) {
                        parent.layer.closeAll('tips');
                        parent.layer.msg("请将出货信息填写完整后再保存", { icon: 0 });
                        break;
                    }
                    value.refship = $scope.selectItem.idshipments;
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
        var url = __URL + 'Crmschedule/Shipmentsdevice/batchOperation';
        var params = new URLSearchParams();
        params.append('data', JSON.stringify($scope.newdata));
        $scope.service.postData(url, params).then(function (data) {
            //保存是否全部成功
            $scope.isTip = true;
            angular.forEach(data['add'], function (value) {
                if (value.id) {
                    $scope.__refprojectdevicelist[value.index].idprojectdevicelist = value.id;
                    $scope.__refprojectdevicelist[value.index].__update = false;
                    $scope.__refprojectdevicelist[value.index].addData = false;
                    $scope.service.privateDateObj.shipmentsdeviceData[value.id] = angular.copy($scope.__refprojectdevicelist[value.index]);

                } else {
                    $scope.isTip = false;
                    parent.layer.msg('[' + $scope.service.privateDateObj.productData[$scop.service.privateDateObj.productmodelData[$scope.__refprojectdevicelist[value.index].productmodelid].productid].name + ']没有添加成功，请重试！')
                }
            });

            angular.forEach(data['upd'], function (value) {
                if (value.status) {
                    $scope.__refprojectdevicelist[value.index].__update = false;
                    $scope.service.privateDateObj.projectdevicelistData[value.status.idprojectdevicelist] = value.status;
                    $scope.service.privateDateObj.projectdevicelistData[value.status.idprojectdevicelist].__update = false;
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
                    $scope.service.privateDateObj.projectdevicelistData[$scope.__refprojectdevicelist[value.index].idprojectdevicelist].__deleted = true;
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

