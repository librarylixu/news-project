<?php
namespace Crmhistorymessageboard\Controller;
use Think\Controller;
/*
    2018年12月19日 16:34:04
    历史记录 留言板
*/
class HistorymessageboardController extends CommonController {
   public $model;//数据库对象
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mHistoryMessageBoardModel();

   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //工单操作日志
    public function index(){
        //$this->assign("mainController","eimSystemlogController");
		//$this->display('Crmhistorymessageboard@Workorderlog:index'); 
    }

    public function select_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        $postdata = $_POST;
        $data=$this->MSelect($postdata);
        $this->ajaxReturn($data);
    }

    public function insert_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        $postdata = $_POST;
        $data=$this->insert_controller_data($postdata);        
        $this->ajaxReturn($data);
    }

     //添加haveread = 0:已读，1:未读
    public function insert_controller_data($parms=array("haveread"=>"0")){
        $parms['time'] = time();
        $parms['userid'] = $_SESSION['userinfo']['idusers'];
        $parms['username'] = $_SESSION['userinfo']['description'];
        $result = $this->MInsert($parms);
        return $result;
    }
    //回复
    public function reply_content_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        $postdata = $_POST;
        $child = json_decode($postdata['child'],true);
        foreach($child as $k=>$v){
            $v['time'] = time();
            $v['userid'] = $_SESSION['userinfo']['idusers'];
            $v['username'] = $_SESSION['userinfo']['description'];
            $child[$k] = $v;
        }
        $postdata['child'] = $child;
        $result = $this->MUpdate($postdata);
        $this->ajaxReturn($result);
    }



    
    //public function insert(){
    //    $data=array();
    //    $data['appid'] = "42";
    //    $data['guid'] = "42";
    //    $data['content'] = "测试内容......";
    //    $data['dataid'] = "22";
    //    $data['datauserid'] = "1";
    //    $data['haveread'] = "0";
    //    $data['time'] = time();
    //    $result = $this->MInsert($data);
    //    var_dump($result);
    //}



    public function testfind(){
        //var_dump($this->model->table_colunms);
        //exit();
        //foreach($postdata as $key=>$value){
        //    if(array_key_exists($key,$this->model->table_colunms)){
        //        if($this->model->table_colunms[$key]['value'] == "int"){
        //            $postdata[$key] = intval($value);
        //        }
        //    }
        //}
        //exit();

        $where = array();
        //$where['dataid'] = 465;
        //$where['guid'] = "{DFE3CA36-BF7D-4B3E-B5DE-9646DBA602CF}";
        //$where['time'] = 1545276391;
        $where['_id'] = 1545276391;
        $data=$this->MSelect($where);
        var_dump($data);
    }










}