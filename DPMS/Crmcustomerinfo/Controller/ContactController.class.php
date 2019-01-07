<?php
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class ContactController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
     //用户表的字段
   public $table_colunms;//全部的字段信息
   public $table_name='contact';
   public $table_key;//只包含字段名称
   public $modalHtmlPath='Crmcustomerinfo@Contact:modal';//模态框的路径
   public $appid = 13;//页面固定ID
   function __construct(){  
       parent::__construct();
       $this->table_colunms=$this->getColunms();
       $this->table_key=array_keys($this->table_colunms);
       //页面固定ID
       $this->assign("appid",$this->appid);  
	   //var_dump($_SESSION['initdb']);
	   if($_SESSION['initdb'] === true){
			return;
		}
	   if(empty($_SESSION['userinfo']['idusers'])){
			echo "页面超时，请重新登录";
			exit;
		}
        if(empty($_SESSION['contact_ref_auth'])){
			//7.获取当前权限下可以显示的联系人信息id
			$_SESSION['contact_ref_auth'] = $this->getContactData();
		}	
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
                'idcontact'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'联系人id'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'联系人名称'),
                'position'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'职位'),
                'email'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'邮箱'),
                'qqchat'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'QQ'),
                'phone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'电话'),
                'mobilephone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'手机'),
                'extended'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'扩展属性存json格式字符串'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'联系人创建者'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户权限'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的角色权限'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户组权限'),
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
        $sql=sprintf(" CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s
          PRIMARY KEY (`idcontact`),
          INDEX `fk_contact_users1_idx` (`userid` ASC),
          CONSTRAINT `fk_contact_users1`
            FOREIGN KEY (`userid`)
            REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
            ON DELETE SET NULL
            ON UPDATE SET NULL)
        ENGINE = InnoDB
        COMMENT = '联系人'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);    
        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*显示页面*/
    function index(){  
        $this->assign("MenuName","联系人管理");
		$this->assign("PageName","联系人信息");
        $this->assign("mainController","crmContactController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmcustomerinfo@Contact:index-angular');
    }
	//预览
	function preview(){  
        $this->assign("MenuName","批量添加联系人预览");
		$this->assign("PageName","在此可批量添加联系人预览并选择要保存的联系人.");
        $this->assign("mainController","crmContactpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmcustomerinfo@Contact:preview');
    }

    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的联系人信息
    */
    public function select_page_data(){
        //默认查询所有的联系人数据（当前权限仅由客户去过滤，如果当前用户没有访问这个客户的权限则没有这个客户下的联系人）
        if(true){
            if(!IS_POST){
                $this->ajaxReturn(false);
                exit;
            }
            $data=$this->MSelect($_POST);
            $this->ajaxReturn($data);
        }else{
            $this->auth_filtercustomer($_POST);
        }
    }
    public function auth_filtercustomer($parameter){
        if(empty($parameter['$findall'])){
			if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
				try{
					$parameter['$where'] = json_decode($_POST['$where'],true);
					$parameter['$where']['idcontact'] = array('in',$_SESSION['contact_ref_auth']);
                  // $parameter['$where']['userid'] =$_SESSION['userinfo']['idusers'];
				}
				catch (Exception $e) {
					//此处写日志
					unset($_POST['$where']);
				}
			}else{
				//如果按照idcontact查询，则使用and的方式加上权限中的idcontact 一起查询
				if (empty($parameter['idcontact'])){
					//如果查询中没有idworkorder，不管按照哪些条件，只能查询权限内的数据
					$parameter['idcontact'] = array('in',$_SESSION['contact_ref_auth']);
				}else{
					$parameter['idcontact'] = array($_SESSION['contact_ref_auth'],$parameter['idcontact']);
				}
              //  $parameter['userid'] =$_SESSION['userinfo']['idusers'];
			}
		}
        $data=$this->MSelect($parameter);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        //追加创建者
        $_POST['userid'] = $_SESSION['userinfo']['idusers'];
        //追加refusers外键
        $_POST['refusers'] = $_SESSION['userinfo']['idusers'];
        $data=$this->MInsert($_POST);
        //此处追加session，防止添加成功之后session中没有联系人id（只能重新登录刷新session才可以）的问题
        $_SESSION['contact_ref_auth'] = $_SESSION['contact_ref_auth'].','.$data;
        $this->ajaxReturn($data);
    }
    /*
        根据权限过滤（采用了find_in_set语句）在当前构造中调用
        根据两个条件（refusers关联的用户和userid创建者）
        获取到当前用户可以显示的联系人id
    */
    //public function getContactData(){		
    //    $userarr = array();
    //    $parameter['$findinset'] = true;
    //    $userarr = explode(",",$_SESSION['userinfo']['idusers']);		
    //    $parameter['$where'] = array('refusers'=>$userarr,'userid'=>$userarr);
    //    //$parameter['$fetchSql'] = true;	
	
    //    $result = $this->MSelect($parameter);
    //    //var_dump($result);
    //    $resultid = '';
    //    foreach($result as $value){
    //        $resultid .= $value['idcontact'] . ',';
    //    }
    //    //var_dump($resultid);
    //    return $resultid;
    //}
    //根据权限过滤（采用了find_in_set语句）在Login控制器中调用
    //SELECT `idworkorder`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  ) 
    public function getContactData(){    
        $userarr = array();        
        $userids = $_SESSION['ugroup_subset_users'];
        $userarr = explode(",",$userids);	
        $parameter=array();
        $parameter['$findinset'] = true;
        //这个字段是抄送
        $parameter['refusers']=$userarr;
        $parameter['userid']=$userarr;		
        //$parameter['$fetchSql'] = true;
        $parameter['$fieldkey']='idcontact,name';
        $result = $this->MSelect($parameter);
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idcontact'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
}