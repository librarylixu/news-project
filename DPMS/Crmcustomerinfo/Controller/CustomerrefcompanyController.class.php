<?php
/*
        李旭
     2017/12/08
      公司信息
*/
namespace Crmcustomerinfo\Controller;
use Crmuser\Controller\CommonController;
class CustomerrefcompanyController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='customercompany';
    public $modalHtmlPath='Crmcustomerinfo@Customerrefcompany:modal';//模态框的路径
    public $appid = 22;//页面固定ID
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
                'idcustomercompany'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'range'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'经营范围'),
                'brand'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'经营品牌'),
                'cusbase'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'主营客户群'),
                'business'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'主营业务'),
                'capital'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'注册资金,单位万'),
                'turnover'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'营业额,单位万'),
                'buslicense'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'营业执照'),
                'bank'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'开户银行'),
                'Bankaccount'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'银行账号'),
                'landtax'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'地税登记号'),
                'tax'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'国税登记号'),
                'legalname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'法人姓名'),
                'legalphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'法人电话'),
                'legalmphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'法人手机'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'description'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'描述信息'),
                'customerid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'扩展的客户信息'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idcustomercompany`) ,
                      INDEX fk_customercompany_customerinfo (`customerid` ASC) ,
                      CONSTRAINT `fk_customercompany_customerinfo`
                        FOREIGN KEY (`customerid` )
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."customerinfo` (`idcustomerinfo` )
                        ON DELETE CASCADE
                        ON UPDATE CASCADE)
                    ENGINE = InnoDB
                    COMMENT = '公司信息'",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);      
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","客户管理");
		$this->assign("PageName","公司信息");
        $this->assign("mainModule","crmCustomerrefcompanyModule");
        $this->assign("mainController","crmCustomerrefcompanyController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmcustomerinfo@Customerrefcompany:index-angular');
    }
    /*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        if(array_key_exists('$where',$_POST) && !is_array($_POST['$where'])){
            try{
                $_POST['$where'] = json_decode($_POST['$where'],true);
            }
            catch (Exception $e) {
                //此处写日志
                unset($_POST['$where']);
            }
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
}