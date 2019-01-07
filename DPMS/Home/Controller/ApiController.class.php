<?php
namespace Home\Controller;
use Think\Controller;
class ApiController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }
    //gateway日志
    public function gateway_log(){

        $_SESSION['get']=$_GET;
        exit;
        
        $myfile = fopen(time().".txt", "w") or die("Unable to open file!");
        $txt = json_encode($_GET);      
        fwrite($myfile, $txt);
        fclose($myfile);
        exit;
        $log=array('EventType'=>'Server');
        $log['Text']="开启会话,";
        if($_GET['type']=="close"){$log['Text']="关闭会话,";}
        $log['Text']='DCMP GateWay:'.$log['Text'].'会话ID:'.$_GET['Sessionid'].',审计记录:'.basename($_GET['recordingFile']);
        $log['EventUser']='DCMP GateWay';
        $log['Time']=time();        
        $model=new \Model\LogsystemModel();
        $model->insertlogs($log);
        unset($model);
    }
    //gateway修改工单状态
    public function gateway_updateTaskStatus(){      
         $_SESSION['get']=$_GET;
        exit;    

        $parameter=array('sessionid'=>$_GET['Sessionid']);
        if(intval($_GET['Endtime']==1)){
            //关闭工单
            $parameter['endtime']=time();
            $this->gateway_log();
        }    
        if(!empty($_GET['Status'])){            
            $parameter['status']=$_GET['Status'];
        }  
        if(!empty($_GET['taskid'])){
            //关闭工单
            $parameter['ideimworklog']=$_GET['taskid'];
        }    
        A('Eimaudit/Eimworklog')->MUpdate($parameter);  
    }
    public function test(){
        var_dump($_SESSION);
    }
}