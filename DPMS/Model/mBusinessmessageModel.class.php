<?php
/*
mongodb
出差报告
*/
namespace Model;
class mBusinessmessageModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->businessmessage_mongo;
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
				message=>array("description"=>"出差报告"),
				businessid=>array('对应到mysql中的出差id'),
				guid=>array('唯一id')
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
        
    /*
    修改数据@也可以当成添加来使用
    $parameter 要更新的参数
	$operator	操作符：$set,$push,$pull...
    $updata    upsert:true存在则更新,不存在则插入,false仅更新;multiple:true 批量更新,false:只更新一条
    */
    public function update($parameter,$operator='$set',$updata=array(upsert=>true,multiple=>false)){
		$where['businessid'] = $parameter['idbusiness'];
		$where['guid'] = $parameter['guid'];
        if(array_key_exists('message',$parameter)){
            $value['message']=$parameter['message'];
        }
        $result=$this->tb->update($where,array($operator=>$value),$updata);   
        return $result;
    }
}
?>