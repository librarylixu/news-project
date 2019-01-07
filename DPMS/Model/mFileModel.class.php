<?php
/*
	CRM 文件共享管理
	2018-07-25 lix
*/
namespace Model;
class mFileModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->file;
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
				file=>array("description"=>"存储的文件"),
                time=>array(value=>'time',"time"=>"时间戳"),
                fileid=>array("description"=>"fileid"),
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
}
?>