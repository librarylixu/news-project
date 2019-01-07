<?php
/*
2017/11/29
刘世群
父类Model
注：所有字段全部为小写
*/
namespace Model;
class baseModel{   
   /*根据传过来的参数去组建where
   $parameter=array(username=>'admin','userpwd'=>'admin');
    $isWhere 0表示不组建where数据 1表示组建where数据
    return array(where条件,$SaveValue要保存的数据,查询时忽略)

    value字段表示对数据进行转义的类型
    pwd  //将密码加密存储不解密
    base64_encodepwd //将密码加密存储，可解密
    _id //编辑为 MongoId类型
    strtotime //将年月日时间解析为 Unix 时间戳
    time //当前时间戳
    int //转换为int类型
    int64 //转换为 MongoInt64类型
    object // 用于对 JSON 格式的字符串进行解码 ，参数为 TRUE 时，将返回数组，FALSE 时返回对象。
    */
   function getWhere($parameter,$isWhere=1){       
        $where=array();
        $SaveValue=array();        
        //过滤查询条件
        foreach($parameter as $key=>$value){   
            //这里进行一次过滤,如果字段不合法将被过滤掉           
            if(array_key_exists($key,$this->table_colunms)){              
                if(count($this->table_colunms[$key])==0){
                    $SaveValue[$key]=$value;                    
                }else if($this->table_colunms[$key]['value']=='pwd'){
                    $SaveValue[$key]=md5(base64_encode($value));//将密码加密存储
                }else if($this->table_colunms[$key]['value']=='base64_encodepwd'){
					$SaveValue[$key]=base64_encode(strrev(base64_encode($value)));//托管密码：加密方式
				}else if($this->table_colunms[$key]['value']=='_id'){
                    $where[$key]=F_getID($value);
                }else if($this->table_colunms[$key]['value']=='strtotime'){
                    $SaveValue[$key]=strtotime($value." 00:00:00");
                }else if($this->table_colunms[$key]['value']=='int'){
                    $SaveValue[$key]=intval($value);
                }else if($this->table_colunms[$key]['value']=='time'){
                    $SaveValue[$key]=time();
                }else if($this->table_colunms[$key]['value']=='int64'){
                    $SaveValue[$key]=F_getInt64($value);
                }else if($this->table_colunms[$key]['value']=='object'){
					$SaveValue[$key]=json_decode($value,true);
                }else{
                    //以上是对value的判断
                    $SaveValue[$key]=$value;  
                }
                if($isWhere and !array_key_exists($key,$where)){
                    $where[$key]=$value;
                } 
            }else if($isWhere && !empty($value['search']) && $value['search']){
                /*
                这里处理特殊的查询字段 如内嵌,$or,$parameter[$key]=array(value=>,search=>true)
                $p['device.device']='192.168.1.1'    =>  $p['device.device']=array(value=>'192.168.1.1',search=>true)                
                $where['$or']=array(array('DeviceType'=>$parameter['devicetype']),array('parentID'=>array('$gt'=>0)));
                => $where['$or']=array(value=>array(array('DeviceType'=>$parameter['devicetype']),array('parentID'=>array('$gt'=>0))),search=>true);
                */            
                $where[$key]=$value['value'];
            }
        }
        return array('where'=>array_change_key_case($where),'value'=>array_change_key_case($SaveValue));
    }

    /*
    添加数据
    $parameter 将传过来的字段添加到数据库中,这里注意了：请在controller中做好字段过滤
    */
    public function insert($parameter){	
		$where=$this->getWhere($parameter,0);
		$value=$where['value'];
		$result = $this->tb->insert($value);
        return $value;
    }
    /*
    删除数据
    $parameter  可以删除多个用户,必须传用户的名称   $parameter=array('admin','test','test1')        
    */
    public function delete($parameter){         
        $result=$this->getWhere($parameter);
        $where=$result['where'];
        $data=$this->tb->remove($where);
        return $data;
    }
    /*
    修改数据@也可以当成添加来使用
    $parameter 要更新的参数
	$operator	操作符：$set,$push,$pull...
    $updata    upsert:true存在则更新,不存在则插入,false仅更新;multiple:true 批量更新,false:只更新一条
    */
    public function update($parameter,$operator='$set',$updata=array(upsert=>false,multiple=>false)){
        $result=$this->getWhere($parameter,0);	
		//改造，update默认根据_id修改，当遇到特殊情况，比如：systemsetting表根据type修改，则需要传入where
		if(!empty($parameter['where'])){
			$where = $parameter['where'];
		}else {
			$where=$result['where'];
		}        
        $value=$result['value'];		
        $result=$this->tb->update($where,array($operator=>$value),$updata);    
        return $result;
    }
    /*
    查询数据
    $parameter 查询参数
    $findOne  true值查询1条  false查询全部符合条件的数据
	$colunms 查询指定列
	$sort 指定列排序  array(columnname=>1 or -1) 1：升序，-1：降序
    */
    public function select($parameter,$findOne=false,$colunms=array(),$sort=array()){ 
        $where=$this->getWhere($parameter);    
        $where=$where['where'];
        if ($findOne){
            $data=$this->tb->findOne($where); 
            return $data;
        }
		$data = array();
		
		if (!empty($sort)){
			$data=$this->tb->find($where,$colunms)->sort($sort); 
		}else{
			$data=$this->tb->find($where,$colunms); 
		}        
        // 返回数据库游标（指针）
        return $data;  
    } 

	/*
		聚合查询
		db.getCollection('pduenergylog_mongo').aggregate([
			{'$match':{'dpuid':'2','$or':[{'time':{'$gt':1520438400,'$lt':1520611199}}]}},
			{'$group':
				{
					'_id':'$timenode',
					'currentavg':{'$avg':'$currentvalue'},
					'voltgaeavg':{'$avg':'$voltagevalue'},           
					'energyavg':{'$avg':'$energyvalue'},
					'poweravg':{'$avg':'$powervalue'},
					'powerfactoravg':{'$avg':'$powerfactorvalue'},
				}
			}
		])
	*/
	public function aggregate($parameter){		
		$result = $this->tb->aggregate($parameter);
		return $result;
	}
    //自定义查询，自己编写查询语句，返回游标
    public function Customquery($parameter,$sort=array()){
        $result = $this->tb->find($parameter)->sort($sort);
		return $result;
    }


}
?>