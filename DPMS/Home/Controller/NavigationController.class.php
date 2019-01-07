<?php
namespace Home\Controller;
use Think\Controller;
class NavigationController extends Controller {     
	//展示页面的按钮
    function __construct(){   
      //页面初次加载的时候要拿出页面对应的按钮
      // A("Eimbase/Operationbutton")->select_page_btn(); 
    }
 
	/*
	Get 大页面导航控制器
	*/
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //模板 登录页面
    function index($parameter=array()){
         //$parameter=array(id=>1,name=>2);
        $this->redirect('Home/Index/index', $parameter, 0, '...');
    }

	//首页
	function system_home_page(){   
        $this->redirect('Home/Homepage/index', array(), 0, '...');
    }

	/*
		设备管理
	*/
	 //应用发布服务器
    function get_app_release_page(){
        
    }
    //KVM管理
    function get_kvm_page(){
        $this->redirect('Eimdevice/Kvmdevice/get_kvm_page', array(), 0, '...');
    }

	//虚拟机管理
    function hypervervmpage(){
        
    }
    //DPU管理
    function get_dpu_page(){
       
    }
	 //资产设备
    function get_AssetsDevice_page(){
        $this->redirect('Eimdevice/Accetsdevice/index', array(), 0, '...');
    }

	/*
		2017年11月15日 15:15:35
		日志页面
	*/
    //端口电流日志
    function get_port_current_page($parameter=array()){
        $this->redirect('Eimlog/Logportcurrent/index', $parameter, 0, '...');
    }
    //设备电流日志
    function get_device_current_page($parameter=array()){
        $this->redirect('Eimlog/Logdevicecurrent/index', $parameter, 0, '...');
    }
    //电源操作日志
    function get_power_action_page($parameter=array()){
        $this->redirect('Eimlog/Logpoweroperation/index', $parameter, 0, '...');
    }
    //计划任务日志
    function get_plan_task_page($parameter=array()){
        $this->redirect('Eimlog/Logplanningtask/index', $parameter, 0, '...');
    }
    //系统操作日志
    function get_system_action_page($parameter=array()){
        $this->redirect('Eimlog/Logsystemoperation/index', $parameter, 0, '...');
    }
    //传感器日志
    function get_sensor_page(){  
        $this->redirect('Eimlog/Logsensor/index', array(), 0, '...');
    }
    //系统运行日志
    function get_system_server_page(){   
        $this->redirect('Eimlog/Logsystemfunction/index', array(), 0, '...');
    }
    //DPU总电流日志
    function get_dpu_current_page(){   
        $this->redirect('Eimlog/Logdputotalcurrent/index', array(), 0, '...');
    }
    //DPU运行日志
    function get_dpu_run_log_page(){  
        $this->redirect('Eimlog/Logdpufunction/index', array(), 0, '...');
    }

	/*
		账户管理
	*/
	//LDAP用户
    function ldapuserpage(){   
       
    }
	 //账户管理
    function get_user_page(){    
        $this->redirect('Eimbase/Userlist/index', array(), 0, '...');
    }
	 //设备组管理
    function devicegroup_page(){    
       $this->redirect('Eimbase/Devicegroup/index', array(), 0, '...');
    }
    //用户组管理
    function usergroup_page(){    
       $this->redirect('Eimbase/Usergroup/index', array(), 0, '...');
    }

	/*
		系统管理
	*/
	//登录规则
    function get_Login_Auth(){    
       $this->redirect('Eimsystemsetting/Loginauth/index', array(), 0, '...');
    }
	//按钮设置
    function get_btn_page(){   
       $this->redirect('Eimbase/Operationbutton/index', array(), 0, '...');
    }
    //证书设置
    function sslDC(){    
       
    }
    //预定义命令
    function commandset(){    
       
    }
    //应用商城
    function app_store(){    
       
    }
    //LDAP主机
    function ldapserverpage(){    
      
    }
	 //会话控制中心
    function get_getawaylist_page(){   
        $this->redirect('Eimsystemsetting/Gatewaylist/index', array(), 0, '...');
    }    
    //版本更新
    function get_version_update_page(){   
       
    }
    //Syslog设置
    function get_EventLog_Setting_page(){  
       
    }
    //系统配置
    function get_system_config(){ 
       
    }
    //Radius认证
    function get_radius_page(){ 		
		$this->redirect('Eimbase/Sysradius/index', array(), 0, '...');
    }
    //录制规则
    function get_audit_rule_page(){
        $this->redirect('Eimsystemsetting/Auditrule/index', array(), 0, '...');
    }
    //授权管理
    function getlicense_page(){
		$this->redirect('Eimsystemsetting/License/index', array(), 0, '...');
    }
    //文件下载
    function file_down_page(){
      
    }
    //DSV管理
    function dsv_set_page(){
      
    }
    //视频管理
    function system_set_page(){
       $this->redirect('Eimsystemsetting/Sysvideo/index', array(), 0, '...');
    }
    //群组设置
    function get_chat_group_page(){
      
    }
    //系统设置
    function other_set_page(){
       $this->redirect('Eimsystemsetting/Systemset/index', array(), 0, '...');
    }
	//时间同步
    function get_NTP_page(){
       $this->redirect('Eimsystemsetting/Ntp/index', array(), 0, '...'); 
    }
	//Hyper-V基础设置
    function hyperv_base_set_page(){ 
       
    }
    //Hyper-V主机
    function hypervserverpage(){   
       
    }
	//ACS巡检策略
	function get_acsinspection_page(){
		$this->redirect('Eimsystemsetting/Acsinspection/index', array(), 0, '...');
	}
	//资产模板
	function get_TemplateLabel_page(){
		$this->redirect('Eimsystemsetting/Templatelabel/index', array(), 0, '...');
	}
	/*
		审计管理
	*/
	//操作日志
    function get_ACSSessionLog_page(){   
      
    }
    //Syslog日志
    function Event_listPage(){    
        
    }

	/*
		密码规则
	*/
	//托管密码
    function get_pwd_page(){
       $this->redirect('Eimpasswordrules/Password/index', array(), 0, '...');
    }
    //密码规则
    function get_authrule_page(){
       $this->redirect('Eimpasswordrules/Pwdauthrule/index', array(), 0, '...');
    }

	/*
		我的设备
	*/
	//我的设备
    function get_group_page(){
       
    }
    //我的设备组
    function setpage(){
       
    }

	/*
		DPU能耗
	*/
	//DPU能耗
    function get_dpu_chart(){
		$this->redirect('Eimlog/Logpduenergy/index', array(), 0, '...');
    }
    //DPU端口能耗
    function get_port_chart(){
       $this->redirect('Eimlog/Logpduportenergy/index', array(), 0, '...');
    }

	/*
		计划任务
	*/
	//电源计划任务
    function get_Planning_task(){
       
    }

    //用户
    /*
    CRM 用户账号管理页面
    */
    function crmuserspage(){
        $this->redirect('Crmuser/Users/index', array(), 0, '...');
    }

    /*
    CRM 用户组管理页面
    */
    function crmusergrouppage(){
        $this->redirect('Crmuser/Usergroup/index', array(), 0, '...');
    }

    /*
    CRM 用户角色管理页面
    */
    function crmusertypepage(){
        $this->redirect('Crmuser/Usertype/index', array(), 0, '...');
    }

    /*
    CRM 用户设置管理页面
    */
    function crmusersystemsettingpage(){
        $this->redirect('Crmuser/Usersystemsetting/index', array(), 0, '...');
    }

    /*
    CRM 页面管理页面
    */
    function crmappinfopage(){
        $this->redirect('Crmuser/Appinfo/index', array(), 0, '...');
    }

    /*
    CRM 页面设置管理页面
    */
    function crmappuserpreferencepage(){
        $this->redirect('Crmuser/AppUserPreference/index', array(), 0, '...');
    }

    /*
    CRM 权限管理页面
    */
    function crmauthoritypage(){
        $this->redirect('Crmuser/Authority/index', array(), 0, '...');
    }
    /*
    CRM 按钮管理页面
    */
    function crmsysbtnspage(){
        $this->redirect('Crmuser/Sysbtns/index', array(), 0, '...');
    }


    //日程和工单
    /*
    CRM 日程管理页面
    */
    function crmschedulepage(){
        $this->redirect('Crmschedule/Schedule/index', array(), 0, '...');
    }

    /*
    CRM 工单管理页面
    */
    function crmworkorderpage(){
        $this->redirect('Crmschedule/Workorder/index', array(), 0, '...');
    }


    //产品
    /*
    CRM 产品管理页面
    */
    function crmproductpage(){
        $this->redirect('Crmproduct/Product/index', array(), 0, '...');
    }

    /*
    CRM 产品类型页面
    */
    function crmproducttypepage(){
        $this->redirect('Crmproduct/Producttype/index', array(), 0, '...');
    }

    /*
    CRM 产品型号页面
    */
    function crmproductmodelpage(){
        $this->redirect('Crmproduct/Productmodel/index', array(), 0, '...');
    }



    //客户
    /*
    CRM 联系人管理页面
    */
    function crmcontactpage(){
        $this->redirect('Crmcustomerinfo/Contact/index', array(), 0, '...');
    }

    /*
    CRM 客户信誉页面
    */
    function crmcustomercreditpage(){
        $this->redirect('Crmcustomerinfo/Customercredit/index', array(), 0, '...');
    }

    /*
    CRM 客户行业页面
    */
    function crmcustomerindustrypage(){
        $this->redirect('Crmcustomerinfo/Customerindustry/index', array(), 0, '...');
    }

    /*
    CRM 客户管理页面
    */
    function crmcustomerinfopage(){
        $this->redirect('Crmcustomerinfo/Customerinfo/index', array(), 0, '...');
    }
    
    /*
    CRM 客户等级页面
    */
    function crmcustomerlevelpage(){
        $this->redirect('Crmcustomerinfo/Customerlevel/index', array(), 0, '...');
    }

    /*
    CRM 客户市场大区页面
    */
    function crmcustomermarketpage(){
        $this->redirect('Crmcustomerinfo/Customermarket/index', array(), 0, '...');
    }

    /*
    CRM 客户来源页面
    */
    function crmcustomersourcepage(){
        $this->redirect('Crmcustomerinfo/Customersource/index', array(), 0, '...');
    }

    /*
    CRM 客户阶段页面
    */
    function crmcustomerstagepage(){
        $this->redirect('Crmcustomerinfo/Customerstage/index', array(), 0, '...');
    }

    /*
    CRM 客户状态页面
    */
    function crmcustomerstatuspage(){
        $this->redirect('Crmcustomerinfo/Customerstatus/index', array(), 0, '...');
    }
    
    /*
    CRM 客户类型页面
    */
    function crmcustomertypepage(){
        $this->redirect('Crmcustomerinfo/Customertype/index', array(), 0, '...');
    }

    /*
    CRM 公司信息页面
    */
    function crmcustomercompanypage(){
        $this->redirect('Crmcustomerinfo/Customerrefcompany/index', array(), 0, '...');
    }



    //日志
    /*
    CRM 登录日志页面
    */
    function crmloginlogpage(){
        $this->redirect('Crmlog/Loginlog/index', array(), 0, '...');
    }

    /*
    CRM 运行日志页面
    */
    function crmrunlogpage(){
        $this->redirect('Crmlog/Runlog/index', array(), 0, '...');
    }

    /*
    CRM 系统操作日志页面
    */
    function crmsystemlogpage(){
        $this->redirect('Crmlog/Systemlog/index', array(), 0, '...');
    }



    //设置
    /*
    CRM 附件页面
    */
    function crmannexpage(){
        $this->redirect('Crmsetting/Annex/index', array(), 0, '...');
    }

    /*
    CRM 城市页面
    */
    function crmcitypage(){
        $this->redirect('Crmsetting/City/index', array(), 0, '...');
    }

    /*
    CRM 收货地址页面
    */
    function crmshipaddresspage(){
        $this->redirect('Crmsetting/Shipaddress/index', array(), 0, '...');
    }

    /*
    CRM 设置页面
    */
    function crmsystemsettingpage(){
        $this->redirect('Crmsetting/Systemsetting/index', array(), 0, '...');
    }

    /*
    设备类型
    */
    function devicetype(){
        $this->redirect('Eimdevice/Devicetype/index', array(), 0, '...');
    }

	//modeltypepage modeltype 页面， 设备型号
	function modeltypepage(){
		$this->redirect('Eimdevice/Modeltype/index', array(), 0, '...');
	}


}