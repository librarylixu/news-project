<?php
/*
    2017-12-12
    李旭
    用户与公司结构关联
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class RefuserRefgroupController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_user_group';
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
                'idref_user_group'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户id'),
                'groupid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户组id'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于排序'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_user_group`),
                      INDEX `fk_ref_user_group_users_idx` (`userid` ASC),
                      UNIQUE INDEX `un_uid_groupid` USING BTREE (`userid` ASC, `groupid` ASC),
                      INDEX `fk_ref_user_group_usergroup1_idx` (`groupid` ASC),
                      CONSTRAINT `fk_ref_user_group_users`
                        FOREIGN KEY (`userid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                      CONSTRAINT `fk_ref_user_group_usergroup1`
                        FOREIGN KEY (`groupid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."usergroup` (`idusergroup`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE)
                    ENGINE = InnoDB",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
                $result=Fm()->execute($sql);
                echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idref_user_group','userid','groupid');  

            $nValue = array_combine($key,array(1,1,2));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化用户与公司结构关联 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }


    /*
    根据用户id查询用户关联的组
    关联查询
    @$userid 用户的id
    @$json 是否返回带key的数组  ,key值是用户组id
    */
    public function getUserGroup($userid,$json=false){        
        $where=array();
        $where['ref.userid']=$userid;
        $result=Fm('ref_user_group as ref')->join(C('CrmDB')['DB_PREFIX'].'usergroup as ug on ug.idusergroup=ref.groupid')->where($where)->select();
        if (!$json)
        {
        	return $result;
        }
        $nData=array();
        foreach($result as $value){
            $nData[$value['idusergroup']]=$value;
        }
        return $nData;
    }
}