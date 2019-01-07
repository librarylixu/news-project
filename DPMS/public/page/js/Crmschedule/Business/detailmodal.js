//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'ngSanitize', 'textAngular', 'ui.select']);
appModule.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        taOptions.toolbar[0].splice(3);
        taOptions.toolbar[3] = [];
        return taOptions;
    }]);
});
//主控制器
appModule.controller('detailBusinessController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //存一份userid
    $scope.service.userid = _userid;
    //取工单
    $scope.businessData = $scope.service.privateDateObj.businessData[_id] ? $scope.service.privateDateObj.businessData[_id] : $scope.service.privateDateObj.closebusinessData[_id];
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('tailedcontainer', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false
    });

    //给提交等按钮一个状态
    $scope.disabled = true;
    //进入到详细页隐藏编辑器，当只有点击了编辑按钮的时候才会显示编辑器
    ue.ready(function (editor) {
        ue.setHide();
    });
    //详细页点击编辑按钮
    $scope.changeupdate = function () {
        ue.setShow();//显示编辑器
        //给提交等按钮一个状态
        $scope.disabled = false;
        //把结果描述内容付给编辑器,必须保证不能时null或undefined之类
        if ($scope.businessDataMessage.message) {
            ue.setContent($scope.businessDataMessage.message);
        }
    }
    //控制当编辑器中有值的时候，隐藏掉关闭按钮 contentchange true显示/false隐藏
    $scope.contentchange = true;
    ue.addListener("contentChange", function (editor,a,b) {
        $scope.$apply(function () {
            $scope.contentchange = true;
            if ($scope.businessDataMessage.message != ue.getContent()) {
                $scope.contentchange = false;
            }
        })
    });
    //详细页点击关闭按钮
    $scope.changeremove = function () {
        ue.setHide();//隐藏编辑器
        //给提交等按钮一个状态
        $scope.disabled = true;
    }
    //出差报告数据初始化
    $scope.businessDataMessage = {};
    //查询出差报告
    $scope.selectBusinessmessage = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        params.append('businessid', $scope.businessData.idbusiness);
        select_business_message(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            if (data) {
                $scope.businessDataMessage.message = data.message;
            }
        })
    }
    $scope.selectBusinessmessage();
    //查询联系人数据
    $scope.contactData = [];
    $scope.selectContact = function () {
        if ($scope.businessData.refcontactid && $scope.businessData.refcontactid.split) {
            $scope.businessData.refcontactid = $scope.businessData.refcontactid.split(',');
        }
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customer_contact(params).then(function (data) {
            //组建没有访问权限的联系人的id----向后台请求时使用
            var norefcontact = [];
            angular.forEach($scope.businessData.refcontactid, function (value) {
                if ($scope.service.privateDateObj.contactData[value]) {
                    //缓存区--自己权限的数据
                    $scope.contactData.push($scope.service.privateDateObj.contactData[value]);
                } else if ($scope.service.privateDateObj.tempcontactData[value]) {
                    //临时缓存区--权限以外的数据
                    $scope.contactData.push($scope.service.privateDateObj.tempcontactData[value]);
                } else {
                    //进入到这里说明两个缓存区都没有要的值，需要去数据库查询了。
                    norefcontact.push(value);
                }
            });
            if (norefcontact.length > 0) {
                //去后台拿
                var params = new URLSearchParams();
                params.append('idcontact', norefcontact.join(','));
                params.append('$findall', true);
                params.append('$findinset', true);
                select_customer_contact(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                    angular.forEach(data, function (value) {
                        //把得到的值放到临时缓存区里面
                        $scope.service.privateDateObj.tempcontactData[value.idcontact] = value;
                    });
                    //对象合并
                    $scope.contactData = $scope.contactData.concat(data);
                });
            }
        });
    }
    $scope.selectContact();
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
    //保存出差报告
    $scope.saveResultdescription = function () {
        //点击保存时去把结果内容get到
        $scope.businessDataMessage.message = ue.getContent();
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Businessmessage/update_page_data";
        params.append('idbusiness', $scope.businessData.idbusiness);
        params.append('guid', $scope.businessData.guid);
        params.append('message', $scope.businessDataMessage.message ? $scope.businessDataMessage.message : '');
        $scope.service.postData(url, params).then(function (data) {
            // console.log(data);
            if(data.ok){
                parent.layer.msg('保存成功', { icon: 6 });
                //隐藏编辑器，让文字出来。
                ue.setHide();//显示编辑器
                //给提交等按钮一个状态
                $scope.disabled = true;
            }

        }, function (error) {
            console.log(error);
        });
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
    //保存出差报告
    $scope.alertUpload = function (item) {
        var index = parent.layer.open({
            content: '确认提交《' + $scope.businessData.name + '》出差报告，提交后不可对出差报告进行编辑，是否确认？'
           , btn: ['确认提交', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '提交报告'
           , yes: function (index, layero) {
               $scope.service.datatype = '6';
               if (item == 1) {
                   $scope.saveResultdescription();
               }
               //完成出差操作
               $scope.completebusiness();
               parent.layer.close(index);
           }
        });
    }
    //完成出差
    $scope.completebusiness = function(){
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Business/update_page_data";
        params.append('idbusiness', $scope.businessData.idbusiness);
        params.append('status', 3);
        params.append('endtime', (new Date().getTime() / 1000).toFixed(0));
        //更新数据源
        $scope.selectItem = {};
        $scope.selectItem.status = 3;
        $scope.businessData.status = 3;
        dataService.updateData('businessArrData', $scope.selectItem);
        $scope.service.privateDateObj.businessData[$scope.businessData.idbusiness].status = $scope.selectItem.status;
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                parent.layer.msg('修改成功', { icon: 1 });
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //模态框
    $scope.approvalModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".approvalmodaltemplate",
        openButton: ".approvaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "45vw"
    });
    //审批出差
    $scope.alertConfirm = function (item) {
        $scope.approvalModal.open();
        $scope.approvalModal.title = '出差审批';
        $scope.Action = 1;
        $scope.service.selectItem = item;
        $scope.selectItem = angular.copy(item);
    }
    //修改出差状态
    $scope.save = function (idbusiness) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Business/update_page_data";
        params.append('idbusiness', idbusiness);
        params.append('status', $scope.selectItem.status);
        params.append('statusmark', $scope.selectItem.statusmark ? $scope.selectItem.statusmark : "");
        params.append('approvaltime', (new Date().getTime() / 1000).toFixed(0));
       
        $scope.service.postData(url, params).then(function (data) {

            if (data > 0) {
                //更新数据源
                $scope.service.privateDateObj.businessData[idbusiness] = angular.copy($scope.selectItem);

                dataService.updateData('businessArrData', $scope.selectItem);
                parent.layer.msg('修改成功', { icon: 1 });
                //关闭模态框
                $scope.approvalModal.close();
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }

}]);