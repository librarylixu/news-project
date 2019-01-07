<?php
/*
	EIM2.0日志
	2018年2月28日 10:27:22	闫绪杰
	PDU端口能耗日志
*/
namespace Model;
class mPduPortEnergyLogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->portenergylog_mongo;
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
				portnum=>array("description"=>"端口号"),
				currentvalue=>array("description"=>"电压"),
				energyvalue=>array("description"=>"电能"),
				powervalue=>array("description"=>"功率,暂时无用")				
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
	/* 
	聚合查询
	db.getCollection('portenergylog_mongo').aggregate([
			{'$match':{'dpuid':'2','time':{'$gt':1520438400,'$lt':1520524799}}},
			{'$group':
				{
					'_id':{'portnum':'$portnum','timenode':'$timenode'},
					'currentavg':{'$avg':'$currentvalue'},			     
					'energyavg':{'$avg':'$energyvalue'}
				}
			},{'$sort':{"_id":-1}}
		])
	*/


	//添加timenode字段，根据该字段查询chart图标X坐标进行图标展示
	public function updatetimenode(){
		$stime = 1520508621;
		$etime = 0;
		$count = 0;
		while($etime < 1520521349){
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
			//var_dump($where);
			var_dump($result);		
			$count++;
			var_dump($count);
		}	
		var_dump('end');
	}
}
?>