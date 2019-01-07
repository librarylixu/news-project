<?php
/*
2018年09月12日
批量上传
*/
namespace Eimbase\Controller;
use Crmuser\Controller\CommonController;
class BatchimportController extends CommonController {
    //空控制器操作
    public function _empty(){       
		$this->display(A('Home/Html')->error404());
    }
 //专门处理上传，并把文件保存到默认位置。
     
    //批量导入
    function fecth_import_users(){
       $_path=C('FileUpLoadPath');
		//$_path = '..\\..\\..\\DPMS\\public\\file\\';
        $name= $_FILES[ 'file' ][ 'name' ];
        $guidname=F_guidv4();
        $result=array(status=>false);
        if(move_uploaded_file($_FILES['file']['tmp_name'], $_path.$guidname)){            

            	$result['path']=$_path.$guidname; 
                $result['status'] =true;
                $result['file']=$_FILES;
                $this->ajaxReturn($result);
        }

    }
     /*
        读取Excel文件
    */
    function readExcel(){       
        $fileid=$_POST['fileid'];  

        $path=$_POST['fileid'];
      
        $Importusers = F_ExcelImport($path);	
      
        $this->ajaxReturn($Importusers);
    }

}