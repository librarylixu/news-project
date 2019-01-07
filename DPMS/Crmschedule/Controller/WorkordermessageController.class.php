<?php
namespace Crmschedule\Controller;
use Think\Controller;
/*
工单信息
*/
class WorkordermessageController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //查询历史日志
    //$_POST = array('type'=>'controller','refid'=>1)
    function select_page_data(){
        $c=new \Model\mWorkordermessageModel();
        $result=$c->select($_POST);
        unset($c);
        $hisData = array();
        foreach($result as $value){
            array_push($hisData,$value);
        }
        $this->ajaxReturn($hisData);
    }
    //给工单保存内容
    function update_page_data(){
        $c=new \Model\mWorkordermessageModel();
        $value=$_POST;
        $value['time']=time();  
        $result=$c->update($value);
        if($result['ok'] == 1){
            //$parameter['type'] = 'workorder';
            //$parameter['refid'] = $value['workid'];
            ////操作原因描述  $result['updatedExisting']：false添加操作   / true修改操作
            //if(array_key_exists('causedescription',$value) && $result['updatedExisting'] == false){
            //    $parameter['content'] = '添加原因描述：'.$value['causedescription'];
            //}else if(array_key_exists('causedescription',$value) && $result['updatedExisting'] == true){
            //    $parameter['content'] = '修改原因描述：'.$value['causedescription'];
            //}
            ////操作结果描述
            //if(array_key_exists('resultdescription',$value) && $result['updatedExisting'] == false){
            //    $parameter['content'] = '完成工单--添加结果描述：'.$value['resultdescription'];
            //}else if(array_key_exists('resultdescription',$value) && $result['updatedExisting'] == true){
            //    $parameter['content'] = '完成工单--修改结果描述：'.$value['resultdescription'];
            //}
            //$parameter = array();
            //$parameter['appid'] = $this->$appid;         
            //$parameter['dataid'] = $data;    
            //$parameter['datauserid'] = $parameter['userid'];  
            //$parameter['userid'] = $_SESSION['userinfo']['idusers'];
            //$parameter['username'] = $_SESSION['userinfo']['description'];
            //$parameter['haveread'] = "1";//已读
            //A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($parameter);
        }
        $this->ajaxReturn($result); 
    }
    //给工单保存内容
    function add_page_data(){
        $c=new \Model\mWorkordermessageModel();
        $value=$_POST;
        $result=$c->insert($value);
        $this->ajaxReturn($result); 
    }
}