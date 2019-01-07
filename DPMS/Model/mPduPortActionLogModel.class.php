<?php
/*
	EIM2.0日志
	2018年2月28日 10:27:22	闫绪杰
	PDU端口操作日志
*/
namespace Model;
class mPduPortActionLogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->portactionlog_mongo;
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
				user=>array("description"=>"操作用户"),		
				actionstatus=>array("description"=>"操作状态"),		
				result=>array("description"=>"操作结果")
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
}
?>