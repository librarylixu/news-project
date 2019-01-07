<?php
namespace Home\Controller;
use Think\Controller;
class EimloginController extends Controller {
/*
登陆控制器
*/
    function __construct(){  
        parent::__construct();
       FHotfunction();
    }
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());
    }
    /*
    登陆页面
    */
    function index(){
        session_unset();
		session_destroy();  
        $this->display('Ace/login-new');//Index/login.html
    } 
    //生成验证码
	public function verify_c(){  
		$Verify = new \Think\Verify();  
		$Verify->fontSize = 15;  
		$Verify->length   = 4;  
		$Verify->useNoise = false;
		$Verify->useCurve=false;  
		$Verify->codeSet = '0123456789';  
		$Verify->imageW = 100;  
		$Verify->imageH = 30;  
		$Verify->expire = 600;  
		$Verify->entry(); 
	}
    //检测输入的验证码是否正确，$code为用户输入的验证码字符串
   function check_verify(){  
        if(C('VERIFY')!='hidden'){
            $verify = new \Think\Verify();        
            if(!$verify->check($_POST['verify'], '')){		
                 //记录登录/登出日志
                //A('Crmlog/Loginlog')->add_control_data(0,0,array(false,'验证码错误'));				
                $this->assign('info','验证码错误');      
                $this->index();
   
            } 
        }
	}
    /*提交登陆信息
    因为要做新的页面
    这里的方法临时使用,去掉了所有的验证
    */
   public function login(){ 

        if(!empty($_SESSION['userinfo'])){
               //说明已登录过了,不要再次登录了
              // $this->win10login();
        }
        else if(!IS_POST || empty($_POST)){
            $this->assign('info','不正确的登录');
             //记录登录/登出日志
            //A('Crmlog/Loginlog')->add_control_data(0,0,array(false,'不正确的登录'));
            $this->index();
        }
        else if(IS_POST && empty($_SESSION['userinfo'])){
         	$this->authLogin();                    
         } 
         else{
             $this->assign('info','非法请求');
             
             //记录登录/登出日志
            //A('Crmlog/Loginlog')->add_control_data(0,0,array(false,'非法请求'));
             $this->index();            
         }
   }

   /*
   登录认证
   */
   private function authLogin(){
   return false;
        /*
        1.验证码校验   
        2.授权有效性校验     
        */
        $parameter=array();
        $parameter['$where']=json_encode(array(username=>$_POST['username'],pwd=>md5($_POST['pwd'])));
        $parameter['$find']=true;
        $result= A('Crmuser/Users')->MSelect($parameter);
        /*
        3.账号封\禁\锁定状态
        4.账号IP地址绑定校验
        */
        if (empty($result))
        {
            /*
            5.密码连续错误次数校验与写入
            */
            $this->assign('info','账号或密码不正确');
            ////记录登录/登出日志
            //A('Crmlog/Loginlog')->add_control_data(0,0,array($_POST['username'],'账号或密码不正确'));
       	   $this->index(); 
         
        }
        /*
        6.更新用户登录信息
        7.更新用户错误次数等信息
        */
        $result['lastlogintime'] = strval(time());//此处缓存一份该用户的登录时间戳字符串
        $_SESSION['userinfo']=$result; 
        $this->win10login();

   }


  //验证Ip地址
   private function auth_ip($result){
        if(empty($result['AuthAddress'])){
            return true;
        }        
        if (count($result['AuthAddress'])<1){
            return true;
        }    
        foreach ($result['AuthAddress'] as $value){
            if($value['ip']==$_SERVER['REMOTE_ADDR']){
                return true;
            }
        }
        //var_dump($_SERVER['REMOTE_ADDR']);
        //**日志没处理  A('HuiWriteLog')->writeSystemLog("未授权的设备尝试登录".$result['Username']);        
        return false;
    }
   //退出登陆
   public function logout($msg=""){        
        //$this->assign("info",$msg);
        //if ($msg != ""){
        //    $strlogin = '<div class="check-box"><input type="checkbox" name="forcelogin" id="checkbox-2"><label for="checkbox-2">强制登录</label></div>';
        //    $this->assign("forcelogin",$strlogin);
        //}
        //A('Home/Writelog')->writeSystemLog($_SESSION['Username'].'安全退出.');
        //记录登录/登出日志
        //A('Crmlog/Loginlog')->add_control_data(1,1);
        A('Home/Index')->index();
   }

   /*
   win10登录
   根据当前用户，获取与之关联的角色、分组等权限数据
    */
   function win10login(){    
        if (empty($_SESSION)||empty($_SESSION['userinfo']) ||count($_SESSION['userinfo'])<3)
        {
        	$this->assign('info','请重新登录');
            //记录登录/登出日志
            //A('Crmlog/Loginlog')->add_control_data(0,0,array(false,'请重新登录'));
            $this->index();        
        }  
        //1.当前用户关联了哪些用户组 
        $usergroup=A('Crmuser/RefuserRefgroup')->getUserGroup($_SESSION['userinfo']['idusers'],true);
        $_SESSION['user_ref_groupids']=implode(",",array_keys($usergroup)); 
        //2.当前用户关联了哪些角色
        $usertype=A('Crmuser/RefuserRefutype')->getUserType($_SESSION['userinfo']['idusers'],true);
        $_SESSION['user_ref_typeids']=implode(",",array_keys($usertype)); 
        //2.1 当前用户的角色都具备哪些权限 
		$_SESSION['user_ref_authids']='';
        if(!empty($_SESSION['user_ref_typeids'])){
            $typeauth=A('Crmuser/RefutypeRefauth')->getTypeAuth($_SESSION['user_ref_typeids'],true);    
            $_SESSION['user_ref_authids']=implode(",",array_keys($typeauth));    
        }
        //3.appgroup与页面的关联关系
        $refapprefgroup = A('Crmuser/RefappgroupRefapp')->MSelect();          
		//appgroup分组与页面的关系
        $this->assign("refapprefgroup",$refapprefgroup);
        //4.获取当前用户能够访问的页面    
		       $_SESSION['user_ref_appids']='';      
        if(!empty($_SESSION['user_ref_authids'])){
            $appinfo = A('Crmuser/RefauthRefapp')->getAuthApp($_SESSION['user_ref_authids'],true);   
            $_SESSION['user_ref_appids']=implode(",",array_keys($appinfo));
        }
		 //页面
        $this->assign("appinfopage",$appinfo);
       
        //5.获取当前用户可以使用的appgroup,这里进行了过滤，如果分组中没有页面,就不显示了
        $appgrouppage = A('Crmuser/RefappgroupRefapp')->getAppGroupapp($_SESSION['user_ref_appids']);   
		//appgroup分组
		$this->assign("appgroup",$appgrouppage);
        //6.获取当前权限下可以显示的客户信息id
		//$customerrefuserData = A('Crmcustomerinfo/RefcusRefuser')->getCustomerData(array('idusers'=>$_SESSION['userinfo']['idusers']),true,true);
		//if(!empty($_SESSION['user_ref_typeids'])){
		//    $customerrefusertypeData = A('Crmcustomerinfo/RefcusRefutype')->getCustomerData(array('idusertype'=>$_SESSION['user_ref_typeids']),true,true);
		//}else{
		//    $customerrefusertypeData = array();
		//}
		//if(!empty($_SESSION['user_ref_groupids'])){
		//    $customerrefusergroupData = A('Crmcustomerinfo/RefcusRefugroup')->getCustomerData(array('idusergroup'=>$_SESSION['user_ref_groupids']),true,true);
		//}else{
		//    $customerrefusergroupData = array();
		//}
		//$auth_customerkeys = array_merge(array_keys($customerrefuserData),array_keys($customerrefusertypeData),array_keys($customerrefusergroupData));
		//$_SESSION['cus_ref_auth']=implode(",",array_unique($auth_customerkeys));
		////7.获取当前权限下可以显示的联系人信息id
		//$contactrefuserData = A('Crmcustomerinfo/RefcontactRefuser')->getContactData(array('idusers'=>$_SESSION['userinfo']['idusers']),true,true);
		//if(!empty($_SESSION['user_ref_typeids'])){
		//    $contactrefusertypeData = A('Crmcustomerinfo/RefcontactRefuserty')->getContactData(array('idusertype'=>$_SESSION['user_ref_typeids']),true,true);
		//}else{
		//    $contactrefusertypeData = array();
		//}
		//if(!empty($_SESSION['user_ref_groupids'])){
		//    $contactrefusergroupData = A('Crmcustomerinfo/RefcontactRefusergr')->getContactData(array('idusergroup'=>$_SESSION['user_ref_groupids']),true,true);
		//}else{
		//    $contactrefusergroupData = array();
		//}
		//$auth_contactkeys = array_merge(array_keys($contactrefuserData),array_keys($contactrefusertypeData),array_keys($contactrefusergroupData));
		//$_SESSION['contact_ref_auth']=implode(",",array_unique($auth_contactkeys));
        //8.获取当前权限下可以显示的工单信息id
        //$_SESSION['workorder_ref_auth'] = A('Crmschedule/Workorder')->getWorkorderData();
        //8.获取当前权限下可以显示的项目信息id
        //$_SESSION['project_ref_auth'] = A('Crmproject/Project')->getProjectData();
        //
        $_SESSION['ugroup_subset_users'] = A('Crmuser/Usergroup')->getusergroup_or_subset($_SESSION['user_ref_groupids']);
         A('Crmuser/Users')->lastlogintime();//记录上次登录时间
        if (C("SystemIdentification") == "EIM"){
            A("Ace")->index();
        }else{           
            //win10ui2.0动态组建桌面图标
            $this->getMenu($appinfo);
            //记录登录/登出日志
            //A('Crmlog/Loginlog')->add_control_data(0,1);
            $this->display('Home@Index:win10main');
        }
       
    }
    /*
    获取当前登录用户的图标
    */
    function getMenu($appinfo){ 
        $data=array(
            //运行配置 configs配置定义了UI的一些行为，它们大部分是视觉相关的。
            configs=>array(),
            //应用程序池 应用程序池是一系列应用（APP）的集合，而APP是YLUI的主要管理对象。
           apps=>array(), 
            //桌面图标数据 桌面图标是最常用的UI表现形式，它是APP的快捷方式。
            shortcuts=>array(),
            //磁贴数据 磁贴是一种视觉冲击力很强的UI形式，但是其数据结构比较复杂，推荐用YLUI的可视化工具编辑。
            tiles=>array(),
            //开始菜单数据 开始菜单包括左部侧边栏和菜单列表两部分
            startMenu=>array()
        );
        $data['configs']=$this->getConfigs();
        $data['apps']=$this->getApps($appinfo);
        $data['shortcuts']=$this->getShortcuts($data['apps']);
        $data['tiles']=$this->getTiles();
        $data['startMenu']=$this->getStartmenu();
        $result=json_encode($data);
        if ($result)
        {
        	 $this->assign('__menu',$result);
        }else{
            $this->assign('__menu','{}');
        }     
        return $data;   
       
    }
    //configs   | 运行配置     |configs配置定义了UI的一些行为，它们大部分是视觉相关的。
    function getConfigs(){
    return array(
        "topTaskBar"=> false,//任务栏是否置顶
        "sound"=> false,//是否开启声音（声音尚未实现） 
        "wallpaper"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg1.jpg",//当前壁纸url   这个同时处理了系统设置中的壁纸大图显示
        "wallpaperBlur"=> false,//壁纸是否模糊处理
        "wallpaperSlide"=> false,//幻灯片相关记录，由系统自动处理 
        "openMax"=> 9,//最多可以打开几个窗口
        "idCounter"=> 144,//内部计数器，由系统自动处理
        "themeColor"=> "rgba(2,35,64,1)",//主题色
        "autoThemeColor"=> true,//是否从壁纸获取主题色（跨域壁纸无效）
        "highPerformance"=> false,//是否开启高性能模式
        "highPerformanceOnMobile"=> true,//是否在移动端开启高性能模式
        "debug"=>true,//是否开启debug模式 开发阶段true，部署阶段用false
         //壁纸相册。数据机构: `[{"image":"壁纸url","preview":"壁纸预览url"},{...},{...}]`，其中`preview`字段可以省略
         "wallpapers"=> array(
                array(
                    "image"=> "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg1.jpg",
                    "preview"=> "./res/img/wallpapers/bg1_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg2.jpg",
                    "preview"=> "./res/img/wallpapers/bg2_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg3.jpg",
                    "preview"=> "./res/img/wallpapers/bg3_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg4.jpg",
                    "preview"=> "./res/img/wallpapers/bg4_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg5.jpg",
                    "preview"=> "./res/img/wallpapers/bg5_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg6.jpg",
                    "preview"=> "./res/img/wallpapers/bg6_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg7.jpg",
                    "preview"=> "./res/img/wallpapers/bg7_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg8.jpg",
                    "preview"=> "./res/img/wallpapers/bg8_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg9.jpg",
                    "preview"=> "./res/img/wallpapers/bg9_1.jpg"
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg10.jpg",
                    "preview"=> "./res/img/wallpapers/bg10_1.jpg"
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg11.jpg",
                    "preview"=> "./res/img/wallpapers/bg11_1.jpg"
                ),
                array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg12.jpg",
                    "preview"=> "./res/img/wallpapers/bg12_1.jpg"
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg13.jpg",
                    "preview"=> "./res/img/wallpapers/bg13_1.jpg"
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg14.jpg",
                    "preview"=> "./res/img/wallpapers/bg14_1.jpg"
                ),
               array(
                    "image"=> APP_PUBLIC."win10-ui/2.0.5/res/img/wallpapers/bg15.jpg",
                    "preview"=> "./res/img/wallpapers/bg15_1.jpg"
                )
            ),
            /*遗留属性，文档未注释,待查验
            "wallpaperSlideRandom"=> true,
            "wallpaperSlideItv"=> 1,
            "wallpaperSlideTime"=> 1519442460788,
            "wallpaperSlideIndex"=> 8,
            "pathRes": "./res",
            "shortcutsSortAuto": true,        
            "winBlur": true
            */
        );
    }
    //apps      | 应用程序池   |应用程序池是一系列应用（APP）的集合，而APP是YLUI的主要管理对象。
    function getApps($appinfo){
        $_apps=array();
        foreach($appinfo as $key=>$value){
            $_apps['eim-'.$key]=array(
                        "addressBar"=> false,//是否显示地址栏  
                        "autoRun"=> 0,//自启动。0表示不自启动，数字越大启动顺序越靠后。     
                        "background"=> false,//是否后置模式
                        "badge"=> 0,//角标
                        "desc"=> $value['description'],//APP描述说明性文字
                        //图标形式描述
                        "icon"=> array(
                        /*
                        "type"
                                "img"`使用图片图标，`"content"`字段填写图标的url。
                                "fa" 使用font-awesome字体图标，`"content"`字段填写图标名（如`"star"`，表示星星图标）
                                "str"`使用文字图标，`"content"`字段填写文字
                        */
                            "type"=> "str",
                            "content"=>$value['name'],
                            "bg"=> "#436fde"//"bg"`字段填写图标背景色，符合css3规范即可，如`"red"`                            
                        ),
                        "openMode"=> "normal",//打开方式。normal,max,min,outer    
                        "plugin"=> false,// 是否是插件型窗口
                        //窗口位置描述
                        "position"=> array(
                            "x"=> "x*0.05",//横向位移量单位px
                            "y"=> "y*0.05",//纵向位移量单位px
                            "left"=> true,//是否左对齐。false表示右对齐。
                            "top"=> true,//是否顶部对齐。false表示底部对齐。
                            "autoOffset"=> true//表示是否启用自动偏移。自动偏移会给窗口位置偏移`5px`左右，防止重复打开多个窗口的时候完全重叠在一起。
                        ),                        
                        "version"=> "1.0.0",//版本号
                        "poweredBy"=> "昕辰软件",//应用版权声明
                        "resizable"=> true,//是否可变窗体尺寸
                        "single"=> true,//是否单例模式（不能多开）
                        //描述窗体大小  如果不写会有默认值，并且是根据页面大小进行比例
                        //"size"=> array(
                            //"width"=> "920",//，宽度，支持尺寸表达式，单位px
                          //  "height"=> "590"//高度，支持尺寸表达式，单位px
                        //),
                        "title"=> $value['name'],//标题，应用名      
                        "url"=> $value['module'].'/'. $value['controller'].'/'. $value['function'],//url地址，推荐使用绝对地址，并以`//`开头
                        "customTile"=> "",//自定义磁贴的url地址，留空则使用默认磁贴样式 
                        "urlRandomToken"=> true,//是否为url自动添加随机token（减少浏览器读取页面缓存的概率）
                        "resizeable"=> true//未知，待查验
                );
        }
        $_apps["yl-system"]= array(
            //必须有APP的ID，且ID是唯一的               
                        "addressBar"=> false,//是否显示地址栏  
                        "autoRun"=> 0,//自启动。0表示不自启动，数字越大启动顺序越靠后。     
                        "background"=> false,//是否后置模式
                        "badge"=> 0,//角标
                        "desc"=> "YLUI系统设置面板",//APP描述说明性文字
                        //图标形式描述
                        "icon"=> array(
                        /*
                        "type"
                                "img"`使用图片图标，`"content"`字段填写图标的url。
                                "fa" 使用font-awesome字体图标，`"content"`字段填写图标名（如`"star"`，表示星星图标）
                                "str"`使用文字图标，`"content"`字段填写文字
                        */
                            "type"=> "fa",
                            "content"=> "gear",
                            "bg"=> "#436fde"//"bg"`字段填写图标背景色，符合css3规范即可，如`"red"`                            
                        ),
                        "openMode"=> "normal",//打开方式。normal,max,min,outer    
                        "plugin"=> false,// 是否是插件型窗口
                        //窗口位置描述
                        "position"=> array(
                            "x"=> "x*0.05",//横向位移量单位px
                            "y"=> "y*0.05",//纵向位移量单位px
                            "left"=> true,//是否左对齐。false表示右对齐。
                            "top"=> true,//是否顶部对齐。false表示底部对齐。
                            "autoOffset"=> true//表示是否启用自动偏移。自动偏移会给窗口位置偏移`5px`左右，防止重复打开多个窗口的时候完全重叠在一起。
                        ),                        
                        "version"=> "1.0.0",//版本号
                        "poweredBy"=> "昕辰软件",//应用版权声明
                        "resizable"=> true,//是否可变窗体尺寸
                        "single"=> true,//是否单例模式（不能多开）
                        //描述窗体大小
                        //"size"=> array(
                        //    "width"=> "920",//，宽度，支持尺寸表达式，单位px
                        //    "height"=> "590"//高度，支持尺寸表达式，单位px
                        //),
                        "title"=> "系统设置",//标题，应用名      
                        "url"=> APP_PUBLIC."win10-ui/2.0.5/res/apps/yl-system/index.html",//url地址，推荐使用绝对地址，并以`//`开头
                        "customTile"=> "",//自定义磁贴的url地址，留空则使用默认磁贴样式 
                        "urlRandomToken"=> true,//是否为url自动添加随机token（减少浏览器读取页面缓存的概率）
                        "resizeable"=> true//未知，待查验                
        );
        $_apps["eimselectdetailed"]= array(
            //必须有APP的ID，且ID是唯一的               
                        "addressBar"=> false,//是否显示地址栏  
                        "autoRun"=> 0,//自启动。0表示不自启动，数字越大启动顺序越靠后。     
                        "background"=> false,//是否后置模式
                        "badge"=> 0,//角标
                        "desc"=> "详情页",//APP描述说明性文字
                        //图标形式描述
                        "icon"=> array(
                        /*
                        "type"
                                "img"`使用图片图标，`"content"`字段填写图标的url。
                                "fa" 使用font-awesome字体图标，`"content"`字段填写图标名（如`"star"`，表示星星图标）
                                "str"`使用文字图标，`"content"`字段填写文字
                        */
                            "type"=> "fa",
                            "content"=> "file-text",
                            "bg"=> "#436fde"//"bg"`字段填写图标背景色，符合css3规范即可，如`"red"`                            
                        ),
                        "openMode"=> "normal",//打开方式。normal,max,min,outer    
                        "plugin"=> false,// 是否是插件型窗口
                        //窗口位置描述
                        "position"=> array(
                            "x"=> "x*0.05",//横向位移量单位px
                            "y"=> "y*0.05",//纵向位移量单位px
                            "left"=> true,//是否左对齐。false表示右对齐。
                            "top"=> true,//是否顶部对齐。false表示底部对齐。
                            "autoOffset"=> true//表示是否启用自动偏移。自动偏移会给窗口位置偏移`5px`左右，防止重复打开多个窗口的时候完全重叠在一起。
                        ),                        
                        "version"=> "1.0.0",//版本号
                        "poweredBy"=> "昕辰软件",//应用版权声明
                        "resizable"=> true,//是否可变窗体尺寸
                        "single"=> false,//是否单例模式（不能多开）
                        //描述窗体大小
                        //"size"=> array(
                        //    "width"=> "1220",//，宽度，支持尺寸表达式，单位px
                        //    "height"=> "490"//高度，支持尺寸表达式，单位px
                        //),
                        "title"=> "详情页",//标题，应用名      
                        "url"=> "",//url地址，推荐使用绝对地址，并以`//`开头
                        "customTile"=> "",//自定义磁贴的url地址，留空则使用默认磁贴样式 
                        "urlRandomToken"=> true,//是否为url自动添加随机token（减少浏览器读取页面缓存的概率）
                        "resizeable"=> true//未知，待查验                
        );
        $_apps["bulletin"]= array(
            //必须有APP的ID，且ID是唯一的               
                        "addressBar"=> false,//是否显示地址栏  
                        "autoRun"=> 0,//自启动。0表示不自启动，数字越大启动顺序越靠后。     
                        "background"=> false,//是否后置模式
                        "badge"=> 0,//角标
                        "desc"=> "公告板",//APP描述说明性文字
                        //图标形式描述
                        "icon"=> array(
                        /*
                        "type"
                                "img"`使用图片图标，`"content"`字段填写图标的url。
                                "fa" 使用font-awesome字体图标，`"content"`字段填写图标名（如`"star"`，表示星星图标）
                                "str"`使用文字图标，`"content"`字段填写文字
                        */
                            "type"=> "fa",
                            "content"=> "file-text",
                            "bg"=> "#436fde"//"bg"`字段填写图标背景色，符合css3规范即可，如`"red"`                            
                        ),
                        "openMode"=> "normal",//打开方式。normal,max,min,outer    
                        "plugin"=> false,// 是否是插件型窗口
                        //窗口位置描述
                        "position"=> array(
                            "x"=> "x*0.00",//横向位移量单位px
                            "y"=> "y*0.06",//纵向位移量单位px
                            "left"=> false,//是否左对齐。false表示右对齐。
                            "top"=> true,//是否顶部对齐。false表示底部对齐。
                            "autoOffset"=> false//表示是否启用自动偏移。自动偏移会给窗口位置偏移`5px`左右，防止重复打开多个窗口的时候完全重叠在一起。
                        ),                        
                        "version"=> "1.0.0",//版本号
                        "poweredBy"=> "昕辰软件",//应用版权声明
                        "resizable"=> false,//是否可变窗体尺寸
                        "single"=> true,//是否单例模式（不能多开）
                        //描述窗体大小
                        "size"=> array(
                            "width"=> "350",//，宽度，支持尺寸表达式，单位px
                            "height"=> "450"//高度，支持尺寸表达式，单位px
                        ),
                        "title"=> "公告板",//标题，应用名      
                        "url"=> "/index.php/Crmsetting/Bulletin/index",//url地址，推荐使用绝对地址，并以`//`开头
                        "customTile"=> "",//自定义磁贴的url地址，留空则使用默认磁贴样式 
                        "urlRandomToken"=> true,//是否为url自动添加随机token（减少浏览器读取页面缓存的概率）
                        "resizeable"=> true//未知，待查验                
        );
        return $_apps;
    }
    //shortcuts | 桌面图标数据 |桌面图标是最常用的UI表现形式，它是APP的快捷方式。
    function getShortcuts($apps){

        $shortcuts=array();        
        foreach($apps as $key=>$value){
            //当循环到详细页面或公告板的时候跳出循环---方法要改
            if($key == 'eimselectdetailed'|| $key == 'bulletin'){
                continue;
            }
            array_push($shortcuts,array(app=>$key,title=> $value['title']));
        }
        return $shortcuts;
       // return array(
            //,          
            //array(
            //    app=>"yl-browser",// APP id     
            //    title=> "浏览器",//标题文字
            //    params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //    hash=>"",// url 锚点    
            //),
            //array(
            //    app=>"yl-app-store",// APP id     
            //    title=> "应用商店",//标题文字
            //    params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //    hash=>"",// url 锚点    
            //),
            //array(
            //    app=>"yl-app-home",// APP id     
            //    title=> "官网",//标题文字
            //    params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //    hash=>"",// url 锚点    
            //),
            //array(
            //    app=>"yl-app-group",// APP id     
            //    title=> "分组",//标题文字
            //    params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //    hash=>"",// url 锚点    
            //    children=>array(
            //                    array(
            //                        app=>"yl-app-home",// APP id     
            //                        title=> "官网",//标题文字
            //                        params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //                        hash=>"",// url 锚点    
            //                    ),
            //                    array(
            //                        app=>"yl-browser",// APP id     
            //                        title=> "浏览器",//标题文字
            //                        params=>array(),//url query 键值对，如`{"a":"A","b":"B"}
            //                        hash=>"",// url 锚点    
            //                    )
            //    )
            //),
      
      
      //  );
    }
    // tiles     | 磁贴数据     |磁贴是一种视觉冲击力很强的UI形式，但是其数据结构比较复杂，推荐用YLUI的可视化工具编辑。
    function getTiles(){
        return array(
                array(
                        "title"=> "系统",//磁铁分类标题
                        //该分类下的图标
                        "data"=>array(
                                array(
                                    "x"=>0,//左偏移
                                    "y"=>0,//上偏移
                                    "w"=>6,//宽度
                                    "h"=>3,//高度
                                    "app"=>"yl-system",//APP id     
                                    "title"=>"应用商店",//APP 标题
                                    "i"=>"91",// key，对所有磁贴唯一 
                                    "params"=>array(),//类似于桌面图标的params定义
                                    "hash"=>""//类似于桌面图标的hash定义 
                                )
                        )
                )    
        );
    }
    //startMenu | 开始菜单数据 |开始菜单包括左部侧边栏和菜单列表两部分
    function getStartmenu(){
        return array(
        //左侧部分
                sidebar=>array(
                            array(
                                "app"=> "yl-system",
                                "title"=> "浏览器",
                                "params"=> array(),
                                "hash"=> ""
                            )
                ),
        //下拉菜单部分
                menu=>array(
                        
                         "itemPushed-96"=> array(
                                "app"=> "yl-system",
                                "title"=>"系统设置"
                          )
                )
    
        );
    }

}