<?php
namespace Crmbase\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //空控制器操作
    public function _empty(){        
        echo '404';
		 //$this->display(A('Home/Html')->error404());
    }
}