<?php
namespace Crmcomment\Controller;
use Think\Controller;
/*
评论信息
*/
class CommentlistController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //查询页面的评论
    function select_page_data(){
        $c=new \Model\mCommentlistModel();
        $result=$c->select($_POST);
        $list=array();
        foreach($result as $v){
            $v['_id']=strval($v['_id']);            
            array_push($list,$v);
          //  $list[strval($v['_id'])]=$v;
        }
        unset($c);
        $this->ajaxReturn($list);
    }
    //给页面新增评论
    function insert_page_data(){
        $c=new \Model\mCommentlistModel();
        $value=$_POST;
        $value['userid']=$_SESSION['userinfo']['idusers'];
        $value['username']=$_SESSION['userinfo']['description'];
        $value['child']=array();
        $value['time']=time();       
        $result=$c->insert($value);
        if (!array_key_exists('_id',$result))
        {
        	//失败
            $this->ajaxReturn(0);
            exit;
        }
        $result['_id']=strval($result['_id']);       
        $this->ajaxReturn($result); 
    }

    //子评论新增
    function child_insert_page_data(){
        $c=new \Model\mCommentlistModel();        
        $value=$_POST;
        unset($value['_id']);
        $value['userid']=$_SESSION['userinfo']['idusers'];
        $value['username']=$_SESSION['userinfo']['description'];        
        $value['time']=time(); 
        $push=array(_id=>$_POST['_id']);
        $push['$push']=array(
            child=>$value
        );
        $result=$c->addChild($push);
         unset($c);       
         if ($result['updatedExisting'])
         {
         	$this->ajaxReturn($value);
         }else{
            $this->ajaxReturn(0);
         }
    }
}