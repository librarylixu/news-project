<?php
/*
        李旭
     2018/04/20
    设备组
*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class DevicegroupController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    //用户组表的字段
   public $table_colunms;//全部的字段信息
   public $table_name='devicegroup';
   public $modalHtmlPath='Eimdevice@Devicegroup:modal';//模态框的路径
   public $table_key;//只包含字段名称
   function __construct(){  
       parent::__construct();
       $this->table_colunms=$this->getColunms();
       $this->table_key=array_keys($this->table_colunms);
       
   }
   function  __destruct(){     
   }
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
                'iddevicegroup'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'账号id'),
                'groupname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'设备组名称'),
                'pid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'设备id'),
                'level'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'当前组在第几级,根节点是0'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户，可以为多个1,2,3'),
                'refutype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户角色，可以为多个1,2,3'),
                'refugroup'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户组，可以为多个1,2,3'),
                'createuserid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联的用户id，创建人'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`iddevicegroup`),
                  INDEX `fk_devicegroup_users1_idx` (`createuserid` ASC),
                  CONSTRAINT `fk_devicegroup_users1`
                    FOREIGN KEY (`createuserid`)
                    REFERENCES `%s`.`%s` (`idusers`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE)
                ENGINE = InnoDB
                COMMENT = '设备组'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].'users');        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化DeviceGroup表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('iddevicegroup','groupname'); 
            $nValue = array_combine($key,array(1,'kvm设备组'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'pdu设备组'));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化DeviceGroup :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化DeviceGroup,Error:'.$e->getMessage()));            
        } 
    }  
    //页面
    function index(){  
        $this->assign("mainController","eimDevicegroupController");
        $this->display('Eimdevice@Devicegroup:index');
    }
    //增删改模态框页面
    function openmodal(){  
        $this->display('Eimdevice@Devicegroup:modal');
    }
    //关联用户页面
    function devicegroupRefuser(){  
        $this->display('Eimdevice@Devicegroup:devicegroupRefuser');
    }
    //关联用户组页面
    function devicegroupRefusergroup(){  
        $this->display('Eimdevice@Devicegroup:devicegroupRefusergroup');
    }
    //设备组tree数据展示
    function devicegrouptreedata(){  
        $this->display('Eimdevice@Devicegroup:devicegrouptreedata');
    }
     /*异步查询数据*/
    public function select_page_data(){ 
        $_POST['del'] = 0;
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
}