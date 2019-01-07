<?php
include 'pduclass.php';
require_once("email.class.php");
//Mongo操作
function F_getm($ip='localhost'){
    if($ip=='localhost'){
        $ip=C('CrmDB')['DB_HOST'];
    }
	return new MongoClient("mongodb://".$ip.":27017");
}
function F_getRegex($value){
	 return new MongoRegex("/".$value."/");
}
function F_getID($id){	
    try{
    	return new MongoId($id);
    }catch (Exception $exception){
        echo "_id错误!!";
        exit();
    }	
}
function F_getInt64($num){
    return new MongoInt64($num);
}
//获取特征码
function F_getSN(){
	$v=str_replace(" ","-",php_uname()).'*'.time();
    $a=F_base64_encryption($v);
    return $a;
}
/**<br> * 生成二维码<br> 
* @param  string  内容<br> 
* @param  integer $size 尺寸 纯数字<br> 
*/
function F_qrcode($url,$size=3){
    Vendor('phpqrcode.phpqrcode');    
    QRcode::png($url,false,QR_ECLEVEL_L,$size,2,false,0xFFFFFF,0x000000);
}

//CRM Mysql操作
function Fm($table=''){
    return M($table,C('CrmDB')['DB_PREFIX'],C('CrmDB')['CON']); 
}


function F_guidv4()
{
/*获取guid*/     
     if (function_exists('com_create_guid')) {        
         return com_create_guid();    
     } else {     
         mt_srand((double)microtime()*10000);
         $charid = strtoupper(md5(uniqid(rand(), true))); 
         $hyphen = chr(45);        
         $uuid   = chr(123)            
                  .substr($charid, 0, 8).$hyphen               
                  .substr($charid, 8, 4).$hyphen            
                  .substr($charid,12, 4).$hyphen            
                  .substr($charid,16, 4).$hyphen            
                  .substr($charid,20,12)            
                  .chr(125);
         return $uuid;    
     } 
}

//用于展示时间超时后的登录页面
function F_timeOut(){	
    //检测session是否有值,没值表示非法登陆了。
    if (empty($_SESSION['Userid'])){
        session_unset();
        session_destroy();
        echo "<h5>页面超时,<a href='".__APP__."/Home/Index/index' target='_parent'>点此重新登陆</a></h5><br/>";          
        exit();
    }
    return;
    //根据系统设置中，设置的超时时间进行检测，检测空闲时间是否超出了设置
    if(strval($_SESSION['out_Timespan']) == "0"){
			return;
	}
    $result=$this->get_user_OneInfo($_SESSION['Username']);
	if(empty($result['timeoutSpan']) || empty($_SESSION['out_Timespan'])){
        $this->update_user_timespan();
    }else if(time()-intval($result['timeoutSpan'])<(intval($_SESSION['out_Timespan'])*60)){
        $this->update_user_timespan();
    }else {
        $timeout_Time=(time()-intval($result['timeoutSpan']));
        session_unset();
        session_destroy();
		echo "<h5>页面超时,<a href='".__APP__."/Home/Login/index' target='_parent'>请重新登陆($timeout_Time )</a></h5><br/>";         
        exit();
    }
}

//设备显示过滤-非管理员只能查看已分配的设备
function F_kvmIsShow($kvm){
    if ((int)$_SESSION['Usertype']==1){
        return true;
    }else if(array_key_exists($kvm,$_SESSION["UserFieldDevice"])){
        return true;
    }
    return false;
}
/*
通用的where赋值方法,提供后台查询数据库用

返回一个新的where数组
$datatype 判断当前表属于什么数据库 mysql传true 默认返回mongo的组件类型
*/
function F_getWhere($where=array(),$parameter=array(),$datatype = false){
      //按时间查询
      if(array_key_exists("sTime",$parameter) and array_key_exists("eTime",$parameter)  and !empty($parameter["sTime"])  and !empty($parameter["eTime"])){             
          $parameter['sTime'] = date("Y-m-d",$parameter['sTime']);
          $parameter['eTime'] = date("Y-m-d",$parameter['eTime']);
          $stt=strtotime($parameter['sTime']." 00:00:00");
          $ett=strtotime($parameter['eTime']." 23:59:59");   
          if($datatype == true){
              $where=array(array('EGT',$stt),array('ELT',$ett));
          }else{
              $where=array('$gte'=>$stt,'$lte'=>$ett);  
          }
      }else if(array_key_exists("sTime",$parameter) and !empty($parameter["sTime"])){
          $parameter['sTime'] = date("Y-m-d",$parameter['sTime']);
          $stt=strtotime($parameter['sTime']." 00:00:00");
          if($datatype == true){
              $where=array('EGT',$stt);
          }else{
              $where=array('$gte'=>$stt);
          }
      }else if(array_key_exists("eTime",$parameter) and !empty($parameter["eTime"])){ 
          $parameter['eTime'] = date("Y-m-d",$parameter['eTime']);
          $ett=strtotime($parameter['eTime']." 23:59:59");    
          if($datatype == true){
              $where=array('ELT',$ett);
          }else{
              $where=array('$lte'=>$ett);
          }
      }else{	
            $stt=strtotime(date('Y-m-d')." 00:00:00");
			$ett=strtotime(date('Y-m-d')." 23:59:59"); 	
            if($datatype == true){
                $where=array(array('EGT',$stt),array('ELT',$ett));
            }else{
                $where=array('$gte'=>$stt,'$lte'=>$ett);
            }
      }
      return $where;
    }

//获取今天的时间
function F_getTaday(){
    $stime=date('Y-m-d');
	$etime=date('Y-m-d');
    return array('sTime'=>$stime,'eTime'=>$etime,"PagedataCount"=>$_SESSION['PagedataCount']);
}

//替换字符串中指定的字符串
/*
@$findlist 要替换的字符串 数组格式
@$replace  替换的内容
@$string   被搜索的字符串

*/
function F_str_Replace($findlist,$replace,$string){
    $txt=$string;
    foreach($findlist as $key){
        $txt=str_replace($key,$replace,$txt);
    }
    return $txt;
}
/*
	正则表达式数据
	登陆自检策略设置时 使用
*/
function F_RegularExpression_data(){
	$data = array();
	$data['id1'] = array(name=>'首位为大写字母', value=>'"^[A-Z]"');
	$data['id2'] = array(name=>'包含任意字母', value=>'/[A-Za-z]/');
	$data['id3'] = array(name=>'包含小写字母', value=>'/[a-z]/' );
	$data['id4'] = array(name=>'包含大写字母', value=>'/[A-Z]/' );
	$data['id5'] = array(name=>'首位为字母', value=>'"^[A-Za-z]"' );
	$data['id6'] = array(name=>'包含数字', value=>'/[0-9]/' );
	$data['id7'] = array(name=>'包含特殊字符', value=> '/\W/' );
	return $data;
}

/*
	获取目录下所有文件及文件夹的名称
	$path = /var/www/html/DPMS/public/images
*/
function F_scandir($path){
	$name = array();
	if(!is_dir($path)){
		return $name;			
	}		
	$handler = opendir($path);	
	//2、循环的读取目录下的所有文件
	//其中$filename = readdir($handler)是每次循环的时候将读取的文件名赋值给$filename，为了不陷于死循环，所以还要让$filename !== false。一定要用!==，因为如果某个文件名如果叫’0′，或者某些被系统认为是代表false，用!=就会停止循环*/	
	while( ($filename = readdir($handler)) !== false ) {
	      //3、目录下都会有两个文件，名字为’.'和‘..’，不要对他们进行操作
	      if($filename != "." && $filename != ".."){
	          //4、进行处理
	          //这里简单的用echo来输出文件名
			  array_push($name,$filename);			  
	      }
	}
	//5、关闭目录
	closedir($handler);
	return $name;
}
/*
导入数据到Excel文件
*/
function F_ExcelImport($filePath){
        require_once '/PHPExcel.php';       
        include_once '/PHPExcel/IOFactory.php';
        $PHPExcel = new PHPExcel();
 
        /**默认用excel2007读取excel，若格式不对，则用之前的版本进行读取*/
        $PHPReader = new PHPExcel_Reader_Excel2007();
        if(!$PHPReader->canRead($filePath)){
            $PHPReader = new PHPExcel_Reader_Excel5();
            if(!$PHPReader->canRead($filePath)){
                echo 'no Excel';
                return ;
            }
        }
        $PHPExcel = $PHPReader->load($filePath);
        /**读取excel文件中的第一个工作表*/
        $currentSheet = $PHPExcel->getSheet(0);
        /**取得最大的列号*/
        $allColumn = $currentSheet->getHighestColumn();
        /**取得一共有多少行*/
        $allRow = $currentSheet->getHighestRow();
        /**从第二行开始输出，因为excel表中第一行为列名*/
        $result=array(key=>array(),value=>array());
        for($currentRow = 1;$currentRow <= $allRow;$currentRow++){
            /**从第$currentColumn [A]列开始输出*/     
            $_value=array();       
            for($currentColumn= 'A';$currentColumn<= $allColumn; $currentColumn++){                
                $val = $currentSheet->getCellByColumnAndRow(ord($currentColumn) - 65,$currentRow)->getValue(); 
                if($currentRow==1){
                    //表示为列头
                    array_push($result['key'],strval($val));
                    continue;
                }        
               //  echo $val.'['.$currentColumn.'] \t';
                array_push($_value,strval($val));                              
            }
            if(count($_value)){
                array_push($result['value'],$_value);     
            }            
           // echo '<br/>';
        }
        return $result;
}

/*
导出数据到Excel文件
$filename 要导出的文件全路径，包含文件名
$data 要导出的数据  
$data['key']=array(columnsName,columnsName,columnsName,columnsName)
$data['value']=array(array(value,value,value,value),array(value,value,value,value),array(value,value,value,value))
*/
function F_ExcelExport($filename,$data){
    //$excel_set是一个数组,0 sheetTitle sheet活动名称,1 Title 报表表头 2 table_subject列名    
    require_once 'C:\\wamp\\www\\PHPExcel.php';       
    require_once 'C:\\wamp\\www\\PHPExcel\\Writer\\Excel5.php';
         $objPHPExcel = new PHPExcel(); 
        /*以下是一些设置 ，什么作者  标题啊之类的*/  
         $objPHPExcel->getProperties()
            //创建者
            ->setCreator("setCreator")  
         //上次更改时间
           ->setLastModifiedBy("setLastModifiedBy")  
           //title
           ->setTitle("setTitle")  
           //
           ->setSubject("setSubject")  
           //
           ->setDescription("setDescription")  
           //
           ->setKeywords("setKeywords")  
           //
          ->setCategory("setCategory");  

          /*处理表头*/
          $Cell_Char=65;//表示A
          $num=1;
          foreach ($data['key'] as $k)
          {
          	$objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($Cell_Char).$num, $k);
            $Cell_Char+=1;
          }          
         /*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/         
        foreach($data['value'] as $v){  
             $num+=1;
             $_Cell_Char=65;//表示A
             foreach ($v as $_cellvalue)
             {
          	    $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($_Cell_Char).$num, $_cellvalue);
                $_Cell_Char+=1;
             }     
        }   
        //分页名称
        $objPHPExcel->getActiveSheet()->setTitle('XinChenEIM');  
        $objPHPExcel->setActiveSheetIndex(0);  
        //输出内容    
        $outputFileName = $filename;  
        // 创建文件格式写入对象实例, uncomment       
        $objWriter = new PHPExcel_Writer_Excel5($objPHPExcel);  
        //保存到服务器磁盘       
        $objWriter->save($outputFileName);
        return $outputFileName;
}


/*获取客户端的IP地址*/
function F_getClientIP()  
{  
    $ip='0.0.0.0';  
    if (getenv("HTTP_CLIENT_IP"))  
        $ip = getenv("HTTP_CLIENT_IP");  
    else if(getenv("HTTP_X_FORWARDED_FOR"))  
        $ip = getenv("HTTP_X_FORWARDED_FOR");  
    else if(getenv("REMOTE_ADDR"))  
        $ip = getenv("REMOTE_ADDR");  
    else $ip = "Unknow";  
    return $ip;  
}  


/*
	密码加密解密
    base64 加密 or 解密 字符串
    加密方式：base64加密 -> 反转字符串 -> base64加密[base64_encode(strrev(base64_encode($str)))]
    解密：base64解密 -> 反转字符串 -> base64解密 [base64_decode(strrev(base64_decode($str)))]

    $str:需要加密or解密的字符串
    $flag:encode:加密，decode解密
*/
function F_base64_encryption($str,$flag='encode'){
        if($flag == "encode"){            
           return base64_encode(strrev(base64_encode($str)));
        }else{          
           return base64_decode(strrev(base64_decode($str)));           
        }
    }
/*二维数组根据某个元素去重 
  $value:是否要带key的数组。默认带下标
*/
 function F_array_unset($arr,$key,$value=false){          
        $res = array();      
        foreach ($arr as $value) {         
           //查看有没有重复项
           if(isset($res[$value[$key]])){                            
                 unset($value[$key]);				 
           }
           else{			    
                $res[$value[$key]] = $value;
           }
        }
        if($value){
            $res = array_values($res);
        }
        return $res;
}

/*

*/
 //文件下载
 //@$file_name 包含文件名的路径
//@$displayname 推送到下载框中显示的名称
function F_downloadfile($file_name,$displayname){     
    if(!file_exists($file_name)){
        //检查文件是否存在  
            return false;
    } else{    
		ob_end_clean();//清除缓冲区,避免乱码
		ob_start();
        $file = fopen($file_name,"r");       
        Header("Content-type:application/force-download");//告诉浏览器强制下载
        Header("Accept-Ranges: bytes");
        Header("Accept-Length: ".filesize($file_name));
        Header("Content-Disposition: attachment; filename=" . $displayname);        
        echo fread($file,filesize($file_name));
        fclose($file);  
        return true;          
    }    
}
 /*
判断当前浏览器是否是移动端
*/
function F_is_mobile()  
{  
        $agent = strtolower($_SERVER['HTTP_USER_AGENT']);  
        $is_pc = (strpos($agent, 'windows nt')) ? true : false;  
        $is_mac = (strpos($agent, 'mac os')) ? true : false;  
        $is_iphone = (strpos($agent, 'iphone')) ? true : false;  
        $is_android = (strpos($agent, 'android')) ? true : false;  
        $is_ipad = (strpos($agent, 'ipad')) ? true : false;  
          
        if($is_iphone){  
              return  true;  
        }  
        if($is_android){  
              return  true;  
        }  
        if($is_ipad){  
              return  true;  
        }  
        if($is_pc){  
              return  false;  
        }   
        if($is_mac){  
              return  false;  
        } 
return -1; 
} 


/*
发送邮件
收件人，多个收件人以逗号分隔 $mailTo="liusq@xinchen.net.cn,lix@xinchen.net.cn";
邮件标题 $mailTitle="邮箱标题-CRM自动发送的邮件";
邮件内容 $mailContent='<h1>测试邮件 001</h1>'; 默认html格式
邮件格式 $mailType="HTML";  邮件格式 （HTML/TXT） 默认html格式
*/
function F_SendMail($mailTo,$mailTitle,$mailContent,$mailType='HTML'){
    try
    {
	    // true表示是否身份验证
        $smtp=new \smtp(C('NOTICEMail')['SMTPServer'],C('NOTICEMail')['SMTPPort'],true,C('NOTICEMail')['MailUser'],C('NOTICEMail')['MailPwd']);
        // 是否显示调试信息
        $smtp->debug=true;
		$mailTitle="=?UTF-8?B?".base64_encode($mailTitle)."?=";
		//$mailContent=iconv('GB2312', 'UTF-8', $mailContent);   
		//$mailContent = base64_encode($mailContent);
        // 返回 bool
        $state=$smtp->sendmail($mailTo,C('NOTICEMail')['MailUser'],$mailTitle,$mailContent,$mailType);
        return $state;
    }
    catch (Exception $exception)
    {
        return false;
    }
}

   /*
    热力图
    用来统计用户的操作行为
    */
    function FHotfunction(){  
            try
            {
    	        $m=new \Model\mSystemhotlogModel();
               //日志数据
                $logValue=array(
                            clientinfo=> $_SERVER['HTTP_USER_AGENT'],
                            userid=>$_SESSION['userinfo']['idusers'],
                            username=>$_SESSION['userinfo']['username'].'-'.$_SESSION['userinfo']['description'],
                            clientport=> $_SERVER['REMOTE_PORT'],
                            requestmethod=>$_SERVER['REQUEST_METHOD'],
                            query=>$_SERVER['QUERY_STRING'],
                            requesttime=> $_SERVER['REQUEST_TIME'],
                            fullurl=>$_SERVER['REQUEST_URI'],
                            url=>$_SERVER['PHP_SELF'],
                            modulename=> MODULE_NAME,
                            controllername=>CONTROLLER_NAME,
                            functionname=>end(explode("/",$_SERVER['PHP_SELF'])),
                            clientip=>$_SERVER['REMOTE_ADDR'],
                            requesttype=> $_SERVER['REQUEST_SCHEME'],
                            postvalue=>json_encode($_POST));
                $m->Tinsert($logValue);
            }
            catch (Exception $exception)
            {
            }
    }

    /**
    *读取文件
    *$filename 文件名
    *返回值 -1打开文件失败 -2打开文件错误
    */
    
    function F_readFile($filename){
    try
    {
    	$myfile = fopen($filename, "r");
        if(!$myfile){
            return -1;
        }
        $result= fread($myfile,filesize($filename));       
        fclose($myfile);
        return $result;
    }
    catch (Exception $exception)
    {
        return -2;
    }
    
        
    }
    /**
    *写入文件
    *$filename 文件名 $value 要写入的文件内容
    *返回值 -1打开文件失败 -2写入文件失败  -3写入文件错误
    */
    function F_writeFile($filename,$value){
         try
    {
    	$file = fopen($filename,"w");
        if(!$file){
            return -1;
        }
      $status= fwrite($file,$value);
       if(!$status){
            return -2;
        }
        fclose($file);

        return $status;
    }
    catch (Exception $exception)
    {
        return -3;
    }
    
        
    }
    
    //获取Postgres PDO对象
function F_getPDO($ip,$username,$pwd,$dbname,$portnum){
	$db=new PDO('pgsql:host='.$ip.';dbname='.$dbname.'', $username, $pwd);
	return $db;
}
?>
