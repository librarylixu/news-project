<?php
namespace Crmsetting\Controller;
use Think\Controller;
/*
建议箱
*/
class SuggestboxController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
   /*展示页面*/
    public function index(){  
        $this->assign("MenuName","建议箱");
		$this->assign("PageName","请发表您宝贵的建议");
         $this->assign("mainController","SuggestionController");
        $this->display('Crmsetting@Suggestbox:index');
    }
    //查询建议
    //$_POST = array('type'=>'controller','refid'=>1)
    function select_page_data(){
        $c=new \Model\mSuggestboxModel();
        $result=$c->select($_POST);
        unset($c);
        $hisData = array();
        foreach($result as $value){
            array_push($hisData,$value);
        }
        $this->ajaxReturn($hisData);
    }
    //保存建议
    function insert_page_data(){
        $c=new \Model\mSuggestboxModel();
        $par = $_POST;
        $par['stime']=time();//发布时间        
        $par['status']=0;//处理状态          
        $par['userid'] = $_SESSION['userinfo']['idusers'];//建议人
        $result=$c->insert($par);
        $this->ajaxReturn($result);
    }
    //模态框
    public function openmodal(){
        $this->assign("mainController","modalSuggestboxController");
        $this->display('Crmsetting@Suggestbox:modal');
    }
}