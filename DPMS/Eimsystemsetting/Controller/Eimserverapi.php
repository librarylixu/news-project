<?php
#require_once "../../vendor/autoload.php";
include('../../../hprose/Hprose.php');
$config=include('../../../DPMS/Common/Conf/config.php');
define('DB_USER', $config['CrmDB']['DB_USER']);
define('DB_PWD', $config['CrmDB']['DB_PWD']);
define('DB_NAME', $config['CrmDB']['DB_NAME']);
define('DB_HOST', $config['CrmDB']['DB_HOST']);
define('DB_PREFIX', $config['CrmDB']['DB_PREFIX']);
//var_dump($config);
//exit();
use Hprose\Http\Server;

function connect($name) {
    return $name;
}
//修改状态
function updateworkstatus($status,$workid) {
    $sql='';
    if($status==3){
     //准备SQL语句--改
        $sql = "update ".DB_PREFIX."eimworklog set status=".$status.",endtime=".time()." where ideimworklog=".$workid;
    }else{
     //准备SQL语句--改
        $sql = "update ".DB_PREFIX."eimworklog set status=".$status." where ideimworklog=".$workid;
    }
    //造连接对象
    $db = new MySQLi(DB_HOST,DB_USER,DB_PWD,DB_NAME);
   
    //执行SQL语句
    $r = $db->query($sql); 
   // var_dump($r);
   // exit();  
    return $r;
}

//查找工单信息
function selectworkstatus($workid) {
    if(!$workid){
        return -1;
    }    
    //造连接对象
    $db = new MySQLi(DB_HOST,DB_USER,DB_PWD,DB_NAME);
   // $result=$db->query("SELECT *  FROM ".DB_PREFIX."eimworklog where ideimworklog=".$workid);
    $sql="SELECT *  FROM ".DB_PREFIX."eimworklog where ideimworklog=".$workid;
    $result=mysqli_query($db,$sql);
    $row=mysqli_fetch_array($result,MYSQLI_ASSOC);
    //$row=$result->fetch_array();
    $str='';
  
//  return $row['ideimworklog'];
    if(array_key_exists("ideimworklog",$row)){
         $str.="ideimworklog:".$row['ideimworklog'];
    }
    if(array_key_exists("userid",$row)){
         $str.="`userid:".$row['userid'];
     }
     if(array_key_exists("sessiontypeid",$row)){
         $str.="`sessiontypeid:".$row['sessiontypeid'];
     }
     if(array_key_exists("sessiontypename",$row)){
         $str.="`sessiontypename:".$row['sessiontypename'];
     }
      if(array_key_exists("status",$row)){
         $str.="`status:".$row['status'];
     }
     if(array_key_exists("starttime",$row)){
         $str.="`starttime:".$row['starttime'];
     }
     if(array_key_exists("endtime",$row)){
         $str.="`endtime:".$row['endtime'];
     }
     if(array_key_exists("refdeviceid",$row)){
         $str.="`refdeviceid:".$row['refdeviceid'];
     }
     if(array_key_exists("refdevicetype",$row)){
         $str.="`refdevicetype:".$row['refdevicetype'];
     }
     if(array_key_exists("deviceinfo",$row)){
        $deviceinfo= json_decode($row['deviceinfo']);
        foreach ($deviceinfo as $key=>$value ){
        	 $str.="`".$key.":".$value;
        }
     }
     if(array_key_exists("olddevicename",$row)){
         $str.="`olddevicename:".$row['olddevicename'];
     }     
     if(array_key_exists("starttype",$row)){
         $str.="`starttype:".$row['starttype'];
     }
    // return  $str;
    // exit();

      return _DECgetInfo($str);
}
//字符串加密
    function _DECgetInfo($info){
        $info = base64_encode($info); //base64_encode 将字符串以 BASE64 编码
        $info = strrev($info);
        return $info;
    }
$server = new Server();
$server->addFunction('connect');
$server->addFunction('updateworkstatus');
$server->addFunction('selectworkstatus');
$server->addFunction('_DECgetInfo');
$server->start();
