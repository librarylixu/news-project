<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    function index(){
      //  $this->display('Index/win10main');
      FHotfunction();
     $this->redirect('Home/Login/index', array(), 0, '页面跳转中...');
        //A('Home/Login')->index();
    } 
    //检测使用IE内核浏览器后提示页面
    public function isIEkernel(){
        $this->display('Index/IEkernel');
    }

    function eim(){
        #$this->display('Index/login-old');
        $this->display('Index/index');
    }

  

    function session(){
        var_dump($_SESSION);
    }

    function test(){           
        $mailTitle="邮箱标题-CRM自动发送的邮件".time();
        $mailContent='<h1>测试邮件 001</h1>'.time();
        $mailTo="liusq@xinchen.net.cn,lix@xinchen.net.cn,zhangs@xinchen.net.cn,yanxj@xinchen.net.cn,zhangsb@xinchen.net.cn";
        $status=F_SendMail($mailTo,$mailTitle,$mailContent);
        if ($status)
        {
        	echo "发送成功";
        }else{
            echo "发送失败";
        }
       
    }
}