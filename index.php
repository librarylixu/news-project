<?php
// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');
//页面显示为utf-8
header("content-type:text/html;charset=utf-8");
// 开启调试模式 建议开发阶段开启 True 部署阶段注释或者设为 False   
define('APP_DEBUG',True); 
//定义JS CSS 目录常量
$pathName='DPMS/';
define('CSS_URL',"../../../".$pathName."public/css/");
define('JS_URL',"../../../".$pathName."public/js/");
define('IMG_URL',"../../../".$pathName."public/images/");
define('BOOTSTRAP_URL',"../../../".$pathName."public/lib/");
define('APP_PUBLIC',"../../../".$pathName."public/lib/");
define('PAGE_URL',"../../../".$pathName."public/page/");
define('VIDEO_URL',"../../../video/");
//Angular及关联插件的版本号,有些插件必须和angular的版本号一样,否则会报错.
define('ANGULAR_VERSION','1.4.6/');
//UiGrid插件的版本号
define('UIGRID_VERSION','4.1.3/');
define('CSS_ICON_VERSION',"1.0.8");//图标库(js)版本号
//CRM版本号 给js后缀使用防止用户端缓存数据
define('CRM_VERSION',"2.0.3.5");
// 定义应用目录
define('APP_PATH','./'.$pathName);
// 引入ThinkPHP入口文件 
require './ThinkPHP/ThinkPHP.php';
?>