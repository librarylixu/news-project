//初始化modal并定义service
angular.module('AceApp')  
    //托管密码主控制器
.controller('eimProxypasswordController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
    $scope.service = dataService;//要显示到页面上的数据源
    _$scope = $scope;
    _$q = $q;

    /*
        查询密码数据
    */
    $scope.select = function (flag) {
        var params = {};
        params['$json'] = true;
        select_proxypassword(params).then(function (res) {
            layer.msg('数据已刷新', { icon: 6 });
            //查询用户数据
            $scope.selectuser();
        });
    }
    /*
    查询用户数据
    */
    $scope.selectuser = function () {
        var params = {};
        params['$json'] = true;
        select_user(params).then(function (res) {
        })
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time,T) {
        return formatDate(time,T);
    }
    //改变状态
    $scope.changeStatus = function (node) {
        var statusName = '';
        statusName = node.status == 0 ? '禁用' : '启用';
        var index = layer.open({
            content: '请确认是否' + statusName + '账号？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['400px'],
            title: '修改状态',
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var params = {};
                params['idproxypassword'] = node.idproxypassword;
                params['status'] = node.status == 0 ? 1 : 0;
                $scope.service.postData(__URL + 'Eimpasswordrules/Proxypassword/update_page_data', params).then(function (data) {
                    if (data) {
                        layer.msg('切换状态成功', { icon: 1 });
                        node._kid = node.idproxypassword;
                        node.status = node.status == 0 ? 1 : 0;
                        $scope.service.updateData('proxypasswordData', node);
                    }
                });
                layer.close(index);
            }
        });
    }
    //添加按钮
    $scope.add = function (node) {
        $scope.service.selectItem = '';
        $scope.service.title = '新增托管账号';
        $scope.modalHtml = 'Eimpasswordrules/Proxypassword/openmodal';
        $scope.modalController = 'modalProxypasswordController';
        if (node != undefined) {
            $scope.service.selectItem = node;
        }
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (node) {
        $scope.service.title = "编辑托管账号";
        $scope.modalHtml ='Eimpasswordrules/Proxypassword/openmodal';
        $scope.modalController = 'modalProxypasswordController';
        $scope.service.selectItem = node;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (row) {
        var index = layer.open({
            content: '确认删除托管账号【' + row.login + '】，是否确认？'
         , btn: ['确认', '我再想想']
         , icon: 6
         , area: ['400px']
         , title: '删除托管账号'
         , yes: function (index, layero) {
             //按钮【按钮一】的回调
             var params = {};
             params['idproxypassword']= row.idproxypassword;
             $scope.service.postData(__URL + 'Eimpasswordrules/Proxypassword/del_page_data', params).then(function (data) {
                 if (data) {
                     layer.msg('删除成功', { icon: 1 });
                     row._kid = row.idproxypassword;
                     $scope.service.delData('proxypasswordData', row);
                 }
             });
            layer.close(index);
         }
        });
    }

    //添加设备密码规则
    $scope.addPasswordrule = function (item) {
        $scope.service.title = '添加设备密码规则';
        $scope.modalHtml = __URL + 'Eimpasswordrules/Proxypwdrule/openmodal';
        $scope.modalController = 'modalProxypwdruleController';
        $scope.service.ref = undefined;
        $scope.service.selectItem = {};
        $scope.service.pwdData = item;
        publicControllerAdd($scope);
    }
    //页面加载完成后，查询数据
    $scope.select(0);
}])
  // 托管密码的模态框
.controller('modalProxypasswordController', ["$scope", "$uibModalInstance", 'dataService', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //如果是修改不显示密码
    if ($scope.Source.Action == 1) {
        $scope.Source.selectItem.pwd = '';
    }
    /*
    保存信息
    status 0一次添加 1连续添加 不关闭窗口 2删除  3 用户和用户角色cheked改变状态保存
    */
    $scope.save = function (status, refdata) {
        var params = {};
        var num = 0;
        var  url = __URL + 'Eimpasswordrules/Proxypassword/add_page_data';
        if ($scope.Source.Action == 1) {
            params['idproxypassword']= $scope.Source.selectItem.idproxypassword;
            url = __URL + 'Eimpasswordrules/Proxypassword/update_page_data';
        }
        angular.forEach($scope.Source.selectItem,function(value,key){
            if (key.indexOf("__")<0&& value!=$scope.service.selectItem[key]) {
                params[key]=value;
                num++;
            }
        });
        if (num == 0) {
            layer.msg('您未修改任何内容', { icon: 0 });
        }
        $scope.Source.postData(url,  params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data['id']) {
                        $scope.Source.selectItem.createtime = data['createtime'];
                        $scope.Source.selectItem.updatetime = 0;
                        $scope.Source.selectItem.createuserid = $scope.service.userid;                  
                        $uibModalInstance.close('ok');
                        $scope.Source.selectItem._kid = data.id;
                        $scope.Source.selectItem.idproxypassword = data.id;
                        dataService.addData('proxypasswordData', $scope.Source.selectItem);
                        layer.msg('添加成功', { icon: 6 });    
                       
                        break;
                    }
                    //添加失败
                    layer.msg('添加失败', { icon: 5 });              
                    break;
                case 1:
                    if (data > 0) {
                        //修改成功 
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproxypassword;
                        $scope.Source.selectItem.updatetime = new Date();
                        dataService.updateData('proxypasswordData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        layer.msg('修改成功', { icon: 6 });
                        break;
                    }
                    //修改失败
                    layer.msg('修改失败', { icon: 5 });
                    break;              
            }
        }, function (error) {
            console.log(error);
        });
    };
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])