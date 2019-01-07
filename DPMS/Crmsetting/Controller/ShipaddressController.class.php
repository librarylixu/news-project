<?php
/*
        李旭
     2017/12/08
    发货地址管理
*/
namespace Crmsetting\Controller;
use Crmuser\Controller\CommonController;
class ShipaddressController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='shipaddress';
    public $modalHtmlPath='Crmsetting@Shipaddress:modal';//模态框的路径
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
                'idshipaddress'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'城市id'),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'编号'),
                'address'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'收货地址'),
                'receiver'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'收货人'),
                'receiverphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'收货人电话'),
                'code'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'邮编'),
                'receivemphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'收货人手机'),
                'remarks'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
                'editor'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'编辑人'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'创建时间'),
                'edittime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'修改时间'),
                'deltime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'删除时间'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idshipaddress`) ) ENGINE = InnoDB COMMENT = '发货地址管理'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","系统设置");
		$this->assign("PageName","发货地址管理");
        $this->display('Crmsetting@Shipaddress:index-angular');
    }
}