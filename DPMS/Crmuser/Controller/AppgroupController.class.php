<?php
/*
2018-01-10
李旭
页面分组控制器
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class AppgroupController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    //用户表的字段
    public $table_colunms;//全部的字段信息
    public $table_name='appgroup';
    public $modalHtmlPath='Crmuser@Appgroup:modal';//模态框的路径
    public $table_key;//只包含字段名称
    public $appid = 11;//页面固定ID
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
                'idappgroup'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'appgroupname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'分组名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>''),
                'labelclass'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Default'=>"'#5661c9'",'Comment'=>'样式代码'),
                'imagesrc'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'分组图标'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idappgroup`)) ENGINE = InnoDB",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);       
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }

    public function init_db(){
        try{           
            $nValue=array();
            $key=array('idappgroup','appgroupname');
            $nValue = array_combine($key,array(1, 'CRM账户管理'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2, 'CRM客户管理'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3, 'CRM日程工单'));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4, 'CRM产品管理'));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化Appgroup<br/>";
        }catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appgroup,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","页面分组管理");
		$this->assign("PageName","在此用户可对系统所有页面进行分组管理.");
        $this->assign("mainModule","crmAppgroupModule");
        $this->assign("mainController","crmAppgroupController");
           //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Appgroup:index-angular');
    }
    public function test(){
        //$a=array(
        //     'idappgroup'=>1,
        //    'appgroupname'=>'我的电脑',
        //    'del'=>2,
        //    'index'=>3,
        //    'labelclass'=>'#5661c9',
        //    'imagesrc'=>'/var/www/sss.xxx.jpg'
        //);
        //$msg=$this->MLog($a,array('_action'=>1,'_result'=>1,'customerid'=>1));        
        //var_dump($msg);
      //$this->_MHotfunction();  
      //初始化
    $curl = curl_init();
    //设置抓取的url
    curl_setopt($curl, CURLOPT_URL, 'http://www.gsxt.gov.cn/index.html');
    //设置头文件的信息作为数据流输出
    curl_setopt($curl, CURLOPT_HEADER, 1);
    //设置获取的信息以文件流的形式返回，而不是直接输出。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    //设置post方式提交
    curl_setopt($curl, CURLOPT_POST, 1);
    //设置post数据
    $post_data = array(
        tab=>'ent_tab',
'province'=>'',
'geetest_challenge'=>'b153fbaa84908c06e745d866a7f15523',
'geetest_validate'=>'dabab399741f001d1d62a64f8e9b5bed',
'geetest_seccode'=>'dabab399741f001d1d62a64f8e9b5bed|jordan',
'token'=>101125345,
searchword=>'昕辰清虹'
        );       
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    //执行命令
    $data = curl_exec($curl);
    //关闭URL请求
    curl_close($curl);
    //显示获得的数据
    var_dump($data);
    }

}