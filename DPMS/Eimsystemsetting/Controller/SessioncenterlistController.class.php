<?php
/*
	2017.11.30	闫绪杰
	系统设置 - 会话控制中心	
*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class SessioncenterlistController extends CommonController {
	public $table_colunms;//全部的字段信息
    public $table_name='sessioncenterlist';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimsystemsetting@Sessioncenterlist:modal';//模态框的路径	
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
                'idsessioncenterlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'名称'),
                'ip'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
				'port'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>'1336','Comment'=>'端口号'),
				'licensecount'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>5,'Comment'=>'授权数量 5,20,30'),
				'configtxt'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'json串方式存储当前会话控制中心的config配置信息'),
				'mark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>''),				
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),   		
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除')            
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idsessioncenterlist`))
			ENGINE = InnoDB 
			COMMENT='会话控制中心';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'modeltype'); 		
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化表数据
	public function init_db(){
		try{
			//添加默认项
			$nValue=array();
            $key=array('idsessioncenterlist','name','ip','port','licensecount','mark','index','del');
			//MPU
            $nValue = array_combine($key,array(1,'default',$_SERVER['SERVER_ADDR'],1336,5,'',0,0));
            $result=Fm($this->table_name)->data($nValue)->add();
			echo 'InitDB '.$this->table_name.'==>'.$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Sessioncenterlist,Error:'.$e->getMessage()));            
        }
	}
    //控制中心页面
	public function index(){
		$this->display('Eimsystemsetting@Sessioncenterlist:index-angular');
	}
	//详细配置
	public function openmodalconfig(){
        $this->display('Eimsystemsetting@Sessioncenterlist:config-info'); 
    }
	//活动的连接
	public function open_session_config_page(){		
		$this->assign('idsessioncenterlist',$_GET['id']);
		$this->display('Eimsystemsetting@Sessioncenterlist:actionconnection');
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

	//windows版 写入文件  将gateway.conf文件保存到指定目录
	public function saveconfigfile(){
		if(!IS_POST){
			return;
		}
		$postdata = $_POST;
		$config_data = json_decode($postdata['configtxt'],true);
		$config_path = str_replace("license","",$config_data['license']);
		$config_file_path = $config_path."gateway.conf";		
		$result = array();
		//检测文件夹是否存在
		if(!file_exists($config_path)){			
			$r = mkdir($config_path,0777,true);
			$result['createdir'] = $r;
		}else{
			//判断文件是否存在
			if (file_exists($config_file_path)){
				//存在，，，，则清空文件内容
				$r = file_put_contents($config_file_path,"");
				$result['clearfile'] = $r;
			}
		}
		//将配置写入文件
		//$r = file_put_contents($config_file_path,$config_data);
		$fh = fopen($config_file_path, "w");
		foreach($config_data as $k=>$v){
			
			if(gettype($v) == "boolean"){
				$result["write.$k.$r"] = fwrite($fh, $k."=".($v?"true":"false")."\r\n");
			}else{
				$result["write.$k.$r"] = fwrite($fh, $k."=".$v."\r\n");
			}		    
		}		
		fclose($fh);
		$result['filetxt'] = $config_data;
		$this->ajaxReturn($result);
	}


}