<?php
/*
李旭
2018-11-26
返修设备
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class ReworkdeviceController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='reworkdevice';
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
                'idreworkdevice'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'productmodelid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'产品型号'),
                'serials'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'序列号'),
                'status'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'返修状态0:已过保\n1:已更换\n2:已维修'),
                'newserial'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'新序列号'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'refrework'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联外键'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idreworkdevice`),
          INDEX `fk_reworkdevice_rework1_idx` (`refrework` ASC),
          CONSTRAINT `fk_reworkdevice_rework1`
            FOREIGN KEY (`refrework`)
            REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."rework` (`idrework`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ENGINE = InnoDB",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);   
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{    
            echo "初始化Rework :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的工单信息
    */
    public function select_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        /*
            _action 0：添加 1：修改  2：删除 3 查询
            _result 0 失败 1成功
        */
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'reworkid'=>true));  
        //true为超级管理员权限
        //$_POST['$fetchSql'] = true;
        if($_SESSION['userinfo']['idusers'] == '1'){
            $postdata = $_POST;	
            $data=$this->MSelect($postdata);
            //$result['count'] = count($alldata);
            $result = $data;
        }else{
            $result = $this->auth_filterrework($_POST);
        }
        $this->ajaxReturn($result);
    }
    //根据当前的权限查询
    public function auth_filterrework($parameter){
        if(empty($parameter['$findall'])){
			if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
				try{
					$parameter['$where'] = json_decode($_POST['$where'],true);
					$parameter['$where']['idrework'] = array('in',$_SESSION['rework_ref_auth']);
				}
				catch (Exception $e) {
					//此处写日志
					unset($_POST['$where']);
				}
			}else{
				//如果按照idrework查询，则使用and的方式加上权限中的idrework 一起查询
				if (empty($parameter['idrework'])){
					//如果查询中没有idrework，不管按照哪些条件，只能查询权限内的数据
                    $parameter['idrework'] = array_key_exists('$in',$parameter) && $parameter['$in']?$_SESSION['rework_ref_auth']:array('in',$_SESSION['rework_ref_auth']); 
				}else{
                    $parameter['idrework'] = array_key_exists('$in',$parameter) && $parameter['$in']?array($_SESSION['rework_ref_auth'],$parameter['idrework']):array(array('in',$_SESSION['rework_ref_auth']),$parameter['idrework']);
				}
			}
		}
        $data=$this->MSelect($parameter);
        return $data;
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
            //这里特别注意一下----- 我把商务的几个人都加进到抄送人里了，就是说默认添加一个返修清单会自动抄送他们几个。
            $parameter['refusers'] = $parameter['refusers'] . ',8,23,24,25,26';
            $parameter['createtime'] = time();
            $parameter['guid']=F_guidv4();
            $data=$this->MInsert($parameter);
            //此处追加session，防止添加成功之后session中没有工单id（只能重新登录刷新session才可以）的问题
            $_SESSION['rework_ref_auth'] = $_SESSION['rework_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;    
                $par['guid'] = $parameter['guid'];         
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];  
                $par['content'] = '创建返修清单['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);               
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'reworkid'=>$returndata['id'])); 
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
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'reworkid'=>$id));           
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
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'reworkid'=>$postdata['idrework']));    
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
        foreach($parameter['add'] as $additem){  
            $addresult = $this->MInsert($additem);       
            array_push($result['add'],[id=>$addresult,index=>$additem['__index']]);
        }
        foreach ($parameter['upd'] as $upditem)
        {
            $updresult = $this->MUpdateObj($upditem);   
            array_push($result['upd'],[status=>$updresult,index=>$upditem['__index']]);
        }
        foreach ($parameter['del'] as $delitem)
        {
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
            $data['newserial'] = array('like', "%".$params['serials']."%");
            //或查询--tp独有写法
            $data['_logic'] = 'or';
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