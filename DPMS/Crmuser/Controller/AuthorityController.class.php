<?php
/*
    权限控制器
*/  
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class AuthorityController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='authority';
    public $modalHtmlPath='Crmuser@Authority:modal';//模态框的路径
    public $table_key;//只包含字段名称
    public $appid = 6;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        
    }
    function  __destruct(){          
    }
    //权限表的字段
    function getColunms(){
        /*
        'Type'=>'INT',  字段的数据类型
        'isNull'=>'NOT NULL', 是否为空
        'Comment'=>'', 字段描述
        'Default'=>'', 默认值
        'AutoIncrement'=>'AUTO_INCREMENT' 自增标致

        tValue 自定义的处理标志  md5表示需要该字段的值需要进行md5加密
        */
       $c=array(
                'idauthority'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'权限id'),
                'authname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'权限名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除标记'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idauthority`) ) ENGINE = InnoDB COMMENT = '权限表';",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化authorty表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idauthority','authname');  

            $nValue = array_combine($key,array(1,'高级管理员'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'总经理'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'销售部总监'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'技术部总监'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'研发部总监'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'销售'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'技术'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,'研发'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,'测试'));
            $result=Fm($this->table_name)->data($nValue)->add();

            echo "初始化Authorty :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Authorty,Error:'.$e->getMessage()));            
        } 
    }
    //页面
    function index(){  
        $this->assign("MenuName","权限管理");
		$this->assign("PageName","在此可对所有权限进行操作管理.");
        $this->assign("mainModule","crmAuthorityModule");
        $this->assign("mainController","crmAuthorityController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Authority:index-angular');
    }
     /*页面权限页面*/
    public function appinfo(){  
        $this->assign("MenuName","用户管理");
		$this->assign("PageName","页面权限管理");
        $this->assign("mainModule","crmPageauthModule");
        $this->assign("mainController","crmPageauthController");
        $this->assign("authid",$_GET['authid']);
        $this->display('Crmuser@Authority:page-auth');
    }
}