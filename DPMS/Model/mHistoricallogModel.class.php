<?php
/*
mongodb
历史记录表（展示每个页面中操作过的历史记录）
*/
namespace Model;
class mHistoricallogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->historicallog_mongo;
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
				time=>array("description"=>"历史记录的时间"),
				userid=>array("description"=>'对应到mysql中的用户的id'),
				text=>array("description"=>'历史记录的内容'),
				type=>array("description"=>"控制器名称"),
                refid=>array("description"=>"记录存储的数据id（哪个控制器中的这个id数据）"),
				datatype=>array("description"=>"数据类型,如果是工单的话 0正常数据操作日志 1改派他人日志 2工单驳回日志 3工单中止日志 4工单结单日志"),
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
}
?>