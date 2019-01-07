<?php
namespace Crmschedule\Controller;
use Think\Controller;
/*
工单信息
*/
class BusinessmessageController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //查询工单的内容
    function select_page_data(){
        $c=new \Model\mBusinessmessageModel();
        $result=$c->select($_POST,true);
        unset($c);
        $this->ajaxReturn($result);
    }
    //给工单保存内容
    function update_page_data(){
        $c=new \Model\mBusinessmessageModel();
        $value=$_POST; 
        $result=$c->update($value);
        $this->ajaxReturn($result); 
    }
}