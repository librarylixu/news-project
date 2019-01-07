//添加编辑客户的控制器
appModule.controller('saveCustomerinfoController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', '$uibModal', '$uibModalInstance', function ($scope, $uibModalInstance, dataService, ngVerify,$uibModal, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    /**
     *获取当前关联的联系人数据
     */
    $scope.selectContact = function () {
        var params = new URLSearchParams();       
        params.append('$in', true);
        params.append('$findall', true);
        params.append('idcontact', $scope.service.selectItem.refcontactids);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Contact/select_page_data', params).then(function (data) {
            $scope.service.contactData = data;
        });
    }
    //校验客户查重
    $scope.check = function () {
        var params = new URLSearchParams();
        params.append('name', $scope.Source.selectItem.name);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/check_data', params).then(function (data) {
            if (data) {
                $scope.Source.check = true;
                ngVerify.setError('#check', '客户已存在') //以id标记错误
            } else {
                $scope.Source.check = false;
                ngVerify.setError('#check') //以id取消标记错误
            }
        });
    }
    
    //添加
    $scope.add_contact = function () {
        $scope.service.title = '添加联系人';
        $scope.service.openModal(__URL + 'Crmcustomerinfo/Customerinfo/contact_model', 'crmContactModelController').then(function (result) {
            $scope.saveContatct(result);
        });
    }
    //编辑
    $scope.edit_contact = function (item) {
        $scope.service.title = '编辑联系人';
        $scope.service.contact = item;
        $scope.service.openModal(__URL + 'Crmcustomerinfo/Customerinfo/contact_model', 'crmContactModelController').then(function (result) {
            $scope.saveContatct(result, item);
        });
    }
    //删除联系人
    $scope.del_contact = function (item) {
       
        var index = parent.layer.open({
            content: '确认删除联系人【' + item.name+'】，是否确认？'
          , btn: ['确认', '我再想想']
          , icon: 6
          , area: ['400px']
          , title: '删除联系人'
          , yes: function (index, layero) {
              //按钮【按钮一】的回调
              
              $scope.saveContatct('', item);
              //$scope.save();
             
              parent.layer.close(index);
          }
        });
       
    }
    /*
    *联系人的增删改方法
    *result  模态框返回的联系人数据（如果为删除动作时，没有这个参数，则传空字符串）
    *item  当前操作的联系人数据（如果是增加动作不传这个参数）
    *******/
    
    $scope.saveContatct = function (result, item) {
        var contact_url;
        var params = new URLSearchParams();
        //把关联的联系人id的字符串转为数组，如果没有关联则等于空数组
        var refcontact_Arr = $scope.Source.selectItem.refcontactids?$scope.Source.selectItem.refcontactids.split(','):[];
        if (result&&item) {//编辑联系人
            contact_url = __URL + 'Crmcustomerinfo/Contact/update_page_data';
            params.append('idcontact', item.idcontact);
            angular.forEach(result, function (value, key) {
                if (value != item[key]) {
                    params.append(key, value);
                }
            });
        } else if (!result && item) {//取消该联系人与客户的关系
            //更新联系人数据
            var num = $scope.service.contactData.indexOf(item);
            $scope.$applyAsync(function () {
                if (num > -1) {
                    $scope.service.contactData.splice(num, 1);
                }               
            });
            //更新客户关联的联系人id的字段
                if (refcontact_Arr.indexOf(item.idcontact) > -1) {
                    refcontact_Arr.splice(refcontact_Arr.indexOf(item.idcontact), 1);
                }
                $scope.Source.selectItem.refcontactids = refcontact_Arr.join(',');
               
        } else if (result && !item) { //增加联系人并关联给该客户         
            contact_url = __URL + 'Crmcustomerinfo/Contact/add_page_data';
            //增加联系人时，如果有些字段值为空，则不传给后台
            angular.forEach(result, function (value, key) {
                if (value) {
                    params.append(key, value);
                }
            });
        }
        if (contact_url) {
            $scope.Source.postData(contact_url, params).then(function (data) {
                if (data > 0) {
                    //添加成功
                    if (!item) {
                        refcontact_Arr.push(data);
                        $scope.Source.selectItem.refcontactids = refcontact_Arr.join(',');                        
                        result.idcontact = data;
                        $scope.service.contactData.push(result);
                      //  $scope.save();
                    } else {
                        //编辑成功
                       
                        angular.forEach(result, function (value, key) {
                            if (value != item[key]) {
                                var num = $scope.service.contactData.indexOf(item);
                                if (num > -1) {
                                    $scope.service.contactData[num][key] = value;
                                }
                               
                            }
                        });
                       
                       
                    }
                }
            });
        }
    }
    //获取当前时间
    $scope.nowFormatDate = function () {
        return P_getNowFormatDate('-', 'yyyy-MM-dd HH:MM:SS');
    }   
    /**    
   *组建默认关联数据    
   */
    $scope.build_tagData = function () {       
        
        //组建关联的用户权限
        if ($scope.Source.selectItem.refusers && Object.prototype.toString.call($scope.Source.selectItem.refusers) !=='[object Array]') {
            $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers.split(',');
        }
    }
    if ($scope.service.Action != 0) {
        //组建属性数据
        $scope.build_tagData();
        $scope.selectContact();
    } else {
        $scope.service.contactData = [];
    }
    /*
    保存信息  
    */
    $scope.save = function () {
        if (!$scope.Source.selectItem.refcontactids) {
            parent.layer.msg('请添加至少一个联系人！', { icon: 0 });
            return;
        }
        var url;
        var params = new URLSearchParams();      
        if ($scope.service.Action == '0') {
            url = __URL + 'Crmcustomerinfo/Customerinfo/add_page_data';
        }else if ($scope.service.Action == '1') {
            url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data'
            params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
        }
        if ($scope.Source.selectItem.name != $scope.service.selectItem.name) {
            params.append('name', $scope.Source.selectItem.name);
        }
        if ($scope.Source.selectItem.refcontactids != $scope.service.selectItem.refcontactids) {
            params.append('refcontactids', $scope.Source.selectItem.refcontactids);
        }
        if ($scope.Source.selectItem.abbreviation&&$scope.Source.selectItem.abbreviation != $scope.service.selectItem.abbreviation) {
            params.append('abbreviation', $scope.Source.selectItem.abbreviation);
        }
        if ($scope.Source.selectItem.officephone&&$scope.Source.selectItem.officephone != $scope.service.selectItem.officephone) {
            params.append('officephone', $scope.Source.selectItem.officephone);
        }       
        if ($scope.Source.selectItem.fax&&$scope.Source.selectItem.fax != $scope.service.selectItem.fax) {
            params.append('fax', $scope.Source.selectItem.fax);
        }
        if ($scope.Source.selectItem.address&&$scope.Source.selectItem.address != $scope.service.selectItem.address) {
           params.append('address', $scope.Source.selectItem.address);
        }
        if ($scope.Source.selectItem.url&&$scope.Source.selectItem.url != $scope.service.selectItem.url) {
            params.append('url', $scope.Source.selectItem.url);
        }
        if ($scope.Source.selectItem.maincontact && $scope.Source.selectItem.maincontact != $scope.service.selectItem.maincontact) {
           params.append('maincontact', $scope.Source.selectItem.maincontact);
        }
        if ($scope.Source.selectItem.reftypeids && $scope.Source.selectItem.reftypeids != $scope.service.selectItem.reftypeids) {
           params.append('reftypeids', $scope.Source.selectItem.reftypeids);
        }
        if ($scope.Source.selectItem.reflevelids && $scope.Source.selectItem.reflevelids != $scope.service.selectItem.reflevelids) {
           params.append('reflevelids', $scope.Source.selectItem.reflevelids);
        }
        if ($scope.Source.selectItem.refindustryids && $scope.Source.selectItem.refindustryids != $scope.service.selectItem.refindustryids) {
            params.append('refindustryids', $scope.Source.selectItem.refindustryids);
        }
        if ($scope.Source.selectItem.refsourceids && $scope.Source.selectItem.refsourceids != $scope.service.selectItem.refsourceids) {
            params.append('refsourceids', $scope.Source.selectItem.refsourceids);
        }
        if ($scope.Source.selectItem.refmarketids && $scope.Source.selectItem.refmarketids != $scope.service.selectItem.refmarketids) {
            params.append('refmarketids', $scope.Source.selectItem.refmarketids);
        }
        if ($scope.Source.selectItem.refcreditids && $scope.Source.selectItem.refcreditids != $scope.service.selectItem.refcreditids) {
            params.append('refcreditids', $scope.Source.selectItem.refcreditids);
        }
        if ($scope.Source.selectItem.refstatusids && $scope.Source.selectItem.refstatusids != $scope.service.selectItem.refstatusids) {
           params.append('refstatusids', $scope.Source.selectItem.refstatusids);
        }
        if ($scope.Source.selectItem.refstageids && $scope.Source.selectItem.refstageids != $scope.service.selectItem.refstageids) {
            params.append('refstageids', $scope.Source.selectItem.refstageids);
        }
        if ($scope.Source.selectItem.refusers && $scope.Source.selectItem.refusers.join(',') != $scope.service.selectItem.refusers) {           
            params.append('refusers', $scope.Source.selectItem.refusers.join(","));
        }
        $scope.Source.postData(url, params).then(function (data) {
            if (data['ok'] == 1 || data['createtime']) {
                if ($scope.Source.Action == '0') {
                    var postdata = {
                        idcustomerinfo: data['id'],
                        name: $scope.Source.selectItem.name,
                        userid: $scope.service.userid,
                        guid: data.guid,
                        createtime: data.createtime,
                        abbreviation: $scope.Source.selectItem.abbreviation,
                        officephone: $scope.Source.selectItem.officephone ? $scope.Source.selectItem.officephone : null,
                        fax: $scope.Source.selectItem.fax ? $scope.Source.selectItem.fax : null,
                        address: $scope.Source.selectItem.address ? $scope.Source.selectItem.address : null,
                        url: $scope.Source.selectItem.url ? $scope.Source.selectItem.assignid.url : null,
                        maincontact: $scope.Source.selectItem.maincontact ? scope.Source.selectItem.maincontact : null,
                        reftypeids: $scope.Source.selectItem.reftypeids ? $scope.Source.selectItem.reftypeids : null,
                        reflevelids: $scope.Source.selectItem.reflevelids ? $scope.Source.selectItem.reflevelids : null,
                        refindustryids: $scope.Source.selectItem.refindustryids ? $scope.Source.selectItem.refindustryids : null,
                        refsourceids: $scope.Source.selectItem.refsourceids ? $scope.Source.selectItem.refsourceids : null,
                        refmarketids: $scope.Source.selectItem.refmarketids ? $scope.Source.selectItem.refmarketids : null,
                        refcreditids: $scope.Source.selectItem.refcreditids ? $scope.Source.selectItem.refcreditids : null,
                        refstatusids: $scope.Source.selectItem.refstatusids ? $scope.Source.selectItem.refstatusids : null,
                        refstageids: $scope.Source.selectItem.refstageids ? $scope.Source.selectItem.refstageids : null,
                        refusers: $scope.Source.selectItem.refusers ? $scope.Source.selectItem.refusers : null,
                        refcontactids: $scope.Source.selectItem.refcontactids ? $scope.Source.selectItem.refcontactids : null,
                        del: 0,
                        index: 0,
                    }
                    parent.layer.msg('添加成功', { icon: 1 });
                    postdata._kid = data['id'];
                    $scope.Source.addData('customerinfoData', postdata);
                    $scope.Source.addData('customerinfoDataArr', postdata);
                    $uibModalInstance.close('ok');
                } else if ($scope.Source.Action == '1') {
                    parent.layer.msg('编辑成功', { icon: 1 });
                    angular.forEach(data, function (value, key) {
                        if (key != 'ok' && key != 'idcustomerinfo') {
                            $scope.service.selectItem[key] = value;
                        }
                    });
                    $scope.service.selectItem['_kid'] = $scope.Source.selectItem.idcustomerinfo;
                    $scope.Source.updateData('customerinfoData', $scope.service.selectItem);
                     $uibModalInstance.close('ok');                 
                }
            } else {
                parent.layer.msg('错误', { icon: 0 });
            }           
        });        
    };
    //组建清单数据
    $scope.buildProjectlistData = function () {

    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]).controller('crmContactModelController', ["$scope", "$uibModalInstance", 'dataService', 'ngVerify', '$uibModal', '$uibModalInstance', function ($scope, $uibModalInstance, dataService, ngVerify, $uibModal, $uibModalInstance) {
    $scope.service = dataService;
    $scope.Source = angular.copy(dataService);
}]);
