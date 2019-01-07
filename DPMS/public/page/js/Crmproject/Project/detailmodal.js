//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize', 'textAngular']);
//主控制器
appModule.controller('detailProjectController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    if (!$scope.service.privateDateObj.projectData[_id]) {
        return;
    }
    //取项目
    $scope.project = $scope.service.privateDateObj.projectData[_id];

    //处理抄送人 
    try {
        if ($scope.project.refusers && $scope.project.refusers.split) {
            $scope.project.refusers = $scope.project.refusers.split(',');
        }
    } catch (e) {
        console.log(" $scope.project.refusers:"+e);
    }       
    //将金额转换成大写 给详细页的总价使用
    $scope.toupcase = function (price) {
        var num = $scope.convertfloat(price)
        var strOutput = "";
        var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
        num += "00";
        var intPos = num.indexOf(".");
        if (intPos >= 0) {
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        }
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++) {
            strOutput += "零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
        }
        return strOutput.replace(/零角零分$/, "整").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1")
                .replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元");
    };
    // 转换浮点数  
    $scope.convertfloat = function (value) {
        if (!value)
            return 0;
        var result = value.toString();
        result = result.replace(new RegExp("\,", "gm"), "");
        var result = parseFloat(result);
        if (isNaN(result))
            result = 0;
        return result;
    }
    //判断是否是空对象
    $scope.isnullproject = function (data) {
        var dataarr = Object.keys(data);
        var isnull = false;
        if (dataarr.length > 0) {
            isnull = true;
        }
        return isnull;
    }
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, 'yyyy-mm-dd');
    }
    //查询附件信息
    $scope.selectAnnex = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('$findall', true);
        params.append('$findinset', true);
        params.append('idannex', $scope.project.refannexs);
        //查询附件
        select_annex(params, { status: 1, index: 'returndata' }).then(function (data) {
            $scope.annexData=data;
        });
    }
    /*
    查询相关所有数据
    */
    $scope.selectData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //获取产品型号数据 (添加\修改用到了)     
        select_productmodel(params);
        //获取产品数据  (添加\修改用到了)     
        select_product(params);
        if ($scope.project.refannexs) {
            //查询附件信息
            $scope.selectAnnex()
        }
        
        //获取产品使用地数据
        $scope.getcity();
        //获取工单信息数据
        $scope.searchWorkorder();
    }    
    
    //工单
    //html循环的数据
    $scope.workorderData = {};
    $scope.searchWorkorder = function () {
        //根据项目的id查询工单    
        //根据客户的id把关联的项目的ids给拿到，->查询数据库
        var params = new URLSearchParams();
        params.append('$json', true);
        //根据客户的id把关联的项目的ids给拿到
        select_workorder(params).then(function (res) {

            if ($scope.project.__refworkorders) {
                $scope.buildworkorder();
            } else {
                var params = new URLSearchParams();
                params.append('$json', true);
                params.append('$findall', true);
                params.append('$findinset', true);
                params.append('refprojectid', $scope.project.idproject);
                params.append('$fieldkey', 'idworkorder');
                select_workorder(params, { 'index': 'returndata', 'status': 1 }).then(function (resultdata) {
                    $scope.project.__refworkorders = Object.keys(resultdata.data);
                    $scope.buildworkorder();
                });
            }

        });
    }
       
   //组建关联的工单 
    $scope.buildworkorder = function () {
        //组建没有访问权限的工单的id----向后台请求时使用
        var norefwork=[];
        angular.forEach($scope.project.__refworkorders, function (value, key) {
                          
            if ($scope.service.privateDateObj.workorderData.data[value]) {
                if (!$scope.workorderData[value.assignid]) {
                    $scope.workorderData[$scope.service.privateDateObj.workorderData.data[value].assignid] = [];
                }
                //缓存区
                $scope.workorderData[$scope.service.privateDateObj.workorderData.data[value].assignid].push($scope.service.privateDateObj.workorderData.data[value]);
                } else if ($scope.service.privateDateObj.tempworkorderData[value]) {
                    //临时缓存区
                    if (!$scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid]) {
                        $scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid] = [];
                    }
                    $scope.workorderData[$scope.service.privateDateObj.tempworkorderData.data[value].assignid].push($scope.service.privateDateObj.tempworkorderData[value]);
                } else {
                    //组建没有权限的工单id后，去后台拿
                    norefwork.push(value);
                }
            });
        //当有没有获取到的没有权限的工单时，去后台拿
            if (norefwork.length > 0) {
                //去后台拿
                var params = new URLSearchParams();
                params.append('idworkorder', norefwork.join(','));
                params.append('$findall', true);
                params.append('$findinset', true);
                select_workorder(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    angular.forEach(data.data, function (value) {
                        $scope.service.privateDateObj.tempworkorderData[value.idworkorder] = value;
                        if (!$scope.workorderData[value.assignid]) {
                            $scope.workorderData[value.assignid] = [];
                        }
                        $scope.workorderData[value.assignid].push(value);
                    });
                });
            }           
        }   
    //获取城市数据，只有在添加或者修改的时候才执行
    $scope.getcity = function () {
        //获取城市的数据
        try {
            if ($scope.service.privateDateObj.citykeyData && Object.keys($scope.service.privateDateObj.citykeyData).length > 1) {
                $scope.projectcity();
                return;
            }
        } catch (e) {
            console.log("Error: $scope.getcity:" + e);
            return;
        }

        dataService.postData(__URL + 'Crmproject/Project/getCityData', {}).then(function (data) {
            //将数据存一份（带key的）
            $scope.service.privateDateObj.citykeyData = JSON.parse(data);
            $scope.projectcity();

        });
    }
    /*
        获取产品使用地数据
        $scope.project.province 使用地的省级
        $scope.project.citylevel 使用地的市级别
        $scope.project.decisionprovince  决策地的省级
        $scope.project.decisioncitylevel  决策地的市级
        根据得到0101 去后台拿数据
        得到$scope.cityData使用地/$scope.decisioncityData决策地
    */
    $scope.projectcity = function () {
        $scope.cityData = '';
        $scope.decisioncityData = '';
        if ($scope.project.city) {
            $scope.project.province = $scope.project.city.slice(0, 2);
            $scope.cityData = $scope.service.privateDateObj.citykeyData[$scope.project.province].province_name;
            if ($scope.project.city.length>2) {
                $scope.project.citylevel = $scope.project.city.slice(2, 4);
                $scope.cityData += '--' + $scope.service.privateDateObj.citykeyData[$scope.project.province].city[$scope.project.citylevel].city;
            } 
        }
        if ($scope.project.decisioncity) {
            $scope.project.decisionprovince = $scope.project.decisioncity.slice(0, 2);
            $scope.decisioncityData = $scope.service.privateDateObj.citykeyData[$scope.project.decisionprovince].province_name;
            if ($scope.project.decisioncity.length > 2) {
                $scope.project.decisioncitylevel = $scope.project.decisioncity.slice(2, 4);
                $scope.decisioncityData += '--' + $scope.service.privateDateObj.citykeyData[$scope.project.decisionprovince].city[$scope.project.decisioncitylevel].city;
            }
           
        }       
         
    }
    //查询相关数据
    $scope.selectData();
    //打开工单详细页
    $scope.openwork = function (row) {
        parent.YL.open({
            title: row.title,
            url: __URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid
        });
        //window.Win10_child.openUrl(__URL + 'Crmschedule/Workorder/selectdetailed?id=' + row.idworkorder + '&guid=' + row.guid, row.title);
    }
    //附件下载
    $scope.downLoad = function (annex) {
        parent.YL.open({
            title: row.title,
            url: __URL + 'Crmsetting/Annex/downLoad?idannex?id=' + annex
        });
        //window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);
    }
    //刷新按钮
    $scope.refresh = refresh;
    //打印按钮
    $scope.print = function () {
        window.print();
    }
    //取消按钮
    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
}]);