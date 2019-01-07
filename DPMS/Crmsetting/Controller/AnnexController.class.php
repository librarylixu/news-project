<?php
/*
        李旭
     2017/12/07
       附件表
*/
namespace Crmsetting\Controller;
use Crmuser\Controller\CommonController;
class AnnexController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }  
    public $table_colunms;//全部的字段信息
    public $table_name='annex';
    public $modalHtmlPath='Crmsetting@Annex:modal';//模态框的路径
    public $table_key;//只包含字段名称
    public $appid = 30;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        
    }
    function  __destruct(){    
     
    }
    //字段
    function getColunms(){
         /*
    'Type'=>'INT',  字段的数据类型
    'isNull'=>'NOT NULL', 是否为空
    'Comment'=>'', 字段描述
    'Default'=>'', 默认值
    'AutoIncrement'=>'AUTO_INCREMENT' 自增标致

    tValue 自定义的处理标志  md5表示需要该字段的值需要进行md5加密   
       public $table_colunms=array('','name','del','index','path','createtime','deltime','uploaduser','uploadaddress');
    */
       $c=array(
                'idannex'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'附件id'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'附件名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'删除标记 1表示删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序'),
                'path'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'附件路径'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>0,'Comment'=>'创建时间'),
                'deltime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'删除时间'),
                'uploaduser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'上传者'),
                'uploadaddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'上传地址'),
                'filesize'=>array('Type'=>'BIGINT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'文件大小,单位字节'),
                'description'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'文件描述'),
                'filetype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'undefined'",'Comment'=>'文件类型'),
                );
        return $c;
    }
   /*表结构创建*/
   public function create_table(){     
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]
       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }   
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idannex`) )ENGINE = InnoDB COMMENT = '附件表'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","系统设置管理");
		$this->assign("PageName","附件管理");
         $this->assign("mainController","crmAnnexController");
//页面固定ID
        $this->assign("appid",$this->appid);        
        $this->display('Crmsetting@Annex:index-angular');
    }
    //专门处理上传，并把文件保存到默认位置。
     function upload_file(){
		$_path=C('FileUpLoadPath');
		//$_path = '..\\..\\..\\DPMS\\public\\file\\';
        $name= $_FILES[ 'file' ][ 'name' ];
        $guidname=F_guidv4();
        $result=array(status=>false);
        if(move_uploaded_file($_FILES['file']['tmp_name'], $_path.$guidname)){
            $data=$this->MInsert(array(
                name=>$name,
                path=>$_path.$guidname,
                createtime=>time(),
                uploaduser=>$_SESSION['userinfo']['username'],
                uploadaddress=>F_getClientIP(),
                filesize=>$_FILES[ 'file' ][ 'size' ],
                filetype=>$_FILES[ 'file' ][ 'type' ],
            ));
            if (intval($data)>0)
            {
            	$result['path']=$_path.$guidname; 
                $result['status'] =true;
                $result['file']=$_FILES;
                $result['fileid']=$data;
                $this->ajaxReturn($result);
            }else{
                unlink($_path.$guidname); 
                $this->ajaxReturn($result);
            }
        }else{
            $this->ajaxReturn($result);
        }
    }


    /*
        读取Excel文件
    */
    function readExcel(){       
        $fileid=$_POST['fileid'];  
        
        $data=$this->MSelect(array('$find'=>true,'$where'=>array(idannex=>$fileid)));
        $path=$data['path'];
      
        $Importusers = F_ExcelImport($path);	
      
        $this->ajaxReturn($Importusers);
    }

    /*
    pathinfo('abc.jpg.jpng', PATHINFO_EXTENSION)
    读取文件
    */
    function readFile(){
       $file_ext=strtolower(pathinfo($_POST['path'], PATHINFO_EXTENSION));    
        $Importusers=array();  
       switch($file_ext){
           case "xls":
           case "xlsx":
            $Importusers = F_ExcelImport($_POST['path']);	
           break;
           case "png":
           case "jpg":
            $Importusers = $_POST['path'];	
           break;
           case "pdf":

           break;

        }
       $this->ajaxReturn($Importusers);
    }
    //附件下载
    function downLoad(){

     $result= $this->MSelect(array('$find'=>true,'idannex'=>$_GET['idannex']));
     //var_dump($result['path']);
      //var_dump($result['name']);
     F_downloadfile($result['path'],$result['name']);
    }
    //模板下载
    function downLoadtemplate(){
		if(!IS_GET){
			echo "非法提交";
			return;
		}
        //
        $par = $_GET;
        switch ($par['name'])
        {
        case "project":
          $par['name'] = "project.xls";
          break;  
        case "workorder":
          $par['name'] = "workorder.xls";
          break;
        case "customerinfo":
          $par['name'] = "customerinfo.xls";
          break;
        case "product":
          $par['name'] = "product.xls";
          break;
        case "productmodel":
          $par['name'] = "productmodel.xls";
          break;
        case "user":
          $par['name'] = "user.xls";
          break;
        case "contact":
          $par['name'] = "contact.xls";
          break;
        default:
            echo '非法操作';
            return;
        }
		$result = array();
		$result['path'] = C('FileUpLoadPath');
		$result['name'] = $par['name'];
		$path = $result['path'].$result['name'];
		F_downloadfile($path,$result['name']);
    }


}