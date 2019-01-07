angular.module('AceApp')
.controller('eimProxypwdruleController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;
    _$scope = $scope;
    _$q = $q;
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    
    /*
        查询（本页面使用）数据
    */
    $scope.select = function (flag) {
        //var params = new URLSearchParams();
        //params.append('$json', true);
        select_proxypasswordrule().then(function (res) {
            angular.forEach($scope.service.privateDateObj.proxypwdruleData, function (value) {
                if (value.refusers && value.refusers.split) {
                    value.refusers = value.refusers.split(',');
                }
                if (value.refugroups && value.refugroups.split) {
                    value.refugroups = value.refugroups.split(',');
                }
                if (value.refpwdids && value.refpwdids.split) {
                    value.refpwdids = value.refpwdids.split(',');
                }
                if (value.refdgroupids && value.refdgroupids.split) {
                    value.refdgroupids = value.refdgroupids.split(',');
                }
            });
            $scope.selectuser();

                layer.msg('数据已刷新', { icon: 6 });
            });       
    }
    /**
        *查询用户数据
    */
    $scope.selectuser = function () {
        var params = {};
        params['$json']= true;
        select_user(params);
    }
   
    $scope.select();
    //详情页面按钮
    $scope.detail = function (row) {
        $scope.service.title = '['+row.name+']规则';
        $scope.modalHtml = 'Eimpasswordrules/Proxypwdrule/opendetailmodal';
        $scope.modalController = 'detailmodalProxypwdruleController';
        $scope.service.ref = undefined;
        $scope.service.selectItem = row;
        publicControllerAdd($scope);
    }
    //添加按钮
    $scope.add = function () {
        $scope.service.title = '添加设备密码规则';
        $scope.modalHtml ='Eimpasswordrules/Proxypwdrule/openmodal';
        $scope.modalController = 'modalProxypwdruleController';
        $scope.service.ref = undefined;
        $scope.service.selectItem = {};
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.update = function (row) {
        $scope.service.title = '编辑设备密码规则';
        $scope.modalHtml ='Eimpasswordrules/Proxypwdrule/openmodal';
        $scope.modalController = 'modalProxypwdruleController';
        $scope.service.ref = undefined;
        $scope.service.selectItem = row;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.del = function (row) {
        var index = layer.open({
            content: '确认删除【' + row.name + '】规则？',
           btn: ['确认', '我再想想'],
           icon: 6,
           area: ['400px'],
           title: '删除规则',
           yes: function (index, layero) {
              //按钮【按钮一】的回调
               var params = {};
               params['idproxypwdrule'] = row.idproxypwdrule;
              $scope.service.postData(__URL + 'Eimpasswordrules/Proxypwdrule/del_page_data', params).then(function (data) {
                  if (data) {
                      layer.msg('删除成功', { icon: 1 });
                      row._kid = row.idproxypwdrule;
                      $scope.service.delData('proxypwdruleData', row);
                  }
              });
              layer.close(index);
          }
        });
    }

}])
.controller('modalProxypwdruleController', ["$scope", 'dataService', 'ngVerify', '$uibModalInstance', function ($scope, dataService, ngVerify, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    /**
       *查询用户组数据
   */
    $scope.selectusergroup = function () {
        var params = {};
        params['$json'] = true;
        select_usergroup(params).then(function (res) {
            angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                if (!value.__parentname) {
                    $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid]);
                }
            });
        });
    };
    //查找父级组
    $scope.buildParentname = function (node, parentnode) {
        if (node.pid && node.pid != '0') {
            if (!node.__parentname) {
                node.__parentname = parentnode.groupname + '->' + node.groupname;
            } else {
                node.__parentname = parentnode.groupname + '->' + node.__parentname;
            }
            if (parentnode.pid && parentnode.pid!='0') {
                $scope.buildParentname(node, $scope.service.privateDateObj.usergroupData[parentnode.pid]);
            }
        } else {
            if (!node.__parentname) {
                node.__parentname = node.groupname;
            }
        }
    }
    /*
       查询密码数据
   */
    $scope.selectpwd = function () {
        var params = {};
        params['$json'] = true;
        select_proxypassword(params);
    };
    /*
       查询设备组数据
   */
    $scope.selectdevice = function () {
        var params = {};
        params['$json'] = true;
        select_devicegroup(params);
    };
    $scope.selectusergroup();
    $scope.selectpwd();
    $scope.selectdevice();
    //初始化时间插件
    $scope.initDatepiker = function () {
        //给时间戳插件赋值  
        if ($scope.Source.selectItem.invalidtime && $scope.Source.selectItem.invalidtime !== '0' && $scope.Source.selectItem.invalidtime != 'null') {
            var date = new Date($scope.Source.selectItem.invalidtime * 1000);
            $scope.dt = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
        } else {
            var date1 = new Date();
            var date2 = new Date(date1);
            date2.setDate(date1.getDate() +parseInt($scope.Source.privateDateObj.systemsettingData.ruleexpirtime.value));
            $scope.dt = new Date('2' + date2.getYear() - 100, date2.getMonth(), date2.getDate());
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
    };
    $scope.initDatepiker();
    //保存按钮
    $scope.save = function () {      
        var params = {};
       
        var url;
        var num = 0;
        if ($scope.service.Action == 0) {
            url = __URL + 'Eimpasswordrules/Proxypwdrule/add_page_data';
        } else if ($scope.service.Action == 1) {
            url = __URL + 'Eimpasswordrules/Proxypwdrule/update_page_data';
            params['idproxypwdrule'] = $scope.Source.selectItem.idproxypwdrule;//规则id         
        };
        angular.forEach($scope.Source.selectItem, function (value, key) {
            
            if (value&&value.join) {
                value = value.join(',');
            }
            if (value != $scope.service.selectItem[key]) {
                params[key]= value;
                num++;
            }
        });
        if ($scope.dt) {
            //将标准时间转换成时间戳
            if ($scope.dt.getTime) {
                $scope.dt = (Date.parse($scope.dt) / 1000).toFixed(0);
            }          
            if ($scope.dt!=$scope.service.selectItem.invalidtime) {
                params['invalidtime']= $scope.dt;
                num++;
            }
        }
        if (num == 0) {
            layer.msg('您未修改任何内容', { icon: 0 });
            return;
        }
        //$fetchSql
        //params.append('$fetchSql', true);
        dataService.postData(url, params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data > 0) {
                        layer.msg("添加成功", { icon: 6 });
                        $scope.Source.selectItem._kid = data;
                        $scope.Source.selectItem.idproxypwdrule = data;
                        $scope.Source.selectItem.invalidtime = $scope.dt;
                        dataService.addData('proxypwdruleData', $scope.Source.selectItem);
                    } else {
                        layer.msg("添加失败", { icon: 5 });
                    }
                    break;
                case 1:
                    if (data > 0) {
                        layer.msg("编辑成功", { icon: 6 });
                        $scope.Source.selectItem._kid=  $scope.Source.selectItem.idproxypwdrule;
                        dataService.updateData('proxypwdruleData', $scope.Source.selectItem);
                    } else {
                        layer.msg("编辑失败", { icon: 5 });
                    }

                    break;               
            }
            $uibModalInstance.close('ok');
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('detailmodalProxypwdruleController', ["$scope", 'dataService', '$uibModalInstance', function ($scope, dataService, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;   
    /**
      *查询用户组数据
  */
    $scope.selectusergroup = function () {
        var params = {};
        params['$json']= true;
        select_usergroup(params).then(function (res) {
            angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                if (!value.__parentname) {
                    $scope.buildParentname(value,$scope.service.privateDateObj.usergroupData[value.pid]);
                }                
            });
        });
    };
    //查找父级组
    $scope.buildParentname = function (node, parentnode) {
        if (node.pid != 0) {
            if (!node.__parentname) {
                node.__parentname = parentnode.groupname + '->' + node.groupname;
            } else {
                node.__parentname = parentnode.groupname + '->' + node.__parentname;
            }
            if (parentnode.pid && parentnode.pid != '0') {
                $scope.buildParentname(node, $scope.service.privateDateObj.usergroupData[parentnode.pid]);
            }
        } else {
            if (!node.__parentname) {
                node.__parentname = node.groupname;
            }
        }
    }
    /*
       查询密码数据
   */
    $scope.selectpwd = function () {
        var parameter = {};
        parameter['$json']=true;
        select_proxypassword(parameter);
    };
    /*
       查询设备组数据
   */
    $scope.selectdevice = function () {
        var parameter = {};
        parameter['$json'] = true;
        select_devicegroup(parameter);
    };
    $scope.selectusergroup();
    $scope.selectpwd();
    $scope.selectdevice();
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])