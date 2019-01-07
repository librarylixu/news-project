<?php
/*
        李旭
     2017/12/08
  用户个人偏好设置
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class UsersystemsettingController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }

    public $table_colunms;//全部的字段信息
    public $table_name='appuserpreference';
    public $appid = 8;//页面固定ID
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        
    }
    function  __destruct(){ 
    }
    //偏好表字段
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
                'idusersystemsetting'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'type'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'类型'),
                'value'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'值'),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键id'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idusersystemsetting`) ,
              INDEX user_ref_key1 (`userid` ASC) ,
              CONSTRAINT `user_ref_key1`
                FOREIGN KEY (`userid` )
                REFERENCES `".C('DB_NAME')."`.`".C('DB_PREFIX')."users` (`idusers` )
                ON DELETE CASCADE
                ON UPDATE CASCADE)
            ENGINE = InnoDB
            COMMENT = '用户个人偏好设置'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);    
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    //页面
    function index(){  
        $this->assign("MenuName","用户个人偏好");
		$this->assign("PageName","在此用户可根据自己的偏好设置页面风格");
         $this->assign("mainModule","crmPageModule");
        $this->assign("mainController","crmPageController");    
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Usersystemsetting:index-angular');
    }
    
}