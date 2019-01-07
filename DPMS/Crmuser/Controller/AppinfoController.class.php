<?php
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class AppinfoController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    //用户表的字段
    public $table_colunms;//全部的字段信息
    public $table_name='appinfo';
    public $modalHtmlPath='Crmuser@Appinfo:modal';//模态框的路径
    public $appid = 7;//页面固定ID
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
       public $table_colunms=array('','name','del','index','path','createtime','deltime','uploaduser','uploadaddress');
    */
       $c=array(
                'idappinfo'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'页面id'),
                'module'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'所在域Crm'),
                'controller'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'控制器'),
                'function'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'方法'),
                'image'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'app图标:图片src或图标classd代码'),
                'opentype'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>1,'Comment'=>'0/1/2该字段表示点击APP时的打开方式'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'页面名称'),
                'description'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'页面描述'),
                'apptitle'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'打开界面的标题,可插入图标'),
                'appclass'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'shortcut'",'Comment'=>'divclass属性控制图标'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'appinfindex'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'1','Comment'=>'页面标志0系统内置页面,1用户自定义页面'),
                'isshowurl'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否显示url'),
                'background'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'后置模式：0不后置，1后置'),
                'icontype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Default'=>"'str'",'Comment'=>'图标类型,str,img,fa'),
                'plugin'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否是插件性窗口'),
                'resizable'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否是可变尺寸'),
                'single'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否是单例模式'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idappinfo`) )ENGINE = InnoDB COMMENT = 'app页面'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);       
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }

    public function init_db(){
        try{           
            $nValue=array();
            $key=array('idappinfo','module','controller','function','image','opentype','name','description','apptitle','appinfindex');
            $nValue = array_combine($key,array(1,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmschedulepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/takeoff.png"/>',
                                                1,
                                                '日程管理',
                                                'EIM日程管理页面',
                                                "日程管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmworkorderpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/notepad.png"/>',
                                                1,
                                                '工单管理',
                                                'CRM工单管理',
                                                "工单管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmuserspage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/administrator.png"/>',
                                                1,
                                                '账号管理',
                                                'CRM账号管理',
                                                "账号管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmusertypepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/id.png"/>',
                                                1,
                                                '角色管理',
                                                'CRM角色管理',
                                                "角色管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmusergrouppage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/messenger.png"/>',
                                                1,
                                                '用户组管理',
                                                'CRM用户组管理',
                                                "用户组管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmauthoritypage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/key.png"/>',
                                                1,
                                                '权限管理',
                                                'CRM权限管理',
                                                "权限管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmappinfopage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/shipwheel.png"/>',
                                                1,
                                                '页面管理',
                                                'CRM页面管理',
                                                "页面管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmusersystemsettingpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                '用户设置管理',
                                                'CRM用户设置管理',
                                                "用户设置管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmappuserpreferencepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                '页面设置管理',
                                                'CRM页面设置管理',
                                                "页面设置管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(10,
                                                '/index.php/Crmuser',
                                                'Sysbtns',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/1436354173346.png"/>',
                                                1,
                                                '按钮管理',
                                                'CRM按钮管理',
                                                "按钮管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(11,
                                                '/index.php/Crmuser',
                                                'Appgroup',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/pin.png"/>',
                                                1,
                                                '页面分组管理',
                                                'CRM页面分组管理',
                                                "页面分组管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(12,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomerinfopage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/group.png"/>',
                                                1,
                                                '客户管理',
                                                'CRM客户管理',
                                                "客户管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(13,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcontactpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/contacts.png"/>',
                                                1,
                                                '联系人管理',
                                                'CRM联系人管理',
                                                "联系人管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(14,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomertypepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/crop.png"/>',
                                                1,
                                                '客户类型管理',
                                                'CRM客户类型管理',
                                                "客户类型管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(15,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomerlevelpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/cone.png"/>',
                                                1,
                                                '客户级别管理',
                                                'CRM客户级别管理',
                                                "客户级别管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(16,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomerindustrypage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/settings.png"/>',
                                                1,
                                                '客户行业管理',
                                                'CRM客户行业管理',
                                                "客户行业管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(17,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomersourcepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/megaphone.png"/>',
                                                1,
                                                '客户来源管理',
                                                'CRM客户来源管理',
                                                "客户来源管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(18,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomerstagepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/location.png"/>',
                                                1,
                                                '客户阶段管理',
                                                'CRM客户阶段管理',
                                                "客户阶段管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(19,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomerstatuspage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/headset.png"/>',
                                                1,
                                                '客户状态管理',
                                                'CRM客户状态管理',
                                                "客户状态管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(20,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomercreditpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/hand_thumbsup.png"/>',
                                                1,
                                                '信用等级管理',
                                                'CRM信用等级管理',
                                                "信用等级管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(21,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomermarketpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/midori-globe-icon.png"/>',
                                                1,
                                                '市场大区管理',
                                                'CRM市场大区管理',
                                                "市场大区管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(22,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmcustomercompanypage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                '公司信息管理',
                                                'CRM公司信息管理',
                                                "公司信息管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(23,
                                                '/index.php/Home',
                                                'Navigation',
                                                'modeltypepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                '设备型号',
                                                'EIM设备型号',
                                                "设备型号",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(24,
                                                '/index.php/Home',
                                                'Navigation',
                                                'devicetype',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                '设备类型',
                                                'EIM设备类型',
                                                "设备类型",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(25,
                                                '/index.php/Eimbase',
                                                'Devicegroup',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/github.png"/>',
                                                1,
                                                'KVM设备',
                                                'EIMKVM设备',
                                                "KVM设备",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(26,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmproductpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/trophy.png"/>',
                                                1,
                                                '产品管理',
                                                'CRM产品管理',
                                                "产品管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(27,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmproducttypepage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/tools.png"/>',
                                                1,
                                                '产品类型',
                                                'CRM产品类型',
                                                "产品类型管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(28,
                                                '/index.php/Home',
                                                'Navigation',
                                                'crmproductmodelpage',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/target.png"/>',
                                                1,
                                                '产品型号',
                                                'CRM产品型号',
                                                "产品型号管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(29,
                                                '/index.php/Eimdevice',
                                                'Dpulist',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/utilities-system-monitor-icon.png"/>',
                                                1,
                                                'pdu管理',
                                                'pdu管理',
                                                "pdu管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(30,
                                                '/index.php/Crmsetting',
                                                'Annex',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/utilities-system-monitor-icon.png"/>',
                                                1,
                                                '附件管理',
                                                '附件管理',
                                                "附件管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(31,
                                                '/index.php/Eimdevice',
                                                'Esxserverlist',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/vmwarelogo.png"/>',
                                                1,
                                                'ESXI宿主机管理',
                                                'ESXI主机',
                                                "ESXI主机",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(32,
                                                '/index.php/Crmproject',
                                                'Projectstatus',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/diary.png"/>',
                                                1,
                                                '项目状态管理',
                                                '项目状态',
                                                "项目状态",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(33,
                                                '/index.php/Crmproject',
                                                'Project',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/diary.png"/>',
                                                1,
                                                '项目信息管理',
                                                '项目信息',
                                                "项目信息",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
			//EIM2.0 - 资产设备页面
			$nValue = array_combine($key,array(34,
                                                '/index.php/Eimdevice',
                                                'Accetsdevicelist',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/frames.png"/>',
                                                1,
                                                '资产设备管理',
                                                '资产设备信息',
                                                "资产设备信息",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
			//EIM2.0 - 会话类型管理页面
			$nValue = array_combine($key,array(35,
                                                '/index.php/Eimsystemsetting',
                                                'Devicesessiontype',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/frames.png"/>',
                                                1,
                                                '会话类型',
                                                '会话类型管理',
                                                "会话类型管理",
                                                0));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //CRM使用手册
			$nValue = array_combine($key,array(36,
                                                '/index.php/Crmbase',
                                                'Baseinfo',
                                                'instructions',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/10-gallery.png"/>',
                                                1,
                                                'CRM使用手册',
                                                '详细介绍了CRM的使用方法，配有步骤图及流程图',
                                                "CRM使用手册",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //建议箱
			$nValue = array_combine($key,array(37,
                                                '/index.php/Crmsetting',
                                                'Suggestbox',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/booklet.png"/>',
                                                1,
                                                '建议箱',
                                                '建议箱',
                                                "建议箱",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //更新日志
			$nValue = array_combine($key,array(38,
                                                '/index.php/Crmsetting',
                                                'Version',
                                                'index',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/accessories-text-editor-icon.png"/>',
                                                1,
                                                '更新日志',
                                                '更新日志',
                                                "更新日志",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //常见问题
			$nValue = array_combine($key,array(39,
                                                '/index.php/Crmsetting',
                                                'Version',
                                                'question',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/wizard.png"/>',
                                                1,
                                                '常见问题',
                                                '常见问题',
                                                "常见问题",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //受保护项目
			$nValue = array_combine($key,array(40,
                                                '/index.php/Crmproject',
                                                'Project',
                                                'protectlist',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/locked.png"/>',
                                                1,
                                                '受保护项目',
                                                '受保护项目',
                                                "受保护项目",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //公告板操作页面
			$nValue = array_combine($key,array(41,
                                                '/index.php/Crmsetting',
                                                'Bulletin',
                                                'controlbulletin',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/locked.png"/>',
                                                1,
                                                '操作公告板',
                                                '操作公告板',
                                                "操作公告板",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            //文件共享页面
			$nValue = array_combine($key,array(42,
                                                '//www.qhoa.net',
                                                'doc',
                                                'doc',
                                                '<img class="icon" src="../../../DPMS/public/lib/win10-ui/img/icon/locked.png"/>',
                                                1,
                                                '文件共享',
                                                '文件共享',
                                                "文件共享",
                                                1));
                                                $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化Appinfo<br/>";
        }catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }


    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","页面管理");
		$this->assign("PageName","在此用户可对系统所有页面进行操作管理.");
        $this->assign("mainModule","crmAppinfoModule");
        $this->assign("mainController","crmAppinfoController");
            //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Appinfo:index-angular');
    }
}