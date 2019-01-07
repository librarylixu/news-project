<?php
namespace Home\Controller;
use Think\Controller;
/*
数据分析控制器
*/
class DnalysisController extends Controller {   
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    function index(){
        $this->display('Dnalysis/index');
    } 

}