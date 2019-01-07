<?php
namespace Home\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //¿Õ¿ØÖÆÆ÷²Ù×÷
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }


}