<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
	pdu电源操作日志
	2018年2月28日 10:27:22	闫绪杰

*/
class LogportactionController extends CommonController {
    public $model;//数据库对象
    function __construct(){  
		parent::__construct();
        $this->model=new \Model\mPduPortActionLogModel();
    }
    function  __destruct(){     
        unset($this->model);
    }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //系统运行日志页面
    public function index(){  
        $this->assign("MenuName","日志管理");
		$this->assign("PageName","PDU端口操作日志"); 
        $this->assign("exporttitle","PDU端口操作日志");
        $this->assign("exportstitle","PDU端口操作日志");
		$this->assign("mainController","eimPduPortSystemLogController");
		$this->display('Eimlog@Logportaction:index-angular');
    }
	//
	function add_port_action_log($parameter=array()){
		$log = array();
		$log['dpuid'] = $parameter['dpuid'];
		$log['time'] = time();
		$log['portnum'] = $parameter['portnum'];
		$log['user'] = $_SESSION['userinfo']['username'];
		$log['actionstatus'] = $parameter['actionstatus'];
		$log['result'] = $parameter['result'];
		$result=parent::MInsert($log);
        return $result;
	}

    /*
		查询数据
		$parameter查询参数，这里有两个特殊的key,$findOne\$cursor\$colunms
		$findOne 是否进行一次查询
		$cursor 是否需要返回游标
		$colunms 查询指定的列  array(columnname=>1);
        调用父类，在控制器中规定下类型，并且设定下时间
    */
    function MSelect($parameter=array('$findOne'=>false,'$cursor'=>false,'$colunms'=>array())){
        $stt=strtotime(date('Y-m-d')." 00:00:00");
		$ett=strtotime(date('Y-m-d')." 23:59:59");
		//有没有传开始时间
        if(array_key_exists("stime",$parameter)){
            //开始时间是否合法
            if(time() > $parameter['stime'] and $parameter['stime'] > 946656000){
               $stt=intval($parameter['stime']);       
            }
        }
        //有没有传结束时间
        if(array_key_exists("etime",$parameter)){ 
            //结束时间是否合法
               $ett=intval($parameter['etime']);
        } 
        $parameter["time"]=array('$gte'=>$stt,'$lte'=>$ett);
        $data = parent::Mselect($parameter);
        return $data;
    }
	//清空数据
	function MDelete(){
		$data = parent::MDelete(array());
		return $data;
	}


	
	//
	function select_page_data(){
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;		
		//if(!empty($postdata['stime'])){
		//    $postdata['stime'] = strtotime($postdata['stime']);
		//    if(!empty($postdata['etime'])){
		//        $postdata['etime'] = strtotime($postdata['etime']);	
		//        if ($postdata['stime'] == $postdata['etime']){
					
		//            $postdata['etime'] = strtotime($postdata['etime']);	
		//        }
		//    }else{
				
		//    }
		//    //判断，如果时间中有时分秒，则直接转时间戳，没有时分秒，则开始时间添加00:00:00,结束时间添加23:59:59
		//    if(!empty($postdata['stime']) && !empty($postdata['etime'])){
				
		//    }
		//}
		if(empty($postdata['stime'])){
			$postdata['stime'] = strtotime(date('Y-m-d',time()).' 00:00:00');
		}
		if(empty($postdata['etime'])){
			$postdata['etime'] = strtotime(date('Y-m-d',time()).' 23:59:59');
		}
		if(!empty($postdata['portnum']) && $postdata['portnum'] == 'all'){
			 unset($postdata['portnum']);
		}	
        $postdata['$cursor'] = true;//查询游标
        $data=$this->MSelect($postdata);
        
        $limit=intval($postdata['pageCount']);//每页显示多少条
        $pagenow=intval($postdata['thisPageCount']?$postdata['thisPageCount']:1)-1;//当前第几页
        $pagenow=($pagenow>-1)?$pagenow:0;
        $skip=$limit*$pagenow;//数据库中需要跳过多少条
        $result = array();
        $data = $data->skip($skip)->limit($limit);
        foreach($data as $k=>$v){
            $v['time']=date('Y-m-d H:i:s',$v['time']);
            $result['data'][$k]=$v;
        }     
        $result['count'] = $data->count();
        $this->ajaxReturn($result);
	}

}