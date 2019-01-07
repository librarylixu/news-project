<?php
/*
	2018年8月1日 	lsq
	访问日志
    热力图
    用来统计用户的操作行为
*/
namespace Model;
class mSystemhotlogModel extends baseModel{
   var $db;//数据库对象   
   var $mongo;
   var $tb;//当前表
   var $table_colunms;//表字段  
   function __construct(){
      $this->mongo=F_getm();
      $this->db=$this->mongo->xop;  
      $this->tb=$this->db->systemhotlog;
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
                requesttime=>array(value=>'int',"description"=>"得到请求开始时的时间戳"),
                clientinfo=>array("description"=>"获取用户相关信息，包括用户浏览器、操作系统等信息"),				
                query=>array("description"=>"服务器请求时?后面的参数"),				
                requestmethod=>array("description"=>"请求提交数据的方式"),
                clientport=>array(value=>'int',"description"=>"用户连接到服务器时所使用的端口"),
                userid=>array(value=>'int',"description"=>"操作者的ID"),
                username=>array("description"=>"用户名称"),
                fullurl=>array("description"=>"完整URL"),
                url=>array("description"=>"不带参数的URL"),
                modulename=>array("description"=>"tp模块名称"),
                controllername=>array("description"=>"tp控制器名称"),
                functionname=>array("description"=>"方法名称"),
                clientip=>array("description"=>"客户端访问地址"),
                requesttype=>array("description"=>"客户端访问方式",
                postvalue=>array("description"=>"post值,如果是post请求的话"))
			);
		/*
		CASE_LOWER - 默认值。以小写字母返回数组的键。
		CASE_UPPER - 以大写字母返回数组的键。
		*/
		return array_change_key_case($arr);
    }
     /*
    添加数据
    $parameter 将传过来的字段添加到数据库中,这里注意了：请在controller中做好字段过滤
    */
    public function Tinsert($parameter){			
		$result = $this->tb->insert($parameter);
        return $value;
    }
}
?>