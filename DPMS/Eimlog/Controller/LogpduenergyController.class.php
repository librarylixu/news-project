<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
	PDU能耗日志
	2018年2月28日 10:27:22	闫绪杰
	包括：总电流、总电压、总功率、总电能、功率因素信息
*/
class LogpduenergyController extends CommonController {
    public $model;//数据库对象
	function __construct(){  
		parent::__construct();
	    $this->model=new \Model\mPduEnergyLogModel();
	}
    function  __destruct(){     
        unset($this->model);
    }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());	
    }
    //电源操作日志展示页面
    public function index(){      
        $this->assign("exporttitle","PDU能耗日志");
        $this->assign("exportstitle","PDU能耗日志"); 
		$this->assign("mainController","eimPduEnergyLogController");
		$this->display('Eimlog@Logpduenergy:index-angular');
    }

	//插入数据
	function MInsert($parameter=array()){
		//测试数据
		//$parameter = array();
		//$parameter['dpuid'] = '111';
		//$parameter['time'] = '1519788152';
		//$parameter['currentvalue'] = '0.3';
		//$parameter['voltagevalue'] = '220';
		//$parameter['powervalue'] = '42';
		//$parameter['energyvalue'] = '1.2';
		//$parameter['powerfactorvalue'] = '0.2';
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
            $s=strtotime($parameter['sTime']);
            //开始时间是否合法
            if(time() > $s and $s > 946656000){
               $stt=$s;
            }	
			unset($parameter["sTime"]);
        }
        //有没有传结束时间
        if(array_key_exists("eTime",$parameter)){
            $e=strtotime($parameter['eTime']);
            //结束时间是否合法
            if($e > $stt){
               $ett=$e;
            }
			unset($parameter["eTime"]);
        }
        $parameter["time"]=array('$gte'=>$stt,'$lte'=>$ett);
		//默认以升序排序
		$parameter['$sort']=array('time'=>1);
        $data = parent::MSelect($parameter);				
		//var_dump($data);
        return $data;
    }
	//清空数据
	function MDelete(){
		$data = parent::MDelete(array());
		return $data;
	}


	//页面查询数据
	 /*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
		   $this->ajaxReturn(false);
		   exit;
        }
		$postdata = $_POST;
		if(!empty($postdata['stime'])){
            $stime = date('Y-m-d',$postdata['stime']);
			$postdata['stime'] = strtotime($stime.' 00:00:00');
		}else{
			$postdata['stime'] = strtotime(date('Y-m-d',time()).' 00:00:00');
		}
		if(!empty($postdata['etime'])){
            $etime = date('Y-m-d',$postdata['etime']);
			$postdata['etime'] = strtotime($etime.' 23:59:59');
		}else{
			$postdata['etime'] = strtotime(date('Y-m-d',time()).' 23:59:59');
		}
		$data = $this->get_chart_data($postdata);
		$this->ajaxReturn($data);
    }
	//组建chart数据
	public function get_chart_data($parameter){	
		$timeData = array();
		$legend_data = array('电流(A)','电压(V)', '电能(kWh)', '功率(W)', '功率因数');
		$where = array('$match'=>array(),'$group'=>array());
		if(!empty($parameter['dpuid'])){
		    $where['$match']['dpuid'] = $parameter['dpuid'];
		}
		$where['$match']['time'] = array('$gte'=>$parameter['stime'],'$lte'=>$parameter['etime']);
		$where['$group']['_id'] = array('timenode'=>'$timenode');
		$where['$group']['currentavg'] = array('$avg'=>'$currentvalue');
		$where['$group']['voltageavg'] = array('$avg'=>'$voltagevalue');
		$where['$group']['energyavg'] = array('$avg'=>'$energyvalue');
		$where['$group']['poweravg'] = array('$avg'=>'$powervalue');
		$where['$group']['powerfactorvalueavg'] = array('$avg'=>'$powerfactorvalue');
		$data = parent::Maggregate($where);
        return $data;
        //$currentarr = array();
        //$voltagearr = array();
        //$energyarr = array();
        //$powerarr = array();
        //$powerfactorarr = array();
        //foreach($data as $v){
        //    $timed = strtotime('20'.$v['_id']['timenode'].'00');
        //    array_push($timeData,date('y/m/d H:i',$timed));
        //    array_push($currentarr, round($v['currentavg'],2));
        //    array_push($voltagearr, round($v['voltageavg'],2));
        //    array_push($energyarr, round($v['energyavg'],2));
        //    array_push($powerarr, round($v['poweravg'],2));
        //    array_push($powerfactorarr, round($v['powerfactorvalueavg'],2));
        //}
        //$returndata = array();
        //$returndata['currentlist'] = $currentarr;
        //$returndata['voltagelist'] = $voltagearr;
        //$returndata['energylist'] = $energyarr;
        //$returndata['powerlist'] = $powerarr;
        //$returndata['powerfactorlist'] = $powerfactorarr;
        //$returndata['legend_data'] = $legend_data;
        //$returndata['series_name'] = array('current'=>'电流(A)','voltage'=>'电压(V)','energy'=>'电能(kWh)','power'=>'功率(W)','powerfactor'=>'功率因数');
        //$returndata['timeData'] = $timeData;
        //return $returndata;
	}

	function test(){
		$where = array();
		$where['dpuid'] = "2";
		$where['stime'] = strtotime('2018-03-07 00:00:00');
		$where['etime'] = strtotime('2018-03-07 23:59:59');
		$result = $this->get_chart_data($where);
		var_dump($result);
		return;
		$where = array();
		$where['dpuid'] = "2";
		$where['time'] = array('$gte'=>1520438400,'$lte'=>1520611199);
		$where['$group'] = array();
		$where['$group']['_id'] = '$timenode';
		$where['$group']['currentavg'] = array('$avg'=>'$currentvalue');
		$where['$group']['voltageavg'] = array('$avg'=>'$voltagevalue');
		$where['$group']['energyavg'] = array('$avg'=>'$energyvalue');
		$where['$group']['poweravg'] = array('$avg'=>'$powervalue');
		$where['$group']['powerfactorvalueavg'] = array('$avg'=>'$powerfactorvalue');
		$data = parent::Maggregate($where);
		var_dump($data);
		return $data;

		$result = $this->model->updatetimenode();
		var_dump($result);
		return;
		
		$data=$this->MSelect(array('dpuid'=>'2','$cursor'=>true));
		$result = $this->get_chart_data($data);
		var_dump($result);
	}

}