<?php
/*
        李旭
     2017/12/08
    各页面的按钮
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class SysbtnsController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='sys_btns';
    public $modalHtmlPath='Crmuser@Sysbtns:modal';//模态框的路径
    public $table_key;//只包含字段名称
    public $appid = 10;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        
    }
    function  __destruct(){   
    }
    //权限表的字段
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
                'idsys_btns'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'权限id'),
                'bname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'按钮名称'),
                'content'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'按钮内容'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'用于删除标记'),
                'code'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'按钮键代码用来唯一标识一个按钮btn100001'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idsys_btns`) ) ENGINE = InnoDB COMMENT = '各页面的按钮';",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化sysbtns表数据*/
    public function init_db(){
        try{           
            $nValue=array();
            $key=array('idsys_btns','bname','content','code');
            $nValue = array_combine($key,array(1,'添加按钮','<button class="btn btn-success btn-sm"  ng-click="add()" type="button"><i class="fa fa-plus"></i>&nbsp;添加</button>','btn100001'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'刷新按钮','<a class="btn btn-success btn-sm" href="javascript:;" ng-click="refresh()"><i class="fa fa-refresh"></i>&nbsp;刷新</a> ','btn100002'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'批量导入','<button type="button" id="hidebutton" class="btn btn-sm btn-warning" ng-click="uploadfile()">批量导入</button>  ','btn100003'));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化Sysbtns :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Sysbtns,Error:'.$e->getMessage()));            
        }
    }
    //页面
    function index(){  
        $this->assign("MenuName","按钮管理");
		$this->assign("PageName","在此可对所有按钮进行操作管理.");
        $this->assign("mainModule","crmSysbtnsModule");
        $this->assign("mainController","crmSysbtnsController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Sysbtns:index-angular');
    }
}