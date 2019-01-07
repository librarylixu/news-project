//添加编辑客户的控制器
appModule.controller('saveCustomerinfoController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', function ($scope, $uibModalInstance, dataService, alert,  $timeout, ngVerify) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //临时数据源，中间的大圈
    $scope.tempData = [];
    /*
    组建父子之间的关系结构
    */
    $scope.createNewData = function () {
        angular.forEach($scope.Source.usergroupData, function (value, key) {
            var i = value.pid;
            if (i == -1 || i == '0') {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
                //$scope.service.oldusergroupData[i] == undefined  : 此处为了防止找不到pid得情况，从而导致js报错，页面数据丢失
            } else if ($scope.Source.usergroupData[i] == undefined) {
                value.isParent = true;
                $scope.tempData.push(value);
                return;
            } else if ($scope.Source.usergroupData[i].children == undefined) {
                $scope.Source.usergroupData[i].children = [value];
                $scope.Source.usergroupData[i].isParent = true;
            } else {
                $scope.Source.usergroupData[i].children.push(value);
                $scope.Source.usergroupData[i].isParent = true;
            }
        });
        console.log($scope.tempData);
        return $scope.tempData;
    }
  
    //选中某项
    $scope.showSelected = function (sel) {
        $scope.selectedNode = sel;
        sel.checked = !sel.checked;
        $scope.save($scope.selectedNode);
        console.log($scope.Source.Action);
    };
   
    $scope.url = __URL;
    switch ($scope.Source.Action) {
        case 0:
            $scope.url += 'Crmcustomerinfo/Customerinfo/add_page_data';
            break;
        case 1:
            $scope.url += 'Crmcustomerinfo/Customerinfo/update_page_data';
            break;
        case 2:
            $scope.url += 'Crmcustomerinfo/Customerinfo/update_page_data';
            break;
        case 3:
            $scope.url += 'Crmcustomerinfo/RefcusRefcontact/add_page_data';//添加客户与联系人关系
            //把自己的联系人找到并赋值为选中状态
            angular.forEach($scope.Source.refcontactData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.contactData[value['conid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.contactData[value['conid']].idref_customer_contact = value['idref_customer_contact'];
                }
            });
            break;
        case 4:
            $scope.url += 'Crmcustomerinfo/RefcusReftype/add_page_data';//添加客户与客户类型关系
            //把自己的类型找到并赋值为选中状态
            angular.forEach($scope.Source.reftypeData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customertypeData[value['typeid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customertypeData[value['typeid']].idref_customer_type = value['idref_customer_type'];
                }
            });
            break;
        case 5:
            $scope.url += 'Crmcustomerinfo/RefcusReflevel/add_page_data';//添加客户与客户等级关系
            //把自己的等级找到并赋值为选中状态
            angular.forEach($scope.Source.reflevelData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customerlevelData[value['levelid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customerlevelData[value['levelid']].idref_customer_level = value['idref_customer_level'];
                }
            });
            break;
        case 6:
            $scope.url += 'Crmcustomerinfo/RefcusRefindustry/add_page_data';//添加客户与客户行业关系
            //把自己的行业找到并赋值为选中状态
            angular.forEach($scope.Source.refindustryData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customerindustryData[value['inid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customerindustryData[value['inid']].idref_customer_industry = value['idref_customer_industry'];
                }
            });
            break;
        case 7:
            $scope.url += 'Crmcustomerinfo/RefcusRefsource/add_page_data';//添加客户与客户来源关系
            //把自己的来源找到并赋值为选中状态
            angular.forEach($scope.Source.refsourceData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customersourceData[value['sourceid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customersourceData[value['sourceid']].idref_customer_source = value['idref_customer_source'];
                }
            });
            break;
        case 8:
            $scope.url += 'Crmcustomerinfo/RefcusRefstage/add_page_data';//添加客户与客户阶段关系
            //把自己的阶段找到并赋值为选中状态
            angular.forEach($scope.Source.refstageData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customerstageData[value['stageid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customerstageData[value['stageid']].idref_customer_stage = value['idref_customer_stage'];
                }
            });
            break;
        case 9:
            $scope.url += 'Crmcustomerinfo/RefcusRefstatus/add_page_data';//添加客户与客户状态关系
            //把自己的状态找到并赋值为选中状态
            angular.forEach($scope.Source.refstatusData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customerstatusData[value['statusid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customerstatusData[value['statusid']].idref_customer_status = value['idref_customer_status'];
                }
            });
        case 10:
            $scope.url += 'Crmcustomerinfo/RefcusRefsus/add_page_data';//添加客户与公司信息关系
            //把自己的公司信息找到并赋值为选中状态
            angular.forEach($scope.Source.refcompanyData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customercompanyData[value['companyid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customercompanyData[value['companyid']].idref_customer_sus = value['idref_customer_sus'];
                }
            });
        case 11:
            $scope.url += 'Crmcustomerinfo/RefcusRefcredit/add_page_data';//添加客户与信用等级关系
            //把自己的信用等级找到并赋值为选中状态
            angular.forEach($scope.Source.refcreditData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customercreditData[value['creditid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customercreditData[value['creditid']].idref_customer_credit = value['idref_customer_credit'];
                }
            });
            break;
        case 12:
            $scope.url += 'Crmcustomerinfo/RefcusRefmarket/add_page_data';//添加客户与客户市场关系
            //把自己的信用等级找到并赋值为选中状态
            angular.forEach($scope.Source.refmarketData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customermarketData[value['marketid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customermarketData[value['marketid']].idref_customer_market = value['idref_customer_market'];
                }
            });
            break;
        case 13:
            $scope.url += 'Crmcustomerinfo/RefcusRefcity/add_page_data';//添加客户与客户地址关系
            //把自己的客户地址找到并赋值为选中状态
            angular.forEach($scope.Source.refcityData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.customercityData[value['citys']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.customercityData[value['citys']].idcustomercity = value['idcustomercity'];
                }
            });
            break;
        case 14:
            $scope.url += 'Crmcustomerinfo/RefcusRefannex/add_page_data';//添加客户与客户附件关系
            //把自己的客户附件找到并赋值为选中状态
            angular.forEach($scope.Source.refannexData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.annexData[value['annexid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.annexData[value['annexid']].idref_customer_annex = value['idref_customer_annex'];
                }
            });
            break;
        case 15:
            $scope.url += 'Crmcustomerinfo/RefcusRefshipaddress/add_page_data';//添加客户与客户收货人关系
            //把自己的客户收货人找到并赋值为选中状态
            angular.forEach($scope.Source.refshipaddressData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.shipaddressData[value['shipid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.shipaddressData[value['shipid']].idref_customer_shipaddress = value['idref_customer_shipaddress'];
                }
            });
            break;
        case 16:
            $scope.url += 'Crmcustomerinfo/RefcusRefuser/add_page_data';//添加客户与用户关系
            //把自己的用户找到并赋值为选中状态
            angular.forEach($scope.Source.refuserData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.usersData[value['userid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.usersData[value['userid']].idref_customer_user = value['idref_customer_user'];
                }
            });
            break;
        case 17:
            $scope.url += 'Crmcustomerinfo/RefcusRefutype/add_page_data';//添加客户与用户角色关系
            //把自己的用户找到并赋值为选中状态
            angular.forEach($scope.Source.refusertypeData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.usertypeData[value['utypeid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.usertypeData[value['utypeid']].idref_customer_utype = value['idref_customer_utype'];
                }
            });
            break;
        case 18:
            $scope.url += 'Crmcustomerinfo/RefcusRefugroup/add_page_data';//添加客户与用户组关系
            //组件最终的tree数据源
            $scope.service.treedata = $scope.createNewData();
            //把自己的用户找到并赋值为选中状态
            angular.forEach($scope.Source.refusergroupData, function (value, key) {
                if (value['cusid'] == $scope.Source.selectItem['idcustomerinfo']) {
                    $scope.Source.usergroupData[value['ugroupid']].checked = true;
                    //删除\修改的时候会用到这个字段的
                    $scope.Source.usergroupData[value['ugroupid']].idref_customer_ugroup = value['idref_customer_ugroup'];
                }
            });
            break;
        default:
            alert.show('Action Error!');
            break;
    }
    /*
    保存信息
    customer在添加本数据时 0一次添加 1连续添加 不关闭窗口
    customer在添加关系数据时 customer.checked  true为选中，false为未选中
    */
    $scope.save = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 18) {
            $scope.Refusergroup(customer);
        } else if ($scope.Source.Action == 2) {

            $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            $scope.params.append('del', 1);//表中有del字段，修改为1 表示已经删除了
        } else if ($scope.Source.Action == 1) {
            //修改信息，就需要传id
            $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            //添加时做判断，防止没传时会存'undefined'
            if ($scope.Source.selectItem.editType == 1) {
                $scope.params.append('name', $scope.Source.selectItem.name);

            }
            if ($scope.Source.selectItem.editType == 3) {
                $scope.params.append('abbreviation', $scope.Source.selectItem.abbreviation);
            }
            if ($scope.Source.selectItem.editType == 4) {
                $scope.params.append('officephone', $scope.Source.selectItem.officephone);
            }
            if ($scope.Source.selectItem.editType == 5) {
                $scope.params.append('fax', $scope.Source.selectItem.fax);
            }
            if ($scope.Source.selectItem.editType == 6) {
                $scope.params.append('address', $scope.Source.selectItem.address);
            }
            if ($scope.Source.selectItem.editType == 7) {
                $scope.params.append('url', $scope.Source.selectItem.url);
            }
            if ($scope.Source.selectItem.editType == 8) {
                $scope.params.append('maincontact', $scope.Source.selectItem.maincontact);
            }

        }
        else if ($scope.Source.Action == 0) {
            for (var i = 0; i < $scope.service.customerinfoData.length; i++) {
                if ($scope.service.customerinfoData[i].name == $scope.Source.selectItem['name'] && $scope.Source.Action == 0) {
                    //添加失败,该用户角色以存在
                    alert.show('添加失败,该客户[' + $scope.Source.selectItem['name'] + ']已存在', '添加客户');
                    return;
                }
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 1) {
                        //添加失败
                        alert.show('添加失败', '添加客户');
                        break;
                    }
                    //更新service数据源
                    //更新service数据源
                    dataService.addData('customerinfoData', {
                        _kid: data,
                        idcustomerinfo: data,
                        name: $scope.Source.selectItem.name,
                        del: 0,
                        index: 0,
                    });
                    if (customer == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加客户');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加客户');
                    break;
                case 1:
                    if (data['ok'] == 1) {
                        //修改成功    
                        $scope.Source.selectItem.updatetime = data.updatetime;
                        dataService.updateData('customerinfoData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改客户信息');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改客户信息');

                    break;
                case 2:
                    //删除
                    if (data['ok'] == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除客户信息');
                        dataService.delData('customerinfoData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除客户信息');
                    break;
                case 18:
                    //与用户组关系添加
                    if (data > 0) {
                        if (customer.checked) {
                            //更新service中的关系数据源
                            $scope.service.refusergroupData[data] = {
                                idref_customer_ugroup: data,
                                cusid: $scope.Source.selectItem['idcustomerinfo'],
                                ugroupid: customer.idusergroup,
                                del: 0,
                                index: 0
                            };
                            //给复选框赋值,否则将无法删除
                            customer.idref_customer_ugroup = data;
                        } else {
                            delete $scope.service.refusergroupData[customer.idref_customer_ugroup];
                            delete customer.idref_customer_ugroup;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加客户与用户组关系');
                    customer.checked = !customer.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    $scope.save = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 18) {
            $scope.Refusergroup(customer);
        }else if ($scope.Source.Action == 2) {
            $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            $scope.params.append('del', 1);//表中有del字段，修改为1 表示已经删除了
        } else {
            if ($scope.Source.Action == 1) {
                //如果是修改信息，就需要传id
                $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            }
            //添加时做判断，防止没传时会存'undefined'
            if ($scope.Source.selectItem.name != undefined) {
                $scope.params.append('name', $scope.Source.selectItem.name);
            }
            if ($scope.Source.selectItem.abbreviation != undefined) {
                $scope.params.append('abbreviation', $scope.Source.selectItem.abbreviation);
            }
            if ($scope.Source.selectItem.officephone != undefined) {
                $scope.params.append('officephone', $scope.Source.selectItem.officephone);
            }
            if ($scope.Source.selectItem.fax != undefined) {
                $scope.params.append('fax', $scope.Source.selectItem.fax);
            }
            if ($scope.Source.selectItem.address != undefined) {
                $scope.params.append('address', $scope.Source.selectItem.address);
            }
            if ($scope.Source.selectItem.url != undefined) {
                $scope.params.append('url', $scope.Source.selectItem.url);
            }
            if ($scope.Source.selectItem.maincontact != undefined) {
                $scope.params.append('maincontact', $scope.Source.selectItem.maincontact);
            }
            //此处进行额外判断:是否该权限下的客户信息中是否有重复得客户
            for (var i = 0; i < $scope.service.customerinfoData.length; i++) {
                if ($scope.service.customerinfoData[i].name == $scope.Source.selectItem['name'] && $scope.Source.Action == 0) {
                    //添加失败,该用户角色以存在
                    alert.show('添加失败,该客户[' + $scope.Source.selectItem['name'] + ']已存在', '添加客户');
                    return;
                }
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data < 1) {
                        //添加失败
                        alert.show('添加失败', '添加客户');
                        break;
                    }
                    //更新service数据源
                    //更新service数据源
                    dataService.addData('customerinfoData', {
                        _kid: data,
                        idcustomerinfo: data,
                        name: $scope.Source.selectItem.name,
                        del: 0,
                        index:0,                       
                    });
                    if (customer == 0) {
                        //status 0一次添加 
                        $uibModalInstance.close('ok');
                        alert.show('添加成功', '添加客户');
                        break;
                    }
                    //1连续添加 不关闭窗口
                    alert.show('添加成功', '添加客户');
                    break;
                case 1:
                    if (data['ok'] == 1) {
                        //修改成功    
                        $scope.Source.selectItem.updatetime = data.updatetime;
                        dataService.updateData('customerinfoData', $scope.Source.selectItem);
                        $uibModalInstance.close('ok');
                        alert.show('修改成功', '修改客户');
                        break;
                    }
                    //修改失败
                    alert.show('修改失败', '修改客户');

                    break;
                case 2:
                    //删除
                    if (data['ok'] == 1) {
                        $uibModalInstance.close('ok');
                        alert.show('删除成功', '删除客户');
                        dataService.delData('customerinfoData', dataService.selectItem);
                        break;
                    }
                    alert.show('删除失败', '删除客户');
                    break;
                case 18:
                    //与用户组关系添加
                    if (data > 0) {
                        if (customer.checked) {
                            //更新service中的关系数据源
                            $scope.service.refusergroupData[data] = {
                                idref_customer_ugroup: data,
                                cusid: $scope.Source.selectItem['idcustomerinfo'],
                                ugroupid: customer.idusergroup,
                                del: 0,
                                index: 0
                            };
                            //给复选框赋值,否则将无法删除
                            customer.idref_customer_ugroup = data;
                        } else {
                            delete $scope.service.refusergroupData[customer.idref_customer_ugroup];
                            delete customer.idref_customer_ugroup;
                        }
                        break;
                    }
                    alert.show('关系添加失败', '添加客户与用户组关系');
                    customer.checked = !customer.checked;
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };
    //联系人管理
    $scope.Refcontact = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 3) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcontact/add_page_data';
            $scope.params.append('conid', customer.idcontact);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_contact", customer.idref_customer_contact);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcontact/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与联系人关系添加
            if (data > 0) {
                //alert.show('关系添加成功', '添加客户与联系人关系');
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refcontactData[data] = {
                        idref_customer_contact: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        conid: customer.idcontact,
                        del: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_contact = data;
                } else {
                    delete $scope.service.refcontactData[customer.idref_customer_contact];
                    delete customer.idref_customer_contact;
                }
            } else {
                alert.show('关系添加失败', '添加客户与联系人关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户类型管理
    $scope.Reftype = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 4) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusReftype/add_page_data';
            $scope.params.append('typeid', customer.idcustomertype);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_type", customer.idref_customer_type);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusReftype/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户类型关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.reftypeData[data] = {
                        idref_customer_type: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        typeid: customer.idcustomertype,
                        del: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_type = data;
                } else {
                    delete $scope.service.reftypeData[customer.idref_customer_type];
                    delete customer.idref_customer_type;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户类型关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户等级管理
    $scope.Reflevel = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 5) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusReflevel/add_page_data';
            $scope.params.append('levelid', customer.idcustomerlevel);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_level", customer.idref_customer_level);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusReflevel/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户类型关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.reflevelData[data] = {
                        idref_customer_level: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        levelid: customer.idcustomerlevel,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_level = data;
                } else {
                    delete $scope.service.reflevelData[customer.idref_customer_level];
                    delete customer.idref_customer_level;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户等级关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户行业管理
    $scope.Refindustry = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 6) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefindustry/add_page_data';
            $scope.params.append('inid', customer.idcustomerindustry);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_industry", customer.idref_customer_industry);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefindustry/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户行业关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refindustryData[data] = {
                        idref_customer_industry: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        inid: customer.idcustomerindustry,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_industry = data;
                } else {
                    delete $scope.service.refindustryData[customer.idref_customer_industry];
                    delete customer.idref_customer_industry;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户等级关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户来源管理
    $scope.Refsource = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 7) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefsource/add_page_data';
            $scope.params.append('sourceid', customer.idcustomersource);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_source", customer.idref_customer_source);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefsource/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户行业关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refsourceData[data] = {
                        idref_customer_source: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        sourceid: customer.idcustomersource,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_source = data;
                } else {
                    delete $scope.service.refsourceData[customer.idref_customer_source];
                    delete customer.idref_customer_source;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户来源关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户阶段管理
    $scope.Refstage = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 8) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefstage/add_page_data';
            $scope.params.append('stageid', customer.idcustomerstage);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_stage", customer.idref_customer_stage);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefstage/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户阶段关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refstageData[data] = {
                        idref_customer_stage: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        stageid: customer.idcustomerstage,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_stage = data;
                } else {
                    delete $scope.service.refstageData[customer.idref_customer_stage];
                    delete customer.idref_customer_stage;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户阶段关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户状态管理
    $scope.Refstatus = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 9) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefstatus/add_page_data';
            $scope.params.append('statusid', customer.idcustomerstatus);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_status", customer.idref_customer_status);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefstatus/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户状态关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refstatusData[data] = {
                        idref_customer_status: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        statusid: customer.idcustomerstatus,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_status = data;
                } else {
                    delete $scope.service.refstatusData[customer.idref_customer_status];
                    delete customer.idref_customer_status;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户状态关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //公司信息管理
    $scope.Refcompany = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 10) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefsus/add_page_data';
            $scope.params.append('companyid', customer.idcustomercompany);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_sus", customer.idref_customer_sus);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefsus/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与公司信息关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refcompanyData[data] = {
                        idref_customer_sus: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        companyid: customer.idcustomercompany,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_sus = data;
                } else {
                    delete $scope.service.refcompanyData[customer.idref_customer_sus];
                    delete customer.idref_customer_sus;
                }
            } else {
                alert.show('关系添加失败', '添加客户与公司信息关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //信用等级管理
    $scope.Refcredit = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 11) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcredit/add_page_data';
            $scope.params.append('creditid', customer.idcustomercredit);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_credit", customer.idref_customer_credit);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcredit/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与信用等级关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refcreditData[data] = {
                        idref_customer_credit: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        creditid: customer.idcustomercredit,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_credit = data;
                } else {
                    delete $scope.service.refcreditData[customer.idref_customer_credit];
                    delete customer.idref_customer_credit;
                }
            } else {
                alert.show('关系添加失败', '添加客户与信用等级关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户市场管理
    $scope.Refmarket = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 12) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefmarket/add_page_data';
            $scope.params.append('marketid', customer.idcustomermarket);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_market", customer.idref_customer_market);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefmarket/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户市场关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refmarketData[data] = {
                        idref_customer_market: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        marketid: customer.idcustomermarket,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_market = data;
                } else {
                    delete $scope.service.refmarketData[customer.idref_customer_market];
                    delete customer.idref_customer_market;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户市场关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户地址管理
    $scope.Refcity = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 13) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcity/add_page_data';
            $scope.params.append('citys', customer.idcity);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idcustomercity", customer.idcustomercity);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefcity/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户地址关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refcityData[data] = {
                        idcustomercity: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        citys: customer.idcity,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idcustomercity = data;
                } else {
                    delete $scope.service.refcityData[customer.idcustomercity];
                    delete customer.idcustomercity;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户地址关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户附件管理
    $scope.Refannex = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 14) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefannex/add_page_data';
            $scope.params.append('annexid', customer.idannex);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_annex", customer.idref_customer_annex);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefannex/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户地址关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refannexData[data] = {
                        idref_customer_annex: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        annexid: customer.idannex,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_annex = data;
                } else {
                    delete $scope.service.refannexData[customer.idref_customer_annex];
                    delete customer.idref_customer_annex;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户地址关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户收货人管理
    $scope.Refshipaddress = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 15) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefshipaddress/add_page_data';
            $scope.params.append('shipid', customer.idshipaddress);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_shipaddress", customer.idref_customer_shipaddress);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefshipaddress/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户地址关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refshipaddressData[data] = {
                        idref_customer_shipaddress: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        shipid: customer.idshipaddress
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_shipaddress = data;
                } else {
                    delete $scope.service.refshipaddressData[customer.idref_customer_shipaddress];
                    delete customer.idref_customer_shipaddress;
                }
            } else {
                alert.show('关系添加失败', '添加客户与客户地址关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //用户管理
    $scope.Refuser = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 16) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefuser/add_page_data';
            $scope.params.append('userid', customer.idusers);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_user", customer.idref_customer_user);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefuser/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与用户关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refuserData[data] = {
                        idref_customer_user: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        userid: customer.idusers,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_user = data;
                } else {
                    delete $scope.service.refuserData[customer.idref_customer_user];
                    delete customer.idref_customer_user;
                }
            } else {
                alert.show('关系添加失败', '添加客户与用户关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //用户角色管理
    $scope.Refusertype = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 17) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefutype/add_page_data';
            $scope.params.append('utypeid', customer.idusertype);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_utype", customer.idref_customer_utype);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefutype/del_page_data';
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与用户角色关系添加
            if (data > 0) {
                if (customer.checked) {
                    //更新service中的关系数据源
                    $scope.service.refusertypeData[data] = {
                        idref_customer_utype: data,
                        cusid: $scope.Source.selectItem['idcustomerinfo'],
                        utypeid: customer.idusertype,
                        del: 0,
                        index: 0
                    };
                    //给复选框赋值,否则将无法删除
                    customer.idref_customer_utype = data;
                } else {
                    delete $scope.service.refusertypeData[customer.idref_customer_utype];
                    delete customer.idref_customer_utype;
                }
            } else {
                alert.show('关系添加失败', '添加客户与用户角色关系');
                customer.checked = !customer.checked;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //用户组管理
    $scope.Refusergroup = function (customer) {
        $scope.params = new URLSearchParams();
        if ($scope.Source.Action != 18) {
            alert.show('非法操作', 'Error');
            return;
        }
        //勾选
        if (customer.checked) {
            $scope.params.append('ugroupid', customer.idusergroup);
            $scope.params.append('cusid', $scope.Source.selectItem.idcustomerinfo);
        } else {
            //取消勾选
            $scope.params.append("idref_customer_ugroup", customer.idref_customer_ugroup);
            $scope.url = __URL + 'Crmcustomerinfo/RefcusRefugroup/del_page_data';
        }
    }
    /*
    创建新联系人--点击事件
    data 成功后得回调、
    关闭模态框会返回'ok'
    */
    $scope.addContactClick = function () {
        $scope.service.title = "添加新的联系人";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Contact/openmodal';
        $scope.modalController = 'modalContactController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.contactData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.contactData[key] == undefined) {
                        $scope.Source.contactData[key] = angular.copy($scope.service.contactData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
        创建客户类型--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addCustypeClick = function () {
        $scope.service.title = "添加新的客户类型";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customertype/openmodal';
        $scope.modalController = 'modalcustomertypeController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customertypeData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customertypeData[key] == undefined) {
                        $scope.Source.customertypeData[key] = angular.copy($scope.service.customertypeData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
        创建客户等级--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addCuslevelClick = function () {
        $scope.service.title = "添加新的客户级别";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerlevel/openmodal';
        $scope.modalController = 'modalCustomerlevelController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customerlevelData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customerlevelData[key] == undefined) {
                        $scope.Source.customerlevelData[key] = angular.copy($scope.service.customerlevelData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
        创建客户行业--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addCusindustryClick = function () {
        $scope.service.title = "添加新的客户行业";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerindustry/openmodal';
        $scope.modalController = 'modelCustomerindustryController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customerindustryData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customerindustryData[key] == undefined) {
                        $scope.Source.customerindustryData[key] = angular.copy($scope.service.customerindustryData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
        创建客户来源--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addCussourceClick = function () {
        $scope.service.title = "添加新的客户来源";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customersource/openmodal';
        $scope.modalController = 'modalCustomersourceController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customersourceData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customersourceData[key] == undefined) {
                        $scope.Source.customersourceData[key] = angular.copy($scope.service.customersourceData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
        创建客户阶段--点击事件
        data 成功后得回调、
        关闭模态框会返回'ok'
    */
    $scope.addCusstageClick = function () {
        $scope.service.title = "添加新的客户阶段";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerstage/openmodal';
        $scope.modalController = 'modalCustomerstageController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customerstageData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customerstageData[key] == undefined) {
                        $scope.Source.customerstageData[key] = angular.copy($scope.service.customerstageData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
       创建客户状态--点击事件
       data 成功后得回调、
       关闭模态框会返回'ok'
   */
    $scope.addCusstatusClick = function () {
        $scope.service.title = "添加新的客户状态";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerstatus/openmodal';
        $scope.modalController = 'modalCustomerstatusController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customerstatusData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customerstatusData[key] == undefined) {
                        $scope.Source.customerstatusData[key] = angular.copy($scope.service.customerstatusData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建公司信息--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
   */
    $scope.addCuscompanyClick = function () {
        $scope.service.title = "添加新的公司信息";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customercompany/openmodal';
        $scope.modalController = 'modalCustomercompanyController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.cuscompanyData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.cuscompanyData[key] == undefined) {
                        $scope.Source.cuscompanyData[key] = angular.copy($scope.service.cuscompanyData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建信用等级--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
   */
    $scope.addCuscreditClick = function () {
        $scope.service.title = "添加新的信用等级";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customercredit/openmodal';
        $scope.modalController = 'modalCustomercreditController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customercreditData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customercreditData[key] == undefined) {
                        $scope.Source.customercreditData[key] = angular.copy($scope.service.customercreditData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建客户市场--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
   */
    $scope.addCusmarketClick = function () {
        $scope.service.title = "添加新的市场大区";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customermarket/openmodal';
        $scope.modalController = 'modalCustomermarketController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customermarketData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customermarketData[key] == undefined) {
                        $scope.Source.customermarketData[key] = angular.copy($scope.service.customermarketData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建客户地址--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addCuscityClick = function () {
        $scope.service.title = "添加新的客户地址";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customercity/openmodal';
        $scope.modalController = 'modalCustomercityController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.customercityData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.customercityData[key] == undefined) {
                        $scope.Source.customercityData[key] = angular.copy($scope.service.customercityData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建客户附件--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addCusannexClick = function () {
        $scope.service.title = "添加新的附件";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerannex/openmodal';
        $scope.modalController = 'modalCustomerannexController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.annexData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.annexData[key] == undefined) {
                        $scope.Source.annexData[key] = angular.copy($scope.service.annexData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建客户收货人--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addCusshipaddressClick = function () {
        $scope.service.title = "添加新的收货人";
        $scope.modalHtml = __URL + 'Crmcustomerinfo/Customershipaddress/openmodal';
        $scope.modalController = 'modalCustomershipaddressController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.shipaddressData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.shipaddressData[key] == undefined) {
                        $scope.Source.shipaddressData[key] = angular.copy($scope.service.shipaddressData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUserClick = function () {
        $scope.service.title = "添加新的用户";
        $scope.modalHtml = __URL + 'Crmuser/Users/openmodal';
        $scope.modalController = 'modalUsersController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.usersData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usersData[key] == undefined) {
                        $scope.Source.usersData[key] = angular.copy($scope.service.usersData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户角色--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUserTypeClick = function () {
        $scope.service.title = "添加新的用户角色";
        $scope.modalHtml = __URL + 'Crmuser/Usertype/openmodal';
        $scope.modalController = 'modalUsertypeController';
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
                var tempKeys = Object.keys($scope.service.usertypeData);
                for (var i = tempKeys.length - 1; i >= 0; i--) {
                    var key = tempKeys[i];
                    if ($scope.Source.usertypeData[key] == undefined) {
                        $scope.Source.usertypeData[key] = angular.copy($scope.service.usertypeData[key]);
                        continue;
                    }
                    break;
                }
            }
        });
    }
    /*
      创建用户组--点击事件
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addUsergroupClick = function (node) {
        $scope.service.selectItem = '';
        $scope.service.title = '新建用户组';
        $scope.modalHtml = __URL + 'Crmuser/Usergroup/openmodal';
        $scope.modalController = 'modalUsergroupController';
        if (node != undefined) {
            $scope.service.selectItem = node;
        }
        $scope.service.Action = 0;
        $scope.service.openModal($scope.modalHtml, $scope.modalController).then(function (data) {
            if (data == 'ok') {
               
            }
        });
    
       
    }
    /*
      扩展公司信息
      data 成功后得回调、
      关闭模态框会返回'ok'
    */
    $scope.addCompanyClick = function (selectItem) {
                $scope.modalHtml = __URL + 'Crmcustomerinfo/Customerrefcompany/openmodal';
                $scope.modalController = 'modelCustomerrefcompanyController';
                $scope.service.idcustomerinfo = selectItem.idcustomerinfo;
                $scope.service.title = selectItem.name;
                $scope.service.openModal($scope.modalHtml, $scope.modalController);
    }

    //根据客户id查询公司信息
    $scope.selectcompany = function (idcustomerinfo) {
        var params = new URLSearchParams();
        params.append('$where', JSON.stringify({ customerid: idcustomerinfo }));
        params.append('$find', true);
        dataService.postData(__URL + 'Crmcustomerinfo/Customerrefcompany/select_page_data', params).then(function (data) {
            return data;
        }, function (error) {
            console.log(error);
        });
    }

  
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);