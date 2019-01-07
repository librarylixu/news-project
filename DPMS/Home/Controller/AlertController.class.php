<?php
namespace Home\Controller;
use Think\Controller;
/*
提供给angular使用的html标签
javascript type="text/ng-template"
*/
class AlertController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    /*
    html alert弹出层
    */
    function index(){        
        $this->display('Home@Alert:alert');
    }
    /*
    html confirm弹出层
    */
    function confirm(){        
        $this->display('Home@Alert:confirm');
    }
   
}