<?php
/*
    APP个人偏好
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class AppUserPreferenceController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='appuserpreference';
    public $modalHtmlPath='Crmuser@AppUserPreference:modal';//模态框的路径
    public $appid = 9;//页面固定ID
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        //页面固定ID
        $this->assign("appid",$this->appid);
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
                'iduserpreference'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'height'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'高百分比或详细的px'),
                'width'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'宽百分比或详细的px'),
                'resize'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'大小'),
                'moveout'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'时差'),
                'anim'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'动画'),
                'index'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'排序'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iduserpreference`) ) ENGINE = InnoDB COMMENT = 'APP个人偏好设置'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
		
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    //页面
    function index(){  
        $this->assign("MenuName","页面设置管理");
		$this->assign("PageName","在此用户可对整个系统的风格进行个性化设置.");
        $this->assign("mainController","crmPageController");
            //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@AppUserPreference:index-angular');
    }
}