<?php
/*
     李旭
   2017/12/08
   产品控制器
*/
namespace Crmproduct\Controller;
use Crmuser\Controller\CommonController;
class ProductController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='product';
    public $modalHtmlPath='Crmproduct@Product:modal';//模态框的路径
    public $appid = 26;//页面固定ID
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        
    }
    function  __destruct(){    
     
    }
     //字段
    function getColunms(){
         /*
    'Type'=>'INT',  字段的数据类型
    'isNull'=>'NOT NULL', 是否为空
    'Comment'=>'', 字段描述
    'Default'=>'', 默认值
    'AutoIncrement'=>'AUTO_INCREMENT' 自增标致

    tValue 自定义的处理标志  md5表示需要该字段的值需要进行md5加密   
       public $table_colunms=array('','name','del','index','path','createtime','deltime','uploaduser','uploadaddress');
    */
       $c=array(
                'idproduct'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'name'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>'产品名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'abbreviation'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'简称'),
                'description'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'描述'),
				'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该产品关联的用户权限,哪些用户可以看1,2,3,4'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该产品关联的角色权限,哪些角色可以看1,2,3,4'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该产品关联的用户组权限,哪些用户组可以看1,2,3,4'),
                'refannexs'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该产品关联的附件有哪些1,2,3,4'),
                );
        return $c;
    }
   /*表结构创建*/
   public function create_table(){     
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]
       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }   
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idproduct`) ) ENGINE = InnoDB COMMENT = '产品'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化product表数据*/
    public function init_db(){
        try{
            $nValue=array();
            //产品
            $key=array('idproduct','name','abbreviation','description','guid');  
            //软件产品
            $nValue = array_combine($key,array(1,'昕辰日志管理系统软件V2.0','Logsys','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'昕辰DRA录制审核管理系统软件V3.0','DRA带外审计','V3.0',F_guidv4()));            
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'昕辰数字电源及微环境管理系统软件V2.0','DPMS','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'昕辰用户动态认证系统软件V2.0','UDCS','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'昕辰带外管理平台系统软件V2.0','EIM','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'昕辰信息设备资源管理系统软件V2.0','IRM','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'昕辰NTS时间服务系统软件V3.0','NTS','V3.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,'昕辰IPHM服务器健康监控管理系统软件V3.0','IPHM','V3.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,'昕辰AIS自动巡检系统软件V3.0','AIS','V3.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(10,'昕辰运维安全审计平台系统软件V2.0','堡垒机','V2.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(11,'昕辰服务器安全加固系统 V3.0','主机加固','V3.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            //硬件产品
            $nValue = array_combine($key,array(12,'EIM服务器','EIM','硬件服务器',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            //操作系统
            $nValue = array_combine($key,array(13,'Windows Server','winServer','正版微软Windows Server操作系统',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(14,'昕辰DRA录制审核管理系统软件V3.0','DRA终端审计','V3.0',F_guidv4()));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化产品信息 :".$result."<br/>";          
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Product,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","产品管理");
		$this->assign("PageName","在此可对所有的产品、产品类型、产品型号进行管理操作");
        $this->assign("mainModule","crmProductModule");
        $this->assign("mainController","crmProductController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmproduct@Product:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加产品预览");
		$this->assign("PageName","在此可批量添加产品预览并选择要保存的产品.");
        $this->assign("mainController","crmProductpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmproduct@Product:preview');
    }
     /*详细页面*/
    public function product_model(){  
        $this->display('Crmproduct@Product:product_model');
    }
     /*添加产品页面*/
    public function openoldmodel(){  
        $this->display('Crmproduct@Product:modal-old');
    }
    /*
        根据权限过滤后的产品数据
    */
    public function select_authrefproduct_data($parameter){
        $data = [];//最终组件的数据源
        $alldata=$this->MSelect($parameter);
        foreach($alldata as $key=>$value){
            if(strpos($value['refusers'],$_SESSION['userinfo']['idusers']) !== false){
                array_push($data,$value);
            }
            foreach(explode(",",$_SESSION['user_ref_typeids']) as $typevalue){
                if(strpos($value['refutypes'],$typevalue) !== false){
                    array_push($data,$value);
                }    
            }
            foreach(explode(",",$_SESSION['user_ref_groupids']) as $groupvalue){
                if(strpos($value['refugroups'],$groupvalue) !== false){
                    array_push($data,$value);
                }
            }
        }
        $data = F_array_unset($data,'idproduct',true); 
        if($parameter['$json']){
            foreach($data as $key=>$value){
                $datajson[$value['idproduct']] = $value;
            }
            return $datajson;
        }else{
            return $data;
        }
    }
    /*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        //******此处暂为处理，如果为true是超级管理员权限，false是普通权限要根据权限过滤的//暂时所有都可以看到产品
        if(true){
            $data=$this->MSelect($_POST);
        }else{
            $data = $this->select_authrefproduct_data($_POST);
        }
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		$postdata['guid']=F_guidv4();
        $data=$this->MInsert($postdata);
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


	//弹出页面
    public function selectdetailed(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","产品管理");
        $this->assign("PageName","详细信息");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailProductController");
        $this->display("Crmproduct@Product:selectdetailed");
    }


}