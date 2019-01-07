<?php
namespace Home\Controller;
use Think\Controller;
/*
入口文件
*/
class MainpageController extends Controller {
    //空控制器操作
    public function _empty(){
		A("Empty")->_empty();	
    }

	public function index(){
		$this->display(A("Home/Html")->mainPage());
	}




}