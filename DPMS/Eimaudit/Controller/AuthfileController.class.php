<?php
/*
2018年5月16日 审计记录

*/
namespace Eimaudit\Controller;
use Crmuser\Controller\CommonController;
class AuthfileController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $table_colunms;//全部的字段信息
    public $table_name='authfile';
    public $table_key;//只包含字段名称
	public $modalHtmlPath='Eimaudit@Authfile:modal';//模态框的路径
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
                'idauthfile'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT'),
                'workid'=>array('Type'=>'INT','isNull'=>'NOT NULL'),
				'type'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'类型\nall表示会话的所有内容\ninput表示用户输入的内容\nt_all文本统计所有内容\nt_input文本统计所有输入\nvideo视频记录\nrecording 串口会话手动记录内容'),
                'filepath'=>array('Type'=>'VARCHAR(100)','isNull'=>'NULL','Comment'=>'会话内容文件保存路径'),	
				'time'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'发生时间'),
				'userid'=>array('Type'=>'INT','isNull'=>'NULL'),
				'sessiontype'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'会话开启类型(create\\join)表示该审计文件是新创建的还是加入其他人的会话所产生的审计文件'),
                'recordingtimejson'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'手动记录串口会话内容标记 两种方式:1.按时间段记录:手动启动串口会话记录的时间段，一个时间段表示一个会话记录;查询时，根据时间段从全部会话记录文件中查询内容;2.按行数记录;手动记录开始行数和结束行数，根据行数展示手动记录内容'),	              
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
		$sql=sprintf("CREATE TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idauthfile`),
               INDEX `fk_authfile_eimworklog_idx` (`workid` ASC),
              CONSTRAINT `fk_authfile_eimworklog`
                FOREIGN KEY (`workid`)
                REFERENCES `%s`.`%seimworklog` (`ideimworklog`)
                ON DELETE CASCADE
                ON UPDATE CASCADE)
            ENGINE = InnoDB
            COMMENT = '审计文件'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str,C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX']); 
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
	}

	public function index(){
        $this->assign("mainController","authFileController");
		$this->display('Eimaudit@Authfile:index-angular');
    }


	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        $data=$this->MSelect($parameter);
        $this->ajaxReturn($data);
    }
	
	
    /*异步新增数据*/
    public function add_page_data(){		
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }	
		$postdata = $_POST;
		$postdata['time'] = time();
        //$postdata['userid'] = 1;
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