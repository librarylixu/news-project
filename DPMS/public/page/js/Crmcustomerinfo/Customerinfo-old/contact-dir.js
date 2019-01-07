//添加编辑客户的控制器
appModule.controller('saveContactController', ["$scope",  'ngVerify', 'alert', 'confirm', function ($scope, ngVerify, alert, confirm) {
    $scope.service.contactData = [];
    /**
    *获取当前关联的联系人数据
    */
    $scope.selectContact = function () {
        var params = new URLSearchParams();
        // params.append('$json', true);
         //params.append('$fetchSql', true);
         params.append('$in', true);
         params.append('$findall', true);
        params.append('idcontact', $scope.service.selectItem.refcontactids);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Contact/select_page_data', params).then(function (data) {
            $scope.service.contactData = data;
        });
    }

    $scope.selectContact();
   
    /**
    *保存修改联系人
    */
    $scope.saveContact = function (item,type) {
        var params = new URLSearchParams();
        var url ='';
       
        if (type == 1) {

                    //编辑  
                    url = __URL + 'Crmcustomerinfo/Contact/update_page_data';
                    params.append('idcontact', item.idcontact);
                    params.append('name', item.name);
                    params.append('position', item.position);
                    params.append('mobilephone', item.mobilephone);
                    params.append('phone', item.phone);
                    //params.append('qqchat', item.qqchat);
                    params.append('email', item.email);
                    $scope.service.postData(url, params).then(function (data) {
                        if (data < 0) {
                            alert.show('Error!', '编辑联系人');
                            return;
                        }
                        if (type == 2) {
                            //更新客户数据
                            $scope.service.selectItem.refcontactids = contact_arr.join(',');
                            $scope.service.selectItem._kid = $scope.service.selectItem.idcustomerinfo;
                            $scope.service.updateData('customerinfoData', $scope.service.selectItem);
                            //更新联系人数据
                            var index = $scope.service.contactData.indexOf(item);
                            $scope.service.contactData.splice(index, 1);

                        }
                    });
          
            
       } else if (type == 2) {
                    var contact_arr = [];
                    confirm.show('确认删除？', '提示').then(function (data) {
                        if (data == 'ok') {
                            //删除  
                            url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';

                            if ($scope.service.selectItem.refcontactids) {
                                contact_arr = $scope.service.selectItem.refcontactids.split(',');
                                var index = contact_arr.indexOf(item.idcontact);
                                if (index > -1) {
                                    contact_arr.splice(index, 1);
                                }
                                params.append('refcontactids', contact_arr.join(','));
                                params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
                            }
                            $scope.service.postData(url, params).then(function (data) {
                                if (data < 0) {
                                    alert.show('Error!', '编辑联系人');
                                    return;
                                }
                                if (type == 2) {
                                    //更新客户数据
                                    $scope.service.selectItem.refcontactids = contact_arr.join(',');
                                    $scope.service.selectItem._kid = $scope.service.selectItem.idcustomerinfo;
                                    $scope.service.updateData('customerinfoData', $scope.service.selectItem);
                                    //更新联系人数据
                                    var index = $scope.service.contactData.indexOf(item);
                                    $scope.service.contactData.splice(index, 1);
                                }
                            });
                        }
                    });
                }
    }

    //单元格编辑保存
    $scope.saveConfix = function (item, confixname) {
        var params = new URLSearchParams();
        params.append('idcontact', item.idcontact);
        params.append(confixname, item[confixname]);
        $scope.service.postData(__URL + 'Crmcustomerinfo/Contact/update_page_data', params).then(function (data) {
            if (data < 0) {
                alert.show('Error!', '编辑联系人');
                return;
            }
            //更新联系人数据
            $scope.service.updateData('contactData', item);
        });

    }
    /**
       *添加联系人
       */
    $scope.addContact = function () {
        //添加
        var params = new URLSearchParams();        
        url = __URL + 'Crmcustomerinfo/Contact/add_page_data';
        params.append('name', '');
        params.append('position', '');
        params.append('mobilephone', '');
        params.append('phone', '');
        //params.append('qqchat', '');
        params.append('email', '');
        $scope.service.postData(url, params).then(function (data) {
            if (data < 0) {
                alert.show('Error!', '添加系人');
                return;
            }    
            //更新联系人数据
            var newContact = {idcontact:data,name:'',phone:'',mobilephone:'',email:'',_edit:true};
            $scope.service.contactData.push(newContact);
            //关联该联系人给客户
             var params = new URLSearchParams();
             var contact_arr = [];
              if ($scope.service.selectItem.refcontactids) {
                   contact_arr = $scope.service.selectItem.refcontactids.split(',');
             }
              contact_arr.push(data);
              params.append('refcontactids', contact_arr.join(','));
              params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
              $scope.service.postData(__URL + 'Crmcustomerinfo/Customerinfo/update_page_data', params).then(function (data) {
                  if (data['ok'] == 1) {
                      $scope.service.selectItem.refcontactids = data.refcontactids;
                      $scope.service.selectItem._kid = $scope.service.selectItem.idcustomerinfo;
                      $scope.service.updateData('customerinfoData', $scope.service.selectItem);
                  }
                   
             });
            
        });
        
    }
    
}]);
    