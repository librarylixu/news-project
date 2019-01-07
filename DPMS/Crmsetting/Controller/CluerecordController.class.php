<?php
namespace Crmsetting\Controller;
use Think\Controller;
/*
历史日志
*/
class CluerecordController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //查询历史日志
    //$_POST = array('type'=>'controller','refid'=>1)
    function select_page_data(){
        $c=new \Model\mCluerecordModel();
        $result=$c->select($_POST);
        unset($c);
        $hisData = array();
        foreach($result as $value){
            array_push($hisData,$value);
        }
        $this->ajaxReturn($hisData);
    }
    //保存历史记录
    function insert_page_data(){
        if(!IS_POST){
            exit;
        }
        $par=$_POST;
        $c=new \Model\mCluerecordModel();
        $par['time']=time();       
        $par['userid'] = $_SESSION['userinfo']['idusers'];
        $result=$c->insert($par);
         if(empty($result['_id'])){
            $par['ok'] = 1;
            $this->ajaxReturn($par);
        }else{
            $par['ok'] = 1;
            $this->ajaxReturn($par);
        }        
    }
    //给控制器使用的 
    function insert_controller_data($parameter){
        $par=$parameter;
        $c=new \Model\mCluerecordModel();
        $par['time']=time();       
        $par['userid'] = $_SESSION['userinfo']['idusers'];
        $result=$c->insert($par);
        return $result;
    }
    function test(){
            $par['type'] = 'workorder';
            $par['refid'] = 1;
            $par['text'] = '创建工单,成功。';
            $resultdata = $this->update_page_data($par);
            var_dump($resultdata);
    }
}