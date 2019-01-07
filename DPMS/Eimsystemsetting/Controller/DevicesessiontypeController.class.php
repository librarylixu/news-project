<?php
/*
2018年4月9日 13:34:37 设备会话类型(设备开启会话的类型)

*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class DevicesessiontypeController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='devicesessiontype';
    public $table_key;//只包含字段名称
	public $modalHtmlPath='Eimsystemsetting@Devicesessiontype:modal';//模态框的路径
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
                'iddevicesessiontype'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'icon'=>array('Type'=>'VARCHAR(25)','isNull'=>'NOT NULL','Default'=>"'session_kvm.png'",'Comment'=>'会话的唯一类型标识图标,存储路径DPMS\public\images\sessionIcon'),
                'typename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>''),
				'setting'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'当前会话类型的默认设置'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
				'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用')
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddevicesessiontype`))
		ENGINE = InnoDB
		COMMENT = '设备开启会话的类型'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME']); 
		//var_dump($sql);
		//exit;
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}
	//初始化默认会话类型
	 public function init_db(){
        try{
            $nValue=array();
            $keys=array('typename','icon','setting');
			//ssh会话类型
			$ssh_setting = array();
			$ssh_setting['port'] = "22";
			$ssh_setting['mapClipboard'] = true;
			$ssh_setting['fontSize'] = 13;
			$ssh_setting['sessionRecord'] = 1;
            $nValue = array_combine($keys,array('SSH','session_ssh.png',json_encode($ssh_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
			//TELNET会话类型
			$telnet_setting = array();
			$telnet_setting['port'] = "23";
			$telnet_setting['mapClipboard'] = true;
			$telnet_setting['fontSize'] = 13;
			$telnet_setting['sessionRecord'] = 1;
            $nValue = array_combine($keys,array('TELNET','session_telnet.png',json_encode($telnet_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
			//RDP会话类型
			$rdp_setting = array();
			$rdp_setting['port'] = "3389";
			$rdp_setting['mapClipboard'] = true;
			$rdp_setting['decompressingRDP61'] = true;
			$rdp_setting['playSound'] = 0;
			$rdp_setting['server_bpp'] = 16;
			$rdp_setting['sessionRecord'] = 1;
			$rdp_setting['soundPref'] = 1;
            $nValue = array_combine($keys,array('RDP','session_rdp_32.png',json_encode($rdp_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
			//xRDP会话类型
            $nValue = array_combine($keys,array('xRDP','session_rdp.png',json_encode($rdp_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
			//VNC会话类型
			$vnc_setting = array();
			$vnc_setting['port'] = "5900";
			$vnc_setting['mapClipboard'] = true;
			$vnc_setting['UseCopyRect'] = true;
			$vnc_setting['compression'] = 6;
			$vnc_setting['color'] = 16;
			$vnc_setting['share'] = true;
			$vnc_setting['quality'] = 5;
			$vnc_setting['encoding'] = "ZRLE";
			$vnc_setting['sessionRecord'] = 1;
            $nValue = array_combine($keys,array('VNC','session_vnc.png',json_encode($vnc_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();			
			//KVM会话类型
			$kvm_setting = array();
			$kvm_setting['kvmStartType'] = 0;//0：avocent or 1：emerson
            $nValue = array_combine($keys,array('LOCAL_KVM','session_kvm.png',json_encode($kvm_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
            //KVM会话类型
			$kvm_setting = array();
			$kvm_setting['kvmStartType'] = 0;//0：avocent or 1：emerson
            $nValue = array_combine($keys,array('DSV_KVM','session_kvm.png',json_encode($kvm_setting)));
            $result=Fm($this->table_name)->data($nValue)->add();
			//iLO2会话类型
            $nValue = array_combine($keys,array('iLO2','iLO2.ico',''));
            $result=Fm($this->table_name)->data($nValue)->add();
			//iLO4会话类型
            $nValue = array_combine($keys,array('iLO4','iLO4.ico',''));
            $result=Fm($this->table_name)->data($nValue)->add();

            echo "初始化devicesessiontype".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME."初始化devicesessiontype,Error:".$e->getMessage()));            
        }
    }

	public function index(){
		$this->display('Eimsystemsetting@Devicesessiontype:index-angular');
    }
	//详细配置
	public function openmodalconfig(){
        $this->display('Eimsystemsetting@Devicesessiontype:config-info'); 
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

	function session(){
		var_dump($_SESSION);
	}
    
    //创建启动昕辰KVM会话客户端的连接
//$kvmdata = 'xinchen_kvm`'.$postdata['taskid'].'`'.$_SESSION['ServerIP'];	   
function F_create_kvm_start_url($kvmdata){
	$kvmparmstr = base64_encode($kvmdata); //base64_encode 将字符串以 BASE64 编码
    $kvmparmstr = strrev($kvmparmstr);
    $url='xinchen://AAAAAAAAAA'.$kvmparmstr; 
	return $url;
}
//创建工单，并组建打开会话的url
    function get_local_url (){
        if (!IS_POST ||empty($_POST['id']))
        {
    	    return;
        }
         if($_POST['sessiontypeid']=='6'||$_POST['sessiontypeid']=='7'){
              //创建工单
       $add_worklog=A('Eimaudit/Eimworklog')->MInsert(array(userid=>1,sessiontypeid=>$_POST['sessiontypeid'],sessiontypename=>$_POST['sessiontypename'],status=>$_POST['status'],sessioncenterid=>$_POST['sessioncenterid'],starttime=>time(),refdeviceid=>$_POST['id'],refdevicetype=>$_POST['devicetype'],deviceinfo=>$_POST['deviceinfo'],settings=>$_POST['settings'],olddevicename=>$_POST['olddevicename'],starttype=>$_POST['starttype']));
    if( $add_worklog>0){
    $kvmdata = 'xinchen_kvm`'.$add_worklog.'`'.$_SERVER['SERVER_ADDR'];
    $url= $this->F_create_kvm_start_url($kvmdata);	   
      $this->ajaxReturn(array(url=>$url,logid=>$add_worklog));
    }else{
        $this->ajaxReturn(false);
    }    
    }
        if($_POST[$_POST['sessiontypeid']]!=9){
              //创建工单
       $add_worklog=A('Eimaudit/Eimworklog')->MInsert(array(userid=>1,sessiontypeid=>$_POST['sessiontypeid'],sessiontypename=>$_POST['sessiontypename'],status=>$_POST['status'],sessioncenterid=>$_POST['sessioncenterid'],starttime=>time(),refdeviceid=>$_POST['id'],refdevicetype=>$_POST['devicetype'],deviceinfo=>$_POST['deviceinfo'],settings=>$_POST['settings'],olddevicename=>$_POST['olddevicename'],starttype=>$_POST['starttype']));
    if( $add_worklog>0){ 
      $this->ajaxReturn(array(url=>true,logid=>$add_worklog));
    }else{
        $this->ajaxReturn(false);
    }    
    }
      //1.查一下会话默认配置
       $sessionconfig=$this->MSelect(array('iddevicesessiontype'=>9,'$find'=>true));    
       $setting=json_decode($sessionconfig['settings'],true);
       //2.去查指定的设备
      
       $device=A('Eimdevice/Assetsdevicelist')->MSelect(array('idassetslist'=>$_POST['id'],'$find'=>true));
     
       $ip=$_SERVER['HTTP_HOST'].':'.$setting['port'];
       $bpp=$setting['server_bpp'];
       $sessionsetting=json_decode($device['sessionsetting'],true);
       $user=$device['loginuser'];
       $pwd=$device['loginpwd'];
       if ($pwd)
       {
       	    $pwd=F_base64_encryption($pwd,'decode');
       }       
       //自定义了会话配置
       if ($sessionsetting['local'])
       {       
            if ($sessionsetting['local']['server_bpp'])
            {
            	 $bpp=$sessionsetting['local']['server_bpp'];
            }   
            if ($sessionsetting['local']['port'])
            {
                 $ip=$_SERVER['HTTP_HOST'].':'.$sessionsetting['local']['port'];
                 $_temp=explode(':',$sessionsetting['local']['port']);                 
                 if(count($_temp)==2){
                    $ip=$sessionsetting['local']['port'];                     
                 }  	
            }           
      
       }     
       //3.是否需要单独去查询密码
       if ($_POST['pwdid'])
       {
       	   $pwdinfo=A('Eimpasswordrules/Proxypassword')->MSelect(array('idproxypassword'=>$_POST['pwdid'],'$find'=>true));    
           $user=$pwdinfo['login'];
           $pwd=$pwdinfo['pwd'];
           if ($pwd)
           {
       	        $pwd=F_base64_encryption($pwd,'decode');
           }
       }     
       $_url=sprintf("%s^%s^%s^%s^%s",$ip,$user,$pwd,$device['devicename'],$bpp);
       //创建工单
       $add_worklog=A('Eimaudit/Eimworklog')->MInsert(array(userid=>1,sessiontypeid=>$_POST['sessiontypeid'],sessiontypename=>$_POST['sessiontypename'],status=>$_POST['status'],sessioncenterid=>$_POST['sessioncenterid'],starttime=>time(),refdeviceid=>$_POST['id'],refdevicetype=>$_POST['devicetype'],deviceinfo=>$_POST['deviceinfo'],settings=>$_POST['settings'],olddevicename=>$_POST['olddevicename'],starttype=>$_POST['starttype']));
    if( $add_worklog>0){
     $_url=F_base64_encryption($_url);  
      $this->ajaxReturn(array(url=>$_url,logid=>$add_worklog));
    }
     $this->ajaxReturn(false);
    }
}