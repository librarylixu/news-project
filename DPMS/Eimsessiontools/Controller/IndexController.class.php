<?php
/*
	2017.11.30	闫绪杰



*/
namespace Eimsessiontools\Controller;
use Think\Controller;
class IndexController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    function index(){
        $this->redirect('Home/Login/index', array(), 0, '页面跳转中...');
    }

 
}