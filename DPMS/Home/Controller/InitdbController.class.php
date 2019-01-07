<?php
/*
	2017年12月7日	闫绪杰	表初始化控制器

*/
namespace Home\Controller;
use Think\Controller;
class InitdbController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }

	public function index(){
		$this->Init_systemsetting_data();
		echo "初始化完成<br>";
	}
	/*
		初始化表数据	
	*/
	public function Init_systemsetting_data(){
		//系统设置初始化
		A('Eimsystemsetting/Systemset')->init_db();

	}






}