<?php
/*
李旭
2017-12-08
客户级别
*/
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class CustomerlevelController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404()); 
    }
    public $table_colunms;//全部的字段信息
    public $table_name='customerlevel';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='Crmcustomerinfo@Customerlevel:modal';//模态框的路径
    public $appid = 15;//页面固定ID
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
                'idcustomerlevel'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'levelname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'级别名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'labelclass'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'#5661c9'",'Comment'=>'标签background-color背景颜色'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idcustomerlevel`) ) ENGINE = InnoDB;",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化customerlevel表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idcustomerlevel','levelname');  
            $nValue = array_combine($key,array(1,'VIP客户'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'普通客户'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'高级VIP客户'));           
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'其他'));           
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化客户级别 :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Customerlevel,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","客户管理");
		$this->assign("PageName","客户等级");
        $this->assign("mainModule","crmCustomerlevelModule");
        $this->assign("mainController","crmCustomerlevelController");
        $this->assign("appid",$this->appid);
        $this->display('Crmcustomerinfo@Customerlevel:index-angular');
    }
}