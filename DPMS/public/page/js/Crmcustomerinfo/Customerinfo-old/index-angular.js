appModuleInit(['ui.bootstrap', 'ngVerify', 'ui.select', 'ngSanitize', 'angularFileUpload']);
/*
   客户主页面流程展示
   2018-03-23 10:16
   李旭
   页面数据源
   1.客户所有id（数组）
        $scope.service.customerid 
   2.当前用户id（string）
        $scope.service.userid
   查询流程
   1.查询客户（本页面使用数据源）（被权限过滤后）数据源:[$scope.service.customerinfoData（json）]
        1.1查询联系人（以下为链式查询）数据源:[$scope.service.contactData（json）]          
        1.2查询附件（model模态框及详细页中使用）数据源:[$scope.service.annexData（json）]
        1.3查询与客户收货人关系数据（暂未在页面上展示及未使用）
        1.4查询客户收货人（暂未在页面上展示及未使用）
        1.5查询公司信息（在客户详细页面做展示用）数据源:[$scope.service.customerrefcompanyData（json）]
        1.6查询所有的客户（不经过权限的过滤，所有的客户）（用途：在添加新客户时，检测数据库中是否存在您所添加的客户）数据源:[$scope.service.customerallData（array）]
*/

//主控制器
appModule.controller('crmCustomerinfoController', ['$scope', '$q', 'dataService', 'alert', function ($scope, $q, dataService, alert) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    $scope.service.customerinfoData = {};
    //客户所有id
    $scope.service.customerid = [];
    //给主页面标签附加颜色
    $scope.labelclass = function (type) {
        $scope.bgcolor = '';
        if (type.labelclass != undefined && type.labelclass != null) {
            $scope.bgcolor = { "background-color": type.labelclass };
        } else {
            $scope.bgcolor = { "background-color": '#ccc' };//默认颜色
        }
        return $scope.bgcolor;
    }
    //时间戳转换
    $scope.service.formatDate = function (time) {
        if (time == 0) {
            var html = '暂无';
        } else {
            var html = formatDate(time);
        }
        return html;
    }
    /*
        查询客户（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customerinfo(params).then(function (res) {
            $scope.service.customerid = Object.keys($scope.service[res]);
            //如果没有客户，则将客户重新初始化为对象
            if ($scope.service.customerid.length == 0) {
                $scope.service.customerinfoData = {};
            }
            $scope.service.customerinfoArrData = P_objecttoarray($scope.service.customerinfoData);
            $scope.selectContact();
            //组建客户标签数据    
            $scope.build_tagData();
        });
    }
    /*
    联系人数据 
    这里需要过滤一下：不是自己创建的联系人应过滤掉
    */
    $scope.selectContact=function () {        
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('userid', _userid);
        select_customer_contact(params).then(function (res) {
            $scope.service.contactallData = angular.copy($scope.service.contactData);
            //console.log($scope.service.contactallData);
            //$scope.service.customercontactArrData = P_objecttoarray($scope.service.contactData);
            $scope.bulid_selectcontactData();
        });
    }
   
    /*
组建可关联的联系人的数据($scope.service.contactallData)

*/
    $scope.bulid_selectcontactData = function () {
        //给模态框使用的，可以通过关系表的id进行解除关系
        angular.forEach($scope.service.customerinfoData, function (value) {
            if (value.refcontactData == undefined) {
                value.refcontactData = [];
            }
            if(value.refcontactids){
                $scope.bulid_refcontactData(value);
            }
        });

       
    }
    /**
    *组建每个客户的已选联系人数据
    *$scope.service.selectItem.refcontactData    
    **/
    $scope.bulid_refcontactData = function (value) {
        angular.forEach(value.refcontactids.split(','), function (val) {
            value.refcontactData.push($scope.service.contactData[val]);
            /*
                删除掉关系表中已经关联过的联系人
                联系人二次筛选（根据客户的refcontactids字段，如果联系人已经存在客户关联中了，那么删除掉这条可选联系人信息）
            */
            delete $scope.service.contactallData[val];
        });
    }
    /*
   查询所有标签所需数据
   */
    $scope.build_tagData = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        //客户阶段
        select_customer_stage(params).then(function (res) {
            $scope.service.customerstageArrData = P_objecttoarray($scope.service.customerstageData);
        });
        //客户市场大区分类
        select_customer_market(params).then(function (res) {
            $scope.service.customermarketArrData = P_objecttoarray($scope.service.customermarketData);
        });
        //客户信用等级
        select_customer_credit(params).then(function (res) {
            $scope.service.customercreditArrData = P_objecttoarray($scope.service.customercreditData);
        });
        //客户状态
        select_customer_status(params).then(function (res) {
            $scope.service.customerstatusArrData = P_objecttoarray($scope.service.customerstatusData);
        });
        //客户类型
        select_customer_type(params).then(function (res) {
            $scope.service.customertypeArrData = P_objecttoarray($scope.service.customertypeData);
        });
        //客户来源
        select_customer_source(params).then(function (res) {
            $scope.service.customersourceArrData = P_objecttoarray($scope.service.customersourceData);
        });
        //客户行业
        select_customer_industry(params).then(function (res) {
            $scope.service.customerindustryArrData = P_objecttoarray($scope.service.customerindustryData);
        });
        //客户级别
        select_customer_level(params).then(function (res) {
            $scope.service.customerlevelArrData = P_objecttoarray($scope.service.customerlevelData);
        });
        //用户
        select_user(params).then(function (res) {
            $scope.service.usersArrData = P_objecttoarray($scope.service.usersData);
        });     
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

    //添加按钮
    $scope.add = function () {
        $scope.service.title = '新建客户';
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);

    }
    //修改按钮
    $scope.updateInfo = function (row) {
        $scope.service.title = "修改客户";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.modalPlacement = "right";
        $scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //修改按钮
    $scope.service.updateInfo = function (row) {
        $scope.service.title = "修改客户";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.modalPlacement = "right";
        $scope.service.modalSize = "lg";
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (row) {
        $scope.service.title = '删除客户';
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = row;
        publicControllerDel($scope);
    }
    //查看详细按钮
    $scope.selectdetailed = function (row) {
        window.Win10_child.openUrl(__URL + 'Crmcustomerinfo/Customerrefcompany/selectdetailed?id=' + row.idcustomerinfo + '&guid=' + row.guid, row.name);
        //parent.Win10.openUrl(__URL + 'Crmcustomerinfo/Customerrefcompany/selectdetailed?id=' + row.idcustomerinfo, '<i class="fa fa-newspaper-o icon red"></i>');
    }

    //页面加载完成后，查询数据
    $scope.select();
}]);

