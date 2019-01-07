<?php
namespace Crmsetting\Controller;
use Think\Controller;
class VersionController extends Controller {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
     public function index(){  
        $this->assign("MenuName","更新日志");
		$this->assign("PageName","软件更新记录展示");
        // $this->assign("mainController","VersionController");        
        $this->display('Crmsetting@Version:index');
    }
     public function question(){  
        $this->assign("MenuName","常见问题");
		$this->assign("PageName","常见问题解决方案");
        // $this->assign("mainController","VersionController");        
        $this->display('Crmsetting@Version:question');
    }
}