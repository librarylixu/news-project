/*
parent.js
angualr跨页面公共的function和data
v1.0.0
*/

/*当前用户属性*/
/*
该数据源存储到session中
users={
users表中当前用户的字段内容,关联的角色，关联的用户组

refusertype:{
 4:{},
 9:{}
},
refusergroup:{
    3:{},
    4:{},
    5:{},
}
}
var users = {};
*/
/*页面信息*/
/*
pageData={
  页面id:{页面详细信息}
}
*/
var pageData = {};

/*页面关联的权限*/
/*
pageRefAuth={
   权限id:{按钮ids,页面id,是否允许修改数据，是否允许删除数据}
    1：{btns:[1,2,3,4,5],appid:1,is_update:true,is_del:true}
}
*/
var pageRefAuth = {};
/*页面按钮*/
/*
pageBtns={
    按钮id：{按钮数据}
    1:{xxx:xxx}
}
*/
var pageBtns = {};

/*权限关联的页面*/
/*
authRefPage = {

        权限id:{页面id:{关系表数据行}}
        3:{
            1:{'1,2'
            }
                    
};
*/
var authRefPage = {};

/*客户关联的扩展信息*/
/*
customerRefCompany = {
    客户id:扩展信息
    1:{公司扩展信息}
};
*/
var customerRefCompany = {};

/*
parent私有属性
存储了各个页面需要共享的数据
*/
var privateDateObj = {
    //按钮信息
    btnsData: {},
    //客户信息
    customerinfoData: {},
    //客户临时缓存区
    tempcustomerinfoData: {},
    //联系人信息
    contactData: {},
    //联系人临时缓存区
    tempcontactData: {},
    //客户类型
    customertypeData: {},
    //客户等级
    customerlevelData: {},
    //客户行业
    customerindustryData: {},
    //客户来源
    customersourceData: {},
    //客户阶段
    customerstageData: {},
    //客户状态
    customerstatusData: {},
    //信用等级
    customercreditData: {},
    //客户市场
    customermarketData: {},
    //公司信息
    customerrefcompanyData: {},
    //账号信息
    usersData: {}, 
    //产品信息
    productData: {},
    //产品类型
    producttypeData: {},
    //产品型号
    productmodelData: {},
    //项目数据
    projectData: {},
    //项目数据
    protectData: {},
    //项目的临时缓存区
    tempprojectData: {},

    //项目状态
    projectstatusData:{},    
    //项目时间段数据
    projecttimeslotData: {
        '0': { id: '0', name: '全部', type: 'label-warning' },
        '1': { id: '1', name: '半年', type: 'label-default' },
        '2': { id: '2', name: '本季', type: 'label-info' },
        '3': { id: '3', name: '本月', type: 'label-success' }
    },

    //项目供货清单
    projectdevicelistData: {},
    //工单信息
    workorderData: {},
    //项目的历史缓存区
    tempworkorderData: {},
    //工单信息
    // workorderDataMessage: {},
    //工作记录
    recordData: {},
    //临时数据源
    temprecordData:{},
    //商机线索信息
    clueData: {},
    //商机记录--mongo
    clueDataRecord:{},
    //历史记录
    historicallogData: {},
    //附件
    annexData:{},
    //柱状图分析charts数据
    chartsData:{},
    //工单的各种状态
    workerorderStatus : {
        '0': { id: '0', name: '未确认', type: 'label-warning' },
        '1': { id: '1', name: '进行中', type: 'label-default' },
        '2': { id: '2', name: '待结单', type: 'label-info' },
        '3': { id: '3', name: '已完成', type: 'label-success' },
        '4': { id: '4', name: '已中止', type: 'label-danger' }
    },
    //出差数据
    businessData: {},
    businessArrData: {},
    //已关闭出差数据
    closebusinessData: {},
    //出差管理状态数据
    businessstatusData:{
        '0': { id: '0', name: '待审批', type: 'label-warning' },
        '1': { id: '1', name: '已同意', type: 'label-info' },
        '2': { id: '2', name: '未通过', type: 'label-default' },
        '3': { id: '3', name: '待关闭', type: 'label-success' },
        '4': { id: '4', name: '已结束', type: 'label-success' }
    },
    //项目把握度数据
    projectgraspData: {
        '10': { id: '10', name: "10%" },
        '20': { id: '20', name: '20%' },
        '30':{ id: '30', name: '30%' },
        '40':{ id: '40', name: '40%' },
        '50':{ id: '50', name: '50%' },
        '60':{ id: '60', name: '60%' },
        '70':{ id: '70', name: "70%" },
        '80':{ id: '80', name: '80%' },
        '90':{ id: '90', name: '90%' },
        '100': { id: '100', name: '100%' }
    },
    //组建关闭状态的类型数据，前台直接返回id字段
    closetypeData: {
        '1': { 'id': 1, 'name': '签订合同', type: 'label-success' },
        '2': { 'id': 2, 'name': '项目取消', type: 'label-default' },
        '3': { 'id': 3, 'name': '项目暂停', type: 'label-info' },
        '4': { 'id': 4, 'name': '项目关闭(丢单)', type: 'label-warning' }
    },
    //组建工单类型数据源
    workordertypeData: {
        '1': { 'id': 1, 'name': '日常', type: 'label-success' },
        '2': { 'id': 2, 'name': '售前咨询', type: 'label-default' },
        '3': { 'id': 3, 'name': '售后安装', type: 'label-info' },
        '4': { 'id': 4, 'name': '其他', type: 'label-warning' }
    },
    //组建商机类型数据源
    cluetypeData: {
        '1': { 'id': 1, 'name': '询价', type: 'label-success' },
        '2': { 'id': 2, 'name': '需求', type: 'label-default' },
        '3': { 'id': 3, 'name': '合作', type: 'label-info' },
        '4': { 'id': 4, 'name': '其他', type: 'label-warning' }
    },
    //组建商机来源数据源
    cluesourceData: {
        '1': { 'id': 1, 'name': '百度', type: 'label-success' },
        '2': { 'id': 2, 'name': '360', type: 'label-default' },
        '3': { 'id': 3, 'name': '搜狗', type: 'label-primary' },
        '5': { 'id': 5, 'name': '招标网', type: 'label-warning' },
        '4': { 'id': 4, 'name': '其他', type: 'label-info' },
    },
    //组建商机状态数据源
    cluestatusData: {
        '0': { 'id': 0, 'name': '未指派', type: 'label-danger' },
        '1': { 'id': 1, 'name': '已指派', type: 'label-default' },
        '2': { 'id': 2, 'name': '已跟进', type: 'label-info' },
        '3': { 'id': 3, 'name': '无效商机', type: 'label-warning' },
        '4': { 'id': 4, 'name': '成立客户，已跟进', type: 'label-primary' },
        '5': { 'id': 5, 'name': '已存在客户', type: 'label-success' },
        '6': { 'id': 6, 'name': '成立客户，已签单', type: 'label-info' },
    },
    //出货清单数据源
    shipmentsData: {},
    //出货设备数据源
    shipmentsdeviceData: {},
    //返修清单数据源
    reworkData: {},
    //返修清单状态数据源
    reworkstatusData: {
        '0': { 'id': 0, 'name': '待认领', type: 'label-danger' },
        '1': { 'id': 1, 'name': '待处理', type: 'label-default' },
        '2': { 'id': 2, 'name': '待关闭', type: 'label-info' },
        '3': { 'id': 3, 'name': '已关闭', type: 'label-warning' },
    },
    //返修设备数据源
    reworkdeviceData: {},
    //返修设备状态
    reworkdevicestatusData: {
        '0': { 'id': 0, 'name': '已过保', type: 'label-danger' },
        '1': { 'id': 1, 'name': '已更换', type: 'label-default' },
        '2': { 'id': 2, 'name': '已维修', type: 'label-info' },
    },
    //用户角色
    usertypeData: {},
    //查询我的设备组
    mydevicegroupData: {},
    //获取kvm端口数据
    kvmportlistData: {},
    //获取kvm设备数据
    kvmdeviceData: {},
    //查询密码规则清单
    proxypwdruleData: {},
    // 查询密码清单
    proxypasswordData: {},
    //查询EIM设备组
    devicegroupData: {},
    //查询EIM审计日志
    eimworklogData: {},
    //查询系统运行日志
    systemrunlogData: {},
    //查询系统操作日志
    systemlogData: {},
    //查询PDU端口设备
    dpuportlistData: {},
    //查询PDU设备
    dpulistData: {},
    //查询资产设备
    assetsdeviceData: {},
    //查询会话控制中心
    sessioncenterData: {},
    //查询会话方式
    devicesessiontypeData: {},
    //查询设备型号
    modeltypeData: {},
    // 查询设备类型
    devicetypeData: {},
    //查询页面分组数据
    appgroupData: {},
    //查询按钮数据
    btnsData: {},
    //   查询页面信息数据
    appinfoData: {},
    //       查询权限数据
    authorityData: {},
    //       查询用户组数据
    usergroupData: {},
    //用户组用户关系数据
    refuserData: {},
    //控制中心并发数量数据源
    licensedata: { '5': 5, '10': 10, '30': 30, '50': 50 },
    //EXSI宿主机数据
    esxserverData: {},
    //EXSI虚拟机数据
    vmdeviceData: {},
    //系统设置
    systemsettingData: {},
    //dsview数据
    dsviewsetData: {},
    //虚拟机列头字段编译
    esxcolumnameData: {
        'networkstatus': {type: 'networkstatus',name: '状态' },
        'devicename':{type:'devicename',name: '设备名称'},
        'ipaddress': { type: 'ipaddress', name: '设备地址' },
        'modeltypeid': { type: 'modeltypeid', name: '型号' },
        'contactpeople': { type: 'contactpeople', name: '负责人' },
        'remark': { type: 'remark', name: '备注' },
        'opensession': { type: 'opensession', name: '会话' },

    },
    //资产设备列头字段编译
    assetcolumnameData: {
        'opensessions': { type: 'opensessions', name: '开会话' },
        'idassetslist': { type: 'idassetslist', name: 'ID' },
        'networkstatus': { type: 'networkstatus', name: '状态' },
        'devicename': { type: 'devicename', name: '设备名称' },
        'ipaddress': { type: 'ipaddress', name: '设备地址' },
        'modeltypeid': { type: 'modeltypeid', name: '型号' },
        'contactpeople': { type: 'contactpeople', name: '负责人' },
        'remark': { type: 'remark', name: '备注' },
        'opensession': { type: 'opensession', name: '会话' },
    },
    //kvm设备列头字段编译
    kvmcolumnameData: {
        'networkstatus': { type: 'networkstatus', name: '状态' },
        'devicename': { type: 'devicename', name: '设备名称' },
        'ipaddress': { type: 'ipaddress', name: '设备地址' },
        'modeltypeid': { type: 'modeltypeid', name: '型号' },
        'contactpeople': { type: 'contactpeople', name: '负责人' },
        'remark': { type: 'remark', name: '备注' },
        'opensession': { type: 'opensession', name: '会话' },
    },
    //dpu设备列头字段编译
    dpucolumnameData: {
        'networkstatus': { type: 'networkstatus', name: '状态' },
        'devicename': { type: 'devicename', name: '设备名称' },
        'ipaddress': { type: 'ipaddress', name: '设备地址' },
        'modeltypeid': { type: 'modeltypeid', name: '型号' },
        'contactpeople': { type: 'contactpeople', name: '负责人' },
        'remark': { type: 'remark', name: '备注' },
        'opensession': { type: 'opensession', name: '电源' },
    },
    //dpu设备列头字段编译
    eimlogcolumnameData: {
        'ideimlog': { type: 'ideimlog', name: 'ID' },
        'olddevicename': { type: 'olddevicename', name: '设备名称' },
        'sessiontypename': { type: 'sessiontypename', name: '会话类型' },
        'status': { type: 'status', name: '状态' },
        'sessioncenterid': { type: 'sessioncenterid', name: '会话控制中心' },
        'userid': { type: 'userid', name: '操作人' },
        'starttime': { type: 'starttime', name: '开始时间' },
        'endtime': { type: 'endtime', name: '结束时间' },
        'remark': { type: 'remark', name: '备注' },      
    },
    passwordcomplexityData: {
        "capslock": {
            type:'capslock',
            value:'包含大写'
        },
        "number": {
            type: 'number',
            value: '包含数字'
        },
        "special": {
            type: 'special',
            value: '包含特殊字符'
        }
    }
   
};

