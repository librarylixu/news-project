<?php
/*
2018/01/22 lsq
*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class VmdevicelistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='vmdevicelist';
    public $table_key;//只包含字段名称
    public $appid = 31;//页面固定ID
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        //页面固定ID
        $this->assign("appid",$this->appid);
    }
    function  __destruct(){     
		
    }
	//字段
    function getColunms(){	
       $c=array(
                'idvmdevicelist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'icon'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
                'serverid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),
                'powerstatus'=>array('Type'=>'VARCHAR(45)','Comment'=>''),                
                'ipaddress'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
				'devicename'=>array('Type'=>'VARCHAR(45)','Comment'=>''),                
				'vmid'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
                'uuid'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
                'guestid'=>array('Type'=>'VARCHAR(255)','Comment'=>''),
                'systemtype'=>array('Type'=>'VARCHAR(255)','Comment'=>''),
                'cpunum'=>array('Type'=>'INT','Comment'=>''),
                'virtualdisksnum'=>array('Type'=>'INT','Comment'=>''),
                'memarysize'=>array('Type'=>'INT','Comment'=>''),
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
				'refusers'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
				'refutype'=>array('Type'=>'VARCHAR(45)','Comment'=>''),				
                'refugroup'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
				'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','Comment'=>''),    
                'refdgroup'=>array('Type'=>'INT','VARCHAR(45)','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),    
                'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),                    
                );
        return $c;
    }
	//初始化表
	public function create_table(){
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idvmdevicelist`),
          INDEX `fk_vmdevicelist_esxserverlist_idx` (`serverid` ASC),
          CONSTRAINT `fk_vmdevicelist_esxserverlist`
            FOREIGN KEY (`serverid`)
            REFERENCES `%s`.`%s` (`idesxserverlist`)
            ON DELETE CASCADE
            ON UPDATE CASCADE)
        ENGINE = InnoDB;",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'esxserverlist'); 
 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{
			
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化vmdevicelist,Error:'.$e->getMessage()));            
        }
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
        $data=$this->MInsert($_POST);
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