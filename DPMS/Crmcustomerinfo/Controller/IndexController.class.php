<?php
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class IndexController extends CommonController {
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    function index(){

        $this->display('Index/index-angular');
    }
}