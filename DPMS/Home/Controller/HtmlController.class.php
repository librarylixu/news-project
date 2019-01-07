<?php
namespace Home\Controller;
use Think\Controller;
/*
本控制器记录了物理html页面地址
*/
class HtmlController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    public function loginPage(){
        //登录页面
        return "Home@Index:login";
    }
    //错误页面404
    public function error404(){
        return "Home@404:404";
    }
    /*
    入口页面，框架页面
    */
    public function mainPage(){
       return "Home@Homepage:index";
    }

	/*
		首页
	*/
	public function homePage(){
       return "Home@Homepage:chart_index";
    }
    /*
        按钮页面
    */
    public function operationButton(){
       return "Eimbase@Operationbutton:index";
    }
    /*
    KVM页面
    $new=1 风格1  $new=2 风格2
    */
    public function kvmPeviceList($new=1){
        if($new=1){
            return "Eimdevice@Kvmdevice:kvm-device-list";
        }
        return "Eimdevice@Kvmdevice:kvm-device-list-new";
    }
	/*
		KVM页面 - 添加kvm设备页面
		$flag = add:添加页面，edit:编辑页面
	*/
	public function get_add_kvmdevice_page($flag='add'){
		if($flag = 'add'){
			return "Eimdevice@Kvmdevice:kvm-device-add";
		}else{
            return "Eimdevice@Kvmdevice:kvm-device-edit";
		}
	}
	//KVM页面 - 子集设备修改页面
	public function get_edit_child_device_page(){
		 return "Eimdevice@Kvmdevice:kvm-device-child-edit";
	}


    /*
        日志管理
    */
    //端口电流日志
    public function portCurrent(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logportcurrent:index-angular";
        }
        //jquery
        return "Eimlog@Logportcurrent:index";
    }
    //设备电流日志
    public function deviceCurrent(){
    //angularjs 
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logdevicecurrent:index-angular";
        }
        //jquery
        return "Eimlog@Logdevicecurrent:index";
    }
    //PDU能耗日志
    public function pduEnergyLogPage(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logpduenergy:index-angular";
        }
        //jquery
        return "Eimlog@Logpduenergy:index";
    }
    //计划任务日志
    public function planningTask(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logplanningtask:index-angular";
        }
        //jquery
        return "Eimlog@Logplanningtask:index";
    }
    //系统操作日志
    public function systemOperation(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logsystemoperation:index-angular";
        }
        //jquery
        return "Eimlog@Logsystemoperation:index";
        //return "Eimbase@Logsystemoperation:index-vue";
    }
    //传感器日志
    public function sensor(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logsensor:index-angular";
        }
        //jquery
        return "Eimlog@Logsensor:index";
    }
    //系统运行日志
    public function systemFunction(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logsystemfunction:index-angular";
        }
        //jquery
        return "Eimlog@Logsystemfunction:index";
    }
    //DPU总电流日志
    public function dpuTotalCurrent(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logdputotalcurrent:index-angular";
        }
        //jquery
        return "Eimlog@Logdputotalcurrent:index";
    }
    //DPU运行日志
    public function dpuFunction(){
        //angularjs
        if(C('HtmlType')=='angular'){
            return "Eimlog@Logdpufunction:index-angular";
        }
        //jquery
        return "Eimlog@Logdpufunction:index";
    }
    /*
        系统管理
    */
    //gateway分布式管理
    public function getawayList(){
         if(C('HtmlType')=='angular'){
            return "Eimsystemsetting@Sysgatewaylist:index-angular";
         }

        return "Eimsystemsetting@Sysgatewaylist:index";
    }
	/*
		gateway分布式管理 - 添加/修改 gataway页面
		修改和添加使用同一个页面所以不需要判断做的什么操作
	*/
	public function get_add_gatewaylist_page(){
        //angular
        if(C('HtmlType')=='angular'){
            return "Eimbase@Sysgatewaylist:add_gateway-angular";
        }
        //jquery
		return "Eimbase@Sysgatewaylist:add_gateway";
	}
	//gateway页面 - 子集设备修改页面
    public function get_edit_child_gateway_page(){
         return "Eimbase@Sysgatewaylist:gateway-child-edit";
    }
    //登录规则页面
    public function get_Login_Auth(){
        //angular
        if(C('HtmlType')=='angular'){
            return "Eimsystemsetting@Loginauth:index-angular";
        }
        //jquery
        return "Eimsystemsetting@Loginauth:index";
    }
	//Radius认证页面
	public function get_radius_page(){
        if(C('HtmlType')=='angular'){
           return "Eimbase@SysRadius:index_angular";
        }
         //jquery
		return "Eimbase@SysRadius:index";
	}
	//系统设置页面
	public function other_set_page(){
		if(C('HtmlType')=='angular'){
           return "Eimsystemsetting@Systemset:index_angular";
        }
         //jquery
		return "Eimsystemsetting@Systemset:index";
	}
    //系统设置页面
	public function get_video_page(){
		if(C('HtmlType')=='angular'){
           return "Eimsystemsetting@Sysvideo:index_angular";
        }
         //jquery
		return "Eimsystemsetting@Sysvideo:index";
	}
	//资产模板标签页面
	public function get_TemplateLabel_page(){
		if(C('HtmlType')=='angular'){
           return "Eimsystemsetting@Templatelabel:index_angular";
        }
         //jquery
		return "Eimsystemsetting@Templatelabel:index";
	}







    //授权页面
    public function License(){
        return "Eimsystemsetting@License:index-angular";
    }
    //时间同步页面
	public function Ntpset(){
		if(C('HtmlType')=='angular'){
           return "Eimsystemsetting@Ntp:index-angular";
        }
         //jquery
		return "Eimsystemsetting@Ntp:index";
	}
    //录制规则页面
	public function Auditrule(){
		if(C('HtmlType')=='angular'){
           return "Eimsystemsetting@Auditrule:index-angular";
        }
         //jquery
		return "Eimsystemsetting@Auditrule:index";
	}
	//acs端口巡检策略
	public function get_acsinspection_page(){
		return "Eimsystemsetting@Acsinspection:index_angular";
	}











    /*
    资产设备
    */
    public function Accetsdevice(){
       if(C('HtmlType')=='angular'){        
        return "Eimdevice@Accetsdevice:index-angular";
       }
       return "Eimdevice@Accetsdevice:assets_index";
    }
    /*
    DPU设备管理
    */
    public function Dpudevice(){
        return "Eimdevice@Accetsdevice:dpu_deivce_index";
    }
    /*
    DPU管理
    */
    public function Dpulist(){
        return "Eimdevice@Dpmsdpulist:index";
    }



    /*用户账户*/
    public function userlistpage(){
       // return 'Eimbase@Userlist:index-vue';
        
        if(C('HtmlType')=='vue'){
            return 'Eimbase@Userlist:index-vue';
        }else if(C('HtmlType')=='angular'){
            return 'Eimbase@Userlist:index-angular';
        }
        return 'Eimbase@Userlist:index';
    }
    /*设备组管理*/
    public function Devicegroup(){
        if(C('HtmlType')=='angular'){
           return "Eimbase@Devicegroup:index_angular";
        }
         //jquery
		return "Eimbase@Devicegroup:index";
	}
    /*用户组管理*/
    public function Usergroup(){
        if(C('HtmlType')=='angular'){
           return "Eimbase@Usergroup:index_angular";
        }
         //jquery
		return "Eimbase@Usergroup:index";
	}


    //设置密码规则
    /*托管密码*/
    public function Password(){
        if(C('HtmlType')=='angular'){
            return "Eimpasswordrules@Password:index-angular";
        }
            //jquery
		return "Eimpasswordrules@Password:index";
	}
    /*密码规则*/
    public function Pwdauthrule(){
        if(C('HtmlType')=='angular'){
           return "Eimpasswordrules@Pwdauthrule:index-angular";
        }
         //jquery
		return "Eimpasswordrules@Pwdauthrule:index";
	}
     /*个人偏好设置页面*/
    public function Usersystemsetting(){
        if(C('HtmlType')=='angular'){
           return "Crmuser@Usersystemsetting:index-angular";
        }
         //jquery
		return "Crmuser@Usersystemsetting:index";
	}

}