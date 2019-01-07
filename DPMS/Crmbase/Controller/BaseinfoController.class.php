<?php
namespace Crmbase\Controller;
use Think\Controller;
/*
  公共的自定义指令页面
*/
class BaseinfoController extends Controller {
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //pageBtn
    //页面按钮指令页面
    function pagebtn(){
        $this->display('Crmbase@Baseinfo:pagebtn');
    }
    //uploadBtn
    //批量导入页面
    function uploadBtn(){
        $this->display('Crmbase@Baseinfo:uploadbtn');
    }
    //评论展示
    function pageComment(){   
        $this->display('Crmbase@Baseinfo:pagecomment');
    }
    //datepicker
     function datepicker(){
        $this->display('Crmbase@Baseinfo:datepicker');
    }
    //自定义指令--单元格编辑
    public function editconfix(){
		$this->display("Crmbase@Baseinfo:edit_confix");
	}
    //CRM使用手册
    public function instructions(){
        $pdffile = C('FileHandBookPath');
        if(strtolower(substr(strrchr($pdffile,'.'),1)) != 'pdf') { 
            echo '文件格式不对.'; 
            return; 
        } 
        if(!file_exists($pdffile)) { 
            echo '文件不存在'; 
            return; 
        } 
        header('Content-type: application/pdf'); 
        header('filename='.$pdffile); 
        readfile($pdffile); 
    }
    //给页面分页用的include
    public function setpaging(){
        $this->display('Crmbase@Baseinfo:setpaging'); 
    }
}