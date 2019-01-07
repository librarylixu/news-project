//添加编辑客户的控制器
appModule.controller('saveCustomerinfoController', ["$scope", "$uibModalInstance", 'dataService', 'alert', '$timeout', 'ngVerify', '$uibModal', '$uibModalInstance', function ($scope, $uibModalInstance, dataService, alert, $timeout, ngVerify,$uibModal, $uibModalInstance) {
    $scope.Source = angular.copy(dataService);
    $scope.service = dataService;
    //if ($scope.service.selectItem != undefined && $scope.service.selectItem.reftypeData == undefined) {
    //    $scope.service.selectItem.reftypeData = [];
    //}
    //地址
    $scope.url = __URL;
    //回车保存新建客户
    $scope.saveAddCustomer = function (e) {

        //IE 编码包含在window.event.keyCode中，Firefox或Safari 包含在event.which中
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            if (ngVerify.checkElement(customername, true)) {
                $scope.saveAdd();
                $scope.Source.editType = 0;
            }
        }
    };
    //打开地图模态框
    $scope.createmap = function (onlyone) {
        $timeout(function () {
            var map = new BMap.Map("l-map");    // 创建Map实例
            var pointarr = $scope.service.selectItem.mappoint.split(",");//因为拿到的数据是字符串类型，此处将字符串转数组，下面赋值的时候转成数字
            var point = new BMap.Point(parseFloat(pointarr[0]), parseFloat(pointarr[1]));//赋值一个坐标点
            map.centerAndZoom(point, 15);  // 初始化地图,设置中心点坐标和地图级别
            var geocoder = new BMap.Geocoder();
            var marker = new BMap.Marker(point);// 创建标注
            map.addOverlay(marker);             // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.enableDragging();            //可拖拽标注坐标点
            var opts = {
                width: 150,     // 信息窗口宽度
                height: 70,     // 信息窗口高度
                title: $scope.service.selectItem.name, // 信息窗口标题
            }
            var infoWindow = new BMap.InfoWindow("地址：" + ($scope.service.selectItem.address == undefined ? '暂未设置地址' : $scope.service.selectItem.address), opts);  // 创建信息窗口对象 
            marker.addEventListener("click", function () {
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            });
            //搜索之后返回到这里
            var local = new BMap.LocalSearch(map, {
                renderOptions: { map: map }
            });
            local.setMarkersSetCallback(function (pois) {
                //这里再存一下搜索后的第一个地址
                $scope.Source.pois = pois[0];
            })
            if (onlyone != true || $scope.service.selectItem.mappoint == "") {
                local.search($scope.service.selectItem.address);
            }
            map.addEventListener("click", function (e) { //给地图添加点击事件
                geocoder.getLocation(e.point, function (rs) {
                    //console.log(rs);  re里面包含了需要的地址的信息及坐标等
                    //此处进行一次脏检查
                    $scope.$apply(function () {
                        $scope.service.selectItem.address = rs.address;
                    })
                });
                //在此处存一下坐标（"116.404, 39.915"）
                $scope.Source.point = e.point.lng + ',' + e.point.lat;
            });
            

            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        }, 300);
    }
    //隐藏模态框
    $scope.Source.isopen = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $scope.hiddenmodal = function (index) {
        angular.forEach($scope.Source.isopen, function (value, key) {
            $scope.Source.isopen[key] = false;
        });
        if (index != undefined) {
            $scope.Source.isopen[index] = true;
        }        
    }
    //获取当前时间
    $scope.nowFormatDate = function () {
        return P_getNowFormatDate('-', 'yyyy-MM-dd HH:MM:SS');
    }
    //项目提示框title和代码段路径
    $scope.dynamicPopover = {
        templateUrl: __URL + 'Crmcustomerinfo/Customerinfo/statusChange',
        title_name_add: '添加客户',
        title_name: '修改客户名称',
        title_abbreviation: '修改简称',
        title_officephone: '修改办公电话',
        title_fax: '修改传真',
        title_address: '修改地址',
        title_url: '修改网址',
        title_maincontact: '修改主要联系人',
    };

    /**    
   *组建客户数据    
   */
    $scope.build_tagData = function () {
        //把全部的联系人，转换一下，用array存储
        $scope.Source.customercontactArrData = P_objecttoarray($scope.service.contactallData);
        //把当前的客户已关联联系人放到可选联系人中去
        if($scope.service.selectItem.refcontactData != undefined && $scope.service.selectItem.refcontactData.length>0){
            $scope.Source.customercontactArrData = $scope.Source.customercontactArrData.concat($scope.service.selectItem.refcontactData);
        }
       
        if (!$scope.service.selectItem.refstageData && $scope.service.selectItem.refstageids) {
            $scope.service.selectItem.refstageData = [];
            //组建客户阶段
            angular.forEach($scope.service.selectItem.refstageids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refstageData.push($scope.service.customerstageData[value]);
                }
                
            });
           
        }
        //组建客户市场大区分类
        if (!$scope.service.selectItem.refmarketData && $scope.service.selectItem.refmarketids) {
            $scope.service.selectItem.refmarketData = [];
            
            angular.forEach($scope.service.selectItem.refmarketids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refmarketData.push($scope.service.customermarketData[value]);
                }

            });

        }          
        if (!$scope.service.selectItem.refcreditData && $scope.service.selectItem.refcreditids) {
            //组建客户信用等级
            $scope.service.selectItem.refcreditData = [];
            angular.forEach($scope.service.selectItem.refcreditids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refcreditData.push($scope.service.customercreditData[value]);
                }

            });
           
        }         
        if (!$scope.service.selectItem.refstatusData && $scope.service.selectItem.refstatusids) {
            //组建客户状态
            $scope.service.selectItem.refstatusData = [];
            angular.forEach($scope.service.selectItem.refstatusids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refstatusData.push($scope.service.customerstatusData[value]);
                }

            });           
        }
        if (!$scope.service.selectItem.reftypeData && $scope.service.selectItem.reftypeids) {
            //组建客户类型
            $scope.service.selectItem.reftypeData = [];
            angular.forEach($scope.service.selectItem.reftypeids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.reftypeData.push($scope.service.customertypeData[value]);
                }

            });
           
        }
            
        if (!$scope.service.selectItem.refsourceData && $scope.service.selectItem.refsourceids) {
            //组建客户来源
            $scope.service.selectItem.refsourceData = [];
            angular.forEach($scope.service.selectItem.refsourceids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refsourceData.push($scope.service.customersourceData[value]);
                }

            });           
        }
            
        if (!$scope.service.selectItem.refindustryData && $scope.service.selectItem.refindustryids) {
            //组建客户行业
            $scope.service.selectItem.refindustryData = [];
            angular.forEach($scope.service.selectItem.refindustryids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refindustryData.push($scope.service.customerindustryData[value]);
                }

            });
            
        }
            
        if (!$scope.service.selectItem.reflevelData && $scope.service.selectItem.reflevelids) {
            //组建客户级别
            $scope.service.selectItem.reflevelData = [];
            angular.forEach($scope.service.selectItem.reflevelids.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.reflevelData.push($scope.service.customerlevelData[value]);
                }

            });
        }
            
        //组建关联的用户权限
        if (!$scope.service.selectItem.refuserData && $scope.service.selectItem.refusers) {
            $scope.service.selectItem.refuserData = [];
            angular.forEach($scope.service.selectItem.refusers.split(','), function (value) {
                if (value) {
                    $scope.service.selectItem.refuserData.push($scope.service.usersData[value]);
                }

            });
           
        }
        
       
    }
    if ($scope.service.Action != 0) {
        //组建属性数据
        $scope.build_tagData();
    }
    //添加客户保存方法
    $scope.saveAdd = function () {
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/add_page_data';
        //添加时做判断，防止没传时会存'undefined'
        if ($scope.Source.selectItem.name != undefined) {
            $scope.params.append('name', $scope.Source.selectItem.name);
        } else {
            $scope.params.append('name', '无');
        }
       
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            if (data.id < 1) {
                //添加失败
                parent.layer.msg('添加失败!', { icon: 5 });
            }
            //更新service数据源
            $scope.addNewData = {
                _kid: data.id,
                idcustomerinfo: data.id,
                guid: data.guid,
                name: $scope.Source.selectItem.name,
                createtime: data.createtime,
                abbreviation: $scope.Source.selectItem.abbreviation,
                officephone: $scope.Source.selectItem.officephone,
                fax: $scope.Source.selectItem.fax,
                address: $scope.Source.selectItem.address,
                url: $scope.Source.selectItem.url,
                userid: $scope.service.userid,
                refcontactData:[],
                del: 0,
                index: 0,
            }
            //if (Object.prototype.toString.call($scope.service.customerinfoData) == '[object Array]' && $scope.service.customerinfoData.length == 0) {
            //    $scope.service.customerinfoData = {};
            //}
            dataService.addData('customerinfoData', $scope.addNewData);
            $scope.service.selectItem = $scope.service.customerinfoData[$scope.addNewData._kid];

            $scope.Source.selectItem = $scope.service.customerinfoData[$scope.addNewData._kid];
            //更新地图数据
            if ($scope.Source.point != undefined) {
                $scope.service.selectItem.mappoint = $scope.Source.point;
            } else if ($scope.Source.pois != undefined) {
                $scope.service.selectItem.mappoint = $scope.Source.pois.point.lng + ',' + $scope.Source.pois.point.lat;
            }
            $scope.service.updateInfo($scope.service.selectItem);
            $uibModalInstance.close('ok');
        });
    }

    /*
    保存信息
    $item在添加本数据时 0一次添加 1连续添加 不关闭窗口
    $item在添加关系数据时 selecttype==0  true为选中，false为未选中
    */
    $scope.save = function () {

        $scope.params = new URLSearchParams();
        if ($scope.Source.Action == 2) {
            $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
            $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            $scope.params.append('del', 1);//表中有del字段，修改为1 表示已经删除了
        } else if ($scope.Source.Action == 1) {
            $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
            //修改信息，就需要传id
            $scope.params.append('idcustomerinfo', $scope.Source.selectItem.idcustomerinfo);
            //添加时做判断，防止没传时会存'undefined'
            if ($scope.Source.editType == 1) {
                $scope.params.append('name', $scope.Source.selectItem.name);
            }
            if ($scope.Source.editType == 3) {
                $scope.params.append('abbreviation', $scope.Source.selectItem.abbreviation);
            }
            if ($scope.Source.editType == 4) {
                $scope.params.append('officephone', $scope.Source.selectItem.officephone);
            }
            if ($scope.Source.editType == 5) {
                $scope.params.append('fax', $scope.Source.selectItem.fax);
            }
            if ($scope.Source.editType == 6) {
                $scope.params.append('address', $scope.service.selectItem.address);
                if ($scope.Source.point == undefined) {
                    $scope.Source.point = $scope.Source.pois.point.lng + ',' + $scope.Source.pois.point.lat;
                }
                $scope.params.append('mappoint', $scope.Source.point);
            }
            if ($scope.Source.editType == 7) {
                $scope.params.append('url', $scope.Source.selectItem.url);
            }
            if ($scope.Source.editType == 8) {
                $scope.params.append('maincontact', $scope.Source.selectItem.maincontact);
            }
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            switch ($scope.Source.Action) {
                case 0:
                    if (data.id < 1) {
                        //添加失败
                        parent.layer.msg('添加失败!', { icon: 5 });
                        break;
                    }
                    //更新service数据源
                    $scope.addNewData = {
                        _kid: data.id,
                        idcustomerinfo: data.id,
                        guid: data.guid,
                        name: $scope.Source.selectItem.name,
                        createtime: data.createtime,
                        abbreviation: $scope.Source.selectItem.abbreviation,
                        officephone:$scope.Source.selectItem.officephone,
                        fax:$scope.Source.selectItem.fax,
                        address:$scope.Source.selectItem.address,
                        url: $scope.Source.selectItem.url,
                        userid: $scope.service.userid,
                        del: 0,
                        index: 0,
                    }
                    if ($scope.service.customerinfoData.constructor == Array) {
                        $scope.service.customerinfoData = {};
                    }
                    dataService.addData('customerinfoData', $scope.addNewData);
                    $scope.service.selectItem = $scope.service.customerinfoData[$scope.addNewData._kid];

                    $scope.Source.selectItem = $scope.service.customerinfoData[$scope.addNewData._kid];
                    //更新地图数据
                    if ($scope.Source.point != undefined) {
                        $scope.service.selectItem.mappoint = $scope.Source.point;
                    } else {
                        $scope.service.selectItem.mappoint = $scope.Source.pois.point.lng + ',' + $scope.Source.pois.point.lat;
                    }
                    $scope.service.updateInfo($scope.service.selectItem);
                    $uibModalInstance.close('ok');
                    break;
                case 1:
                    if (data['ok'] == 1) {
                        //修改成功   
                        //$scope.Source.selectItem.idcustomerinfo= ;
                        $scope.Source.selectItem.updatetime = data.updatetime;
                        if ($scope.Source.selectItem.name != undefined) {
                            $scope.service.selectItem.name = $scope.Source.selectItem.name;
                        }
                        if ($scope.Source.selectItem.abbreviation != undefined) {
                            $scope.service.selectItem.abbreviation = $scope.Source.selectItem.abbreviation;
                        }
                        if ($scope.Source.selectItem.officephone != undefined) {
                            $scope.service.selectItem.officephone = $scope.Source.selectItem.officephone;
                        }
                        if ($scope.Source.selectItem.fax != undefined) {
                            $scope.service.selectItem.fax = $scope.Source.selectItem.fax;
                        }
                        if ($scope.Source.selectItem.url != undefined) {
                            $scope.service.selectItem.url = $scope.Source.selectItem.url;
                        }
                        $scope.Source.selectItem.address = $scope.service.selectItem.address;
                        if ($scope.Source.point != undefined) {
                            $scope.service.selectItem.mappoint = $scope.Source.point;
                        }
                        break;
                    }
                    //修改失败
                    parent.layer.msg('修改失败!', { icon: 5 });

                    break;
                case 2:
                    //删除
                    if (data['ok'] == 1) {
                        $uibModalInstance.close('ok');
                        parent.layer.msg('删除成功!', { icon: 6 });
                        delete $scope.service.customerinfoData[$scope.service.selectItem.idcustomerinfo];
                        break;
                    }
                    parent.layer.msg('删除失败!', { icon: 5 });
                    break;
            }
        }, function (error) {
            console.log(error);
        });
    };

   

    //联系人管理
    $scope.Refcontact = function ($item, selecttype) {
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        var contact_arr = [];
        if ($scope.service.selectItem.refcontactids) {
            contact_arr = $scope.service.selectItem.refcontactids.split(',');
        }       
        //勾选
        if (selecttype == 0) {
            contact_arr.push($item.idcontact);                   
        } else {
            //取消勾选
            var index = contact_arr.indexOf($item.idcontact);
            contact_arr.splice(index,1);
        }
        contact_arr = unique(contact_arr);//数组去重
        $scope.params.append('refcontactids', contact_arr.join(','));
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户类型关系添加
            if (data['ok']==1) {
                $item._kid=$item.idcontact;
                if (selecttype == 0) {
                    //更新客户数据源
                    $scope.service.selectItem.refcontactids = contact_arr.join(',');
                    //更新可选联系人数据
                    dataService.delData('contactallData',$item);
                } else {
                    //更新可选联系人数据
                    dataService.addData('contactallData',$item);
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户类型管理
    $scope.Reftype = function ($item, selecttype) {
        
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
       // $scope.params.append("$fetchSql",true)
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.reftypeData = [$item];
            $scope.params.append('reftypeids', $item.idcustomertype);           
        } else {
            $scope.params.append('reftypeids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户类型关系添加
            if (data['ok'] ==1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.reftypeids = $item.idcustomertype;
                } else {
                    $scope.service.selectItem.reftypeids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户等级管理
    $scope.Reflevel = function ($item,selecttype) {
      
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);      
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.reflevelData = [$item];
            $scope.params.append('reflevelids', $item.idcustomerlevel);
        }else{
            //取消勾选
            $scope.params.append("reflevelids", $item.idcustomerlevel);          
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户类型关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.reflevelids = $item.idcustomerlevel;
                } else {
                    $scope.service.selectItem.reflevelids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户行业管理
    $scope.Refindustry = function ($item, selecttype) {
        
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refindustryData = [$item];
            $scope.params.append('refindustryids', $item.idcustomerindustry);
        } else {
            //取消勾选
            $scope.params.append('refindustryids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户行业关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refindustryids = $item.idcustomerindustry;
                } else {
                    $scope.service.selectItem.refindustryids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户来源管理
    $scope.Refsource = function ($item, selecttype) {
       
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refsourceData = [$item];
            $scope.params.append('refsourceids', $item.idcustomersource);          
        } else {
            //取消勾选
            $scope.params.append('refsourceids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户来源关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refsourceids = $item.idcustomersource;
                } else {
                    $scope.service.selectItem.refsourceids = '';
                }              
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
                //selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户阶段管理
    $scope.Refstage = function ($item,selecttype) {
      
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);       
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refstageData = [$item];
            $scope.params.append('refstageids', $item.idcustomerstage);
           
        } else {
            //取消勾选
            $scope.params.append('refstageids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户阶段关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refstageids = $item.idcustomerstage;
                } else {
                    $scope.service.selectItem.refstageids = '';
                }     
                
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
                // selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户状态管理
    $scope.Refstatus = function ($item, selecttype) {
       
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refstatusData = [$item];
            $scope.params.append('refstatusids', $item.idcustomerstatus);
        } else {
            //取消勾选
            $scope.params.append('refstatusids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户状态关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refstatusids = $item.idcustomerstatus;
                } else {
                    $scope.service.selectItem.refstatusids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
                //selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
   
    //信用等级管理
    $scope.Refcredit = function ($item, selecttype) {
       
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refcreditData = [$item];
            $scope.params.append('refcreditids', $item.idcustomercredit);
            
        } else {
            //取消勾选
            $scope.params.append('refcreditids', $item.idcustomercredit);
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与信用等级关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refcreditids = $item.idcustomercredit;
                } else {
                    $scope.service.selectItem.refcreditids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
            }
        }, function (error) {
            console.log(error);
        });
    }
    //客户市场管理
    $scope.Refmarket = function ($item,selecttype) {
       
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            $scope.service.selectItem.refmarketData = [$item];
            $scope.params.append('refmarketids', $item.idcustomermarket);            
        } else {
            //取消勾选
           
            $scope.params.append('refmarketids', '');
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与客户市场关系添加
            if (data['ok'] == 1) {
                if (selecttype == 0) {
                    //更新service中的关系数据源---更新主控制器页面的关系
                    $scope.service.selectItem.refmarketids = $item.idcustomermarket;
                } else {
                    $scope.service.selectItem.refmarketids = '';
                }
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
                // selecttype==0 = !selecttype==0;
            }
        }, function (error) {
            console.log(error);
        });
    }
   
    //用户管理
    $scope.Refuser = function ($item, selecttype) {
        var user_arr = [];
        if ($scope.service.selectItem.refusers) {
            user_arr = $scope.service.selectItem.refusers.split(',');
        }
        $scope.params = new URLSearchParams();
        $scope.url = __URL + 'Crmcustomerinfo/Customerinfo/update_page_data';
        $scope.params.append('idcustomerinfo', $scope.service.selectItem.idcustomerinfo);
        //勾选
        if (selecttype == 0) {
            user_arr.push($item.idusers);
            $scope.params.append('refusers', user_arr.join(','));
            
        } else {
            //取消勾选
            var index = user_arr.indexOf($item.idusers);
            user_arr.splice(index,1);
            $scope.params.append('refusers', user_arr.join(','));
        }
        $scope.Source.postData($scope.url, $scope.params).then(function (data) {
            //与用户关系添加
            if (data['ok'] ==1) {              
                $scope.service.selectItem.refusers = user_arr.join(',');              
            } else {
                parent.layer.msg('关系添加失败!', { icon: 5 });
               
            }
        }, function (error) {
            console.log(error);
        });
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
