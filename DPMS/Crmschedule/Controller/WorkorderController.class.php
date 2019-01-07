<?php
/*
李旭
2017-12-08
用户工单
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class WorkorderController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='workorder';
    public $modalHtmlPath='Crmschedule@Workorder:modal';//模态框的路径
    public $appid = 2;//页面固定ID
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
		if(empty($_SESSION['workorder_ref_auth'])){
			//获取当前权限下可以显示的工单信息id
			$_SESSION['workorder_ref_auth'] = $this->getWorkorderData();
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
                'idworkorder'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'title'=>array('Type'=>'VARCHAR(255)','isNull'=>'NOT NULL','Comment'=>'工单标题'),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'用户id'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'创建时间'),
                'status'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'状态'),
                'starttime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'开始时间'),
                'updatetime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'修改时间'),
                'endtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'结束时间'),
                'expectationendtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'期望结束时间'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户角色'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户组'),
                'refcustomerid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'服务的客户'),
                'refprojectid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'服务的项目'),
                'refcontactid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用联系人'),
                'assignid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'被指派人'),
                'type'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'工单类型'),
                'classification'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>''),
                'feedback'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'反馈'),
                'timely'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'及时'),
                'additional'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'附加'),
                'totalscore'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'平均分')
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idworkorder`),
          INDEX `fk_workorder_users1_idx` (`userid` ASC),
          CONSTRAINT `fk_workorder_users1`
            FOREIGN KEY (`userid`)
            REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ENGINE = InnoDB
        COMMENT = '工单'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);     
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{    
            echo "初始化workorder :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日程管理");
		$this->assign("PageName","用户工单");
        $this->assign('userid',$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","crmWorkorderController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Workorder:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加工单预览");
		$this->assign("PageName","在此可批量添加工单预览并选择要保存的工单.");
        $this->assign("mainController","crmWorkorderpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmschedule@Workorder:preview');
    }
     /*展示详细信息页面*/
    public function detail(){  
      
        $this->display('Crmschedule@Workorder:detail_modal');        
    }
     /*修改项目状态页面*/
    public function statusChange(){        
        $this->display('Crmschedule@Workorder:workorderstatus_modal');        
    }
     /*查看评分页面*/
    public function selectScore(){        
        $this->display('Workorder/alert_modal/selectscore_modal');        
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
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'workorderid'=>true));  
        //这里在开始增加一个参数----这是查询工单的数据
        $_POST['classification'] = '0';
        //true为超级管理员权限
        if($_SESSION['userinfo']['idusers'] == '1'){
            $postdata = $_POST;	
            //$postdata['$fetchSql'] = true;
            $data=$this->MSelect($postdata);
            //$result['count'] = count($alldata);
            $result['data'] = $data;
        }else{
            $result = $this->auth_filterworkorder($_POST);
        }
        $this->ajaxReturn($result);
    }
    //根据当前的权限查询
    public function auth_filterworkorder($parameter){
        $alldatapost = $parameter;
        if(empty($parameter['$findall'])){
			if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
				try{
					$parameter['$where'] = json_decode($_POST['$where'],true);
					$parameter['$where']['idworkorder'] = array('in',$_SESSION['workorder_ref_auth']);
				}
				catch (Exception $e) {
					//此处写日志
					unset($_POST['$where']);
				}
			}else{
				//如果按照idworkorder查询，则使用and的方式加上权限中的idworkorder 一起查询
				if (empty($parameter['idworkorder'])){
					//如果查询中没有idworkorder，不管按照哪些条件，只能查询权限内的数据
                    $parameter['idworkorder'] = array_key_exists('$in',$parameter) && $parameter['$in']?$_SESSION['workorder_ref_auth']:array('in',$_SESSION['workorder_ref_auth']); 
				}else{
                    $parameter['idworkorder'] = array_key_exists('$in',$parameter) && $parameter['$in']?array($_SESSION['workorder_ref_auth'],$parameter['idworkorder']):array(array('in',$_SESSION['workorder_ref_auth']),$parameter['idworkorder']);
				}
			}
		}
        $data=$this->MSelect($parameter);
        //$alldata = $this->MSelect($alldatapost);
        //$resultauth['count'] = count($alldata);
        $resultauth['data'] = $data; 
        return $resultauth;
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
            //$parameter['refusers'] = $_SESSION['userinfo']['idusers'];
            $parameter['createtime'] = time();
            $parameter['guid']=F_guidv4();
            if(!array_key_exists('assignid',$parameter)){
                $parameter['assignid']=$_SESSION['userinfo']['idusers'];
            }
            $data=$this->MInsert($parameter);
            //此处追加session，防止添加成功之后session中没有工单id（只能重新登录刷新session才可以）的问题
            $_SESSION['workorder_ref_auth'] = $_SESSION['workorder_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;   
                $par['guid'] = $parameter['guid'];          
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];  
                $par['content'] = '创建工单['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);               
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $result = $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'workorderid'=>$returndata['id'])); 
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
            /*
                检测一下是否可以确认
                1.拿出来当前的状态
                2.如果可以确认则确认，如果状态不对，则不执行确认动作 
            */
            $id =$parameter['idworkorder'];
            $temp=  $this->MSelect(array('idworkorder'=>$id,'$fieldkey'=>array('status','assignid'),'$find'=>true));  
           
             if ($parameter['datatype']=='5' && $temp['status']!= "0")
             {
                   $this->ajaxReturn(array('key'=>'error','value'=>$temp));
                   exit();
         	
             }else if ($parameter['datatype']=='6' && $temp['status']!= "1")
            {
         	       $this->ajaxReturn(array('key'=>'error','value'=>$temp));
                   exit();
             }else if ($parameter['datatype']=='4' && $temp['status']!= "2")
             {       $this->ajaxReturn(array('key'=>'error','value'=>$temp));
                   exit();
         	
             }else if ($parameter['datatype']=='2' && $temp['status']!= "2")
             {
         	        $this->ajaxReturn(array('key'=>'error','value'=>$temp));
                    exit();
             }   else if ($parameter['datatype']=='1' && $temp['status']!= "0")
             {
         	        $this->ajaxReturn(array('key'=>'error','value'=>$temp));
                    exit();
             }

            //开始修改工单的信息
            if($parameter['status'] == 3 || $parameter['status'] == 2){
                $parameter['endtime'] = time();
            }
            if($parameter['status'] == 1){
                $parameter['starttime'] = time();
            }
            if($parameter['refcustomerid'] == 'delete'){
                $parameter['refcustomerid'] = null;
            }
            if($parameter['refprojectid'] == 'delete'){
                $parameter['refprojectid'] = null;
            }
            //$parameter['updatetime'] = time();
            $data=$this->MUpdate($parameter);                          
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'workorderid'=>$id));           
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
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'workorderid'=>$postdata['idworkorder']));    
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
        /*
        点击公司信息某一项触发前台js方法
        查询指定得公司信息
        @$_GET['id']   公司信息的id
    */
    public function selectdetailed(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
		//var_dump($_GET);
        $this->assign("MenuName","工单管理");
		$this->assign("PageName","在这里您可以查看您的工单详情，或打印您的工单报告。");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailWorkorderController");
        $this->display("Crmschedule@Workorder:selectdetailed");
    }
     /*查看已关闭的项目*/
    public function workorderclose(){   
         $this->assign("mainController","crmWorkordercloseController");     
        $this->display('Crmschedule@Workorder:workorder_close');        
    }
    public function addworkorder(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","工单管理");
		$this->assign("PageName","详细信息");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailWorkorderController");
        $this->display("Crmschedule@Workorder:update_detail_model");
    }
    //创建者的修改工单页面
    public function createdetail(){
        $this->display('Crmschedule@Workorder:createdetailmodel');   
    }
    //执行者的修改工单页面
    public function implementdetail(){
        $this->display('Crmschedule@Workorder:implementdetailmodel');   
    }
    //确认工单页面
    public function completemodel(){
    if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","工单管理");
		$this->assign("PageName","完成工单");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","completemodelWorkorderController");
        $this->display('Crmschedule@Workorder:completedetailmodel');   
    }    

    //根据权限过滤（采用了find_in_set语句）
    //SELECT `idworkorder`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  )      
    public function getWorkorderData(){    
        $userarr = array();        
        $userids = $_SESSION['ugroup_subset_users'];
        $userarr = explode(",",$userids);	
        $parameter=array();
        $parameter['$findinset'] = true;
        //这个字段是抄送
        $parameter['refusers']=$userarr;
        //这个字段是指派人
        $parameter['assignid']=$userarr;
        $parameter['userid']=$userarr;		
        //$parameter['$fetchSql'] = true;
        $parameter['$fieldkey']='idworkorder';
        $result = $this->MSelect($parameter);
        if($_SESSION['userinfo']['idusers'] == 1){//说明是超管
            $par['$fieldkey']='idworkorder,title';
            $result = $this->MSelect($par);
        }
        //var_dump($result);exit();
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idworkorder'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
    function test(){
		$data = $_SESSION;
		 var_dump($data);
    }
}