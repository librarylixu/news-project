
//添加编辑项目的控制器
appModule.controller('saveProjectController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', function ($scope, $uibModalInstance, dataService, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    $scope.delData = [];
    var index;
    //项目把握度数据
    $scope.service.graspData = [{ id: '10', name: "10%" }, { id: '20', name: '20%' }, { id: '30', name: '30%' }, { id: '40', name: '40%' }, { id: '50', name: '50%' }, { id: '60', name: '60%' }, { id: '70', name: "70%" }, { id: '80', name: '80%' }, { id: '90', name: '90%' }, { id: '100', name: '100%' }];
    //----时间插件start----
    //给时间戳插件赋值
    if ($scope.Source.selectItem.contracttime && $scope.Source.selectItem.contracttime !== '0' && $scope.Source.selectItem.contracttime != 'null') {
        var date = new Date($scope.Source.selectItem.contracttime * 1000);
        $scope.Source.dt = new Date('2' + date.getYear() - 100, date.getMonth(), date.getDate());
    }
    //控制日期选择框的显示与否
    $scope.popup = { opened: false };
    //时间插件配置项
    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2045, 01, 01),
        minDate: new Date(),
        startingDay: 1
    };
    if ($scope.Source.selectItem.refusers && $scope.Source.selectItem.refusers.split) {
        $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers.split(',');
    }

    //打开事件选择框的方法
    $scope.open = function () {
        $scope.popup.opened = true;
    }
    //----时间插件end----
    //获取受保护名单
    $scope.selectIsprotected = function () {
        var params = new URLSearchParams();
        //params.append('$json', true);
        params.append('$findall', true);
        params.append('isprotected', 1);
        params.append('$fieldkey', 'idproject,name,userid');
        $scope.service.postData(__URL + 'Crmproject/Project/select_page_data', params).then(function (data) {

            $scope.service.privateDateObj.isprojectData = data;
        });
    }
    if ($scope.service.privateDateObj.isprojectData == undefined || Object.keys($scope.service.privateDateObj.isprojectData).length < 1) {
        $scope.selectIsprotected();
    }
    //获取总价格，显示在关联产品右侧的当前总价
    $scope.getonlymoney = function () {
        //总价
        $scope.allmoney = 0;
        for (var item = 0; item < $scope.projectdevicelistData.length; item++) {
            $scope.allmoney += parseInt($scope.projectdevicelistData[item].money ? $scope.projectdevicelistData[item].money : 0);
        }
    }
    //获取产品清单数据
    $scope.select_project_devicelist = function () {
        $scope.projectdevicelistData = [];
        angular.forEach($scope.Source.privateDateObj.projectdevicelistData, function (value, key) {
            if (value.projectid == $scope.Source.selectItem.idproject) {
                $scope.projectdevicelistData.push(value);
            }
        });
        $scope.getonlymoney();
    }
    //添加产品清单

    $scope.addProductlist = function () {
        var newData = { addData: true, number: 1, money: 0 };
        var flag = true;
        for (var i = 0; i < $scope.projectdevicelistData.length; i++) {
            if (!$scope.projectdevicelistData[i].productmodelid || !$scope.projectdevicelistData[i].number || !$scope.projectdevicelistData[i].money) {
                flag = false;
                parent.layer.msg("请将上一条产品信息填写完整！", { icon: 0 });
                break;
            }
        };
        if (flag) {
            $scope.projectdevicelistData.push(newData);
        }
    }
    //删除产品清单
    $scope.delProductlist = function (item) {
        var index = $scope.projectdevicelistData.indexOf(item);
        if (index > -1) {
            $scope.projectdevicelistData.splice(index, 1);
            $scope.delData.push(item);
        }

    }
    //组建地点选中项
    $scope.setSelected = function () {
        //组建决策地选中项
        if ($scope.Source.selectItem.decisioncity) {
            $scope.Source.selectItem.decisionprovince = $scope.Source.selectItem.decisioncity.slice(0, 2);
            $scope.Source.selectItem.decision = $scope.Source.selectItem.decisioncity.slice(2);
            $scope.service.decisioncityData = $scope.service.privateDateObj.citykeyData[$scope.Source.selectItem.decisionprovince].city;
        }
        //组建所在地选中项
        if ($scope.Source.selectItem.city) {
            $scope.Source.selectItem.province = $scope.Source.selectItem.city.slice(0, 2);
            $scope.Source.selectItem.citylevel = $scope.Source.selectItem.city.slice(2);
            $scope.service.cityData = $scope.service.privateDateObj.citykeyData[$scope.Source.selectItem.province].city;
        }
    }
    //获取项目城市数据
    $scope.getCityData = function () {
        dataService.postData(__URL + 'Crmproject/Project/getCityData', {}).then(function (data) {
            //将数据存一份（带key的）
            $scope.service.privateDateObj.citykeyData = JSON.parse(data);
            //组建选中数据
            $scope.setSelected();
        });
    }

    //获取市级信息数据
    $scope.getcityData = function (item, type) {
        var province;
        var city;
        var data;
        if (type == 1) {
            province = 'decisionprovince';
            city = 'decision';
            data = 'decisioncityData';
        } else {
            province = 'province';
            city = 'citylevel';
            data = 'cityData';
        }
        $scope.Source.selectItem[city] = '';
        //存一份带key得数据
        $scope.service[data] = item.value.city;
    }
    //组建城市代码数据
    $scope.buildcityCode = function (type) {
        if (type == 1) {
            if ($scope.Source.selectItem.decisionprovince && $scope.Source.selectItem.decision) {
                $scope.Source.selectItem.decisioncity = $scope.Source.selectItem.decisionprovince + $scope.Source.selectItem.decision;
            }
        } else {
            if ($scope.Source.selectItem.province && $scope.Source.selectItem.citylevel) {
                $scope.Source.selectItem.city = $scope.Source.selectItem.province + $scope.Source.selectItem.citylevel;
            }
        }
    }

    //组建可选联系人
    $scope.selectContact = function () {
        var params = new URLSearchParams();
        params.append('$in', true);
        params.append('$findall', true);
        params.append('$json', true);
        params.append('idcontact', $scope.service.privateDateObj.customerinfoData[$scope.Source.selectItem.refcustomers].refcontactids);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Contact/select_page_data', params).then(function (data) {
            $scope.service.contactData = data;
        });
    }
    //附件管理数据
    $scope.selectAnnx = function () {
        var params = new URLSearchParams();
        params.append('$in', true);
        params.append('$findall', true);
        params.append('idannex', $scope.Source.selectItem.refannexs);
        $scope.service.postData(__URL + 'Crmsetting/Annex/select_page_data', params).then(function (data) {
            $scope.service.annexData = data;
        }, function (error) {
            console.log(error);
        });
    }
    var url;
    switch ($scope.Source.Action) {
        case 0:
            url = __URL + 'Crmproject/Project/add_page_data';
            $scope.service.contactData = {};
            $scope.service.annexData = [];
            $scope.projectdevicelistData = [];
            $scope.allmoney = 0;
            break;
        case 1:
            url = __URL + 'Crmproject/Project/update_page_data';
            //项目把握度
            if ($scope.Source.selectItem.integrate && $scope.Source.selectItem.integrate == '1') {
                $scope.Source.selectItem.integrate = true;
            } else {
                $scope.Source.selectItem.integrate = false;
            }
            $scope.select_project_devicelist();
            //组建可选联系人
            if ($scope.Source.selectItem.refcustomers != null) {
                $scope.selectContact();
            }
            //组建附件列表
            if ($scope.Source.selectItem.refannexs) {
                $scope.selectAnnx();
            } else {
                $scope.service.annexData = [];
            }
            break;
        default:
            parent.layer.msg('Action Error!', { icon: 5 });
            break;
    }
    //附件下载
    $scope.downLoad = function (annex) {
        window.open(__URL + 'Crmsetting/Annex/downLoad?idannex=' + annex);
    }
    //附件上传
    $scope.upLoad = function (annex) {
        $scope.service.title = '上传附件';
        $scope.modalHtml = __URL + 'Crmbase/Baseinfo/uploadbtn';
        $scope.modalController = 'modaluploadfileController';
        $scope.service.uploadannex = true;
        publicControllerAdd($scope);
    }
    //点击完成按钮，建立项目和附件的关系
    $scope.service.refAnnex = function (idannex) {
        if ($scope.Source.selectItem.refannexs) {
            if ($scope.Source.selectItem.refannexs.split) {
                $scope.Source.selectItem.refannexs = $scope.Source.selectItem.refannexs.split(',');
            }

        } else {
            $scope.Source.selectItem.refannexs = [];
        }
        $scope.Source.selectItem.refannexs.push(idannex);
        $scope.selectAnnx();
    }

    /*
    保存信息  
    */
    $scope.save = function () {
        index = parent.layer.open({
            content: '确认' + ($scope.Source.Action == 1 ? '修改' : '添加') + '项目【' + $scope.Source.selectItem.name + '】，是否确认？',
            btn: ['确认', '我再想想'],
            icon: 6,
            area: ['400px'],
            title: $scope.Source.Action == 1 ? '修改' : '添加' + '项目信息',
            yes: function (index, layero) {
                var params = new URLSearchParams();
                var num = 0;
                if ($scope.Source.selectItem.idproject) {
                    params.append('idproject', $scope.Source.selectItem.idproject);
                    num++;
                }
                if ($scope.Source.selectItem.name != $scope.service.selectItem.name) {
                    params.append('name', $scope.Source.selectItem.name);
                    num++;
                }
                if ($scope.Source.selectItem.integrate && $scope.Source.selectItem.integrate != $scope.service.selectItem.integrate) {
                    params.append('integrate', 1);
                    num++;
                }
                if ($scope.Source.selectItem.statusid && $scope.Source.selectItem.statusid != $scope.service.selectItem.statusid) {
                    params.append('statusid', $scope.Source.selectItem.statusid);
                    num++;
                }
                if ($scope.Source.selectItem.grasp && $scope.Source.selectItem.grasp != $scope.service.selectItem.grasp) {
                    params.append('grasp', $scope.Source.selectItem.grasp);
                    num++;
                }
                if ($scope.Source.dt && $scope.Source.dt.getTime) {
                    if ($scope.service.selectItem.contracttime != ($scope.Source.dt.getTime() / 1000).toFixed(0)) {
                        //将标准时间转换成时间戳
                        $scope.Source.dt = Date.parse($scope.Source.dt) / 1000;
                        params.append('contracttime', $scope.Source.dt);
                        num++;
                    }

                } else if ($scope.Source.dt && !$scope.Source.dt.getTime) {
                    if ($scope.Source.dt != $scope.service.selectItem.contracttime) {
                        params.append('contracttime', $scope.Source.dt);
                        num++;
                    }
                }
                if ($scope.Source.selectItem.refcustomers && $scope.Source.selectItem.refcustomers != $scope.service.selectItem.refcustomers) {
                    params.append('refcustomers', $scope.Source.selectItem.refcustomers);
                    num++;
                }
                if ($scope.Source.selectItem.refannexs && $scope.Source.selectItem.refannexs != $scope.service.selectItem.refannexs) {
                    params.append('refannexs', $scope.Source.selectItem.refannexs);
                    num++;
                }
                if ($scope.Source.selectItem.refinformant && $scope.Source.selectItem.refinformant != $scope.service.selectItem.refinformant) {
                    params.append('refinformant', $scope.Source.selectItem.refinformant);
                    num++;
                }
                if ($scope.Source.selectItem.refusing && $scope.Source.selectItem.refusing != $scope.service.selectItem.refusing) {
                    params.append('refusing', $scope.Source.selectItem.refusing);
                    num++;
                }
                if ($scope.Source.selectItem.reftechnical && $scope.Source.selectItem.reftechnical != $scope.service.selectItem.reftechnical) {
                    params.append('reftechnical', $scope.Source.selectItem.reftechnical);
                    num++;
                }
                if ($scope.Source.selectItem.refdecision && $scope.Source.selectItem.refdecision != $scope.service.selectItem.refdecision) {
                    params.append('refdecision', $scope.Source.selectItem.refdecision);
                    num++;
                }
                if ($scope.Source.selectItem.decisioncity && $scope.Source.selectItem.decisioncity != $scope.service.selectItem.decisioncity) {
                    params.append('decisioncity', $scope.Source.selectItem.decisioncity);
                    num++;
                }
                if ($scope.Source.selectItem.city && $scope.Source.selectItem.city != $scope.service.selectItem.city) {
                    params.append('city', $scope.Source.selectItem.city);
                    num++;
                }
                if ($scope.Source.selectItem.mark && $scope.Source.selectItem.mark != $scope.service.selectItem.mark) {
                    params.append('mark', $scope.Source.selectItem.mark);
                    num++;
                }
                if ($scope.Source.selectItem.refusers && $scope.Source.selectItem.refusers != $scope.service.selectItem.refusers) {
                    params.append('refusers', $scope.Source.selectItem.refusers.join(','));
                    num++;
                }
                if (num < 2) {
                    if ($scope.Source.Action == 0) {
                        parent.layer.close(index);
                        $uibModalInstance.close('ok');
                    }
                    // parent.layer.msg('您未修改任何数据', { icon: 0 });                  
                    return;
                }
                $scope.Source.postData(url, params).then(function (data) {
                    switch ($scope.Source.Action) {
                        case 0:
                            if (data.id < 1) {
                                //添加失败
                                parent.layer.msg('添加失败', { icon: 5 });
                                break;
                            }
                            var addNewData = {
                                _kid: data.id,
                                idproject: data.id,
                                guid: data.guid,
                                name: $scope.Source.selectItem.name ? $scope.Source.selectItem.name : null,
                                userid: $scope.service.userid,
                                createtime: new Date(),
                                contracttime: $scope.Source.dt,
                                principal: $scope.Source.selectItem.refannexs ? $scope.Source.selectItem.refannexs : null,
                                refannexs: $scope.Source.selectItem.refannexs ? $scope.Source.selectItem.refannexs : null,
                                refinformant: $scope.Source.selectItem.refinformant ? $scope.Source.selectItem.refinformant : null,
                                refusing: $scope.Source.selectItem.refusing ? $scope.Source.selectItem.refusing : null,
                                reftechnical: $scope.Source.selectItem.reftechnical ? $scope.Source.selectItem.reftechnical : null,
                                refdecision: $scope.Source.selectItem.refdecision ? $scope.Source.selectItem.refdecision : null,
                                refcustomers: $scope.Source.selectItem.refcustomers ? $scope.Source.selectItem.refcustomers : null,
                                refusers: $scope.Source.selectItem.refusers ? $scope.Source.selectItem.refusers : null,
                                statusid: $scope.Source.selectItem.statusid ? $scope.Source.selectItem.statusid : null,
                                integrate: $scope.Source.selectItem.integrate ? $scope.Source.selectItem.integrate : null,
                                grasp: $scope.Source.selectItem.grasp ? $scope.Source.selectItem.grasp : null,
                                decisioncity: $scope.Source.selectItem.decisioncity ? $scope.Source.selectItem.decisioncity : null,
                                city: $scope.Source.selectItem.city ? $scope.Source.selectItem.city : null,
                                mark: $scope.Source.selectItem.mark ? $scope.Source.selectItem.mark : null,
                            }
                            $scope.Source.addData('projectArrData', addNewData);
                            $scope.Source.addData('projectData', addNewData);
                            //新建项目存储项目清单列表
                            $scope.Source.selectItem.idproject = data.id;
                            $scope.service.selectItem = addNewData;
                            parent.layer.msg('添加成功', { icon: 6 });
                            $scope.bulidProductlist();



                            //$scope.service.updateInfo($scope.service.projectData[data.id]);
                            break;
                        case 1:
                            if (data > 0) {
                                //修改成功    
                                $scope.Source.selectItem.updatetime = data.updatetime;
                                $scope.Source.updateData('projectArrData', $scope.Source.selectItem);
                                $scope.Source.selectItem._kid = $scope.Source.selectItem.idproject;
                                $scope.Source.updateData('projectData', $scope.Source.selectItem);
                                parent.layer.msg('修改成功', { icon: 1 });
                                $uibModalInstance.close('ok');

                                break;
                            }
                            //修改失败
                            parent.layer.msg('修改失败', { icon: 5 });
                            break;
                    }

                }, function (error) {
                    console.log(error);
                });
                parent.layer.close(index);
            }
        });
    };
    //判断产品清单保存的动作（增删改）
    $scope.bulidProductlist = function () {
        if ($scope.delData.length < 1 && $scope.projectdevicelistData.length < 1) {
            parent.layer.close(index);
            $uibModalInstance.close('ok');
            return;
        }
        if ($scope.delData.length > 0) {
            angular.forEach($scope.delData, function (value) {
                $scope.saveProductlist(1, value);
            });

        }
        if ($scope.projectdevicelistData.length > 0) {
            angular.forEach($scope.projectdevicelistData, function (value) {
                if (value.addData) {
                    $scope.saveProductlist(0, value);
                } else {
                    for (var key in $scope.service.privateDateObj.projectdevicelistData[value.idprojectdevicelist]) {
                        if (key != '$$hashKey' && value[key] != $scope.service.privateDateObj.projectdevicelistData[value.idprojectdevicelist][key]) {
                            $scope.saveProductlist(2, value);
                            break;
                        }
                    };

                }
            });
        }
    }
    //保存产品清单
    $scope.saveProductlist = function (action, item) {
        var url;
        var params = new URLSearchParams();
        if (!item.productmodelid || !item.number || !item.money) {
            parent.layer.closeAll('tips');
            parent.layer.msg("请将产品信息填写完整后再保存", { icon: 0 });
            return;
        }
        if (action == 0) {
            url = __URL + 'Crmproject/Projectdevicelist/add_page_data';
            params.append('projectid', $scope.Source.selectItem.idproject);
            params.append('productmodelid', item.productmodelid);
            params.append('number', item.number);
            params.append('money', item.money);
        } else if (action == 1) {
            url = __URL + 'Crmproject/Projectdevicelist/del_page_data';
            params.append('idprojectdevicelist', item.idprojectdevicelist);
        } else if (action == 2) {
            url = __URL + 'Crmproject/Projectdevicelist/update_page_data';
            params.append('idprojectdevicelist', item.idprojectdevicelist);
            params.append('productmodelid', item.productmodelid);
            params.append('number', item.number);
            params.append('money', item.money);
        }
        $scope.Source.postData(url, params).then(function (data) {
            if (data > 0) {
                if (action == 1) {
                    item._kid = item.idprojectdevicelist;
                    dataService.delData('projectdevicelistData', item);
                } else if (action == 0) {
                    item._kid = data;
                    item.addData = false;
                    item.idprojectdevicelist = data;
                    item.projectid = $scope.Source.selectItem.idproject;
                    dataService.addData('projectdevicelistData', item);
                    $uibModalInstance.close('ok');
                    parent.layer.close(index);
                } else {
                    item._kid = item.idprojectdevicelist;
                    dataService.updateData('projectdevicelistData', item);
                }
            }
        });
    }
    //获取城市的数据
    if ($scope.service.privateDateObj.citykeyData == undefined || Object.keys($scope.service.privateDateObj.citykeyData).length < 1) {
        $scope.getCityData();
    } else {
        //组建选中数据
        $scope.setSelected();
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);