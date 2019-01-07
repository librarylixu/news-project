<?php
/*
		闫绪杰
*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class DevicetypeController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='devicetype';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Eimdevice@Devicetype:modal';//模态框的路径
    public $appid = 24;//页面固定ID
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
                'iddevicetype'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'typename'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'类型名称'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序用'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除'),
                'labelclass'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'#5661c9'",'Comment'=>'label标签的颜色'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddevicetype`) ) ENGINE = InnoDB COMMENT = '设备类型';",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";		
    }
    /*初始化usertype表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('iddevicetype','typename');
            $nValue = array_combine($key,array(1,'MPU'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'ACS'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'UMG'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'CHN'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'AV'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'ESXI'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'ESX'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,'HyperV'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,'PDU'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(10,'资产设备'));//资产
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(11,'应用发布'));//应用发布
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化Devicetype :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Devicetype,Error:'.$e->getMessage()));            
        } 
    }
    public function index(){
        $this->assign("mainController","eimDevicetypeController");
        $this->display('Eimdevice@Devicetype:index');
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