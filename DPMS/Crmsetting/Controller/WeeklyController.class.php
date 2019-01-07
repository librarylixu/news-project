<?php
/*
        李旭
     2018/09/26
       周报月报
*/
namespace Crmsetting\Controller;
use Crmuser\Controller\CommonController;
class WeeklyController extends CommonController {   
    public  $model;//Mongodb数据库对象
    public $appid = 49;//页面固定ID
    function __construct(){  
        parent::__construct();
        $this->customermodel = new \Model\mCustomerlogModel();
        $this->projectmodel = new \Model\mProjectlogModel();
        $this->recordmodel = new \Model\mRecordlogModel();
        $this->businesslogmodel = new \Model\mBusinesslogModel();
    }
    function  __destruct(){    
        unset($this->model);
    }
     //空控制器操作
    public function _empty(){        
        $this->display(A('Home/Html')->error404());
    }
    //展示页面
    public function index(){        
        $this->assign("mainController","crmweeklyController");
        $this->display('Crmsetting@Weekly:index-angular');
    }
    /*
        根据用户id及时间段查询工作报表（周报，月报）
        1、查询出时间段内所有的客户信息（新增customerinfo，跟进workorder）
        2、查询出时间段内所有的项目信息（新增projectmain）
        3、查询出时间段内所有的出差信息（新增business）
        返回数据格式：
        $source = array();
        $source['customerlog'] = $customerResult;
        $source['workorderlog'] = $projectResult;
        $source['projectlog'] = $projectResult;
        $source['businesslog'] = $businesslogResult;

        yxj 2018-09-26 10:31:25
    */
    public function asyncGetWorkReportByUserid(){
        if(!IS_POST){
            echo "非法提交";
            exit();
        }
        $parms = $_POST;
        //var_dump($parms);
        //exit();
        //$parms['stime'] = strtotime("2018-09-01 00:00:00");
        //$parms['etime'] = strtotime("2019-08-30 23:59:59");
        $where = array();
        if(array_key_exists("stime",$parms) and array_key_exists("etime",$parms)){
            $parms['stime'] = strtotime($parms['stime']." 00:00:00");
            $parms['etime'] = strtotime($parms['etime']." 23:59:59");
            $where['time'] = array('$gte'=>$parms['stime'],'$lte'=>$parms['etime']);

        }else if(array_key_exists("stime",$parms)){
            $parms['stime'] = strtotime($parms['stime']." 00:00:00");
            $where['time'] = array('$gte'=>$parms['stime']);
        }else{
            $this->ajaxReturn("parms error");
            exit();
        }
        if(array_key_exists("userid",$parms)){
            $where['userid'] = intval($parms['userid']);
        }
        $where['type'] = 0;         
        $sort = array('time'=>-1);
        //查询客户新增记录  
        $customerData = $this->customermodel->Customquery($where,$sort);
        $customerResult = array();  
        foreach($customerData as $key=>$value){
            $value['time_str'] = date('Y-m-d H:i:s',$value['time']);
            array_push($customerResult,$value);
        } 
        //查询客户跟进记录
        $workorderData = $this->recordmodel->Customquery($where,$sort);
        $workorderResult = array();
        foreach($workorderData as $key=>$value){
            $value['time_str'] = date('Y-m-d H:i:s',$value['time']);
            //var_dump($value);
            array_push($workorderResult,$value);
        }
        //查询项目新增记录
        $projectData = $this->projectmodel->Customquery($where,$sort);
        $projectResult = array();
        foreach($projectData as $key=>$value){
            $value['time_str'] = date('Y-m-d H:i:s',$value['time']);
            array_push($projectResult,$value);
        }
        //var_dump($parms);
       $parms['tablename'] = "projectmain";
         //查询项目关闭记录
        $closeprojectResult = A('Crmproject/Project')->select_close_data($parms);    

        //查询出差新增记录
        $businesslogData = $this->businesslogmodel->Customquery($where,$sort);
        $businesslogResult = array();
        foreach($businesslogData as $key=>$value){
            $value['time_str'] = date('Y-m-d H:i:s',$value['time']);
            array_push($businesslogResult,$value);
        }
        $source = array();
        $source['customerlog'] = $customerResult;
        $source['workorderlog'] = $workorderResult;
        $source['projectlog'] = $projectResult;
        $source['closeprojectlog'] = $closeprojectResult;
        $source['businesslog'] = $businesslogResult;
        $this->ajaxReturn($source);
    }

    //public function inserttest(){
    //    $data = array();        
    //    $data['userid'] = 1;
    //    $data['username'] = "admin-超级管理员";
    //    $data['type'] = 0;
    //    $data['result'] = 1;
    //    $data['customerid'] = 1;
    //    $data['message'] = "新建 测试";
    //    $count = 0;
    //    for($i=0;$i<=50;$i++){
    //        $count+=10;     
    //        $data['time'] = time()+$count;
    //        $this->businesslogmodel->insert($data);
    //    }
    //}


}