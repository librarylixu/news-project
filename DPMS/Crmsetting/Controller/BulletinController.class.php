<?php
/*
        李旭
     2018/07/30
       附件表
*/
namespace Crmsetting\Controller;
use Crmuser\Controller\CommonController;
class BulletinController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
     public $table_colunms;//全部的字段信息
    public $table_name='bulletin';
    public $table_key;//只包含字段名称
    public $appid = 41;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
        if(empty($_SESSION['userinfo']['idusers'])){
			echo "页面超时，请重新登录";
			exit;
		}
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
                'idbulletin'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'附件id'),
                'time'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'公告发布时间'),
                'bulletinmessage'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'公告内容'),
                'updatetime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'公告修改时间'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'删除标记 1表示删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idbulletin`)) ENGINE = InnoDB COMMENT = '公告板'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    //展示页面
     public function index(){  
        $this->assign("MenuName","公告板");
		$this->assign("PageName"," 在这里可以查看公司公告及KPI评分排名");       
        $this->assign("mainController","crmBulletinController");
        $this->display('Crmsetting@Bulletin:index-angular');
    }
    //操作公告板页面，权限下能看到的页面
    public function controlbulletin(){
        $this->assign("MenuName","公告板管理");
		$this->assign("PageName"," 更改公告板展示信息");    
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->assign("mainController","crmControlBulletinController");
        $this->display('Crmsetting@Bulletin:controlbulletin');
    }
       /*
        详细页
    */
    public function selectdetailed(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","公告详情");
		$this->assign("PageName","在这里您可以查看您的公告详情");
        $this->assign("id",$_GET['id']);
        $this->assign("mainController","detailBulletunController");
        $this->display("Crmsetting@Bulletin:selectdetailed");
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        //发布时间
        $parameter['time'] = time();
        $data=$this->MInsert($parameter);
        $result = [];
        $result['id'] = $data;
        $result['time'] = $parameter['time'];
        $this->ajaxReturn($result);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        //修改时间
        $_POST['updatetime']=time();
        $data=$this->MUpdate($_POST);
        $result = [];
        $result['ok'] = $data;
        $result['updatetime'] = $_POST['updatetime'];
        $this->ajaxReturn($result);
    }
}