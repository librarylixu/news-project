<?php
/*
	系统设置 - Dsview中心	
*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class DsviewsetController extends CommonController {
	public $table_colunms;//全部的字段信息
    public $table_name='dsviewset';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimsystemsetting@Dsviewset:modal';//模态框的路径	
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
                'iddsviewset'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'dsvname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'名称'),
                'ip'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'DSview IP地址'),
				'loginuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview登录帐号'),
				'loginpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview登录密码'),
				'dbuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview数据库登录帐号'),
				'dbpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview数据库登录密码'),				
				'sessionid'=>array('Type'=>'VARCHAR(100)','isNull'=>'NULL','Comment'=>'登陆DSV后的SessionID,用于开启会话'),   		
                'httpscertificate'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'DSV证书,用于开启会话'),
                'sessiontime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'后台更新数据的时间')            
                );
        return $c;
    }
	//初始化表
	public function create_table(){   
		/*
		CREATE TABLE IF NOT EXISTS `xc_crm`.`dsviewset` (
,
  PRIMARY KEY (`iddsviewset`))
ENGINE = InnoDB
COMMENT = 'DSView设置，DSV管理'
		*/
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddsviewset`))
			ENGINE = InnoDB ",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str); 		
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{
			//添加默认项
			$nValue=array();
            $key=array('iddsviewset','dsvname','ip','loginuser','loginpwd','dbuser','dbpwd');
			//MPU
            $nValue = array_combine($key,array(1,'default','localhost','admin','admin','postgres','Abcd1234!'));
            $result=Fm($this->table_name)->data($nValue)->add();
			echo 'InitDB '.$this->table_name.'==>'.$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Dsviewset,Error:'.$e->getMessage()));            
        }
	}
    //主页面
	public function index(){
		$this->display('Eimsystemsetting@Dsviewset:index');
	}
	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
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

    
//同步设备信息
	//1.查询dsview中所有设备信息
	//2.根据dsview中设备oid查询eim数据库中的设备
	//3.存在则更新，不存在则新增
	public function sync_postgres_devices(){		
    $returnData=array();
			//1.查询dsview中所有设备信息
			//1.1先更新父级设备
			$db = F_getPDO($_POST['ip'],$_POST['dbuser'],$_POST['dbpwd'],'dsvdbase',"5432");
			//dsview父级设备
			$parent_drs = $db->query('SELECT units."timestamp",units.oid,units."name",units.unit_type,units."type",units.ip_address,units.serial_number,unit_category_mappings.category_id FROM avocentdatabase.units,avocentdatabase.unit_category_mappings WHERE units.oid = unit_category_mappings.unit_id and unit_category_mappings.category_id = 1;');	
        //父级设备
			$parentData = array();
			while($row = $parent_drs->fetch()){			
				//3.根据dsview中设备oid查询dra数据库中的设备
				$where = array();
				$where['oid'] = $row['oid'];
				//组建数据源
				$data=array();
				$data['devicename']=$row['name'];
                $data['oid']=$row['oid'];
				$data['ipaddress']=$row['ip_address'];
				$data['sn'] = $row['serial_number'];
				$data['del'] = 0; 
                $parentData[$data['oid']] = $data;                  	
			}
            
	//1.2后更新子集设备：子集设备的parentid是dra数据库中的父级设备id
			$parent_drs = $db->query('SELECT units."timestamp",units.oid,units."name",units.unit_type,units."type",units.ip_address,units.serial_number,unit_category_mappings.category_id,unit_connectivity_mappings.user_port, unit_connectivity_mappings.connection_id,unit_connectivity_mappings.oid as Moid,unit_connectivity_mappings.user_side_unit_id as poid FROM avocentdatabase.unit_connectivity_mappings,avocentdatabase.units,avocentdatabase.unit_category_mappings WHERE unit_connectivity_mappings.target_side_unit_id = units.oid AND units.oid = unit_category_mappings.unit_id and unit_category_mappings.category_id = 2;');
           $childData = array();
			while($row = $parent_drs->fetch()){		
				//3.根据dsview中设备oid查询dra数据库中的设备
				$where = array();
				$where['oid'] = $row['oid'];
				//组建数据源
				$data=array();
				$data['oid']=$row['oid'];
                $data['portname']=$row['name'];
				$data['poid'] = $row['poid'];//子集设备的kvmid是eim数据库中的kvm设备id							
				$data['portnum'] = intval($row['user_port']);
				$data['eid'] = $row['connection_id'];
				$data['del'] = 0;
                  $childData[$data['oid'] ]=$data;
               // var_dump($row);	               
		    } 
          $returnData['parent_data']=$parentData;
           $returnData['child_data']=$childData;
       $this->ajaxReturn($returnData);      
	}
    //同步已选中的设备
    function save_sel_syncdevice(){
    //1.把前台勾选的需要更新的数据源转换成json格式的
        $selData=json_decode($_POST['sel_data'], true);	
        $returnData=Array();	
//$this->ajaxReturn($returnData);  		        
         foreach($selData as $sel){
        
         if(!$sel['ipaddress']){
                continue;
          }   
     
          //2.根据dsview中设备oid查询eim数据库中的设备
          $where = array();
          $where['$find']=true;
		  $where['$where'] = array('ipaddress'=>$sel['ipaddress']);
          $deviceData = A("Eimdevice/Kvmdevicelist")->select_data($where);          
          $data=array();
			$data['deviename']=$sel['deviename'];
			$data['portnum'] = $sel['portnum'];
			$data['eid'] = $sel['eid'];
			$data['ipaddress']=$sel['ipaddress'];
			$data['del']=0;	
         
          if(empty($deviceData)){
          //4.不存在则新增
                $result= A("Eimdevice/Kvmdevicelist")->add_data($data);
                
                if($result>0){
                     $returnData['addparent-'.$result]=$result;
                 }else{
                    $returnData['errparent-'. $data['oid']]= $data['oid'];
                }
           }else{
           //3.存在则更新           
                $data['idkvmlist']=$deviceData['idkvmlist'];
                $result=A("Eimdevice/Kvmdevicelist")->update_data($data);
                $returnData['updateparent-'.$data['idkvmlist']]=$result;
           }             
        }
        foreach($selData as $sel){
            if(!$sel['eid']){
                 continue;
            }
          //2.根据dsview中设备oid查询eim数据库中的设备
         $where = array();
           $where['$find']=true;
           $where['$where'] = array('eid'=>$sel['eid']);     
         $portdeviceData = A("Eimdevice/Kvmportlist")->select_data($where);
          $data=array();
			$data['portname']=$sel['portname'];
			$data['portnum'] = $sel['portnum'];
			$data['eid'] = $sel['eid'];
			$data['del']=0;	
          if(empty($portdeviceData)){
          //4.不存在则新增
                $result= A("Eimdevice/Kvmportlist")->add_data($data);
                if($result>0){
                     $returnData['addport-'.$result]=$result;
                 }else{
                    $returnData['errport-'. $data['oid']]= $data['oid'];
                }
              
           }else{           
             //3.存在则更新 
                $data['idkvmlist']=$portdeviceData['idkvmportlist'];
                $result=A("Eimdevice/Kvmportlist")->update_data($data);
                $returnData['updateport-'.$data['idkvmlist']]=$result;
           }
        }
       $this->ajaxReturn($returnData);  
    }
}