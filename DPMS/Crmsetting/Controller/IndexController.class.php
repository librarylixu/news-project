<?php
namespace Crmsetting\Controller;
use Think\Controller;
class IndexController extends Controller {
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    function index(){

        $this->display('Index/index-angular');
    }
    //待处理事项页面
    public function matter(){
        $this->assign("MenuName","待处理事项");
        $this->assign("PageName","这里记录了您未完成或新发布的事项");
        $this->display('Index/matter');
    }
}