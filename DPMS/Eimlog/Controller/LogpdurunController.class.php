<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
    DPU运行日志
	2018年2月28日 10:27:22	闫绪杰

*/
class LogpdurunController extends CommonController {
   public $model;//数据库对象
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mPduRunLogModel();
   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //DPU设备运行日志
    public function index(){
        $this->assign("exporttitle","DPU设备运行报表");
        $this->assign("exportstitle","DPU设备运行日志");
        $this->assign("MenuName","日志管理");
		$this->assign("PageName","DPU设备运行日志");
		$this->display('Eimlog@Logpdurun:index');
    }   
	//插入数据
	function MInsert($parameter=array()){
		$parameter = array();
		$parameter['dpuid'] = '111';
		$parameter['time'] = '1519788152';
		$parameter['text'] = '启动程序';
		$result=parent::MInsert($parameter);
		//var_dump($result);
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
        if(array_key_exists("sTime",$parameter)){
            $s=strtotime($parameter['sTime']." 00:00:00");
            //开始时间是否合法
            if(time()<$s&&$s > 946656000){
               $stt=$s;
            }
        }
        //有没有传结束时间
        if(array_key_exists("eTime",$parameter)){
            $e=strtotime($parameter['eTime']." 23:59:59");         
            //结束时间是否合法
            if($e > $stt){
               $ett=$e;
            }
        }
        $parameter["Time"]=array('$gte'=>$stt,'$lte'=>$ett);
        $data = parent::Mselect($parameter);
        return $data;
    }
}