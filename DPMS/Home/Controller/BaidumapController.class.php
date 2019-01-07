<?php
namespace Home\Controller;
use Think\Controller;
class BaidumapController extends Controller {
/*
百度地图API
http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/show
*/
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }
    function __construct(){  
        parent::__construct();
        $_SESSION['SouHu']['appid']=C('SouHu')['appid'];
        $_SESSION['SouHu']['appkey']=C('SouHu')['appkey'];
    }   

    function m1(){
        $this->assign('mainController','crmCustomercompanyController');
        $this->display('Baidumap/map');
    }
    function mapdemo(){
        $this->display('Baidumap/mapdemo');
    }
}