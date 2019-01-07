<?php
include 'pduconfig.php';
return array(
    //系统标识：EIM 和 CRM
    'SystemIdentification'=>"CRM",
    //不区分控制器大小写
    'URL_CASE_INSENSITIVE' =>false,
	//伪静态 方法名后缀
	'URL_HTML_SUFFIX'=>'html',
	//URL访问模式 0 1 2 3
	'URL_MODEL'=>1,
    'LOG_RECORD' => false,// 关闭日志记录
	//页面显示追踪信息
	'SHOW_PAGE_TRACE'=>false,
    //验证码 verify 启用时该值为空,禁用时该值为hidden
    'VERIFY'=>'hidden',
    //登录页面显示
    'LOGINTXT'=>"EIM运维审计平台",
    //登陆页面设置,此处可以指定html登陆页面
    //CRM : Index/login , EIM : Ace/login-new
	'LOGIN_PAGE'=>'Index/login',
    //Mongo数据库地址，主备服务器设备使用，默认localhost
    'MONGODB_PATH_IP'=>'localhost',
    //登陆页面显示的公司(企业)名称
	'LOGIN_ENTERPRISE_NAME'=>"北京昕辰清虹科技有限公司",
	//授权路径
    'LICENSE_PATH'=>'python /var/www/xcservice/dpms/license.pyc',
	//授权文件存储路径
    'LICENSE_FILE_PATH'=>'/var/www/html/DPMS/public/file/',
    //页面或页面分组图标路径
    'APPINFO_IMG_PATH'=>'../../../DPMS/public/lib/win10-ui/img/icon/',
    //主页面登录后
    'INDEXTXT'=>'CRM',
    //版本号
    'VERSION'=>'V2.1.1',
	//首页面服务器信息
	'SYSTEM_PATH'=>'/var/www/html/DPMS/system.php',
	//前台页面的风格  jquery  \ vue   \ angular
    'HtmlType'=>'angular',  
     //crm数据库连接
    'CrmDB'=>array(
        'CON'=>'mysql://root:root@127.0.0.1/xc_crm',
        'DB_HOST'=>'127.0.0.1',
        'DB_USER'=>'root',
        'DB_PWD'=>'root',
	    'DB_PREFIX'=>'xc_',
	    'DB_FIELDTYPE_CHECK'=>false,
	    'DB_FIELDS_CACHE'=>true,
	    'DB_CHARSET'=>'utf8',       
	    'DB_NAME'=>'xc_crm',
    ),   
	 //windows版附件上传路径
	 'FileUpLoadPath'=>'C:\\wamp\\www\\DPMS\\public\\file\\',
	 	 //Linux版附件上传路径
	 //'FileUpLoadPath'=>'/var/www/html/DPMS/public/file/',
        //Linux版本   PHPExcel路径
        //'FilePhpExcel'=>'var/www/html/',      
     'PDUOID'=>$pduoid,
     //windows版审计视频路径
	 'FileUpLoadPath'=>'C:\\wamp\\www\\DPMS\\public\\file\\',
     //使用手册地址路径
     'FileHandBookPath'=>'C:\\wamp\\www\\DPMS\\public\\file\\handbook.pdf',
     //CRM通知邮件设置
     'NOTICEMail'=>array(
            'SMTPServer'=>'smtp.xinchen.net.cn',//SMTP服务器地址
            'SMTPPort'=>25,//SMTP端口号      
            'MailUser'=>"crm@xinchen.net.cn",//邮箱账号
            'MailPwd'=>"Xincheneim2415!."//邮箱密码
      ),
      'SERVICEPATH'=>'C:\\xcqh\\tempfile\\',//与后台服务通讯目录
       //文件下载路径
    'FILE_DOWN_LOAD_PATH'=>'C:\\wamp\\www\\DPMS\\public\\file\\',
);