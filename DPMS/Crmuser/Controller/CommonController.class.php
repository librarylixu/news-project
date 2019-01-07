<?php
namespace Crmuser\Controller;
use Think\Controller;
/*
父类控制器
*/
class CommonController extends Controller {
	function __construct(){
		parent::__construct();
        //调用热力图方法，function.php中，记录了所有请求时的信息
        FHotfunction();
	}
    //空控制器操作
    public function _empty(){        
		 $this->display(A('Home/Html')->error404());
    }
 
     /*
    $fetchSql true不执行查询并返回sql语句
    $findinset  true使用FIND_IN_SET查询方式。现在仅用于客户详细页面想去查询这个客户对应的工单有哪些。额外增加一个功能----可以多个客户看多个工单（可以看客户id1,2,3的所有工单）
	默认根据id倒叙排列
    $limit 分页使用 默认是空数组  参数传array('offset'=>1,'length'=>5) 必须传length参数  可选参数offset，如果没传则查询0,length
    $authority 是否根据权限查询  'cus_ref_auth';传过来的时session中的id数据   如果是空那么就部根据权限查询了
    //根据时间段查询
    $time = array('starttime'=>array('gt',endtime),'endtime'=>array('lt',1655515156))
    starttime/endtime 都是数据库里的字段，值组建成array()
    */
    function MSelect($parameter=array('$fetchSql'=>false,'$fieldkey'=>"",'$where'=>array(),'$find'=>false,'$in'=>false,'$findinset'=>false,'$limit'=>array(),'$authority'=>"",'$time'=>array(),'$count'=>false,'$group'=>array())){    
        //处理 fieldKey部分 
        $fieldkey=$parameter['$fieldkey'];        
        if (!array_key_exists('$fieldkey',$parameter)||empty($parameter['$fieldkey'])){            
            $fieldkey=implode(',',$this->table_key);
        }
        //处理where部分
        $where=array(del=>0);//这里要防止什么都不传就查询出了全部内容
        $in = false;
        if(array_key_exists('$in',$parameter) &&  !empty($parameter['$in']) && $parameter['$in'] == true){
            $in = true;
        }
        //find_in_set查询
        if(array_key_exists('$findinset',$parameter) &&  !empty($parameter['$findinset']) && $parameter['$findinset'] == true){
            $findinset = true;
        }
        //findall查询全部
        if(array_key_exists('$findall',$parameter) &&  !empty($parameter['$findall']) && $parameter['$findall'] == true){
            $findall = true;
        }
        //是否根据权限查询
        if (!empty($parameter['$authority']) && !$findall){  
            if(array_key_exists('$where',$parameter) && !is_array($parameter['$where'])){
                try{
                    $parameter['$where'] = json_decode($_POST['$where'],true);
                    $parameter['$where'][$this->table_key[0]] = array('in',$_SESSION[$parameter['$authority']]);
                }
                catch (Exception $e) {
                    //此处写日志
                    unset($_POST['$where']);
                }
            }else{
                //$parameter['idcustomerinfo'] = array('in',$_SESSION['cus_ref_auth']);
                //如果按照idcustomerinfo查询，则使用and的方式加上权限中的idcustomerinfo 一起查询
                if (empty($parameter[$this->table_key[0]])){
                    //如果查询中没有idworkorder，不管按照哪些条件，只能查询权限内的数据
                    $parameter[$this->table_key[0]] = array_key_exists('$in',$parameter) && $parameter['$in']?$_SESSION[$parameter['$authority']]:array('in',$_SESSION[$parameter['$authority']]);
                }else{
                    $parameter[$this->table_key[0]] = array_key_exists('$in',$parameter) && $parameter['$in']?array($_SESSION[$parameter['$authority']],$parameter[$this->table_key[0]]):array(array('in',$_SESSION[$parameter['$authority']]),$parameter[$this->table_key[0]]);
                }
            }
        }
        //判断是否传了limit参数,是否要组件limit语句
        if(array_key_exists('$limit',$parameter) &&  !empty($parameter['$limit'])){
            $offset = $parameter['$limit']['offset'];
            if(!empty($offset)){
                $offset = $parameter['$limit']['offset'] .',';
            }
            $limit = $offset.$parameter['$limit']['length'];
        }
        /*
        这里保持前台传参的简单性
        前台可以直接append字段的名称，省去了组建$where条件的过程
		前台必须传$findall = true
        */
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
				//$findinset 查询
				if($findinset){
					//如果值不是数组，则需要转成数组，
					if(!is_array($value)){
						$value = explode(',',$value);
					}
					//循环值，组建sql
					foreach($value as $v){
						if(!empty($v)){
							$where['_string'].='FIND_IN_SET('.$v.','.$key.') OR ';
						}
                    }
				}else{
					$where[$key]=($in == true)?array('in',$value):$value;
				} 
            }
        }
        //如果传了time，说明是要根据时间段去查询。    { 'createtime': 1234,1234}
        if(array_key_exists('$time',$parameter) && !empty($parameter['$time'])){
            //$time传过来的是一个字符串的对象，转换过来,对象或者数组
            $parameter['$time'] = json_decode($parameter['$time']);
            foreach($parameter['$time'] as $key=>$value){
                $where[$key] = $value;
            }
        }  
        /*
        如果前台传了$where,那么会按照where条件中的参数进行查询
        */
        if (array_key_exists('$where',$parameter)&& !empty($parameter['$where'])){
            $w= array();
            if (is_array($parameter['$where']))
            {
        	    $w= $parameter['$where'];
            }else{
                $w= json_decode($parameter['$where']);
            }            
            foreach($w as $key=>$value){
                if(in_array($key,$this->table_key) && !$findinset){
                    $where[$key]=($in == true)?array('in',$value):$value;
                }else if(in_array($key,$this->table_key) && $findinset){
                    foreach($value as $v){
                        $where['_string'].='FIND_IN_SET('.$v.','.$key.') OR ';
                    }                    
                }
            }           
        }
		if($findinset && !empty($where['_string'])){
            $where['_string'] = substr($where['_string'],0,strlen($where['_string'])-3);
        }
        //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        //分组查询
        if(array_key_exists('$group',$parameter) &&  !empty($parameter['$group'])){
            $group = $parameter['$group'];
        }
        //count查询
        if($parameter['$count']){
            $result=Fm($this->table_name)->where($where)->group($group)->count();
             return $result;
        }
        //只要一个数据
        if (array_key_exists('$find',$parameter) && $parameter['$find']==true)
        {
        	$result=Fm($this->table_name)->where($where)->field($fieldkey)->fetchSql($fetchSql)->find();
            return $result;
        }else{
			//排序 默认根据id 正序
			$order = array();
			$order[$this->table_key[0]] = "asc";
            $result=Fm($this->table_name)->where($where)->order($order)->field($fieldkey)->fetchSql($fetchSql)->limit($limit)->select();
			if ($fetchSql){
				return $result;
			}   
            if (array_key_exists('$json',$parameter) && $parameter['$json']==true)
            {
                //组建带key的数组
                $newData=array();
                $k=$this->table_key[0];
            	foreach($result as $value){                    
                    $newData[$value[$k]]=$value;
                }
                return $newData;
            };           
            return $result;
        }		 
    } 
    /*
        数据修改,如果修改成功，则将数据返回并有一个半段字段.
    */
    function MUpdateObj($parameter=array('$fetchSql'=>false)){
        $where=array();
        //修改,必须传id
        if (!array_key_exists($this->table_key[0], $parameter)) {
            return 0;
        }
        //处理where
        $where[$this->table_key[0]] = intval($parameter[$this->table_key[0]]); 
        unset($parameter[$this->table_key[0]]);        
        //处理value
        $nValue=array();
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $nValue[$key]=$value;
            }
        }
        //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        $data = Fm($this->table_name)->where($where)->fetchSql($fetchSql)->save($nValue);           
        if ($data == 1)
        {
        	$parameter[$this->table_key[0]]=intval($where[$this->table_key[0]]);   
            $parameter['ok']=$data;      
            return $parameter;        
        }       
        return $data;
    }   
	//修改方法，如果传入$where 则根据传入的$where条件修改数据
    function MUpdate($parameter=array('$fetchSql'=>false)){
        $where=array();
		if(!empty($parameter['$where'])){
			$where = json_decode($parameter['$where']);
		}else if (array_key_exists($this->table_key[0], $parameter)) {
			//处理where
			$where[$this->table_key[0]] = intval($parameter[$this->table_key[0]]); 
			unset($parameter[$this->table_key[0]]);            
        }else{
		 	return 0;
		}
        //处理value
        $nValue=array();
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $nValue[$key]=$value;
            }
        }
        //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        //var_dump($where);
        //var_dump($parameter);
        $data = Fm($this->table_name)->where($where)->fetchSql($fetchSql)->save($nValue);                  
        return $data;
    }
        /*
    数据插入,如果插入成功，则将$parameter中追加id并返回.类似于mongo的返回方式
    */
     function MInsertObj($parameter){
        $nValue=array();   
        //添加,无需传id
        if (array_key_exists($this->table_key[0], $parameter)) {
            unset($parameter[$this->table_key[0]]);
        }        
        //过滤查询条件
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $nValue[$key]=$value;
            }
        }
         //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        $data = Fm($this->table_name)->data($nValue)->fetchSql($fetchSql)->add();   
        if ($data>0)
        {
        	$parameter[$this->table_key[0]]=$data;   
            $parameter['_id']=$data;      
            return $parameter;        
        }
        return 0;
    }

    function MInsert($parameter=array('$fetchSql'=>false)){
        $nValue=array();   
        //添加,无需传id
        if (array_key_exists($this->table_key[0], $parameter)) {
            unset($parameter[$this->table_key[0]]);
        }        
        //过滤查询条件
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $nValue[$key]=$value;
            }
        }
         //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        $data = Fm($this->table_name)->data($nValue)->fetchSql($fetchSql)->add();                        
        return $data;

    }

    
    /*
    $id 1表示要传ID，0表示可以不用传ID     
    */
    function MDelete($parameter=array('$fetchSql'=>false,'$id'=>1,'$or'=>false)){        
        //传id，并且id字段是有效的
        if (!array_key_exists($this->table_key[0], $parameter) && $parameter['$id']==1) {
            return 0;
        }
        $where=array();
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
                $where[$key]=$value;
            }
        }
        if (count($where)<1)
        {
            //什么都没传,或者传的参数是非法的
        	return -1;
        } 
        /*
           '$or'=>false  用于做or查询使用
           需要传入参数'$or' true表示要组件or语句   false表示不组件
           TP中固定得写法：$where['_logic']
           SELECT * FROM think_user WHERE `name`='thinkphp' OR `account`='thinkphp'
        */
        if(array_key_exists('$or',$parameter) && $parameter['$or']== true){
              $where['_logic'] = 'OR';
        }
        //处理'$fetchSql'=>false
        $fetchSql=false;
        if (array_key_exists('$fetchSql',$parameter) && $parameter['$fetchSql']==true){            
            $fetchSql=true;
        }
        $data = Fm($this->table_name)->where($where)->fetchSql($fetchSql)->delete();  
        return $data;
    }

    /*
    获取日志内容
    $value操作的字段，即POST值
    $parameter   
        _action 0：添加 1：修改  2：删除 3 查询
        _result 0 失败 1成功
      projectid/workorderid/customerid客户的id，这是一个变量,如果要给客户添加日志，必须要有此字段,该字段是甄别数据类型的唯一标记
      新增两个日志分类   recordid / businessid
      '_action'=>1,'_result'=>1,'customerid'=>1
      mongo 无法公用，调用自己控制器的方法
    */
    function MLog($value,$parameter=array('_action'=>3,'_result'=>0)){
        //消息模板
        $msg="查询: %s 信息";
        //消息模板值
        $__tempLogValue=array('','失败');
        $m=array();
         //日志数据
        $logValue=array(time=>time(),userid=>$_SESSION['userinfo']['idusers'],username=>$_SESSION['userinfo']['username'].'-'.$_SESSION['userinfo']['description'],type=>4,result=>0);
        //甄别日志类型
        if ($parameter['customerid'])
        {
            $messagetype = '客户';
            $logValue['customerid']=$parameter['customerid'];
        	$m=new \Model\mCustomerlogModel();
        }else if ($parameter['workorderid'])
        {
            $messagetype = '工单';
            $logValue['workorderid']=$parameter['workorderid'];
             $m=new \Model\mWorkorderlogModel(); 	
        }else if ($parameter['projectid'])
        {
            $messagetype = '项目';
            $logValue['projectid']=$parameter['projectid'];
            $m=new \Model\mProjectlogModel();   	
        }else if ($parameter['recordid'])
        {
            $messagetype = '工作记录';
            $logValue['recordid']=$parameter['recordid'];
            $m=new \Model\mRecordlogModel();   	
        }else if ($parameter['businessid'])
        {
            $messagetype = '出差';
            $logValue['businessid']=$parameter['businessid'];
            $m=new \Model\mBusinesslogModel();   	
        }else if ($parameter['shipmentsid'])
        {
            $messagetype = '出货清单';
            $logValue['shipmentsid']=$parameter['shipmentsid'];
            $m=new \Model\mBusinesslogModel();   	
        }else{
            //不能识别的日志
            return;
        }   
       
        //组建模板
        switch ($parameter['_action'])
        {
        	case 0:
                $msg="新增".$messagetype."- %s 信息,操作结果: %s";
                $logValue['type']=0;
                break;
            case 1:
                $msg="更新".$messagetype."- %s 信息,操作结果: %s";
                $logValue['type']=1;
                break;
            case 2:
                $msg="删除- ".$messagetype."%s 信息,操作结果: %s";
                $logValue['type']=2;
                break;
            case 3:
                $msg="查询- ".$messagetype." 信息";
                $logValue['type']=3;
                break;
        }
        //描述结果
        if ($parameter['_result'])
        {
        	$__tempLogValue[1]='成功';
            $logValue['result']=1;
        }
        //描述内容        
        foreach($value as $k => $v){
            //1.字段不在表中的过滤掉
            if (!array_key_exists($k,$this->table_colunms)){
                continue;
            }
            //2.字段没有描述信息的过滤掉
            if (!array_key_exists('Comment',$this->table_colunms[$k])){             
                continue;
            }
            //3.字段描述信息为空的过滤掉            
            if (!strlen(str_replace(' ','',$this->table_colunms[$k]['Comment']))){
                continue;
            }
            $__tempLogValue[0].=$this->table_colunms[$k]['Comment'].':'.$v.' ';            
        }
        $logValue['message']=vsprintf($msg,$__tempLogValue);        
        $result= $m->insert($logValue);
        //unset($m);       
        return $result;
    }
    /*
    获取当前表的所有字段
    */
    function getColunms(){
        return array();
    }
     /*表结构创建*/
   function init_db(){
        echo 'CreateTable '.$this->table_name."==>0（无数据）<br/>";
   }
    /*统计查询用于mysql
      当前只做一下count查询
      $parameter['$count'] = true;
      $parameter['$where'] = array();
      //根据什么字段分组
      $parameter['$group'] = array();
      //根据字段自定义查询
      $parameter['$field'] = array();
      //将该字段的值作为键返回带键值的数组
      $jsonstr = "userid"
      //根据时间段查询
      $time = array('starttime'=>65411212,'endtime'=>1655515156)
      当前只做一下count查询
      $parameter['$count'] = true;
      //根据什么字段分组
      $parameter['$group'] = array();
    */
    public function MCalculation($parameter=array('$count'=>false,'$where'=>array(),'$in'=>false,'$group'=>false,'$findinset'=>false,'$field'=>array(),'$jsonstr'=>'','$time'=>array())){
        //判断是否要进行的是count查询
        if(array_key_exists('$count',$parameter) && $parameter['$count'] != null){
            $count = true;
        }
        //处理where部分
        $where=array(del=>0);//这里要防止什么都不传就查询出了全部内容
        $in = false;
        if(array_key_exists('$in',$parameter) &&  !empty($parameter['$in']) && $parameter['$in'] == true){
            $in = true;
        }
        if(array_key_exists('$findinset',$parameter) &&  !empty($parameter['$findinset']) && $parameter['$findinset'] == true){
            $findinset = true;
        }
        if(array_key_exists('$group',$parameter) &&  !empty($parameter['$group'])){
            $group = $parameter['$group'];
        }
        /*
        这里保持前台传参的简单性
        前台可以直接append字段的名称，省去了组建$where条件的过程
		前台必须传$findall = true
        */
        
        foreach($parameter as $key=>$value){
            if(in_array($key,$this->table_key)){
				//$findinset 查询
				if($findinset){
					//如果值不是数组，则需要转成数组，
					if(!is_array($value)){
						$value = explode(',',$value);
					}
					//循环值，组建sql
                    $FIND_IN_SET_str = "";
					foreach($value as $v){
                        $FIND_IN_SET_str .= strval($v).',';	
                        //if(!empty($v) and $v ){

                        //}
                    }
                    if(!empty($where['_string'])){
                        $where['_string'].=' and FIND_IN_SET('.$key.',"'.$FIND_IN_SET_str.'")';
                    }else{
                        $where['_string'].='FIND_IN_SET('.$key.',"'.$FIND_IN_SET_str.'")';
                    }
				}else{
					$where[$key]=($in == true)?array('in',$value):$value;
				} 
            }
        }
        if(array_key_exists('$time',$parameter) && !empty($parameter['$time'])){
            foreach($parameter['$time'] as $key=>$value){
                $where[$key] = $value;
            }
        }  
        /*
        如果前台传了$where,那么会按照where条件中的参数进行查询
        */
        if (array_key_exists('$where',$parameter)&& !empty($parameter['$where'])){
            $w= array();
            if (is_array($parameter['$where']))
            {
        	    $w= $parameter['$where'];
            }else{
                $w= json_decode($parameter['$where']);
            }            
            foreach($w as $key=>$value){
                if(in_array($key,$this->table_key)){
                    $where[$key]=($in == true)?array('in',$value):$value;
                }
            }           
        }     
        $result = array();
        if($count){
            $result=Fm($this->table_name)->where($where)->group($group)->count();
        }
        if(array_key_exists('$field',$parameter)&& !empty($parameter['$field'])){
            $fields = "";
            foreach($parameter['$field'] as $key=>$value){
                $fields .=$value.',';
            }
            $countstr = 'count('.$group.')';
            $fields .=$countstr;
            //->fetchSql(true)
            $result=Fm($this->table_name)->field($fields)->group($group)->where($where)->select();
            //return $result;
            $ddata = array();
            if(!empty($parameter['$jsonstr'])){
                foreach($result as $key=>$value){
                    $k = $value[$parameter['$jsonstr']];
                    $ddata[$k] = $value[$countstr];
                }
            }
            return $ddata;
        }       
        return $result;
    }
    /*
        批量操作
        var _data={
            'add': [{
                "name": 'cese1',
                "$fetchSql": true
            }
            ],
            'del':[
                    { idproject: 10, "$fetchSql": true }
            ],
            "upd": [
                {
                    'idproject': 10,
                    "name": 10,
                    "$fetchSql":true,
                }   
            ]
        };
        _data key=add表示新增的  value是要添加的值
              key=del表示新增的  value是要删除的条件
              key=upd表示新增的  value中必须传id,其他是要修改的值
    */
    function batchOperation(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $result = [
            'add'=>[],
            'del'=>[],
            'upd'=>[],
        ];
        $parameter = json_decode($_POST['data'],true);
        foreach($parameter['add'] as $additem){        
            $addresult = $this->MInsert($additem);       
            array_push($result['add'],[id=>$addresult,index=>$additem['__index']]);
        }
        foreach ($parameter['upd'] as $upditem)
        {
            $updresult = $this->MUpdateObj($upditem);   
            array_push($result['upd'],[status=>$updresult,index=>$upditem['__index']]);
        }
        foreach ($parameter['del'] as $delitem)
        {
            $delresult = $this->MDelete($delitem);   
            array_push($result['del'],[status=>$delresult,index=>$delitem['__index']]);
        }
        $this->ajaxReturn($result);
        
    }
    //更新后调用，这个方法是修改表字段，增加一个type字段    也可以用作直接执行sql语句的方法          ALTER TABLE `xc_workorder` ADD classification INT(11) DEFAULT '0' AFTER type;
    /*
        第一步，查询出那个字段存在了。
        array (size=2)
          0 => 
            array (size=1)
              'column_name' => string 'idworkorder' (length=11)
          1 => 
            array (size=1)
              'column_name' => string 'type' (length=4)
        第二布，添加不重复字段
        这个方法有待优化，暂时只能分为两部做
    */
    function insertype_colunms(){
        $arr = $this->table_colunms;
        //要添加的字段
        $str = '';
        foreach ($arr as $key=>$value){   
            //得到查询的sql
            $str.=" or column_name='".$key."'";
        }
        $str = substr($str,3);
        $sql = "select column_name from information_schema.columns where table_name = '". C('CrmDB')['DB_PREFIX'].$this->table_name ."' and (". $str .");";
        //得到了已经重复的字段 二维数组
        $result = Fm($this->table_name)->query($sql);
        //这里做额外的判断，如果当前值都存在了，那就不用添加了
        if(count($arr) == count($result)){
            echo '没有需要添加的字段';
            return;
        }
        //下一步去添加字段
        $result = array_column($result,'column_name');
        //将重复的值去掉
        foreach ($result as $key=>$value)
        {
        	if(array_key_exists($value,$arr)){
               unset($arr[$value]);
            }
        }
        //循环组件sql语句
        $alterstr = '';
        foreach ($arr as $alterkey=>$altervalue){
        	$s=sprintf("`%s` %s %s %s %s,",$alterkey,$altervalue['Type'],$altervalue['isNull'],(array_key_exists('Default',$altervalue)?'DEFAULT '.$altervalue['Default']:''),(array_key_exists('AutoIncrement',$altervalue)?$altervalue['AutoIncrement']:''));      
            $alterstr.=$s; 
        }
        //把循环的字符串最后一个逗号去掉
        $strlen = strrpos($alterstr,',');
        $alterstr = substr_replace($alterstr,'',$strlen,1);
        $altersql = 'ALTER TABLE '. C('CrmDB')['DB_PREFIX'].$this->table_name .' ADD ('.$alterstr.');';
        //执行添加字段sql
        $result = Fm($this->table_name)->execute($altersql);
        if($result == 0){
            echo '成功';
        }else{
            echo '失败';
        }
    }
   /*
    打开模态框
    客户、项目、工单已经将模态框迁移到了主页上，暂时此方法仅用作为建议箱中的打开模态框
    */
    public function openmodal(){
        $this->display($this->modalHtmlPath); 
    }

    /*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MInsert($_POST);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MUpdate($_POST);
        $this->ajaxReturn($data);
    }
    /*异步删除数据
    真正的删除
    */
    public function delete_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MDelete($_POST);
        $this->ajaxReturn($data);
    }

     /*异步删除数据
     标记删除
    */
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $postdata = $_POST;
        $postdata['del'] = 1;
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    //获取count父类方法--异步返回
    public function select_countdata(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $postdata = $_POST;
        $data=$this->MCalculation($postdata);
        $this->ajaxReturn($data);
    }
    /*
        查询已关闭数据
        必传参数    $_POST
            userid  用户id
            etime   结束时间
            stime   开始时间
            tablename 表名
        可选参数
            $fetchSql 返回sql语句
        最后组件出来的sql
        select idproject,guid,name,createtime,starttime,endtime,clientname,statusid,mark,userid,principal,del,refusers,refutypes,refugroups,refcontacts,refinformant,refdecision,reftechnical,refusing,refcustomers,refannexs,contracttime,tendertime,delivertime,grasp,integrate,city,decisioncity,isprotected,refclue from xc_projectmain  where del = 0 AND userid = 1 AND endtime < 1538323200 AND endtime > 1535731200 AND xc_projectmain.index > 0 ;
    */
    public function select_close_data($postdata){

        //$_POST['userid'] = 1;
        //$_POST['etime'] = "1538323200";
        //$_POST['stime'] = "1535731200";
        //$_POST['tablename'] = 'projectmain';
        //$_POST['$fetchSql'] = true;
       
        //组建where
            $where = " where del = 0 AND userid = " . $postdata['userid'] . " AND endtime < ".$postdata['etime']." AND endtime > " . $postdata['stime'] . " AND ";
        //处理项目的
        if($postdata['tablename']=='projectmain'){
            $where.= 'xc_'.$postdata['tablename'].".index > 0 ;";
            $tablename = $postdata['tablename'];
            $astablename = "";
        }    
        //这里默认查询所有的字段，不根据key去查询了
        $key = array_flip($this->table_key);
        $keynum = $key['index'];
        unset($this->table_key[$keynum]);      
        $fieldkey=implode(',',$this->table_key);
        $sql = 'select '.$fieldkey .' from xc_'. $postdata['tablename'] .' '. $where;
        //是否返回sql
        if(array_key_exists('$fetchSql',$postdata) && $postdata['$fetchSql']){
            echo $sql;
            exit();
        }
        $result =  Fm($tablename)->query($sql);
        return $result;
        //$this->ajaxReturn($result);
    }


}