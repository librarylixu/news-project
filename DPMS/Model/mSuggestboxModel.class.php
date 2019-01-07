<?php
/*
mongodb
建议表
*/
namespace Model;
class mSuggestboxModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->suggestbox;
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
				message=>array("description"=>"建议内容"),
				userid=>array("description"=>'对应到mysql中的用户的id'),
				isanonymous=>array("description"=>'是否匿名发布 0正常发布  1匿名发布'),
				stime=>array("description"=>"建议发布时间"),
                status=>array("description"=>"建议处理状态0待处理 1 处理中 2 待反馈 3 处理完毕"),
                result=>array("description"=>"对建议的处理结果"),
                etime=>array("description"=>"建议处理完毕时间"),
                del=>array("description"=>"用于标记删除"),
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
}
?>