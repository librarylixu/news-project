
/*
自定义的会话类型按钮指令，开启会话从这里开启
*/
app.directive('eimRdp', function () {
    return { 
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/rdp_button',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                //rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : rowdevice[refstr]);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
           
            //初始化密码数据
            $scope.initData = function (rowdevice) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : [];
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_SessionButton = function (rowdevice) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['3'];
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.rowdevice.loginuser || !$scope.service.rowdevice.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idassetslist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: rowdevice.ipaddress,
                    devicename: rowdevice.devicename,
                    loginuser: rowdevice.loginuser,
                    loginpwd: rowdevice.loginpwd,
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    sessionsetting = JSON.parse(rowsession.setting);
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = rowdevice.devicename;
                //会话控制中心
                if (rowdevice.refsessioncenterid && rowdevice.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        if ($scope.service.rowsession.iddevicesessiontype != 9) {
                            var url = __URL + "Eimsessiontools/Sessiontool/open_session_page";
                            $scope.postdata.id = data.logid;
                            $scope.postdata.sessiontype = rowsession.typename;
                            P_Post(url, $scope.postdata, '_blank');
                            return;
                        }
                        var url = 'localsession://' + data.url;
                        window.location.href = url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
app.directive('eimSsh', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/ssh_button',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
          
            //初始化密码数据
            $scope.initData = function (rowdevice) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : [];
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_SessionButton = function (rowdevice) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['1'];
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.rowdevice.loginuser || !$scope.service.rowdevice.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idassetslist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: rowdevice.ipaddress,
                    devicename: rowdevice.devicename,
                    loginuser: rowdevice.loginuser,
                    loginpwd: rowdevice.loginpwd,
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    sessionsetting = JSON.parse(rowsession.setting);
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = rowdevice.devicename;
                if (rowdevice.refsessioncenterid && rowdevice.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        if ($scope.service.rowsession.iddevicesessiontype != 9) {
                            var url = __URL + "Eimsessiontools/Sessiontool/open_session_page";
                            $scope.postdata.id = data.logid;
                            $scope.postdata.sessiontype = rowsession.typename;
                            P_Post(url, $scope.postdata, '_blank');
                            return;
                        }
                        var url = 'localsession://' + data.url;
                        window.location.href = url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
app.directive('eimVnc', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/vnc_button',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
           
            //初始化密码数据
            $scope.initData = function (rowdevice) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : [];
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_SessionButton = function (rowdevice) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['5'];
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.rowdevice.loginuser || !$scope.service.rowdevice.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idassetslist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: rowdevice.ipaddress,
                    devicename: rowdevice.devicename,
                    loginuser: rowdevice.loginuser,
                    loginpwd: rowdevice.loginpwd,
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    sessionsetting = JSON.parse(rowsession.setting);
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = rowdevice.devicename;
                if (rowdevice.refsessioncenterid && rowdevice.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        if ($scope.service.rowsession.iddevicesessiontype != 9) {
                            var url = __URL + "Eimsessiontools/Sessiontool/open_session_page";
                            $scope.postdata.id = data.logid;
                            $scope.postdata.sessiontype = rowsession.typename;
                            P_Post(url, $scope.postdata, '_blank');
                            return;
                        }
                        var url = 'localsession://' + data.url;
                        window.location.href = url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
app.directive('eimTelnet', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/telnet_button',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
           
            //初始化密码数据
            $scope.initData = function (rowdevice) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : [];
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_SessionButton = function (rowdevice) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['2'];
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.rowdevice.loginuser || !$scope.service.rowdevice.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idassetslist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: rowdevice.ipaddress,
                    devicename: rowdevice.devicename,
                    loginuser: rowdevice.loginuser,
                    loginpwd: rowdevice.loginpwd,
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    sessionsetting = JSON.parse(rowsession.setting);
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = rowdevice.devicename;
                if (rowdevice.refsessioncenterid && rowdevice.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        if ($scope.service.rowsession.iddevicesessiontype != 9) {
                            var url = __URL + "Eimsessiontools/Sessiontool/open_session_page";
                            $scope.postdata.id = data.logid;
                            $scope.postdata.sessiontype = rowsession.typename;
                            P_Post(url, $scope.postdata, '_blank');
                            return;
                        }
                        var url = 'localsession://' + data.url;
                        window.location.href = url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
app.directive('eimLocal', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/local_button',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
            
            //初始化密码数据
            $scope.initData = function (rowdevice) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : [];
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_SessionButton = function (rowdevice) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['9'];
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.rowdevice.loginuser || !$scope.service.rowdevice.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice,kvmdata, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idkvmportlist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: kvmdata.ipaddress,
                    devicename: kvmdata.devicename,
                    loginuser: kvmdata.loginuser,
                    loginpwd: kvmdata.loginpwd,
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    try {
                        sessionsetting = JSON.parse(rowsession.setting);
                    } catch (e) {
    
                    }
                   
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = kvmdata.devicename;
                if (kvmdata.refsessioncenterid && kvmdata.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        var url = 'localsession://' + data.url;
                        window.location.href = url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    
    }
});

app.directive('localKvm', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/local_mpu',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};

                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
          
            //初始化密码数据
            $scope.initData = function (rowdevice, kvmdata,rowsession) {
                //设备关联的密码
                rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : (kvmdata.refpwdids ? kvmdata.refpwdids.split(',') : []);
                //设备关联用户组
                rowdevice.refugroup = rowdevice.refugroup ? rowdevice.refugroup.split(',') : (kvmdata.refugroup ? kvmdata.refugroup.split(',') : []);
                //设备关联设备组
                rowdevice.refdgroup = rowdevice.refdgroup ? rowdevice.refdgroup.split(',') : (kvmdata.refdgroup ? kvmdata.refdgroup.split(',') : []);
                //设备关联用户
                rowdevice.refusers = rowdevice.refusers ? rowdevice.refusers.split(',') : (kvmdata.refusers ? kvmdata.refusers.split(',') : []);
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup.length > 0) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup.length > 0) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers.length > 0) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, rowsession);
                        return; 
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);
                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_localkvmSessionButton = function (rowdevice, kvmdata) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['6'];
                $scope.service.kvmdata = kvmdata;
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.kvmdata.loginuser || !$scope.service.kvmdata.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice, $scope.service.kvmdata, $scope.service.rowsession);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.kvmdata, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, kvmdata, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idkvmportlist;
                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = rowdevice.deviceid;
                $scope.postdata.refdevicetype = rowdevice.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: kvmdata.ipaddress,
                    devicename: kvmdata.devicename,
                    loginuser: kvmdata.loginuser,
                    loginpwd: kvmdata.loginpwd,
                    eid: rowdevice.eid
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (rowdevice.sessionsetting != undefined && rowdevice.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    sessionsetting = JSON.parse(rowsession.setting);
                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = kvmdata.devicename;
                if (kvmdata.refsessioncenterid && kvmdata.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = rowdevice.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
app.directive('dsvKvm', function () {
    return {
        restrict: 'ECAM',
        templateUrl: '/index.php/Eimbase/Directive/dsv_kvm',
        replace: true,
        controller: function ($scope) {
            //console.log($scope.service.Directive_SessionButtonData);
            //循环密码规则，查找所有有关该设备的所有规则中关联的密码
            $scope.cyclePasswordRule = function (id, rowdevice) {
                // rowdevice.refpasswordruleData = {};
                angular.forEach($scope.service.proxypwdruleData, function (value, key) {
                    //当前规则关联的设备组id
                    var idArr = value.refdgroupids ? value.refdgroupids.split(',') : [];
                    //当前规则关联的用户id
                    var useridArr = value.refusers ? value.refusers.split(',') : [];
                    //当前规则的关联的用户组
                    var ugroupArr = value.refugroup ? value.refugroup.split(',') : [];
                    //当前用户的关联的用户组
                    var myugroupArr = $scope.service.usergroupid ? $scope.service.usergroupid.split(',') : [];
                    //地标，true则该规则可用，false则不可用
                    var flag = false;
                    //当当前用户不存在在该规则关联的用户中时，不采用该条规则
                    if (useridArr.indexOf($scope.service.userid) < 0) {
                        //循环当前用户关联的用户组的id
                        angular.forEach(myugroupArr, function (val) {
                            if (ugroupArr.indexOf(val) >= 0) {
                                flag = true;
                                return;
                            };
                        });
                        if (!flag) {
                            return;
                        }
                    };

                    if (idArr.indexOf(id) >= 0) {
                        // rowdevice.refpasswordruleData[key] = value;                        
                        //规则关联的密码
                        value.refpwdids = value.refpwdids ? value.refpwdids.split(',') : [];
                        rowdevice.pwdids = rowdevice.pwdids.concat(value.refpwdids);
                    }
                });
                //合并关联的密码并去重
                if (rowdevice.pwdids.length > 0) {
                    rowdevice.pwdids = unique(rowdevice.pwdids);
                }

            }

            //循环设备组，用户，用户组关系，用来查询关联规则中的密码
            $scope.refSeach = function (refstr, rowdevice) {
                rowdevice[refstr] = (rowdevice[refstr].split ? rowdevice[refstr].split(',') : []);
                angular.forEach(rowdevice[refstr], function (value) {
                    $scope.cyclePasswordRule(value, rowdevice);
                });
            }
           
            //初始化密码数据
            $scope.initData = function (rowdevice, kvmdata, rowsession) {
                if (rowdevice.refpwdids.split) {
                    //设备关联的密码
                    rowdevice.pwdids = rowdevice.refpwdids ? rowdevice.refpwdids.split(',') : (kvmdata.refpwdids ? kvmdata.refpwdids.split(',') : []);
                }
                if (rowdevice.refugroup.split) {
                    //设备关联用户组
                    rowdevice.refugroup = rowdevice.refugroup ? rowdevice.refugroup.split(',') : (kvmdata.refugroup ? kvmdata.refugroup.split(',') : []);
                }
                if (rowdevice.refdgroup.split) {
                    //设备关联设备组
                    rowdevice.refdgroup = rowdevice.refdgroup ? rowdevice.refdgroup.split(',') : (kvmdata.refdgroup ? kvmdata.refdgroup.split(',') : []);
                }
                if (rowdevice.refusers.split) {
                    //设备关联用户
                    rowdevice.refusers = rowdevice.refusers ? rowdevice.refusers.split(',') : (kvmdata.refusers ? kvmdata.refusers.split(',') : []);
                }
               
                //可选密码数据源
                $scope.service.myproxypasswordData = [];
                //判断是否关联了设备组，用户，用户组
                if (rowdevice.refdgroup.length > 0) {
                    $scope.refSeach('refdgroup', rowdevice);
                } else if (rowdevice.refugroup.length > 0) {
                    $scope.refSeach('refugroup', rowdevice);
                } else if (rowdevice.refusers.length > 0) {
                    $scope.refSeach('refusers', rowdevice);
                }
                //判断是否有匹配的密码规则
                if (rowdevice.pwdids && rowdevice.pwdids.length > 0) {
                    //判断是否有多个匹配的密码规则
                    if (rowdevice.pwdids.length == 1) {
                        rowdevice.loginuser = $scope.service.proxypasswordData[rowdevice.pwdids[0]].login;
                        rowdevice.loginpwd = $scope.service.proxypasswordData[rowdevice.pwdids[0]].pwd;
                        $scope.service.CreateSessionWorkLog(rowdevice, $scope.service.rowsession);
                        return;
                    }
                    //可选密码数据源
                    $scope.service.myproxypasswordData = [];
                    angular.forEach(rowdevice.pwdids, function (value) {
                        if ($scope.service.privateDateObj.proxypasswordData[value]) {
                            $scope.service.myproxypasswordData.push($scope.service.proxypasswordData[value]);
                        }
                    });

                    $scope.service.openmodel('选择要使用的密码规则', 0);

                } else {
                    $scope.service.openmodel('输入账号&密码', 1);
                }
            }

            //本页面所需数据初始化
            $scope.data_select = function () {
                var params = new URLSearchParams();
                params.append('$json', true);
                //获取设备组数据
                select_devicegroup(params).then(function () {
                    //获取密码规则数据
                    select_proxypasswordrule(params).then(function () {
                        //获取密码数据
                        select_proxypassword(params);
                    });
                });
            }

            $scope.data_select();
            /*
                2018年4月28日 18:12:26
                添加会话按钮
            */
            $scope.btn_Directive_dsvkvmSessionButton = function (rowdevice, kvmdata) {
                //检测浏览器 
                var is_Browser = P_checkBrowser();
                if (is_Browser != "ok") {
                    layer.msg(is_Browser, { icon: 5 });
                    return;
                }
                $scope.service.rowdevice = rowdevice;
                $scope.service.rowsession = $scope.service.privateDateObj.devicesessiontypeData['7'];
                $scope.service.kvmdata = kvmdata;
                //检查当前设备是否已开启会话 0：空闲，1：使用中
                if ($scope.service.rowdevice.sessionstatus == "1") {
                    $scope.service.openmodel('选择开会话的方式', 2);
                    return;
                }
                //检测当前设备开启会话时，是否需要手动输入帐号密码 0：不需要，1：需要
                if ($scope.service.rowdevice.isenterpwd == "1") {
                    var enterpwdUserlist_Arr = rowdevice.refenterpwd ? rowdevice.refenterpwd.split(',') : [];
                    var index = enterpwdUserlist_Arr.indexOf($scope.service.userid);
                    if (index < 0) {
                        //弹出输入账号密码的输入框                   
                        $scope.service.openmodel('输入账号&密码', 1);
                        return;
                    }
                }
                //检测设备帐号密码是否已设置
                if (!$scope.service.kvmdata.loginuser || !$scope.service.kvmdata.loginpwd) {
                    //请设置帐号密码
                    //组建所有关联的密码id的数据

                    $scope.initData($scope.service.rowdevice, $scope.service.kvmdata, $scope.service.rowsession);
                    return;
                }
                $scope.service.CreateSessionWorkLog($scope.service.rowdevice, $scope.service.kvmdata, $scope.service.rowsession);
            }
            //创建工单
            $scope.service.CreateSessionWorkLog = function (rowdevice, kvmdata, rowsession) {
                var url;
                if (!$scope.postdata) {
                    $scope.postdata = new Object();
                    $scope.postdata.id = rowdevice.idkvmportlist;

                }
                $scope.postdata.sessiontypeid = rowsession.iddevicesessiontype;
                $scope.postdata.sessiontypename = rowsession.typename;
                $scope.postdata.status = 0;
                $scope.postdata.refdeviceid = kvmdata.deviceid;
                $scope.postdata.refdevicetype = kvmdata.modeltypeid;//保存表名称，暂时存id              
                //是否需要手动输入密码，是，则后台需要将密码加密
                $scope.postdata.is_pwd_decode = $scope.service.rowdevice.isenterpwd;
                var deviceinfo = {
                    ip: kvmdata.ipaddress,
                    devicename: kvmdata.devicename,
                    loginuser: kvmdata.loginuser,
                    loginpwd: kvmdata.loginpwd,
                    eid: rowdevice.eid
                };
                // postdata.deviceinfo = JSON.stringify(deviceinfo);
                $scope.postdata.deviceinfo = JSON.stringify(deviceinfo);
                var sessionsetting = {};
                if (kvmdata.sessionsetting != undefined && kvmdata.sessionsetting != "") {
                    sessionsetting = JSON.parse(rowdevice.sessionsetting);
                } else {
                    try {
                        sessionsetting = JSON.parse(rowsession.setting);
                    } catch (e) {
                        sessionsetting = '';
                    }

                }
                //将off值去掉
                angular.forEach(sessionsetting, function (value, key) {
                    if (value.toString() == "off") {
                        delete sessionsetting[key];
                    }
                });

                var settings = {};
                settings[rowsession.typename] = sessionsetting;
                $scope.postdata.settings = JSON.stringify(settings);
                $scope.postdata.olddevicename = kvmdata.devicename;
                if (kvmdata.refsessioncenterid && kvmdata.refsessioncenterid != "") {
                    $scope.postdata.sessioncenterid = kvmdata.refsessioncenterid;
                }
                //会话开启方式:0创建/1抢占/2加入
                $scope.postdata.starttype = 0;
                $scope.service.postData(__URL + 'Eimsystemsetting/Devicesessiontype/get_local_url', $scope.postdata).then(function (data) {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        layer.msg("工单添加失败，请重试", { icon: 5 });
                    }
                }, function (errmsg) {
                    parent.layer.open({
                        title: "提示",
                        content: '工单添加失败，请重试！',
                        end: function (index, layero) {
                            window.close();
                        }
                    });
                });
            }
        }
    }
});
