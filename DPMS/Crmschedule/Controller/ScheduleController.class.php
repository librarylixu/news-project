<?php
/*
李旭
2017-12-08
日程安排
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class ScheduleController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='schedule';
    public $modalHtmlPath='Crmschedule@Schedule:modal';//模态框的路径
    public $appid = 1;//页面固定ID
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
                'idschedule'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'用户ID'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'1','Comment'=>'排序'),
                'message'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'具体内容'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'创建时间'),
                'title'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'日程标题'),
                'allday'=>array('Type'=>'VARCHAR(5)','isNull'=>'NOT NULL','Default'=>"'false'",'Comment'=>'是否为全天日程'),
                'stime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'日程开始时间'),
                'etime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'日程结束时间'),
                'url'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'可选，当指定后，事件被点击将打开对应url'),
                'classname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'指定事件的样式'),
                'editable'=>array('Type'=>'VARCHAR(5)','isNull'=>'NOT NULL','Default'=>"'true'",'Comment'=>'事件是否可编辑，可编辑是指可以移动, 改变大小等'),
                'source'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'指向次event的eventsource对象'),
                'color'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'背景和边框颜色'),
                'backgroundcolor'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'背景颜色'),
                'bordercolor'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'边框颜色'),
                'textcolor'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'文本颜色'),
                'extended'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'扩展字段json格式'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的其他用户id 1,2,3,4,5'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的其他角色id 1,2,3,4,5'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的其他用户组id 1,2,3,4,5'),
                'refcustomers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的客户id 1,2,3,4,5'),
                'refprojects'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的项目id 1,2,3,4,5'),
                'refcontactid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的联系人id 1,2,3,4,5'),
                'refworkorders'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'该日程关联的工单id 1,2,3,4,5'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idschedule`) ,
                  INDEX fk_idschedule_userid (`userid` ASC) ,
                  CONSTRAINT `fk_idschedule_userid`
                    FOREIGN KEY (`userid` )
                    REFERENCES `%s`.`%susers` (`idusers` )
                    ON DELETE CASCADE
                    ON UPDATE CASCADE)
                ENGINE = InnoDB
                COMMENT = '日程安排'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX']);     
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
        /*初始化表数据*/
    public function init_db(){
        try{  
            echo "初始化schedule :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    /*展示详细信息页面*/
    public function detail(){        
        $this->display('Crmschedule@Schedule:detail_modal');        
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日程管理");
		$this->assign("PageName","日程安排");
         $this->assign("mainController","scheduleController");
         //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Schedule:index-angular');
    }
    /*日程插件头部*/
    function calendarTop(){
        $this->display('Crmschedule@Schedule:calendar-top');
    }
    /*日程插件-日期模板html代码*/
    function calendarDay(){
        $this->display('Crmschedule@Schedule:calendar-day');
    }
    /*展示页面*/
    public function test(){  
        $this->assign("MenuName","日程管理");
		$this->assign("PageName","日程安排");
        $this->display('Crmschedule@Schedule:lxtest');
    }
    public function test2(){
        $this->display('Crmschedule@Schedule:index');
    }
}