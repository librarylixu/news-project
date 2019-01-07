<?php
/*
2018年4月20日 14:21:52
自定义指令
*/
namespace Eimbase\Controller;
use Think\Controller;
class DirectiveController extends Controller {
    //空控制器操作
    public function _empty(){       
		$this->display(A('Home/Html')->error404());
    }

	//关联设备会话类型
	public function refDeviceSessionType(){
		$this->display("Eimbase@Directive:DeviceSessionType");
	}	
	//关联设备会话类型
	public function Tree(){
		$this->display("Eimbase@Directive:Tree");
	}
    //打开ssh会话按钮
	public function ssh_button(){
		$this->display("Eimbase@Directive:ssh_button");
	}  
    //打开telnet会话按钮
	public function telnet_button(){
		$this->display("Eimbase@Directive:telnet_button");
	}  
    //打开vnc会话按钮
	public function vnc_button(){
		$this->display("Eimbase@Directive:vnc_button");
        }
        //打开rdp会话按钮
	public function rdp_button(){
		$this->display("Eimbase@Directive:rdp_button");
        }
        //打开local会话按钮
	public function local_button(){
		$this->display("Eimbase@Directive:local_button");
	}  
        //打开local_kvm会话按钮
	public function local_mpu(){
		$this->display("Eimbase@Directive:local_mpu");
	}  
        //打开dsv_kvm会话按钮
	public function dsv_kvm(){
		$this->display("Eimbase@Directive:dsv_kvm");
	}  
 
 //打开选择密码规则

	public function selRule(){
		$this->display("Eimbase@Directive:select-rule");
	}
//批量导入

	public function bacth_import(){
		$this->display("Eimbase@Directive:bacth_import");
	}   
}