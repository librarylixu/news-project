<?php
/*
    2017-12-12
    李旭
    用户与角色关联
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class RefuserRefutypeController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_user_utype';
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
                'idref_user_utype'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户id'),
                'utypeid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户角色id'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_user_utype`) ,
                  INDEX fk_ref_user_utype_users (`userid` ASC) ,
                  INDEX fk_ref_user_utype_usertype (`utypeid` ASC) ,
                  UNIQUE INDEX unique_uid_utyid USING BTREE (`utypeid` ASC, `userid` ASC) ,
                  CONSTRAINT `fk_ref_user_utype_users`
                    FOREIGN KEY (`userid` )
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers` )
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                  CONSTRAINT `fk_ref_user_utype_usertype`
                    FOREIGN KEY (`utypeid` )
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."usertype` (`idusertype` )
                    ON DELETE CASCADE
                    ON UPDATE CASCADE)
                ENGINE = InnoDB
                COMMENT = '用户与角色关联';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
                $result=Fm()->execute($sql);
                echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idref_user_utype','userid','utypeid');  
            $nValue = array_combine($key,array(1,1,1));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化用户与角色关联 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }


     /*
    根据用户id查询用户关联的角色
    关联查询
    @$userid 用户的id
    @$json 是否返回带key的数组  ,key值是角色id
    */
    public function getUserType($userid,$json=false){        
        $where=array();
        $where['ref.userid']=$userid;
        $result=Fm('ref_user_utype as ref')->join(C('CrmDB')['DB_PREFIX'].'usertype as ut on ut.idusertype=ref.utypeid')->where($where)->select();
        if (!$json)
        {
        	return $result;
        }
        $nData=array();
        foreach($result as $value){
            $nData[$value['idusertype']]=$value;
        }
        return $nData;
    }

    /*
        根据用户类型id查询所有用户
        2018年10月11日 17:33:23 by yxj        
        //select DISTINCT users.* from xc_users as users LEFT JOIN xc_ref_user_utype as refutype ON users.idusers = refutype.userid where FIND_IN_SET(refutype.utypeid,'6,7') 
        FIND_IN_SET 查询
        $utpeyids 字符串格式："6,8,9..."

    */
    public function getUsersByUTypes($utpeyids,$json=false){
        $where=array();
        $sql = "select DISTINCT users.* from xc_users as users LEFT JOIN xc_ref_user_utype as refutype ON users.idusers = refutype.userid where users.del = 0 and FIND_IN_SET(refutype.utypeid,'%s') ;";
        $result=Fm()->query(sprintf($sql,$utpeyids));
        if (!$json){
        	return $result;
        }
        $nData=array();
        foreach($result as $value){
            $nData[$value['idusers']]=$value;
        }
        return $nData;
    }



}