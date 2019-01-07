<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
2018年2月28日 11:38:54 闫绪杰
EIM 2.0 日志系统

*/
class CommonController extends Controller {   
    function index(){
        echo "EimLogCommon";
    }
    public function Wlog($fieldname){
        A('Eimlog/Logsystemoperation')->MInsert($fieldname);  
    }
	/*
		新增数据
    */
    function MInsert($parameter=array()){
        $result=$this->model->insert($parameter);
		return $result;
    }   
	/*
		删除数据
    */
    function MDelete($parameter){        
        $result=$this->model->delete($parameter);
		return $result;
    }
	/*
		更新数据
		$parameter更新数据参数，这里有个特殊的key,$updata
		$operator	操作符：$set,$push,$pull...
		$updata => upsert:true存在则更新,不存在则插入,false仅更新;   multiple:true 批量更新,false:只更新一条
    */
    function MUpdate($parameter=array('$updata'=>array(upsert=>false,multiple=>false),'$operator'=>'$set')){       
        $updata=array(upsert=>false,multiple=>false);
        if (!empty($parameter['$updata'])){
        	$updata=$parameter['$updata'];
        }
		$operator = '$set';
		if (!empty($parameter['$operator'])){
        	$operator=$parameter['$operator'];
        }
        $result=$this->model->update($parameter,$operator,$updata);
		return $result;
    }
	/*
		查询数据
		$parameter查询参数，这里有两个特殊的key,$findOne\$cursor\$colunms
		$findOne 是否进行一次查询
		$cursor 是否需要返回游标
		$colunms 查询指定的列  array(columnname=>1);
		$sort 指定列排序  array(columnname=>1 or -1) 1：升序，-1：降序
    */
    function MSelect($parameter=array('$findOne'=>false,'$cursor'=>false,'$colunms'=>array(),'$sort'=>array())){ 
		$findOne = false;
        if (!empty($parameter['$findOne']) && $parameter['$findOne']){
			$findOne = true;
        }
        $colunms=array();
        //过滤字段
        if (!empty($parameter['$colunms'])){
        	$colunms=$parameter['$colunms'];
			unset($parameter['$colunms']);
        }
		//排序
		$sort=array();
		if (!empty($parameter['$sort'])){
        	$sort=$parameter['$sort'];
			unset($parameter['$sort']);
        }
        $result=$this->model->select($parameter,$findOne,$colunms,$sort);
        if (!empty($parameter['$cursor']) && $parameter['$cursor']){
            //要游标            
            return $result; 
        }
        //要数据
        $data=array();
        foreach ($result as $value){
            $_id=strval($value['_id']);
			$value['_id'] = $_id;
            if(!empty($value['time'])){
                $value['time'] = date('Y-m-d H:i:s',$value['time']);
        	}      
			$data[$_id]=array_change_key_case($value);
        }
		if (empty($parameter['$json'])){
			$data = array_values($data);
		}
        return $data;
    }
	/*
		聚合查询
		db.getCollection('pduenergylog_mongo').aggregate([
			{'$match':{'dpuid':'2','time':{'$gt':1520438400,'$lt':1520611199}}},
			{'$group':
				{
					'_id':'$timenode',
					'currentavg':{'$avg':'$currentvalue'},
					'voltgaeavg':{'$avg':'$voltagevalue'},           
					'energyavg':{'$avg':'$energyvalue'},
					'poweravg':{'$avg':'$powervalue'},
					'powerfactoravg':{'$avg':'$powerfactorvalue'},
				}
			},{'$sort':{"_id":1}}
		])
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
	function Maggregate($parameter=array()){
		$sort=array('_id'=>1);
		$where = array(array('$match'=>$parameter['$match']),array('$group'=>$parameter['$group']),array('$sort'=>$sort));
        
        
		$result = $this->model->aggregate($where);
		if(!empty($result['ok'])){
			return $result['result'];
		}
		return array();
	}

}