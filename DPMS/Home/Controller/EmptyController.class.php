<?php
namespace Home\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //�տ���������
    public function _empty(){
		$this->display(A('Home/Html')->error404());	
    }


}