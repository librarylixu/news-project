<?php
/*
2018年1月15日 	闫绪杰
	

*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class DpulistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='dpulist';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimdevice@Dpulist:modal';//模态框的路径
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
                'iddpulist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'devicename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'名称'),
                'ipaddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
				'networkstatus'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'网络状态,0:离线,1:在线'),
				'modeltypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键，设备型号id'),				
				'readcommunity'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>'"public"','Comment'=>''),
				'writecommunity'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>'"private"','Comment'=>''),
				'totalcurrent'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'总电流'),
				'totalvoltage'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'总电压'),	
				'totalenergy'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'总电能'),	
				'totalpower'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'总功率'),	
				'powerfactor'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Default'=>0,'Comment'=>'功率因素'),	
				'mincurrent'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Comment'=>'最小告警电流值'),
				'maxcurrent'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Comment'=>'最大告警电流值'),
				'loginuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'loginpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
				'sn'=>array('Type'=>'VARCHAR(50)','isNull'=>'NOT NULL','Comment'=>''),
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
                'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),     
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),               
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联得用户id'),               
                'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联得用户角色id'),               
                'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联得用户组id'),               
                'refdgroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联得设备组id'),    
                                        
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddpulist`),
		  INDEX `fk_dpulist_modeltype_idx` (`modeltypeid` ASC),
		  CONSTRAINT `fk_dpulist_modeltype`
			FOREIGN KEY (`modeltypeid`)
			REFERENCES `%s`.`xc_modeltype` (`idmodeltype`)
			ON DELETE CASCADE
			ON UPDATE CASCADE)
		ENGINE = InnoDB
		COMMENT = 'dpu设备清单';",
            C('CrmDB')['DB_NAME'],
            C('CrmDB')['DB_PREFIX'].$this->table_name,
            $str,
            C('CrmDB')['DB_NAME']); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{
            
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化iddpulist,Error:'.$e->getMessage()));            
        }
	}

	public function index(){
        $this->assign("MenuName","设备管理");
		$this->assign("PageName","PDU设备管理");
        $this->assign("mainController","eimDpulistController");
		//$this->display('Eimdevice@Dpulist:index');
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
		$postdata = $_POST;
        //var_dump($postdata);
        //exit();
        $data=$this->MInsert($postdata);
		if (!empty($data)){
			$postdata['iddpulist'] = $data;
  			$p = $this->add_port_data($postdata);
		}
        $this->ajaxReturn($data);
    }
	//根据设备型号添加端口
	public function add_port_data($pdu){
		$result = array();	
        $portcount = 8;
		switch($pdu['devicetype']){
			case "DPU7016D-8":case "DPU7032D-8":	
                $portcount = 8;
			break;
            case "DPU7016D-12":case "DPU7032D-12":
                $portcount = 12;
            break;
			default:
		}
        $port = array();
		$port['dpuid'] = $pdu['iddpulist'];
		$port['portstatus'] = 0;
		for ($i = 1; $i <= $portcount; $i++){					
			$port['portnum'] = $i;
			$port['displayname'] = $i;					
			$data = A('Eimdevice/Dpuportlist')->MInsert($port);
			array_push($result,empty($data));
		}
		return in_array(false,$a);
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


	//2018年3月1日 14:33:50 PDU操作
	/*异步同步PDU数据*/
	public function sync_pdu_data(){
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
		}
		$postdata = $_POST;
		$result = "ok";
		switch(strtolower($postdata['devicetype'])){
			case "dpu7016d-8":
				$result = $this->sync_pdu7000_data($postdata);
			break;
			default :
				$result = "devicetype error";
			break;
		}
		$this->ajaxReturn($result);
	}
	//2018年2月27日 11:25:31 PHP方式同步PDU7000系列 
	public function sync_pdu7000_data($parms=array()){			
		$dpudata=$this->MSelect($parms);		
		$dpudata = $dpudata[$parms['iddpulist']];
		//var_dump($parms);
		//获取pdu7000系列snmp节点
		$snmpoids = F_pdu_7000_oids();
		$updatepdu = array();//更新pdu数据使用	
		$updatepdu['iddpulist'] = $dpudata['iddpulist'];
		$updateport = array();//更新pdu 端口数据使用		
		//PDU状态
		$command = sprintf('snmpwalk -On -c %s -v 1 %s %s',$dpudata['readcommunity'],$dpudata['dpuip'],$snmpoids['walkoid']['oid']);
		$walkresult = F_pdu_Command($command);
		//snmpwalk失败:原因：1.IP不通，2.节点不对，...
		if(empty($walkresult)){
			$updatepdu['networkstatus'] = 0;
			return "no";
		}
		$updatepdu['networkstatus'] = 1;		
		foreach($walkresult as $value){		
			//PDU电压、电流、电能、功率、功率因素
			if(strpos($value,$snmpoids['voltagevalue']['oid']) !== false){
				$updatepdu['totalvoltage'] = round(F_format_str($value),2);
				continue;
			}else if(strpos($value,$snmpoids['currentvalue']['oid']) !== false){
				$updatepdu['totalcurrent'] = round(F_format_str($value),2) / 10;
				continue;
			}else if(strpos($value,$snmpoids['powervalue']['oid']) !== false){
				$updatepdu['totalpower'] = round(F_format_str($value),2);
				continue;
			}else if(strpos($value,$snmpoids['powerfactorvalue']['oid']) !== false){
				$updatepdu['powerfactor'] = round(F_format_str($value),2);
				continue;
			}else if(strpos($value,$snmpoids['energyvalue']['oid']) !== false){
				$updatepdu['totalenergy'] = round(F_format_str($value),2) / 10;
				continue;
			}else if(strpos($value,$snmpoids['sn']['oid']) !== false){
				$updatepdu['sn'] = F_format_str($value);
				continue;
			}
			//PDU端口 电流、电能、状态
			foreach($snmpoids['portcurrentoid'] as $k=>$v){	
			    if(strpos($value,$snmpoids['portcurrentoid'][$k]['oid']) !== false){
			        $updateport[$k]['currentvalue'] = round(F_format_str($value),2) / 100;
			        break;
			    }
			    if(strpos($value,$snmpoids['portenergyoid'][$k]['oid']) !== false){
			        $updateport[$k]['energyvalue'] = round(F_format_str($value),2) / 10;
			        break;
			    }
			    if(strpos($value,$snmpoids['portstatusoid'][$k]['oid']) !== false){
			        $updateport[$k]['portstatus'] = F_format_str($value) == "ON" ? 1 : 0;
			        break;
			    }
			}
		}		
		//更新pdu数据
		$data=$this->MUpdate($updatepdu);		
		//更新端口数据
		$portdata=A("Dpuportlist")->MSelect(array('dpuid'=>$updatepdu['iddpulist']));
		foreach($portdata as $k=>$v){
			$updateportdata = array();
			$updateportdata['iddpuportlist'] = $v['iddpuportlist'];
			$updateportdata['portstatus'] = $updateport[$v['portnum']]['portstatus'];
			$updateportdata['currentvalue'] = $updateport[$v['portnum']]['currentvalue'];
			$updateportdata['energyvalue'] = $updateport[$v['portnum']]['energyvalue'];
			$updateport[$v['portnum']]['iddpuportlist'] = $v['iddpuportlist'];
			$data=$this->MUpdate($updateportdata);
		}			
		if(empty($data)){		
			$resultdata = array();	
			$resultdata['pdu'] = $updatepdu;
			$resultdata['port'] = $updateport;
			return $resultdata;
		}
  		return "no";
	}

	/*端口操作*/
	public function async_port_action(){
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
		}
		$postdata = $_POST;
		//判断密码
		if (empty($postdata['pwd']) || md5($postdata['pwd']) != $_SESSION['userinfo']['pwd']){
			$this->ajaxReturn("pwd error");
			return;
		}
		$result = "ok";
		switch(strtolower($postdata['devicetype'])){
			case "dpu7016d-8":
				/*
					$postdata 参数：
					portid:iddpuportlist
					dpuid:
					dpuip:
					portnum：端口号	需要操作的端口号
					status：ON OFF 需要执行的操作
				*/
				$result = $this->port_action_pdu7000($postdata);
				//更新数据库
				if ($result == "ok"){
					$where = array();
					$where['iddpuportlist'] = $postdata['portid'];
					$where['portstatus'] = $postdata['status'] == "ON" ?1:0;	
					$data=A('Dpuportlist')->MUpdate($where);
				}
			break;
			default :
				$result = "devicetype error";
			break;
		}
		$this->ajaxReturn($result);
	}
	public function port_action_pdu7000($postdata){		
		$portnum = $postdata['portnum'];
		$dpuip = $postdata['dpuip'];		
		//获取pdu7000系列snmp节点
		$snmpoids = F_pdu_7000_oids();
		$portoid = $snmpoids['portstatusoid'][$portnum]['oid'];
		$status = $postdata['status'];
		//snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s ON
		$command = sprintf("snmpset -v 1 -c private %s %s s %s",$dpuip,$portoid,$status);
		$resutl = F_pdu_snmpset($command);	
		$actionlog = array();
		$parameter['dpuid'] = $postdata['dpuid'];
		$parameter['portnum'] = $portnum;
		$parameter['actionstatus'] = $status;
		$parameter['result'] = $resutl ? "成功" : "失败";
		A("Eimlog/Logportaction")->add_port_action_log($parameter);
		return 	$resutl ? "ok" : "no";
	}

	function session(){
		var_dump($_SESSION);
	}
    //dpu页面
    public function pdulist(){
        $this->display('Eimdevice@Dpulist:dpulist');
    }
    //流线图测试
    public function test(){
        $this->display('Eimdevice@Dpulist:test');
    }
      //批量导入预览
    function preview(){
        $this->display('Eimdevice@Dpulist:preview');        
    }

}