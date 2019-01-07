<?php
/*
李旭
2018-11-19
出货设备
因为是子页面所以中间没有权限逻辑
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class ShipmentsdeviceController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='shipmentsdevice';
    public $modalHtmlPath='Crmschedule@Shipmentsdevice:modal';//模态框的路径
    public $table_key;//只包含字段名称
    function __construct(){  
        parent::__construct();
        $this->table_colunms=$this->getColunms();
        $this->table_key=array_keys($this->table_colunms); 
        		
	   if($_SESSION['initdb'] === true){
			return;
		}
		if(empty($_SESSION['userinfo']['idusers'])){
			echo "页面超时，请重新登录";
			exit;
		}
        //出货设备页面不需要页面权限设置----因为是子页面
        //if(empty($_SESSION['shipments_ref_auth'])){
        //    //获取当前权限下可以显示的出货信息id
        //    $_SESSION['shipments_ref_auth'] = $this->getShipmentsData();
        //}
				
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
                'idshipmentsdevice'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'productmodelid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联的设备型号id'),
                'productnumber'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'设备数量'),
                'refship'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联的出货清单数据'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'serials'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'序列号组\n自定义的，\nxxx、xxx、xxx\n'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idshipmentsdevice`),
              INDEX `fk_shipmentsdevice_shipments1_idx` (`refship` ASC),
              CONSTRAINT `fk_shipmentsdevice_shipments1`
                FOREIGN KEY (`refship`)
                REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."shipments` (`idshipments`)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);   
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{    
            echo "初始化Shipments :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    
    /*
    异步查询数据
    直接查询了所有的信息
    */
    public function select_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        $postdata = $_POST;	
        $data=$this->MSelect($postdata);
        $result = $data;
       
        $this->ajaxReturn($result);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
            $parameter = $_POST;
            $parameter['userid'] = $_SESSION['userinfo']['idusers'];
            //这里特别注意一下----- 我把商务的几个人都加进到抄送人里了，就是说默认添加一个出货清单会自动抄送他们几个。
            $parameter['refusers'] = $parameter['refusers'] . ',8,23,24,25,26';
            $parameter['createtime'] = time();
            $parameter['guid']=F_guidv4();
            $data=$this->MInsert($parameter);
            //此处追加session，防止添加成功之后session中没有出货id（只能重新登录刷新session才可以）的问题
            $_SESSION['shipments_ref_auth'] = $_SESSION['shipments_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;   
                $par['guid'] = $parameter['guid'];      
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];  
                $par['content'] = '创建出货清单['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);               
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'shipmentsid'=>$returndata['id'])); 
            $this->ajaxReturn($returndata);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
        
        
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
        	$parameter = $_POST;  
            $data=$this->MUpdate($parameter);                          
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'shipmentsid'=>$id));           
            $this->ajaxReturn($data);
           
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
    /*
        异步删除数据
        标记删除
    */
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
        	$postdata = $_POST;
            $postdata['del'] = 1;
            $data=$this->MUpdate($postdata);
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'shipmentsid'=>$postdata['idshipments']));    
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
    function batchOperation(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $result = [
            'add'=>[],
            'del'=>[],
            'upd'=>[],
        ];
        $parameter = json_decode($_POST['data'],true);
        //处理serials
            $preg = "/[\r\n]+/";
        foreach($parameter['add'] as $additem){  
            $additem['serials'] = preg_replace($preg,'<br />',$additem['serials']);
            $addresult = $this->MInsert($additem);       
            array_push($result['add'],[id=>$addresult,index=>$additem['__index']]);
        }
        foreach ($parameter['upd'] as $upditem)
        {
            $upditem['serials'] = preg_replace($preg,'<br />',$upditem['serials']);
            $updresult = $this->MUpdateObj($upditem);   
            array_push($result['upd'],[status=>$updresult,index=>$upditem['__index']]);
        }
        foreach ($parameter['del'] as $delitem)
        {
            $delitem['serials'] = preg_replace($preg,'<br />',$delitem['serials']);
            $delresult = $this->MDelete($delitem);   
            array_push($result['del'],[status=>$delresult,index=>$delitem['__index']]);
        }
        $this->ajaxReturn($result);
        
    }
    //like查询
    public function select_like_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
            //这里我就直接给你做限制，你只能传系列号，别的不好使
            $params = $_POST; 
            $data['serials'] = array('like', "%".$params['serials']."%");
            if (array_key_exists('$find',$params) && $params['$find']==true)
            {
        	    $result=Fm($this->table_name)->where($data)->fetchSql(false)->find();
            }else{
                $result = Fm($this->table_name)->where($data)->fetchSql(false)->select(); 
            }
            $this->ajaxReturn($result);
        }
        catch (Exception $exception)
        {
            //错误
        }
        
    }
}