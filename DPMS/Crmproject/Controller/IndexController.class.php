<?php
namespace Crmproject\Controller;
use Think\Controller;
class IndexController extends Controller {
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    function index(){

        $this->display('Index/index-angular');
    }
}