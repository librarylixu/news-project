<?php
/*
	2018年1月10日 	闫绪杰
	

*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class ModeltypeController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='modeltype';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimdevice@Modeltype:modal';//模态框的路径
    public $appid = 23;//页面固定ID
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
                'idmodeltype'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'modelname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'型号名称'),
                'typeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),
				'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的会话类型'),
                'labelclass'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'#5661c9'",'Comment'=>'label标签的颜色'),
                );
        return $c;
    }
	//modeltype表必须在devicetype表之后创建，so，在Devicetype控制器中调用modeltype的create_table1和init_db1表
	/*表结构创建*/
	public function create_table(){     
		/*
		CREATE TABLE IF NOT EXISTS `xc_crm`.`modeltype` (
		  `idmodeltype` INT NOT NULL AUTO_INCREMENT,
		  `modelname` VARCHAR(45) NOT NULL COMMENT '型号名称',
		  `typeid` INT NOT NULL,
		  `del` INT NOT NULL DEFAULT 0,
		  `index` INT NOT NULL DEFAULT 0,
		  `labelclass` VARCHAR(45) NOT NULL DEFAULT '#5661c9',
		  PRIMARY KEY (`idmodeltype`),
		  INDEX `fk_modeltype_devicetype_idx` (`typeid` ASC),
		  CONSTRAINT `fk_modeltype_devicetype`
			FOREIGN KEY (`typeid`)
			REFERENCES `xc_crm`.`devicetype` (`iddevicetype`)
			ON DELETE CASCADE
			ON UPDATE CASCADE)
		ENGINE = InnoDB
		COMMENT = '设备型号'

	*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idmodeltype`),
		  INDEX `fk_modeltype_devicetype_idx` (`typeid` ASC),
		  CONSTRAINT `fk_modeltype_devicetype`
			FOREIGN KEY (`typeid`)
			REFERENCES `%s`.`%s` (`iddevicetype`)
			ON DELETE CASCADE
			ON UPDATE CASCADE)
		ENGINE = InnoDB
		COMMENT = '设备型号';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'devicetype'); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	 /*初始化表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idmodeltype','modelname','typeid');
			//MPU
            $nValue = array_combine($key,array(1,'MPU104E',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'MPU108E',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'MPU1016',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'MPU1016DAC',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'MPU2016',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'MPU2016DAC',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'MPU2032',1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,'MPU2032DAC',1));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(9,'MPU4032',1));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(10,'MPU4032DAC',1));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(11,'MPU8032',1));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(12,'MPU8032DAC',1));
            $result=Fm($this->table_name)->data($nValue)->add();
			//ACS
            $nValue = array_combine($key,array(13,'ACS6001',2));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(14,'ACS6004',2));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(15,'ACS6008',2));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(16,'ACS6016',2));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(17,'ACS6032',2));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(18,'ACS6048',2));
            $result=Fm($this->table_name)->data($nValue)->add();			
			//虚拟机
			$nValue = array_combine($key,array(19,'ESX5.0',7));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(20,'ESX5.1',7));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(21,'ESX5.5',7));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(22,'ESXI5.0',6));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(23,'ESXI5.5',6));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(24,'ESXI6.0',6));
            $result=Fm($this->table_name)->data($nValue)->add();
			//UMG
			$nValue = array_combine($key,array(25,'UMG2000',3));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(26,'UMG4000',3));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(27,'UMG6000',3));
            $result=Fm($this->table_name)->data($nValue)->add();
			//AV
			$nValue = array_combine($key,array(28,'AV2216',5));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(29,'AV3008',5));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(30,'AV3016',5));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(31,'AV3200',5));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(32,'AV3216',5));
            $result=Fm($this->table_name)->data($nValue)->add();
			//PDU
			$nValue = array_combine($key,array(33,'MPI',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(34,'MPH-2',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(35,'DPU6008A',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(36,'DPU6008B',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(37,'DPU6008C',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(38,'DPU6008D',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(39,'DPU7016D-8',9));
            $result=Fm($this->table_name)->data($nValue)->add();
			//ASSETS
			$nValue = array_combine($key,array(40,'Windows',10));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(41,'Centos6.5',10));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(42,'Catalyst9300',10));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化modeltype :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化modeltype,Error:'.$e->getMessage()));            
        } 
    }

	public function index(){
        $this->assign("mainController","eimModeltypeController");
        $this->display('Eimdevice@Modeltype:index');
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
            unset($postdata['typeid']);
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