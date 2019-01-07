<?php
/*
2018年3月12日 12:07:25 资产设备

*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class AssetsdevicelistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='assetslist';
    public $table_key;//只包含字段名称
	public $modalHtmlPath='Eimdevice@Assetsdevicelist:modal';//模态框的路径
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
                'idassetslist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'modeltypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键，设备型号id'),
				'sessionstatus'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>0,'Comment'=>'设备会话状态0:空闲,1:使用中'),
                'ipaddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),	
				'devicename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>0,'Comment'=>''),
				'loginuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'loginpwd'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>''),
				'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
				'remark'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'备注'),
				'sn'=>array('Type'=>'VARCHAR(50)','isNull'=>'NULL','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),   
				'sessionsetting'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'会话类型的自定义配置：（即：是否开启鼠标粘贴，是否启用真彩色等）保存格式：json{rdp:{ssl:true},ssh:{ssl:true}}'),
				'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'refsessioncenterid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),		
				'isenterpwd'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'是否需要手动输入密码0:不需要,1:需要'),   
				'refenterpwd'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'isenterpwd为真时,开启会话时需要输入密码的用户,存id,例:1,3,4,5')
                );
        return $c;
    }
	//初始化表
	public function create_table(){
	/*
		CREATE TABLE IF NOT EXISTS `xc_crm1`.`xc_assetslist` (
  `idassetslist` INT NOT NULL AUTO_INCREMENT,
  `modeltypeid` INT NOT NULL,
  `devicename` VARCHAR(45) NULL,
  `ipaddress` VARCHAR(45) NULL,
  `loginuser` VARCHAR(45) NULL,
  `loginpwd` VARCHAR(255) NULL,
  `contactpeople` VARCHAR(45) NULL,
  `remark` TEXT NULL,
  `del` INT NULL DEFAULT 0,
  `index` INT NULL,
  `sn` VARCHAR(45) NULL,
  `sessionsetting` TEXT NULL COMMENT '会话类型的自定义配置：（即：是否开启鼠标粘贴，是否启用真彩色等）\n保存格式：json\n{\nrdp:{ssl:true},\nssh:{ssl:true}\n}',
  `refusers` VARCHAR(45) NULL,
  `refutype` VARCHAR(45) NULL,
  `refugroup` VARCHAR(45) NULL,
  `devicesessiontypeids` VARCHAR(45) NULL,
  `refsessioncenterid` VARCHAR(45) NULL COMMENT '会话控制中心',
  PRIMARY KEY (`idassetslist`),
  INDEX `fk_assetslist_modeltype1_idx` (`modeltypeid` ASC),
  CONSTRAINT `fk_assetslist_modeltype1`
    FOREIGN KEY (`modeltypeid`)
    REFERENCES `xc_crm1`.`xc_modeltype` (`idmodeltype`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '资产设备清单'
	*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idassetslist`),
		  INDEX `fk_assetslist_modeltype_idx` (`modeltypeid` ASC),
		  CONSTRAINT `fk_assetslist_modeltype`
			FOREIGN KEY (`modeltypeid`)
			REFERENCES `%s`.`xc_modeltype` (`idmodeltype`)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION)
		ENGINE = InnoDB
		COMMENT = '资产设备清单';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME']); 
		//var_dump($sql);
		//exit;
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	public function index(){
        $this->assign("mainController","eimAssetsdeviceController");
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
	//当前设备的会话详细配置
	public function openmodalconfig(){
        $this->display('Eimdevice@Assetsdevicelist:config-info'); 
    }
	//open ssh 
	public function open_session_ssh_page(){		
		$this->display('Assetsdevicelist/session/ssh');
	}


	function session(){
		var_dump($_SESSION);
	}


}