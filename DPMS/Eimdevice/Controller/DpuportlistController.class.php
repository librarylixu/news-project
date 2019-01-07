<?php
/*
2018年1月15日 	闫绪杰
	

*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class DpuportlistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='dpuportlist';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimdevice@Dpuportlist:modal';//模态框的路径
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
                'iddpuportlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'dpuid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'PDU的ID(父级)'),
                'portnum'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'端口号'),
				'displayname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'端口别名'),
				'portstatus'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'端口状态,0关闭,1开启'),
				'currentvalue'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'电流'),
				'energyvalue'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'电能'),
				'powervalue'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'功率'),
				'alarmcurrentvalue'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Comment'=>'告警值'),
				'errorcurrentvalue'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Comment'=>'故障值'),		
				'statusoidvaluetype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'节点值类型 s / i'),   
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
                'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),                   	
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户id'),               
                'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的角色id'), 
                'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的关联的用户组id'), 
                'refdgroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的设备组id'), 
                'refdidpower'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联的设备的电源,各种设备类型的设备id'),               
                'refdidpowertype'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'关联的设备电源,设备的类型0资产设备/1kvm主机/2/3'),   
                             
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddpuportlist`),
  INDEX `fk_dpuportlist_dpulist_idx` (`dpuid` ASC),
  CONSTRAINT `fk_dpuportlist_dpulist`
    FOREIGN KEY (`dpuid`)
    REFERENCES `xc_crm`.`xc_dpulist` (`iddpulist`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'dpu端口';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{  
			
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化modeltype,Error:'.$e->getMessage()));            
        }
	}

	public function index(){
        $this->assign("MenuName","设备管理");
		$this->assign("PageName","PDU设备管理");
        $this->assign("mainController","eimDpulistController");
        $this->display('Eimdevice@Dpulist:index');
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
        $data=$this->MUpdate($_POST);
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