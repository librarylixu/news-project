<?php
namespace Dra\Controller;
use Crmuser\Controller\CommonController;
class DsviewController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='dsviewlist';
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
       $c=array(
                'iddsviewlist'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'dsvip'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview地址'),
                'dsvuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview登录账号'),
                'dsvpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview登录密码'),
                'dbuser'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview数据库登录账号'),
                'dbpwd'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'dsview数据库登录密码'),
                'dbport'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>5432,'Comment'=>'数据库端口号'),
                'dsviewstatus'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>1,'Comment'=>'主要审计对象1主机 2备机,在多个dsview时有用')
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddsviewlist`)) ENGINE = InnoDB",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日志管理");
		$this->assign("PageName","操作日志");
        $this->display('Crmlog@Systemlog:index-angular');
    }
}