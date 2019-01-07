<?php
/*
李旭
2018-08-20
工作记录
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class RecordController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='workorder';
    public $modalHtmlPath='Crmschedule@Record:modal';//模态框的路径
    public $appid = 44;//页面固定ID
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
		if(empty($_SESSION['record_ref_auth'])){
			//获取当前权限下可以显示的工单信息id
			$_SESSION['record_ref_auth'] = $this->getRecordData();
		}
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
                'title'=>array('Type'=>'VARCHAR(255)','isNull'=>'NOT NULL','Comment'=>'工作记录标题'),
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
                'type'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'工作记录类型'),
                'classification'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>''),
                );
        return $c;
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日程管理");
		$this->assign("PageName","工作记录");
        $this->assign('userid',$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","crmRecordController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Record:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加工作记录预览");
		$this->assign("PageName","在此可批量添加工作记录预览并选择要保存的工作记录.");
        $this->assign("mainController","crmRecordpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmschedule@Record:preview');
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
        $this->assign("MenuName","记录管理");
		$this->assign("PageName","在这里您可以查看您的记录详情，或打印您的记录报告。");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
         $this->assign("appid",$this->appid);      
        $this->assign("mainController","detailRecordController");
        $this->display("Crmschedule@Record:selectdetailed");
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的工作记录信息
    */
    public function select_page_data(){
        if(!IS_POST){
            $this->ajaxReturn(false);
            exit;
        }
        //这里增加唯一参数--表示在查询工作记录
        $_POST['classification'] = 1;
        /*
            _action 0：添加 1：修改  2：删除 3 查询
            _result 0 失败 1成功
        */
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'recordid'=>true));  
        //true为超级管理员权限
        //$_POST['$fetchSql'] = true;
        if($_SESSION['userinfo']['idusers'] == '1'){
            $postdata = $_POST;	
            //$postdata['$fetchSql'] = true;
            $data=$this->MSelect($postdata);
            //$result['count'] = count($alldata);
            $result = $data;
        }else{
            $result = $this->auth_filterrecord($_POST);
        }
        $this->ajaxReturn($result);
    }
    //根据当前的权限查询
    public function auth_filterrecord($parameter){
        $alldatapost = $parameter;
        if(empty($parameter['$findall'])){
			if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
				try{
					$parameter['$where'] = json_decode($_POST['$where'],true);
					$parameter['$where']['idworkorder'] = array('in',$_SESSION['record_ref_auth']);
				}
				catch (Exception $e) {
					//此处写日志
					unset($_POST['$where']);
				}
			}else{
				//如果按照idworkorder查询，则使用and的方式加上权限中的idworkorder 一起查询
				if (empty($parameter['idworkorder'])){
					//如果查询中没有idworkorder，不管按照哪些条件，只能查询权限内的数据
					$parameter['idworkorder'] = array('in',$_SESSION['record_ref_auth']);
				}else{
					$parameter['idworkorder'] = array(array('in',$_SESSION['record_ref_auth']),$parameter['idworkorder']);
				}
			}
		}
        $data=$this->MSelect($parameter);
        //$alldata = $this->MSelect($alldatapost);
        //$resultauth['count'] = count($alldata);
        $resultauth = $data;
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
            //区分工单还是工作记录
            $parameter['classification'] = 1;
            $parameter['userid'] = $_SESSION['userinfo']['idusers'];
            //$parameter['refusers'] = $_SESSION['userinfo']['idusers'];
            $parameter['createtime'] = time();
            $parameter['guid']=F_guidv4();             
            $data=$this->MInsert($parameter);           
            //此处追加session，防止添加成功之后session中没有工作记录id（只能重新登录刷新session才可以）的问题
            $_SESSION['record_ref_auth'] = $_SESSION['record_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;         
                $par['guid'] = $parameter['guid'];
                 $par['dataid'] = $data;
                $par['datauserid'] = $parameter['userid'];
                $par['content'] = '创建工作记录['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';                
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);
            }
            
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'recordid'=>$returndata['id']));  
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
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'recordid'=>$parameter['idworkorder']));           
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
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'recordid'=>$postdata['idworkorder']));    
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
    //根据权限过滤（采用了find_in_set语句）
    //SELECT `idworkorder`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  ) 
    public function getRecordData(){    
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
    //更新后调用，这个方法是修改表字段，增加一个type字段    也可以用作直接执行sql语句的方法
    function insertype_colunms(){
        $sql = "ALTER TABLE `xc_workorder` ADD classification INT(11) DEFAULT '0' AFTER type;";
        $result = Fm($this->table_name)->execute($sql);
        var_dump($result);
    }
}