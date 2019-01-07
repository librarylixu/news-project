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
appModule.controller('detailWorkorderController', ['$scope', '$q', 'dataService', 'textAngularManager', function ($scope, $q, dataService, textAngularManager) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //存一份userid
    $scope.service.userid = _userid;
    //取工单
    $scope.workorderData = $scope.service.privateDateObj.workorderData.data[_id] ? $scope.service.privateDateObj.workorderData.data[_id] : $scope.service.privateDateObj.workordercloseData[_id];
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('tailedcontainer', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
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
        if ($scope.workorderDataMessage.resultdescription) {
            ue.setContent($scope.workorderDataMessage.resultdescription);
        }
    }
    //控制当编辑器中有值的时候，隐藏掉关闭按钮 contentchange true显示/false隐藏
    $scope.contentchange = true;
    ue.addListener("contentChange", function (editor,a,b) {
        $scope.$apply(function () {
            $scope.contentchange = true;
            if ($scope.workorderDataMessage.resultdescription != ue.getContent()) {
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
    //原因描述数据和结果描述数据初始化
    $scope.workorderDataMessage = {};
    //查询联系人数据
    $scope.contactData = [];
    $scope.selectContact = function () {
        if ($scope.workorderData.refcontactid && $scope.workorderData.refcontactid.split) {
            $scope.workorderData.refcontactid = $scope.workorderData.refcontactid.split(',');
        }
        var params = new URLSearchParams();
        params.append('$json', true);
        select_customer_contact(params).then(function (data) {
            //组建没有访问权限的联系人的id----向后台请求时使用
            var norefcontact = [];
            angular.forEach($scope.workorderData.refcontactid, function (value) {
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
    //查询历史记录（详细页）
    $scope.selecthistoricallog = function () {
        var params = new URLSearchParams();
        params.append('type', 'workorder');
        params.append('refid', _id);
        //status = 1 强制查询
        select_historicallog(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
            $scope.service.privateDateObj.historicallogData = data;
            //查询联系人
            $scope.selectContact();
        });
    }
    //查询原因描述/结果描述
    $scope.selectMessage = function () {
        //检测缓存中是否已经存在了
        var isworkdata = true;
        if ($scope.service.privateDateObj.workorderDataMessage) {
            angular.forEach($scope.service.privateDateObj.workorderDataMessage, function (value) {
                if (value.workid == _id) {
                    //说明数据源中已经存在了，不需要去数据库中取了
                    isworkdata = false;
                }
            })
        }
        //说明数据库里没有，还要去查询
        if (isworkdata) {
            var params = new URLSearchParams();
            params.append('workid', _id);
            params.append('guid', $scope.workorderData.guid);
            select_workorder_message(params, { 'index': 'returndata', 'status': 1 }).then(function (data) {
                if(data){
                    $scope.workorderDataMessage = data[0];
                }
            });
        }
        //查询历史记录
        $scope.selecthistoricallog();
    }
    //查询原因描述
    $scope.selectMessage();
    //时间戳转换
    $scope.formatDate = function (time, T) {
        if (time == 0 || isNaN(time)) {
            return "暂无时间";
        }
        return formatDate(time, T);
    }
    //保存结果描述
    $scope.saveResultdescription = function () {
        //点击保存时去把结果内容get到
        $scope.workorderDataMessage.resultdescription = ue.getContent();
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Workordermessage/update_page_data";
        params.append('workid', _id);
        params.append('guid', $scope.workorderData.guid);
        params.append('resultdescription', $scope.workorderDataMessage.resultdescription ? $scope.workorderDataMessage.resultdescription : '');
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

    //配置模态框
    $scope.workerorderModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".workerordermodaltemplate",
        openButton: ".workerordertemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "30vw"
    });
    //确认工单
    $scope.alertConfirm = function (item) {
        var index = parent.layer.open({
            content: '确认由我去完成《' + $scope.workorderData.title + '》工单，是否确认？'
           , btn: ['确认', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '确认工单'
           , yes: function (index, layero) {
               //按钮【按钮一】的回调
               $scope.service.datatype = '5';
               $scope.saveHistrylogResult(1);
               parent.layer.close(index);
           }
        });
    }
    //提交工单
    $scope.alertUpload = function (item) {
        var index = parent.layer.open({
            content: '确认提交《' + $scope.workorderData.title + '》工单，提交后不可对工单结果进行编辑，是否确认？'
           , btn: ['确认提交', '我再想想']
           , icon: 6
           , area: ['400px']
           , title: '提交工单'
           , yes: function (index, layero) {
               $scope.service.datatype = '6';
               if (item == 1) {
                   $scope.saveResultdescription();
               }
               $scope.saveHistrylogResult(2);
               parent.layer.close(index);
           }
        });
    }
    //结束工单
    $scope.alertOver = function (item) {
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '结束工单';
        $scope.service.datatype = '4';
        $scope.service.placeholder = '请对我的工作做一个评价吧！^_^...';
        $scope.mark = '';
    }
    //改派工单
    $scope.alertOther = function (item) {
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '改派工单';
        $scope.service.datatype = '1';
        $scope.service.placeholder = '请填写改派原因... ';
        $scope.mark = '';
    }
    //中止工单
    $scope.alertStop = function (item) {
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '中止工单';
        $scope.service.datatype = '3';
        $scope.service.placeholder = '请填写中止原因... ';
        $scope.mark = '';
    }
    //驳回工单
    $scope.alertBack = function (item) {
        $scope.workerorderModal.open();
        $scope.workerorderModal.title = '驳回工单';
        $scope.service.datatype = '2';
        $scope.service.placeholder = '请填写驳回原因... ';
        $scope.mark = '';
    }
    //组件保存信息
    $scope.saveHistrylogResult = function (status) {
        $scope.disabled = true;
        $scope.save(status).then(function (data) {
            //修改失败了
            if (!data) {
                parent.layer.msg('您的数据已过期，请刷新页面后再更改', { icon: 1 });
                return;
            }
            //修改状态成功了可以继续下一步操作了
            $scope.workorderData.status = status;
            if ($scope.service.assign) {
                $scope.workorderData.assignid = $scope.service.assign;
            }
            $scope.saveHistrylogData($scope.workorderData.idworkorder).then(function (data) {
                //说明全部都修改成功了
                if (data) {
                    //关闭模态框
                    $scope.workerorderModal.close();
                    $scope.service.privateDateObj.historicallogData.push({ orderid: $scope.workorderData.idworkorder, text: $scope.mark, datatype: $scope.service.datatype, userid: $scope.service.userid, time: ((new Date()).getTime() / 1000).toFixed(0) });
                }
            });
        });
    }

    //保存历史记录
    $scope.saveHistrylogData = function (orderid) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmsetting/Historicallog/insert_page_data";
        params.append('refid', orderid);
        params.append('text', $scope.mark ? $scope.mark : '');
        //数据类型,如果是工单的话 0正常数据操作日志 1改派他人日志 2工单驳回日志 3工单中止日志 4工单结单日志
        params.append('datatype', $scope.service.datatype);
        params.append('type', 'workorder');
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                //处理正常结果
                defer.resolve(data);
            } else {
                parent.layer.msg('评价失败', { icon: 2 });
                //处理异常结果
                defer.reject(data);
            }
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
    //修改工单状态
    $scope.save = function (status) {
        var defer = $q.defer();//延迟处理
        var params = new URLSearchParams();
        var url = __URL + "Crmschedule/Workorder/update_page_data";
        params.append('idworkorder', $scope.workorderData.idworkorder);
        params.append('status', status);
        if ($scope.service.assign) {
            params.append('assignid', $scope.service.assign);
        }
        params.append('updatetime', (new Date().getTime() / 1000).toFixed(0));
        $scope.service.postData(url, params).then(function (data) {
            if (data > 0) {
                if (status == 0 && $scope.service.assign) {
                    parent.layer.msg('改派成功', { icon: 1 });
                }else if(status == 4){
                    parent.layer.msg('工单已中止', { icon: 1 });
                }else if(status == 3){
                    parent.layer.msg('结单成功', { icon: 1 });
                } else if (status == 1) {
                    parent.layer.msg('确认成功', { icon: 1 });
                }
                //这里需要做个判断如果创建人和执行人是一个人的话那就不用发了
                if ($scope.service.userid != $scope.workorderData.assignid || $scope.workorderData.refusers) {
                    //调用发送邮件方法   
                    workorder_mail($scope.workorderData.idworkorder);
                }
            }
            //处理正常结果
            defer.resolve(data);
        }, function (error) {
            console.log(error);
        });
        return defer.promise;
    }
}]);