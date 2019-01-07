<?php
/*
    2018-01-10
    李旭
    页面分组关联页面
*/
namespace Crmuser\Controller;
use Crmuser\Controller\CommonController;
class RefappgroupRefappController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='ref_appgroup_app';
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
                'idref_appgroup_app'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'appid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'页面id'),
                'groupid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'页面分组id'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idref_appgroup_app`),
                      INDEX `fk_ref_appgroup_app_appgroup1_idx` (`groupid` ASC),
                      INDEX `fk_ref_appgroup_app_appinfo1_idx` (`appid` ASC),
                      CONSTRAINT `fk_ref_appgroup_app_appgroup1`
                        FOREIGN KEY (`groupid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."appgroup` (`idappgroup`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE,
                      CONSTRAINT `fk_ref_appgroup_app_appinfo1`
                        FOREIGN KEY (`appid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."appinfo` (`idappinfo`)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE)
                    ENGINE = InnoDB;",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);        
                $result=Fm()->execute($sql);
                echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('groupid','appid'); 
            echo "初始化页面与页面分组关联 :".$result."<br/>";
            return;
            $nValue = array_combine($key,array(1,3));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(1,4));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(1,5));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(1,6));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,12));
            $result=Fm($this->table_name)->data($nValue)->add();            
            $nValue = array_combine($key,array(2,13));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,14));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,15));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(2,16));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,17));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,18));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,19));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(2,20));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(2,21));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(2,22));
            $result=Fm($this->table_name)->data($nValue)->add();

			$nValue = array_combine($key,array(3,1));
            $result=Fm($this->table_name)->data($nValue)->add();
			$nValue = array_combine($key,array(3,2));
            $result=Fm($this->table_name)->data($nValue)->add();

            echo "初始化页面与页面分组关联 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化ref_appgroup_app,Error:'.$e->getMessage()));            
        } 
    }
      /*
    根据app id查询关联的appgroup
    关联查询
    @$appids app的id  '1,2,3,4,5'
    @$json 是否返回带key的数组  ,key值是appgroup id
    */
    public function getAppGroupapp($appids,$json=false){        
        $where=array();       
        $where['ref.appid']=array('in',$appids);
        $result=Fm('ref_appgroup_app as ref')->
                join(C('CrmDB')['DB_PREFIX'].'appgroup as ag  on ag.idappgroup=ref.groupid')->
                where($where)->
                group('ag.idappgroup')->
                fetchSql(false)->
                select();
        if (!$json)
        {
        	return $result;
        }
        $nData=array();
        foreach($result as $value){
            $nData[$value['idappgroup']]=$value;
        }
        return $nData;
    }

}