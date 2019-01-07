<?php
/*
	授权管理
*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class LicenseController extends CommonController {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    public $table_colunms;//全部的字段信息
    public $table_name='license';
    public $table_key;//只包含字段名称
    public $modalHtmlPath='';//模态框的路径	
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
    
    }
	//字段
    function getColunms(){	
       $c=array(
                'idlicense'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'sn'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'特征码'),
                'license'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'授权码'),
				'task'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'授权单位'),
				'registeruser'=>array('Type'=>'VARCHAR(100)','isNull'=>'NULL','Comment'=>''),
                'registertime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'注册时间'),
                'devicecount'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'授权设备数量'),
                //授权类型:0表示永久授权,时间表示试用授权
                'type'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>''),
                'licensetime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'授权生成时间'),
                'menu'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'授权功能'),
                //是否启用设备授权\n如果为空表示不启用\n如果不为空表示，操作设备时根据该字段中的设备数量进行校验\njson格式存储\n{devicesn:mpu,devicesn:acs,devicesn:dpu}
                'devices_sn'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>''),
                //解析授权码的时间戳\n\n前台根据此时间戳判断授权是否可信
                'time'=>array('Type'=>'DOUBLE','isNull'=>'NULL','Comment'=>''),
                //安装软件的类型,用它来分辨前台个别页面显示的结果\n软件类型DRA\\DPMS\\EIM\\ZZ
                'projecttype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                //1审计\n0不审计
                'audit'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>''),
                'projectname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'软件名称'),
                'registerstatus'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'注册状态,0未注册,1已注册'),
                'copyright'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Default'=>"'北京昕辰清虹科技有限公司'",'Comment'=>'技术支持公司\n默认:北京昕辰清虹科技有限公司'),
                );
        return $c;
    }
	//初始化表
	public function create_table(){  
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s   PRIMARY KEY (`idlicense`))
            ENGINE = InnoDB;",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

    function index(){
        $this->display('Eimsystemsetting@License/index');
    }
    //获取特征码
    function getsn(){
        if(!IS_POST){
            $this->ajaxReturn('no');
            return;
        }
        $sn=F_getSN();
        $this->ajaxReturn($sn);        
    }
    //请求获取特征码二维码
    function getsnimg(){    
        F_qrcode($sn,2);
    }
}