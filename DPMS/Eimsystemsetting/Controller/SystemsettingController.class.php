<?php
/*
    2018.08.08
	系统设置 - 系统设置
*/
namespace Eimsystemsetting\Controller;
use Crmuser\Controller\CommonController;
class SystemsettingController extends CommonController {
	//空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }	
    //用户表的字段
    public $table_colunms;//全部的字段信息
    public $table_name='systemsetting';
    public $modalHtmlPath='';//模态框的路径
    public $table_key;//只包含字段名称
    public $appid = 11;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms);
    }
    function  __destruct(){     
        
    }
    function getColunms(){

       $c=array(
                'type'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'系统设置类型,主键'),
                'value'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'对应的值,可以是json格式的字符串'),
                'display'=>array('Type'=>'TEXT','isNull'=>'NOT NULL','Comment'=>'对type的描述')             
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`type`)) ENGINE = InnoDB",
                        C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);    
       //var_dump($sql);
  
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }

   public function init_db(){
        try{           
            $nValue=array();
            $key=array('type','value');
            $nValue = array_combine($key,array('namelength', '{"maxlength":10,"minlength":1}'));//名称最大/最小输入字段值
             $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array('usernameset', '{"usernameminlength":1,"usernamemaxlength":10,"passwordcomplexity":"1,2","passwordminlength":1,"passwordminlength":10,"errtimeperiod":5,"errtime":5,"locktime":10}'));//账号设置项
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array('deviceset', 
'{"deviceaccountminlength":1,"deviceaccountmaxlength":10,"assetlistth":["opensessions","idassetslist","networkstatus","devicename","ipaddress","modeltypeid","contactpeople","remark","opensession"],"kvmlistth":["devicename","modeltypeid","networkstatus","ipaddress","contactpeople","remark","opensession"],"dpulistth":["devicename","modeltypeid","networkstatus","ipaddress","contactpeople","remark","opensession"],"exslistth":["networkstatus","devicename","ipaddress","modeltypeid","contactpeople","remark","opensession"]}'));//设备设置项
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array('ruleexpirtime',30));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array('sessionsenterport',22 ));
            $result=Fm($this->table_name)->data($nValue)->add();
            $nValue = array_combine($key,array('userset', '{"unameminlen":1,"unamemaxlen":15}'));
            $result=Fm($this->table_name)->data($nValue)->add();
            echo "初始化".$this->table_name."<br/>";
        }catch (Exception $e) {
            A('Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appgroup,Error:'.$e->getMessage()));            
        } 
    }
      //系统设置页面
	public function index(){
		$this->display('Eimsystemsetting@Systemsetting:index');
	}
/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		$postdata['del'] = 0;
        $data=$this->MSelect($postdata);
        $this->ajaxReturn($data);
    }
 /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
        //加密       
        $data=$this->MUpdate($postdata);        
        $this->ajaxReturn($data);
    }	 
    //修改方法，如果传入$where 则根据传入的$where条件修改数据
    function MUpdate($parameter=array('$fetchSql'=>false)){
        $where=array();
		if(!empty($parameter['$where'])){
			$where = json_decode($parameter['$where']);
		}else if (array_key_exists($this->table_key[0], $parameter)) {
			//处理where
			$where[$this->table_key[0]] = $parameter[$this->table_key[0]]; 
			unset($parameter[$this->table_key[0]]);            
        }else{
		 	return 0;
		}
        //处理value
        $nValue=array();
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $nValue[$key]=$value;
            }
        }
        //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        //var_dump($where);
        //var_dump($parameter);
        $data = Fm($this->table_name)->where($where)->fetchSql($fetchSql)->save($nValue);                  
        return $data;
    }
}