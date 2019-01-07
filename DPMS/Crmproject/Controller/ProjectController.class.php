<?php
/*
刘世群
2017-09-14
项目管理
*/
namespace Crmproject\Controller;
use Crmuser\Controller\CommonController;
class ProjectController extends CommonController {
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
    public $table_colunms;//全部的字段信息
    public $table_name='projectmain';
    public $modalHtmlPath='Crmproject@Project:modal';//模态框的路径
    public $appid=33;
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

		if(empty($_SESSION['project_ref_auth'])){
			//8.获取当前权限下可以显示的项目信息id
			$_SESSION['project_ref_auth'] = $this->getProjectData();
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
                'idproject'=>array('Type'=>'INT','isNull'=>'NOT NULL','AutoIncrement'=>'AUTO_INCREMENT','Comment'=>''),
                'guid'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>''),
                'name'=>array('Type'=>'VARCHAR(355)','isNull'=>'NOT NULL','Comment'=>'项目名称'),
                'createtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'项目创建时间'),
                'starttime'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'项目开始时间'),
                'endtime'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'项目结束时间'),
                'clientname'=>array('Type'=>'VARCHAR(255)','isNull'=>'NOT NULL','Comment'=>'最终用户名称'),
                'statusid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'项目状态'),
                'mark'=>array('Type'=>'TEXT','isNull'=>'NULL','Comment'=>'项目备注'),
                'userid'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'项目创建人'),
                'principal'=>array('Type'=>'VARCHAR(45)','isNull'=>'NOT NULL','Comment'=>'项目负责人'),
                'index'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'del'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>''),
                'refusers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户'),
                'refutypes'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户角色'),
                'refugroups'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联用户组'),
                'refcontacts'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联联系人'),
                'refinformant'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'线人'),
                'refdecision'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'决策者'),
                'reftechnical'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'技术把关者'),
                'refusing'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'使用者'),
                'refcustomers'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的客户'),
                'refannexs'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'关联的附件'),
                'contracttime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'预计正式合同签订日期'),
                'tendertime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'预计招标时间'),
                'delivertime'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'预计要货/交付日期'),
                'grasp'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'项目把握度'),
                'integrate'=>array('Type'=>'INT','isNull'=>'NULL','Default'=>'0','Comment'=>'是否集成项目'),
                'city'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'产品使用地'),
                'decisioncity'=>array('Type'=>'VARCHAR(45)','isNull'=>'NULL','Comment'=>'决策地'),
                'isprotected'=>array('Type'=>'INT','isNull'=>'NOT NULL','Default'=>'0','Comment'=>'受保护项目'),
                'refclue'=>array('Type'=>'INT','isNull'=>'NULL','Comment'=>'关联商机'),
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
        $sql=sprintf("CREATE  TABLE IF NOT EXISTS `%s`.`%s` (%s PRIMARY KEY (`idproject`),
                  INDEX `fk_project_projectstatus2_idx` (`userid` ASC),
                  INDEX `fk_project_projectstatus_idx` (`statusid` ASC),
                  CONSTRAINT `fk_project_projectstatus2`
                    FOREIGN KEY (`userid`)
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."users` (`idusers`)
                    ON DELETE SET NULL
                    ON UPDATE SET NULL,
                  CONSTRAINT `fk_project_projectstatus`
                    FOREIGN KEY (`statusid`)
                    REFERENCES `".C('CrmDB')['DB_NAME']."`.`".C('CrmDB')['DB_PREFIX']."projectstatus` (`idprojectstatus`)
                    ON DELETE SET NULL
                    ON UPDATE SET NULL)
                ENGINE = InnoDB
                COMMENT = '项目表'",C('CrmDB')['DB_NAME'],C('CrmDB')['DB_PREFIX'].$this->table_name,$str);     
        $result=Fm()->execute($sql);
        echo 'CreateTable '.$this->table_name.'==>'.$result."<br/>";
    }
    /*初始化表数据*/
    public function init_db(){
        try{           
            echo "初始化项目管理 :".$result."<br/>";
        }catch (Exception $e) {
            A('Crm/Runlog')->add(array(level=>1,text=>CONTROLLER_NAME.'-'.ACTION_NAME.'初始化Appinfo,Error:'.$e->getMessage()));            
        } 
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","项目管理");
		$this->assign("PageName","项目信息管理");
        $this->assign("appid",33);
        $this->assign("authappid",$_SESSION['user_ref_appids']);
         $this->assign("mainController","crmProjectController");
        $this->display('Crmproject@Project:index-angular');
    }
    //批量导入
    function preview(){  
        $this->assign("MenuName","批量添加项目预览");
		$this->assign("PageName","在此可批量添加项目预览并选择要保存的项目.");
        $this->assign("mainController","crmProjectpreviewController");
        $this->assign("FilePath",$_GET['fileid']);
        $this->display('Crmproject@Project:preview');
    }
     /*展示详细信息页面*/
    public function detail(){        
        $this->display('Crmproject@Project:detail_modal');        
    } 
     /*展示设备列表页面*/
    public function projectlist_model(){        
        $this->display('Crmproject@Project:add_productlist');        
    }
     /*受保护列表页面*/
    public function protectlist(){          
        $this->assign("appid",40);
         $this->assign("mainController","crmProjectprotectController");     
        $this->display('Crmproject@Project:protect_list');        
    }
     /*查看已关闭的项目*/
    public function projectclose(){   
         $this->assign("mainController","crmProjectcloseController");     
        $this->display('Crmproject@Project:project_close');        
    }
    /*
    查询已经逾期的项目
    给前台主页面调用，得到当前还有几条逾期的项目并做提醒    
    */
    public function select_overtime_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        //获取一个当前的时间戳
        $newtime = strtotime("now");
        $sql = "select idproject,endtime from ".C('CrmDB')['DB_PREFIX'].$this->table_name." where del = 0 AND contracttime != 0 AND isprotected = 0 AND 'index' = 0 AND userid = ". $_SESSION['userinfo']['idusers'] ." AND contracttime <" . $newtime;
        $result = Fm()->query($sql);
        $this->ajaxReturn($result);
    }
    //根据时间段查询
    public function select_time_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = json_decode($_POST['$time']);
        $arrkey = key($parameter);
        $newarr = $parameter->$arrkey;
        $sql = "select * from ".C('CrmDB')['DB_PREFIX'].$this->table_name." where del = 0 AND isprotected = 0 AND 'index' = 0 AND idproject in (". substr($_SESSION['project_ref_auth'],0,strlen($_SESSION['project_ref_auth'])-1) .") AND ". $arrkey ." > " . $newarr[0] . " AND ". $arrkey ."<" . $newarr[1];
        $result=Fm()->query($sql);
        $this->ajaxReturn($result);
    }
    /*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        /*
            _action 0：添加 1：修改  2：删除 3 查询
            _result 0 失败 1成功
        */
        $this->MLog($_POST,array('_action'=>3,'_result'=>1,'projectid'=>true));  
		//true为超级管理员权限
		if($_SESSION['userinfo']['idusers'] != '1'){
            $_POST['$authority'] = 'project_ref_auth';
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
            //此处需要自动添加上创建时间和创建人id
            $parameter['createtime'] = time();
            $parameter['guid']=F_guidv4();
            $parameter['userid'] = $_SESSION['userinfo']['idusers'];
		    //$parameter['refusers'] = $_SESSION['userinfo']['idusers'];
            $data=$this->MInsert($parameter);
            if($data>0){
                //此处追加session，防止添加成功之后session中没有工单id（只能重新登录刷新session才可以）的问题
                $_SESSION['project_ref_auth'] = $_SESSION['project_ref_auth'].','.$data;
            }
		    $resultdata = array();
		    $resultdata['id'] = $data;
            $resultdata['guid'] = $parameter['guid'];
            $resultdata['createtime'] = $parameter['createtime'];
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($parameter,array('_action'=>0,'_result'=>$data,'projectid'=>$resultdata['id']));  
            $this->ajaxReturn($resultdata);
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
            if(array_key_exists('index',$parameter) && $parameter['index']){
                //说明要关闭项目了
                $parameter['endtime'] = time();
            }
            $data=$this->MUpdateObj($parameter);
            /*
                _action 0：添加 1：修改  2：删除 3 查询
                _result 0 失败 1成功
            */
            $this->MLog($parameter,array('_action'=>1,'_result'=>$data['ok'],'projectid'=>$parameter['idproject']));  
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
            $this->MLog($parameter,array('_action'=>2,'_result'=>$data,'projectid'=>$postdata['idproject']));  
            $this->ajaxReturn($data);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
    }
    //弹出页面
    public function selectdetailed(){
        if(!array_key_exists('id',$_GET) || intval($_GET['id'])<1 || !IS_GET){
            echo '非法操作';
            exit;
        }
        $this->assign("MenuName","项目管理");
		$this->assign("PageName","详细信息");
        $this->assign("id",$_GET['id']);
        $this->assign("userid",$_SESSION['userinfo']['idusers']);
        $this->assign("mainController","detailProjectController");
        $this->display("Crmproject@Project:selectdetailed");
    }
    //根据权限过滤（采用了find_in_set语句）在Login控制器中调用
    //SELECT `idworkorder`,`title`,`userid`,`createtime`,`status`,`starttime`,`updatetime`,`endtime`,`index`,`del`,`refusers`,`refutypes`,`refugroups`,`refcustomerid`,`refprojectid`,`refcontactid` FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(1,refusers) OR FIND_IN_SET(1,refutypes) OR FIND_IN_SET(54,refutypes) OR FIND_IN_SET(10,refutypes) OR FIND_IN_SET(38,refugroups) OR FIND_IN_SET(39,refugroups) OR FIND_IN_SET(40,refugroups) OR FIND_IN_SET(66,refugroups) OR FIND_IN_SET(140,refugroups)  ) 
    public function getProjectData(){    
        $userarr = array();        
        $userids = $_SESSION['ugroup_subset_users'];
        $userarr = explode(",",$userids);	
        $parameter=array();
        $parameter['$findinset'] = true;
        //这个字段是抄送
        $parameter['refusers']=$userarr;
        $parameter['userid']=$userarr;		
        //$parameter['$fetchSql'] = true;
        $parameter['$fieldkey']='idproject,name';
        $result = $this->MSelect($parameter);
        if($_SESSION['userinfo']['idusers'] == 1){//说明是超管
            $par['$fieldkey']='idproject,name';
            $result = $this->MSelect($par);
        }
        //var_dump($result);exit();
        $resultid = '';
        foreach($result as $value){
        $resultid .= $value['idproject'] . ',';
        }
        //var_dump($resultid);
        return $resultid;
    }
    /*
        查询总价根据状态分组，前台销售漏斗使用
        sql:select sum(promoney.money) as allnum, sum(promoney.money * project.grasp/100) as actualnum,project.statusid from xc_projectmain as project left join xc_projectdevicelist as promoney on project.idproject=promoney.projectid where project.del=0 AND promoney.del=0 AND project.index = 0 group by project.statusid ;
        注：这里把成交前的总价和总价数据都取出来做一个合并。
    */
    function select_page_alldatamoney(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        try
        {
        	//组件未成交sql
            $notdealsql = sprintf("select sum(promoney.money) as allnum,sum(promoney.money * project.grasp/100) as actualnum,project.statusid as statusid from %s as project left join %s as promoney on project.idproject=promoney.projectid where project.del=0 AND promoney.del=0 AND project.index = %s ;",C('CrmDB')['DB_PREFIX'].$this->table_name,C('CrmDB')['DB_PREFIX'].A('Crmproject/Projectdevicelist')->table_name,"0 group by project.statusid");
            //组件成交sql
            $dealsql = sprintf("select sum(promoney.money) as allnum,sum(promoney.money * project.grasp/100) as actualnum,project.statusid as statusid from %s as project left join %s as promoney on project.idproject=promoney.projectid where project.del=0 AND promoney.del=0 AND project.index = %s ;",C('CrmDB')['DB_PREFIX'].$this->table_name,C('CrmDB')['DB_PREFIX'].A('Crmproject/Projectdevicelist')->table_name,"1");
            //查询到了未成交的数据
            $notdealresult = Fm()->query($notdealsql);
            //查询到了成交的数据
            $dealresult = Fm()->fetchSql(true)->query($dealsql);
            //进行合并
            array_push($notdealresult,$dealresult[0]);
            //这里给组件一下，把状态id拿出来当key
            foreach($notdealresult as $value){
                $alldealresult[$value['statusid']] = array('allnum'=>$value['allnum'],'actualnum'=>$value['actualnum']);
            }
            $this->ajaxReturn($alldealresult);
        }
        catch (Exception $e)
        {
            //记录错误日志
        }
        
    }
    //组件城市省/市
	function getCityData(){
        $city = array (  
                  "01" =>   
                      array (  
                      'province_name' => '江苏省',  
                    "id"=>'01',
                    'city' => ["01"=>["city"=>"南京市","id"=>"01"],
                            "02"=>["city"=>"无锡市","id"=>"02"],
                            "03"=>["city"=>"徐州市","id"=>"03"],
                            "04"=>["city"=>"常州市","id"=>"04"],
                            "05"=>["city"=>"苏州市","id"=>"05"],
                            "06"=>["city"=>"南通市","id"=>"06"],
                            "07"=>["city"=>"连云港市","id"=>"07"],
                            "08"=>["city"=>"淮安市","id"=>"08"],
                            "09"=>["city"=>"盐城市","id"=>"09"],
                            "10"=>["city"=>"扬州市","id"=>"10"],
                            "11"=>["city"=>"镇江市","id"=>"11"],
                            "12"=>["city"=>"泰州市","id"=>"12"],
                            "13"=>["city"=>"宿迁市","id"=>"13"],
                            "14"=>["city"=>"金山区","id"=>"14"],
                            "15"=>["city"=>"松江区","id"=>"15"],
                            "16"=>["city"=>"青浦区","id"=>"16"],
                            "17"=>["city"=>"南汇区","id"=>"17"],
                            "18"=>["city"=>"奉贤区","id"=>"18"],
                        ],    
                      ),  
                  "02" =>   
                      array ( 
                        'province_name' => '浙江省',  
                        "id"=>'02',
                        'city' =>  ["01"=>["city"=>"杭州市","id"=>"01"],
                                "02"=>["city"=>"宁波市","id"=>"02"],
                                "03"=>["city"=>"温州市","id"=>"03"],
                                "04"=>["city"=>"嘉兴市","id"=>"04"],
                                "05"=>["city"=>"湖州市","id"=>"05"],
                                "06"=>["city"=>"绍兴市","id"=>"06"],
                                "07"=>["city"=>"金华市","id"=>"07"],
                                "08"=>["city"=>"衢州市","id"=>"08"],
                                "09"=>["city"=>"舟山市","id"=>"09"],
                                "10"=>["city"=>"丽水市","id"=>"10"],
                            ],        
                  ),  
                  "03" =>   
                      array (  
                      'province_name' => '安徽省',  
                        "id"=>'03',
                        'city' =>["01"=>["city"=>"合肥市","id"=>"01"],
                                "02"=>["city"=>"芜湖市","id"=>"02"],
                                "03"=>["city"=>"蚌埠市","id"=>"03"],
                                "04"=>["city"=>"淮南市","id"=>"04"],
                                "05"=>["city"=>"马鞍山市","id"=>"05"],
                                "06"=>["city"=>"淮北市","id"=>"06"],
                                "07"=>["city"=>"铜陵市","id"=>"07"],
                                "08"=>["city"=>"安庆市","id"=>"08"],
                                "09"=>["city"=>"黄山市","id"=>"09"],
                                "10"=>["city"=>"滁州市","id"=>"10"],
                                "11"=>["city"=>"阜阳市","id"=>"11"],
                                "12"=>["city"=>"宿州市","id"=>"12"],
                                "13"=>["city"=>"巢湖市","id"=>"13"],
                                "14"=>["city"=>"六安市","id"=>"14"],
                                "15"=>["city"=>"亳州市","id"=>"15"],
                                "16"=>["city"=>"池州市","id"=>"16"],
                                "17"=>["city"=>"宣城市","id"=>"17"],
                            ],  
                  ),
                  "04" =>   
                      array (  
                        'province_name' => '山西省',  
                        "id"=>'04',
                        'city' =>["01"=>["city"=>"太原市","id"=>"01"],
                                 "02"=>["city"=>"大同市","id"=>"02"],
                                 "03"=>["city"=>"阳泉市","id"=>"03"],
                                 "04"=>["city"=>"长治市","id"=>"04"],
                                 "05"=>["city"=>"晋城市","id"=>"05"],
                                 "06"=>["city"=>"朔州市","id"=>"06"],
                                 "07"=>["city"=>"晋中市","id"=>"07"],
                                 "08"=>["city"=>"运城市","id"=>"08"],
                                 "09"=>["city"=>"忻州市","id"=>"09"],
                                 "10"=>["city"=>"临汾市","id"=>"10"],
                                 "11"=>["city"=>"吕梁市","id"=>"11"],
                                ],  
                  ),  
                  "05" =>   
                      array (  
                        'province_name' => '内蒙古自治区',  
                        "id"=>'05',
                        'city' =>["01"=>["city"=>"呼和浩特市","id"=>"01"],
                                 "02"=>["city"=>"包头市","id"=>"02"],
                                 "03"=>["city"=>"乌海市","id"=>"03"],
                                 "04"=>["city"=>"赤峰市","id"=>"04"],
                                 "05"=>["city"=>"通辽市","id"=>"05"],
                                 "06"=>["city"=>"鄂尔多斯市","id"=>"06"],
                                 "07"=>["city"=>"呼伦贝尔市","id"=>"07"],
                                 "08"=>["city"=>"巴彦淖尔市","id"=>"08"],
                                 "09"=>["city"=>"乌兰察布市","id"=>"09"],
                                 "10"=>["city"=>"兴安盟","id"=>"10"],
                                 "11"=>["city"=>"锡林郭勒盟","id"=>"11"],
                                 "12"=>["city"=>"阿拉善盟","id"=>"12"],
                                ], 
                  ),  
                  "06" =>   
                      array (  
                        'province_name' => '辽宁省',  
                        "id"=>'06',
                        'city' =>["01"=>["city"=>"沈阳市","id"=>"01"],
                                 "02"=>["city"=>"大连市","id"=>"02"],
                                 "03"=>["city"=>"鞍山市","id"=>"03"],
                                 "04"=>["city"=>"抚顺市","id"=>"04"],
                                 "05"=>["city"=>"本溪市","id"=>"05"],
                                 "06"=>["city"=>"丹东市","id"=>"06"],
                                 "07"=>["city"=>"锦州市","id"=>"07"],
                                 "08"=>["city"=>"营口市","id"=>"08"],
                                 "09"=>["city"=>"阜新市","id"=>"09"],
                                 "10"=>["city"=>"辽阳市","id"=>"10"],
                                 "11"=>["city"=>"盘锦市","id"=>"11"],
                                 "12"=>["city"=>"铁岭市","id"=>"12"],
                                 "13"=>["city"=>"朝阳市","id"=>"13"],
                                 "14"=>["city"=>"葫芦岛市","id"=>"14"],
                                ], 
                  ),  
                  "07" =>   
                  array (  
                    'province_name' => '吉林省',  
                    "id"=>'07',
                    'city' =>["01"=>["city"=>"长春市","id"=>"01"],
                            "02"=>["city"=>"吉林市","id"=>"02"],
                            "03"=>["city"=>"四平市","id"=>"03"],
                            "04"=>["city"=>"辽源市","id"=>"04"],
                            "05"=>["city"=>"通化市","id"=>"05"],
                            "06"=>["city"=>"白山市","id"=>"06"],
                            "07"=>["city"=>"松原市","id"=>"07"],
                            "08"=>["city"=>"白城市","id"=>"08"],
                            "09"=>["city"=>"延边朝鲜族自治州","id"=>"09"],
                            "10"=>["city"=>"辽阳市","id"=>"10"],
                            "11"=>["city"=>"盘锦市","id"=>"11"],
                            "12"=>["city"=>"铁岭市","id"=>"12"],
                            "13"=>["city"=>"朝阳市","id"=>"13"],
                            "14"=>["city"=>"葫芦岛市","id"=>"14"],
                        ], 
                  ),  
                  "08" =>   
                  array (  
                    'province_name' => '黑龙江省',  
                    "id"=>'08',
                    'city' =>  ["01"=>["city"=>"哈尔滨市","id"=>"01"],
                            "02"=>["city"=>"齐齐哈尔市","id"=>"02"],
                            "03"=>["city"=>"鸡西市","id"=>"03"],
                            "04"=>["city"=>"鹤岗市","id"=>"04"],
                            "05"=>["city"=>"双鸭山市","id"=>"05"],
                            "06"=>["city"=>"大庆市","id"=>"06"],
                            "07"=>["city"=>"伊春市","id"=>"07"],
                            "08"=>["city"=>"佳木斯市","id"=>"08"],
                            "09"=>["city"=>"七台河市","id"=>"09"],
                            "10"=>["city"=>"牡丹江市","id"=>"10"],
                            "11"=>["city"=>"黑河市","id"=>"11"],
                            "12"=>["city"=>"绥化市","id"=>"12"],
                            "13"=>["city"=>"大兴安岭地区","id"=>"13"],
                            "14"=>["city"=>"葫芦岛市","id"=>"14"],
                        ],  
                  ),  
                  "09" =>   
                  array (  
                        'province_name' => '福建省',  
                        "id"=>'09',
                        'city' =>["01"=>["city"=>"福州市","id"=>"01"],
                                "02"=>["city"=>"厦门市","id"=>"02"],
                                "03"=>["city"=>"莆田市","id"=>"03"],
                                "04"=>["city"=>"三明市","id"=>"04"],
                                "05"=>["city"=>"泉州市","id"=>"05"],
                                "06"=>["city"=>"漳州市","id"=>"06"],
                                "07"=>["city"=>"南平市","id"=>"07"],
                                "08"=>["city"=>"龙岩市","id"=>"08"],
                                "09"=>["city"=>"宁德市","id"=>"09"],
                            ], 
                  ),  
                  "10" =>   
                  array (  
                    'province_name' => '北京市',  
                        "id"=>'10',
                        'city' => [],     
                  ),  
                  "11" =>   
                  array (  
                    'province_name' => '天津市',  
                        "id"=>'11',
                        'city' => [],        
                  ),  
                  "12" =>   
                  array (  
                    'province_name' => '河北省',  
                        "id"=>'12',
                        'city' =>["01"=>["city"=>"石家庄市","id"=>"01"],
                                 "02"=>["city"=>"唐山市","id"=>"02"],
                                 "03"=>["city"=>"秦皇岛市","id"=>"03"],
                                 "04"=>["city"=>"邯郸市","id"=>"04"],
                                 "05"=>["city"=>"邢台市","id"=>"05"],
                                 "06"=>["city"=>"保定市","id"=>"06"],
                                 "07"=>["city"=>"张家口市","id"=>"07"],
                                 "08"=>["city"=>"承德市","id"=>"08"],
                                 "09"=>["city"=>"沧州市","id"=>"09"],
                                 "10"=>["city"=>"廊坊市","id"=>"10"],
                                 "11"=>["city"=>"衡水市","id"=>"11"],
                                ], 
                  ),  
                  "13" =>   
                  array (  
                    'province_name' => '上海市',  
                    "id"=>'13',
                    'city' =>  [],
                  ),  
                  "14" =>   
                  array (  
                    'province_name' => '江西省',  
                    "id"=>'14',
                    'city' => ["01"=>["city"=>"南昌市","id"=>"01"],
                            "02"=>["city"=>"景德镇市","id"=>"02"],
                            "03"=>["city"=>"萍乡市","id"=>"03"],
                            "04"=>["city"=>"九江市","id"=>"04"],
                            "05"=>["city"=>"新余市","id"=>"05"],
                            "06"=>["city"=>"鹰潭市","id"=>"06"],
                            "07"=>["city"=>"赣州市","id"=>"07"],
                            "08"=>["city"=>"吉安市","id"=>"08"],
                            "09"=>["city"=>"宜春市","id"=>"09"],
                            "10"=>["city"=>"上饶市","id"=>"10"],
                            "11"=>["city"=>"抚州市","id"=>"11"],
                        ],   
                  ),  
                  "15" =>   
                  array (  
                    'province_name' => '山东省',  
                    "id"=>'15',
                    'city' => ["01"=>["city"=>"济南市","id"=>"01"],
                            "02"=>["city"=>"青岛市","id"=>"02"],
                            "03"=>["city"=>"淄博市","id"=>"03"],
                            "04"=>["city"=>"枣庄市","id"=>"04"],
                            "05"=>["city"=>"东营市","id"=>"05"],
                            "06"=>["city"=>"烟台市","id"=>"06"],
                            "07"=>["city"=>"潍坊市","id"=>"07"],
                            "08"=>["city"=>"济宁市","id"=>"08"],
                            "09"=>["city"=>"泰安市","id"=>"09"],
                            "10"=>["city"=>"威海市","id"=>"10"],
                            "11"=>["city"=>"日照市","id"=>"11"],
                            "12"=>["city"=>"莱芜市","id"=>"12"],
                            "13"=>["city"=>"临沂市","id"=>"13"],
                            "14"=>["city"=>"德州市","id"=>"14"],
                            "15"=>["city"=>"聊城市","id"=>"15"],
                            "16"=>["city"=>"滨州市","id"=>"16"],
                            "17"=>["city"=>"荷泽市","id"=>"17"],
                        ],
                  ),  
                  "16" =>   
                  array (  
                    'province_name' => '河南省',  
                    "id"=>'16',
                    'city' =>  ["01"=>["city"=>"郑州市","id"=>"01"],
                            "02"=>["city"=>"开封市","id"=>"02"],
                            "03"=>["city"=>"洛阳市","id"=>"03"],
                            "04"=>["city"=>"平顶山市","id"=>"04"],
                            "05"=>["city"=>"安阳市","id"=>"05"],
                            "06"=>["city"=>"鹤壁市","id"=>"06"],
                            "07"=>["city"=>"新乡市","id"=>"07"],
                            "08"=>["city"=>"焦作市","id"=>"08"],
                            "09"=>["city"=>"濮阳市","id"=>"09"],
                            "10"=>["city"=>"许昌市","id"=>"10"],
                            "11"=>["city"=>"漯河市","id"=>"11"],
                            "12"=>["city"=>"三门峡市","id"=>"12"],
                            "13"=>["city"=>"南阳市","id"=>"13"],
                            "14"=>["city"=>"商丘市","id"=>"14"],
                            "15"=>["city"=>"信阳市","id"=>"15"],
                            "16"=>["city"=>"周口市","id"=>"16"],
                            "17"=>["city"=>"驻马店市","id"=>"17"],
                        ],  
                  ),  
                  "17" =>   
                  array (  
                    'province_name' => '湖北省',  
                    "id"=>'17',
                    'city' =>["01"=>["city"=>"武汉市","id"=>"01"],
                            "02"=>["city"=>"黄石市","id"=>"02"],
                            "03"=>["city"=>"十堰市","id"=>"03"],
                            "04"=>["city"=>"宜昌市","id"=>"04"],
                            "05"=>["city"=>"襄樊市","id"=>"05"],
                            "06"=>["city"=>"鄂州市","id"=>"06"],
                            "07"=>["city"=>"荆门市","id"=>"07"],
                            "08"=>["city"=>"孝感市","id"=>"08"],
                            "09"=>["city"=>"荆州市","id"=>"09"],
                            "10"=>["city"=>"黄冈市","id"=>"10"],
                            "11"=>["city"=>"咸宁市","id"=>"11"],
                            "12"=>["city"=>"随州市","id"=>"12"],
                            "13"=>["city"=>"恩施土家族苗族自治州","id"=>"13"],
                            "14"=>["city"=>"省直辖行政单位","id"=>"14"],
                        ], 
                  ),  
                  "18" =>   
                  array (  
                    'province_name' => '湖南省', 
                    "id"=>'18', 
                    'city' =>["01"=>["city"=>"长沙市","id"=>"01"],
                            "02"=>["city"=>"株洲市","id"=>"02"],
                            "03"=>["city"=>"湘潭市","id"=>"03"],
                            "04"=>["city"=>"衡阳市","id"=>"04"],
                            "05"=>["city"=>"邵阳市","id"=>"05"],
                            "06"=>["city"=>"岳阳市","id"=>"06"],
                            "07"=>["city"=>"常德市","id"=>"07"],
                            "08"=>["city"=>"张家界市","id"=>"08"],
                            "09"=>["city"=>"益阳市","id"=>"09"],
                            "10"=>["city"=>"郴州市","id"=>"10"],
                            "11"=>["city"=>"永州市","id"=>"11"],
                            "12"=>["city"=>"怀化市","id"=>"12"],
                            "13"=>["city"=>"娄底市","id"=>"13"],
                            "14"=>["city"=>"湘西土家族苗族自治州","id"=>"14"],
                        ], 
                  ),  
                  "19" =>   
                  array (  
                    'province_name' => '广东省',
                    "id"=>'19',  
                    'city' =>["01"=>["city"=>"广州市","id"=>"01"],
                            "02"=>["city"=>"韶关市","id"=>"02"],
                            "03"=>["city"=>"深圳市","id"=>"03"],
                            "04"=>["city"=>"珠海市","id"=>"04"],
                            "05"=>["city"=>"汕头市","id"=>"05"],
                            "06"=>["city"=>"佛山市","id"=>"06"],
                            "07"=>["city"=>"江门市","id"=>"07"],
                            "08"=>["city"=>"湛江市","id"=>"08"],
                            "09"=>["city"=>"茂名市","id"=>"09"],
                            "10"=>["city"=>"肇庆市","id"=>"10"],
                            "11"=>["city"=>"惠州市","id"=>"11"],
                            "12"=>["city"=>"梅州市","id"=>"12"],
                            "13"=>["city"=>"汕尾市","id"=>"13"],
                            "14"=>["city"=>"河源市","id"=>"14"],
                            "15"=>["city"=>"阳江市","id"=>"15"],
                            "16"=>["city"=>"清远市","id"=>"16"],
                            "17"=>["city"=>"东莞市","id"=>"17"],
                            "18"=>["city"=>"中山市","id"=>"18"],
                            "19"=>["city"=>"潮州市","id"=>"19"],
                            "20"=>["city"=>"揭阳市","id"=>"20"],
                            "21"=>["city"=>"云浮市","id"=>"21"],
                        ],  
                  ),  
                  "20" =>   
                  array (  
                    'province_name' => '广西壮族自治区', 
                    "id"=>'20',   
                    'city' =>["01"=>["city"=>"南宁市","id"=>"01"],
                            "02"=>["city"=>"柳州市","id"=>"02"],
                            "03"=>["city"=>"桂林市","id"=>"03"],
                            "04"=>["city"=>"梧州市","id"=>"04"],
                            "05"=>["city"=>"北海市","id"=>"05"],
                            "06"=>["city"=>"防城港市","id"=>"06"],
                            "07"=>["city"=>"钦州市","id"=>"07"],
                            "08"=>["city"=>"贵港市","id"=>"08"],
                            "09"=>["city"=>"玉林市","id"=>"09"],
                            "10"=>["city"=>"百色市","id"=>"10"],
                            "11"=>["city"=>"贺州市","id"=>"11"],
                            "12"=>["city"=>"河池市","id"=>"12"],
                            "13"=>["city"=>"来宾市","id"=>"13"],
                            "14"=>["city"=>"崇左市","id"=>"14"],
                        ],    
                  ),  
                  "21" =>   
                  array (  
                    'province_name' => '海南省',  
                    "id"=>'21',  
                    'city' => ["01"=>["city"=>"海口市","id"=>"01"],
                            "02"=>["city"=>"三亚市","id"=>"02"],
                            "03"=>["city"=>"省直辖县级行政单位","id"=>"03"],
                        ], 
                  ),  
                  "22" =>   
                  array (  
                    'province_name' => '重庆市',  
                    "id"=>'22',  
                    'city' => [],  
                  ),  
                  "23" =>   
                  array (  
                    'province_name' => '四川省', 
                    "id"=>'23',  
                    'city' => ["01"=>["city"=>"成都市","id"=>"01"],
                            "02"=>["city"=>"自贡市","id"=>"02"],
                            "03"=>["city"=>"攀枝花市","id"=>"03"],
                            "04"=>["city"=>"泸州市","id"=>"04"],
                            "05"=>["city"=>"德阳市","id"=>"05"],
                            "06"=>["city"=>"绵阳市","id"=>"06"],
                            "07"=>["city"=>"广元市","id"=>"07"],
                            "08"=>["city"=>"遂宁市","id"=>"08"],
                            "09"=>["city"=>"内江市","id"=>"09"],
                            "10"=>["city"=>"乐山市","id"=>"10"],
                            "11"=>["city"=>"南充市","id"=>"11"],
                            "12"=>["city"=>"眉山市","id"=>"12"],
                            "13"=>["city"=>"宜宾市","id"=>"13"],
                            "14"=>["city"=>"广安市","id"=>"14"],
                            "15"=>["city"=>"达州市","id"=>"15"],
                            "16"=>["city"=>"雅安市","id"=>"16"],
                            "17"=>["city"=>"巴中市","id"=>"17"],
                            "18"=>["city"=>"资阳市","id"=>"18"],
                            "19"=>["city"=>"阿坝藏族羌族自治州","id"=>"19"],
                            "20"=>["city"=>"甘孜藏族自治州","id"=>"20"],
                            "21"=>["city"=>"凉山彝族自治州","id"=>"21"],
                        ],     
                  ),  
                  "24" =>   
                  array (  
                    'province_name' => '贵州省',  
                    "id"=>'24',
                    'city' => ["01"=>["city"=>"贵阳市","id"=>"01"],
                            "02"=>["city"=>"六盘水市","id"=>"02"],
                            "03"=>["city"=>"遵义市","id"=>"03"],
                            "04"=>["city"=>"安顺市","id"=>"04"],
                            "05"=>["city"=>"铜仁地区","id"=>"05"],
                            "06"=>["city"=>"黔西南布依族苗族自治州","id"=>"06"],
                            "07"=>["city"=>"毕节地区","id"=>"07"],
                            "08"=>["city"=>"黔东南苗族侗族自治州","id"=>"08"],
                            "09"=>["city"=>"黔南布依族苗族自治州","id"=>"09"],
                        ],    
                  ),  
                  "25" =>   
                  array (  
                    'province_name' => '云南省',  
                    "id"=>'25',
                    'city' => ["01"=>["city"=>"昆明市","id"=>"01"],
                            "02"=>["city"=>"曲靖市","id"=>"02"],
                            "03"=>["city"=>"玉溪市","id"=>"03"],
                            "04"=>["city"=>"保山市","id"=>"04"],
                            "05"=>["city"=>"昭通市","id"=>"05"],
                            "06"=>["city"=>"丽江市","id"=>"06"],
                            "07"=>["city"=>"思茅市","id"=>"07"],
                            "08"=>["city"=>"临沧市","id"=>"08"],
                            "09"=>["city"=>"楚雄彝族自治州","id"=>"09"],
                            "10"=>["city"=>"红河哈尼族彝族自治州","id"=>"10"],
                            "11"=>["city"=>"文山壮族苗族自治州","id"=>"11"],
                            "12"=>["city"=>"西双版纳傣族自治州","id"=>"12"],
                            "13"=>["city"=>"大理白族自治州","id"=>"13"],
                            "14"=>["city"=>"德宏傣族景颇族自治州","id"=>"14"],
                            "15"=>["city"=>"怒江傈僳族自治州","id"=>"15"],
                            "16"=>["city"=>"迪庆藏族自治州","id"=>"16"],
                        ], 
                  ),  
                  "26" =>   
                  array (  
                    'province_name' => '西藏自治区', 
                    "id"=>'26', 
                    'city' =>  ["01"=>["city"=>"拉萨市","id"=>"01"],
                            "02"=>["city"=>"昌都地区","id"=>"02"],
                            "03"=>["city"=>"山南地区","id"=>"03"],
                            "04"=>["city"=>"日喀则地区","id"=>"04"],
                            "05"=>["city"=>"那曲地区","id"=>"05"],
                            "06"=>["city"=>"阿里地区","id"=>"06"],
                            "07"=>["city"=>"林芝地区","id"=>"07"],
                        ], 
                  ),  
                  "27" =>   
                  array (  
                    'province_name' => '陕西省',  
                    "id"=>'27', 
                    'city' =>  ["01"=>["city"=>"西安市","id"=>"01"],
                            "02"=>["city"=>"铜川市","id"=>"02"],
                            "03"=>["city"=>"宝鸡市","id"=>"03"],
                            "04"=>["city"=>"咸阳市","id"=>"04"],
                            "05"=>["city"=>"渭南市","id"=>"05"],
                            "06"=>["city"=>"延安市","id"=>"06"],
                            "07"=>["city"=>"汉中市","id"=>"07"],
                            "08"=>["city"=>"榆林市","id"=>"08"],
                            "09"=>["city"=>"安康市","id"=>"09"],
                            "10"=>["city"=>"商洛市","id"=>"10"],
                        ], 
                  ),  
                  "28" =>   
                  array (  
                    'province_name' => '甘肃省',  
                    "id"=>'28',
                    'city' => ["01"=>["city"=>"兰州市","id"=>"01"],
                            "02"=>["city"=>"嘉峪关市","id"=>"02"],
                            "03"=>["city"=>"金昌市","id"=>"03"],
                            "04"=>["city"=>"白银市","id"=>"04"],
                            "05"=>["city"=>"天水市","id"=>"05"],
                            "06"=>["city"=>"武威市","id"=>"06"],
                            "07"=>["city"=>"张掖市","id"=>"07"],
                            "08"=>["city"=>"平凉市","id"=>"08"],
                            "09"=>["city"=>"酒泉市","id"=>"09"],
                            "10"=>["city"=>"庆阳市","id"=>"10"],
                            "11"=>["city"=>"定西市","id"=>"11"],
                            "12"=>["city"=>"陇南市","id"=>"12"],
                            "13"=>["city"=>"临夏回族自治州","id"=>"13"],
                            "14"=>["city"=>"甘南藏族自治州","id"=>"14"],
                        ],      
                  ),  
                  "29" =>   
                  array (  
                    'province_name' => '青海省',  
                    "id"=>'29',
                    'city' =>["01"=>["city"=>"西宁市","id"=>"01"],
                            "02"=>["city"=>"海东地区","id"=>"02"],
                            "03"=>["city"=>"海北藏族自治州","id"=>"03"],
                            "04"=>["city"=>"黄南藏族自治州","id"=>"04"],
                            "05"=>["city"=>"海南藏族自治州","id"=>"05"],
                            "06"=>["city"=>"果洛藏族自治州","id"=>"06"],
                            "07"=>["city"=>"玉树藏族自治州","id"=>"07"],
                            "08"=>["city"=>"海西蒙古族藏族自治州","id"=>"08"],
                        ],   
                  ),  
                  "30" =>   
                  array (  
                    'province_name' => '宁夏回族自治区',
                    "id"=>'30',  
                    'city' => ["01"=>["city"=>"银川市","id"=>"01"],
                            "02"=>["city"=>"石嘴山市","id"=>"02"],
                            "03"=>["city"=>"吴忠市","id"=>"03"],
                            "04"=>["city"=>"固原市","id"=>"04"],
                            "05"=>["city"=>"中卫市","id"=>"05"],
                        ],    
                  ),  
                  "31" =>   
                  array (  
                    'province_name' => '新疆维吾尔自治区',  
                    "id"=>'31',  
                    'city' =>["01"=>["city"=>"乌鲁木齐市","id"=>"01"],
                            "02"=>["city"=>"克拉玛依市","id"=>"02"],
                            "03"=>["city"=>"吐鲁番地区","id"=>"03"],
                            "04"=>["city"=>"哈密地区","id"=>"04"],
                            "05"=>["city"=>"昌吉回族自治州","id"=>"05"],
                            "06"=>["city"=>"博尔塔拉蒙古自治州","id"=>"06"],
                            "07"=>["city"=>"巴音郭楞蒙古自治州","id"=>"07"],
                            "08"=>["city"=>"阿克苏地区","id"=>"08"],
                            "09"=>["city"=>"克孜勒苏柯尔克孜自治州","id"=>"09"],
                            "10"=>["city"=>"喀什地区","id"=>"10"],
                            "11"=>["city"=>"和田地区","id"=>"11"],
                            "12"=>["city"=>"伊犁哈萨克自治州","id"=>"12"],
                            "13"=>["city"=>"阿勒泰地区","id"=>"13"],
                            "14"=>["city"=>"阿克苏地区","id"=>"14"],
                            "15"=>["city"=>"省直辖行政单位","id"=>"15"],
                        ],  
                  ),  
                  "32" =>   
                  array (  
                    'province_name' => '台湾省',  
                    "id"=>'32',
                    'city' =>["01"=>["city"=>"台湾省","id"=>"01"],
                        ],  
                  ),  
                  "33" =>   
                  array (  
                    'province_name' => '香港特别行政区', 
                    "id"=>'33', 
                    'city' =>["01"=>["city"=>"香港特别行政区","id"=>"01"],
                        ], 
                  ),  
                  "34" =>   
                  array (  
                    'province_name' => '澳门特别行政区', 
                    "id"=>'34', 
                    'city' =>["01"=>["city"=>"澳门特别行政区","id"=>"01"],
                        ],  
                  ),  
                );  
        $this->ajaxReturn(json_encode($city));
	}
}