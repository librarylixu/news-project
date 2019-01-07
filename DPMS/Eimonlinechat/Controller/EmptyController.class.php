<?php
namespace Eimdevice\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }




}