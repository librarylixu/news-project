/*张赛
2018-04-16
eim账户
*/

angular.module('AceApp')
    .controller('eimUsersController', ['$scope', 'dataService', '$q', function ($scope, dataService, $q) {
        _$scope = $scope;
        _$q = $q;
        $scope.service = dataService;//要显示到页面上的数据源
        /*
            查询用户（本页面使用）数据
        */
        $scope.select = function (flag) {
            var params = new URLSearchParams();
            params.append('$json', true)
            select_user(params).then(function (res) {

                $scope.refselectusergroup();
            });
        }
        //时间戳转换
        $scope.formatDate = function (time) {
            return formatDate(time);
        }
        //获取用户组与之相关联数据      
        $scope.getTypeRefSouce = function () {
            //用户组
            angular.forEach($scope.service.refusergroupData, function (value, key) {
                try {
                    if (!$scope.service.privateDateObj.usersData[value.userid]) {
                        return;
                    }
                    if (!$scope.service.privateDateObj.usersData[value.userid].__refgroupids) {
                        $scope.service.privateDateObj.usersData[value.userid].__refgroupids = [];
                        //{groupid:id_user_group}用来删除关系用的
                        $scope.service.privateDateObj.usersData[value.userid].__refgroupobj = {};
                    }
                    if ($scope.service.privateDateObj.usersData[value.userid].__refgroupids.indexOf(value.groupid) < 0) {
                        $scope.service.privateDateObj.usersData[value.userid].__refgroupids.push(value.groupid);
                        $scope.service.privateDateObj.usersData[value.userid].__refgroupobj[value.groupid] = key;
                    }
                } catch (e) {
                    console.log(e + value.userid);
                }
            });
        };
        //添加按钮
        $scope.add = function () {
            $scope.service.title = '新建用户';
            $scope.service.selectItem = {};
            $scope.modalHtml = 'Crmuser/Users/eim_modal';
            $scope.modalController = 'modaleimUsersController';
            publicControllerAdd($scope);
        }
        //修改按钮
        $scope.updateInfo = function (row) {
            $scope.service.title = "修改用户";
            $scope.modalHtml = 'Crmuser/Users/eim_modal';
            $scope.modalController = 'modaleimUsersController';
            $scope.service.selectItem = row;
            $scope.service.selectItem.mobelphone = $scope.service.selectItem.mobelphone == "undefined" ? '暂无' : $scope.service.selectItem.mobelphone;
            $scope.service.selectItem.emergencyphone = $scope.service.selectItem.emergencyphone == "undefined" ? '暂无' : $scope.service.selectItem.emergencyphone;
            $scope.service.selectItem.homeaddress = $scope.service.selectItem.homeaddress == "undefined" ? '暂无' : $scope.service.selectItem.homeaddress;
            $scope.service.selectItem.pwd = '';
            publicControllerUpdate($scope);
        }
        //删除按钮
        $scope.remove = function (row) {
            var index = layer.open({
                content: '确认删除账号【' + row.description + '】，是否确认？',
                btn: ['确认', '我再想想'],
                icon: 6,
                area: ['400px'],
                title: '删除账号信息',
                yes: function (index, layero) {
                    //按钮【按钮一】的回调
                    var params = new URLSearchParams();
                    params.append('idusers', row.idusers);
                    $scope.service.postData(__URL + 'Crmuser/Users/del_page_data', params).then(function (data) {
                        if (data) {
                            layer.msg('删除成功', { icon: 1 });
                            row._kid = row.idusers;
                            $scope.service.delData('userData', row);

                        }
                    });
                    layer.close(index);
                }
            });
        }

        //关联用户组按钮
        $scope.refusergroup = function (row) {
            $scope.service.title = '关联用户组';
            $scope.modalHtml = 'Crmuser/Users/eim_modal';
            $scope.modalController = 'modaleimUsersController';
            $scope.service.selectItem = row;
            $scope.service.Action = 4;
            publicControllerRef($scope);
        }
        //批量导入按钮
        $scope.uploadfile = function () {
            $scope.service.title = '批量导入';
            $scope.modalHtml = __URL + 'Eimbase/Directive/bacth_import';
            $scope.modalController = 'modaluploadfileController';
            $scope.service.type = 'userlist';
            $scope.service.name = '账号';
            $scope.service.selectItem = '';
            publicControllerAdd($scope);
        }
        /*
        查询与用户组关系数据
        */
        $scope.refselectusergroup = function () {
            var parameter = new URLSearchParams();
            parameter.append('$json', true);
            $scope.service.postData(__URL + 'Crmuser/RefuserRefgroup/select_page_data', parameter).then(function (data) {
                $scope.service.refusergroupData = data;
                select_usergroup(parameter).then(function (data) {
                    angular.forEach($scope.service.privateDateObj.usergroupData, function (value, key) {
                        if (!value.__parentname) {
                            $scope.buildParentname(value, $scope.service.privateDateObj.usergroupData[value.pid]);
                        }
                    });
                    $scope.getTypeRefSouce();
                });
            });
        }
        //查找父级组
        $scope.buildParentname = function (node, parentnode) {
            if (node.pid && node.pid != '0') {
                if (!node.__parentname) {
                    node.__parentname = parentnode.groupname;
                } else {
                    node.__parentname = parentnode.groupname + '->' + node.__parentname;
                }
                if (parentnode.pid && parentnode.pid != '0') {
                    $scope.buildParentname(node, $scope.service.privateDateObj.usergroupData[parentnode.pid]);
                }
            } else {
                if (!node.__parentname) {
                    node.__parentname = '';
                }
            }
        }
        //页面加载完成后，查询数据
        $scope.select();
    }])
 .controller('modaleimUsersController', ["$scope", "$uibModalInstance", 'dataService', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, $timeout, ngVerify) {
     $scope.Source = angular.copy(dataService);
     $scope.service = dataService;
     $scope.url = __URL;
     switch ($scope.Source.Action) {
         case 0:
             $scope.url += 'Crmuser/Users/add_page_data';
             break;
         case 1:
             $scope.url += 'Crmuser/Users/update_page_data';
             break;
         case 4:
             break;
         default:
             layer.msg('Action Error!', { icon: 0 });
             break;
     }
     //保存用户组关系
     $scope.savegroup = function () {

         angular.forEach($scope.Source.selectItem.__refgroupids, function (value) {
             if (!$scope.service.selectItem[value]) {
                 $scope.url = __URL + 'Crmuser/RefuserRefgroup/add_page_data';
                 var params = new URLSearchParams();
                 params.append('groupid', value);
                 params.append('userid', $scope.Source.selectItem.idusers);
                 //保存方法
                 $scope.saveData($scope.url, params, 0, value);
             }
         });
         angular.forEach($scope.service.selectItem.__refgroupids, function (value) {
             var params = new URLSearchParams();
             if ($scope.Source.selectItem.__refgroupids.indexOf(value) < 0) {
                 if ($scope.Source.selectItem.__refgroupobj[value]) {
                     params.append("idref_user_group", $scope.Source.selectItem.__refgroupobj[value]);
                     $scope.url = __URL + 'Crmuser/RefuserRefgroup/delete_page_data';
                     //保存方法
                     $scope.saveData($scope.url, params, 1, value, $scope.Source.selectItem.__refgroupobj[value]);
                 }
             }
         });
     }
     /*
     保存信息
     */
     $scope.save = function () {
         $scope.params = new URLSearchParams();
         if ($scope.Source.Action == 1) {
             $scope.params.append('idusers', $scope.Source.selectItem.idusers);
         }
         angular.forEach($scope.Source.selectItem, function (value, key) {
             if (key.indeOf('__') < 0 && value != $scope.Source.selectItem[key]) {
                 $scope.params.append(key, value);
             }
         });
         //此处进行额外判断:是否数据库中有重复得用户
         for (var i = 0; i < $scope.service.privateDateObj.usersData.length; i++) {
             if ($scope.service.privateDateObj.usersData[i].username == $scope.Source.selectItem['username'] && $scope.Source.Action == 0) {
                 //添加失败,该用户以存在
                 layer.msg('添加失败,该用户[' + $scope.Source.selectItem['username'] + ']已存在', { icon: 6 });
                 return;
             }
         }
         $scope.Source.postData(url, params).then(function (data) {
             switch ($scope.Source.Action) {
                 case 0:
                     if (data == undefined) {
                         //添加失败
                         layer.msg('添加账号失败', { icon: 5 })
                         break;
                     }
                     $scope.Source.selectItem._kid = data;
                     $scope.Source.selectItem.idusers = data;
                     $scope.Source.selectItem.createtime = (Date.parse(new Date()) / 1000).toFixed(0);
                     //更新service数据源
                     dataService.addData('usersData', $scope.Source.selectItem);
                     $uibModalInstance.close('ok');
                     layer.msg('添加账号成功', { icon: 6 });
                 case 1:
                     if (data > 0) {
                         //修改成功   
                         $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                         dataService.updateData('usersData', $scope.Source.selectItem);
                         $uibModalInstance.close('ok');
                         layer.msg('修改账号成功', { icon: 6 });
                         break;
                     }
                     //修改失败
                     layer.msg('修改账号失败', { icon: 5 });
                     break;
             }
         }, function (error) {
             console.log(error);
         });

     };
     //保存到后台的方法
     $scope.saveData = function (url, params, action, value, refid) {
         $scope.Source.postData(url, params).then(function (data) {
             if (data > 0) {
                 //修改成功  
                 if (action == 0) {
                     if (!$scope.Source.selectItem.__refgroupobj) {
                         $scope.Source.selectItem.__refgroupobj = {};
                     }
                     $scope.Source.selectItem.__refgroupobj[value] = data;
                     $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                     $scope.service.updateData('usersData', $scope.Source.selectItem);
                     $scope.service.addData('refusergroupData', { _kid: data, idref_user_group: data, groupid: value, userid: $scope.Source.selectItem.idusers });
                     $uibModalInstance.close('ok');
                     layer.msg('用户组关系添加成功', { icon: 6 });
                 } else {
                     delete $scope.Source.selectItem.__refgroupobj[value];
                     $scope.Source.selectItem._kid = $scope.Source.selectItem.idusers;
                     $scope.service.updateData('usersData', $scope.Source.selectItem);
                     $scope.service.delData('refusergroupData', { _kid: refid, idref_user_group: refid, groupid: value, userid: $scope.Source.selectItem.idusers });
                     $uibModalInstance.close('ok');
                     layer.msg('用户组关系删除成功', { icon: 6 });
                 }
                 return;
             }
             //修改失败
             layer.msg('关系修改失败', { icon: 5 });

         }, function (error) {
             console.log(error);
         });
     }
     //取消按钮
     $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
     };
 }])
    .controller('modaluploadfileController', ['$scope', 'dataService', "$uibModalInstance", 'FileUploader', function ($scope, dataService, $uibModalInstance, FileUploader) {
        $scope.service = dataService;
        $scope.uploadStatus = false; //定义两个上传后返回的状态，成功获失败
        $scope.fileid = "";
        var uploader = $scope.uploader = new FileUploader({
            url: __URL + 'Eimbase/Batchimport/fecth_import_users',
            queueLimit: 1,     //文件个数 
            removeAfterUpload: true   //上传后删除文件
        });

        $scope.clearItems = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
            uploader.clearQueue();
        }

        uploader.onAfterAddingFile = function (fileItem) {
            $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.status) {
                $scope.uploadStatus = true;   //上传成功则把状态改为true
                $scope.service.path = response.path;
            } else {
                $scope.uploadStatus = false;
            }

        };

        $scope.UploadFile = function () {
            uploader.uploadAll();
        }
        $scope.preview = function () {
            $scope.cancel();
        
            $scope.service.title = '查看预览';
            var url = __URL + 'Crmuser/Users/preview';
            $scope.service.openModal(url, 'userspreviewController');
           
        }
        //模板下载 
        $scope.UploadTemplate = function () {
            window.open(__URL + 'Crmsetting/Annex/downLoadtemplate?name=' + $scope.service.type);           
        }
        //取消按钮
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])    
    .controller('userspreviewController', ['$scope', 'dataService','$q', function ($scope, dataService,$q) {
        $scope.service = dataService;//要显示到页面上的数据源   
        $scope.userpreviewsData = [];       
    $scope.select = function () {
        var params = {};
        params.fileid=$scope.service.path;
        dataService.postData(__URL + 'Eimbase/Batchimport/readExcel', params).then(function (data) {
            var keyName = data.value[0];
            angular.forEach(data.value, function (value, key) {
                if (key >0&&value[0]) {
                    var simpleData = {};
                    angular.forEach(keyName, function (val, k) {
                        simpleData[val] = value[k];
                    });
                    $scope.userpreviewsData.push(simpleData);
                }               
            });
            var model = document.getElementById('previewUser').parentNode;
            model.style.marginLeft = '-200px';
            model.style.marginRight = '-200px';

        }, function (error) {
            console.log(error);
        });
    }

    //保存选项按钮
    //type  0表示保存所有数据 1表示保存选中的数据
    $scope.save = function (type, rowData) {
        //已选数据
        var currentSelection = [];
        if (type == 0) {
            //循环添加所有数据数据库
            for (var i = 0; i < $scope.userpreviewsData.length; i++) {
                $scope.addUser($scope.userpreviewsData[i]);
            }
        } else if (type == 1) {
            if ($scope.userpreviewsData.length == 0) {
                layer.msg('没选择任何数据', {icon:0});
            }
            //循环添加所有数据数据库
            for (var i = 0; i < $scope.userpreviewsData.length; i++) {
                $scope.addUser($scope.userpreviewsData[i]);
            }

        } else if (type == 2) {

            $scope.addUser(rowData, 2);
        }
        console.log($scope.userpreviewsData);

    }

    $scope.addUser = function (user, type) {
        var params = new URLSearchParams();
        //组建每条数据的参数
        angular.forEach(user, function (value, key) {
            if (key == 'createtime') {
                return;
            }
            params.append(key, value);
        });
        dataService.postData(__URL + "Crmuser/Users/add_page_data", params).then(function (data) {
            //当添加失败时，
            if (data < 0) {
                errData.push(user);
                console.log(user);
                return;
            } else if (data > 0) {
                user.idusers = data;
                if (type == 2) {
                    layer.msg('添加成功', { icon: 6 });
                }
            }

        }, function (error) {
            console.log(error);
        });
    }

    //页面加载完成后，查询数据
    $scope.select();
    //取消按钮
    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
}]);
