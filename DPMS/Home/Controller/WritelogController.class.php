<?php
namespace Home\Controller;
use Think\Controller;
/*
专门用来写日志的控制器
*/
class WritelogController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
     //添加系统操作日志
    public function writeSystemLog($msg){
        $logs=array('EventType'=>'system','EventTime'=>time(),'EventText'=>$msg.'. 来源IP：'.$_SERVER['REMOTE_ADDR'],'EventUser'=>$_SESSION['Username']);
        $this->insertlogs($logs);
    }
    //添加DPU开关日志 
    public function writeDpuPortLog($ActionStatus,$deviceid,$portid,$dpuid,$result){
        $logs=array('EventType'=>'Action','Time'=>time(),'ActionStatus'=>$ActionStatus,'User'=>$_SESSION['Username'],'Devices'=>$deviceid,'Ports'=>$portid,'Dpus'=>trim($dpuid),'Result'=>$result); 
        $this->insertlogs($logs);
    }
    
	//添加登陆日志
	public function add_login_error_log($username,$count=1){	
        //***Error写日志没处理
        return;
		$dpumodel=new \Model\DpmsLogSystemModel();
        $result=$dpumodel->addUserErrorlog($username,$count); 
        unset($dpumodel);
		return $result['updatedExisting'];	
	}
    //添加虚拟机日志

    //添加日志
    private function insertlogs($log){
        $model=new \Model\DpmsLogSystemModel();
        $model->insertlogs($log);
        unset($model);
    }
    //获取登陆时日志信息
    public function get_login_set(){
		$dpumodel=new \Model\UserlistModel();
        $result=$dpumodel->userPwdErrorSet(); 
        unset($dpumodel);
		$_SESSION['Login_set']['error_count'] = intval($result['error_count']);
		$_SESSION['Login_set']['error_time'] = intval($result['error_time']);
		$_SESSION['Login_set']['lock_time'] = intval($result['lock_time']);
		//var_dump($_SESSION['Login_set']);
		return $result;
	}
    //登陆日志
	public function recording_login_log($post,$loginresult){
		$logintype = "本地认证：";
		if ($_SESSION['Radius'] == 1){
			$logintype = "动态认证：";
		}else if(!empty($_POST['ldap']) and $_POST['ldap']=="on"){
			$logintype = "LDAP认证：";
		}
		$logtxt = "";
		if($loginresult){
			$logtxt = $logintype.$_SESSION['Username'].((!empty($post['forcelogin']) and $post['forcelogin']=="on")?'，强制登录.':'，登陆成功.');
		}else{
			$logtxt = $logintype.$_SESSION['Username'].'登陆失败,账号或密码不正确.';
		}		
        $this->writeSystemLog($logtxt);
	}


}