/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ngVerify', 'ui.select']);

//主控制器
appModule.controller('crmProjectController', ['$scope', '$q', 'dataService', 'ngVerify', 'FileUploader', function ($scope, $q, dataService, ngVerify, FileUploader) {
    _$scope = $scope;
    _$q = $q;
    var index;
    //模态框的url访问地址（点击添加/修改时）
    $scope.url;
    //初始话时间插件
    $scope.dt;
    //模态框总价
    $scope.totalmoney = 0;
    $scope.service = dataService;//要显示到页面上的数据源
    //这里初始化一下权限的页面id，用于判断当前用户是否能看到销售漏斗页面
    $scope.service.authappid = _authappid.split(',');
    //用于判断当前用户是否能看到销售漏斗页面
    $scope.iffunnel = function () {
        //销售漏斗的页面id固定为50
        if ($scope.service.authappid.indexOf("50") > -1) {
            return true;
        }
        return false;
    }
    //给默认项初始化
    $scope.selectItem = {};
    $scope.service.projectRefcluedata = {};
    //进来将角标值改为0，
    var apps = parent.YL.util.dataCopy('apps');
    parent.YL.vue.$set(parent.YL.vue, 'apps', apps);
    apps['eim-' + _appid].badge = 0;
    //存一份userid（当前仅用来判断是否是管理员）
    //$scope.service.userid = userid;
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.projectData == undefined || Object.keys($scope.service.privateDateObj.projectData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6,'#fff']
        });    
    }
    /*
    2018-11-15新增加的用于筛选查询
    start
    */
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值
        $scope.service.start = new Date();
        $scope.service.end = new Date();
        //控制日期选择框的显示与否
        $scope.popup1 = { opened: false };
        $scope.popup2 = { opened: false };
        //时间插件配置项
        $scope.dateOptions1 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.dateOptions2 = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };
        //打开事件选择框的方法
        $scope.open1 = function () {
            $scope.dateOptions1.maxDate = $scope.service.end;
            $scope.popup1.opened = true;
        }
        //打开事件选择框的方法
        $scope.open2 = function () {
            $scope.dateOptions2.minDate = $scope.service.start;
            $scope.popup2.opened = true;
        }
    };
    //初始化时间插件
    $scope.initDatepiker();
    /*根据时间段查询--查询方法*/
    $scope.selectwheretime = function () {
        var params = new URLSearchParams();
        params.append('$time', JSON.stringify({ 'createtime': [Date.parse($scope.service.start) / 1000,Date.parse($scope.service.end) / 1000]}));
        //根据时间端查询项目数据---点击查询按钮事件
        $scope.service.postData(__URL + 'Crmproject/Project/select_time_data', params).then(function (data) {
            for (i = 0; i < data.length;i++){
                $scope.getonlymoney(data[i]);
            }
            $scope.service.projectArrData = [];
            $scope.service.projectArrData = $scope.P_objecttoarray(data);
        });
    }
    //还原按钮触发
    $scope.reduction = function () {
        if ($scope.service.privateDateObj.projectData) {
            $scope.service.projectArrData = $scope.P_objecttoarray($scope.service.privateDateObj.projectData);
        }
        //重新初始化一下时间插件
        $scope.initDatepiker();
    }
    //展示预测
    $scope.forecast = function () {
        $scope.service.forecastmoney = '';
        var num = 0;
        for (i = 0; i < $scope.service.projectArrData.length;i++){
            num += $scope.service.projectArrData[i].allmoney * ($scope.service.projectArrData[i].grasp / 100);
        }
        $scope.service.forecastmoney = P_formateNumber(num);
        parent.layer.msg('展示成功！');
    }
    /*end*/
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, 'yyyy-mm-dd');
    }
    //获取数据长度
    $scope.tagsDataLength = function (data) {
        return Object.keys(data).length;
    }
   
    //获取总价格
    $scope.getonlymoney = function (data) {
        var allmoney = 0;
        data.allmoney = 0;
        data.__refprojectdevicelist = [];
        for (var item in $scope.service.privateDateObj.projectdevicelistData) {
            if ($scope.service.privateDateObj.projectdevicelistData[item].projectid == data.idproject && !$scope.service.privateDateObj.projectdevicelistData[item].__deleted) {
                allmoney += parseInt($scope.service.privateDateObj.projectdevicelistData[item].money);
                data.allmoney += parseInt($scope.service.privateDateObj.projectdevicelistData[item].money);
                //模态框用作数据是否需要编辑
                $scope.service.privateDateObj.projectdevicelistData[item].__update = false;
                data.__refprojectdevicelist.push($scope.service.privateDateObj.projectdevicelistData[item]);
            }
        }
        data.totalmoney = allmoney;
    }
    //获取产品使用地
    $scope.getcityData = function (city) {
        if (!city || !city.slice || Object.keys($scope.service.privateDateObj.citykeyData).length<1) {
            return;
        }
        var _province = city.slice(0, 2);
        var _city;
        var returnData;
       try {
            _city = city.slice(2);
            returnData = $scope.service.privateDateObj.citykeyData[_province]['province_name'] + '---' + $scope.service.privateDateObj.citykeyData[_province]['city'][_city]['city'];
        } catch(e) {
            returnData = $scope.service.privateDateObj.citykeyData[_province]['province_name'];
        }
       
        return returnData;
    }
    /**
    *选中所在省
    *params：  type： 1代表选中的是产品决策地  2 代表的是选中的是产品使用地
    */
    $scope.selectdecision = function (type) {
       
        if (type == 1) {
            var cityData=$scope.service.privateDateObj.citykeyData[$scope.selectItem.__decisionprovince]['city'];
            if (Object.prototype.toString.call(cityData) == '[object Array]') {
                $scope.selectItem.__decision = '';
                $scope.selectItem.decisioncity = $scope.selectItem.__decisionprovince;
                
            } else{
                $scope.selectItem.__decision = ($scope.selectItem.__decision == '01') ? '02' : '01';
                $scope.selectItem.decisioncity = $scope.selectItem.__decisionprovince + $scope.selectItem.__decision;
            }         
        }else if(type==2){
            var cityData = $scope.service.privateDateObj.citykeyData[$scope.selectItem.__province]['city'];
            if (Object.prototype.toString.call(cityData) == '[object Array]') {
                $scope.selectItem.__citylevel = '';
                $scope.selectItem.city = $scope.selectItem.__province;
            } else {
                $scope.selectItem.__citylevel = ($scope.selectItem.__citylevel == '01') ? '02' : '01';
                $scope.selectItem.city = $scope.selectItem.__province + $scope.selectItem.__citylevel;
               
            }  
        }       
    };
    //模态框计算总价
    $scope.submoney = function () {
        $scope.totalmoney = 0;
        if (!$scope.selectItem.__refprojectdevicelist) {
            $scope.selectItem.__refprojectdevicelist = [];
        }        
        for (var item = 0; item < $scope.selectItem.__refprojectdevicelist.length; item++) {
            if (!$scope.selectItem.__refprojectdevicelist[item].__delelte) {
                $scope.totalmoney += parseInt($scope.selectItem.__refprojectdevicelist[item].money ? $scope.selectItem.__refprojectdevicelist[item].money : 0);
            }            
        }
    }
    //用作多选框的数据
    //主页检索用户数据源
    $scope.selectCustomerinfoData = {}
    //主页检索用户数据源
    $scope.selectUserData = {};
    $scope.P_objecttoarray = function (object) {
        var tmp = [];
        var idcustomers = [];
        var idusers = [];
        for (var key in object) {
            if ($scope.service.privateDateObj.customerinfoData[object[key].refcustomers]) {
                //缓存区
                object[key].customerinfoData = $scope.service.privateDateObj.customerinfoData[object[key].refcustomers];
                $scope.selectCustomerinfoData[object[key].refcustomers] = $scope.service.privateDateObj.customerinfoData[object[key].refcustomers];
            } else if ($scope.service.privateDateObj.tempcustomerinfoData[object[key].refcustomers]) {
                //权限以外的临时缓存区
                object[key].customerinfoData = $scope.service.privateDateObj.tempcustomerinfoData[object[key].refcustomers];
                $scope.selectCustomerinfoData[object[key].refcustomers] = $scope.service.privateDateObj.tempcustomerinfoData[object[key].refcustomers];
            } else {
                //权限以外的客户id
                idcustomers.push(object[key].refcustomers);
            }
            //组件主页面负责人检索可选项
            if($scope.service.privateDateObj.usersData[object[key].userid]) {
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
        查询项目（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //客户
        select_customerinfo(params).then(function () {
            //组件项目数据源
            params.append('index', 0);
            select_project(params).then(function () {
                //如果没有项目的时候会查询到一个空数组，将空数组变成空对象
                if (Object.prototype.toString.call($scope.service.privateDateObj.projectData) == '[object Array]' && $scope.service.privateDateObj.projectData.length < 1) {
                    $scope.service.privateDateObj.projectData = {};
                    $scope.service.projectArrData = [];
                } else {
                    $scope.service.projectArrData = $scope.P_objecttoarray($scope.service.privateDateObj.projectData);
                }
                //关闭加载层
                parent.layer.closeAll('loading'); 
            });
        });
        
        //项目状态
        select_project_status(params).then(function (res) {
            //页面检索使用，因为要操作数据所有copy了一份数据源
            $scope.projectstatusData = angular.copy($scope.service.privateDateObj.projectstatusData);
        });
        //用户
        select_user(params).then(function (res) {
            $scope.usersCreateData = angular.copy($scope.service.privateDateObj.usersData);          
        });
        
        //工单
        // select_workorder(params);
        //商机
        $scope.selectclue();
        //联系人
        select_customer_contact(params);
        //获取产品清单数据  ---- 项目与型号的关系 
        select_project_devicelist(params);
    }
    //查询商机
    $scope.selectclue = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('asignid', $scope.service.userid);
        params.append('status', 2);
        select_clue(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            //获取到已跟进的商机
            $scope.service.projectRefcluedata = data;
        });
    }
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.type = 'project';
        $scope.service.name = '项目';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //添加按钮
    $scope.add = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //新模态框呼出
        $scope.projectModal.open();
        $scope.projectModal.title = '添加项目';
        if ($scope.Action != 0 || $scope.selectItem.idproject) {
            $scope.selectItem = {};           
        }
        //模态框总价
        $scope.totalmoney = 0;
        //新增状态
        $scope.Action = 0;
        //呼出了添加模态框时组件时间插件
        $scope.timeapi();
        //获取产品型号数据 (添加\修改用到了)     
        select_productmodel(params);
        //获取产品数据  (添加\修改用到了)     
        select_product(params);
        //模态框被删除清单数据
        $scope.delData = [];
        //获取受保护的项目名单
        $scope.selectIsprotected();
        $scope.url = __URL + 'Crmproject/Project/add_page_data';
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.projectModal.open();
        $scope.projectModal.title = '编辑项目';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //给选择框付默认值--受保护的项目
        $scope.selectItem.isprotected = $scope.selectItem.isprotected == 1 ? true : false;
        //给选择框付默认值--集成项目
        $scope.selectItem.integrate = $scope.selectItem.integrate == 1 ? true : false;
        //计算模态框总价
        $scope.submoney();
        //呼出了添加模态框时组件时间插件---每次必须初始化  *******************
        $scope.timeapi();       
        //初始化模态框中的联系人
        $scope.selectContact();
        //抄送人绑定，多选框绑定的数据源是list--这里转换成数组,在保存的时候记得再转成字符串
        if (Object.prototype.toString.call($scope.selectItem.refusers) != '[object Array]' && $scope.selectItem.refusers && $scope.selectItem.refusers!=null) {
            $scope.selectItem.refusers = $scope.selectItem.refusers.split(',');
        }
        var params = new URLSearchParams();
        params.append('$json', true);
        //获取产品数据  (添加\修改用到了)     
        select_product(params);
        //获取产品型号数据 (添加\修改用到了)     
        select_productmodel(params);
        //获取受保护的项目名单
        $scope.selectIsprotected();
        //获取附件数据--根据username
        $scope.selectAnnx();
        //设置城市选中默认值
        $scope.setCity();
        $scope.url = __URL + 'Crmproject/Project/update_page_data';
    }
    //删除按钮
    $scope.remove = function (row) {
        var index = parent.layer.open({
            content: '确认删除项目【' + row.name + '】，是否确认？'
         , btn: ['确认', '我再想想']
         , icon: 6
         , area: ['400px']
         , title: '删除项目信息'
         , yes: function (index, layero) {
             //按钮【按钮一】的回调
             var params = new URLSearchParams();
             params.append('idproject', row.idproject);
             $scope.service.postData(__URL + 'Crmproject/Project/del_page_data', params).then(function (data) {
                 if (data) {
                     parent.layer.msg('删除成功', { icon: 1 });
                     $scope.service.delData('projectArrData', row);
                     row._kid = row.idproject;
                     $scope.service.delData('projectData', row);
                 }
             });
             parent.layer.close(index);
         }
        });
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: row.name,
            url: __URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmproject/Project/selectdetailed?id=' + row.idproject + '&guid=' + row.guid, row.name);
    }
    //打开受保护项目清单
    $scope.selectprotect = function () {
        parent.YL.open('eimselectdetailed', {
            title: '受保护的项目',
            url: __URL + 'Crmproject/Project/protectlist'
        });
        //window.Win10_child.openUrl(__URL + 'Crmproject/Project/protectlist','受保护的项目');
    }
    //打开受保护项目清单
    $scope.selectclose = function () {
        parent.YL.open('eimselectdetailed', {
            title: '已关闭项目',
            url: __URL + 'Crmproject/Project/projectclose'
        });
    }
    //进入销售漏斗页面
    $scope.selectfunnel = function () {
        parent.YL.open('eim-50');
    }
    //tags的数据源
    $scope.tagsData = [];
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.projectArrData = [];
        } else {
            $scope.service.projectArrData = P_objecttoarray($scope.service.privateDateObj.projectData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.projectData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'statusid') {
                    id = 'idprojectstatus';
                } else if($scope.tagsData[svalue].key == 'userid'){
                    id = 'idusers';
                } else if ($scope.tagsData[svalue].key == 'refcustomers') {
                    id = 'idcustomerinfo';
                } else if ($scope.tagsData[svalue].key == 'city' && value[$scope.tagsData[svalue].key]) {
                    id = 'id';
                    //把城市数据改变一下，只要省份的数字
                    var provincedata = value[$scope.tagsData[svalue].key].slice(0, 2);
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.projectArrData.push(value);
                    break;
                } else if (provincedata && provincedata == $scope.tagsData[svalue].value[id]) {
                    $scope.service.projectArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type,item) {
        if (type == 'statusid' && $scope.status != null) {
            $scope.tagsData.push({ 'value': $scope.status, 'key': 'statusid' });
            if ($scope.projectstatusData[$scope.status.idprojectstatus]) {
                delete $scope.projectstatusData[$scope.status.idprojectstatus];
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'refcustomers') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'refcustomers' });
            if ($scope.selectCustomerinfoData[item.value.idcustomerinfo]) {
               // delete $scope.selectCustomerinfoData[item.value.idcustomerinfo];
               // $scope.service.refcustomer = [];
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'city') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'city' });
            if ($scope.service.privateDateObj.citykeyData[item.value['id']]) {
                $scope[type] = {};
                $scope.tagSearch();
            }
        } else if (type == 'user' && $scope.user != null) {
            $scope.tagsData.push({ 'value': $scope.user, 'key': 'userid' });
            if ($scope.selectUserData[$scope.user.idusers]) {
                delete $scope.selectUserData[$scope.user.idusers];
                $scope[type] = {};
                $scope.tagSearch();
            }
        }
    }
    //删除一条筛选条件
    $scope.removeTag = function (item) {
        var index = $scope.tagsData.indexOf(item);
        if (item.key == 'statusid') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                $scope.projectstatusData[item.value.idprojectstatus] = item.value;
            }
        } else if (item.key == 'userid') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                $scope.selectUserData[item.value.idusers] = item.value;
            }
        } else if (item.key == 'city') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.citydata.indexOf(item.value);
                    $scope.service.citydata.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.citydata.splice:" + e);
                }
            }
        } else if (item.key == 'refcustomers') {
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
   
    //创建可选筛选条件
    $scope.buildUserdata = function (item) {
       
    }
    $scope.select();

    
    //模态框
    $scope.projectModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".projectmodaltemplate",       
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "80vw"
    });
    //给页面四个联系人绑定一个空对象，防止一开始找不到值
    $scope.selectcontactData = {};
    //当前要操作的选中项或要添加的数据源--绑定到模态框基本信息的数据源
    $scope.selectItem = {};
    //调用时间插件，只有在添加或者修改的时候才执行
    $scope.timeapi = function () {
        try {
            //----时间插件start----
            $scope.dt = new Date();
            //给时间戳插件赋值
            if ($scope.selectItem.contracttime && $scope.selectItem.contracttime !== '0' && $scope.selectItem.contracttime != 'null') {
                var date = new Date($scope.selectItem.contracttime * 1000);
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
            //----时间插件end----
        } catch (e) {
            console.log("Error:$scope.timeapi:"+e);
        }
     
    }
    //获取受保护名单
    $scope.selectIsprotected = function () {
        var params = new URLSearchParams();
        params.append('$findall', true);
        params.append('isprotected', 1);
        params.append('$fieldkey', 'idproject,name,userid');
        select_project(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            $scope.service.privateDateObj.isprojectData = data;
        });
    }
    //附件管理数据
    $scope.selectAnnx = function () {
        $scope.selectItem.__refannex = [];
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('uploaduser', _USERNAME);
        select_annex(params);
    }
    //记录了上一次选中的客户
    $scope.__selectCustomerid = '';
    /*
    组建可选联系人
    index   1表示需要初始化,说明在页面上切换了客户
    */
    $scope.selectContact = function (index) {
        //防止重复选择同一个客户
        if ($scope.__selectCustomerid == $scope.selectItem.refcustomers) {
            return;
        }
        $scope.__selectCustomerid = $scope.selectItem.refcustomers;
        //初始化客户关联的联系人,该数据源绑定到页面的selec中
        $scope.selectcontactData = {};   
        if (index) {
            //默认选中项清空
            $scope.selectItem.refinformant = "";
            $scope.selectItem.refusing = "";
            $scope.selectItem.reftechnical = "";
            $scope.selectItem.refdecision = "";
        }                          
        
        //从联系人缓存中筛选当前选中的客户所关联到的联系人
        if ($scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers].refcontactids) {
            var _list = [];
            if ($scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers].refcontactids.split) {
                _list = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers].refcontactids.split(',');
            } else {
                _list = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers].refcontactids;
            }
            angular.forEach(_list, function (key) {
                if ($scope.service.privateDateObj.contactData[key]) {
                    $scope.selectcontactData[key] = $scope.service.privateDateObj.contactData[key];
                }
            });
        }
                
        
    }
    //判断当前输入的项目名称是否存在保护名单中
    $scope.isprotect = function () {
        var isprotect = true;
        for (i = 0; i < $scope.service.privateDateObj.isprojectData.length;i++){
            if ($scope.service.privateDateObj.isprojectData[i].name == $scope.selectItem.name) {
                ngVerify.setError('#protected', '该项目已创建请更换项目名称！') //以id标记错误
                isprotect = false;
            }
        }
        if(isprotect){
            ngVerify.setError('#protected') //以id取消标记错误
        }
    }
    //附件下载5
    $scope.downLoad = function (annex) {
        window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);
    }
    //附件上传
    //给【浏览】标签一个隐藏
    $scope.selectfile = true;
    //给【上传】标签一个显示
    $scope.uploadfile = false;
    var uploader = $scope.uploader = new FileUploader({
        url: __URL + 'Crmsetting/Annex/upload_file',
        allowedFileType: ["image", "pdf", 'doc', 'xls', 'ppt'],  //规定上传文件的类型
        queueLimit: 1,     //文件个数 
        removeAfterUpload: true   //上传后删除文件
    });
    $scope.uplodefile = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
    }
    uploader.onAfterAddingFile = function (fileItem) {
        $scope.filename = fileItem._file.name;    //添加文件之后，把文件信息赋给scope
        //给【浏览】标签一个隐藏
        $scope.selectfile = false;
        //给【上传】标签一个显示
        $scope.uploadfile = true;
    };
    //上传成功
    uploader.onSuccessItem = function (fileItem, response, status, headers) { 
        $scope.filename = '';
        if (response.status) {
            //给【浏览】标签一个隐藏
            $scope.selectfile = true;
            $scope.uploadfile = false; // 把上传标签改为不显示
            $scope.fileid = response.fileid;
            $scope.annexinfo = response.file.file;
        } else {
            parent.layer.msg('上传失败，请稍后再试');
            return;
        }
        //判断默认项数据源是否是undefined
        if ($scope.selectItem.refannexs == undefined) {
            $scope.selectItem.refannexs = [];
        }
        //判断是否是数组，如果不是转成数组
        if (!(Object.prototype.toString.call($scope.selectItem.refannexs) == '[object Array]')) {
            $scope.selectItem.refannexs = $scope.selectItem.refannexs.split(',');
        }
        //往默认项里面追加值
        $scope.selectItem.refannexs.push(response.fileid);
        $scope.selectItem.refannexs = $scope.selectItem.refannexs.join(',');
        //组件更新数据源
        var annexdata = {
            idannex: $scope.fileid,
            name: $scope.annexinfo.name,
            path: $scope.annexinfo.tmp_name,
            size: $scope.annexinfo.size
        };
        //更新数据源
        $scope.service.privateDateObj.annexData[$scope.fileid] = annexdata;
    };
    //将上传队列中所有的项进行上传
    $scope.UploadFile = function () {
        uploader.uploadAll();
    }
    //设置城市选中
    $scope.setCity = function () {
        //组建决策地选中项
        if ($scope.selectItem.decisioncity) {
            
            $scope.selectItem.__decisionprovince = $scope.selectItem.decisioncity.slice(0, 2);
            if ($scope.selectItem.decisioncity > 2) {
                $scope.selectItem.__decision = $scope.selectItem.decisioncity.slice(2);
            }
           
        }
        //组建所在地选中项
        if ($scope.selectItem.city) {
            $scope.selectItem.__province = $scope.selectItem.city.slice(0, 2);
            if ($scope.selectItem.decisioncity > 2) {
                $scope.selectItem.__citylevel = $scope.selectItem.city.slice(2);
            }
        }
    }

    //获取城市数据，只有在添加或者修改的时候才执行
    $scope.getcity = function () {       
        //获取城市的数据
        try {
            if ($scope.service.privateDateObj.citykeyData && Object.keys($scope.service.privateDateObj.citykeyData).length > 1) {
             
                //$scope.setCity();
                return;
            } else {
                $scope.service.privateDateObj.citykeyData = {};
            }
        } catch (e) {
            console.log("Error: $scope.getcity:"+e);
            return;
        }
        dataService.postData(__URL + 'Crmproject/Project/getCityData', {}).then(function (data) {
            //将数据存一份（带key的）
            $scope.service.privateDateObj.citykeyData = JSON.parse(data);
           // $scope.setCity();
        });
    }
    //获取城市
    $scope.getcity();
    //添加产品清单--新增产品后触发的事件
    $scope.addProductlist = function () {
        if (!$scope.selectItem.__refprojectdevicelist) {
            $scope.selectItem.__refprojectdevicelist = [];
        }
        var newData = { addData: true, number: 1, money: 0 };
        var flag = true;
        for (var i = 0; i < $scope.selectItem.__refprojectdevicelist.length; i++) {
            if (!$scope.selectItem.__refprojectdevicelist[i].productmodelid || !$scope.selectItem.__refprojectdevicelist[i].number || !$scope.selectItem.__refprojectdevicelist[i].money) {
                flag = false;
                parent.layer.msg("请将上一条产品信息填写完整！", { icon: 0 });
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
            $scope.selectItem.__refprojectdevicelist.splice(index,1);
        } else {
            item.__delelte = true;
        }
        $scope.submoney();

    }
    /*
    保存信息  
    */
    $scope.savetip = function () {
        index = parent.layer.open({
            content: '确认' + ($scope.Action == 1 ? '修改' : '添加') + '项目【' + $scope.selectItem.name + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['400px'],
            title: $scope.Action == 1 ? '修改' : '添加' + '项目信息',
            yes: function (index, layero) {
                parent.layer.close(index);
                //将产品设置为必填项
                if ($scope.selectItem.__refprojectdevicelist==undefined || $scope.selectItem.__refprojectdevicelist.length < 1) {
                    parent.layer.msg('关联产品不能为空');
                    return;
                } 
                $scope.save();
                //保存产品清单
                if($scope.Action == 1){
                    $scope.bulidProductlist();
                }
            }
        });
    };
    $scope.save = function () {
        //把保存按钮置灰
        $scope.saveone = true;
        var params = new URLSearchParams();
        var num = 0;
        if ($scope.selectItem.idproject) {
            params.append('idproject', $scope.selectItem.idproject);
            num++;
        }
        //产品决策地
        if ($scope.selectItem.__decisionprovince) {
            if ($scope.selectItem.__decision) {
                $scope.selectItem.decisioncity = $scope.selectItem.__decisionprovince + $scope.selectItem.__decision;
            } else {
                $scope.selectItem.decisioncity = $scope.selectItem.__decisionprovince;
            }
           
        }
        //产品使用地
        if ($scope.selectItem.__province) {
            if ($scope.selectItem.__citylevel) {
                $scope.selectItem.city = $scope.selectItem.__province + $scope.selectItem.__citylevel;
            } else {
                $scope.selectItem.city = $scope.selectItem.__province;
            }
        }
           
        //对每一个属性进行遍历,是否有新值
        angular.forEach($scope.selectItem, function (value, key) {
            if (key == '__refprojectdevicelist') {
                return false;
            }
            //处理集成项目
            if (key == 'integrate') {
                value = value ? 1 : 0;
            }
            //处理保护项目
            if (key == 'isprotected') {
                value = value ? 1 : 0;
            }
            if (value!=undefined && value != $scope.service.selectItem[key]&&key.indexOf('__')<0) {
                //处理user
                if (key == 'refusers') {
                    value = value.join(',');
                }
                params.append(key, value);
                num++;
            }
        });
        if ($scope.dt && $scope.dt.getTime) {
            if ($scope.service.selectItem.contracttime != ($scope.dt.getTime() / 1000).toFixed(0)) {
                //将标准时间转换成时间戳
                $scope.dt = Date.parse($scope.dt) / 1000;
                params.append('contracttime', $scope.dt);
                num++;
            }
        } else if ($scope.dt && !$scope.dt.getTime) {
            if ($scope.dt != $scope.service.selectItem.contracttime) {
                params.append('contracttime', $scope.dt);
                num++;
            }
        }
        if (num < 2) {
            //parent.layer.msg('您未修改任何数据', { icon: 0 });                  
            return;
        }
        $scope.service.postData($scope.url, params).then(function (data) {
            switch ($scope.Action) {
                case 0:
                    if (data.id < 1) {
                        //添加失败
                        parent.layer.msg('添加失败', { icon: 5 });
                        break;
                    }
                    $scope.selectItem._kid = data.id;
                    $scope.selectItem.idproject = data.id;
                    $scope.selectItem.guid = data.guid;
                    $scope.selectItem.createtime = data.createtime.toString();
                    $scope.selectItem.contracttime = $scope.dt;
                    $scope.selectItem.userid = $scope.service.userid;
                    $scope.selectItem.index = 0;
                    if(!$scope.selectCustomerinfoData[$scope.selectItem.refcustomers]){
                        $scope.selectCustomerinfoData[$scope.selectItem.refcustomers] = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers];
                    }
                    //把总价格追加到数据源里
                    $scope.selectItem.allmoney = $scope.totalmoney;
                    $scope.selectItem.customerinfoData = $scope.service.privateDateObj.customerinfoData[$scope.selectItem.refcustomers];
                    $scope.service.addData('projectArrData', $scope.selectItem);
                    $scope.service.addData('projectData', $scope.selectItem);
                    //新建项目存储项目清单列表
                    parent.layer.msg('添加成功', { icon: 6 });
                    $scope.bulidProductlist();
                    //$scope.service.updateInfo($scope.service.projectData[data.id]);
                    //关闭模态框
                    $scope.projectModal.close();
                    break;
                case 1:
                    if (data['ok']) {
                        //修改成功    
                        $scope.selectItem.contracttime = Date.parse($scope.dt) / 1000;
                        $scope.selectItem.updatetime = data.updatetime;
                        $scope.service.updateData('projectArrData', $scope.selectItem);
                        $scope.selectItem._kid = $scope.selectItem.idproject;
                        $scope.service.updateData('projectData', $scope.selectItem);
                        parent.layer.msg('修改成功', { icon: 1 });
                        //关闭模态框
                        $scope.projectModal.close();
                        break;
                    }
                    //修改失败
                    //parent.layer.msg('修改失败', { icon: 5 });
                    break;
            }
            //在关联商机时要往商机的mongo中记录
            if ($scope.service.selectItem.refclue != $scope.selectItem.refclue) {
                //这里说明关联了商机，要把商机得状态修改成【成立客户】状态
                $scope.saveClue($scope.selectItem.refclue,4);
                $scope.saveCluerecord($scope.selectItem.refclue, '关联了项目' + $scope.selectItem.name);
            }
        }, function (error) {
            console.log(error);
        });
    }
    //判断产品清单保存的动作（增删改）
    $scope.bulidProductlist = function () {
        if (!$scope.selectItem.__refprojectdevicelist || $scope.selectItem.__refprojectdevicelist.length < 1) {
            return;
        }
        $scope.newdata = {
            add: [],
            upd: [],
            del:[]
        };
        //组建需要批量操作的数据
        if ($scope.selectItem.__refprojectdevicelist.length > 0) {
            for(var i=0;i<$scope.selectItem.__refprojectdevicelist.length;i++){
                var value = $scope.selectItem.__refprojectdevicelist[i];
                value.__index = i;
                //__deleted表示真的已经删除了,不需要再看了
                if (value.__deleted) {
                    continue;
                }
                if (value.__delelte) {
                    $scope.newdata.del.push({idprojectdevicelist:value.idprojectdevicelist,__index : i});
                
                } else if (!value.idprojectdevicelist) {
                    if (!value.productmodelid || !value.number || !value.money) {
                        parent.layer.closeAll('tips');
                        parent.layer.msg("请将产品信息填写完整后再保存", { icon: 0 });
                        break;
                    }                    
                    value.projectid=$scope.selectItem.idproject;
                    $scope.newdata.add.push(value);
                    //$scope.saveProductlist(0, value);
                } else if(value.__update){
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
        var url = __URL + 'Crmproject/Projectdevicelist/batchOperation';
        var params = new URLSearchParams();
        params.append('data',JSON.stringify($scope.newdata));
        $scope.service.postData(url, params).then(function (data) {
            //保存是否全部成功
            $scope.isTip = true;
            angular.forEach(data['add'], function (value) {
                if (value.id) {
                    $scope.__refprojectdevicelist[value.index].idprojectdevicelist = value.id;
                    $scope.__refprojectdevicelist[value.index].__update = false;
                    $scope.__refprojectdevicelist[value.index].addData = false;
                    $scope.service.privateDateObj.projectdevicelistData[value.id] = angular.copy($scope.__refprojectdevicelist[value.index]);

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
                //关闭模态框
                $scope.projectModal.close();
            }
        });
    }
    //修改商机数据
    $scope.saveClue = function (idclue, status) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Clue/update_page_data";
        params.append('idclue', idclue);
        params.append('status', status);
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                //更新数据源
                if ($scope.service.privateDateObj.clueData != undefined || Object.keys($scope.service.privateDateObj.clueData).length > 0) {
                    $scope.service.privateDateObj.clueData[idclue].status = status;
                } 
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //往商机的历史记录中添加数据
    $scope.saveCluerecord = function (orderid, mark) {
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
    //关闭项目
    $scope.close = function (data) {
        //新模态框呼出
        $scope.projectdetailModal.open();
        $scope.projectdetailModal.title = '关闭项目';
        //默认选中项
        $scope.service.selectItem = data;
        $scope.selectItem = angular.copy(data);
        if ($scope.selectItem.mark) {
            ue.setContent($scope.selectItem.mark);
        }
    }
    //关闭项目--模态框
    $scope.projectdetailModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".projectdetailtemplate",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "50vw"
    });
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('detailcontainer', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
    });
    //保存方法
    $scope.saveclose = function () {
        if (ue.getContent() == '' || !$scope.closetypevalue) {
            parent.YL.util.simpleMsg('请将信息填写完整');
            return;
        }
        //组件参数数据
        $scope.project = {};
        $scope.project._kid = $scope.selectItem.idproject;
        $scope.project.index = $scope.closetypevalue.id;
        $scope.project.mark = ue.getContent();
        var params = new URLSearchParams();
        params.append('idproject', $scope.selectItem.idproject);
        params.append('index', $scope.project.index);
        params.append('mark', $scope.project.mark);
        $scope.url = __URL + 'Crmproject/Project/update_page_data';
        $scope.service.postData($scope.url, params).then(function (data) {
                parent.layer.msg('关闭成功！', { icon: 6 });
                //更新数据源
                $scope.service.delData('projectArrData', $scope.service.selectItem);
                //$scope.service.updateData('projectData', $scope.selectItem);
                //往商机的历史记录中添加数据
                if ($scope.selectItem.refclue) {
                    //修改商机状态
                    $scope.saveClue($scope.selectItem.refclue, $scope.project.index == 1 ? 4 : 3);
                    $scope.saveCluerecord($scope.selectItem.refclue, '<' + $scope.selectItem.name + '>项目已关闭,自动关闭商机。项目关闭状态：' + $scope.service.privateDateObj.closetypeData[$scope.project.index].name);
                }
                //关闭模态框
                $scope.projectdetailModal.toggle();
            });
    }

}]);
