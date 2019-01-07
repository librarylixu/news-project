//初始化modal并定义service
appModuleInit(['ui.bootstrap', 'angularFileUpload', 'ui.grid', 'ui.grid.emptyBaseLayer', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.select', 'ui.grid.autoResize', 'ngVerify', 'datePicker', 'ui.select', 'colorpicker.module', 'ngSanitize']);
//主控制器
appModule.controller('completemodelWorkorderController', ['$scope', '$q', 'i18nService', 'dataService', 'uiGridConstants', 'alert', function ($scope, $q, i18nService, dataService, uiGridConstants, alert) {
    _$scope = $scope;
    _$q = $q;
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;

    //
    $scope.Source.isopen = [0, 0, 0, 0, 0];
    $scope.isopen = function (index) {
        angular.forEach($scope.Source.isopen, function (value, key) {
            $scope.Source.isopen[key] = false;
        });
        if (index != undefined) {
            $scope.Source.isopen[index] = true;
        }
    }
    $scope.isopen();
    //时间插件，默认为0
    $scope.dates = { stoday: 0, _stime: 0, etoday: 0, _etime: 0, exendtoday: 0, _exendtime: 0 };
    $scope.toolbars = [
            'fullscreen',
            //文字操作                          
            'bold', //加粗  
            'italic', //斜体
            'underline', //下划线
            'strikethrough', //删除线
            'forecolor', //字体颜色
            'backcolor', //背景色
            'formatmatch', //格式刷
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'insertorderedlist', //有序列表
            'insertunorderedlist', //无序列表               
            //表格
            'inserttable', //插入表格 
            'deletetable', //删除表格
            //其他功能
            'insertcode', //代码语言
            'fontfamily', //字体
            'fontsize', //字号
            'paragraph', //段落格式  
            'template', //模板
            'attachment', //附件 
            'emotion', //表情
            'map', //Baidu地图
            'snapscreen', //截图 
    ];
    //存一份userid
    $scope.service.userid = _userid;
    //定义全局变量ue对象
    var ue;
    /*
        根据当前工单id，去查询工单的信息，如果没有值，service.workorderData为null，否则为对象
    */
    $scope.selectRefWorkorder = function () {
        var params = new URLSearchParams();
        params.append('idworkorder', _id);
        params.append('$find', true);
        params.append('$findall', true);
        select_workorder(params).then(function (res) {
            //初始化配置富文本编辑器 
            ue = UE.getEditor('container_complete', {
                elementPathEnabled: false, //删除元素路径
                wordCount: false,    //删除字数统计
                toolbars: [$scope.toolbars],
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                zIndex: 1
            });
            //等编辑器准备就绪之后，再去查询
            ue.addListener('ready', function (container_complete) {
                $scope.selectMessage();//查询工单内容 - mongo
            });
            //按钮显示控制
            ue.addListener('contentChange', function () {
                var content = UE.getEditor('container_complete').getContent();
                //把内容存到service里面一份
                $scope.service.servicecontent = content;
                if ($scope.service.workorderDataMessage == null) {
                    $scope.service.workorderDataMessage = {};
                    $scope.service.workorderDataMessage.resultdescription = '';
                }
                if (content != $scope.service.workorderDataMessage.resultdescription) {
                    $scope.$applyAsync(function () {
                        $scope.issave = true;
                    });
                } else {
                    $scope.$applyAsync(function () {
                        $scope.issave = false;
                    });
                }
            });
        })
    }
    $scope.selectRefWorkorder();
    //查询结果描述
    $scope.selectMessage = function () {
        var params = new URLSearchParams();
        params.append('workid', $scope.service.workorderData.idworkorder);
        params.append('guid', $scope.service.workorderData.guid);
        select_workorder_message(params).then(function () {
            //加载文本编辑器的初始化内容
            if ($scope.service.workorderDataMessage && $scope.service.workorderDataMessage != null && $scope.service.workorderDataMessage != undefined && $scope.service.workorderDataMessage.resultdescription) {
                ue.setContent($scope.service.workorderDataMessage.resultdescription);
            }
            //防止刷新之后还可以更改
            if ($scope.service.workorderData.status > 1) {
                ue.setDisabled('fullscreen');
            }
        })
    }
    //根据表里userid获取工单创建人/指派人
    $scope.getusername = function (userid) {
        if ($scope.service.usersData != undefined) {
            return $scope.service.usersData[userid].username + ':' + $scope.service.usersData[userid].description;
        }
    }
    //获取所有的状态信息（顺序排列）
    $scope.getstatusname = ['未确认', '进行中', '已解决(<font color="red">待关闭</font>)', '已完成', '已终止'];
    //此处做打开方式的展示
    //更改状态值，数据库存为   0待处理1进行中2终止3已结束
    //num 0 获取html类型字符串/1  获取状态对应的文字
    $scope.getLabelClass = function (status, num) {
        //获取class
        if (num == 0) {
            if (status == "0") {
                $scope.refname = '<span class="label label-warning">' + '未确认' + '</span>';
            } else if (status == "1") {
                $scope.refname = '<span class="label label-default">' + '进行中' + '</span>';
            } else if (status == "2") {
                $scope.refname = '<span class="label label-info">' + '已解决(<font color="red">待关闭</font>)' + '</span>';
            } else if (status == "3") {
                $scope.refname = '<span class="label label-success">' + '已完成' + '</span>';
            } else if (status == "4") {
                $scope.refname = '<span class="label label-danger">' + '已终止' + '</span>';
            } else {
                $scope.refname = '<span class="label label-warning">' + '未确认' + '</span>';
            }
        } else if (num == 1) {
            if (status == "0") {
                $scope.refname = '未确认';
            } else if (status == "1") {
                $scope.refname = '进行中';
            } else if (status == "2") {
                $scope.refname = '已解决(<font color="red">待关闭</font>)';
            } else if (status == "3") {
                $scope.refname = '已完成';
            } else if (status == "4") {
                $scope.refname = '已终止';
            } else {
                $scope.refname = '未确认';
            }
        }
        return $scope.refname;
    }
    //获取此处是在进行哪个步骤的操作
    $scope.changeStatus = function (row) {
        if (row == 4) {
            $scope.Source.Action = 4;
            $scope.service.assignid = $scope.getusername($scope.service.workorderData.assignid);
        }
    }
    //保存
    /*
        type 1:完成工单;2:关闭工单;3:驳回工单
    */
    $scope.save = function (type) {
        $scope.params = new URLSearchParams();
        if(type == 0){
            //保存结果描述
            $scope.url = "Crmschedule/Workordermessage/update_page_data";
            $scope.params.append('workid', $scope.service.workorderData.idworkorder);
            $scope.params.append('guid', $scope.service.workorderData.guid);
            $scope.params.append('resultdescription', UE.getEditor('container_complete').getContent());
        }else if (type == 1) {
            //1:完成工单
            $scope.url = "Crmschedule/Workordermessage/update_page_data";
            $scope.params.append('workid', $scope.service.workorderData.idworkorder);
            $scope.params.append('guid', $scope.service.workorderData.guid);
            $scope.params.append('resultdescription', UE.getEditor('container_complete').getContent());
        } else if (type == 2) {
            //完成工单（改工单状态）
            $scope.url = "Crmschedule/Workorder/update_page_data";
            $scope.params.append('idworkorder', $scope.service.workorderData.idworkorder);
            $scope.params.append('status', 2);
        } else if (type == 3) {
            //关闭工单
            $scope.url = "Crmschedule/Workorder/update_page_data";
            $scope.params.append('idworkorder', $scope.service.workorderData.idworkorder);
            $scope.params.append('status', 3);
        } else if (type == 4) {
            //驳回工单
            $scope.url = "Crmschedule/Workorder/update_page_data";
            $scope.params.append('idworkorder', $scope.service.workorderData.idworkorder);
            $scope.params.append('reject', $scope.Source.reject);
            $scope.params.append('status', 1);
        } else if (type == 5) {
            //终止工单
            $scope.url = "Crmschedule/Workorder/update_page_data";
            $scope.params.append('idworkorder', $scope.service.workorderData.idworkorder);
            $scope.params.append('termination', $scope.Source.termination);
            $scope.params.append('status', 4);
        }
        $scope.Source.postData(__URL + $scope.url, $scope.params).then(function (data) {
            switch (type) {
                case 0:
                    //保存结果描述
                    if (data.ok == 1) {
                        $scope.service.workorderDataMessage.resultdescription = $scope.service.servicecontent;
                        alert.show('结果描述保存成功', '结果描述');
                        break;
                    }
                    alert.show('结果描述保存失败', '结果描述');
                    break;
                case 1:
                    //完成工单操作
                    if (data.ok==1) {
                        //再执行一遍save方法修改一下status
                        $scope.save(2);
                        $scope.service.workorderData.status = 2;
                        $scope.service.workorderDataMessage.resultdescription = $scope.service.servicecontent;
                        ue.setDisabled('fullscreen');
                        alert.show('工单提交成功', '完成工单');
                        break;
                    }
                    alert.show('工单提交失败', '完成工单');
                case 3:
                    //关闭工单操作
                    if (data == 1) {
                        $scope.service.workorderData.status = 3;
                        alert.show('工单已完成', '操作工单');
                        break;
                    }
                    alert.show('工单关闭失败', '操作工单');
                case 4:
                    //驳回工单操作
                    if (data == 1) {
                        $scope.service.workorderData.status = 1;
                        $scope.Source.reject = '';
                        alert.show('工单已驳回', '操作工单');
                        break;
                    }
                    alert.show('工单驳回失败', '操作工单');
                case 5:
                    //终止工单操作
                    if (data == 1) {
                        $scope.service.workorderData.status = 4;
                        $scope.Source.reject = '';
                        alert.show('工单已终止', '操作工单');
                        break;
                    }
                    alert.show('工单终止失败', '操作工单');
            }

        }, function (error) {
            console.log(error);
        });
    }
    //刷新按钮
    $scope.refresh = refresh;
}]);
