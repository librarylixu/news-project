<?php
/*
	2018年7月30日 	lix
	工单操作日志
*/
namespace Model;
class mWorkorderlogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->workorderlog;
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
				time=>array(value=>'time',"description"=>"时间戳"),
				username=>array("description"=>"用户名称"),				
				message=>array("description"=>"详细内容"),				
				type=>array(value=>'int',"description"=>"表示当前做的什么操作：0：添加 1：修改  2：删除"),
                workorderid=>array(value=>'int',"description"=>"添加成功后的id"),
                userid=>array(value=>'int',"description"=>"操作者的ID"),
                result=>array(value=>'int',"description"=>"失败0,成功1,未知2")					
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
}
?>