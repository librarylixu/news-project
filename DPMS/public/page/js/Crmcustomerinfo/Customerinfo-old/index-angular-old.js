appModuleInit(['ui.bootstrap', 'ui.grid', 'ui.grid.emptyBaseLayer', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize', 'ngVerify', 'datePicker', 'ui.select', 'colorpicker.module', 'ngSanitize',  'treeControl','angularFileUpload']);

//要在表格中显示的字段及名称，提取出来便于更改和查看
function columns(vm, uiGridConstants) {
    return [{
        name: 'idcustomerinfo', displayName: '图标', width: '5%', enableFiltering: false, cellClass: 'text-center',
        cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            return '<i class="fa fa-address-card  bigger-120"></i>'
        }

     },
     {
         name: 'name', displayName: '客户名称', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span uib-popover="{{row.entity.name}}" popover-trigger="\'mouseenter\'" popover-placement="top-left" popover-append-to-body="true" style="white-space:nowrap;">{{row.entity.name}}</span>';
         }
     },
     {
         name: 'abbreviation', displayName: '简称', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center'
     },
     {
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
         name: 'updatetime', displayName: '修改时间', enableFiltering: true,
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
     { name: 'officephone', displayName: '办公电话', enableFiltering: false, cellClass: 'text-center'},
     { name: 'fax', displayName: '传真', enableFiltering: false, cellClass: 'text-center', visible: false, },
     {
         name: 'address', displayName: '地址', enableFiltering: false, cellClass: 'text-center', cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<span uib-popover="{{row.entity.address}}" popover-trigger="\'mouseenter\'" popover-placement="top-left" popover-append-to-body="true" style="white-space:nowrap;">{{row.entity.address}}</span>';
         }
     },
     {
         name: 'url', displayName: '网站', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center', visible: false,
     },
     {
         name: 'maincontact', displayName: '主要联系人', enableFiltering: true,
         menuItems: [{
             title: '检索',
             icon: 'ui-grid-icon-search',
             action: function () {
                 vm.toggleFiltering(vm, uiGridConstants);
             }
         }], cellClass: 'text-center'
     },
     {
         name: 'cusRefcontact', displayName: '联系人', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 0)"></div>'
         }
     },
     {
         name: 'cusReftype', displayName: '客户类型', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 1)"></div>'
         }
     },
     {
         name: 'cusReflevel', displayName: '客户等级', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 2)"></div>'
         }
     },
     {
         name: 'cusRefindustry', displayName: '客户行业', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 3)"></div>'
         }
     },
     {
         name: 'cusRefsource', displayName: '客户来源', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 4)"></div>'
         }
     },
     {
         name: 'cusRefstage', displayName: '客户阶段', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 5)"></div>'
         }
     },
     {
         name: 'cusRefstatus', displayName: '客户状态', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 6)"></div>'
         }
     },
     {
         name: 'cusRefcredit', displayName: '信用等级', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 7)"></div>'
         }
     },
     {
         name: 'cusRefmarket', displayName: '客户市场', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 8)"></div>'
         }
     },
     {
         name: 'cusRefcity', displayName: '客户地址', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 9)"></div>'
         }
     },
     {
         name: 'cusRefannex', displayName: '客户附件', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 11)"></div>'
         }
     },
     {
         name: 'cusRefshipaddress', displayName: '客户收货人', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 12)"></div>'
         }
     },
     {
         name: 'cusRefuser', displayName: '用户', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 13)"></div>'
         }
     },
     {
         name: 'cusRefusertype', displayName: '用户角色', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 14)"></div>'
         }
     },
     {
         name: 'cusRefusergroup', displayName: '用户组', enableFiltering: false, cellClass: 'text-center', visible: false,
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<div crm-bind-html="grid.appScope.returnHtml(grid, row, col, rowRenderIndex, colRenderIndex, 15)"></div>'
         }
     },
     {
         name: 'group_type', displayName: '操作', enableFiltering: false, cellClass: 'text-left',
         cellTemplate: function (grid, row, col, rowRenderIndex, colRenderIndex) {
             return '<a href="javascript:;" title="查看详细" class="green top-5"  ng-click="grid.appScope.selectdetailed(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-search bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="green top-5" ng-show="grid.appScope.service.refedit"  ng-click="grid.appScope.updateInfo(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-pencil bigger-120"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="red top-5" ng-show="grid.appScope.service.refdel" ng-click="grid.appScope.remove(grid, row, col, rowRenderIndex, colRenderIndex)"><i class="glyphicon glyphicon-trash bigger-120"></i></a> '
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
appModule.controller('crmCustomerinfoController', ['$scope', 'i18nService', 'dataService', 'uiGridConstants', 'alert',  function ($scope, i18nService, dataService, uiGridConstants, alert) {
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
        $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/select_page_data', {}).then(function (data) {
            $scope.service.customerinfoData = data;
            $scope.gridOptions.data = $scope.service.customerinfoData;
            /*
                下面做调用 查询了所有需要的关系表及子表中的数据
            */
            $scope.selectcontact();//联系人
            $scope.selecttype();//客户类型
            $scope.selectlevel();//客户等级
            $scope.selectindustry();//客户行业
            $scope.selectsource();//客户来源
            $scope.selectstage();//客户阶段
            $scope.selectstatus();//客户状态
            $scope.selectcredit();//信用等级
            $scope.selectmarket();//客户市场
            $scope.selectcity();//客户地址
            $scope.selectannex();//客户附件
            $scope.selectshipaddress();//客户收货人
            $scope.selectuser();//用户
            $scope.selectusertype();//用户角色
            $scope.selectusergroup();//用户组
            $scope.selectcompany();//公司信息
            $scope.refselectcontact();//与联系人关系
            $scope.refselecttype();//与客户类型关系
            $scope.refselectlevel()//与客户等级关系
            $scope.refselectindustry();//与客户行业关系
            $scope.refselectsource();//与客户来源关系
            $scope.refselectstage();//与客户阶段关系
            $scope.refselectstatus();//与客户状态关系 
            $scope.refselectcredit();//与信用等级关系
            $scope.refselectmarket();//与客户市场关系
            $scope.refselectcity();//与客户地址关系
            $scope.refselectannex();//与客户附件关系
            $scope.refselectshipaddress();//与客户收货人关系
            $scope.refselectuser();//与用户关系
            $scope.refselectusertype();//与用户角色关系
            $scope.refselectusergroup();//与用户组关系
           
            $scope.changeHeight();//全屏显示表格
        }, function (error) {
            console.log(error);
        });
    }
    //表格中的label标签模板
    $scope.getLabelClass = function (grid, row, status) {
        //获取class
        if (status == 0) {
            return { "background-color": row.entity.labelclass }
        } else if (status == 1) {
            //获取值
            return row.entity.name;
        }
    }
    //显示到页面上的数据源
    $scope.customerinfoData = [];
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
    //仅用作了展示更改密码时间和上次登录时间得为0时给默认值，  0：暂无      ****** 是否可以合并
    $scope.defaulttime = function (time) {
        if (time == 0) {
            var html = '暂无';
        } else {
            var html = formatDate(time);
        }
        return html;
    }
    //仅用作了附加默认值做判断使用，手机、紧急电话、现居地址为空则是undefined的情况
    $scope.defaultvalue = function (value) {
        if (value == "undefined") {
            var html = '暂无';
        } else {
            var html = value;
        }
        return html;
    }
    //获取关联详细信息    
    $scope.returnHtml = function (grid, row, col, rowRenderIndex, colRenderIndex, type) {
        var refname = '';
        if (type == 0) {
            //联系人
            refname = '<a class="addref top-5 ng-scope" title="建立客户与联系人关系" ng-click="grid.appScope.refcontact(grid, row, col, rowRenderIndex, colRenderIndex,3)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            angular.forEach($scope.service.refcontactData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    //refname += $scope.service.contactData[value.conid].name + '　';
                    refname +=$scope.service.contactData[value.conid].name + '  ';
                }
            });
        }else if(type == 1){
            //客户类型
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户类型关系" ng-click="grid.appScope.reftype(grid, row, col, rowRenderIndex, colRenderIndex,4)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            angular.forEach($scope.service.reftypeData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    //refname += $scope.service.typeData[value.typeid].typename + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customertypeData[value.typeid].labelclass + '">' + $scope.service.customertypeData[value.typeid].typename + '</span>  ';
                }
            });
        } else if (type == 2) {
            //客户等级
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户等级关系" ng-click="grid.appScope.reflevel(grid, row, col, rowRenderIndex, colRenderIndex,5)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            angular.forEach($scope.service.reflevelData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    //refname += $scope.service.levelData[value.levelid].levelname + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customerlevelData[value.levelid].labelclass + '">' + $scope.service.customerlevelData[value.levelid].levelname + '</span>  ';
                }
            });
        } else if (type == 3) {
            //客户行业
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户行业关系" ng-click="grid.appScope.refindustry(grid, row, col, rowRenderIndex, colRenderIndex,6)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            angular.forEach($scope.service.refindustryData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.industryData[value.inid].industryname + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customerindustryData[value.inid].labelclass + '">' + $scope.service.customerindustryData[value.inid].industryname + '</span>  ';
                }
            });
        } else if (type == 4) {
            //客户来源
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户来源关系" ng-click="grid.appScope.refsource(grid, row, col, rowRenderIndex, colRenderIndex,7)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refsourceData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    //refname += $scope.service.sourceData[value.sourceid].name + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customersourceData[value.sourceid].labelclass + '">' + $scope.service.customersourceData[value.sourceid].name + '</span>  ';
                }
            });
        } else if (type == 5) {
            //客户阶段
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户阶段关系" ng-click="grid.appScope.refstage(grid, row, col, rowRenderIndex, colRenderIndex,8)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
            angular.forEach($scope.service.refstageData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.stageData[value.stageid].name + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customerstageData[value.stageid].labelclass + '">' + $scope.service.customerstageData[value.stageid].name + '</span>  ';
                }
            });
        } else if (type == 6) {
            //客户状态
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户状态关系" ng-click="grid.appScope.refstatus(grid, row, col, rowRenderIndex, colRenderIndex,9)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refstatusData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.statusData[value.statusid].status + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customerstatusData[value.statusid].labelclass + '">' + $scope.service.customerstatusData[value.statusid].status + '</span>  ';
                }
            });
        } else if (type == 7) {
            //信用等级
            refname += '<a class="addref top-5 ng-scope" title="建立客户与信用等级关系" ng-click="grid.appScope.refcredit(grid, row, col, rowRenderIndex, colRenderIndex,11)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refcreditData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.creditData[value.creditid].name + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customercreditData[value.creditid].labelclass + '">' + $scope.service.customercreditData[value.creditid].name + '</span>  ';
                }
            });
        } else if (type == 8) {
            //客户市场
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户市场关系" ng-click="grid.appScope.refmarket(grid, row, col, rowRenderIndex, colRenderIndex,12)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refmarketData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    //refname += $scope.service.marketData[value.marketid].name + '　';
                    refname += '<span class="label" style="background-color:' + $scope.service.customermarketData[value.marketid].labelclass + '">' + $scope.service.customermarketData[value.marketid].name + '</span>  ';
                }
            });
        } else if (type == 9) {
            //客户地址
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户地址关系" ng-click="grid.appScope.refcity(grid, row, col, rowRenderIndex, colRenderIndex,13)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';
        } else if (type == 11) {
            //客户附件
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户附件关系" ng-click="grid.appScope.refannex(grid, row, col, rowRenderIndex, colRenderIndex,14)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';           
            angular.forEach($scope.service.refannexData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    refname += $scope.service.annexData[value.annexid].name + '　';
                }
            });
        } else if (type == 12) {
            //客户收货人
            refname += '<a class="addref top-5 ng-scope" title="建立客户与客户收货人关系" ng-click="grid.appScope.refshipaddress(grid, row, col, rowRenderIndex, colRenderIndex,15)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refshipaddressData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.shipaddressData[value.shipid].address + '　';
                    refname += $scope.service.shipaddressData[value.shipid].address + '  ';
                }
            });
        } else if (type == 13) {
            //用户
            refname += '<a class="addref top-5 ng-scope" title="建立客户与用户关系" ng-click="grid.appScope.refuser(grid, row, col, rowRenderIndex, colRenderIndex,16)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refuserData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    refname += $scope.service.usersData[value.userid].username + '  ';
                }
            });
        } else if (type == 14) {
            //用户角色
            refname += '<a class="addref top-5 ng-scope" title="建立客户与用户角色关系" ng-click="grid.appScope.refusertype(grid, row, col, rowRenderIndex, colRenderIndex,17)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refusertypeData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.usertypeData[value.utypeid].typename + '　';
                    refname += $scope.service.usertypeData[value.utypeid].typename + '  ';

                }
            });
        } else if (type == 15) {
            //用户组
            refname += '<a class="addref top-5 ng-scope" title="建立客户与用户组关系" ng-click="grid.appScope.refusergroup(grid, row, col, rowRenderIndex, colRenderIndex,18)" href="javascript:;"><i class="glyphicon glyphicon-resize-small"></i></a>';

            angular.forEach($scope.service.refusergroupData, function (value, key) {
                if (value.cusid == row.entity.idcustomerinfo) {
                    // refname += $scope.service.usergroupData[value.ugroupid].groupname + '　';                              
                    refname += $scope.service.usergroupData[value.ugroupid].groupname + '  ';
                }
            });
        }
        return refname;
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
        $scope.service.title = '新建客户';
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = '';
        publicControllerAdd($scope);
     
    }
    //修改按钮
    $scope.updateInfo = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = "修改客户";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerUpdate($scope);
    }
    //删除按钮
    $scope.remove = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '删除客户';
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerDel($scope);
    }
    //关联联系人按钮
    $scope.refcontact = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联联系人';
        $scope.service.Action = 3;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户类型按钮
    $scope.reftype = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户类型';
        $scope.service.Action = 4;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户等级按钮
    $scope.reflevel = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户等级';
        $scope.service.Action = 5;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户行业按钮
    $scope.refindustry = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户行业';
        $scope.service.Action = 6;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController'; 
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户来源按钮
    $scope.refsource = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户来源';
        $scope.service.Action = 7;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户阶段按钮
    $scope.refstage = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户阶段';
        $scope.service.Action = 8;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户状态按钮
    $scope.refstatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户状态';
        $scope.service.Action = 9;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联信用等级按钮
    $scope.refcredit = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联信用等级';
        $scope.service.Action = 11;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户市场按钮
    $scope.refmarket = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户市场';
        $scope.service.Action = 12;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户地址按钮
    $scope.refcity = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户地址';
        $scope.service.Action = 13;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户附件按钮
    $scope.refannex = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户附件';
        $scope.service.Action = 14;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联客户收货人按钮
    $scope.refshipaddress = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联客户收货人';
        $scope.service.Action = 15;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联用户按钮
    $scope.refuser = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户';
        $scope.service.Action = 16;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联用户角色按钮
    $scope.refusertype = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户角色';
        $scope.service.Action = 17;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //关联用户组按钮
    $scope.refusergroup = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        $scope.service.title = '关联用户组';
        $scope.service.Action = 18;
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerinfo/openmodal';
        $scope.modalController = 'saveCustomerinfoController';
        $scope.service.selectItem = grid.options.data[rowRenderIndex];
        publicControllerRef($scope);
    }
    //查看详细按钮
    $scope.selectdetailed = function (grid, row, col, rowRenderIndex, colRenderIndex) {
        window.Win10_child.openUrl(__URL + 'Crmcustomerinfo/Customerrefcompany/selectdetailed?id=' + row.entity.idcustomerinfo, row.entity.name);
        //parent.Win10.openUrl(__URL + 'Crmcustomerinfo/Customerrefcompany/selectdetailed?id=' + row.entity.idcustomerinfo, '<i class="fa fa-newspaper-o icon red"></i>');
    }
    /*
    查询与联系人关系数据
    */
    $scope.refselectcontact = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefcontact/select_page_data', params).then(function (data) {
            $scope.service.refcontactData = data;
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
    查询与类型关系数据
    */
    $scope.refselecttype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusReftype/select_page_data', params).then(function (data) {
            $scope.service.reftypeData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户类型数据
    */
    $scope.selecttype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customertype/select_page_data', params).then(function (data) {
            $scope.service.customertypeData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与等级关系数据
    */
    $scope.refselectlevel = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusReflevel/select_page_data', params).then(function (data) {
            $scope.service.reflevelData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户等级数据
    */
    $scope.selectlevel = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerlevel/select_page_data', params).then(function (data) {
            $scope.service.customerlevelData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与行业关系数据
    */
    $scope.refselectindustry = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefindustry/select_page_data', params).then(function (data) {
            $scope.service.refindustryData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户行业数据
    */
    $scope.selectindustry = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerindustry/select_page_data', params).then(function (data) {
            $scope.service.customerindustryData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与来源关系数据
    */
    $scope.refselectsource = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefsource/select_page_data', params).then(function (data) {
            $scope.service.refsourceData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户来源数据
    */
    $scope.selectsource = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customersource/select_page_data', params).then(function (data) {
            $scope.service.customersourceData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与阶段关系数据
    */
    $scope.refselectstage = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefstage/select_page_data', params).then(function (data) {
            $scope.service.refstageData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户阶段数据
    */
    $scope.selectstage = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerstage/select_page_data', params).then(function (data) {
            $scope.service.customerstageData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与状态关系数据
    */
    $scope.refselectstatus = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefstatus/select_page_data', params).then(function (data) {
            $scope.service.refstatusData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户状态数据
    */
    $scope.selectstatus = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerstatus/select_page_data', params).then(function (data) {
            $scope.service.customerstatusData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与信用等级关系数据
    */
    $scope.refselectcredit = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefcredit/select_page_data', params).then(function (data) {
            $scope.service.refcreditData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询信用等级数据
    */
    $scope.selectcredit = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customercredit/select_page_data', params).then(function (data) {
            $scope.service.customercreditData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与客户市场关系数据
    */
    $scope.refselectmarket = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefmarket/select_page_data', params).then(function (data) {
            $scope.service.refmarketData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户市场数据
    */
    $scope.selectmarket = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customermarket/select_page_data', params).then(function (data) {
            $scope.service.customermarketData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与客户地址关系数据
    */
    $scope.refselectcity = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefcity/select_page_data', params).then(function (data) {
            $scope.service.refcityData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户地址数据
    */
    $scope.selectcity = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmsetting/City/select_page_data', params).then(function (data) {
            $scope.service.customercityData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与客户附件关系数据
    */
    $scope.refselectannex = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefannex/select_page_data', params).then(function (data) {
            $scope.service.refannexData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户附件数据
    */
    $scope.selectannex = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmsetting/Annex/select_page_data', params).then(function (data) {
            $scope.service.annexData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与客户收货人关系数据
    */
    $scope.refselectshipaddress = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefshipaddress/select_page_data', params).then(function (data) {
            $scope.service.refshipaddressData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询客户收货人数据
    */
    $scope.selectshipaddress = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmsetting/Shipaddress/select_page_data', params).then(function (data) {
            $scope.service.shipaddressData = data;
        }, function (error) {
            console.log(error);
        });
    }
    /*
    查询与用户关系数据
    */
    $scope.refselectuser = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefuser/select_page_data', params).then(function (data) {
            $scope.service.refuserData = data;
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
    查询与用户角色关系数据
    */
    $scope.refselectusertype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefutype/select_page_data', params).then(function (data) {
            $scope.service.refusertypeData = data;
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
    查询与用户组关系数据
    */
    $scope.refselectusergroup = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        dataService.postData(__URL + 'Crmcustomerinfo/RefcusRefugroup/select_page_data', params).then(function (data) {
            $scope.service.refusergroupData = data;
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
    查询公司信息数据
    */
    $scope.selectcompany = function () {
        dataService.postData(__URL + 'Crmcustomerinfo/Customerrefcompany/select_page_data', {}).then(function (data) {
            $scope.service.customerrefcompanyData = data;
        }, function (error) {
            console.log(error);
        });
    }
    //页面加载完成后，查询数据
    $scope.select();
}]);

