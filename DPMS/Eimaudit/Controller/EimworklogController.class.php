<?php
/*
2018年3月12日 12:07:25 工单记录

*/
namespace Eimaudit\Controller;
use Crmuser\Controller\CommonController;
class EimworklogController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='eimworklog';
    public $table_key;//只包含字段名称
	//public $modalHtmlPath='Eimaudit@Eimworklog:modal';//模态框的路径
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
                'ideimworklog'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL'),
				'sessiontypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键会话类型id'),
                'sessiontypename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'会话类型名称'),	
				'status'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'任务若超过10分钟没有执行,则自动过期\n会话任务状态\n0/1/2/3/4/5\n0表示待连接-审批完成,可操作\n1表示待审批，审批后才会进入0待连接状态\n2已连接/正在连接/工单正在执行\n3任务已结束/工单执行结'),
				'starttime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>0,'Comment'=>'创建时间'),
				'endtime'=>array('Type'=>'INT','isNull'=>'NULL'),
                'refdeviceid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'要操作的设备id'),	
                'refdevicetype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的设备类型,这里的值代表是什么类型的数据,因为设备有很多表，值将引导代码去哪个表中取数据.\nkvm\\vmware\\hyperv等.\n存表名'),   			
                'deviceinfo'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'开启会话保存的设备信息'),
				'settings'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'保存会话详细配置'),
                'olddevicename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'旧设备名称'),
				'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
				'sessioncenterid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'使用的哪个会话控制中心'),
				'starttype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'会话开启方式:0创建/1抢占/2加入'),   
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`ideimworklog`),
              INDEX `fk_eimworklog_users_idx` (`userid` ASC),
              INDEX `fk_eimworklog_sessiontype_idx` (`sessiontypeid` ASC),
              INDEX `fk_eimworklog_sessioncenter_idx` (`sessioncenterid` ASC),
              CONSTRAINT `fk_eimworklog_users`
                FOREIGN KEY (`userid`)
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
              CONSTRAINT `fk_eimworklog_sessiontype`
                FOREIGN KEY (`sessiontypeid`)
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."devicesessiontype` (`iddevicesessiontype`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
              CONSTRAINT `fk_eimworklog_sessioncenter`
                FOREIGN KEY (`sessioncenterid`)
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."sessioncenterlist` (`idsessioncenterlist`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB
            COMMENT = 'eim审计日志';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_NAME']); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	public function index(){
        $this->assign("mainController","eimEimworklogController");
		$this->display('Eimaudit@Eimworklog:index-angular');
    }
    //打开审计记录页
    public function openAuthfile(){
      //  $this->assign("mainController","eimEimworklogController");
		$this->display('Eimaudit@Authfile:index-angular');
    }

	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        $data=$this->MSelect($parameter);
        $this->ajaxReturn($data);
    }
	//仅供审计日志查询
	public function select_auditlog_data(){
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data = array();
        $parameter = $_POST;
        $where['starttime'] = F_getWhere($where,$parameter,true);//根据时间查询
        $length=intval($parameter['pageCount']);//每页显示多少条
        $pagenow=intval($parameter['thisPageCount']?$parameter['thisPageCount']:1)-1;//当前第几页
        $pagenow=($pagenow>-1)?$pagenow:0;
        $skip=$length*$pagenow;//数据库中需要跳过多少条
        $where['$limit'] = array('offset'=>$skip,'length'=>$length);
        //$where['$fetchSql'] = true;
        $data['data']=$this->MSelect($where);
        $data['count'] = Fm($this->table_name)->where($where)->count();
        $this->ajaxReturn($data);
	}	
	//仅供前台开启会话调用的查询，因为要解密设备密码
	public function select_data_opensession(){
	    if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
         
        $data=$this->MSelect($parameter);
		//解密设备密码
		$deviceinfo = $data[$parameter['ideimworklog']]['deviceinfo'];
		$deviceinfo = json_decode($deviceinfo, true);
        $deviceinfo['loginpwd'] = F_base64_encryption($deviceinfo['loginpwd'],'decode');
		$deviceinfo = json_encode($deviceinfo);
		$data[$parameter['ideimworklog']]['deviceinfo'] = $deviceinfo;
        $this->ajaxReturn($data);
	}
    /*异步新增数据*/
    public function add_page_data(){		
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }	
		$postdata = $_POST;
		$postdata['starttime'] = time();
		$postdata['userid'] = 1;

        //判断当前工单的设备密码是否需要加密：仅在手动输入密码时生效，因为手动输入的在前台无法加密。如果是取的设备信息（包含密码）则不需要加密，
        if(array_key_exists('is_pwd_decode',$postdata) && $postdata['is_pwd_decode']=="1"){
            $postdata['deviceinfo']['loginpwd'] = F_base64_encryption($postdata['deviceinfo']['loginpwd'],'encode');
            unset($postdata['is_pwd_decode']);
        }
       
        //将deviceinfo转成json保存
        $postdata['deviceinfo'] = json_encode($postdata['deviceinfo']);      
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
        $parameter = $_POST;
        //如果是根据时间清除日志，则检测
        if(array_key_exists('sTime',$parameter) && array_key_exists('eTime',$parameter)){
            $parameter['sTime'] = date("Y-m-d",$parameter['sTime']);
            $parameter['eTime'] = date("Y-m-d",$parameter['eTime']);
            $stt=strtotime($parameter['sTime']." 00:00:00");
            $ett=strtotime($parameter['eTime']." 23:59:59");   
            $where['starttime'] = array(array('EGT',$stt),array('ELT',$ett));
        }
        $data=$this->MDelete($where);
        $this->ajaxReturn($data);
    }


	/*内部调用 查询数据*/
	public function select_data($parameter){
		$data = $this->MSelect($parameter);
		return $data;
	}
	/*内部调用	新增数据给控制器使用*/
    public function add_data($parameter=array()){
        $parameter['userid'] = 1;//没有session ****************
        $parameter['starttime'] = time();
        $data=$this->MInsert($parameter);
        return $data;
    }

    /*内部调用	编辑数据给api接口控制器使用*/
    public function update_data($parameter){     
        $data=$this->MUpdate($parameter);
        return $data;
    }



}