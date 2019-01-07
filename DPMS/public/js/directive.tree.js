/*
自定义Tree指令
*/
app.directive('eimTree', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/Tree',
        replace: true,
        controller: function ($scope) {
            //查找父级组
            $scope.buildParentname = function (node, parentnode, allDataname) {
                if (node.pid && node.pid != '0') {
                    if (!node.__parentname) {
                        node.__parentname = parentnode.groupname;
                    } else {
                        node.__parentname = parentnode.groupname + '->' + node.__parentname;
                    }
                    if (parentnode.pid && parentnode.pid != '0') {
                        $scope.buildParentname(node, $scope.service.privateDateObj[allDataname][parentnode.pid], allDataname);
                    }
                } else {
                    if (!node.__parentname) {
                        node.__parentname = '';
                    }
                }
            }
            $scope.select = function () {
                var params = {};
                params['$json'] = true;
                //查询用户组数据      
                select_usergroup(params).then(function (res) {
                    angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                        if (!value.__parentname) {
                            $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid], 'usergroupData');
                        }
                    });
                    //查询设备组数据
                    select_devicegroup(params).then(function (res) {
                        angular.forEach($scope.service.privateDateObj.devicegroupData, function (value, key) {
                            if (!value.__parentname) {
                                $scope.buildParentname(value, $scope.service.privateDateObj.devicegroupData[value.pid], 'devicegroupData');
                            }
                        });
                        $scope.service.gettreedata();
                    });
                });
            };
            $scope.select();
            //组建用户组 or 设备组父子之间的关系结构
            $scope.service.createTreeData = function (oldData, oldName) {
                $scope.olddata = angular.copy(oldData);
                var tempData = [];
                angular.forEach($scope.olddata, function (value, key) {
                    var i = value.pid;
                    value.name = value[oldName];
                    if (i == '0' || i == -1 || $scope.olddata[i] == undefined) {
                        value.isParent = true;
                        value.usertypeCount = 0;
                        tempData.push(value);
                        return;
                    }
                    $scope.olddata[i].isParent = true;
                    if ($scope.olddata[i].children == undefined) {
                        $scope.olddata[i].children = [value];
                    } else if ($scope.olddata[i].children.indexOf(value) == -1) {
                        $scope.olddata[i].children.push(value);
                    }
                });

                return tempData;
            }
            
            //递归查找children
            $scope.find_children = function (obj, keyname) {
                $scope.service.treevalueids.push(obj[keyname]);
                if (obj.children != undefined) {
                    angular.forEach(obj.children, function (value, key) {
                        if (value.children != undefined) {
                            $scope.find_children(value, keyname);
                        } else {
                            $scope.service.treevalueids.push(value[keyname]);
                        }
                    });
                }
            }
        }
    }
});
