<?php
/*
	我的设备 - 我的设备组	
*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class MydevicegroupController extends CommonController {
	public $table_colunms;//全部的字段信息
    public $table_name='mydevicegroup';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimsystemsetting@Mydevicegroup:modal';//模态框的路径	
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
    
    }
	   //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
	//字段
    function getColunms(){	
       $c=array(
                'idmydevicegroup'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'groupname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'名称'),
                'pid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),
				'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户id'),
				'deviceid'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'由于设备为多个表,so,这里保存格式为json({表名:[2,5,6]}),例如:{"kvm":[1,2,3,5,8,4],"pdu":[5,6,9,8,7,4]}'),
                );
        return $c;
    }
	//初始化表
	public function create_table(){   
		/*
		CREATE TABLE IF NOT EXISTS `xc_crm1`.`sessioncenterlist` (
		  `idsessioncenterlist` INT NOT NULL AUTO_INCREMENT,
		  `name` VARCHAR(45) NOT NULL,
		  `ip` VARCHAR(45) NOT NULL COMMENT 'IP地址',
		  `port` VARCHAR(45) NOT NULL DEFAULT '1336' COMMENT '端口号',
		  `licensecount` INT NOT NULL DEFAULT 5 COMMENT '授权数量 5,20,30',
		  `mark` TEXT NULL,
		  `configjson` TEXT NULL COMMENT '会话中心默认配置项,保存格式：json',
		  `index` INT NOT NULL DEFAULT 0,
		  `del` INT NOT NULL DEFAULT 0 COMMENT '1:删除',
		  PRIMARY KEY (`idsessioncenterlist`))
		ENGINE = InnoDB
		COMMENT = '会话控制中心'
		*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idmydevicegroup`),
              INDEX `fk_mydevicegroup_users1_idx` (`userid` ASC),
              CONSTRAINT `fk_mydevicegroup_users1`
                FOREIGN KEY (`userid`)
                REFERENCES `%s`.`%s` (`idusers`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB;",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'users'); 		
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{
			//添加默认项
			$nValue=array();
            $key=array('idmydevicegroup','groupname','pid','userid','deviceid');
            $result=Fm($this->table_name)->data($nValue)->add();
			echo 'InitDB '.$this->table_name.'==>'.$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Sessioncenterlist,Error:'.$e->getMessage()));            
        }
	}
    //我的设备页面
    public function mydevice(){
        $this->assign("MenuName","我的设备");
		$this->assign("PageName","我的设备");
        $this->assign("mainController","eimMydeviceController");
        $this->display('Eimsystemsetting@Mydevicegroup:device-angular');
    }
    //我的设备组页面
    public function mydevicegroup(){
        $this->assign("MenuName","我的设备");
		$this->assign("PageName","我的设备组");
        $this->assign("mainController","eimMydevicegroupController");
        $this->display('Eimsystemsetting@Mydevicegroup:devicegroup-angular');
    }



	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		$postdata['del'] = 0;
        $data=$this->MSelect($postdata);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){		
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }	
		$postdata = $_POST;
        $postdata['userid'] = 1;//$_SESSION['userinfo']['idusers']
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
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		$postdata['del'] = 1;
		$data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    //tree数据include\
    public function mydevicegrouptreedata(){
        $this->display('Eimsystemsetting@Mydevicegroup:mydevicegrouptreedata');
    }
}