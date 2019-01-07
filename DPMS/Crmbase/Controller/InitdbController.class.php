<?php
/*
    2017-12-12
    数据库创建和初始化

*/
namespace Crmbase\Controller;
use Think\Controller;
class InitdbController extends Controller {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    /*创建数据库*/
    function createDB(){
         $mysql_server=C('CrmDB')['DB_HOST'];
         $mysql_username=C('CrmDB')['DB_USER'];
         $mysql_password=C('CrmDB')['DB_PWD'];
         $mysql_database=C('CrmDB')['DB_NAME'];
         //建立数据库链接
        $conn = mysql_connect($mysql_server,$mysql_username,$mysql_password) or die("数据库链接错误");
        $sql=sprintf('CREATE SCHEMA IF NOT EXISTS `%s` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;',$mysql_database);
        $result=mysql_query($sql);
        unset($conn);
        if($result){
            echo '数据库创建成功！！\r\n';
        }
    }   
    //CRM有效的控制器
    function getCrmController(){
        $a= array(
                            //设置Crmsetting
                            'Crmsetting/Annex',
                            'Crmsetting/Shipaddress',
                            //'Crmsetting/Systemsetting',
                            //用户Crmuser
                            'Crmuser/Appgroup',
                            'Crmuser/Appinfo',
                            'Crmuser/AppUserPreference',
                            'Crmuser/Authority',
                            'Crmuser/Sysbtns',
                            'Crmuser/Usergroup',
                            'Crmuser/Users',
                            'Crmuser/Usersystemsetting',
                            'Crmuser/Usertype',
                            //客户Crmcustomerinfo
                            'Crmcustomerinfo/Contact',
                            'Crmcustomerinfo/Customercredit',
                            'Crmcustomerinfo/Customerindustry',
                            'Crmcustomerinfo/Customerinfo',
                            'Crmcustomerinfo/Customerlevel',
                            'Crmcustomerinfo/Customermarket',
                            'Crmcustomerinfo/Customerrefcompany',
                            'Crmcustomerinfo/Customersource',
                            'Crmcustomerinfo/Customerstage',
                            'Crmcustomerinfo/Customerstatus',
                            'Crmcustomerinfo/Customertype',
                            //日志Crmlog
                            //'Crmlog/Loginlog',
                            //'Crmlog/Runlog',
                            //'Crmlog/Systemlog',
                            //产品Crmproduct
                            'Crmproduct/Producttype',
                            'Crmproduct/Product',
                            'Crmproduct/Productmodel',
                            //项目
                            'Crmproject/Projectstatus',
                            'Crmproject/Project',
                            'Crmproject/Projectdevicelist',
                            'Crmproject/Projectword',
                            //报表Crmreport
                            //日程工单Crmschedule
                            'Crmschedule/Schedule',
                            'Crmschedule/Workorder',                           

                            //用户关系
                            'Crmuser/RefappgroupRefapp',
                            'Crmuser/RefauthRefapp',
                            'Crmuser/RefmenuRefbtn',
                            'Crmuser/RefugroupRefgroup',
                            'Crmuser/RefuserRefappgroup',
                            'Crmuser/RefuserRefgroup',
                            'Crmuser/RefuserRefutype',
                            'Crmuser/RefusertyRefgroup',
                            'Crmuser/RefutypeRefappgroup',
                            'Crmuser/RefutypeRefauth',
                            //客户关系                                                    
                            'Crmcustomerinfo/RefcusRefshipaddress',                           
     
            );
            return $a;
    }
    
    //初始化所有CRM表
    function initdb(){
		$this->createDB();
		//$_SESSION['initdb'] 用处 让控制器知道正在进行初始化，不要进行身份检测
        $crmController=$this->getCrmController();    
		$_SESSION['initdb'] = true;
        foreach($crmController as $controller){
                $function = get_class_methods(A($controller));
                echo $controller.":";
                if(in_array("create_table",$function)){					
                    A($controller)->create_table();
                }
                if(in_array("init_db",$function)){
                    A($controller)->init_db();
                }
        }
        $this->initdb_eim();
		unset($_SESSION['initdb']);
        $this->show("数据库初始化完成!\r\n");
     }


	//初始化所有EIM表
	function geteimcontrollers(){
    		    //2018年1月15日 EIM数据库初始化 'Eimdevice','Eimlog'
            //eim2.0 Eimdevice
		return $controllers = array(
            
            'Eimdevice/Devicegroup',
            'Eimdevice/Devicetype',
            'Eimdevice/Modeltype',
            'Eimdevice/Assetsdevicelist',
             'Eimdevice/Esxserverlist',
             'Eimdevice/Vmdevicelist', 
            'Eimdevice/Kvmdevicelist',          
            'Eimdevice/Kvmportlist', 
            'Eimdevice/Dpulist', 
            'Eimdevice/Dpuportlist',    
			 			                        
			'Eimsystemsetting/Devicesessiontype',   
			'Eimsystemsetting/Sessioncenterlist',
            'Eimpasswordrules/Proxypassword',
            'Eimpasswordrules/Proxypwdrule',      
            'Eimsystemsetting/License',   
            'Eimsystemsetting/Systemsetting',
            'Eimaudit/Eimworklog',
            'Eimaudit/Authfile',

		);
	}

	function initdb_eim(){
		//$_SESSION['initdb'] 用处 让控制器知道正在进行初始化，不要进行身份检测
        $EIMController=$this->geteimcontrollers();    
		$_SESSION['initdb'] = true;
        foreach($EIMController as $controller){
                $function = get_class_methods(A($controller));
                echo $controller.":";
                if(in_array("create_table",$function)){					
                    A($controller)->create_table();
                }
                if(in_array("init_db",$function)){
                    A($controller)->init_db();
                }
        }
		unset($_SESSION['initdb']);
        $this->show("EIM数据库初始化完成!");		
	}
 
	 
}
