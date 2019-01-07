<?php
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class UsersController extends CommonController {
    //空控制器操作
   public function _empty(){
		 $this->display(A('Home/Html')->error404());
   }
   //用户表的字段
   public $table_colunms;//全部的字段信息
   public $table_name='users';
   public $modalHtmlPath='Crmuser@Users:modal';//模态框的路径
   public $table_key;//只包含字段名称
   public $appid = 3;//页面固定ID
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
                'idusers'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'账号id'),
                'username'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'登陆账号'),
                'pwd'=>array('Type'=>'VARCHAR(255)','isNull'=>'NOT NULL','tValue'=>'md5','Comment'=>'密码'),
                'description'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'用户名,如姓名'),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'除了id外,guid可作为唯一的标识','Comment'=>'除了id外,guid可作为唯一的标识'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'删除标记 1表示删除'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'账号创建时间'),
                'updatepwdtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'账号修改时间'),
                'lastlogintime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'最后一次登陆时间'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序'),
                'mail'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>'邮箱'),
                'phone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'电话'),
                'mobelphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'手机'),
                'emergencyphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'紧急联系电话'),
                'homeaddress'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>'现住址'),
                'loginerrorindex'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用户连续登录错误次数计数'),
                'status'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'1','Comment'=>'用户状态 1正常2禁用3锁定'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idusers`),UNIQUE INDEX index1 USING BTREE (`username` ASC) ) ENGINE = InnoDB COMMENT = '用户表'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化ref_product_model表数据*/
    public function init_db(){
        try{ 
            //用户
            $nValue=array(idusers=>1,username=>'admin',pwd=>md5('admin'),description=>"超级管理员");
            $nValue['createtime']=time();
            $nValue['guid']=F_guidv4();
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化管理员账号admin-admin :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化User:'.$e->getMessage()));            
        } 
    }
    function index(){  
        $this->assign("MenuName","账号管理");
		$this->assign("PageName","在此可对账号进行操作.");
        $this->assign("mainModule","crmUsersModule");
        $this->assign("mainController","crmUsersController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        //客户关系id
        $this->assign("cusid",$_SESSION['cus_ref_auth']);
        $this->display('Crmuser@Users:index-angular');
    }
    function eim_index(){  
        $this->assign("MenuName","账号管理");
		$this->assign("PageName","在此可对账号进行操作.");               
        $this->display('Crmuser@Eimusers:index');
    }
    function eim_modal(){                     
        $this->display('Crmuser@Eimusers:modal');
    }
    function preview(){
        if(C('SystemIdentification')=='CRM')  {
            $this->assign("MenuName","批量添加账户预览");
		    $this->assign("PageName","在此可批量添加账户预览并选择要保存的账号.");
            $this->assign("FilePath",$_GET['fileid']);
            $this->display('Crmuser@Users:preview');
        }else if(C('SystemIdentification')=='EIM'){
             $this->display('Crmuser@Eimusers:preview');
        }          
    }
    function editpwdpage(){        
        $this->display('Home@Index:edit-password');
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $_POST['guid']=F_guidv4();
        $_POST['createtime']=time();
        $_POST['pwd']=md5($_POST['pwd']);
        $data=$this->MInsert($_POST);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        if(array_key_exists('pwd',$_POST)){
            $_POST['updatepwdtime'] = time();
            $_POST['pwd']=md5($_POST['pwd']);
        }
        $data=$this->MUpdate($_POST);
        $this->ajaxReturn($data);
    }
    
    /*
        再退出时使用。loginout
        登录时存一份时间戳---登录的时间   $_SESSION['lastLoginTime'];
        退出时将此时间戳保存到数据库中
    */
    public function lastlogintime(){
        $parameter = [];
        $parameter['idusers'] = $_SESSION['userinfo']['idusers'];
        $parameter['lastlogintime'] = $_SESSION['userinfo']['lastlogintime'];
        $this->MUpdate($parameter);
    }
    //用户点击右键修改密码
    /*
        0 旧密码不正确
        1 两次密码不一致
    */
    public function usereditpwd(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameterpwd = $_POST;
        //根据当前登录人得id去查询密码
        $parameterpwd['oldpwd'] = md5($parameterpwd['oldpwd']);
        $puser['idusers'] = $_SESSION['userinfo']['idusers'];
        $puser['$find'] = true;
        $userData = $this->MSelect($puser); 
        $result='';
        //检测旧密码是否正确 
        if($userData['pwd'] != $parameterpwd['oldpwd']){
          $result='原密码填写错误';
           echo $result;
           exit;
        }
        //检测两次密码是否一致
        if($parameterpwd['newpwd'] != $parameterpwd['repeatpwd']){
           $result='两次密码输出不一致';
            echo $result;
           exit;
        }
        //检测密码是否规范
        if(preg_match("/[a-zA-Z]{'1','25'}$/",$parameterpwd['newpwd'])){
           $result='密码输入不规范,密码仅支持字母与数字组合';
            echo $result;
           exit;
        }
        $usereditpwd = [];
        $usereditpwd['idusers'] = $puser['idusers'];
        $usereditpwd['updatepwdtime'] = time();
        $usereditpwd['pwd']=md5($parameterpwd['newpwd']);
        $data=$this->MUpdate($usereditpwd);
       // $this->ajaxReturn($data);
       if($data==0){
         $result='修改失败，请刷新本弹窗重新修改';
       }else{
             session_destroy();
             $result='修改成功，请<a href="/index.php/Home/Login/login" target="_top">重新登录</a>';
       }
       echo $result;
    }
   
}