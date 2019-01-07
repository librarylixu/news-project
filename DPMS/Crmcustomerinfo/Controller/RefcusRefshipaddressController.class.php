<?php
/*
    2017-12-12
    李旭
    客户关联的收货信息
*/
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class RefcusRefshipaddressController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_customer_shipaddress';
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
                'idref_customer_shipaddress'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'shipid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'地址id'),
                'cusid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'客户id'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_customer_shipaddress`) ,
              INDEX fk_ref_customer_shipaddress_customerinfo (`cusid` ASC) ,
              INDEX fk_ref_customer_shipaddress_customerinfo1 (`shipid` ASC) ,
              UNIQUE INDEX un_cusid_shipid USING BTREE (`cusid` ASC, `shipid` ASC) ,
              CONSTRAINT `fk_ref_customer_shipaddress_customerinfo`
                FOREIGN KEY (`cusid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."customerinfo` (`idcustomerinfo` )
                ON DELETE CASCADE
                ON UPDATE CASCADE,
              CONSTRAINT `fk_ref_customer_shipaddress_customerinfo1`
                FOREIGN KEY (`shipid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."shipaddress` (`idshipaddress` )
                ON DELETE CASCADE
                ON UPDATE CASCADE)
            ENGINE = InnoDB
            COMMENT = '客户收货人信息'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{           
            $nValue=array();            
            echo "初始化客户关联的收货信息 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
}