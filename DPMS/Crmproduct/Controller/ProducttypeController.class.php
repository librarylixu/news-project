<?php
/*
        李旭
     2017/12/08
产品类型,代理产品,自主产品,硬件,软件
*/
namespace Crmproduct\Controller;
use Crmuser\Controller\CommonController;
class ProducttypeController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='producttype';
    public $modalHtmlPath='Crmproduct@Producttype:modal';//模态框的路径
    public $appid = 27;//页面固定ID
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
    'AutoIncrement'=>'AUTO_INCREMENT' 自增标致

    tValue 自定义的处理标志  md5表示需要该字段的值需要进行md5加密   
       public $table_colunms=array('','name','del','index','path','createtime','deltime','uploaduser','uploadaddress');
    */
       $c=array(
                'idproducttype'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'类型名称'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idproducttype`) ) ENGINE = InnoDB COMMENT = '产品类型,代理产品,自主产品,硬件,软件'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化producttype表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idproducttype','name');  
            //代理产品,自主产品,硬件,软件
            $nValue=array_combine($key,array(1,'代理产品'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue=array_combine($key,array(2,'自主产品'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue=array_combine($key,array(3,'硬件服务器'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue=array_combine($key,array(4,'自有软件'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue=array_combine($key,array(5,'操作系统'));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化产品类型 :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Producttype,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","产品类型");
		$this->assign("PageName","在此可对所有的客户类型进行管理操作");
        $this->assign("mainModule","crmProducttypeModule");
        $this->assign("mainController","crmProducttypeController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmproduct@Producttype:index-angular');
    }
}