<?php
/*
2018年4月20日  密码清单页面

*/
namespace Eimpasswordrules\Controller;
use Crmuser\Controller\CommonController;
class ProxypasswordController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='proxypassword';
    public $table_key;//只包含字段名称
	public $modalHtmlPath='Eimpasswordrules@Proxypassword:modal';//模态框的路径
	function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
    
    }
	//字段
    function getColunms(){	
       $c=array(
                'idproxypassword'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'login'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'账号'),
                'pwd'=>array('Type'=>'VARCHAR(50)','isNull'=>'NOT NULL','Comment'=>'密码'),
				'status'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>0,'Comment'=>'密码状态0启用,1禁用'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),	
				'updatetime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>''),
				'createuserid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'外键:创建用户id'),
				'remark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
                );
        return $c;
    }
	//初始化表
	public function create_table(){
        $str='';
        foreach($this->table_colunms as $key=>$value){
        //`[字段名]` [类型] [是否为空] [ 默认值 DEFAULT 0] [ 自增长 AUTO_INCREMENT]       
            $s=sprintf("`%s` %s %s %s %s,",$key,$value['Type'],$value['isNull'],(array_key_exists('Default',$value)?'DEFAULT '.$value['Default']:''),(array_key_exists('AutoIncrement',$value)?$value['AutoIncrement']:''));           
            $str.=$s;
        }
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idproxypassword`),
              INDEX `fk_proxypassword_users_idx` (`createuserid` ASC),
              CONSTRAINT `fk_proxypassword_users`
                FOREIGN KEY (`createuserid`)
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB
            COMMENT = '托管密码';",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);          		
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	public function index(){
        $this->assign("mainController","eimProxypasswordController");
		$this->display('Eimpasswordrules@Proxypassword:index-angular');
    }
    public function openmodal(){
		$this->display('Eimpasswordrules@Proxypassword:modal');
    }
    
	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
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
		//加密
		$postdata['pwd'] = F_base64_encryption($postdata['pwd']);
        $postdata['createtime'] = time();
        $postdata['createuserid'] = 1;//sessionid  *******************
        $data=$this->MInsert($postdata);
        $this->ajaxReturn(array(id=>$data,createtime=>$postdata['createtime'] ));
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		//
		if(empty($postdata['pwd']) && $postdata['pwd'] == ""){
			unset($postdata['pwd']);			
		}else{
			$postdata['pwd'] = F_base64_encryption($postdata['pwd']);
		}
        $postdata['updatetime'] = time();
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MDelete($_POST);
        $this->ajaxReturn($data);
    }

}