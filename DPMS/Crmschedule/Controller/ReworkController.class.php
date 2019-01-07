<?php
/*
李旭
2018-11-26
返修清单
*/
namespace Crmschedule\Controller;
use Crmuser\Controller\CommonController;
class ReworkController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='rework';
    public $modalHtmlPath='Crmschedule@Rework:modal';//模态框的路径
    public $appid = 52;//页面固定ID
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
		if(empty($_SESSION['rework_ref_auth'])){
			//获取当前权限下可以显示的返修信息id
			$_SESSION['rework_ref_auth'] = $this->getReworkData();
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
                'idrework'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'starttime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'开始时间'),
                'endtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'结束时间'),
                'phenomenon'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'现象描述'),
                'estimatedendtime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'预计结束时间'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'创建人'),
                'assignid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'指派人'),
                'description'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'结果描述\n文字描述'),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'抄送人'),
                'refship'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联出货清单'),
                'status'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'返修状态'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idrework`),
          INDEX `fk_rework_shipments1_idx` (`refship` ASC),
          INDEX `fk_rework_users1_idx` (`userid` ASC),
          CONSTRAINT `fk_rework_shipments1`
            FOREIGN KEY (`refship`)
            REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."shipments` (`idshipments`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
          CONSTRAINT `fk_rework_users1`
            FOREIGN KEY (`userid`)
            REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
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
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日程管理");
		$this->assign("PageName","返修清单");
        $this->assign('userid',$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","crmReworkController");
        //页面固定ID
        $this->assign("appid",$this->appid);
        $this->display('Crmschedule@Rework:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加返修预览");
		$this->assign("PageName","在此可批量添加返修预览并选择要保存的返修.");
        $this->assign("mainController","crmReworkpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmschedule@Rework:preview');
    }
     /*展示详细信息页面*/
    public function detail(){        
        $this->display('Crmschedule@Rework:detail_modal');        
    }
    /*
    异步查询数据
    此处根据用户id/用户角色id/用户组id去获取了过滤后的返修信息
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
            $parameter['refusers'] = $parameter['refusers']? $parameter['refusers'] . ',8,23,24,25,26' : '8,23,24,25,26';
            $parameter['guid']=F_guidv4();
            $data=$this->MInsert($parameter);
            //此处追加session，防止添加成功之后session中没有返修id（只能重新登录刷新session才可以）的问题
            $_SESSION['rework_ref_auth'] = $_SESSION['rework_ref_auth'].','.$data;
            if($data > 0){
                $par = array();
                $par['appid'] = $this->$appid;      
                $par['guid']=$parameter['guid'];     
                $par['dataid'] = $data;    
                $par['datauserid'] = $parameter['userid'];   
                $par['content'] = '创建返修清单['. $parameter['title'] .'],成功。创建人：<b style="font-family:\'微软雅黑\';">'.$_SESSION['userinfo']['username'].': '.$_SESSION['userinfo']['description'].'</b>';
                $resultdata = A('Crmhistorymessageboard/Historymessageboard')->insert_controller_data($par);               
            }
            $returndata['id'] = $data;
            $returndata['guid'] = $parameter['guid'];
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
        $this->assign("MenuName","返修管理");
		$this->assign("PageName","在这里您可以查看您的返修详情，或打印您的返修报告。");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailReworkController");
        $this->display("Crmschedule@Rework:selectdetailed");
    }
    //根据权限过滤（采用了find_in_set语句）
    //SELECT `idrework`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_rework` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  )      
    public function getReworkData(){    
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
        $parameter['$fieldkey']='idrework';
        $result = $this->MSelect($parameter);
        if($_SESSION['userinfo']['idusers'] == 1){//说明是超管
            $par['$fieldkey']='idrework';
            $result = $this->MSelect($par);
        }
        //因为涉及到了返修清单单独的权限逻辑所以这里额外写一个方法，用于判断当前角色是不是销售、技术，如果是的话他的项目出货了，应该可以看到这条返修清单
        if(strpos($_SESSION['user_ref_typeids'],'6') !== false || strpos($_SESSION['user_ref_typeids'],'7') !== false ){
            $result = $this->Saleauth();
        }
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idrework'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
    //因为涉及到了返修清单单独的权限逻辑所以这里额外写一个方法，用于判断当前角色是不是销售，如果是的话他的项目出货了，应该可以看到这条返修清单
    private function Saleauth(){
        if(empty($_SESSION['project_ref_auth'])){
			//8.获取当前权限下可以显示的项目信息id
			$_SESSION['project_ref_auth'] = $this->getProjectData();
		}	
        //这里把得到的project赋值
        $par['refprojects']=substr($_SESSION['project_ref_auth'],0,strlen($_SESSION['project_ref_auth'])-1); ;
        $par['$in']=true;
        $par['$fieldkey']='idrework';
        $result = $this->MSelect($par);
        return $result;
    }
    public function randow(){
        $length = 10;
        for($i = 0;$i<51;$i++){
            echo rand(pow(10,($length-1)), pow(10,$length)-1) .'<br />';
        }
    }
}