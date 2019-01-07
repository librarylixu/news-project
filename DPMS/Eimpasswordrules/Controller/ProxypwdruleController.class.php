<?php
namespace Eimpasswordrules\Controller;
use Crmuser\Controller\CommonController;
class ProxypwdruleController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }

    public $table_colunms;//全部的字段信息
    public $table_name='proxypwdrule';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimpasswordrules@Proxypwdrule:modal';//模态框的路径
   // public $appid = 23;//页面固定ID
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        //页面固定ID
     //   $this->assign("appid",$this->appid);
    }
    function  __destruct(){     
    
    }
	//字段
    function getColunms(){	
       $c=array(
                'idproxypwdrule'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'规则名称'),
                'createuserid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'创建者id'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'创建时间'),
                'updatetime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'更新时间时间'),
                'invalidtime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'过期时间'),
                'status'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'0启用1禁用'),
                'del'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>0,'Comment'=>'用于删除'),
				'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
				'refpwdids'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'关联的密码ids,1,2,3,4,5'),
                'refdeviceids'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'关联的设备json格式{{modeltype:0,id:1},{modeltype:0,id:1}}'),
                'refdgroupids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该规则给哪些设备组使用userids,1,2,3,4,5'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该规则给哪些用户使用userids,1,2,3,4,5'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该规则给哪些角色使用userids,1,2,3,4,5'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该规则给哪些用户组使用userids,1,2,3,4,5'),
                'refdevicetype'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'关联的设备类型0资产设备/1kvm主机/2ESXI主机/3VCenter主机/4虚拟机,{{key:0,did:1},{key:0,did:2},{key:1,did:1},}'),
                );
        return $c;
    }
	//proxypwdrule表必须在devicetype表之后创建，so，在Devicetype控制器中调用modeltype的create_table1和init_db1表
	/*表结构创建*/
	public function create_table(){     
		/*
		CREATE TABLE IF NOT EXISTS `xc_crm`.`proxypwdrule` (
  `idproxypwdrule` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  `createuserid` INT NOT NULL,
  `createtime` INT NOT NULL,
  `updatetime` INT NULL,
  `invalidtime` INT NULL COMMENT '过期时间',
  `status` INT NOT NULL DEFAULT 0 COMMENT '0启用1禁用',
  `del` INT NULL DEFAULT 0,
  `remark` TEXT NULL,
  `refpwdids` VARCHAR(45) NULL COMMENT '关联的密码ids,1,2,3,4,5',
  `refdgroupids` VARCHAR(45) NULL COMMENT '该规则给哪些设备组使用userids,1,2,3,4,5',
  `refusers` VARCHAR(45) NULL COMMENT '该规则给哪些用户使用userids,1,2,3,4,5',
  `refutypes` VARCHAR(45) NULL COMMENT '该规则给哪些角色使用userids,1,2,3,4,5',
  `refugroups` VARCHAR(45) NULL COMMENT '该规则给哪些用户组使用userids,1,2,3,4,5',
  `refdevicetype` TEXT NULL COMMENT '关联的设备类型0资产设备/1kvm主机/2ESXI主机/3VCenter主机/4虚拟机\n{\n{key:0,did:1},\n{key:0,did:2},\n{key:1,did:1},\n}',
  PRIMARY KEY (`idproxypwdrule`),
  INDEX `fk_proxypwdrule_users_idx` (`createuserid` ASC),
  CONSTRAINT `fk_proxypwdrule_users`
    FOREIGN KEY (`createuserid`)
    REFERENCES `xc_crm`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '托管密码规则'

	*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s  PRIMARY KEY (`idproxypwdrule`),
  INDEX `fk_proxypwdrule_users_idx` (`createuserid` ASC),
  CONSTRAINT `fk_proxypwdrule_users`
    FOREIGN KEY (`createuserid`)
    REFERENCES `%s`.`%susers` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '托管密码规则';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX']); 
        //echo $sql;
        $result=Fm()->execute($sql);

        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	
	public function index(){
        $this->assign("mainController","eimProxypwdruleController");
        $this->display('Eimpasswordrules@Proxypwdrule:index_angular');
    }
    //关联密码
    public function ref_pwd(){       
        $this->display('Eimpasswordrules@Proxypwdrule:refpwd');
    }
    //关联用户组
    public function ref_ugroup(){       
        $this->display('Eimpasswordrules@Proxypwdrule:refugroup');
    }
    //关联设备组
    public function ref_dgroup(){
        $this->display('Eimpasswordrules@Proxypwdrule:refdgroup');
    }
    //关联用户
    public function ref_user(){
        $this->display('Eimpasswordrules@Proxypwdrule:refuser');
    }
     //关联设备
    public function ref_device(){
        $this->display('Eimpasswordrules@Proxypwdrule:refdevice');
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
        $postdata['createuserid'] = 1;	//没有session，************
        $postdata['createtime'] = time();
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
		if(empty($postdata['typeid'])){
			$postdata['typeid'] = null;
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



}