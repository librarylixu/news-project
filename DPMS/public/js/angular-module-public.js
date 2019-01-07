/*
AngularModule层的公用方法
*/

/*
通用的module定义方法

@name,    必填，module的名称
@paraent, 选填，需要引用的插件
@func   ， 选填

*/
var publicModuleCreate = function (name, paraent, func) {
    if (paraent!=undefined && func==undefined) {
        return angular.module(name, paraent);
    }
    else if (paraent == undefined && func != undefined) {
        return angular.module(name, [], func);
    }
    else if (paraent != undefined && func != undefined) {
        return angular.module(name, paraent, func);
    }
    return  angular.module(name, []);   
}
/*
angular Module 公用的名称
*/
var appModule = angular.module('appModule', []);
/*
appModule初始化方法
@paraent, 选填，需要引用的插件
@func   ， 选填

*/
/*
ngAside - 抽屉式-模态框
ngSanitize - ng-bind-html
 */
var appModuleInit = function (paraent, func) {
    if (paraent != undefined && func == undefined) {
        paraent.push('ngAside');
        paraent.push('ngSanitize');
        appModule= angular.module('appModule', paraent);
    }
    else if (paraent == undefined && func != undefined) {        
        appModule = angular.module('appModule', ['ngAside', 'ngSanitize'], func);
    }
    else if (paraent != undefined && func != undefined) {
        paraent.push('ngAside');//抽屉式-模态框
        appModule= angular.module('appModule', paraent, func);
    } else {       
        appModule = angular.module('appModule', ['ngAside', 'ngSanitize']);
    }
    appModuleServiceInit();
    
    return appModule;
}
/*
初始化一下公共的service
*/
var appModuleServiceInit = function () {
    //定义公共service
    appModule.service('dataService', ['$http', '$q', '$uibModal', '$aside', function ($http, $q, $uibModal, $aside) {
        //调用service方法
        publicDataService($http,$q, this, $uibModal, $aside);
    }]);
    //定义公共alert消息框
    appModule.factory('alert', ['$uibModal', function ($uibModal) {
        //调用service方法
        return publicAlertService($uibModal);
    }]);
    //定义公共confirm提示框
    appModule.factory('confirm', ['$uibModal', '$http', '$q', function ($uibModal,$http, $q) {
        //调用service方法
        return publicConfirmService($http,$uibModal, $q);
        }]);

    appModuleRepeatFinish();
    publicFilterDeviceModaltype();
}
/*
自定义指令   ng-repeat 循环完成后执行 
用法：
标签：repeat-finish="renderFinish()"
控制器
$scope.renderFinish = function () {
    //console.log('ng-repeat执行完毕');
}
*/
var appModuleRepeatFinish = function () {
    appModule.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                //console.log(scope.$index)
                if (scope.$last == true) {
                    //console.log('ng-repeat执行完毕')
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    })
}


/*
自定义过滤器
根据选中的设备类型 筛选设备型号
EIM设备类型、设备型号
*/
var publicFilterDeviceModaltype = function () {
    appModule.filter('filterDeviceModaltype', function () {
        return function (obj, type) {
            var objArray = {};
            angular.forEach(obj, function (o) {
                if (o.typeid == type.iddevicetype) {
                    objArray[o.idmodeltype] = o;
                }
            })
            return objArray;
        }
    });
    /*
自定义过滤器
公用

用法：
    1.定义检索框：快速检索：<input type="text" ng-model="filterCustomername" />
    2.定义repeat：ng-repeat="item in service.customerinfoData |filterByAttr:filterCustomername"
    3.输入框输入内容时，会自动调用该方式
第三个参数：当前数据源的个数
    用法：
        1.<span ng-init="contactDataCount={count:0}" ng-bind="contactDataCount.count"> </span>    
        2.ng-repeat="item in service.customerinfoData |filterByAttr:filtername:contactDataCount"
*/
    appModule.filter('filterByAttr', function () {
        return function (obj, name, count) {
            var objdata;
            if (obj == undefined) {
                return;
            }
            if (count == undefined) {
                count = { count: 0 };
            }
            if (Object.prototype.toString.call(obj) == '[object Object]') {
                count.count = 0;
                objdata = {};
            } else if (Object.prototype.toString.call(obj) == '[object Array]') {
                count.count = 0;
                objdata = [];
            }
            if (name == undefined || name == "") {
                if (Object.prototype.toString.call(obj) == '[object Object]') {
                    count.count = obj != undefined ? Object.keys(obj).length : 0;
                } else {
                    count.count = obj != undefined ? obj.length : 0;
                }
                return obj;
            }
            angular.forEach(obj, function (value, key) {
                for (var k in value) {
                    if (value[k] == undefined || value[k] == null) {
                        continue;
                    }
                    if (value[k].toString().indexOf(name) > -1) {
                        if (Object.prototype.toString.call(objdata) == '[object Array]') {
                            objdata.push(value);
                        } else {
                            objdata[key] = value;
                        }
                        
                        //console.log(value[k]);
                        count.count += 1;
                        break;
                    }
                }
            });
            return objdata;
        }
    });
    /*自定义时间过滤器mydata*/
    appModule.filter('mydataconvert', function () {
        return function (d) {
            if (d > 0) {
                if (d < 1111111111111) {
                    d = d * 1000;
                }
                return new Date(d).toLocaleString();
            }
            return '暂无.';
        }
    });

}
