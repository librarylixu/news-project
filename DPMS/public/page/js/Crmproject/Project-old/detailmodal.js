/*
2018年3月23日 11:01:07

*/
//添加编辑项目的控制器
appModule.controller('detailProjectController', ["$scope", 'dataService', 'ngVerify', 'alert', '$uibModalInstance', function ($scope, dataService, ngVerify, alert, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;

    //传给产品清单页的产品id
    $scope.projectid = { id: $scope.service.selectItem.idproject };
    //constructor   检测是否是数组的一个属性（第一次添加的时候$scope.service.projectData是array）
    if ($scope.service.projectData.constructor === Array) {
        $scope.service.projectData = {};
    }
    //查询产品类型
    //时间插件，默认为0
    $scope.dates = { stoday: 0, _stime: 0, etoday: 0, _etime: 0, contracttoday: 0, _contracttime: 0, tendertoday: 0, _tendertime: 0, delivertoday: 0, _delivertime: 0 };
    $scope.selectproducttype = function () {
        var params = new URLSearchParams();
        params.append('$json', true);
        select_producttype(params).then(function (res) {
            $scope.service.producttypeArrData = P_objecttoarray($scope.service[res]);
        });

    }   
    //组件项目把握度数据
    $scope.projectgraspData = function () {
        $scope.service.graspArrData = [10, 30, 50, 70, 90, 100];
    };
    //获取市级信息数据
    $scope.getcityData = function (item,type,citytype) {
        //此处判断如果选择得省份不是之前得省份将市改为请选择如果是还要之前得市级别
        if ($scope.Source.selectItem[type]!=undefined && item.province_name == $scope.Source.selectItem[type].province_name) {
            $scope.service.selectItem[type + citytype] = $scope.service.getCitykeyData[item.id].city[$scope.service.selectItem.citylevel];
        } else {
            $scope.service.selectItem[citytype] = { city: '请选择' };
        }
        //存一份带key得数据
        $scope.service.getCityedData = $scope.service.getCitykeyData[item.id].city;        
    }
    //-------------------------组建默认选中项-------------------
    $scope.buildselectData = function () {
        //组建阶段选中数据
        if (!$scope.service.selectItem.refstatusData && $scope.service.selectItem.statusid) {
            $scope.service.selectItem.refstatusData = $scope.service.projectstatusData[$scope.service.selectItem.statusid];
        } else {
            $scope.service.selectItem.refstatusData = { name: '暂无阶段' };
        }

        //组建客户选中数据
        if (!$scope.service.selectItem.refcustomerData && $scope.service.selectItem.refcustomers) {
            $scope.service.selectItem.refcustomerData = [];
            angular.forEach($scope.service.selectItem.refcustomers.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refcustomerData.push($scope.service.customerinfoData[value]);
                    //更新可选联系人数据
                    $scope.updateContact(value);
                }
            });
        }
        //组建用户权限
        if (!$scope.service.selectItem.refuserData && $scope.service.selectItem.refusers) {
            $scope.service.selectItem.refuserData = [];
            angular.forEach($scope.service.selectItem.refusers.split(','), function (value) {
                $scope.service.selectItem.refuserData.push($scope.service.usersData[value]);
            });
        }
        //组建产品使用地省份
        if ($scope.service.selectItem.city) {
            //得到省份得编号id
            $scope.service.selectItem.province = $scope.service.selectItem.city.slice(0, 2);
            $scope.service.selectItem.province = $scope.service.getCitykeyData[$scope.service.selectItem.province];
            $scope.Source.selectItem.province = angular.copy($scope.service.selectItem.province);
            //组件市级数据(判断知道有省份了)
            $scope.getcityData($scope.service.selectItem.province);
        } else {
            $scope.service.selectItem.province = { province_name: '暂无省份' };
        }
        //组建产品使用地市级
        if ($scope.service.selectItem.city) {
            //得到省份得编号id
            $scope.service.selectItem.citylevel = $scope.service.selectItem.city.slice(2,4);
            if ($scope.service.selectItem.citylevel == -1) {
                $scope.service.selectItem.citylevel = { city: '暂无市级' };
                return;
            }
            $scope.service.selectItem.citylevelData = $scope.service.getCitykeyData[$scope.service.selectItem.province.id].city[$scope.service.selectItem.citylevel];
            $scope.Source.selectItem.citylevelData = angular.copy($scope.service.selectItem.citylevelData);
        } else {
            $scope.service.selectItem.citylevelData = { city: '暂无市级' };
        }
        //组建决策地省份
        if ($scope.service.selectItem.decisioncity) {
            //得到省份得编号id
            $scope.service.selectItem.decisionprovince = $scope.service.selectItem.decisioncity.slice(0, 2);
            $scope.service.selectItem.decisionprovince = $scope.service.getCitykeyData[$scope.service.selectItem.decisionprovince];
            $scope.Source.selectItem.decisionprovince = angular.copy($scope.service.selectItem.decisionprovince);
            //组件市级数据(判断知道有省份了)
            $scope.getcityData($scope.service.selectItem.decisionprovince);
        } else {
            $scope.service.selectItem.decisionprovince = { province_name: '暂无省份' };
        }
        //组建决策地市级
        if ($scope.service.selectItem.decisioncity) {
            //得到省份得编号id
            $scope.service.selectItem.citylevel = $scope.service.selectItem.decisioncity.slice(2, 4);
            if ($scope.service.selectItem.citylevel == -1) {
                $scope.service.selectItem.citylevel = { city: '暂无市级' };
                return;
            }
            $scope.service.selectItem.decisioncitycitylevelData = $scope.service.getCitykeyData[$scope.service.selectItem.decisionprovince.id].city[$scope.service.selectItem.citylevel];
            $scope.service.selectItem.decisioncitycitylevelData = angular.copy($scope.service.selectItem.decisioncitycitylevelData);
        } else {
            $scope.service.selectItem.decisioncitycitylevelData = { city: '暂无市级' };
        }
    }
    //组建可选联系人
    $scope.updateContact = function (value) {
        if ($scope.service.customerinfoData[value] != undefined && $scope.service.customerinfoData[value].refcontactids) {
            $scope.service.selectItem.refcontactData = [];

            angular.forEach($scope.service.customerinfoData[value].refcontactids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refcontactData.push($scope.service.contactData[value]);
                }
            });
            //组建联系人默认选中项
            $scope.buildcontactSelectData();
        }
    }
    //组建联系人默认选中项
    $scope.buildcontactSelectData = function () {

        //线人选中项
        if ($scope.service.selectItem.refinformant) {
            $scope.service.selectItem.refinformantData = [];
            angular.forEach($scope.service.selectItem.refinformant.split(','), function (value) {
                if (value && $scope.service.contactData[value]) {
                    $scope.service.selectItem.refinformantData.push($scope.service.contactData[value]);
                }

            });
        } else {
            $scope.service.selectItem.refinformantData = [];
        }
        //决策者选中项
        if ($scope.service.selectItem.refdecision) {
            $scope.service.selectItem.refdecisionData = [];
            angular.forEach($scope.service.selectItem.refdecision.split(','), function (value) {
                if (value && $scope.service.contactData[value]) {
                    $scope.service.selectItem.refdecisionData.push($scope.service.contactData[value]);
                }

            });
        } else {
            $scope.service.selectItem.refdecisionData = [];
        }
        //技术把关者选中项
        if ($scope.service.selectItem.reftechnical) {
            $scope.service.selectItem.reftechnicalData = [];
            angular.forEach($scope.service.selectItem.reftechnical.split(','), function (value) {
                if (value && $scope.service.contactData[value]) {
                    $scope.service.selectItem.reftechnicalData.push($scope.service.contactData[value]);
                }

            });
        } else {
            $scope.service.selectItem.reftechnicalData = [];
        }
        //使用者选中项
        if ($scope.service.selectItem.refusing) {
            $scope.service.selectItem.refusingData = [];
            angular.forEach($scope.service.selectItem.refusing.split(','), function (value) {
                if (value && $scope.service.contactData[value]) {
                    $scope.service.selectItem.refusingData.push($scope.service.contactData[value]);
                }
            });
        } else {
            $scope.service.selectItem.refusingData = [];
        }
    }
    //编辑状态时再组建数据
    if ($scope.Source.Action == 1) {
        //判断备注中是否有值，如果没有值则按钮不显示
        if ($scope.Source.selectItem.mark == null || $scope.Source.selectItem.mark == undefined) {
            $scope.service.selectItem.mark = '';
            $scope.Source.selectItem.mark = '';
        }
        //组件项目把握度数据
        $scope.projectgraspData();
        //组建默认选中项
        $scope.buildselectData();
    }
    //回车保存新建项目
    $scope.saveAddProject = function (e) {

        //IE 编码包含在window.event.keyCode中，Firefox或Safari 包含在event.which中
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            if (ngVerify.checkElement(projectname, true)) {
                $scope.saveAdd();
            }
        }
    };
    //获取项目创建人
    $scope.getusername = function () {
        if ($scope.service.selectItem.userid != undefined) {
            var username = $scope.service.usersData[$scope.service.selectItem.userid].username;
        }
        return username;
    }
    //字符串转换为时间戳
    $scope.formatDate = function (time) {
        return formatDate(time);
    }
    //时间戳转换为字符串
    $scope.service.changeDate = function (time) {
        if (time == 1) {
            $scope.service.starttime = new Date(parseInt($scope.service.selectItem.starttime) * 1000);
        } else if (time == 2) {
            $scope.service.endtime = new Date(parseInt($scope.service.selectItem.endtime) * 1000);
        } else if (time == 3) {
            $scope.service.starttime = new Date(parseInt($scope.service.selectItem.starttime) * 1000);
            $scope.service.endtime = new Date(parseInt($scope.service.selectItem.endtime) * 1000);
        }
    }
    $scope.service.changeDate(3);
    //时间监听
    $scope.datewatch = function () {
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.etoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._etime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._etime);
                $scope.$broadcast('pickerUpdate', ['pickerMaxDate'], {
                    maxDate: angular.copy(moment(newValue)).subtract(1, 'm')
                });
            }
        });
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.stoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._stime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._stime);
                $scope.$broadcast('pickerUpdate', ['pickerEnd'], {
                    minDate: angular.copy(moment(newValue)).add(1, 'm')
                });
            }
        });
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.contracttoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._contracttime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._contracttime);
            }
        });
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.tendertoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._tendertime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._tendertime);
            }
        });
        //观察name 当一个model值发生改变的时候 都会触发第二个函数
        $scope.$watch('dates.delivertoday', function (newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (newValue != undefined) {
                $scope.dates._delivertime = (newValue._i != undefined ? newValue._i / 1000 : $scope.dates._delivertime);
            }
        });
        
    }
    //初始化datepicker数据
    $scope.datepickerData = function () {
        //赋值开始时间、结束时间 给时间插件使用
        if (parseInt($scope.service.selectItem.starttime) > 0) {
            var d = parseInt($scope.service.selectItem.starttime);
            var dd = new Date(d > 111111111111 ? d : d * 1000);
            $scope.dates.stoday = dd;
        }
        if (parseInt($scope.service.selectItem.endtime) > 0) {
            var d = parseInt($scope.service.selectItem.endtime);
            var dd = new Date(d > 111111111111 ? d : d * 1000);
            $scope.dates.etoday = dd;
        }
        if (parseInt($scope.service.selectItem.contracttime) > 0) {
            var d = parseInt($scope.service.selectItem.contracttime);
            var dd = new Date(d > 111111111111 ? d : d * 1000);
            $scope.dates.contracttoday = dd;
        }
        if (parseInt($scope.service.selectItem.tendertime) > 0) {
            var d = parseInt($scope.service.selectItem.tendertime);
            var dd = new Date(d > 111111111111 ? d : d * 1000);
            $scope.dates.tendertoday = dd;
        }
        if (parseInt($scope.service.selectItem.delivertime) > 0) {
            var d = parseInt($scope.service.selectItem.delivertime);
            var dd = new Date(d > 111111111111 ? d : d * 1000);
            $scope.dates.delivertoday = dd;
        }
        $scope.dates._stime = $scope.service.selectItem.starttime;
        $scope.dates._etime = $scope.service.selectItem.endtime;
        $scope.dates._contracttime = $scope.service.selectItem.contracttime;
        $scope.dates._tendertime = $scope.service.selectItem.tendertime;
        $scope.dates._delivertime = $scope.service.selectItem.delivertime;
        
        //监听时间插件
        $scope.datewatch();
    }
    //初始化datepicker数据
    $scope.datepickerData();
    //标准时间转换成字符串
    $scope.P_getMyTime = function (date) {
        if (date == 0 || isNaN(date)) {
            return "请设置时间";
        }
        return P_getMyTime(date);
    }
    //项目提示框title和代码段路径
    $scope.dynamicPopover = {
        templateUrl: __URL + 'Crmproject/Project/statusChange',
        title_status: '修改项目状态',
        title_name_add: '添加项目',
        title_name: '修改项目名称',
        title_clientname: '修改最终用户',
        title_principal: '修改主要负责人',
        title_mark: '修改备注'
    };
    //添加项目保存
    $scope.saveAdd = function () {
        $scope.params = new URLSearchParams();
        $scope.url = "Crmproject/Project/add_page_data";
        $scope.params.append('name', $scope.Source.selectItem.name);
        $scope.Source.postData(__URL + $scope.url, $scope.params).then(function (data) {
            if (data.id < 1) {
                //添加失败
                parent.layer.msg('添加失败!', { icon: 5 });
                return;
            }
            $scope.addNewData = {
                _kid: data.id,
                idproject: data.id,
                guid: data.guid,
                name: $scope.Source.selectItem.name,
                userid: $scope.service.userid,
                createtime: new Date(),
                starttime: 0,
                endtime: 0,
                contracttime: 0,
                tendertime: 0,
                delivertime: 0,
                clientname: '',
                principal: '',
                mark:'',
                refannexs: '',
                refinformantData: [],//线人
                refinformant: '',
                refdecisionData: [],//决策者
                refdecision: '',
                reftechnicalData: [],//技术把关者
                reftechnical: '',
                refusingData: [],//使用者
                refusing: '',
                decisioncity:'',//决策地
                refcustomerData: [],
                refcustomers: '',
                refproductData: [],
                refproductlist: null,
                refstatusData: [],
                refugroups: null,
                refuserData: [],
                refusergroupData: [],
                refusers: null,
                refusertypeData: [],
                refutypes: null,
                statusid: null,
                grasp: 0,
                integrate: 0,
            }
            dataService.addData('projectData', $scope.addNewData);
            $uibModalInstance.close('ok');
            $scope.service.updateInfo($scope.service.projectData[data.id]);
        });
    }

    $scope.save = function (item, model, type, action) {
        $scope.params = new URLSearchParams();
        $scope.newdata = {};
        $scope.url = "Crmproject/Project/update_page_data";
        if (type == 1) {
            //编辑
            $scope.params.append('idproject', $scope.Source.selectItem.idproject);
            if ($scope.Source.selectItem.name != undefined && item == 1) {
                $scope.params.append('name', $scope.Source.selectItem.name);
            }
            if (item == "principal") {
                $scope.params.append(item, $scope.Source.selectItem.principal);
            }
            if (item == "clientname") {
                $scope.params.append(item, $scope.Source.selectItem.clientname);
            }
            //if (item == "starttime") {
            //    if ($scope.service.selectItem.endtime != "0" && $scope.dates._stime > parseInt($scope.service.selectItem.endtime)) {
            //        alert.show('您输入的有误,请重新填写', '工单开始时间');
            //        return;
            //    }
            //    if (isNaN($scope.dates._stime)) {
            //        alert.show('请先设置时间再保存', '工单开始时间');
            //        return;
            //    }
            //    $scope.showStartSave = false;
            //    $scope.params.append(item, $scope.dates.stoday.unix());
            //}
            //if (item == "endtime") {
            //    if ($scope.service.selectItem.starttime != "0" && $scope.dates._etime < parseInt($scope.service.selectItem.starttime)) {
            //        alert.show('您输入的有误,请重新填写', '工单结束时间');
            //        return;
            //    }
            //    if (isNaN($scope.dates._etime)) {
            //        alert.show('请先设置时间再保存', '工单结束时间');
            //        return;
            //    }
            //    $scope.showEndSave = false;
            //    $scope.params.append(item, $scope.dates.etoday.unix());
            //}
            if (item == "contracttime") {
                if (isNaN($scope.dates._contracttime)) {
                    parent.layer.msg('请先设置时间再保存!', { icon: 5 });
                    return;
                }
                $scope.showEndSave = false;
                $scope.params.append(item, $scope.dates.contracttoday.unix());
            }
            //if (item == "tendertime") {
            //    if (isNaN($scope.dates._tendertime)) {
            //        alert.show('请先设置时间再保存', '预计招标时间');
            //        return;
            //    }
            //    $scope.showEndSave = false;
            //    $scope.params.append(item, $scope.dates.tendertoday.unix());
            //}
            //if (item == "delivertime") {
            //    if (isNaN($scope.dates._delivertime)) {
            //        alert.show('请先设置时间再保存', '预计要货时间');
            //        return;
            //    }
            //    $scope.showEndSave = false;
            //    $scope.params.append(item, $scope.dates.delivertoday.unix());
            //}
            if (item == "mark") {
                $scope.params.append(item, $scope.Source.selectItem.mark);
            }
            if (item == "integrate") {
                //action等于0点击了否  等于1点击了是
                var integrate = 0;
                if (action == 0) {
                    integrate = 0;
                } else {
                    integrate = 1;
                }
                if (integrate == $scope.service.selectItem.integrate) {
                    return;
                }
                $scope.params.append(item, integrate);
            }
        } else if (type == 3) {
            //勾选---切换状态
            $scope.params.append('idproject', $scope.Source.selectItem.idproject);
            if (action == 0) {
                $scope.params.append('statusid', item.idprojectstatus);
            }
            $scope.Source.statusIsOpen = false;
        }
        else if (type == 4) {
            //勾选---关联用户
            var user_arr = [];
            if ($scope.Source.selectItem.refusers) {
                user_arr = $scope.Source.selectItem.refusers.split(",");
            }

            $scope.params.append('idproject', $scope.Source.selectItem.idproject);
            if (action == 0) {

                user_arr.push(item.idusers);
                $scope.params.append('refusers', user_arr.join(','));

            } else {
                //取消勾选            
                var index = user_arr.indexOf(item.idusers);

                user_arr.splice(index, 1);
                $scope.params.append('refusers', user_arr.join(","));
            }
        } 
    

        $scope.Source.postData(__URL + $scope.url, $scope.params).then(function (data) {
            switch (type) {
                case 1:
                    //项目单项修改
                    if (data > 0) {
                        //更新Source中的数据源
                        //if (item == 'starttime') {
                        //    $scope.Source.selectItem.starttime = $scope.dates.stoday.unix();
                        //}
                        //if (item == 'endtime') {
                        //    $scope.Source.selectItem.endtime = $scope.dates.etoday.unix();
                        //}
                        if ($scope.Source.selectItem.name != undefined && item == 1) {
                            $scope.service.selectItem.name = $scope.Source.selectItem.name;
                        }
                        if (item == "mark") {
                            $scope.submitBtn = false;
                            $scope.service.selectItem.mark = $scope.Source.selectItem.mark;
                            parent.layer.msg('保存成功!', { icon: 6 });
                        }
                        if (item == "contracttime") {
                            $scope.service.selectItem.contracttime = $scope.dates.contracttoday.unix();
                        }
                        //if (item == "tendertime") {
                        //    $scope.Source.selectItem.tendertime = $scope.dates.tendertoday.unix();
                        //}
                        //if (item == "delivertime") {
                        //    $scope.Source.selectItem.delivertime = $scope.dates.delivertoday.unix();
                        //}
                        if (item == "integrate") {
                            $scope.service.selectItem.integrate = integrate;
                        }
                        angular.forEach($scope.Source.selectItem, function (key,value) {
                            if ($scope.service.selectItem[key] != value) {
                                $scope.service.selectItem[key] = value;
                            }
                        });
                        $scope.Source.selectItem._kid = $scope.Source.selectItem.idproject;
                        dataService.updateData('projectData', $scope.service.selectItem);
                        break;
                    }

                    parent.layer.msg('修改失败!', { icon: 5 });
                    break;
                case 3:
                    //项目状态修改
                    if (data > 0) {
                        //更新Source中的数据源
                        $scope.Source.selectItem.statusid = item.idprojectstatus;
                        $scope.service.selectItem.refstatusData[0] = item;
                        $scope.service.selectItem.statusid = $scope.Source.selectItem.statusid;
                        break;
                    }

                    parent.layer.msg('修改失败!', { icon: 5 });
                    break;
                case 4:
                    //关联用户
                    if (data > 0) {
                        var refusers = [];
                        if ($scope.Source.selectItem.refusers) {
                            refusers = $scope.Source.selectItem.refusers.split(",");
                        }
                        if (action == 0) {
                            //更新Source中的关系数据源
                            refusers.push(item.idusers);

                        } else {
                            var index = refusers.indexOf(item.idusers);
                            refusers.splice(index, 1);
                        }
                        $scope.Source.selectItem.refusers = refusers.join(",");
                        $scope.service.selectItem.refusers = $scope.Source.selectItem.refusers;

                        break;
                    }
                    parent.layer.msg('关联失败!', { icon: 5 });
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //-----------------------datepicker插件配置----------------------
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: moment(new Date(2020, 5, 22)),
        minDate: moment(),
        startingDay: 1
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    //-----------------------附件上传以及展示----------------------
    //附件图片路径
    $scope.publicFilterAnnexName = function (itemName) {
        return publicFilterAnnexName(itemName);
    }
    //附件管理数据
    $scope.selectAnnx = function () {
        $scope.params = new URLSearchParams();
        $scope.params.append('$json', true);
        $scope.service.postData(__URL + 'Crmsetting/Annex/select_page_data', $scope.params).then(function (data) {
            $scope.service.annexData = data;
            $scope.service.showAnnx();
        }, function (error) {
            console.log(error);
        });
    }
    //附件展示
    $scope.service.showAnnx = function () {
        $scope.productAnnx = [];
        if (!$scope.refannexs) {
            $scope.refannexs = [];
            if (!$scope.service.selectItem.refannexs || $scope.service.selectItem.refannexs == "") {
                return;
            }
            $scope.refannexs = $scope.service.selectItem.refannexs.split(",");
        }

        angular.forEach($scope.refannexs, function (value) {
            $scope.productAnnx.push($scope.service.annexData[value]);
        });
    }
    //附件下载
    $scope.downLoad = function (annex) {
        //var params = new URLSearchParams();
        //params.append('idannex', annex);
        //var params={idannex:annex};
        window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);
        //  $scope.service.getData(__URL + 'Crmsetting/Annex/downLoad', { params: { idannex: annex } }).then(function (data) { });

    }
    //附件上传
    $scope.upLoad = function (annex) {
        $scope.service.title = '上传附件';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.uploadannex = true;
        publicControllerAdd($scope);
    }
    //附件与项目关系
    $scope.service.refAnnex = function (idannex, index) {
        var params = new URLSearchParams();
        params.append('idproject', $scope.Source.selectItem.idproject);
        if (index == 1) {
            //删除
            removeByValue($scope.refannexs, idannex);
        } else {
            $scope.refannexs.push(idannex);
        }
        params.append('refannexs', $scope.refannexs.join(","));
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            if (data < 1) {
                if (index == 1) {
                    parent.layer.msg('解除附件关系失败!', { icon: 5 });
                    $scope['close' + idannex] = undefined;
                } else {
                    parent.layer.msg('添加附件关系失败!', { icon: 5 });

                }

            } else {
                if (index == 1) {
                    //解除关系
                    $scope['close' + idannex] = false;
                } else {
                    //添加关系
                    $scope.selectAnnx();
                }
            }

        }, function (error) {
            console.log(error);
        });

    }
    if ($scope.service.selectItem.idproject) {
        $scope.selectAnnx();
    }
    //-----------------------产品编辑以及价格计算---------------------- 
    //勾选了的产品型号
    $scope.checkedProductModelData = {};
    /*
    查询项目产品类型数据
    */
    $scope.selectproducttype();
    //--------------------保存多选框切换-------------------------

    //2018年3月22日 21:47:20 重写客户与联系人多选框
    //type 0 添加，1 删除
    //保存客户修改
    $scope.save_customer = function (item, type) {
        var params = new URLSearchParams();
        var contact_name = ['refinformant', 'refdecision', 'reftechnical', 'refusing'];
        //1.保存数据库            
        var customersarr = [];
        if ($scope.service.selectItem.refcustomers) {
            customersarr = $scope.service.selectItem.refcustomers.split(',');
        }
        if (type == 0) {
            customersarr.push(item.idcustomerinfo);
        } else if (type == 1) {
            var index = customersarr.indexOf(item.idcustomerinfo);
            if (index > -1) {
                customersarr.splice(index, 1);
            }
           
            //此处判断如果删除了所有的客户那么清空联系人
            if (customersarr.length == 0) {
                angular.forEach(contact_name, function (value) {
                    params.append(value, "");
                    $scope.service.selectItem[value] = '';
                    
                });               
                $scope.service.selectItem.refcontactData = [];
            } else {
                var contactidsArr = item.refcontactids.split(',');
                angular.forEach(contact_name, function (value) {                    
                    var selectedcontactArr = $scope.service.selectItem[value].split(',');
                    //循环删除关联客户的绑定的联系人数据
                    for (j = 0; j < contactidsArr.length; j++) {
                        var index = selectedcontactArr.indexOf(contactidsArr[j]);
                        if (index > -1) {
                            selectedcontactArr.splice(index, 1);
                          //  $scope.service.selectItem[value + 'Data'].splice($scope.service.contactData[index], 1);
                        }
                    }
                    $scope.service.selectItem[value] = selectedcontactArr.toString();
                   
                    params.append(value, $scope.service.selectItem[value]);
                });
               
            }
        }
        params.append('idproject', $scope.service.selectItem.idproject);
        params.append('refcustomers', customersarr.join(','));
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            if (data > 0) {
                $scope.service.selectItem.refcustomers = customersarr.join(',');
                //组建该项目可选联系人和已选联系人(第一次添加项目附上客户关系时检测到item中refcontactids是null会报错)
                if (item.refcontactids != null) {
                    $scope.setcustomer_contact(item, type);
                }
                
            }
        }, function (error) {
            console.log(error);
        });
    }
    //组建该项目可选联系人和已选联系人 
    $scope.setcustomer_contact = function (item, type) {
        //2.给可选联系人动态添加
        //关联已选客户关联的联系人

        angular.forEach(item.refcontactids.split(','), function (value) {
            if (type == 0) {
                //给项目组建可选联系人（联系人已根据客户与联系人关系过滤）
                if ($scope.service.selectItem.refcontactData == undefined) {
                    $scope.service.selectItem.refcontactData = [];
                }
                //可选联系人中添加
                if ($scope.service.contactData[value]) {
                    $scope.service.selectItem.refcontactData.push($scope.service.contactData[value]);
                }
               
               $scope.buildcontactSelectData();
            } else if (type == 1) {
                if ($scope.service.selectItem.refcustomers) {

                    //取消已选联系人
                    var decision_index = $scope.service.selectItem.refdecisionData.indexOf($scope.service.contactData[value]);
                    if (decision_index > -1) {
                        $scope.service.selectItem.refdecisionData.splice(decision_index, 1);
                    }
                    var refinformant_index = $scope.service.selectItem.refinformantData.indexOf($scope.service.contactData[value]);
                    if (refinformant_index > -1) {
                        $scope.service.selectItem.refinformantData.splice(refinformant_index, 1);
                    }
                    var reftechnical_index = $scope.service.selectItem.reftechnicalData.indexOf($scope.service.contactData[value]);
                    if (reftechnical_index > -1) {
                        $scope.service.selectItem.reftechnicalData.splice(reftechnical_index, 1);
                    }
                    var refusing_index = $scope.service.selectItem.refusingData.indexOf($scope.service.contactData[value]);
                    if (refusing_index > -1) {
                        $scope.service.selectItem.refusingData.splice(refusing_index, 1);
                    }
                    //取消可选联系人
                    var index = $scope.service.selectItem.refcontactData.indexOf($scope.service.contactData[value]);
                    if (index > -1) {
                        $scope.service.selectItem.refcontactData.splice(index, 1);
                    }

                } else {
                    $scope.service.selectItem.refdecisionData = [];
                    $scope.service.selectItem.refinformantData = [];
                    $scope.service.selectItem.reftechnicalData = [];
                    $scope.service.selectItem.refusingData = [];
                    $scope.service.selectItem.refcontactData = [];
                }
               
            }
        });
    }
    /**
    *保存联系人修改
    *$item :当前操作的整条数据
    *type:是移除（0）还是添加（1）
    *person:是什么联系人：1线人 2决策者  3技术支持 4使用者
    */
    $scope.save_contact = function ($item, type,person) {
        var params = new URLSearchParams();
        var contact_arr = [];
        //参数名称
        var contact_param = '';
        switch (person){
            case 1:
                if ($scope.service.selectItem.refinformant) {
                    contact_arr = $scope.service.selectItem.refinformant.split(',');
                    
                }
                contact_param = 'refinformant';
                break;
            case 2:
                if ($scope.service.selectItem.refdecision) {
                    contact_arr = $scope.service.selectItem.refdecision.split(',');
                   
                }
                contact_param = 'refdecision';
                break;
            case 3:
                if ($scope.service.selectItem.reftechnical) {
                    contact_arr = $scope.service.selectItem.reftechnical.split(',');
                   
                }
                contact_param = 'reftechnical';
                break;
            case 4:
                if ($scope.service.selectItem.refusing) {
                    contact_arr = $scope.service.selectItem.refusing.split(',');
                    
                }
                contact_param = 'refusing';
                break;
        }
        contact_arr = unique(contact_arr);
        //勾选
        if (type == 0) {
            contact_arr.push($item.idcontact);
        } else {
            //取消勾选
            var index = contact_arr.indexOf($item.idcontact);
            contact_arr.splice(index, 1);
        }
        params.append('idproject', $scope.service.selectItem.idproject);
        params.append(contact_param, contact_arr.join(','));
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            if (data > 0) {
                switch (person) {
                    case 1:
                       
                        $scope.service.selectItem.refinformant = contact_arr.join(',');
                        break;
                    case 2:
                        
                        $scope.service.selectItem.refdecision = contact_arr.join(',');
                        break;
                    case 3:
                        
                        $scope.service.selectItem.reftechnical = contact_arr.join(',');
                        break;
                    case 4:
                       
                            $scope.service.selectItem.refusing = contact_arr.join(',');
                            break;
                        }

               
            }
        }, function (error) {
            console.log(error);
        });
    }
    //保存状态管理
    $scope.save_status = function ($item, selecttype) {
        //此处额外做一个判断---如果添加的是已选的状态则不存数据库
        if ($item.idprojectstatus == $scope.service.selectItem.statusid) {
            parent.layer.msg('状态未发生改变,请确认后再试!', { icon: 5 });
            return;
        }
        var params = new URLSearchParams();
        params.append('idproject', $scope.service.selectItem.idproject);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refstatusData = $item;
            params.append('statusid', $item.idprojectstatus);
        }
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            //与客户状态关系添加
            if (data > 0) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.statusid = $item.idprojectstatus;
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
                //selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //保存项目把握度
    $scope.save_grasp = function ($item, selecttype) {
        //此处额外做一个判断---如果添加的是已选的状态则不存数据库
        if ($item == $scope.Source.selectItem.grasp) {
            parent.layer.msg('当前未发生改变,请确认后再试!', { icon: 5 });
            return;
        }
        var params = new URLSearchParams();
        params.append('idproject', $scope.service.selectItem.idproject);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.grasp = $item;
            params.append('grasp', $item);
        }
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            //项目把握度
            if (data > 0) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.grasp = $item;
                    $scope.Source.selectItem.grasp = $item;
                }
            } else {
                parent.layer.msg('把握度添加失败!', { icon: 5 });
                //selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //保存省份/市
    $scope.save_province = function ($item, selecttype,citytype) {
        //此处额外做一个判断---如果添加的是已选的状态则不存数据库
        if ($scope.Source.selectItem[citytype] == undefined) {
            $scope.Source.selectItem[citytype] = {};
        }
        if ($scope.Source.selectItem[citytype].city != undefined && $item.city == $scope.Source.selectItem[citytype].city) {
            parent.layer.msg('当前未发生改变,请确认后再试!', { icon: 5 });
            return;
        } 
        var params = new URLSearchParams(); 
        params.append('idproject', $scope.service.selectItem.idproject);
        //判断是添加决策地还是添加产品使用地
        if (selecttype == 'province') {
            //组件省份和城市为“0101”  组件要存储数据库的数据源
            $cityidData = $scope.service.selectItem.province.id + $item.id;
            params.append('city', $cityidData);
        } else {
            //组件省份和城市为“0101”  组件要存储数据库的数据源
            $cityidData = $scope.service.selectItem.decisionprovince.id + $item.id;
            params.append('decisioncity', $cityidData);
        }
        $scope.service.postData(__URL + 'Crmproject/Project/update_page_data', params).then(function (data) {
            //项目产品使用地
            if (data > 0) {
                //更新service中的关系数据源---更新主控制器页面的关系
                $scope.service.selectItem.city = $cityidData;
                $scope.Source.selectItem[citytype].city = $item.city;
                $scope.Source.selectItem.province = $scope.service.selectItem.province;
                

            } else {
                parent.layer.msg('省份添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });


    }
    
}]);