<?php
namespace Home\Controller;
use Think\Controller;
class ApiController extends Controller {
    //�տ���������
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }
    //gateway��־
    public function gateway_log(){

        $_SESSION['get']=$_GET;
        exit;
        
        $myfile = fopen(time().".txt", "w") or die("Unable to open file!");
        $txt = json_encode($_GET);      
        fwrite($myfile, $txt);
        fclose($myfile);
        exit;
        $log=array('EventType'=>'Server');
        $log['Text']="�����Ự,";
        if($_GET['type']=="close"){$log['Text']="�رջỰ,";}
        $log['Text']='DCMP GateWay:'.$log['Text'].'�ỰID:'.$_GET['Sessionid'].',��Ƽ�¼:'.basename($_GET['recordingFile']);
        $log['EventUser']='DCMP GateWay';
        $log['Time']=time();        
        $model=new \Model\LogsystemModel();
        $model->insertlogs($log);
        unset($model);
    }
    //gateway�޸Ĺ���״̬
    public function gateway_updateTaskStatus(){      
         $_SESSION['get']=$_GET;
        exit;    

        $parameter=array('sessionid'=>$_GET['Sessionid']);
        if(intval($_GET['Endtime']==1)){
            //�رչ���
            $parameter['endtime']=time();
            $this->gateway_log();
        }    
        if(!empty($_GET['Status'])){            
            $parameter['status']=$_GET['Status'];
        }  
        if(!empty($_GET['taskid'])){
            //�رչ���
            $parameter['ideimworklog']=$_GET['taskid'];
        }    
        A('Eimaudit/Eimworklog')->MUpdate($parameter);  
    }
    public function test(){
        var_dump($_SESSION);
    }
}