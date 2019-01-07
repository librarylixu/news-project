<?php
/*
	EIM2.0日志
	2018年2月28日 10:27:22	闫绪杰
	PDU能耗日志
*/
namespace Model;
class mPduEnergyLogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->pduenergylog_mongo;
      $this->table_colunms=$this->table_colunms_function();
   }
   function  __destruct(){     
      $this->mongo->close(); 
   }
   /*
   获取当前表的字段信息
    */
	function table_colunms_function(){    
		$arr= array(
				_id=>array(value=>'_id',"description"=>"mongo自动生成的id，此值表示唯一索引"),
				dpuid=>array("description"=>"PDUid"),
				time=>array("description"=>"时间戳"),
				currentvalue=>array("description"=>"电流"),
				voltagevalue=>array("description"=>"电压"),
				powervalue=>array("description"=>"功率"),
				energyvalue=>array("description"=>"电能"),
				powerfactorvalue=>array("description"=>"功率因素")				
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }



	//php - mongo 聚合查询
	public function test(){
		$stime=strtotime("2018-03-07 00:00:00");
		$ett=strtotime("2018-03-07 23:59:59");
		$etime = $stime+1800;//30分钟一个节点
		$dpuid = "2";
		$avgarr = array();
		$avgarr['currentavg'] = array();
		$avgarr['voltageavg'] = array();
		$avgarr['energyavg'] = array();
		$avgarr['poweravg'] = array();
		$avgarr['powerfactorvalueavg'] = array();
		$group = array();
		$group['$group'] = array(
		                        '_id'=>'$dpuid',
		                        'currentavg'=>array('$avg'=>'$currentvalue'),
		                        'voltageavg'=>array('$avg'=>'$voltagevalue'),
		                        'energyavg'=>array('$avg'=>'$energyvalue'),
		                        'poweravg'=>array('$avg'=>'$powervalue'),
		                        'powerfactorvalueavg'=>array('$avg'=>'$powerfactorvalue')
		                    );

		//根据时间段聚合查询
		$match = array();		
		while(true){
		    if($stime > $etime && $stime <  $ett){
				break;
		    }
			$match['$match'] = array('dpuid'=>$dpuid,'time'=> array('$gte'=>$stime,'$lte'=>$etime));
			$arr = array($match,$group);
			$result = $this->tb->aggregate($arr);
			if(is_array($result) && !empty($result['ok'])){	
				array_push($avgarr['currentavg'],round($result['result'][0]['currentavg'],2));	
				array_push($avgarr['voltageavg'],round($result['result'][0]['voltageavg'],2));	
				array_push($avgarr['energyavg'],round($result['result'][0]['energyavg'],2));	
				array_push($avgarr['poweravg'],round($result['result'][0]['poweravg'],2));	
				array_push($avgarr['powerfactorvalueavg'],round($result['result'][0]['powerfactorvalueavg'],2));	
			}
			$etime+=1800;
			//如果结束时间大于前台传过来的结束时间
			if ($etime >= $ett){
				$etime = $ett;
			}
		}		
		return $avgarr;


		
		//$match = array();
		//$match['$match'] = array('dpuid'=>'2','time'=> array('$gte'=>1520352005,'$lte'=>1520352067));
		//$group = array();
		//$group['$group'] = array(
		//                        '_id'=>'$dpuid',
		//                        'currentsum'=>array('$avg'=>'$currentvalue'),
		//                        'voltagesum'=>array('$avg'=>'$voltagevalue'),
		//                        'energysum'=>array('$avg'=>'$energyvalue'),
		//                        'powersum'=>array('$avg'=>'$powervalue'),
		//                        'powerfactorvaluesum'=>array('$avg'=>'$powerfactorvalue')
		//                    );
		//$arr = array($match,$group);
		//$result = $this->tb->aggregate($arr);
		//return $result;
	}
	//添加timenode字段，根据该字段查询chart图标X坐标进行图标展示
	public function updatetimenode(){
		$stime = 1519814260;
		$etime = 0;
		while($etime < 1520577202){
			$value = array();
			if(intval(date("i",$stime)) >= 30){
				$value['timenode'] = intval(date("ymdH",$stime).'30');
				$etime = strtotime(date("Ymd H:",$stime).'59:59');//转成时间戳，根据时间戳查询
			}else{
				$value['timenode'] = intval(date("ymdH",$stime).'00');
				$etime = strtotime(date("Ymd H:",$stime).'29:59');//转成时间戳，根据时间戳查询
			}
			$where = array("time"=>array('$gte'=>$stime,'$lte'=>$etime));
			$updata=array(upsert=>false,multiple=>true);
			$result = $this->tb->update($where,array('$set'=>$value),$updata);			
			$stime = $etime +1;
			var_dump($where);
			var_dump($result);		
		}	
	}


}
?>