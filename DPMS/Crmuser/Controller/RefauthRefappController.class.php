<?php
/*
    2017-12-11
    李旭
    权限页面关系-（页面按钮权限）
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class RefauthRefappController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_auth_app';
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
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
                'idref_auth_menu'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'authid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'权限id'),
                'appid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'页面id'),
                'btns'=>array('Type'=>'VARCHAR(255)','isNull'=>'NULL','Comment'=>'页面关联的按钮id用,分割'),
                'isupdate'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'是否具备修改数据权限0不具备1具备'),
                'isdel'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'是否具备删除数据权限0不具备1具备'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_auth_menu`) ,
              INDEX fk_ref_auth_menu_authority (`authid` ASC) ,
              INDEX fk_ref_auth_app_appinfo (`appid` ASC) ,
              UNIQUE INDEX un_authid_appid (`appid` ASC, `authid` ASC) ,
              CONSTRAINT `fk_ref_auth_menu_authority`
                FOREIGN KEY (`authid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."authority` (`idauthority` )
                ON DELETE CASCADE
                ON UPDATE CASCADE,
              CONSTRAINT `fk_ref_auth_app_appinfo`
                FOREIGN KEY (`appid` )
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."appinfo` (`idappinfo` )
                ON DELETE CASCADE
                ON UPDATE CASCADE)
            ENGINE = InnoDB
            COMMENT = '权限页面关系-（页面按钮权限）'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{           
            $nValue=array();
            $key=array('idref_auth_menu','authid','appid','btns','isupdate','isdel'); 
            $nValue = array_combine($key,array(1,1,1,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,1,2,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,1,3,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,1,4,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,1,5,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,1,6,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,1,7,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,1,8,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,1,9,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(10,1,10,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(11,1,11,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(12,1,12,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(13,1,13,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(14,1,14,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(15,1,15,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(16,1,16,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(17,1,17,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(18,1,18,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(19,1,19,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(20,1,20,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(21,1,21,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(22,1,22,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(23,1,23,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(24,1,24,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(25,1,25,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(26,1,26,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(27,1,27,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(28,1,28,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(29,1,29,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(30,1,30,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(31,1,31,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(32,1,32,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(33,1,33,'1,2,3',1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
           
            echo "初始化权限页面关系 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }

    /*
    根据app页面的id去查询，当前用户下当前页面有哪些按钮权限
    */
    public function select_user_ref_page_data(){  
        /*
        当前用户没有权限
        */
        if($_SESSION['user_ref_authids']===""){
            $this->ajaxReturn(array());
            exit;
        }        
        if (!array_key_exists('$where',$_POST)&& empty($_POST['$where']))
        {
        	$this->ajaxReturn(array());
            exit;
        }  
        $parameter=$_POST;
        $w= json_decode($parameter['$where'],true);   
        $w['authid']=array('in',$_SESSION['user_ref_authids']);
        $parameter['$where']=$w;
        $data=$this->MSelect($parameter);
        $this->ajaxReturn($data);
    }

      /*
    根据权限id查询关联的页面
    关联查询
    @$authids 权限的id  '1,2,3,4,5'
    @$json 是否返回带key的数组  ,key值是页面id
    */
    public function getAuthApp($authids,$json=false){        
        $where=array();       
        $where['ref.authid']=array('in',$authids);
        $result=Fm('ref_auth_app as ref')->join(C('CrmDB')['DB_PREFIX'].'appinfo as app on app.idappinfo=ref.appid')->where($where)->
        order('app.idappinfo')->select();
        if (!$json)
        {
        	return $result;
        }
        $nData=array();
        foreach($result as $value){
            $nData[$value['idappinfo']]=$value;
        }
        return $nData;
    }
}