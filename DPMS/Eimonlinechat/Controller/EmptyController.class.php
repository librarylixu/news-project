<?php
namespace Eimdevice\Controller;
use Think\Controller;
class EmptyController extends Controller {
    //�տ���������
    public function _empty(){
		//echo "��Ҫ���ʵ�ҳ�治����";
         $this->display(A('Home/Html')->error404());
    }




}