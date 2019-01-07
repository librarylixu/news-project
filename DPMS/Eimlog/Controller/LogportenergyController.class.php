<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
    PDU端口能耗日志
	2018年2月28日 10:27:22	闫绪杰
	包括：端口电流、端口电能、端口功率
 */
class LogportenergyController extends CommonController {
    public $model;//数据库对象
    function __construct(){  
		parent::__construct();
        $this->model=new \Model\mPduPortEnergyLogModel();
    }
    function  __destruct(){     
        unset($this->model);
    }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }

    //传感器日志展示页面
    public function index(){
        $this->assign("exporttitle","PDU端口能耗日志");
        $this->assign("exportstitle","PDU端口能耗日志");
        $this->assign("MenuName","日志管理");
		$this->assign("PageName","PDU端口能耗日志");
		$this->assign("mainController","eimPortEnergyLogController");
		$this->display('Eimlog@Logportenergy:index-angular');
    }
	//插入数据
	function MInsert($parameter=array()){
		//$parameter = array();
		//$parameter['dpuid'] = '111';
		//$parameter['time'] = '1519788152';
		//$parameter['portnum'] = '1';
		//$parameter['currentvalue'] = '0.3';
		//$parameter['voltagevalue'] = '220';
		//$parameter['powervalue'] = '42';
		//$parameter['energyvalue'] = '1.2';
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
    function select_page_datapost(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        $stt=strtotime(date('Y-m-d')." 00:00:00");
        $ett=strtotime(date('Y-m-d')." 23:59:59");
		//有没有传开始时间
        if(array_key_exists("stime",$parameter)){
            $s = intval($parameter['stime']);
            //开始时间是否合法
            if(time() > $s and $s > 946656000){
               $stt=$s;       
            }
        }
        //有没有传结束时间
        if(array_key_exists("etime",$parameter)){       
            $e = intval($parameter['etime']);
            //结束时间是否合法
            if(time() > $e ){
               $ett=$e;
            }
        }
        $parameter["time"]=array('$gte'=>$stt,'$lte'=>$ett);
		if(!empty($parameter["portnum"])){
			$parameter["portnum"] = intval($parameter["portnum"]);
		}
        $parameter['$cursor'] = true;//查询游标
        
        $data = parent::MSelect($parameter);
        $limit=intval($parameter['pageCount']);//每页显示多少条
        $pagenow=intval($parameter['thisPageCount']?$parameter['thisPageCount']:1)-1;//当前第几页
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
	//清空数据
	function MDelete(){
		$data = parent::MDelete(array());
		return $data;
	}
	function select_page_data(){
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		if(!empty($postdata['stime'])){
			$postdata['stime'] = strtotime($postdata['stime'].' 00:00:00');
		}else{
			$postdata['stime'] = strtotime(date('Y-m-d',time()).' 00:00:00');
		}
		if(!empty($postdata['etime'])){
			$postdata['etime'] = strtotime($postdata['etime'].' 23:59:59');
		}else{
			$postdata['etime'] = strtotime(date('Y-m-d',time()).' 23:59:59');
		}
        $data=$this->get_chart_data($postdata);
        $this->ajaxReturn($data);
	}

	function get_chart_data($parameter){
		$where = array('$match'=>array(),'$group'=>array());
		$series_name = array('current'=>'电流(A)','energy'=>'电能(kWh)');
		if(!empty($parameter['dpuid'])){
		    $where['$match']['dpuid'] = $parameter['dpuid'];
		}
		if(!empty($parameter['portnum'])){
		    $where['$match']['portnum'] = intval($parameter['portnum']);			
			$series_name['current']  = '端口'.$parameter['portnum'].'电流(A)';
			$series_name['energy']  = '端口'.$parameter['portnum'].'电能(kWh)';
		}
		$where['$match']['time'] = array('$gte'=>$parameter['stime'],'$lte'=>$parameter['etime']);
		$where['$group']['_id'] = '$timenode';
        $where['$group']['portnumavg'] = array('$avg'=>'$portnum');
        //$where['$group']['dpuidavg'] ='$dpuid';
		$where['$group']['currentavg'] = array('$avg'=>'$currentvalue');
		$where['$group']['energyavg'] = array('$avg'=>'$energyvalue');
		$data = parent::MSelect($where);
        //$currentarr = array();
        //$energyarr = array();
        //$timeData = array();
		
        //foreach($data as $v){
        //    $timed = strtotime('20'.$v['_id'].'00');
        //    array_push($timeData,date('y/m/d H:i',$timed));
        //    array_push($currentarr, round($v['currentavg'],2));
        //    array_push($energyarr, round($v['energyavg'],2));
        //}
        //$returndata = array();
        //$returndata['currentlist'] = $currentarr;
        //$returndata['energylist'] = $energyarr;
        //$returndata['series_name'] = $series_name;
        //$returndata['timeData'] = $timeData;
		return $data;
	}

	public function test(){
		//添加timenode
		$result = $this->model->updatetimenode();
		return;


		$where = array();
		$where['dpuid'] = '2';
		$where['portnum'] = '8';
		$where['stime'] = strtotime('2018-03-08 00:00:00');
		$where['etime'] = strtotime('2018-03-08 23:59:59');	
		var_dump($where);	
		$result = $this->get_chart_data($where);
		var_dump($result);
		return;
	}
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        //如果是根据时间清除日志，则检测
        if(array_key_exists('stime',$parameter) && array_key_exists('etime',$parameter)){
            $where['time'] = array(array('EGT',$parameter['stime']),array('ELT',$parameter['etime']));
        }
        //var_dump($where);exit();
        $data=$this->MDelete($where);
        $this->ajaxReturn($data);
    }
      

}