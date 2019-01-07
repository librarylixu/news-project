/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap' ,'ui.select']);
//主控制器
appModule.controller('crmProjectcloseController', ['$scope', '$q', 'dataService', function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //存一份userid（当前仅用来判断是否是管理员）
    //$scope.service.userid = userid;
    //主页检索客户数据源
    $scope.selectCustomerinfoData = {}
    //主页检索负责人数据源
    $scope.selectUserData = {};
    //获取总价格
    $scope.getonlymoney = function (idproject) {
        var allmoney = 0;
        for (var item in $scope.service.privateDateObj.projectdevicelistData) {
            if ($scope.service.privateDateObj.projectdevicelistData[item].projectid == idproject && !$scope.service.privateDateObj.projectdevicelistData[item].__deleted) {
                allmoney += parseInt($scope.service.privateDateObj.projectdevicelistData[item].money);
            }
        }
        return allmoney;
    }
    //将对象变为数组
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
            if ($scope.service.privateDateObj.usersData[object[key].userid]) {
                $scope.selectUserData[object[key].userid] = $scope.service.privateDateObj.usersData[object[key].userid];
            }
            //key是属性,object[key]是值
            tmp.push(object[key]);//往数组中放属性
        }
        if (idcustomers.length > 0) {
            var params = new URLSearchParams();
            params.append("$json", true);
            params.append("$in",true);
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
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, 'yyyy-mm-dd');
    }
    //初始值
    if (!$scope.service.customerinfoData) {
        $scope.service.customerinfoData = {};
    }
    //把关闭状态copy一份，避免更改源数据源
    if (!$scope.closetypeData) {
        $scope.closetypeData = angular.copy($scope.service.privateDateObj.closetypeData);
    }
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //params.append('$fetchSql', true);
        params.append('$in', true);
        params.append('index', '1,2,3,4');
        params.append('$fieldkey', 'idproject,name,createtime,endtime,userid,refcustomers,index');
        //组件项目数据源
        select_protect(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            //必须组件一份数组的数据，给排序使用
            $scope.service.privateDateObj.projectcloseData = data;
            $scope.service.projectCloseArrData = $scope.P_objecttoarray(data);
        });
    }
    
    /*
        查询项目（本页面使用）数据
    */
    $scope.selectOtherdata = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //用户
        select_user(params).then(function (res) {
            $scope.usersCreateData = angular.copy($scope.service.privateDateObj.usersData);
            $scope.usersCreateDataArr = P_objecttoarray($scope.usersCreateData);
        });
        //客户
        select_customerinfo(params).then(function () {
            //在查询完成客户之后再去查询项目数据
            $scope.select();
        });
        //获取产品清单数据       
        select_project_devicelist(params);
        //获取产品型号数据       
        select_productmodel(params);
        //获取产品数据  
        select_product(params);
    }
    //查询所有数据
    $scope.selectOtherdata();
    //tags的数据源
    $scope.tagsData = [];
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.projectCloseArrData = [];
        } else {
            $scope.service.projectCloseArrData = $scope.P_objecttoarray($scope.service.privateDateObj.projectcloseData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.projectcloseData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'index') {
                    id = 'id';
                } else if ($scope.tagsData[svalue].key == 'userid') {
                    id = 'idusers';
                } else if ($scope.tagsData[svalue].key == 'refcustomers') {
                    id = 'idcustomerinfo';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.projectCloseArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
        if (type == 'index' && $scope.index != null) {
            $scope.tagsData.push({ 'value': $scope.index, 'key': 'index' });
            if ($scope.closetypeData[$scope.index.id]) {
                delete $scope.closetypeData[$scope.index.id];
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
        if (item.key == 'index') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                $scope.closetypeData[item.value.id] = item.value;
            }
        } else if (item.key == 'userid') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                $scope.selectUserData[item.value.idusers] = item.value;
            }
        } else if (item.key == 'refcustomers') {
            if (index > -1) {
                $scope.tagsData.splice(index, 1);
                $scope.tagSearch();
                try {
                    var _i = $scope.service.refcustomer.indexOf(item.value);
                    $scope.service.refcustomer.splice(_i, 1);
                } catch (e) {
                    console.log("$scope.service.refcustomer.splice:" + e);
                }
            }
        }
    }

}]);

