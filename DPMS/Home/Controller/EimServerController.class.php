<?php
namespace Home\Controller;
use Think\Controller\RpcController;
class EimServerController extends RpcController {    
    public function connect($name){
        return $name;
    }

    public function _empty() {
        $this->display('h-ui-admin/404');
    }

     /*
    获取服务器信息,账号、密码、上传路径、录制视频参数、是否录制
    参数：taskid
    */

    function getInfo($_id=''){
        $videosetdata = $this->get_video_set_data();
        $info="`path:".C('VIDEO_SAVEPATH');
        $info.="`user:root";
        $info.="`pwd:".C('SERVER_PWD');
        $info.="`ImageWidth:".$videosetdata['VideoWidth'];
        $info.="`ImageHeight:".$videosetdata['VideoHeight'];
        $info.="`FrameRate:".$videosetdata['VideoFrameRate'];       
        $info.="`VideoFileTime:".$videosetdata['VideoFileTime'];       
        $info.="`Target:".$videosetdata['Target']; //录制目标：窗口=Form or 桌面=DeskTop
        $info.="`ip:".$videosetdata['ServerIP'];
        /*
            是否启用录制:
            1.检查授权中是否录制
            2.检查录制规则中是否添加了当前设备不录制 true表示录制，false表示不录制
			3.2017-05-31 18:38:45 检查工单类型为：apprelease（应用发布方式开启会话），则不录制
        */
        $info.="`isRecord:".$this->get_isRecord($_id);
        //是否自动结束工单 0：自动，1：手动
        $sessionendrule = $this->get_sessionCloseType();        
        $info.="`sessionEndRule:".(intval($sessionendrule) == 0 ? "true" : "false");
        //return $info;
        return $this->_DECgetInfo($info);
    }
    /*
    获取工单任务详细信息
    */
   public function getSessionTask($key){
        $data = array('ideimworklog'=>$key);
        $result=A('Eimaudit\Eimworklog')->MSelect($data);
		//return json_encode($result);
        if (count($result)>10){			
            $str="ideimworklog:".$result['ideimworklog'];
            if(array_key_exists("userid",$result)){
                $str.="`userid:".$result['userid'];
            }
            if(array_key_exists("sessiontypeid",$result)){
                $str.="`sessiontypeid:".$result['sessiontypeid'];
            }
            if(array_key_exists("sessiontypename",$result)){
                $str.="`sessiontypename:".$result['sessiontypename'];
            }
            if(array_key_exists("status",$result)){
                $str.="`status:".$result['status'];
            }
            if(array_key_exists("refdeviceid",$result)){
                $str.="`refdeviceid:".$result['refdeviceid'];
            }
			if(array_key_exists("refdevicetype",$result)){
                $str.="`refdevicetype:".strval($result['refdevicetype']);
            }
            if(array_key_exists("deviceinfo",$result)){
                $deviceinfo = json_decode($result['deviceinfo'], true);
                if(array_key_exists("ip",$deviceinfo)){
                    $str.="`deviceip:".$deviceinfo['ip'];
                }
                if(array_key_exists("devicename",$deviceinfo)){
                    $str.="`devicename:".$deviceinfo['devicename'];
                }
                if(array_key_exists("loginuser",$deviceinfo)){
                    $str.="`loginuser:".$deviceinfo['loginuser'];
                }
                if(array_key_exists("loginpwd",$deviceinfo)){
                    $str.="`loginpwd:".$deviceinfo['loginpwd'];
                }
            }
            $str.="`username:".$_SESSION['username'];
            return $this->_DECgetInfo($str);
            //return $str;
        }
        return "false";
    }

	

    /*
    创建会话记录
    $sid:
    $client:
    */
    function createSessionLog($_id,$content){
        $value=array('Taskid'=>$_id,'Type'=>'video','Content'=>$content);
        $model =new \Model\EIMServer();       
        return json_encode($model->createAudit($value));
    }
    /*
    更改工单任务为已连接
    $seach:
    */
    function connectSession($_id){
        /*
        0/1/2/3/4/5
        0表示待连接-审批完成,可操作
        1表示待审批，审批后才会进入0待连接状态
        2已连接/正在连接/工单正在执行
        3任务已结束/工单执行结束
        */
        $data = array('ideimworklog'=>$_id,'status'=>2);
        return json_encode(A('Eimaudit\Eimworklog')->MUpdate($data));
    }
    /*
    关闭工单任务
    */
    public function closeSession($_id){    
        $data = array('ideimworklog'=>$_id,'status'=>3);
        return json_encode(A('Eimaudit\Eimworklog')->MUpdate($data));
    }

    //字符串加密
    function _DECgetInfo($info){
        $info = base64_encode($info); //base64_encode 将字符串以 BASE64 编码
        $info = strrev($info);
        return $info;
    }
    
    //是否录制
    function get_isRecord($taskid){        
        //1.检查授权是否录制

        $model=new \Model\SystemsettingModel();
        $license=$model->get_license();
        unset($model);
        if($license['S_Audit'] != "True"){
            return "false";
        }else{
			$obj=new \Model\TasklistModel();
			$taskinfo=$obj->getSessionTask($taskid);
			unset($obj);
        //2.检查录制规则-判断当前用户是否对当前会话的设备开启录制功能
		//2.0检查工单类型：是否为应用发布方式i开启会话，是则不录制
			$sessiontype=$taskinfo['Sessiontype'];
			if($sessiontype == "web_umg_kvm" || $sessiontype == "web_mpu_kvm"){
				return "false";		
			}
        //2.1查询当前打开会话的用户id和设备id           
            $userid=$taskinfo['Userid'];
            $deviceoid=$taskinfo['Deviceid'];
        //2.2查询录制规则表数据
            $obj=new \Model\HuiKvmModel();
            $auditdata=$obj->get_audit_data($parms);
            unset($obj);
            foreach($auditdata as $v){
                if($v['userid'] == $userid && $v['deviceoid'] == $deviceoid){
                    return "false";
                }
            }
        }
        return "true";
    }

    

    //视频录制参数-宽、高、帧数、长度、服务器地址、录制目标（窗体 or 桌面）
    public function get_video_set_data(){
        $model=new \Model\DraDeviceTransModel();
        $result=$model->get_video_setting();
        unset($model);
        return $result;
    }

    //更新用户的超时时间-客户端每隔30秒调用一次
    public function update_user_timespan($username){
        $model=new \Model\UserlistModel();
        $result=$model->M_update_user_timespan($username);
        unset($model);
        return json_encode($result);
    }
	
	
}
?>
