<?php
/*
刘世群
2017-09-15
项目文档
*/
namespace Crmproject\Controller;
use Crmuser\Controller\CommonController;
class ProjectwordController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='projectword'; 
    public $modalHtmlPath='Crmproject@Projectword:modal';//模态框的路径
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
                'idprojectword'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'projectid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'项目id'),
                'annexid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'附件id'),
                'name'=>array('Type'=>'VARCHAR(255)','isNull'=>'NOT NULL','Comment'=>'文档描述'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idprojectword`),
                      INDEX `fk_projectword_project_idx` (`projectid` ASC),
                      INDEX `fk_projectword_annex1_idx` (`annexid` ASC),
                      CONSTRAINT `fk_projectword_project`
                        FOREIGN KEY (`projectid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."projectmain` (`idproject`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                      CONSTRAINT `fk_projectword_annex1`
                        FOREIGN KEY (`annexid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."annex` (`idannex`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE)
                    ENGINE = InnoDB
                    COMMENT = '项目文档'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{           
            $nValue=array();
           
            echo "初始化项目文档 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","项目管理");
		$this->assign("PageName","项目文档");
        $this->display('Crmproject@Projectword:index-angular');
    }
}