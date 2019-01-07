<?php
/*
mongodb
评论信息
*/
namespace Model;
class mWorkordermessageModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->workordermessage_mongo;
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
				causedescription=>array("description"=>"原因描述"),
				workid=>array('对应到mysql中的用户的id'),
				guid=>array('唯一id'),
				resultdescription=>array("description"=>"结果描述"),
				causetime=>array("description"=>"添加原因描述的时间"),
                resulttime=>array("description"=>"添加结果描述的时间"),
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
		$where['workid'] = $parameter['workid'];
		$where['guid'] = $parameter['guid'];
        if(array_key_exists('causedescription',$parameter)){
            $value['causedescription']=$parameter['causedescription'];
        }
        if(array_key_exists('resultdescription',$parameter)){
            $value['resultdescription']=$parameter['resultdescription'];
        }
        $result=$this->tb->update($where,array($operator=>$value),$updata);   
        return $result;
    }
}
?>