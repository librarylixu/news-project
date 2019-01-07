/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap',  'ngVerify',  'ui.select']);
//appModule.config(function ($provide) {
//    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
//        taOptions.toolbar[0].splice(3);
//        taOptions.toolbar[3] = [];
//        return taOptions;
//    }]);
//});
//主控制器
appModule.controller('crmCluecloseController', ['$scope', '$q', 'dataService',  function ($scope, $q, dataService) {
    _$scope = $scope;
    _$q = $q;    
    $scope.service = dataService;//要显示到页面上的数据源
    //给页面一个加载中效果
    if ($scope.service.privateDateObj.closeclueData == undefined || Object.keys($scope.service.privateDateObj.closeclueData).length < 1) {
        parent.layer.load(1, {
            shade: [0.6, '#fff']
        });
    }
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
        }       
        return tmp;
    }
    //tags的数据源
    $scope.tagsData = [];
    //按条件检索数据
    $scope.tagSearch = function () {
        var id;
        if ($scope.tagsData.length > 0) {
            $scope.service.closeclueArrData = [];
        } else {
            $scope.service.closeclueArrData = $scope.P_objecttoarray($scope.service.privateDateObj.closeclueData);
            return;
        }
        angular.forEach($scope.service.privateDateObj.closeclueData, function (value, key) {
            for (var svalue = 0; svalue < $scope.tagsData.length; svalue++) {
                if ($scope.tagsData[svalue].key == 'status') {
                    id = 'id';
                } else {
                    id = 'idusers';
                }
                if (value[$scope.tagsData[svalue].key] == $scope.tagsData[svalue].value[id]) {
                    $scope.service.closeclueArrData.push(value);
                    break;
                }
            }
        });
    }
    //选择筛选条件，添加条件tag
    $scope.addTags = function (type, item) {
       if (type == 'status') {
            $scope.tagsData.push({ 'value': item.value, 'key': 'status' });
            if ($scope.service.privateDateObj.cluestatusData[item.value.id] == item.value) {
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
        if (item.key == 'status') {
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
                    params.append('$in', true);
                    params.append('status', "3,4,5,6");
                    //params.append('$fetchSql', true);
                    select_clue(params, { status: 1, index: 'returndata' }).then(function (data) {
                        $scope.service.privateDateObj.closeclueData = data;
                        //如果没有项目的时候会查询到一个空数组，将空数组变成空对象
                        if (Object.prototype.toString.call($scope.service.privateDateObj.closeclueData) == '[object Array]' && $scope.service.privateDateObj.closeclueData.length < 1) {
                            $scope.service.privateDateObj.closeclueData = {};
                            $scope.service.closeclueArrData = [];
                        } else {
                            $scope.service.closeclueArrData = $scope.P_objecttoarray($scope.service.privateDateObj.closeclueData);
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
    }
    //查询用户数据
    $scope.select_userdata();
    //打开详情页
    $scope.selectdetailed = function (item) {
        parent.YL.open('eimselectdetailed', {
            title: item.name,
            url: __URL + 'Crmschedule/Clue/selectdetailed?id=' + item.idclue + '&guid=' + item.guid
        });
    }
}])      