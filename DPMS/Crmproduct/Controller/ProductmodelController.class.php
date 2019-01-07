<?php
/*
        李旭
     2017/12/08
      产品型号
*/
namespace Crmproduct\Controller;
use Crmuser\Controller\CommonController;
class ProductmodelController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='productmodel';
    public $modalHtmlPath='Crmproduct@Productmodel:modal';//模态框的路径
    public $appid = 28;//页面固定ID
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
                'idproductmodel'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>'id'),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'型号名称'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'用于删除'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'排序'),
                'description'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'描述'),
                'manufacturers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'制造商'),
                'plist'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'列表价'),
                'peu'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'eu底价'),
                'psi'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'si底价'),
                'pinter'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'内部核算价'),
                'typeid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'类型id'),
                'productid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'类型id'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idproductmodel`),
                  INDEX `fk_productmodel_producttype1_idx` (`typeid` ASC),
                  INDEX `fk_productmodel_product1_idx` (`productid` ASC),
                  CONSTRAINT `fk_productmodel_producttype1`
                    FOREIGN KEY (`typeid`)
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."producttype` (`idproducttype`)
                    ON DELETE SET NULL
                    ON UPDATE CASCADE,
                  CONSTRAINT `fk_productmodel_product1`
                    FOREIGN KEY (`productid`)
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."product` (`idproduct`)
                    ON DELETE NO ACTION
                    ON UPDATE NO ACTION)
                ENGINE = InnoDB
                COMMENT = '产品型号'",
                C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);    

        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化productmodel表数据*/
    public function init_db(){
        try{
            $nValue=array();
            $key=array('idproductmodel','name','description','manufacturers','typeid','productid','plist','peu','psi'); 
            $nValue = array_combine($key,array(1,'EIM-MIN','含16用户许可','自有软件',4,5,10000,8000,6000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(2,'EIM-BASE','基础版（含100用户许可）','自有软件',4,5,10000,7000,5000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(3,'EIM-STND','主备版（含250用户许可）','自有软件',4,5,80000,70000,65000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(4,'EIM-L8','含8用户许可','自有软件',4,5,50000,45000,40000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(5,'DRA-5','5用户并发,备注(需使用的硬件平台,软件和硬件平台服务器在合同中分项签署,EIM2-B)','自有软件',4,2,10000,5000,2000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(6,'DRA-10','10用户并发,备注(需使用的硬件平台,软件和硬件平台服务器在合同中分项签署,EIM2-B)','自有软件',4,2,25000,20000,15000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(7,'DRA-20','20用户并发,备注(需使用的硬件平台,软件和硬件平台服务器在合同中分项签署,EIM2-B)','自有软件',4,2,30000,25000,20000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(8,'DRA-30','30用户并发,备注(需使用的硬件平台,软件和硬件平台服务器在合同中分项签署,EIM3)','自有软件',4,2,35000,30000,25000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(9,'DRA-40','40用户并发,备注(需使用的硬件平台,软件和硬件平台服务器在合同中分项签署,EIM3)','自有软件',4,2,40000,35000,30000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(10,'DRA-CL-BASE','基础版(10许可)','自有软件',4,2,15000,10000,5000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(11,'DRA-CL-STND','基础版(50许可)','自有软件',4,2,15000,10000,5000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(12,'DRA-CL-L50','50许可','自有软件',4,2,60000,55000,50000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(13,'EIM2-A','标准19英寸1U硬件，专用涡轮静音散热风扇，6个千兆网口,功耗: 100W','硬件服务器',3,12,55000,50000,45000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(14,'EIM2-B','硬件:1U标准机架式服务器，Intel I3 2120/4核处理器,3.3GHZ，8GB内存，1TB磁盘，双千兆网口,400W服务器电源带光驱,导轨操作系统:Linux操作系统','硬件服务器',3,12,64000,60000,55000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(15,'EIM3','硬件:2U标准机架式服务器，双路至强/4核2.13GHZ处理器，4GB内存，1TB磁盘，双千兆网口,双冗余电源带光驱,导轨操作系统:Linux操作系统','硬件服务器',3,12,60000,50000,40000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(16,'Windows2012Server','Windows2012Server','操作系统',5,13,40000,30000,20000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(17,'UDCS-U10','软件基础版（含10用户LICENSE）','自有软件',4,4,20000,5000,2000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(18,'UDCS-UHS10','软件主备版（含10用户LICENSE）','自有软件',4,4,15000,10000,5000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(19,'UDCS-UL10','10用户LICENSE软件包','自有软件',4,4,50000,25000,20000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(20,'UDCS-UL100','100用户LICENSE软件包','自有软件',4,4,65000,60000,55000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(21,'UDCS-ANDROID-KEY','基于安卓系统手机令牌','自有软件',4,4,45000,40000,35000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(22,'UDCS-IOS-KEY','基于IOS系统手机令牌','自有软件',4,4,45000,40000,35000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(23,'UDCS-WP-KEY','基于Windows Phone系统手机令牌','自有软件',4,4,50000,45000,40000));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array(24,'UDCS-UKEY','U-Key','自有软件',4,4,50000,45000,40000));
            $result=Fm($this->table_name)->data($nValue)->add();
            
            echo "初始化产品型号 :".$result."<br/>";
        }
        catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Productmodel,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","产品型号");
		$this->assign("PageName","在此可对所有的产品型号进行管理操作");
        $this->assign("mainModule","crmProductmodelModule");
        $this->assign("mainController","crmProductmodelController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmproduct@Productmodel:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加产品型号预览");
		$this->assign("PageName","在此可批量添加产品型号预览并选择要保存的产品型号.");
        $this->assign("mainController","crmProductmodelpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmproduct@Productmodel:preview');
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
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $postdata = $_POST;
		if(empty($postdata['typeid'])){
			$postdata['typeid'] = null;
		}
		//此处给取消勾选过滤一下数据
        if(empty($postdata['productid'])){
            $postdata['productid'] = null;
        }
        $data=$this->MInsert($postdata);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $postdata = $_POST;
		//var_dump($postdata);
		//return;
		if(array_key_exists('typeid',$postdata) && empty($postdata['typeid'])){
		    $postdata['typeid'] = NULL;
		}
		//此处给取消勾选过滤一下数据
		if(array_key_exists('productid',$postdata) && empty($postdata['productid'])){
		    $postdata['productid'] = NULL;
		}
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }

	public function testsavenull(){
		$where = array('productid'=>'16');

		$postdata = array();
		$postdata['$where'] = json_encode($where);
		$postdata['typeid'] = null;
		//$postdata['$fetchSql'] = true;
		$data=$this->MUpdate($postdata);
		var_dump($data);
	}

}