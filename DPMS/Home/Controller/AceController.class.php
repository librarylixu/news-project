<?php
namespace Home\Controller;
use Think\Controller;
class AceController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    function index(){
        $this->getmenudata();
        $this->display('Ace/index');
    }
    /*菜单数据源*/
    function getmenudata(){
        $source=array();
        //主页
		$source['home']=array(
            //'abstract'=>true,
            'url'=>'/',
            'title'=>'主页',
            'templateUrl'=>'/index.php/Home/Homepage/index',
             'controller'=> 'eimHomeController',
            'icon'=> 'fa fa-home',
             __loadfiles=>array(                
		        array(files=>array(CSS_URL."my-widgest.css",
                BOOTSTRAP_URL."echarts/4.0.4/echarts.js",
                //BOOTSTRAP_URL."echarts/4.0.4/echarts-liquidfill.js",
                PAGE_URL."js/Home/Homepage/index.js",
                )),                                  
		    )
        );

        $source['devicepage']=array(
            'abstract'=>true,
            'title'=>'设备管理',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-desktop'
        );
        $source['devicepage.assets']=array(
            url=> '/devicepage_assets',
            title=> '资产设备',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Assetsdevicelist/index',
            controller=> 'eimAssetsdeviceController',
			__loadfiles=>array(
				 array(files=>array(          
						PAGE_URL."css/crmProject/my_widget.css ",
						PAGE_URL."css/crmProject/my-project-info.css ",
						BOOTSTRAP_URL."angularTree/css/tree-control.css",
						CSS_URL."my-tree-style.css",                
						BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                  
					)), 
                    //自定义指令需要使用
                array(files=>array(
						BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5core_min.js",
				        BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5_min.js",                
					)), 
				array(files=>array(				
						PAGE_URL."js/Eimsystemsetting/Devicesessiontype/sessiontype_config_json.js",
						PAGE_URL."js/Eimdevice/Device/index-angular.js"		
					)),
			)
        );
         $source['devicepage.esxserver']=array(
            url=> '/esxserverpage_assets',
            title=> 'EXSI虚拟机管理',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Esxserverlist/index',
            controller=> 'eimEsxserverController',
			__loadfiles=>array(
				 array(files=>array(          						
						BOOTSTRAP_URL."angularTree/css/tree-control.css",
						CSS_URL."my-tree-style.css",                
						BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                  
					)), 
                    //自定义指令需要使用
                array(files=>array(
						BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5core_min.js",
				        BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5_min.js",                
					)), 
				array(files=>array(				
						PAGE_URL."js/Eimdevice/Esxserverlist/index.js"		
					)),
			)
        );
         $source['devicepage.kvmdevice']=array(
            url=> '/devicepage_kvmdevice',
            title=> 'KVM设备管理',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Kvmdevicelist/index',
            controller=> 'eimKvmdeviceController',
			__loadfiles=>array(
				 array(files=>array(          						
						BOOTSTRAP_URL."angularTree/css/tree-control.css",
						CSS_URL."my-tree-style.css",                
						BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                  
					)), 
                    //自定义指令需要使用
                array(files=>array(
						BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5core_min.js",
				        BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5_min.js",                
					)), 
				array(files=>array(				
						PAGE_URL."js/Eimdevice/kvmdevice/index.js"		
					)),
			)
        );
        $source['devicepage.pdulist']=array(
            url=> '/devicepage_pdulist',
            title=> 'DPU管理',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Dpulist/index',
            controller=> 'eimDpulistController',
			__loadfiles=>array(
				 array(files=>array(          						
						BOOTSTRAP_URL."angularTree/css/tree-control.css",
						CSS_URL."my-tree-style.css",                
						BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                  
					)), 
                    //自定义指令需要使用
                array(files=>array(
						BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5core_min.js",
				        BOOTSTRAP_URL."xcsessioncenter/5.6.857/hi5_min.js",                
					)), 
				array(files=>array(				
						PAGE_URL."js/Eimdevice/Dpulist/index.js"		
					)),
			)
        );
        $source['devicepage.devicegroup']=array(
            url=> '/devicepage_devicegroup',
            title=> '设备组管理',
            icon=> 'fa fa-user',
            templateUrl=> '/index.php/Eimdevice/Devicegroup/index',
            controller=> 'eimDevicegroupController',
			__loadfiles=>array(
			    array(files=>array(              
                    BOOTSTRAP_URL."angularTree/css/tree-control.css",
                    CSS_URL."my-tree-style.css",                
                    BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                    
                    )),
                array(files=>array(
                    //PAGE_URL."js/Eimdevice/Devicegroup/modal.js",   
                    PAGE_URL."js/Eimdevice/Devicegroup/index-angular.js",
                    )),
			)
        );
		//账户管理
		$source['userinfo']=array(
            'abstract'=>true,
            'title'=>'账户管理',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-users'
        );
         $source['userinfo.users']=array(
            url=> '/userinfo_users',
            title=> '账号管理',
            icon=> 'fa fa-user',
            templateUrl=> '/index.php/Crmuser/Users/eim_index',
            controller=> 'eimUsersController',
			__loadfiles=>array(

			    array(files=>array(              
                    BOOTSTRAP_URL."angularTree/css/tree-control.css",
                    CSS_URL."my-tree-style.css",                
                    BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                    
                    )),
                array(files=>array(                                                                                                          
                    PAGE_URL."js/Crmuser/Eimusers/index.js",
                    //PAGE_URL."js/Crmuser/Eimusers/modal.js",          
                    )),
			)
        );
        $source['userinfo.usergroup']=array(
            url=> '/userinfo_usergroup',
            title=> '用户组管理',
            icon=> 'fa fa-users',
            templateUrl=> '/index.php/Crmuser/Usergroup/eim_index',
            controller=> 'eimUsergroupController',
			__loadfiles=>array(

			    array(files=>array(              
                    BOOTSTRAP_URL."angularTree/css/tree-control.css",
                    CSS_URL."my-tree-style.css",                
                    BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                    
                    )),
                array(files=>array(                                                                                                          
                    PAGE_URL."js/Crmuser/Eimusergroup/index.js",
                    //PAGE_URL."js/Crmuser/Eimusers/modal.js",          
                    )),
			)
        );
		//日志管理
		$source['logmanage']=array(
            'abstract'=>true,
            'title'=>'日志管理',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-desktop'
        );
        $source['logmanage.systemlog']=array(
            url=> '/logmanage_systemlog',
            title=> '系统操作日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimlog/Systemlog/index',
            controller=> 'eimSystemlogController',
			__loadfiles=>array(
			            array(files=>array(
                                CSS_URL."my-comments.css",								
                                BOOTSTRAP_URL."angular-datepicker/tools/datePicker.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePickerUtils.js",                               
                                BOOTSTRAP_URL."angular-datepicker/tools/dateRange.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/input.js", 
                                BOOTSTRAP_URL."angular-datepicker/angular-datepicker.css",								
						)), 
                        array(files=>array(
								PAGE_URL."js/Eimlog/Systemlog/index-angular.js",
								
						)),
			)
        );
        $source['logmanage.systemrunlog']=array(
            url=> '/logmanage_systemrunlog',
            title=> '系统运行日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimlog/Systemrunlog/index',
            controller=> 'eimSystemrunlogController',
			__loadfiles=>array(
			            array(files=>array(
                                CSS_URL."my-comments.css",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePicker.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePickerUtils.js",                               
                                BOOTSTRAP_URL."angular-datepicker/tools/dateRange.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/input.js", 
                                BOOTSTRAP_URL."angular-datepicker/angular-datepicker.css",
						)), 
                        array(files=>array(                                            
								PAGE_URL."js/Eimlog/Systemrunlog/index-angular.js",
						)),
			)
        );
        $source['logmanage.pduenergylog']=array(
            url=> '/devicepage_pduenergylog',
            title=> 'PDU能耗日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimlog/Logpduenergy/index',
            controller=> 'eimPduEnergyLogController',
            __loadfiles=>array(
			            array(files=>array(
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/css/colorpicker.min.css",
                                CSS_URL."my-comments.css",
                                BOOTSTRAP_URL."angular-sanitize/1.4.6/angular-sanitize.min.js",
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/js/bootstrap-colorpicker-module.js",                               
                                BOOTSTRAP_URL."echarts/4.0.4/echarts.js",
						)), 
                        array(files=>array(                                            
								PAGE_URL."js/Eimlog/Logpduenergy/index-angular.js",
						)),
			)
        );
        $source['logmanage.pduportenergylog']=array(
            url=> '/devicepage_pduportenergylog',
            title=> 'PDU端口能耗日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimlog/Logportenergy/index',
            controller=> 'eimPduportEnergyLogController',
            __loadfiles=>array(
			            array(files=>array(
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/css/colorpicker.min.css",
                                CSS_URL."my-comments.css",
                                BOOTSTRAP_URL."angular-sanitize/1.4.6/angular-sanitize.min.js",
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/js/bootstrap-colorpicker-module.js",  
						)), 
                        array(files=>array(                                            
								PAGE_URL."js/Eimlog/Logportenergy/index-angular.js",
						)),
			)
        );
        $source['logmanage.pduportsystemlog']=array(
            url=> '/devicepage_pduportsystemlog',
            title=> 'PDU端口操作日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimlog/Logportaction/index',
            controller=> 'eimPduPortSystemLogController',
            __loadfiles=>array(
			            array(files=>array(
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/css/colorpicker.min.css",
                                CSS_URL."my-comments.css",
                                BOOTSTRAP_URL."angular-sanitize/1.4.6/angular-sanitize.min.js",
                                BOOTSTRAP_URL."angular-bootstrap-colorpicker/3.0.32/js/bootstrap-colorpicker-module.js",  
						)), 
                        array(files=>array(                                            
								PAGE_URL."js/Eimlog/Logportaction/index-angular.js",
						)),
			)
        );
		//审计管理
		$source['auditmanage']=array(
            'abstract'=>true,
            'title'=>'审计管理',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-desktop'
        );
         $source['auditmanage.eimworklog']=array(
            url=> '/auditmanage_eimworklog',
            title=> 'EIM审计日志',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimaudit/Eimworklog/index',
            controller=> 'eimEimworklogController',
			__loadfiles=>array(
			            array(files=>array(
                                CSS_URL."my-comments.css",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePicker.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePickerUtils.js",                               
                                BOOTSTRAP_URL."angular-datepicker/tools/dateRange.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/input.js", 
                                BOOTSTRAP_URL."angular-datepicker/angular-datepicker.css",
						)), 
                        array(files=>array(                                            
								PAGE_URL."js/Eimaudit/Eimworklog/index-angular.js",
						)),
			)
        );
        //密码规则
		$source['proxypassword']=array(
            'abstract'=>true,
            'title'=>'密码规则',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-desktop'
        );
        $source['proxypassword.proxypassword']=array(
            url=> '/proxypassword_proxypassword',
            title=> '密码清单',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimpasswordrules/Proxypassword/index',
            controller=> 'eimProxypasswordController',
			__loadfiles=>array(
			    array(files=>array(												
								//PAGE_URL."js/Eimpasswordrules/Proxypassword/modal.js",
								PAGE_URL."js/Eimpasswordrules/Proxypassword/index-angular.js",
								)),
			)
        );
         $source['proxypassword.proxypwdrule']=array(
            url=> '/proxypassword_proxypwdrule',
            title=> '密码规则',
            icon=> 'glyphicon glyphicon-file',
            templateUrl=> '/index.php/Eimpasswordrules/Proxypwdrule/index',
            controller=> 'eimProxypwdruleController',
			__loadfiles=>array(
                array(files=>array(  
                                          
								BOOTSTRAP_URL."angular-datepicker/tools/datePicker.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/datePickerUtils.js",                               
                                BOOTSTRAP_URL."angular-datepicker/tools/dateRange.js",
                                BOOTSTRAP_URL."angular-datepicker/tools/input.js", 
                                BOOTSTRAP_URL."angular-datepicker/angular-datepicker.css",
						        )),
			    array(files=>array(												
								PAGE_URL."js/Eimpasswordrules/Proxypwdrule/index.js",
								)),

			)
        );
		//系统设置
		$source['systemsetting']=array(
            'abstract'=>true,
            'title'=>'系统设置',
            'template'=>'<ui-view/>',
            'icon'=> 'fa fa-desktop'
        );
        $source['systemsetting.dsviewset']=array(
            url=> '/systemsetting_dsviewset',
            title=> 'Dsview设置',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimsystemsetting/Dsviewset/index',
            controller=> 'eimDsviewsetController',
			__loadfiles=>array(
			    array(files=>array(																			
								PAGE_URL."js/Eimsystemsetting/Dsviewset/index.js",
								)),

			)
        );
		$source['systemsetting.devicetype']=array(
            url=> '/systemsetting_devicetype',
            title=> '设备类型',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Devicetype/index',
            controller=> 'eimDevicetypeController',
			__loadfiles=>array(
			    array(files=>array(												
								PAGE_URL."js/Eimdevice/Devicetype/modal.js",
								PAGE_URL."js/Eimdevice/Devicetype/index.js",
								)),

			)
        );
		$source['systemsetting.modeltype']=array(
            url=> '/systemsetting_modeltype',
            title=> '设备型号',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimdevice/Modeltype/index',
            controller=> 'eimModeltypeController',
			__loadfiles=>array(
			    array(files=>array(												
								PAGE_URL."js/Eimdevice/Modeltype/modal.js",
								PAGE_URL."js/Eimdevice/Modeltype/index.js",
								)),

			)
        );
		$source['systemsetting.sessioncenter']=array(
            url=> '/systemsetting_sessioncenter',
            title=> '会话控制中心',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimsystemsetting/Sessioncenterlist/index',
            controller=> 'eimSessioncenterController',
			__loadfiles=>array(
			    array(files=>array(											
								PAGE_URL."js/Eimsystemsetting/Sessioncenterlist/modal.js",	
								PAGE_URL."js/Eimsystemsetting/Sessioncenterlist/config_json.js",								
								PAGE_URL."js/Eimsystemsetting/Sessioncenterlist/config-info.js",
								PAGE_URL."js/Eimsystemsetting/Sessioncenterlist/index.js",
								)),

			)
        );
		$source['systemsetting.sessiontype']=array(
            url=> '/systemsetting_sessiontype',
            title=> '设备会话类型',
            icon=> 'fa fa-tachometer',
            templateUrl=> '/index.php/Eimsystemsetting/Devicesessiontype/index',
            controller=> 'eimDevicesessiontypeController',
			__loadfiles=>array(
			    array(files=>array(						
								PAGE_URL."js/Eimsystemsetting/Devicesessiontype/sessiontype_config_json.js",
								PAGE_URL."js/Eimsystemsetting/Devicesessiontype/modal.js",
								PAGE_URL."js/Eimsystemsetting/Devicesessiontype/config-info.js",
								PAGE_URL."js/Eimsystemsetting/Devicesessiontype/index-angular.js",
								)),

			)
        );
        $source['systemsetting.license']=array(
            url=> '/systemsetting_license',
            title=> '授权管理',
            icon=> 'fa fa-key',
            templateUrl=> '/index.php/Eimsystemsetting/License/index',
            controller=> 'eimLicenseController'
        );
         $source['systemsetting.sytemsetting']=array(
            url=> '/systemsetting_sytemsetting',
            title=> '系统设置',
            icon=> 'fa fa-key',
            templateUrl=> '/index.php/Eimsystemsetting/Systemsetting/index',
            controller=> 'eimSystemsettingController',
            __loadfiles=>array(
			    array(files=>array(						
								PAGE_URL."js/Eimsystemsetting/Systemsetting/index.js",								
								)),

			)
        );
        //我的设备
        //$source['mydevice']=array(
        //    'abstract'=>true,
        //    'title'=>'我的设备',
        //    'template'=>'<ui-view/>',
        //    'icon'=> 'fa fa-tree'
        //);
        //$source['mydevice.device']=array(
        //    url=> '/mydevice_device',
        //    title=> '我的设备',
        //    icon=> 'fa fa-tachometer',
        //    templateUrl=> '/index.php/Eimsystemsetting/Mydevicegroup/mydevice',
        //    controller=> 'eimMydevicegroupController',
        //    __loadfiles=>array(
        //        array(files=>array(		
        //                        PAGE_URL."js/Eimsystemsetting/Mydevicegroup/devicegroup-angular.js",
        //                        )),

        //    )
        //);
        //$source['mydevice.devicegroup']=array(
        //    url=> '/mydevice_devicegroup',
        //    title=> '我的设备组',
        //    icon=> 'fa fa-tachometer',
        //    templateUrl=> '/index.php/Eimsystemsetting/Mydevicegroup/mydevicegroup',
        //    controller=> 'eimMydevicegroupController',
        //    __loadfiles=>array(
        //    array(files=>array(              
        //            BOOTSTRAP_URL."angularTree/css/tree-control.css",
        //            CSS_URL."my-tree-style.css",                
        //            BOOTSTRAP_URL."angularTree/js/angular-tree-control.js",                    
        //            )),
        //        array(files=>array(						
        //                        PAGE_URL."js/Eimsystemsetting/Mydevicegroup/devicegroup-angular.js",
        //                        PAGE_URL."js/Eimsystemsetting/Mydevicegroup/modal.js",
        //                        )),

        //    )
        //);

        $this->assign('_MenuSource',json_encode($source));
        $this->assign('_DefauPage','/');        
        return $source;
    }


    /*主页面的头部*/
    function page_m_navbar(){
        $this->display('Ace/navbar');
    } 
    /*主页面头部右侧的通知消息*/
    function page_m_navbar_msg($status){
        switch ($status)
        {
        	case "tasks":
                $this->display('Ace/navbar-tasks');
                break;
            case "message":
                $this->display('Ace/navbar-message');
                break;
            case "usermenu":
                $this->display('Ace/navbar-user-menu');
                break;
            case "notifications":
                $this->display('Ace/navbar-notifications');
                break;
        }       

    }
    /*主页面的头部下方的面包屑*/
    function page_m_breadcrumbs(){
        $this->display('Ace/breadcrumbs');
    } 
    /*主页面的左侧菜单*/
    function page_m_sidebar(){
        $this->display('Ace/sidebar');
    } 
     /*主页面的左侧菜单中的内容item*/
    function page_m_sidebar_item(){
        $this->display('Ace/sidebar_item');
    } 
     
     /*主页面的头部下方的面包屑*/
    function page_m_settings(){
        $this->display('Ace/settings');
    } 
    
    /*主页面的底部*/
    function page_m_footer(){
        $this->display('Ace/footer');
    }




    

}