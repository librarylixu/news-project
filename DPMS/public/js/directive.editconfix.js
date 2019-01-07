/*
自定义单元格编辑指令
showtexteditconfixvalue  显示/隐藏 text文本
showinputeditconfixvalue  显示/隐藏 input输入框
showeditbuttonconfixvalue   显示/隐藏 编辑按钮
showsavebuttonconfixvalue  显示/隐藏 保存按钮
showrevokebuttonconfixvalue  显示/隐藏 撤销按钮
directiveeditconfixtextvalue   text 初始值
directiveeditconfixinputvalue   input输入框初始值
*/
var __editconfixmodule = null;
if (typeof(app) != "undefined") {
    __editconfixmodule = app;
} else if (typeof (appModule) != "undefined") {
    __editconfixmodule = appModule;
}
if (__editconfixmodule != null) {
    __editconfixmodule.directive('editConfix', function () {
        return {
            restrict: 'ECAM',
             templateUrl: '/index.php/Crmbase/Baseinfo/editconfix',
           // template: '<p>自定义指令scope：<input type="text" ng-model="value"></p>',
            replace: true,
            scope: {
                value: '=',
                confixname: '=',
                verify: '=',
                confixtype:'=',
                spanvisible: '=',
                inputvisible: '=',
                //editbtn: "=",
                //savebtn: "=",
                //backbtn: "=",
                saveContact: '&'
            },
            link: function (scope,element,attrs) {
                scope.saveconfix = function (value, confixname) {
                    scope.saveContact({ newvalue: value, newconfixname: confixname });
                }
            },
            controller: function ($scope) {
                //$scope.saveContact();
                //把text里得值给输入框
                if ($scope.value[$scope.confixname] != undefined && $scope.value[$scope.confixname] != '') {
                    $scope.newvalue = $scope.value[$scope.confixname];
                }
            }
        }
    });
}
