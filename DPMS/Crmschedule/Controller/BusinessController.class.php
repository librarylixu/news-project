<?php
/*
李旭
2018-09-17
出差管理
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class BusinessController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='business';
    public $modalHtmlPath='Crmschedule@business:modal';//模态框的路径
    public $appid = 47;//页面固定ID
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
		if(empty($_SESSION['business_ref_auth'])){
			//获取当前权限下可以显示的出差信息id
			$_SESSION['business_ref_auth'] = $this->getBusinessData();
		}
    }
    function  __destruct(){     
     
    }
     //字段
    function getColunms(){
         /*
    'Type'=>'INT',  字段的数据类型
    'isNull'=>'NOT NULL', 是否为空
    'Comment'=>'', 字段描述5
    'Default'=>'', 默认值
    'AutoIncrement'=>'AUTO_INCREMENT' 自增标致

    tValue 自定义的处理标志  md5表示需要该字段的值需要进行md5加密   
       public $table_colunms=array('','name','del','index','path','createtime','deltime','uploaduser','uploadaddress');
    */
       $c=array(
                'idbusiness'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'name'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'出差名称'),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'userid'=>array('Type'=>'INT','isNull'=>'NOT NULL','Comment'=>'创建人'),
                'assignid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'审批人id'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'创建时间'),
                'starttime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'开始时间'),
                'estimatetime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'预计结束时间'),
                'endtime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'结束时间'),
                'approvaltime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'同意审批的时间'),
                'mark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'总结'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'place'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'出差地点'),
                'refcustomerid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'客户id'),
                'refprojectid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'项目id'),
                'refcontactid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'联系人id'),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户角色'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的用户组'),
                'status'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'出差状态'),
                'statusmark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'状态备注'),
                'closetype'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'关闭状态'),
                'isinvoice'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否报销')
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idbusiness`),
                      INDEX `fk_business_users1_idx` (`userid` ASC),
                      CONSTRAINT `fk_business_users1`
                        FOREIGN KEY (`userid`)
                        REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
                    ENGINE = InnoDB
                    COMMENT = '出差管理模块'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);     
                    //var_dump($sql);exit();
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
		$this->assign("PageName","用户出差");
        $this->assign('userid',$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","crmBusinessController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Business:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加出差预览");
		$this->assign("PageName","在此可批量添加出差预览并选择要保存的出差.");
        $this->assign("mainController","crmBusinesspreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmschedule@Business:preview');
    }
     /*展示详细信息页面*/
    public function detail(){        
        $this->display('Crmschedule@Business:detail_modal');        
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的出差信息
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
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'businessid'=>true));  
        //true为超级管理员权限
        if($_SESSION['userinfo']['idusers'] != '1'){
            $_POST['$authority'] = 'business_ref_auth';
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
            //此处追加session，防止添加成功之后session中没有出差id（只能重新登录刷新session才可以）的问题
            $_SESSION['business_ref_auth'] = $_SESSION['business_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;     
                 $par['guid'] = $parameter['guid'];        
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];      
                $par['content'] = '创建出差['. $parameter['name'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);               
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $result = $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'businessid'=>$returndata['id'])); 
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
            //开始修改出差的信息
            if($parameter['status'] == 4){
                $parameter['closetype'] = 1;
            }
            $data=$this->MUpdate($parameter);                          
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'businessid'=>$id));           
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
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'businessid'=>$postdata['idbusiness']));    
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
        $this->assign("MenuName","出差管理");
		$this->assign("PageName","在这里您可以查看您的出差详情，或打印您的出差报告。");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailBusinessController");
        $this->display("Crmschedule@Business:selectdetailed");
    }
     /*查看已关闭的出差*/
    public function businessclose(){
        $this->assign("userid",$_SESSION['userinfo']['idusers']);   
        $this->assign("mainController","crmBusinesscloseController");     
        $this->display('Crmschedule@Business:business_close');        
    }
    public function addbusiness(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","出差管理");
		$this->assign("PageName","详细信息");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailBusinessController");
        $this->display("Crmschedule@Business:update_detail_model");
    }
    //创建者的修改出差页面
    public function createdetail(){
        $this->display('Crmschedule@Business:createdetailmodel');   
    }
    //执行者的修改出差页面
    public function implementdetail(){
        $this->display('Crmschedule@Business:implementdetailmodel');   
    }
    //确认出差页面
    public function completemodel(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","出差管理");
		$this->assign("PageName","完成出差");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","completemodelBusinessController");
        $this->display('Crmschedule@Business:completedetailmodel');   
    }    

    //根据权限过滤（采用了find_in_set语句）
    //SELECT `idworkorder`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  )      
    public function getBusinessData(){    
        $userarr = array();        
        $userids = $_SESSION['ugroup_subset_users'];
        $idusers = $_SESSION['userinfo']['idusers'];
        $userarr = explode(",",$userids);	
        $parameter=array();
        $parameter['$findinset'] = true;
        //这个字段是抄送
        $parameter['refusers']=$userarr;
        //这个字段是指派人
        $parameter['assignid']=$idusers;
        $parameter['userid']=$idusers;		
        //$parameter['$fetchSql'] = true;
        $parameter['$fieldkey']='idbusiness';
        $result = $this->MSelect($parameter);
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idbusiness'] . ',';
        }
        return $resultid;
    }
    //关闭的出差页面
    public function business_colse(){
        $this->display('Crmschedule@Business:business_colse');   
    }
}