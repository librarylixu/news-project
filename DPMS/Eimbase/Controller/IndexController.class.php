<?php
/*
    ���ã����ڼ�ⳬʱ���ֹ�����ȹ���
    ����
    2017.11.13
*/
namespace Eimbase\Controller;
use Think\Controller;
class IndexController extends Controller {
    //�տ���������
    public function _empty() {
        $this->display(A('Home/Html')->error404());
    }   
    function test(){
       // A('Home/Html')->loginpage();
       $this->display(A('Home/Html')->kvmPeviceList());
    } 
}
?>