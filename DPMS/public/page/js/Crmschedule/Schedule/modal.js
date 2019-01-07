//添加编辑的控制器
/*
modal+业务+Controller

新增一个字段 _kid 值为当前数据源id的值
*/
//模态框控制器
//日期块模板控制器
appModule.controller('modalController', ['$scope', '$uibModalInstance', 'dataService', 'alert',  function ($scope, $uibModalInstance, dataService, alert) {
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
    //组件最终的tree数据源
    $scope.service.treedata = $scope.createNewData();
    //选中某项
    $scope.showSelected = function (sel) {
        $scope.selectedNode = sel;
        sel.checked = !sel.checked;
        $scope.save($scope.selectedNode);
        console.log($scope.Source.Action);
    };
    //此处判断点击的是哪个、关联用户还是联系人等等
    $scope.status = function (row) {
        $scope.Source.status = '';
        if(row == 3){
            var useridarr = $scope.Source.selectItem['refusers'].split(",");
            for (i = 0; i <= useridarr.length; i++) {
                if ($scope.Source.usersData[useridarr[i]] != undefined) {
                    $scope.Source.usersData[useridarr[i]].checked = true;
                }
            }
        } else if (row == 4) {
            var utypeidarr = $scope.Source.selectItem['refutypes'].split(",");
            for (i = 0; i <= utypeidarr.length; i++) {
                if ($scope.Source.usertypeData[utypeidarr[i]] != undefined) {
                    $scope.Source.usertypeData[utypeidarr[i]].checked = true;
                }
            }
        } else if (row == 5) {
            var ugroupidarr = $scope.Source.selectItem['refugroups'].split(",");
            for (i = 0; i <= ugroupidarr.length; i++) {
                if ($scope.Source.usergroupData[ugroupidarr[i]] != undefined) {
                    $scope.Source.usergroupData[ugroupidarr[i]].checked = true;
                }
            }
        } else if (row == 6) {
            var caontactidarr = $scope.Source.selectItem['refcontactid'].split(",");
            for (i = 0; i <= caontactidarr.length; i++) {
                if ($scope.Source.contactData[caontactidarr[i]] != undefined) {
                    $scope.Source.contactData[caontactidarr[i]].checked = true;
                }
            }
        } else if (row == 7) {
            var customeridarr = $scope.Source.selectItem['refcustomers'].split(",");
            for (i = 0; i <= customeridarr.length; i++) {
                if ($scope.Source.customerinfoData[customeridarr[i]] != undefined) {
                    $scope.Source.customerinfoData[customeridarr[i]].checked = true;
                }
            }
        } else if (row == 8) {
            var projectidarr = $scope.Source.selectItem['refprojects'].split(",");
            for (i = 0; i <= projectidarr.length; i++) {
                if ($scope.Source.projectData[projectidarr[i]] != undefined) {
                    $scope.Source.projectData[projectidarr[i]].checked = true;
                }
            }
        } else if (row == 9) {
            var workorderidarr = $scope.Source.selectItem['refworkorders'].split(",");
            for (i = 0; i <= workorderidarr.length; i++) {
                if ($scope.Source.workorderData[workorderidarr[i]] != undefined) {
                    $scope.Source.workorderData[workorderidarr[i]].checked = true;
                }
            }
        } else {
            alert.show('关联项丢失','日程管理');
        }
        $scope.Source.Action = row;
    }
    //取消按钮
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //确认按钮
    $scope.save = function (status) {
        var params = new URLSearchParams();
        url = __URL + "Crmschedule/Schedule/update_page_data";
        if ($scope.Source.Action == 3) {
            //勾选---关联用户
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refusers', $scope.Source.selectItem.refusers + ',' + status.idusers);
            } else {
                //取消勾选
                var useridarr = $scope.Source.selectItem['refusers'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = useridarr.indexOf(status.idusers);
                useridarr.splice(index, 1);
                params.append('refusers', useridarr.join(","));
            }
        } else if ($scope.Source.Action == 4) {
            //勾选---关联用户角色
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refutypes', $scope.Source.selectItem.refutypes + ',' + status.refutypes);
            } else {
                //取消勾选
                var utypeidarr = $scope.Source.selectItem['refutypes'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = utypeidarr.indexOf(status.idusertype);
                utypeidarr.splice(index, 1);
                params.append('refutypes', utypeidarr.join(","));
            }
        } else if ($scope.Source.Action == 5) {
            //关联用户组
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refugroups', $scope.Source.selectItem.refugroups + ',' + status.idusergroup);
            } else {
                //取消勾选
                var ugroupidarr = $scope.Source.selectItem['refugroups'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = ugroupidarr.indexOf(status.idusergroup);
                ugroupidarr.splice(index, 1);
                params.append('refugroups', ugroupidarr.join(","));
            }
        } else if ($scope.Source.Action == 6) {
            //关联联系人
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refcontactid', $scope.Source.selectItem.refcontactid + ',' + status.idcontact);
            } else {
                //取消勾选
                var contactidarr = $scope.Source.selectItem['refcontactid'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = contactidarr.indexOf(status.idcontact);
                contactidarr.splice(index, 1);
                params.append('refcontactid', contactidarr.join(","));
            }
        } else if ($scope.Source.Action == 7) {
            //关联客户
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refcustomers', $scope.Source.selectItem.refcustomers + ',' + status.idcustomerinfo);
            } else {
                //取消勾选
                var customeridarr = $scope.Source.selectItem['refcustomers'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = customeridarr.indexOf(status.idcustomerinfo);
                customeridarr.splice(index, 1);
                params.append('refcustomers', customeridarr.join(","));
            }
        } else if ($scope.Source.Action == 8) {
            //关联项目
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refprojects', $scope.Source.selectItem.refprojects + ',' + status.idproject);
            } else {
                //取消勾选
                var projectidarr = $scope.Source.selectItem['refprojects'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = projectidarr.indexOf(status.idproject);
                projectidarr.splice(index, 1);
                params.append('refprojects', projectidarr.join(","));
            }
        } else if ($scope.Source.Action == 9) {
            //关联工单
            if (status.checked) {
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                params.append('refworkorders', $scope.Source.selectItem.refworkorders + ',' + status.idworkorder);
            } else {
                //取消勾选
                var workorderidarr = $scope.Source.selectItem['refworkorders'].split(",");
                params.append('idschedule', $scope.Source.selectItem.idschedule);
                var index = workorderidarr.indexOf(status.idworkorder);
                workorderidarr.splice(index, 1);
                params.append('refworkorders', workorderidarr.join(","));
            }
        } else if ($scope.Source.Action == 2) {
            //delete
            params.append('idschedule', $scope.service.selectItem.idschedule);
            params.append('del', 1);
        } else {
            //add
            params.append('userid', 1);//这里的userid要放在tp控制器中，取session值
            url = __URL + "Crmschedule/Schedule/add_page_data";
            params.append('message', $scope.Source.selectItem.message);
            params.append('title', $scope.Source.selectItem.title);
            //此处进行判断,是否修改了时间，如果没修改就不存数据库
            //这里请注意，保存到数据库中是一个时间戳
            if ($scope.service.Action == 1 && $scope.service.selectItem.stime == $scope.Source.selectItem.stime) {
                params.append('stime', $scope.service.selectItem.startsAt / 1000);
            } else if ($scope.Source.selectItem.stime != undefined) {
                params.append('stime', parseInt($scope.Source.selectItem.stime.getTime()) / 1000);
            }
            if ($scope.service.Action == 1 && $scope.service.selectItem.etime == $scope.Source.selectItem.etime) {
                params.append('etime', $scope.service.selectItem.endsAt / 1000);
            } else if ($scope.Source.selectItem.etime != undefined) {
                params.append('etime', parseInt($scope.Source.selectItem.etime.getTime()) / 1000);
            }
            if ($scope.Source.selectItem.url != undefined) {
                params.append('url', $scope.Source.selectItem.url);
            }
            if ($scope.Source.selectItem.type != undefined) {
                params.append('classname', $scope.Source.selectItem.type);
            }
            if ($scope.Source.selectItem.color != undefined) {
                params.append('backgroundcolor', $scope.Source.selectItem.color.primary);
            }
            if ($scope.Source.selectItem.color != undefined) {
                params.append('bordercolor', $scope.Source.selectItem.color.secondary);
            }
            if ($scope.service.Action == 1) {
                //update
                url = __URL + "Crmschedule/Schedule/update_page_data";
                params.append('idschedule', $scope.Source.selectItem.idschedule);
            }
        }
        $scope.service.postData(url, params).then(
              function (data) {
                  if (data < 1) {
                      alert.show('保存失败', '日程管理');
                  } else if ($scope.service.Action == 2) {
                      //delete
                      var i = dataService.allData.indexOf(dataService.selectItem);
                      if (i > -1) {
                          dataService.allData.splice(i, 1);
                      }
                      $uibModalInstance.close();
                  } else if ($scope.Source.Action == 3) {
                      //关联用户
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refusers = $scope.Source.selectItem.refusers + ',' + status.idusers;
                          } else {
                              $scope.Source.selectItem.refusers = useridarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与用户关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 4) {
                      //关联用户角色
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refutypes = $scope.Source.selectItem.refutypes + ',' + status.idusertype;
                          } else {
                              $scope.Source.selectItem.refutypes = usertypeidarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与用户角色关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 5) {
                      //关联用户组
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refugroups = $scope.Source.selectItem.refugroups + ',' + status.idusergroup;
                          } else {
                              $scope.Source.selectItem.refugroups = usergroupidarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与用户组关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 6) {
                      //关联联系人
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refcontactid = $scope.Source.selectItem.refcontactid + ',' + status.idcontact;
                          } else {
                              $scope.Source.selectItem.refcontactid = contactidarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与联系人关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 7) {
                      //关联客户
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refcustomers = $scope.Source.selectItem.refcustomers + ',' + status.idcustomerinfo;
                          } else {
                              $scope.Source.selectItem.refcustomers = customeridarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与客户关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 8) {
                      //关联项目
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refprojects = $scope.Source.selectItem.refprojects + ',' + status.idproject;
                          } else {
                              $scope.Source.selectItem.refprojects = projectidarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与项目关系');
                      status.checked = !status.checked;
                  } else if ($scope.Source.Action == 9) {
                      //关联工单
                      if (data > 0) {
                          if (status.checked) {
                              //更新Source中的关系数据源
                              $scope.Source.selectItem.refworkorders = $scope.Source.selectItem.refworkorders + ',' + status.idworkorder;
                          } else {
                              $scope.Source.selectItem.refworkorders = workorderidarr.join(",");
                          }
                          return;
                      }
                      alert.show('关系添加失败', '添加日程与联系人关系');
                      status.checked = !status.checked;
                  } else {
                      //update add
                      $scope.service.selectItem.startsAt = new Date().setTime($scope.service.selectItem.stime * 1000);
                      $scope.service.selectItem.endsAt = new Date().setTime($scope.service.selectItem.etime * 1000);
                      if ($scope.service.Action == 0) {
                          alert.show('添加成功', '添加日程');
                          $scope.service.selectItem.idschedule = $scope.service.selectItem.calendarEventId = data;
                          dataService.addData($scope.service.selectItem);
                      } else if ($scope.service.Action == 1) {
                          alert.show('修改成功', '添加日程');
                          dataService.updateData($scope.service.selectItem);
                      }
                      $uibModalInstance.close();
                  }

              }, function () {
                  alert('失败了', '日程管理');
              }
         );
    };
}]);
  
