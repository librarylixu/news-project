<?php
/*
2018年3月12日 12:07:25 KVM端口设备


*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class KvmportlistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='kvmportlist';
    public $table_key;//只包含字段名称
	//public $modalHtmlPath='Eimdevice@Assetsdevicelist:modal';//模态框的路径
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
    
    }
	//字段
    function getColunms(){	
       $c=array(
                'idkvmportlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
				'tdid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'kvmid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键，KVM设备id'),
                'onofflinestatus'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
                'idelactivestatus'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
				'portnum'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),
				'portname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'displayname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'eid'=>array('Type'=>'VARCHAR(50)','isNull'=>'NULL','Comment'=>''),
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
				'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),   				
				'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
                );
        return $c;
    }
	//初始化表
	public function create_table(){
	/*
		CREATE TABLE IF NOT EXISTS `xc_crm1`.`xc_kvmportlist` (
  `idkvmportlist` INT NOT NULL AUTO_INCREMENT,
  `kvmid` INT NOT NULL,
  `portnum` INT NOT NULL,
  `portname` VARCHAR(45) NOT NULL,
  `portstatus` VARCHAR(45) NULL,
  `displayname` VARCHAR(45) NULL,
  `del` INT NOT NULL DEFAULT 0,
  `index` INT NOT NULL DEFAULT 0,
  `devicesessiontypeids` VARCHAR(45) NULL COMMENT '端口的会话方式',
  `refusers` VARCHAR(45) NULL,
  `refutype` VARCHAR(45) NULL,
  `refugroup` VARCHAR(45) NULL,
  `refdgroupids` VARCHAR(45) NULL,
  PRIMARY KEY (`idkvmportlist`),
  INDEX `fk_kvmportlist_kvmlist_idx` (`kvmid` ASC),
  CONSTRAINT `fk_kvmportlist_kvmlist`
    FOREIGN KEY (`kvmid`)
    REFERENCES `xc_crm1`.`xc_kvmlist` (`idkvmlist`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'kvm端口清单'
	*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idkvmportlist`),
		  INDEX `fk_kvmportlist_kvmlist_idx` (`kvmid` ASC),
		  CONSTRAINT `fk_kvmportlist_kvmlist`
			FOREIGN KEY (`kvmid`)
			REFERENCES `%s`.`xc_kvmlist` (`idkvmlist`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION)
		ENGINE = InnoDB
		COMMENT = 'kvm端口清单';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME']); 
		//var_dump($sql);
		//exit;
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	public function index(){
		$this->display('Eimdevice@Assetsdevicelist:index-angular');
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
		$postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        $data=$this->MInsert($postdata);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
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


 //kvm端口修改页面
   
    public function portmodel(){
        $this->display('Eimdevice@Kvmportlist:portmodel');
    }
     /*查询数据--Dsviewset控制器使用*/
    public function select_data(){        
        $data=$this->MSelect();
        return $data;
    }
    /*更新数据--Dsviewset控制器使用*/
    public function update_data($postdata){

        $data=$this->MUpdate($postdata);
        return $data;
    }
     /*异步新增数据*/
    public function add_data($postdata){		              
        $data=$this->MInsert($postdata);
        return $data;
    }

}