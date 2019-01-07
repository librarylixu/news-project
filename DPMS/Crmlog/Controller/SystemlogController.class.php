<?php
/*
    web操作日志
*/
namespace Crmlog\Controller;
use Crmuser\Controller\CommonController;
class SystemlogController extends CommonController {
    public  $model;//数据库对象
    public $appid = 47;//页面固定ID
    function __construct(){  
        parent::__construct();  
        $this->customermodel=new \Model\mCustomerlogModel();
        $this->projectmodel=new \Model\mProjectlogModel();
        $this->workordermodel=new \Model\mWorkorderlogModel();
        $this->recordmodel=new \Model\mRecordlogModel();
        $this->businessmodel=new \Model\mBusinesslogModel();
    }
    function  __destruct(){     
      unset($this->model);
    }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","日志管理");
		$this->assign("PageName","操作日志");
        $this->assign("mainController","crmSystemlogController");
        $this->assign("appid",$this->appid);
        $this->display('Crmlog@Systemlog:index-angular');
    }
    //打开流程图页面
    public function charts(){
        $this->assign("mainController","crmChartsController");
        $this->display('Crmlog@Systemlog:charts');
    }
    //销售漏斗页面
    public function funnel(){
        $this->assign("mainController","funnelController");
        $this->display("Crmlog@Systemlog:funnel");
    }
    //$cursor 0 非游标，1 游标
    function SelectChartData(){
        $parameter = $_POST;
        //判断传过来的参数中是否含有tablename，。如果没有默认查询客户的
        if(!array_key_exists('tablename',$parameter)){
            $parameter['tablename']='customer';
        }
        $parms = array();
        if (array_key_exists("stime",$parameter) && array_key_exists("etime",$parameter)){            
        	$parms['time'] = array('$gte'=>intval($parameter['stime']),'$lte'=>intval($parameter['etime']));
        }elseif (array_key_exists("stime",$parameter)){
        	$parms['time'] = array('$gte'=>intval($parameter['stime']));
        }elseif(array_key_exists("etime",$parameter)){
            $parms['time'] = array('$gte'=>intval($parameter['etime']));
        }else{           
            //不传时间段，则查询当月信息
            $time = time();
            $month = date('m',$time);       
            $year = date('Y',$time);      
            $days = cal_days_in_month(CAL_GREGORIAN, $month, $year);    
            $stime = $year.'-'.$month.'-01 00:00:00';
            $etime = $year.'-'.$month.'-'.$days.' 23:59:59';  
            $parms['time'] = array('$gte'=>strtotime($stime),'$lte'=>strtotime($etime));
        }
        if(!array_key_exists('type',$parameter)){
            $parms['type'] = 0;
        }
        
        /*
        db.getCollection('customerlog').aggregate([
            {'$match':{'time':{'$gte':1533094975,'$lte':1533175414}}},
            {'$group':{'_id':"$userid",'count':{'$sum':1}}}
        ])
        */
        $match = array();
        $match['$match'] = $parms;
        $group = array();
        $group['$group'] = array('_id'=>'$userid','count'=>array('$sum'=>1));
        $where = array($match,$group);     
        if($parameter['tablename'] == 'customer'){
            $chartdata = $this->customermodel->aggregate($where);
        }else if($parameter['tablename'] == 'project'){
            $chartdata = $this->projectmodel->aggregate($where);
        }else if($parameter['tablename'] == 'workorder'){
            $chartdata = $this->workordermodel->aggregate($where);
        }else if($parameter['tablename'] == 'record'){
            $chartdata = $this->recordmodel->aggregate($where);
        }else if($parameter['tablename'] == 'business'){
            $chartdata = $this->businessmodel->aggregate($where);
        }else{
            return false;
        }
        //var_dump($chartdata);  
        $resultdata = array();
        if(is_array($chartdata) && !empty($chartdata['ok'])){
            $result = $chartdata['result'];
             foreach($result as $key=>$value){
                $resultdata[$value['_id']] = $value['count'];
            }
        }
        $this->ajaxReturn($resultdata);
    }




    /*异步查询数据*/
     /*
    前台传过来的数据
        1.无 stime 无 etime
        2.有 stime 无 etime
        3.有 stime 有 etime
        4.无 stime 有 etime
    */
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        if($parameter['selecttype'] == 'project'){
            //项目数据源
            A('Crmlog/Projectlog')->select_page_data($parameter);
        }else if($parameter['selecttype'] == 'workorder'){
            //工单数据源
            A('Crmlog/Workorderlog')->select_page_data($parameter);
        }else{
            //这里规定默认查询客户的数据
            //客户数据源
            A('Crmlog/Customerlog')->select_page_data($parameter);
        }
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        //如果是根据时间清除日志，则检测
        if(array_key_exists('sTime',$parameter) && array_key_exists('eTime',$parameter)){
            $parameter['sTime'] = date("Y-m-d",$parameter['sTime']);
            $parameter['eTime'] = date("Y-m-d",$parameter['eTime']);
            $stt=strtotime($parameter['sTime']." 00:00:00");
            $ett=strtotime($parameter['eTime']." 23:59:59");   
            $where['time'] = array('$gte'=>intval($parameter['sTime']),'$lte'=>intval($parameter['eTime']));
        }
        $data=$this->MDelete($where);

        $this->ajaxReturn($data);
    }



    /*
        2018年10月11日 14:25:29 by yxj
        系统行为操作柱状图 图表数据导出
        用户总数数据
        参数：
        
    */
    public function ExportTotalChartData(){
        if(!IS_GET and empty($_GET)){
            echo "非法提交";
            exit();
        }
        $parms = json_decode($_GET['iden'],true);
        
        //'customer': arr[0],'project': arr[1],'workorder': arr[2],'record': arr[3],'business': arr[4],
        $customerData = array();
        $projectData = array();
        $workorderData = array();
        $recordData = array();
        $businessData = array();
        $userData = array();
        $userData = A('Crmuser/RefuserRefutype')->getUsersByUTypes("6,7",true);
        $keysData = array("姓名");
        $where = array();
        $where['$findinset'] = true;
        $where['userid'] = array(implode(",",array_keys($userData)));
        $where['$group'] = "userid";
        $where['$field'] = array("userid");
        $where['$jsonstr'] = "userid";
        //if(array_key_exists('stime',$parms) and array_key_exists('etime',$parms)){
        //    $where['$time'] = array('createtime'=>array('between',array(strtotime($parms['stime']),strtotime($parms['etime']))));
        //}  
        //$where['$time'] = array('strattime'=>array('EGT',strtotime($parms['stime'])),'endtime'=>array('ELT',strtotime($parms['etime'])))    
        if($parms['customer']){
            //SELECT `userid`,count(userid) FROM `xc_customerinfo` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") ) AND `createtime` BETWEEN 1518323200 AND 1539359999 GROUP BY userid
            array_push($keysData,"客户");
            $customerData = A('Crmcustomerinfo/Customerinfo')->MCalculation($where);
        }
        if($parms['project']){
            array_push($keysData,"项目");
            $projectData = A('Crmproject/Project')->MCalculation($where);
        }
        if($parms['workorder']){
        //SELECT `userid`,count(userid) FROM `xc_projectmain` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") ) AND `createtime` BETWEEN 1518323200 AND 1539359999 GROUP BY userid
            //SELECT `userid`,count(userid) FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") and FIND_IN_SET(classification,"0,") ) GROUP BY userid
            array_push($keysData,"工单");
            $where["classification"] = "0";
            $workorderData = A('Crmschedule/Workorder')->MCalculation($where);          
        }
        if($parms['record']){
            //SELECT `userid`,count(userid) FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") and FIND_IN_SET(classification,"1,") ) GROUP BY userid
            //SELECT `userid`,count(userid) FROM `xc_workorder` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") and FIND_IN_SET(classification,"1,") ) AND `createtime` BETWEEN 1518323200 AND 1539359999 GROUP BY userid
            array_push($keysData,"跟进记录");
            $where["classification"] = "1";
            $recordData = A('Crmschedule/Workorder')->MCalculation($where); 
        }
        if($parms['business']){
            //SELECT `userid`,count(userid) FROM `xc_business` WHERE `del` = 0 AND ( FIND_IN_SET(userid,"2,4,5,6,7,9,10,11,18,22,31,32,34,35,37,38,39,40,41,42,43,") ) AND `createtime` BETWEEN 1518323200 AND 1539359999 GROUP BY userid 
            array_push($keysData,"出差");
            $businessData = A('Crmschedule/Business')->MCalculation($where);   
        }
        //循环用户数据，组建用于到处的数据源
        $importData = array("key"=>$keysData,"value"=>array());
        foreach($userData as $key=>$value){             
            $vdata = array($value['description']);             
            if($parms['customer']){
                $customerDataCount = empty($customerData[$key]) ? "0" : $customerData[$key] ;
                array_push($vdata,$customerDataCount);
            } 
            if($parms['project']){
                $projectDataCount = empty($projectData[$key]) ? "0" : $projectData[$key] ;
                array_push($vdata,$projectDataCount);
            }
            if($parms['workorder']){
                $workorderDataCount = empty($workorderData[$key]) ? "0" : $workorderData[$key] ;
                array_push($vdata,$workorderDataCount);
            }
            if($parms['record']){
                $recordDataCount = empty($recordData[$key]) ? "0" : $recordData[$key] ;
                array_push($vdata,$recordDataCount);
            }
            if($parms['business']){
                 $businessDataCount = empty($businessData[$key]) ? "0" : $businessData[$key] ;
                 array_push($vdata,$businessDataCount);
            }      
            array_push($importData['value'],$vdata);
        } 
        //$data=array(value=>array(),key=>array());
        //$data['key']=array('id','username','password','head_ico','invite','is_seller_invite');
        //$_data=array(1,2,3,4,5,6);
        //array_push($data['value'],$_data);
        //$_data=array(1,2,3,4,5,6);
        //array_push($data['value'],$_data);
        //$_data=array('哈哈','呵呵','呼呼','O(∩_∩)O哈哈~','纳尼','(～ o ～)~zZ');
        //array_push($data['value'],$_data);

        //$filename = C('FILE_DOWN_LOAD_PATH').'test-'.date("YmdHis").".xls";
        //$filepath = F_ExcelExport($filename,$data);
        //F_downloadfile($filepath,'testttt.xls');
        //var_dump($data);       

        $filename = C('FILE_DOWN_LOAD_PATH').'test-'.date("YmdHis").".xls";
        $filepath = F_ExcelExport($filename,$importData);  
        //F_downloadfile($filepath,'CRM用户行为操作统计表_'.date("Y-m").'.xls');
        F_downloadfile($filepath,'CRM用户行为操作统计表_.xls');
    }

  

}