<?php
namespace Crmsetting\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
}