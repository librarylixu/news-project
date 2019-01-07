    //_$scope.service = _$scope.service;//要显示到页面上的数据源
    ////存储用户id（当前仅用来判断是否是管理员）
//_$scope.service.userid = _userid;
var _$scope = {};
var _$q = {};

/*
params,@查询条件 
type@控制命令
        status:1 强制查询/强制刷新
        index:returndata 把结果直接返回,不更新service
dataname  缓存变量名称 'customerinfoData'
dataurl   请求后台的url地址   __URL + 'Crmcustomerinfo/Customerinfo/select_page_data'

*/
//公共方法
function private_commonselect(params, type, dataname, dataurl) {
    var defer = _$q.defer();//延迟处理
    if (params == null || params == undefined) {
        params = {};
    }

    if (_$scope.service.privateDateObj[dataname] == undefined || Object.keys(_$scope.service.privateDateObj[dataname]).length < 1 || (type != undefined && type['status'] == 1)) {
        _$scope.service.postData(dataurl, params).then(function (data) {
            if (type != undefined && type['index'] == 'returndata') {
                defer.resolve(data);
            } else {
                //数据放到共享池里
                _$scope.service.privateDateObj[dataname] = data;
                _$scope.service[dataname] = _$scope.service.privateDateObj[dataname];
                //处理正常结果
                defer.resolve(dataname);
            }
        }, function (error) {
            console.log(error);
            //处理异常结果
            defer.reject(0);
        });
    } else {
        //如果在缓存区里有数据源的时候，就直接去缓存区里拿
        defer.resolve((type != undefined && type['index'] == 'returndata') ? _$scope.service.privateDateObj[dataname] : dataname);
    }

    return defer.promise;
}
/*
    查询按钮数据
*/
function select_btn(params, type) {
    return private_commonselect(params, type, 'btnsData', __URL + 'Crmuser/Sysbtns/select_page_data');
}

/* 客户信息 */
/*
    查询客户数据
*/
function select_customerinfo(params, type) {
    return private_commonselect(params, type, 'customerinfoData', __URL + 'Crmcustomerinfo/Customerinfo/select_page_data');
}
/*
查询联系人数据
*/
function select_customer_contact(params, type) {
    return private_commonselect(params, type, 'contactData', __URL + 'Crmcustomerinfo/Contact/select_page_data');
}

/*
查询客户类型数据
*/
function select_customer_type(params, type) {
    return private_commonselect(params, type, 'customertypeData', __URL + 'Crmcustomerinfo/Customertype/select_page_data');
}
/*
查询客户等级数据
*/
function select_customer_level(params, type) {
    return private_commonselect(params, type, 'customerlevelData', __URL + 'Crmcustomerinfo/Customerlevel/select_page_data');
}
/*
查询客户行业数据
*/
function select_customer_industry(params, type) {
    return private_commonselect(params, type, 'customerindustryData', __URL + 'Crmcustomerinfo/Customerindustry/select_page_data');
}
/*
查询客户来源数据
*/
function select_customer_source(params, type) {
    return private_commonselect(params, type, 'customersourceData', __URL + 'Crmcustomerinfo/Customersource/select_page_data');
}
/*
查询客户阶段数据
*/
function select_customer_stage(params, type) {
    return private_commonselect(params, type, 'customerstageData', __URL + 'Crmcustomerinfo/Customerstage/select_page_data');
}
/*
查询客户状态数据
*/
function select_customer_status(params, type) {
    return private_commonselect(params, type, 'customerstatusData', __URL + 'Crmcustomerinfo/Customerstatus/select_page_data');
}
/*
查询信用等级数据
*/
function select_customer_credit(params, type) {
    return private_commonselect(params, type, 'customercreditData', __URL + 'Crmcustomerinfo/Customercredit/select_page_data');
}
/*
查询客户市场数据
*/
function select_customer_market(params, type) {
    return private_commonselect(params, type, 'customermarketData', __URL + 'Crmcustomerinfo/Customermarket/select_page_data');
}
/*
查询公司信息数据
*/
function select_customer_company(params, type) {
    return private_commonselect(params, type, 'customerrefcompanyData', __URL + 'Crmcustomerinfo/Customerrefcompany/select_page_data');
}
/* 工单信息 */
/*
    查询工单数据
*/
function select_workorder(params, type) {
    return private_commonselect(params, type, 'workorderData', __URL + 'Crmschedule/Workorder/select_page_data');
}
//查询记录数据
function select_record(params, type) {
    return private_commonselect(params, type, 'recordData', __URL + 'Crmschedule/Record/select_page_data');
} 
//查询工单内容 - mongo
function select_workorder_message(params, type) {
    return private_commonselect(params, type, 'workorderDataMessage', __URL + 'Crmschedule/Workordermessage/select_page_data');
}
//查询商机线索
function select_clue(params, type) {
    return private_commonselect(params, type, 'clueData', __URL + 'Crmschedule/Clue/select_page_data');
}
//查询线索内容 - mongo
function select_cluerecord(params, type) {
    return private_commonselect(params, type, 'clueDataRecord', __URL + 'Crmsetting/Cluerecord/select_page_data');
}
/*
 查询出差管理
*/
function select_business(params, type) {
    return private_commonselect(params, type, 'businessData', __URL + 'Crmschedule/Business/select_page_data');
}
//查询出差报告 - mongo
function select_business_message(params, type) {
    return private_commonselect(params, type, 'businessDataMessage', __URL + 'Crmschedule/Businessmessage/select_page_data');
}
/*
    查询出货清单
*/
function select_shipments(params, type) {
    return private_commonselect(params, type, 'shipmentsData', __URL + 'Crmschedule/Shipments/select_page_data');
}
/*
    查询出货设备
*/
function select_shipmentsdevice(params, type) {
    return private_commonselect(params, type, 'shipmentsdeviceData', __URL + 'Crmschedule/Shipmentsdevice/select_page_data');
}
//查询返修记录
function select_rework(params, type) {
    return private_commonselect(params, type, 'reworkData', __URL + 'Crmschedule/Rework/select_page_data');
}
//查询返修设备
function select_reworkdevice(params, type) {
    return private_commonselect(params, type, 'reworkdeviceData', __URL + 'Crmschedule/Reworkdevice/select_page_data');
}
/* 产品信息 */
/*
    查询产品数据
*/
function select_product(params, type) {
    return private_commonselect(params, type, 'productData', __URL + 'Crmproduct/Product/select_page_data');
}
/*
    查询产品类型数据
*/
function select_producttype(params, type) {
    return private_commonselect(params, type, 'producttypeData', __URL + 'Crmproduct/Producttype/select_page_data');
}
/*
    查询产品型号数据
*/
function select_productmodel(params, type) {
    return private_commonselect(params, type, 'productmodelData', __URL + 'Crmproduct/Productmodel/select_page_data');
}
//附件管理

function select_annex(params, type) {
    return private_commonselect(params, type, 'annexData', __URL + 'Crmsetting/Annex/select_page_data');
}
/* 项目信息 */
/*
    查询项目数据
*/
function select_project(params, type) {
    //增加一个条件限制-------只有在index（指的是项目是否关闭了，0表示没关闭）为0的时候才显示
    //if (!type) {
    //    params.append('index', 0);
    //}
    return private_commonselect(params, type, 'projectData', __URL + 'Crmproject/Project/select_page_data');
}
//
function select_protect(params,type) {
    return private_commonselect(params, type, 'protectData', __URL + 'Crmproject/Project/select_page_data');
}
/*
 查询项目状态数据
 */
function select_project_status(params, type) {
    return private_commonselect(params, type, 'projectstatusData', __URL + 'Crmproject/Projectstatus/select_page_data');
}
/*
 查询项目供货清单数据
 */
function select_project_devicelist(params, type) {
    return private_commonselect(params, type, 'projectdevicelistData', __URL + 'Crmproject/Projectdevicelist/select_page_data');
}
/* 权限信息 */
/*
查询用户数据
type 是否强制查询 0/1
*/
function select_user(params, type) {
    return private_commonselect(params, type, 'usersData', __URL + 'Crmuser/Users/select_page_data');
}

/*
查询用户角色数据
*/
function select_usertype(params, type) {
    return private_commonselect(params, type, 'usertypeData', __URL + 'Crmuser /Usertype /select_page_data');

    }

/*
查询用户组数据
*/
function select_usergroup(params, type) {
    return private_commonselect(params, type, 'usergroupData', __URL + 'Crmuser/Usergroup/select_page_data');
}

/*
查询权限数据
*/
function select_authority(params, type) {
    return private_commonselect(params, type, 'authorityData', __URL + 'Crmuser/Authority/select_page_data');
 
}

/*
查询页面信息数据
*/
function select_user_apppinfo(params, type) {
    return private_commonselect(params, type, 'appinfoData', __URL + 'Crmuser/Appinfo/select_page_data');       
}
/*
查询按钮数据
*/
function select_user_btns(params, type) {
    return private_commonselect(params, type, 'btnsData', __URL + 'Crmuser/Sysbtns/select_page_data');   
}

/*
查询页面分组数据
*/
function select_user_appgroup(params, type) {
    return private_commonselect(params, type, 'appgroupData', __URL + 'Crmuser/Appgroup/select_page_data');      
}
/*
xop_historicallog_mongo
查询历史记录表
*/
function select_historicallog(params, type) {
    return private_commonselect(params, type, 'historicallogData', __URL + 'Crmsetting/Historicallog/select_page_data');
}
/*
查询公告板
*/
function select_bulletin(params, type) {
    return private_commonselect(params, type, 'bulletinData', __URL + 'Crmsetting/Bulletin/select_page_data');
}
//组建charts表
//url这里额外的一个参数，用于区分当前的url
function select_charts(params, type) {
    return private_commonselect(params, type, 'chartsData', __URL + 'Crmlog/Systemlog/SelectChartData');
}
//工单发送邮件
function workorder_mail(id) {
    var defer = _$q.defer();//延迟处理
    var param = new URLSearchParams();
    param.append('id', id);
    _$scope.service.postData(__URL + "Eimsystemsetting/Mail/workerstatusmailnotice", param).then(function (res) {
        //处理正常结果
        defer.resolve(res);
    });
    return defer.promise;
}
  
    /*
    EIM2.0
    查询设备类型
    */
    function select_devicetype(params, type) {
        return private_commonselect(params, type, 'devicetypeData', __URL + 'Eimdevice/Devicetype/select_page_data');  
    }
    /*
    EIM2.0
    查询设备型号
    */
    function select_modeltype(params, type) {
        return private_commonselect(params, type, 'modeltypeData', __URL + 'Eimdevice/Modeltype/select_page_data');   
    }
    /*
    EIM2.0
    查询会话方式
    */
    function select_devicesessiontype(params, type) {
        return private_commonselect(params, type, 'devicesessiontypeData', __URL + 'Eimsystemsetting/Devicesessiontype/select_page_data');               
    }
    /*
    EIM2.0
    查询会话控制中心
    */
    function select_sessioncenterlist(params, type) {
        return private_commonselect(params, type, 'sessioncenterData', __URL + 'Eimsystemsetting/Sessioncenterlist/select_page_data');               
    }
    /*
    EIM2.0
    查询资产设备
    */
    function select_assetsdevice(params, type) {
        return private_commonselect(params, type, 'assetsdeviceData', __URL + 'Eimdevice/Assetsdevicelist/select_page_data'); 
    }
    /*
        EIM2.0
        查询EXSI宿主机
        */
    function select_esxserverlist(params, type) {
        return private_commonselect(params, type, 'esxserverData', __URL + 'Eimdevice/Esxserverlist/select_page_data');
    }
    /*
           EIM2.0
           查询EXSI虚拟机
           */
    function select_vmdevicelist(params, type) {
        return private_commonselect(params, type, 'vmdeviceData', __URL + 'Eimdevice/Vmdevicelist/select_page_data');
    }
    
    /*
    EIM2.0
    查询PDU设备
    */
    function select_dpulist(params, type) {
        return private_commonselect(params, type, 'dpulistData', __URL + 'Eimdevice/Dpulist/select_page_data');    
    }
    /*
    EIM2.0
    查询PDU端口设备
    */
    function select_dpuportlist(params, type) {
        return private_commonselect(params, type, 'dpuportlistData', __URL + 'Eimdevice/Dpuportlist/select_page_data'); 
    }
    /*
    EIM2.0
    查询系统操作日志
    */
    function select_systemlog(params, type) {
        return private_commonselect(params, type, 'systemlogData', __URL + 'Eimlog/Systemlog/select_page_data');    
    }
    /*
    EIM2.0
    查询系统运行日志
    */
    function select_systemrunlog(params, type) {
        return private_commonselect(params, type, 'systemrunlogData', __URL +'Eimlog/Systemrunlog/select_page_data');     
    }
    /*
    EIM2.0
    查询EIM审计日志
    */
    function select_eimworklog(params, type) {
        return private_commonselect(params, type, 'eimworklogData', __URL + 'Eimaudit/Eimworklog/select_page_data');         
    }
    /*
    EIM2.0
    查询EIM设备组
    */
    function select_devicegroup(params, type) {
        return private_commonselect(params, type, 'devicegroupData', __URL + 'Eimdevice/Devicegroup/select_page_data');       
    }
    /*
    EIM2.0
    查询密码清单
    */
    function select_proxypassword(params, type) {
        return private_commonselect(params, type, 'proxypasswordData', __URL + 'Eimpasswordrules/Proxypassword/select_page_data');                 
    }
    /*
    EIM2.0
    查询密码规则清单
    */
    function select_proxypasswordrule(params, type) {
        return private_commonselect(params, type, 'proxypwdruleData', __URL + 'Eimpasswordrules/Proxypwdrule/select_page_data');
    }
    //获取kvm设备数据
    function select_kvmdevicelist(params, type) {
        return private_commonselect(params, type, 'kvmdeviceData', __URL + 'Eimdevice/Kvmdevicelist/select_page_data');
    }
    //获取kvm端口数据
    function select_kvmportlist(params, type) {
        return private_commonselect(params, type, 'kvmportlistData', __URL + 'Eimdevice/Kvmportlist/select_page_data');
    }
    /*
    EIM2.0
    查询我的设备组
    */
    function select_mydevicegroup(params, type) {
        return private_commonselect(params, type, 'mydevicegroupData', __URL + "Eimsystemsetting/Mydevicegroup/select_page_data");
    }
    /*
        EIM2.0
        查询系统设置数据
        */
    function select_systemsetting(params, type) {
        return private_commonselect(params, type, 'systemsettingData', __URL + "Eimsystemsetting/Systemsetting/select_page_data");
    }
    /*
           EIM2.0
           查询系统设置数据
           */
    function select_dsviewsetlist(params, type) {
        return private_commonselect(params, type, 'dsviewsetData', __URL + "Eimsystemsetting/Dsviewset/select_page_data");
    }