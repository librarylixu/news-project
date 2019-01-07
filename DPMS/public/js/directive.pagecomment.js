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
     自定义评论框指令
     */
appModule.directive('pageComment', function () {
    return {
        restrict: 'ECAM',
        templateUrl: __URL + 'Crmbase/Baseinfo/pageComment',
        replace: true,
        controller: function ($scope, $location) {
            //$scope.submitBtn = false;
            //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
            var _toolBars = [
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
            //该链接表示页面的唯一标识
            var _UrlString = $location.absUrl();
            var pageIndex = _UrlString.indexOf('?');
            var __GUID;
            var pageId;
            var datauserId;
            if (pageIndex > 0) {
                var pageParams = _UrlString.substr(pageIndex + 1);
                _pageId = parseInt(pageParams.split('&')[0].split('=')[1]);
                __GUID =pageParams.split('&')[1].split('=')[1];
                datauserId = parseInt(pageParams.split('&')[2].split('=')[1]);
            }
            //查询当前页面的评论清单
            $scope.selectPageCommentlist = function () {
                var param = new URLSearchParams();
                param.append('guid', __GUID);
                param.append('dataid', _pageId);
                $scope.service.postData(__URL + 'Crmhistorymessageboard/Historymessageboard/select_page_data', param).then(function (data) {
                    //该页面的评论数据
                   
                    $scope.service.pageCommentList = data;

                }, function (error) {
                    console.log(error);
                });
            }
            $scope.selectPageCommentlist();
           
            /*清空编辑器中的内容                    
            */
            $scope.EditorClearHtml = function () {
                UE.getEditor('container').setContent('', false);
            }
            //实例化编辑器
            //通过设置前端配置项，定制编辑器的特性，配置方法主要通过修改ueditor.config.js，另外在编辑器实例化的时候也可以传入配置参数
            $scope._ueConfig = {
                elementPathEnabled: false, //删除元素路径
                wordCount: false,    //删除字数统计
                autoHeight: false,
                toolbars: [_toolBars],
                autoHeightEnabled: true,
                autoFloatEnabled: true

            };
            //创建评论插件
            $scope.ue = UE.getEditor('container', $scope._ueConfig);
            //placeholder内容(只能是文本内容)
            //$scope.ue.placeholder("请发表您的留言！");
            //按钮显示控制
            $scope.ue.addListener('contentChange', function () {
                var content = UE.getEditor('container').getContent();
                if (content.replace(' ', '').length > 0) {
                    $scope.$applyAsync(function () {
                        $scope.submitBtn = true;
                    });
                } else {
                    $scope.$applyAsync(function () {
                        $scope.submitBtn = false;
                    });
                }
            });
            /*给页面追加评论*/
            $scope.addPageCommentlist = function () {
                var content = UE.getEditor('container').getContent();
                if (content == null || content == "" || content == undefined) {
                    return;
                }
                var param = {};
                param['content'] = content;
                param['guid'] = __GUID;
                param['dataid'] = _pageId;
                param['datauserid'] = datauserId;
                param['haveread'] = '1';
                param.appid = __APPID;
                $scope.service.postData(__URL + 'Crmhistorymessageboard/Historymessageboard/insert_page_data', param).then(function (data) {
                    if (data == 0) {
                        //失败了
                        parent.layer.msg('保存失败', { icon: 0 });
                    } else {
                        $scope.service.pageCommentList.push(data);
                        $scope.EditorClearHtml();
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            // UE.contentChange();        

            /*
            创建一个回复编辑器
            */
            $scope.EditorCreateEditor = function (msg) {
                if (msg.childcommandshow == undefined) {
                    UE.getEditor(msg._id, $scope._ueConfig);
                } else {
                    UE.getEditor(msg._id).setShow();
                }
                msg.childcommandshow = true;
            }
            /*
            销毁回复编辑器
            */
            $scope.EditorCreateCloseEditor = function (msg) {
                // UE.getEditor(msg._id).destroy();
                UE.getEditor(msg._id).setHide();
                msg.childcommandshow = false;
            }

            /*
            保存回复编辑器中的内容
            */
            $scope.EditorCreateSaveEditor = function (msg) {
                var param = {};
                var childData = { 'guid': __GUID, dataid: _pageId, datauserid: datauserId, haveread: '1', content: UE.getEditor(msg._id).getContent(), respondentname: msg.username,appid: __APPID };
                if (!msg.child) {
                    msg.child = [];
                   
                }
               var newChild= angular.copy(msg.child);
                param._id = msg._id;
                newChild.push(childData);
                param.child = JSON.stringify(newChild);
                $scope.service.postData(__URL + 'Crmhistorymessageboard/Historymessageboard/reply_content_page_data', param).then(function (data) {
                    if (data == 'no') {
                        //失败了
                        parent.layer.msg('保存失败', { icon: 0 });
                    } else {
                        // console.log(data);
                        childData['time'] = data;
                        childData['username'] = _DESCRIPTION;
                        msg.child.push(childData);
                        //清空内容
                        UE.getEditor(msg._id).setContent('', false);
                        //删除评论组件
                        $scope.EditorCreateCloseEditor(msg);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            
        },
    }
});