/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ngVerify',  'ui.select',"ngWaterfall","ui.router"]);
//主控制器
appModule.controller('crmCustomerinfoController', ['$scope', '$q', 'dataService', 'ngVerify', function ($scope, $q, dataService, ngVerify) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.customerinfoData == undefined || Object.keys($scope.service.privateDateObj.customerinfoData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
    //存一份userid（当前仅用来判断是否是管理员）
    $scope.service.userid = userid;
    $scope.service.refcustomer = {};
    //检索创建人多选框备选数据源
    $scope.selectUserData = [];
    //重写对象转数组方法 --- 方法内部组件了主页面检索用到的数据源
    $scope.P_objecttoarray = function (object) {
        //返回的数组数据源
        var tmp = [];
        var idcustomers = [];
        var idusers = [];
        for (var key in object) {
            //组建主页面负责人检索可选项
            if ($scope.service.privateDateObj.usersData[object[key].userid]) {
                $scope.selectUserData[object[key].userid] = $scope.service.privateDateObj.usersData[object[key].userid];
            }
            //key是属性,object[key]是值
            tmp.push(object[key]);//往数组中放属性
        }
        if (idcustomers.length > 0) {
            var params = new URLSearchParams();
            params.append("$json", true);
            params.append('idcustomerinfo', idcustomers.join(','));
            params.append('$findall', true);
            select_customerinfo(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                angular.forEach(data, function (value, key) {
                    $scope.service.privateDateObj.tempcustomerinfoData[key] = value;
                    $scope.selectCustomerinfoData[key] = value;
                });
            });
        }
        return tmp;
    }
    /*
        查询客户（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customerinfo(params).then(function (res) {
            //把自己创建的联系人查询出来
            $scope.selectContact();
            //组建客户标签数据    
            $scope.build_tagData();
            //查询项目数据
            select_project(params);
            //如果没有客户的时候会查询到一个空数组，将空数组变成空对象
            if (Object.prototype.toString.call($scope.service.privateDateObj.customerinfoData) == '[object Array]' && $scope.service.privateDateObj.customerinfoData.length < 1) {
                $scope.service.privateDateObj.customerinfoData = {};
                $scope.service.customerinfoDataArr = [];
            } else {
                //将对象转成数组,主页面table展示
                $scope.service.customerinfoDataArr = $scope.P_objecttoarray($scope.service.privateDateObj.customerinfoData);
            }
            //关闭加载层
            parent.layer.closeAll('loading');
        });
    }
    
    /*
   联系人数据 
   这里需要过滤一下：不是自己创建的联系人应过滤掉
   */
    $scope.selectContact = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('userid', $scope.service.userid);
        select_customer_contact(params);
    }

    /*
    service.refcustomerallData
    存储了客户属性的值，用来检索的
    */
    if (!$scope.service.refcustomerallData) {
        $scope.service.refcustomerallData = {};
    }      
    /*
   查询所有标签所需数据
   */
    $scope.build_tagData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //客户市场大区分类
        select_customer_market(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户信用等级
        select_customer_credit(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户状态
        select_customer_status(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户类型
        select_customer_type(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户来源
        select_customer_source(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户行业
        select_customer_industry(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
        //客户级别
        select_customer_level(params).then(function (res) {
            $scope.forrefcustomerallData(res);
        });
    }
    /*
        此方法循环了7次，有待优化，**********
        循环所有的属性数据，组成一个属性的整体对象数据 $scope.service.refcustomerallData 用作客户属性的筛选
        res 为异步后的返回值
        需要做判断：因为表中的name值不统一
        customerstatusData/customertypeData/customerindustryData/customerlevelData
    */
    $scope.forrefcustomerallData = function (res) {
        angular.forEach($scope.service.privateDateObj[res], function (value, key) {
            //$scope.service.refcustomerallData[res + key] = value;
            if (res == 'customerstatusData') {
                $scope.service.refcustomerallData['refstatusids' + key] = value;
                $scope.service.refcustomerallData['refstatusids' + key]['name'] = value['status'];
            } else if (res == 'customertypeData') {
                $scope.service.refcustomerallData['reftypeids' + key] = value;
                $scope.service.refcustomerallData['reftypeids' + key]['name'] = value['typename'];
            } else if (res == 'customerindustryData') {
                $scope.service.refcustomerallData['refindustryids' + key] = value;
                $scope.service.refcustomerallData['refindustryids' + key]['name'] = value['industryname'];
            } else if (res == 'customerlevelData') {
                $scope.service.refcustomerallData['reflevelids' + key] = value;
                $scope.service.refcustomerallData['reflevelids' + key]['name'] = value['levelname'];
            } else if (res == 'customersourceData') {
                $scope.service.refcustomerallData['refsourceids' + key] = value;
            } else if (res == 'customercreditData') {
                $scope.service.refcustomerallData['refcreditids' + key] = value;
            } else if (res == 'customermarketData') {
                $scope.service.refcustomerallData['refmarketids' + key] = value;
            }
        })
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }

    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'customerinfo';
        $scope.service.name = '客户';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //模态框要绑定的当前数据源
    $scope.selectItem = {};
    //添加按钮
    $scope.add = function () {
        //新模态框呼出
        $scope.customerinfoModal.open();
        $scope.customerinfoModal.title = '新建客户';
        if ($scope.Action!=0) {
            $scope.selectItem = { };
        }                        
        $scope.Action = 0;
        //初始化联系人id，变为数组
        $scope.selectItem.refcontactids = [];
        //组件客户属性的默认选中项
        var typenum = '1';
        $scope.selectItem.reftypeids = typenum;
        $scope.selectItem.reflevelids = typenum;
        $scope.selectItem.refindustryids = typenum;
        $scope.selectItem.refsourceids = typenum;
        $scope.selectItem.refmarketids = typenum;
        $scope.selectItem.refcreditids = typenum;
        $scope.selectItem.refstatusids = typenum;
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.customerinfoModal.open();
        $scope.customerinfoModal.title = '修改客户';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //初始化关联的联系人id，变成数组
        if ($scope.selectItem.refcontactids && $scope.selectItem.refcontactids.split) {
            $scope.selectItem.refcontactids = $scope.selectItem.refcontactids.split(',');
            for (var i = 0; i < $scope.selectItem.refcontactids.length; i++) {
                if ($scope.selectItem.refcontactids[i] == "" || typeof ($scope.selectItem.refcontactids[i]) == "undefined") {
                    $scope.selectItem.refcontactids.splice(i, 1);
                    i = i - 1;
                }
            }
        } else if( !$scope.selectItem.refcontactids){
            $scope.selectItem.refcontactids = [];
        }
        //初始化关联的用户id，变成数组
        if ($scope.selectItem.refusers && $scope.selectItem.refusers.split) {
            $scope.selectItem.refusers = $scope.selectItem.refusers.split(',');
            for (var i = 0; i < $scope.selectItem.refusers.length; i++) {
                if ($scope.selectItem.refusers[i] == "" || typeof ($scope.selectItem.refusers[i]) == "undefined") {
                    $scope.selectItem.refusers.splice(i, 1);
                    i = i - 1;
                }
            }
        } else if (!$scope.selectItem.refusers) {
            $scope.selectItem.refusers = [];
        }
        //客户重名状态
        $scope.DoubleName = false;
    }
    //删除按钮
    $scope.remove = function (row) {        
        var index = parent.layer.open({
            content: '确认删除客户【' + row.name + '】，是否确认？'
         , btn: ['确认', '我再想想']
         , icon: 6
         , area: ['400px']
         , title: '删除客户信息'
         , yes: function (index, layero) {
             //按钮【按钮一】的回调
             var params = new URLSearchParams();
             params.append('idcustomerinfo', row.idcustomerinfo);
             $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/del_page_data', params).then(function (data) {
                 if (data) {
                     parent.layer.msg('删除成功', { icon: 1 });
                     $scope.service.delData('customerinfoDataArr', row);
                     row._kid = row.idcustomerinfo;
                     $scope.service.delData('customerinfoData', row);
                 }
             });
             parent.layer.close(index);
         }
        });
    }
    //跟进记录的模态框
    $scope.recordModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".addRecordtemplate",
        openButton: ".addRecordtemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "45vw"
    });
    /*
        添加跟进记录
        start
    */
    $scope.openrecord = function (row) {
        $scope.recordModal.open();
        $scope.recordModal.title = "添加跟进";
        $scope.selectItem.refcustomerid = row.idcustomerinfo;
        //调用查询项目方法
        $scope.save_customer(row.idcustomerinfo);
    }
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('container', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
    });
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
            }
            //赋值完成后，根据项目查询联系人
            $scope.selectcontact();
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
        var customer = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomerid] ? $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomerid] : {};
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
    //保存 跟进记录- 客户关系
    $scope.save_customer = function (item) {
        if ($scope.selectItem.refcustomerid != $scope.service.selectItem.refcustomerid) {
            $scope.selectItem.refprojectid = '';
            $scope.selectItem.refcontactid = [];
            $scope.selectProjectdata = {};
            $scope.selectproject();
        }
    }
    //保存  跟进记录- 项目关系
    $scope.save_project = function (item) {
        if ($scope.selectItem.refprojectid != $scope.service.selectItem.refprojectid) {
            $scope.selectItem.refcontactid = [];
            $scope.selectContactData = {};
            $scope.selectcontact();
        }

    }
    //保存操作
    $scope.saveData = function () {
        var param = new URLSearchParams();
        var num = 0;
        url = __URL + 'Crmschedule/Record/add_page_data';
        //get到百度编辑器中的内容
        $scope.selectItem.__mark = ue.getContent();
        //因为是ui-select，所以获取到的是个数组，将数组转换成字符串
        if ($scope.selectItem.refcontactid) {
            $scope.selectItem.refcontactid = $scope.selectItem.refcontactid.join(',');
        }
        angular.forEach($scope.selectItem, function (value, key) {
            if (value && value != $scope.service.selectItem[key] && key.indexOf('__') < 0) {

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
            if ($scope.service.selectItem.expectationendtime != $scope.dt.toFixed(0)) {
                param.append('expectationendtime', $scope.dt);
                num++;
            }
        } else if ($scope.dt && !$scope.dt.getTime) {
            if ($scope.dt != $scope.service.selectItem.expectationendtime) {
                param.append('expectationendtime', $scope.dt);
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
                        parent.layer.msg('记录内容保存失败');
                        return;
                    } else {
                        $scope.service.selectItem.__mark = $scope.selectItem.__mark;
                        $scope.recordModal.close();
                    }
                });

            } else {
                //如果没修改内容那就没必要传到后台了
                $scope.recordModal.close();

            }
            return;
        }
        $scope.service.postData(url, param).then(function (data) {
            var param = new URLSearchParams();
            var markUrl;
            if (data['id']) {
                $scope.selectItem._kid = data.id;
                $scope.selectItem.guid = data.guid;
                $scope.selectItem.idworkorder = data.id;
                $scope.selectItem.expectationendtime = $scope.dt;
                $scope.selectItem.userid = $scope.service.userid;
                $scope.selectItem.createtime = data.createtime.toString();
                dataService.addData('recordArrData', $scope.selectItem);
                //因为有返回data的参数所以更改一下更新数据源的方法
                $scope.service.privateDateObj.recordData[data.id] = $scope.selectItem;
                markUrl = __URL + 'Crmschedule/Workordermessage/update_page_data';
                param.append("workid", data.id);
                param.append("guid", $scope.selectItem.guid);
                param.append("causedescription", $scope.selectItem.__mark);
                $scope.service.postData(markUrl, param).then(function (data) {
                    if (data < 0) {
                        parent.layer.msg('记录内容保存失败');
                        return;
                    }
                });
                //这里需要做个判断如果创建人和执行人是一个人的话那就不用发了          || ($scope.selectItem.refusers && $scope.selectItem.refusers.length > 0)
                if ($scope.selectItem.userid != $scope.selectItem.assignid) {
                    //调用发送邮件方法    
                    parent.layer.msg('保存成功！', { icon: 1 });
                }
                $scope.recordModal.close();
            } else {
                parent.layer.msg('添加失败！');
            }
        });
    }



    /*end*/
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmcustomerinfo/Customerinfo/selectdetailed?id=' + row.idcustomerinfo + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmcustomerinfo/Customerinfo/selectdetailed?id=' + row.idcustomerinfo + '&guid=' + row.guid, row.name);
    }
    //tags的数据源 -- 检索使用
    $scope.tagsData = [];


    var id;
    //查询数据id
    $scope.searchId=function(key){
        switch (key) {
            case 'userid':
                id = 'idusers';
                break;
            case 'refstatusids':
                id = 'idcustomerstatus';
                break;
            case 'refstageids':
                id = 'idcustomerstage';
                break;
            case 'refindustryids':
                id = 'idcustomersource';
                break;
            case 'refsourceids':
                id = 'idcustomercredit';
                break;
            case 'refcreditids':
                id = 'idcustomercredit';
                break;
            case 'reftypeids':
                id = 'idcustomertype';
                break;
            case 'refmarketids':
                id = 'idcustomermarket';
                break;
            case 'reflevelids':
                id = 'idcustomerlevel';
                break;
                   
        }
    }
    //按条件检索数据
    $scope.tagSearch = function () {
        if ($scope.tagsData.length > 0) {
            $scope.service.customerinfoDataArr = [];
        } else {
            $scope.service.customerinfoDataArr = P_objecttoarray($scope.service.privateDateObj.customerinfoData);
        }
        angular.forEach($scope.service.privateDateObj.customerinfoData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                $scope.searchId($scope.tagsData[svalue].key);
                if (id && value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {  
                    $scope.service.customerinfoDataArr.push (value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag    item参数是选中的客户属性的对象数据 包含key和value
    $scope.addTags = function (type,item) { 
        if (type == 'user') {
            $scope.tagsData.push({ 'value': $scope.user, 'key': 'userid' });
            if ($scope.selectUserData[$scope.user.idusers]) {
                delete $scope.selectUserData[$scope.user.idusers];
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'refcustomer') {
            var key='';
            if (item.value.idcustomerstatus) {
                key ='refstatusids';
            } else if (item.value.idcustomerstage) {
                key = 'refstageids';
            } else if (item.value.idcustomerindustry) {
                key = 'refindustryids';
            } else if (item.value.idcustomersource) {
                key = 'refsourceids';
            } else if (item.value.idcustomercredit) {
                key = 'refcreditids';
            } else if (item.value.idcustomertype) {
                key = 'reftypeids';
            } else if (item.value.idcustomermarket) {
                key = 'refmarketids';
            } else if (item.value.idcustomerlevel) {
                key = 'reflevelids';
            }
            if (!key) {
                return;
            }
            $scope.tagsData.push({ 'value': item.value, 'key': key });
            if ($scope.service.refcustomerallData[item.key].name == item.value.name) {
                delete $scope.service.refcustomerallData[item.key];
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
                $scope.selectUserData[item.value.idusers] = item.value;
                $scope.tagSearch();
            }
                                 
        }else {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.refcustomer.indexOf(item.value);
                    $scope.service.refcustomer.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.refcustomer.splice:"+e);
                } 
            }
        }
    }


    //查询所有的用户
    $scope.select_userdata = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_user(params);
    }
    //页面加载完成后，查询数据
    $scope.select();
    //查询用户数据
    $scope.select_userdata();


    //模态框
    $scope.customerinfoModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".customerinfomodaltemplate",
        openButton: ".customerinfomodaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "80vw"
    });  

      
    //客户重名状态
    $scope.DoubleName = true;
    //校验客户查重
    $scope.checkName = function () {
        var params = new URLSearchParams();
        params.append('name', $scope.selectItem.name);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/check_data', params).then(function (data) {
            //当前客户已被添加：如果是修改,id得不一样才能阻断
            if (
                data &&
                (($scope.Action == 1 && data.idcustomerinfo != $scope.selectItem.idcustomerinfo) || ($scope.Action==0))
                ) {
                $scope.DoubleName = true;
                var username = '他人';
                if ($scope.service.privateDateObj.usersData[data.userid]) {
                    username = $scope.service.privateDateObj.usersData[data.userid].description;
                }
                parent.layer.msg(
                    '该客户已经被<b style="color: red;">'
                    + username
                    + '</b>添加了,不能重复添加同一个客户,请更换一个名称', { icon: 5 });
               // ngVerify.setError('#check', '客户已存在') //以id标记错误
            } else {                 
               // ngVerify.setError('#check') //以id取消标记错误
                $scope.DoubleName = false;
                parent.layer.msg('该客户可以添加', { icon: 6 });
            }
        });
    }

    /*
    保存客户信息  
    */
    $scope.save = function () {
        if ($scope.selectItem.refcontactids.length < 1) {
           
            parent.layer.msg('请添加至少一个联系人！', { icon: 0 });
            return;
        }
        for (var i = 0; i < $scope.selectItem.refcontactids.length;i++) {
            var contact=$scope.service.privateDateObj.contactData[$scope.selectItem.refcontactids[i]];
            if (contact._edit) {
                parent.layer.msg('请点击确定保存' + contact._name + '联系人！', { icon: 0 });
                return;
            }           
        };
        //客户重名状态
        if ($scope.DoubleName) {
            parent.layer.msg(
                '您还没校验客户是否和重复了呢 o(╥﹏╥)o <br/> 点击<b style="color: red;">客户查重</b>来校验一下吧 O(∩_∩)~', { icon: 7 });
            return;
        }

        if ($scope.Action == 1) {
            var index = parent.layer.open({
                content: '更新【' + $scope.selectItem.name + '】客户信息，是否确认？'
                 , btn: ['确认', '我再想想']
                 , icon: 6
                 , area: ['400px']
                 , title: '更新客户信息'
                 , yes: function (index, layero) {
                     //按钮【按钮一】的回调
                     $scope.privateSavedate();
                     parent.layer.close(index);
                 }
            });
        } else {
            $scope.privateSavedate();
        }
    };

     /*保存数据方法*/
    $scope.privateSavedate = function () {
        //彻底保存之前把保存按钮置灰
        $scope.saveone = true;
        var url;
        var params = new URLSearchParams();
        if ($scope.Action == '0') {
            url = __URL + 'Crmcustomerinfo/Customerinfo/add_page_data';
        } else if ($scope.Action == '1') {
            url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data'
            params.append('idcustomerinfo', $scope.selectItem.idcustomerinfo);
        }
        //if ($scope.selectItem.refusers && $scope.selectItem.refusers.join(',') != $scope.service.selectItem.refusers) {
        //    params.append('refusers', $scope.selectItem.refusers.join(","));
        //}
        //对每一个属性进行遍历,是否有新值
        angular.forEach($scope.selectItem, function (value, key) {
            //if (Object.prototype.toString.call(value) == '[object Array]') {
            //    value = value.join(',');               
            //} else if (Object.prototype.toString.call(value) == '[object Object]') {
            //    value = value.keys().join(',');
            //}   
            //if (key=='createtime') {
            //    value = "";
            //}
            if (value != $scope.service.selectItem[key]) {
                params.append(key, value);
            }
        });         
        //请求后台
        $scope.service.postData(url, params).then(function (data) {
            if (parseInt(data['id']) > 0 && $scope.Action == 0) {
                    $scope.selectItem.del = 0;
                    $scope.selectItem.index = 0;
                    $scope.selectItem.idcustomerinfo = data['id'];
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.selectItem._kid = data['id'];
                    parent.layer.msg('添加成功', { icon: 1 });
                    //更新数据源
                    $scope.service.addData('customerinfoData', $scope.selectItem);
                    $scope.service.addData('customerinfoDataArr', $scope.selectItem);
                    //关闭模态框
                    $scope.customerinfoModal.close();
                    //清空一下以防再次添加的时候遗留数据
                    $scope.selectItem = {};
            } else if (data['ok'] && $scope.Action == 1) {
                    parent.layer.msg('编辑成功', { icon: 1 });
                    $scope.selectItem['_kid'] = $scope.selectItem.idcustomerinfo;
                    //更新数据源
                    $scope.service.updateData('customerinfoData', $scope.selectItem);
                    $scope.service.updateData('customerinfoDataArr', $scope.selectItem);
                    //关闭模态框
                    $scope.customerinfoModal.close();
            } else {
                parent.layer.msg('操作失败了', { icon: 0 });
            }
        });
    }

    /*
    联系人的操作
    */  
    //添加新的联系人
    $scope.add_contact = function () {
        
        var index=$scope.selectItem.refcontactids.indexOf('add');
        if(index<0){
            $scope.selectItem.refcontactids.push('add');
            $scope.service.privateDateObj.contactData['add'] = { _edit: true, name: '', mobilephone: '', phone: '', email: '', position: '' };
        }else{
            parent.layer.msg('请将上一条联系人信息填写完整并保存！', { icon: 0 });
        }        
    }
    /*
    联系人编辑状态切换
    contactid  联系人的id
    status  true进入编辑状态  false编辑完成
    */
    $scope.update_contact = function (contactid, status) {
        if (status) {
            $scope.service.privateDateObj.contactData[contactid]._edit = status;
            //进入编辑状态要进行赋值的属性
            var _list = ['name', 'mobilephone', 'phone', 'email', 'position'];
            //这里使用了foreach的方式进行值的转换，减少大量的if else
            angular.forEach(_list, function (key) {
                $scope.service.privateDateObj.contactData[contactid]['_' + key ] = $scope.service.privateDateObj.contactData[contactid][key];
            });
        } else {
            //检测必填项是否填写完整，若没填写完整，阻止住  name/position/mobilephone
            if (!$scope.service.privateDateObj.contactData[contactid]._name || !$scope.service.privateDateObj.contactData[contactid]._position || !$scope.service.privateDateObj.contactData[contactid]._mobilephone) {
                parent.layer.msg('请将必填项填写完整！', { icon: 0 });
                return;
            }
            $scope.save_contact(contactid);
        }
    }
    //删除联系人
    $scope.del_contact = function (contactid) {
        var index = parent.layer.open({
            content: '删除【' + $scope.service.privateDateObj.contactData[contactid].name + '】联系人信息，是否确认？'
               , btn: ['确认', '我再想想']
               , icon: 6
               , area: ['400px']
               , title: '删除联系人'
               , yes: function (index, layero) {
                   var i = $scope.selectItem.refcontactids.indexOf(contactid);
                   if (i > -1) {
                       
                       //将值去掉,这里要做一次藏检查
                       $scope.$apply(function () {
                           if ($scope.selectItem.refcontactids.length) {
                               $scope.selectItem.refcontactids.splice(i, 1);
                           } else {
                               //删空了
                               $scope.selectItem.refcontactids = null;
                           }
                       });
                   }
                   parent.layer.close(index);
               }
        });
    }
    /*
    更新联系人信息到后台
    contactid联系人id
    */
    $scope.save_contact = function (contactid) {
        var params = new URLSearchParams();
        var url;
        //要进行赋值的属性
        var _list = ['name', 'mobilephone', 'phone', 'email', 'position'];
        if (contactid=='add') {
            url = __URL + 'Crmcustomerinfo/Contact/add_page_data';          
        } else {
            params.append('idcontact', contactid);
            url = __URL + 'Crmcustomerinfo/Contact/edit_page_data';   
        }
        angular.forEach(_list, function (key) {
            if ($scope.service.privateDateObj.contactData[contactid]['_' + key]) {
                params.append(key, $scope.service.privateDateObj.contactData[contactid]['_' + key]);
            }
            
        });
        $scope.service.postData(url, params).then(function (data) {
            if (!data) {
                parent.layer.msg('联系人信息保存失败了,请联系管理员');
                return;
            }
            if (contactid == 'add') {
                $scope.service.privateDateObj.contactData[data] = {idcontact:data};
                angular.forEach(_list, function (key) {
                    if ($scope.service.privateDateObj.contactData['add']['_' + key]) {
                        $scope.service.privateDateObj.contactData[data][key] = $scope.service.privateDateObj.contactData['add']['_' + key];
                    }
                   

                });
                delete $scope.service.privateDateObj.contactData['add'];
                var index = $scope.selectItem.refcontactids.indexOf('add');
                if (index > -1) {
                    $scope.selectItem.refcontactids.splice(index, 1);
                }
                $scope.selectItem.refcontactids.push(data);
            } else {

                //解除编辑状态
                $scope.service.privateDateObj.contactData[contactid]._edit = false;
                //这里使用了foreach的方式进行值的转换，减少大量的if else
                angular.forEach(_list, function (key) {
                    $scope.service.privateDateObj.contactData[contactid][key] = $scope.service.privateDateObj.contactData[contactid]['_' + key];
                });
            }          
        });
        
        
    }
}])

