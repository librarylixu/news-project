<?php
/*
李旭
2018-08-13
商机线索
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class ClueController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='clue';
    public $modalHtmlPath='Crmschedule@Clue:modal';//模态框的路径
    public $appid = 43;//页面固定ID
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
		if(empty($_SESSION['clue_ref_auth'])){
			//获取当前权限下可以显示的商机信息id
			$_SESSION['clue_ref_auth'] = $this->getClueData();
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
                'idclue'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'customername'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'公司名称'),
                'customeraddress'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'公司地址'),
                'contactname'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'咨询人'),
                'contactphone'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'咨询人联系方式'),
                'contactlevel'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'咨询人级别'),
                'productmodel'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'咨询的产品型号'),
                'type'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'商机类型'),
                'source'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'来源'),
                'assignid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'指派人'),
                'status'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'商机状态'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'updatetime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'mark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'备注'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>''),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idclue`)) ENGINE = InnoDB
        COMMENT = '商机线索'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);     
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{    
            echo "初始化clue :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化clue,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","商机管理");
		$this->assign("PageName","商机线索");
        $this->assign('userid',$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","crmClueController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Clue:index-angular');
    }
     /*商机完成前修改商机状态页面*/
    public function beforeComplete(){        
        $this->display('Clue/alert_modal/before_complete_modal');        
    }
    //已关闭商机页面
    public function clueclose(){
        $this->assign("userid",$_SESSION['userinfo']['idusers']);   
        $this->assign("mainController","crmCluecloseController"); 
        $this->display('Crmschedule@Clue:clue_close');
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的商机信息
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
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'clueid'=>true));  
        //true为超级管理员权限
        if($_SESSION['userinfo']['idusers'] != '1'){
            $_POST['$authority'] = 'clue_ref_auth';
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
    //根据当前的权限查询
    public function auth_filterclue($parameter){
        $alldatapost = $parameter;
        if(empty($parameter['$findall'])){
			if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
				try{
					$parameter['$where'] = json_decode($_POST['$where'],true);
					$parameter['$where']['idclue'] = array('in',$_SESSION['clue_ref_auth']);
				}
				catch (Exception $e) {
					//此处写日志
					unset($_POST['$where']);
				}
			}else{
                //如果按照idclue查询，则使用and的方式加上权限中的idclue 一起查询
				if (empty($parameter['idclue'])){
					//如果查询中没有idclue，不管按照哪些条件，只能查询权限内的数据
                    $parameter['idclue'] = array_key_exists('$in',$parameter) && $parameter['$in']?$_SESSION['clue_ref_auth']:array('in',$_SESSION['clue_ref_auth']); 
				}else{
                    $parameter['idclue'] = array_key_exists('$in',$parameter) && $parameter['$in']?array($_SESSION['clue_ref_auth'],$parameter['idclue']):array(array('in',$_SESSION['clue_ref_auth']),$parameter['idclue']);
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
            $parameter['createtime'] = time();
            $parameter['guid'] = F_guidv4();
            $parameter['userid'] = $_SESSION['userinfo']['idusers'];
            if(!array_key_exists('assignid',$parameter)){
                $parameter['assignid']=$_SESSION['userinfo']['idusers'];
            }
            $data=$this->MInsert($parameter);
            //此处追加session，防止添加成功之后session中没有商机id（只能重新登录刷新session才可以）的问题
            $_SESSION['clue_ref_auth'] = $_SESSION['clue_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;                
                $par['guid'] = $parameter['guid'];
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];  
                $par['content'] = '创建商机['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
            $returndata['createtime'] =  $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>0,'_result'=>$data,'clueid'=>$returndata['id']));  
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
            $parameter['updatetime'] = time();
            $data=$this->MUpdate($parameter);
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($_POST,array('_action'=>1,'_result'=>$data,'clueid'=>$id));      
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
            $this->MLog($_POST,array('_action'=>2,'_result'=>$data,'clueid'=>$postdata['idclue']));    
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
        $this->assign("MenuName","商机管理");
		$this->assign("PageName","在这里您可以查看您的商机详情，或打印您的商机报告。");
        $this->assign("id",$_GET['id']);
        //$this->assign("userid",$_SESSION['userinfo']['idusers']);
         $this->assign("appid",$this->appid);
        $this->assign("mainController","detailClueController");
        $this->display("Crmschedule@Clue:selectdetailed");
    }
    //创建者的修改Clue页面
    public function createdetail(){
        $this->display('Crmschedule@Clue:createdetailmodel');   
    }
    //执行者的修改商机页面
    public function implementdetail(){
        $this->display('Crmschedule@Clue:implementdetailmodel');   
    }
    //确认商机页面
    public function completemodel(){
    if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","商机管理");
		$this->assign("PageName","完成商机");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","completemodelClueController");
        $this->display('Crmschedule@Clue:completedetailmodel');   
    }    

    //根据权限过滤（采用了find_in_set语句）
    //SELECT `idclue`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_clue` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  )      
    public function getClueData(){    
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
        $parameter['$fieldkey']='idclue';
        $result = $this->MSelect($parameter);
        //var_dump($result);exit();
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idclue'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
}