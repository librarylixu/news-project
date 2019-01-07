/**
*create by zhangs
*2018-06-01
**/
//初始化module并定义service
appModuleInit(['ui.bootstrap', 'ngVerify',  'ui.select']);
//主控制器
appModule.controller('crmControlBulletinController', ['$scope', '$q', 'dataService', 'ngVerify', function ($scope, $q, dataService, ngVerify) {
    _$scope = $scope;
    _$q = $q;
    $scope.service = dataService;//要显示到页面上的数据源
    //进入到主页直接去初始化百度编辑器
    var ue = UE.getEditor('container', {
        toolbars: [
        ['fontsize', 'map', 'justifyleft', 'justifyright', 'justifycenter', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'inserttable', 'edittable', 'undo', 'redo', 'bold', 'attachment','link']
        ],
        autoHeightEnabled: true,
        autoFloatEnabled: true,
        elementPathEnabled: false,
        wordCount: false,
        topOffset: 138
    });
    /*
        查询公告板（本页面使用）数据
    */
    $scope.select = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_bulletin(params);
    }
  
    //字符串转换为时间戳
    $scope.formatDate = function (time, parameter) {
        return formatDate(time, parameter);
    }
    //获取内容、去除html标签的并且剪到20位
    $scope.getmessage = function (message, num) {
        if (message == undefined) {
            return;
        }
        $scope.oldmessage = message.replace(/<\/?.+?>/g, "");
        $scope.newmessage = $scope.oldmessage.replace(/ /g, "");//dds为得到后的内容
        return $scope.newmessage.substring(0, num);//截取
    }
    //刷新按钮
    $scope.refresh = refresh;
    //模态框要绑定的当前数据源
    $scope.selectItem = {};
    //添加按钮
    $scope.add = function () {
        //新模态框呼出
        $scope.bulletinModal.open();
        $scope.bulletinModal.title = '新建公告';
        if ($scope.Action!=0) {
            $scope.selectItem = {};
            //把富文本编辑器中的内容清空
            ue.setContent("");
        }                        
        $scope.Action = 0;
    }
    //修改按钮
    $scope.updateInfo = function (row) {
        //新模态框呼出
        $scope.bulletinModal.open();
        $scope.bulletinModal.title = '修改公告';
        //如果是重复编辑同一个数据,可以省略一次赋值
        $scope.service.selectItem = row;
        $scope.selectItem = angular.copy(row);
        $scope.Action = 1;
        //在编辑的时候把内容付给文本编辑器
        ue.setContent($scope.service.selectItem.bulletinmessage);
    }
    //删除按钮
    $scope.remove = function (row) {        
        var index = parent.layer.open({
            content: '确认删除公告，是否确认？'
         , btn: ['确认', '我再想想']
         , icon: 6
         , area: ['400px']
         , title: '删除公告信息'
         , yes: function (index, layero) {
             //按钮【按钮一】的回调
             var params = new URLSearchParams();
             params.append('idbulletin', row.idbulletin);
             $scope.service.postData(__URL + 'Crmsetting/Bulletin/del_page_data', params).then(function (data) {
                 if (data) {
                     parent.layer.msg('删除成功', { icon: 1 });
                     row._kid = row.idbulletin;
                     $scope.service.delData('bulletinData', row);
                 }
             });
             parent.layer.close(index);
         }
        });
    }

    //查看详细按钮
    $scope.selectdetailed = function (row) {
        parent.YL.open('eimselectdetailed', {
            title: '公告详情',
            url: __URL + 'Crmsetting/Bulletin/selectdetailed?id=' + row.idbulletin,
        });
        //window.Win10_child.openUrl(__URL + 'Crmsetting/Bulletin/selectdetailed?id=' + row.idbulletin + '&guid=' + row.guid, row.name);
    }
    //tags的数据源 -- 检索使用
    $scope.tagsData = [];
    //查询
    $scope.select();
   
    //模态框
    $scope.bulletinModal = new Canvi({
        content: ".js-canvi-content",
        isDebug: !1,
        navbar: ".bulletinmodaltemplate",
        openButton: ".bulletinmodaltemplatebtn",
        position: "right",
        pushContent: !1,
        speed: "0.5s",
        width: "50vw"
    });  

   
    /*
    保存公告信息  
    */
    $scope.save = function () {
        //点击保存按钮时，把内容获取到
        $scope.selectItem.bulletinmessage = ue.getContent();
        if ($scope.Action == 1) {
            var index = parent.layer.open({
                content: '更新公告信息，是否确认？'
                 , btn: ['确认', '我再想想']
                 , icon: 6
                 , area: ['400px']
                 , title: '更新公告信息'
                 , yes: function (index, layero) {
                     //按钮【按钮一】的回调
                     if ($scope.service.selectItem.bulletinmessage == ue.getContent()) {
                         parent.layer.msg('您未编辑公告内容，请点击取消', { icon: 0 });
                         return;
                     }
                     $scope.privateSavedate();
                     parent.layer.close(index);
                 }
            });
        } else {
            $scope.privateSavedate();
        }
    };

     /*保存数据方法*/
    $scope.privateSavedate = function () {
        var url;
        var params = new URLSearchParams();
        if ($scope.Action == '0') {
            url = __URL + 'Crmsetting/Bulletin/add_page_data';
            params.append('bulletinmessage', $scope.selectItem.bulletinmessage);
        } else if ($scope.Action == '1') {
            url = __URL + 'Crmsetting/Bulletin/update_page_data'
            params.append('idbulletin', $scope.selectItem.idbulletin);
            params.append('bulletinmessage', $scope.selectItem.bulletinmessage);
        }       
        //请求后台
        $scope.service.postData(url, params).then(function (data) {
            if (parseInt(data['id']) > 0 && $scope.Action == 0) {
                    $scope.selectItem.del = 0;
                    $scope.selectItem.index = 0;
                    $scope.selectItem.idbulletin = data['id'];
                    $scope.selectItem.time = data.time.toString();
                    $scope.selectItem.updatetime = 0;
                    $scope.selectItem._kid = data['id'];
                    parent.layer.msg('添加成功', { icon: 1 });
                    //更新数据源
                    $scope.service.addData('bulletinData', $scope.selectItem);
                    //关闭模态框
                    $scope.bulletinModal.close();
                    //清空一下以防再次添加的时候遗留数据
                    //$scope.selectItem = {};
            } else if (data['ok'] > 0 && $scope.Action == 1) {
                    parent.layer.msg('编辑成功', { icon: 1 });
                    $scope.selectItem['_kid'] = $scope.selectItem.idbulletin;
                    $scope.selectItem['updatetime'] = data['updatetime'];
                    //更新数据源
                    $scope.service.updateData('bulletinData', $scope.selectItem);
                    //关闭模态框
                    $scope.bulletinModal.close();
            } else {
                parent.layer.msg('操作失败了', { icon: 0 });
            }
        });
    }
}])

