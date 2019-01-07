<?php
/*
        李旭
     2017/12/08
公司组织结构，可无限分组
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class UsergroupController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    //用户组表的字段
   public $table_colunms;//全部的字段信息
   public $table_name='usergroup';
   public $modalHtmlPath='Crmuser@Usergroup:modal';//模态框的路径
   public $table_key;//只包含字段名称
   public $appid = 5;//页面固定ID
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
                'idusergroup'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'账号id'),
                'groupname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'用户组名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'删除标记 1表示删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'排序'),
                'pid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'直属父级的id,0表示没有父级'),
                'level'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>0,'Comment'=>'当前分组的级别,0的表示根节点1,2,3,4'),
               // 'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'guid'),
               // 'allpguid'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'是基于guid累加的,可追溯到顶层节点,每个父节点用[]包括起来'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idusergroup`) ) ENGINE = InnoDB COMMENT = '公司组织结构，可无限分组'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化usergroup表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idusergroup','groupname','pid','level'); 
            $nValue = array_combine($key,array(1,'昕辰清虹',0,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'CRM管理员',1,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'总经理',1,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'销售主管',3,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'技术主管',3,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'销售',4,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'技术',5,0));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化UserGroup :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化UserGroup,Error:'.$e->getMessage()));            
        } 
    }  
    //页面
    function index(){  
        $this->assign("MenuName","用户组管理");
		$this->assign("PageName","在此可对用户组进行操作管理.");
        $this->assign("mainModule","crmUsergroupModule");
        $this->assign("mainController","crmUsergroupController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmuser@Usergroup:index-angular');
    }
     //eim用户组页面
    function eim_index(){  
        $this->display('Crmuser@Eimusergroup:index-angular');
    }
     //eim用户组模态框页面
    function eim_modal(){  
        $this->display('Crmuser@Eimusergroup:modal');
    }
      //eim用户组关联用户页面
    function eim_refuser(){  
        $this->display('Crmuser@Eimusergroup:refuser');
    }
     /*异步查询数据*/
    public function select_page_data(){ 
        $_POST['del'] = 0;
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }




    /*
        公共方法，再login中调用
        目的：将用户组以及子集下的所关联得用户找到，
        得到当前登录者得所有可以访问得用户id
        '1,2,3,4,5'
    */
    public function getusergroup_or_subset($userrefgroupids){
        //查询用户组数据
        $usergroupData = $this->Mselect();
        //1.拿到用户组ids  
        $thisGroupid=','.$userrefgroupids.',';
        foreach ($usergroupData as $value){      
            $pid=','.$value['pid'].',';  	
            if (strpos($thisGroupid,$pid)>-1){
                $thisGroupid.=$value['idusergroup'].',';            	
            }
        }   
        //2.根据用户组的ids，来找到有哪些用户的ids   
        $thisGroupid = rtrim($thisGroupid,',');//去除最右边的逗号
        $thisGroupid = ltrim($thisGroupid,',');//去除最左边的逗号
        //去掉自己所在用户组的id
        if($thisGroupid == $_SESSION['user_ref_groupids']){
            $thisGroupid = '';
        }
        $thisGroupid = implode(',',array_unique(explode(',',$thisGroupid)));//字符串去重
        /*
            查询用户与用户组关系表
            select  userid  from xc_ref_user_group where groupid in (3,4,5,6);
        */
        $userrefugroup['$fieldkey']='userid';
        $userrefugroup['$in'] = true;
        $userrefugroup['groupid'] = $thisGroupid;
        
        $userData = A('Crmuser/RefuserRefgroup')->Mselect($userrefugroup);
        //将用户的ids组建一下
        $userids = '';
        foreach($userData as $uservalue){
            $userids .= $uservalue['userid'].',';
        }
        //把自己算上
        $userids.=','.$_SESSION['userinfo']['idusers'];
        $userids = implode(',',array_unique(explode(',',$userids)));//字符串去重
        $userids = ltrim($userids,',');//去除最右边的逗号
        $userids = rtrim($userids,',');//去除最右边的逗号
        return $userids;
    }
}