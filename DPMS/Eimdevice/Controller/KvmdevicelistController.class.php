<?php
/*
2018年3月12日 12:07:25 KVM设备
*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class KvmdevicelistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='kvmlist';
    public $table_key;//只包含字段名称
	//public $modalHtmlPath='Eimdevice@Assetsdevicelist:modal';//模态框的路径
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
    
    }

     //kvm页面
     public function index(){
       $this->assign("mainController","eimKvmdeviceController");
        $this->display('Eimdevice@Kvmdevicelist:index');
    }
	//字段
    function getColunms(){	
       $c=array(
                'idkvmlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
				'tdid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'devicename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
                'displayname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),                
                'modeltypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键，设备型号id'),
                'networkstatus'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'网络状态,0:离线,1:在线'),
                'ipaddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
				'icon'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
				'loginuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'loginpwd'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>''),	
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
				'sn'=>array('Type'=>'VARCHAR(50)','isNull'=>'NULL','Comment'=>''),
                'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'端口会话类型id'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),   				
				'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'refdgroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                 'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),        
                );
        return $c;
    }
	//初始化表
	public function create_table(){
	/*
		CREATE TABLE IF NOT EXISTS `xc_crm1`.`xc_kvmlist` (
  `idkvmlist` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `modeltypeid` INT NOT NULL,
  `networkstatus` INT NOT NULL DEFAULT 0,
  `ip` VARCHAR(45) NULL,
  `del` INT NOT NULL DEFAULT 0,
  `index` INT NOT NULL DEFAULT 0,
  `sn` VARCHAR(45) NOT NULL DEFAULT '0' COMMENT '序列号',
  `loginuser` VARCHAR(45) NULL,
  `loginpwd` VARCHAR(255) NULL,
  `refusers` VARCHAR(45) NULL COMMENT '关联的用户',
  `refutype` VARCHAR(45) NULL,
  `refugroup` VARCHAR(45) NULL,
  PRIMARY KEY (`idkvmlist`),
  INDEX `fk_kvmlist_modeltype_idx` (`modeltypeid` ASC),
  CONSTRAINT `fk_kvmlist_modeltype`
    FOREIGN KEY (`modeltypeid`)
    REFERENCES `xc_crm1`.`xc_modeltype` (`idmodeltype`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'kvm设备'
	*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idkvmlist`),
		  INDEX `fk_kvmlist_modeltype_idx` (`modeltypeid` ASC),
		  CONSTRAINT `fk_kvmlist_modeltype`
			FOREIGN KEY (`modeltypeid`)
			REFERENCES `%s`.`xc_modeltype` (`idmodeltype`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION)
		ENGINE = InnoDB
		COMMENT = 'kvm设备';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME']); 
		//var_dump($sql);
		//exit;
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){		
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }	
		$postdata = $_POST;
        //加密
        if(!empty($postdata['loginpwd'])){
            $postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        }
        $data=$this->MInsert($postdata);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit();
        }
		$postdata = $_POST;
		//
		if(!empty($postdata['loginpwd']) && $postdata['loginpwd'] == ""){
			unset($postdata['loginpwd']);			
		}else{
			$postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
		}
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MDelete($_POST);
        $this->ajaxReturn($data);
    }
     //批量导入预览
    function preview(){
        $this->display('Eimdevice@Esxserverlist:preview');        
    }
    /*查询数据--Dsviewset控制器使用*/
    public function select_data($postdata){     
        $data=$this->MSelect($postdata);
        return $data;
    }
    /*更新数据--Dsviewset控制器使用*/
    public function update_data($postdata){        
		if(!empty($postdata['loginpwd']) && $postdata['loginpwd'] == ""){
			unset($postdata['loginpwd']);			
		}else{
			$postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
		}
        $data=$this->MUpdate($postdata);
        return $data;
    }
     /*异步新增数据*/
    public function add_data($postdata){		      
        //加密
        if(!empty($postdata['loginpwd'])){
            $postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        }
        $data=$this->MInsert($postdata);
        return $data;
    }
}