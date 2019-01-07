<?php
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class CustomerinfoController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='customerinfo';
    public $modalHtmlPath='Crmcustomerinfo@Customerinfo:modal';//模态框的路径
    public $appid = 12;//页面固定ID
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
	   if($_SESSION['initdb'] === true){
			return;
		}
        if(empty($_SESSION['userinfo']['idusers'])){
			echo "页面超时，请重新登录";
			exit;
		} 
        if(empty($_SESSION['cus_ref_auth'])){
			//7.获取当前权限下可以显示的客户信息id
			$_SESSION['cus_ref_auth'] = $this->getCustomerinfoData();
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
                'idcustomerinfo'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'name'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'客户名称'),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'abbreviation'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'简称'),
                'officephone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'办公电话'),
                'fax'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'传真'),
                'address'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'地址'),
                'url'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'网站'),
                'maincontact'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'主要联系人'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'创建时间'),
                'updatetime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'mappoint'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Default'=>'"116.404, 39.915"','Comment'=>'客户坐标'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'客户创建人'),
                'refstageids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户阶段'),
                'refmarketids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户市场大区分类'),
                'refcreditids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'信用等级'),
                'refstatusids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户状态'),
                'reftypeids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户类型'),
                'refsourceids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户来源'),
                'refindustryids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户行业'),
                'reflevelids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户级别'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户权限'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的角色'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户组'),
                'refannexids'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的附件'), 
                'refcontactids' =>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>'关联的联系人'),                
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
             $sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s
                  PRIMARY KEY (`idcustomerinfo`),
                  INDEX `fk_customerinfo_users1_idx` (`userid` ASC),
                  CONSTRAINT `fk_customerinfo_users1`
                    FOREIGN KEY (`userid`)
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                    ON DELETE SET NULL
                    ON UPDATE SET NULL)
                ENGINE = InnoDB", C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);  
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    } 
    
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","客户管理");
		$this->assign("PageName","客户信息");
        $this->assign("mainModule","crmCustomerinfoModule");
        $this->assign("mainController","crmCustomerinfoController");
            //页面固定ID
        $this->assign("appid",$this->appid);
        $this->assign("cusRefuser",$_SESSION['cus_ref_user']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->display('Crmcustomerinfo@Customerinfo:index-angular');
    }
    
     /*联系人增改页面*/
    public function contact_model(){  
        $this->display('Crmcustomerinfo@Customerinfo:contact_model');
    }
    /*
        点击公司信息某一项触发前台js方法
        查询指定得公司信息
        @$_GET['id']   公司信息的id
    */
    public function selectdetailed(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("id",$_GET['id']);//客户id
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailCustomerrefcompanyController");
        $this->display("Crmcustomerinfo@Customerinfo:selectdetailed");
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加客户预览");
		$this->assign("PageName","在此可批量添加客户预览并选择要保存的客户.");
        $this->assign("mainController","crmCustomerinfopreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmcustomerinfo@Customerinfo:preview');
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的客户信息
    */
    public function select_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        /*
            _action 0：添加 1：修改  2：删除 3 查询
            _result 0 失败 1成功
        */
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'customerid'=>true));  
        //true为超级管理员权限
        if($_SESSION['userinfo']['idusers'] != '1'){
            $_POST['$authority'] = 'cus_ref_auth';
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {	
            $par = $_POST;
            $par['createtime'] = time();
            $par['guid']=F_guidv4();
            $par['refusers']=$_SESSION['userinfo']['idusers'];
            $par['userid'] = $_SESSION['userinfo']['idusers'];
            $data=$this->MInsert($par);    
            //此处追加session，防止添加成功之后session中没有客户id（只能重新登录刷新session才可以）的问题:当成功之后才去存值
            if($data>0){
                $_SESSION['cus_ref_auth'] = $_SESSION['cus_ref_auth'].','.$data;    
            }
		    $resultdata = array();
		    $resultdata['id'] = $data;
		    $resultdata['guid'] = $par['guid'];
            $resultdata['createtime'] = $par['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($par,array('_action'=>0,'_result'=>$data,'customerid'=>$resultdata['id']));  
            $this->ajaxReturn($resultdata);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
        
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
        	$_POST['updatetime'] = time();
            $data=$this->MUpdateObj($_POST);
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data['ok'],'customerid'=>$_POST['idcustomerinfo']));  
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
    /*
        百度地图模态框
        此方法暂时不被调用了，如果后期开放根据地图填写地址的时候再开放！
    */
    
    public function baidumap(){
        $this->display('Crmcustomerinfo@Customerinfo:mapmodel');
    }
    public function getCustomerinfoData(){    
        $userarr = array();        
        $userids = $_SESSION['ugroup_subset_users'];
        $userarr = explode(",",$userids);	
        $parameter=array();
        $parameter['$findinset'] = true;
        //这个字段是抄送
        $parameter['refusers']=$userarr;
        $parameter['userid']=$userarr;		
        //$parameter['$fetchSql'] = true;
        $parameter['$fieldkey']='idcustomerinfo,name';
        $result = $this->MSelect($parameter);
        $resultid = '';
        foreach($result as $value){
            $resultid .= $value['idcustomerinfo'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
        	$postdata = $_POST;
            $postdata['del'] = 1;
            $data=$this->MUpdate($postdata);
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($postdata,array('_action'=>2,'_result'=>$data,'customerid'=>$postdata['idcustomerinfo']));  
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
           //记录错误日志
        }
    }
    //客户查重
    public function check_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        } 
        $check = false;
        $postdata = $_POST;
        $postdata['$fieldkey']='idcustomerinfo,name,userid';
        $postdata['$find']=true;
        $data=$this->MSelect($postdata);
        //if(!empty($data)){
        //    $check = true;
        //}
        $this->ajaxReturn($data);
    }
    //本地测试流加载demo
    public function demo(){
        $this->assign("MenuName","客户管理");
		$this->assign("PageName","客户信息");
        $this->assign("mainModule","crmCustomerinfoModule");
        $this->assign("mainController","crmCustomerinfoController");
            //页面固定ID
        $this->assign("appid",$this->appid);
        $this->assign("cusRefuser",$_SESSION['cus_ref_user']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->display('Crmcustomerinfo@Customerinfo:demo');
    }
    //组件省份城市
	function getCityData(){
        $city = array (  
                  "01" =>   
                      array (  
                      'name' => '江苏省',  
                      "id"=>'01',
                      ),  
                  "02" =>   
                      array ( 
                        'name' => '浙江省',  
                        "id"=>'02',
                  ),  
                  "03" =>   
                      array (  
                      'name' => '安徽省',  
                        "id"=>'03',
                  ),
                  "04" =>   
                      array (  
                        'name' => '山西省',  
                        "id"=>'04',
                  ),  
                  "05" =>   
                      array (  
                        'name' => '内蒙古自治区',  
                        "id"=>'05',
                  ),  
                  "06" =>   
                      array (  
                        'name' => '辽宁省',  
                        "id"=>'06',
                  ),  
                  "07" =>   
                  array (  
                    'name' => '吉林省',  
                    "id"=>'07',
                  ),  
                  "08" =>   
                  array (  
                    'name' => '黑龙江省',  
                    "id"=>'08',
                  ),  
                  "09" =>   
                  array (  
                        'name' => '福建省',  
                        "id"=>'09',
                  ),  
                  "10" =>   
                  array (  
                    'name' => '北京市',  
                        "id"=>'10',
                  ),  
                  "11" =>   
                  array (  
                    'name' => '天津市',  
                        "id"=>'11',
                  ),  
                  "12" =>   
                  array (  
                    'name' => '河北省',  
                        "id"=>'12',
                  ),  
                  "13" =>   
                  array (  
                    'name' => '上海市',  
                    "id"=>'13',
                  ),  
                  "14" =>   
                  array (  
                    'name' => '江西省',  
                    "id"=>'14',
                  ),  
                  "15" =>   
                  array (  
                    'name' => '山东省',  
                    "id"=>'15',
                  ),  
                  "16" =>   
                  array (  
                    'name' => '河南省',  
                    "id"=>'16',
                  ),  
                  "17" =>   
                  array (  
                    'name' => '湖北省',  
                    "id"=>'17',
                  ),  
                  "18" =>   
                  array (  
                    'name' => '湖南省', 
                    "id"=>'18', 
                  ),  
                  "19" =>   
                  array (  
                    'name' => '广东省',
                    "id"=>'19',  
                  ),  
                  "20" =>   
                  array (  
                    'name' => '广西壮族自治区', 
                    "id"=>'20',  
                  ),  
                  "21" =>   
                  array (  
                    'name' => '海南省',  
                    "id"=>'21', 
                  ),  
                  "22" =>   
                  array (  
                    'name' => '重庆市',  
                    "id"=>'22',  
                  ),  
                  "23" =>   
                  array (  
                    'name' => '四川省', 
                    "id"=>'23',     
                  ),  
                  "24" =>   
                  array (  
                    'name' => '贵州省',  
                    "id"=>'24', 
                  ),  
                  "25" =>   
                  array (  
                    'name' => '云南省',  
                    "id"=>'25',
                  ),  
                  "26" =>   
                  array (  
                    'name' => '西藏自治区', 
                    "id"=>'26', 
                  ),  
                  "27" =>   
                  array (  
                    'name' => '陕西省',  
                    "id"=>'27', 
                  ),  
                  "28" =>   
                  array (  
                    'name' => '甘肃省',  
                    "id"=>'28', 
                  ),  
                  "29" =>   
                  array (  
                    'name' => '青海省',  
                    "id"=>'29',
                  ),  
                  "30" =>   
                  array (  
                    'name' => '宁夏回族自治区',
                    "id"=>'30', 
                  ),  
                  "31" =>   
                  array (  
                    'name' => '新疆维吾尔自治区',  
                    "id"=>'31',  
                  ),  
                  "32" =>   
                  array (  
                    'name' => '台湾省',  
                    "id"=>'32',
                  ),  
                  "33" =>   
                  array (  
                    'name' => '香港特别行政区', 
                    "id"=>'33', 
                  ),  
                  "34" =>   
                  array (  
                    'name' => '澳门特别行政区', 
                    "id"=>'34', 
                  ),  
                );  
        $this->ajaxReturn(json_encode($city));
	}
}