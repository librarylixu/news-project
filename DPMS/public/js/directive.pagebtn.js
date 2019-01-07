/*
      自定义的 html解析指令
      用来解析html中包含ng-click不生效的问题
      */
appModule.directive('crmBindHtml', ['$compile', function ($compile) {
    return {
        restrict: 'ECAM',
        replace: true,
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.crmBindHtml);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
}]);


/*
自定义的按钮渲染指令

这里会存储所有的按钮数据

*/
appModule.directive('pageBtn', function () {
    return {
        restrict: 'ECAM',
        templateUrl: __URL + 'Crmbase/Baseinfo/pagebtn',
        replace: true,
        controller: function ($scope) {
            $scope.service.refdel = false;
            $scope.service.refedit = false;
            //查找该页面绑定的按钮的id
            $scope.serachPageRef = function () {
                /*
             没有父级页面
             父级页面没有按钮的缓存变量
             缓存变量中没有值,说明就没有赋值
             */
                if (parent.pageRefAuth == undefined || Object.keys(parent.pageRefAuth).length == 0 || parent.pageRefAuth[__APPID]==undefined) {
                    console.log('Search serachPageRef');
                    var param = new URLSearchParams();
                    param.append('$json', true);
                    //只查询当前页面的权限
                    param.append('$where', JSON.stringify({ appid: __APPID }));
                    $scope.service.postData(__URL + 'Crmuser/RefauthRefapp/select_user_ref_page_data', param).then(function (data) {
                        
                        
                        //判断权限，才能去过滤按钮的
                        if (parent.pageRefAuth[__APPID] == undefined) {
                            parent.pageRefAuth[__APPID] = {
                                btns: [],                                
                            };
                        }
                        
                        angular.forEach(data, function (value, key) {
                            /*1.保存一下当前页面能够看到的按钮*/
                            if (value.btns != null) {
                                var tempBtns = value.btns.split(',');
                               //合并数组
                                parent.pageRefAuth[__APPID].btns = parent.pageRefAuth[__APPID].btns.concat(tempBtns);
                               
                            }
                            /*2.把是否允许编辑和删除的权限赋值*/
                            if (!$scope.service.refdel) {
                                $scope.service.refdel = ((value.isdel == 0)?false:true);
                            }
                            if (!$scope.service.refedit) {
                                $scope.service.refedit = ((value.isupdate == 0) ? false : true);
                            }
                            if (parent.pageRefAuth[__APPID].isdel==undefined||!parent.pageRefAuth[__APPID].isdel) {
                                parent.pageRefAuth[__APPID].isdel = value.isdel;
                            }
                            if (parent.pageRefAuth[__APPID].isupdate==undefined||!parent.pageRefAuth[__APPID].isupdate) {
                                parent.pageRefAuth[__APPID].isupdate = value.isupdate;
                            }                           
                            
                        });
                        parent.pageRefAuth[__APPID].btns = unique(parent.pageRefAuth[__APPID].btns);
                        $scope.pageRefauth = parent.pageRefAuth;
                        //当前页面的按钮
                        $scope.pageRefBtns = $scope.pageRefauth[__APPID].btns;
                      
                    });
                } else {
                    $scope.pageRefauth = parent.pageRefAuth;
                    //当前页面的按钮
                    $scope.pageRefBtns = $scope.pageRefauth[__APPID].btns;
                    $scope.service.refdel = (($scope.pageRefauth[__APPID].isdel == 0) ? false : true);
                    $scope.service.refedit = (($scope.pageRefauth[__APPID].isupdate == 0) ? false : true);
                }                
            }

            //查找按钮数据
            $scope.findBtndata = function () {               
                /*
                没有父级页面
                父级页面没有按钮的缓存变量
                缓存变量中没有值,说明就没有赋值
                */
                if (parent == undefined || parent.pageBtns == undefined || Object.keys(parent.pageBtns).length == 0) {
                    console.log('Search findBtndata');
                    var param = new URLSearchParams();
                    param.append('$json', true);
                    $scope.service.postData(__URL + 'Crmuser/Sysbtns/select_page_data', param).then(function (data) {
                        if (parent == undefined) {
                            parent = {};
                        }
                        if (parent.pageBtns == undefined || Object.keys(parent.pageBtns).length == 0) {
                            parent.pageBtns = data;
                        }
                        $scope.btnsData = parent.pageBtns;
                       
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    $scope.btnsData = parent.pageBtns;
                   
                }
                //校验页面id是否合法
                if (__APPID != undefined && __APPID != "") {
                    $scope.serachPageRef();
                }
            };
            $scope.findBtndata();
        }
    }
});
