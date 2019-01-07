<?php
/*
2018/01/22 lsq
*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class EsxserverlistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='esxserverlist';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimdevice@Esxserverlist:modal';//模态框的路径
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
                'idesxserverlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'modeltypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'设备类型'),
                'networkstatus'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'网络状态,0:离线,1:在线'),
                'icon'=>array('Type'=>'VARCHAR(45)','Comment'=>''),
                'port'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>443,'Comment'=>''),
                'devicename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'设备名称'),
				'ipaddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'ip地址'),
				'loginuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'登录账号'),
				'loginpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'登录密码,需加密'),
                'contactpeople'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'负责人'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refdgroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refsessioncenterid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),		
                'devicesessiontypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),    
				'sn'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'序列号'),				
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idesxserverlist`),
          INDEX `fk_esxserverlist_modeltype_idx` (`modeltypeid` ASC),
          CONSTRAINT `fk_esxserverlist_modeltype`
            FOREIGN KEY (`modeltypeid`)
            REFERENCES `%s`.`%s` (`idmodeltype`)
            ON DELETE CASCADE
            ON UPDATE CASCADE)
        ENGINE = InnoDB;",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'modeltype'); 
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
        $this->display('Eimdevice@Esxserverlist:index');
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
        if(!empty($postdata['loginpwd'])){
            $postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        }
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
        //加密
        if(!empty($postdata['loginpwd'])){
            $postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        }
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
    /*同步(所有设备都用该方法)---写入文件.PHP_EOL*/
    public function sync_write_vm (){
         $time=time();         
        $filename=$time.'.common';
        $writepath= C('SERVICEPATH').$filename;
        $value=$_POST['type'];
        $writefileresult=file_put_contents($writepath,$value);    
        if($writefileresult>0){             
            $this->ajaxReturn($time);     
          exit();
        }
        $this->ajaxReturn($writefileresult);    
    }
      /*同步虚拟机---读取文件*/
     public function sync_read_vm (){
        $filename=C('SERVICEPATH').$_POST['time'];
         $readpath= $filename.'.result';        
        if (file_exists($readpath)) {
            $readresult=F_readFile($readpath);
            //删除
            unlink($readpath);
            $this->ajaxReturn($readresult);  
        } else {
            $this->ajaxReturn(-1);  
        }         
    }
      //批量导入预览
    function preview(){
        $this->display('Eimdevice@Esxserverlist:preview');        
    }
}