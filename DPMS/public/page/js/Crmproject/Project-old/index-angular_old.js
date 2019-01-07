appModuleInit(['ui.bootstrap', 'ui.grid', 'ui.grid.emptyBaseLayer', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ngVerify', 'datePicker', 'ui.select', 'colorpicker.module', 'ngSanitize',  'treeControl','angularFileUpload',]);

//要在表格中显示的字段及名称，提取出来便于更改和查看
function columns(vm, uiGridConstants) {
    return [{
        name: 'idproject', displayName: '图标', width: '5%', enableFiltering: false, cellClass: 'text-center',
        cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            return '<i class="fa fa-address-card  bigger-120"></i>'
        }

     },
     {
         name: 'name', displayName: '项目名称', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span uib-popover="{{row.entity.name}}" popover-trigger="\'mouseenter\'" popover-placement="top-left" popover-append-to-body="true" style="white-space:nowrap;">{{row.entity.name}}</span>';
         }
     },{
         name: 'createtime', displayName: '创建时间', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', type: Date, cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span ng-bind="grid.appScope.defaulttime(row.entity.createtime)"></span>';
         }, visible: false,
     },
     {
         name: 'starttime', displayName: '修改时间', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span ng-bind="grid.appScope.defaulttime(row.entity.updatetime)"></span>';
         }, visible: false,
     },
      {
          name: 'endtime', displayName: '结束时间', enableFiltering: true,
          menuItems: [{
              title: '检索',
              icon: 'ui-grid-icon-search',
              action: function () {
                  vm.toggleFiltering(vm, uiGridConstants);
              }
          }], cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
              return '<span ng-bind="grid.appScope.defaulttime(row.entity.endtime)"></span>';
          }, visible: false,
      },
     { name: 'clientname', displayName: '最终用户', enableFiltering: false, cellClass: 'text-center'},
     {
         name: 'statusid', displayName: '项目状态', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 0)"></div>'
         }
     },
     {
         name: 'mark', displayName: '备注', enableFiltering: false, cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span uib-popover="{{row.entity.address}}" popover-trigger="\'mouseenter\'" popover-placement="top-left" popover-append-to-body="true" style="white-space:nowrap;">{{row.entity.address}}</span>';
         }
     },
     {
         name: 'userid', displayName: '项目创建人', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', visible: false,
     },
     {
         name: 'principal', displayName: '主要联系人', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center'
     },

     {
         name: 'refuser', displayName: '用户', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div  crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex,1)"></span>'
         }
     },
     {
         name: 'refutypes', displayName: '用户角色', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 2)"></div>'
         }
     },
     {
         name: 'refugroups', displayName: '用户组', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 3)"></div>'
         }
     },{
         name: 'refcontacts', displayName: '联系人', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 4)"></div>'
         }
     }, {
         name: 'refcustomers', displayName: '客户', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 5)"></div>'
         }
     },
     {
         name: 'group_type', displayName: '操作', enableFiltering: false, cellClass: 'text-left',
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<a href="javascript:;" class="green top-5" ng-show="grid.appScope.service.refedit"  ng-click="grid.appScope.updateInfo(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5" ng-show="grid.appScope.service.refdel" ng-click="grid.appScope.remove(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
         }
     }];
}


appModule.filter('textLengthSet', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || '...');//'...'可以换成其它文字
    };
});
//主控制器
appModule.controller('crmProjectController', ['$scope', 'i18nService', 'dataService', 'uiGridConstants', 'alert',  function ($scope, i18nService, dataService, uiGridConstants, alert) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.service = dataService;//要显示到页面上的数据源
    //ui-grid改变高度方法
    $scope.changeHeight = function () {
        var newHeight = document.body.clientHeight - 115;
        angular.element(document.getElementsByClassName('ui-grid')[0]).css('height', newHeight + 'px');
    };
    /*
        查询用户（本页面使用）数据
    */
    $scope.select = function () {
        $scope.service.postData(__URL + 'Crmproject/Project/select_page_data', {}).then(function (data) {
            $scope.service.projectData = data;
            $scope.gridOptions.data = $scope.service.projectData;
            /*
                下面做调用 查询了所有需要的关系表及子表中的数据
            */
                   
            $scope.selectstatus();//状态            
            $scope.selectuser();//用户
            $scope.selectusertype();//用户角色
            $scope.selectusergroup();//用户组
            $scope.selectcontact();//联系人
            $scope.selectcustomer();//客户
 
            $scope.changeHeight();//全屏显示表格
        }, function (error) {
            console.log(error);
        });
    }
    //显示到页面上的数据源
    $scope.ProjectData = [];
    //表格配置对象
    $scope.gridOptions = publicControllerGridOptions($scope);
    //表格列头
    $scope.gridOptions.columnDefs = columns($scope, uiGridConstants);
    //显示、隐藏检索方法
    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };
    //时间戳转换
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
    //仅用作了展示时间为0时给默认值，  0：暂无      ****** 是否可以合并
    $scope.defaulttime = function (time) {
        if (time == 0) {
            var html = '暂无';
        } else {
            var html = formatDate(time);
        }
        return html;
    }
    //仅用作了附加默认值做判断使用，为空则是undefined的情况
    $scope.defaultvalue = function (value) {
        if (value == "undefined") {
            var html = '暂无';
        } else {
            var html = value;
        }
        return html;
    }
    //关联数据名称的拼接显示
    $scope.makeRefHtml = function (_arr,totalData,idname,_name) {
        for (var id = 0; id < _arr.length; id++) {{
            $scope.refname += totalData[_arr[id]][_name] + '   ';
            }
        }
    }
    //获取关联详细信息 
    //       状态   用户   用户角色   用户组   联系人   客户
    //type    0      1       2         3       4       5
    //Action  3      4       5         6       7       8
    $scope.returnHtml = function (grid, row, col, rowRenderIndex, colRenderIndex, type) {
        $scope.refname = '';               
       if (type == 0) {
           //状态
           for (var i = 0; i < $scope.service.projectstatusData; i++) {
               if ($scope.service.projectstatusData[i].idprojectstatus == row.entity.statusid) {
                   $scope.refname = '<span class="label" ng-click="grid.appScope.changeStatus(row)" style="backgroud-color:' + $scope.service.projectstatusData[i].labelclass + '">' + $scope.service.projectstatusData[i].name + '</span>';
                   return;
               }
           }
       }else if (type == 1) {
           //用户
           $scope.refname += '<a class="addref top-5" title="建立项目与用户关系" ng-click="grid.appScope.refuser(grid, row, col, rowRenderIndex, colRenderIndex,4)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
           var user_arr = row.entity.refusers.split(",");   
           $scope.makeRefHtml(user_arr,$scope.service.usersData,'idusers',"username");
           
          
       } else if (type == 2) {
            //用户角色
           $scope.refname += '<a class="addref top-5" title="建立项目与用户角色关系" ng-click="grid.appScope.refusertype(grid, row, col, rowRenderIndex, colRenderIndex,5)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            var type_arr = row.entity.refutypes.split(",");
            $scope.makeRefHtml(type_arr, $scope.service.usertypeData, 'idusertype', "typename");
        }  else if (type == 3) {
            //用户组
            $scope.refname += '<a class="addref top-5" title="建立项目与用户组关系" ng-click="grid.appScope.refusergroup(grid, row, col, rowRenderIndex, colRenderIndex,6)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            var usergroup_arr = row.entity.refugroups.split(",");
            $scope.makeRefHtml(usergroup_arr, $scope.service.usergroupData, 'idusergroup', "groupname");
        }else if (type == 4) {
            //联系人
            $scope.refname += '<a class="addref top-5" title="建立项目与联系人关系" ng-click="grid.appScope.refcontact(grid, row, col, rowRenderIndex, colRenderIndex,7)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            var contact_arr = row.entity.refcontacts.split(",");
            $scope.makeRefHtml(contact_arr, $scope.service.contactData, 'idcontact', "name");
        } else if (type == 5) {
            //客户
            $scope.refname += '<a class="addref top-5" title="建立项目与客户关系" ng-click="grid.appScope.refcustomer(grid, row, col, rowRenderIndex, colRenderIndex,8)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            var customerinfo_arr = row.entity.refcustomers.split(",");
            $scope.makeRefHtml(customerinfo_arr, $scope.service.customerinfoData, 'idcustomerinfo', "name");
        }
       return $scope.refname;
    };
    
    //批量导入按钮
    $scope.uploadfile = function () {
        $scope.service.title = '批量导入';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //刷新按钮
    $scope.refresh = refresh;

    //添加按钮
    $scope.add = function () {
        $scope.service.title = '新建项目';
        $scope.modalHtml = __URL + 'Crmproject/project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
    }
    //修改按钮
    $scope.updateInfo = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = "修改项目";
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem = row.entity;
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '删除项目';
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerDel($scope);
    }
   
    //修改项目状态按钮
    $scope.changeStatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '修改项目状态';
        $scope.service.Action = 3;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }
    
    //关联用户按钮
    $scope.refuser = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户';
        $scope.service.Action = 4;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }
    //关联用户角色按钮
    $scope.refusertype = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户角色';
        $scope.service.Action =5;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }
    //关联用户组按钮
    $scope.refusergroup = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户组';
        $scope.service.Action = 6;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }
    //关联联系人按钮
    $scope.refcontact = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联联系人';
        $scope.service.Action =7;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }
    //关联客户按钮
    $scope.refcustomer = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户';
        $scope.service.Action = 8;
        $scope.modalHtml = __URL + 'Crmproject/Project/openmodal';
        $scope.modalController = 'saveProjectController';
        $scope.service.selectItem =row.entity;
        publicControllerRef($scope);
    }

    /*
    查询项目状态数据
    */
    $scope.selectstatus = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmproject/Customerstatus/select_page_data', params).then(function (data) {
            $scope.service.projectstatusData = data;
        }, function (error) {
            console.log(error);
        });
    }     

    /*
    查询用户数据
    */
    $scope.selectuser = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmuser/Users/select_page_data', params).then(function (data) {
            $scope.service.usersData = data;
        }, function (error) {
            console.log(error);
        });
    }
 
    /*
    查询用户角色数据
    */
    $scope.selectusertype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmuser/Usertype/select_page_data', params).then(function (data) {
            $scope.service.usertypeData = data;
        }, function (error) {
            console.log(error);
        });
    }

    /*
    查询用户组数据
    */
    $scope.selectusergroup = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmuser/Usergroup/select_page_data', params).then(function (data) {
            $scope.service.usergroupData = data;
        }, function (error) {
            console.log(error);
        });
    }

 
    /*
    查询联系人数据
    */
    $scope.selectcontact = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Contact/select_page_data', params).then(function (data) {
            $scope.service.contactData = data;
        }, function (error) {
            console.log(error);
        });
    }

 
    /*
    查询客户数据
    */
    $scope.selectcustomer = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerinfo/select_page_data', params).then(function (data) {
            $scope.service.customerinfoData = data;
        }, function (error) {
            console.log(error);
        });
    }
    //页面加载完成后，查询数据
    $scope.select();
}]);

