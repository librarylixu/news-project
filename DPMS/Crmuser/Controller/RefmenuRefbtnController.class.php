<?php
/*
    2017-12-12
    李旭
    页面与按钮关系,展示用
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class RefmenuRefbtnController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_menu_btn';
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
                'idref_menu_btn'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'appid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'页面id'),
                'btnid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'按钮id'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_menu_btn`) ,
              INDEX fk_ref_menu_btn_sys_btns (`btnid` ASC) ,
              INDEX fk_ref_menu_btn_appinfo (`appid` ASC) ,
              UNIQUE INDEX un_appid_btnid USING BTREE (`appid` ASC, `btnid` ASC) ,
              CONSTRAINT `fk_ref_menu_btn_sys_btns`
                FOREIGN KEY (`btnid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."sys_btns` (`idsys_btns` )
                ON DELETE CASCADE
                ON UPDATE CASCADE,
              CONSTRAINT `fk_ref_menu_btn_appinfo`
                FOREIGN KEY (`appid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."appinfo` (`idappinfo` )
                ON DELETE CASCADE
                ON UPDATE CASCADE)
            ENGINE = InnoDB
            COMMENT = '页面与按钮关系,展示用'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
                $result=Fm()->execute($sql);
                echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{           
            $nValue=array();
            $key=array('appid','btnid'); 
            $nValue = array_combine($key,array(1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(1,2));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(1,3));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,2));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,3));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,2));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,3));
            $result=Fm($this->table_name)->data($nValue)->add();           
            $nValue = array_combine($key,array(4,1));
            $result=Fm($this->table_name)->data($nValue)->add();           
            $nValue = array_combine($key,array(4,2));
            $result=Fm($this->table_name)->data($nValue)->add();           
            $nValue = array_combine($key,array(4,3));
            $result=Fm($this->table_name)->data($nValue)->add();           
            $nValue = array_combine($key,array(5,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,2));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,3));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(6,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(7,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(7,2));
            $result=Fm($this->table_name)->data($nValue)->add();            
            $nValue = array_combine($key,array(7,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(8,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(8,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(8,3));
            $result=Fm($this->table_name)->data($nValue)->add();            
            $nValue = array_combine($key,array(9,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(9,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(10,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(10,2));
            $result=Fm($this->table_name)->data($nValue)->add();            
            $nValue = array_combine($key,array(10,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(11,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(11,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(11,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(12,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(12,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(12,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(13,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(13,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(13,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(14,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(14,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(14,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(15,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(15,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(15,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(16,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(16,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(16,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(17,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(17,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(17,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(18,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(18,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(18,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(19,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(19,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(19,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(20,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(20,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(20,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(21,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(21,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(21,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(22,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(22,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(22,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(23,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(23,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(23,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(24,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(24,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(24,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(25,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(25,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(25,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(26,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(26,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(26,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(27,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(27,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(27,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(28,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(28,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(28,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(29,1));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(29,2));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(29,3));
            $result=Fm($this->table_name)->data($nValue)->add();  
            $nValue = array_combine($key,array(30,1));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(30,2));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(30,3));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(31,1));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(31,2));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(31,3));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(32,1));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(32,2));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(32,3));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(33,1));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(33,2));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            $nValue = array_combine($key,array(33,3));
            $result=Fm($this->table_name)->data($nValue)->add(); 
            echo "初始化页面与按钮关系 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
}