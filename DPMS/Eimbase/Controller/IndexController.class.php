<?php
/*
    作用：用于检测超时或防止盗链等功能
    李旭
    2017.11.13
*/
namespace Eimbase\Controller;
use Think\Controller;
class IndexController extends Controller {
    //空控制器操作
    public function _empty() {
        $this->display(A('Home/Html')->error404());
    }   
    function test(){
       // A('Home/Html')->loginpage();
       $this->display(A('Home/Html')->kvmPeviceList());
    } 
}
?>