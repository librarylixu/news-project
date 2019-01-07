<?php
namespace Home\Controller;
use Think\Controller;
/*
首页
*/
class HomepageController extends Controller {
    //空控制器操作
    public function _empty(){
		A("Empty")->_empty();
    }

	public function index(){
		$getdata = $_GET;
		//普通用户显示简单首页
        if($_SESSION['Usertype'] == 0){		
			//登陆检测用户密码复杂度，过低时提示，普通用户则再首页添加修改密码链接
			$this->assign('pwd_warning_msg',$getdata['pwdinfo']);
            $this->display(A("Home/Html")->homePage());
		}else{
			$this->get_homepage_data();
            $this->assign("MenuName","首页");
			$this->assign("PageName","主要信息展示");
            $this->display(A("Home/Html")->homePage());
		}
	}
	 //首页数据 - 基本信息、磁盘使用率
    public function get_homepage_data(){
        include C('SYSTEM_PATH');
    }
    public function test(){
     $this->display('Index/ui-grid');
    }
     public function test1(){
     $this->display('Index/test');
    }
	//首页数据 - 设备信息
	function async_system_devicecharts_data(){
		// 类型 => 数量
        $device_result=array();
        //1.KVM设备
		$where = array();
		$where['is_filter'] = false;//不根据权限过滤设备
		$where['parentID'] = 0;
		$where['is_cursor'] = true;//返回游标
        $kvmdevicetype = A('Eimdevice/Kvmdevice')->getKVMDevice_EIM($where);
        //*根据设备类型统计
        foreach($kvmdevicetype as $device){
            //判断类型是否已存在
            if(array_key_exists($device['DeviceType'],$device)){
                $device_result[$device['DeviceType']] += 1;
            }else{
                $device_result[$device['DeviceType']] = 1;
            }
        }
        //2.DPU设备
		$where = array();
		$where['is_filter'] = false;//不根据权限过滤设备
		$where['is_cursor'] = true;//返回游标
        $dpudevice = A('Eimdevice/Dpmsdpulist')->get_dpu_datalist($where);
		foreach($dpudevice as $device){
            array_push($dpuDeviceTypeNum,$device['dputype']);
            //判断类型是否已存在
            if(array_key_exists($device['dputype'],$device)){
                $device_result[$device['dputype']]+=1;
            }else{
                $device_result[$device['dputype']]=1;
            }
        }
		//3.资产设备
		$where = array();
		$where['is_filter'] = false;//不根据权限过滤设备
		$where['is_cursor'] = true;//返回游标
		$accetsdevice = A('Eimdevice/Accetsdevice')->get_AssetsDevice_data($where);
		if(count($accetsdevice) > 0){
			$device_result['资产设备']=count($accetsdevice);
		}
        $this->ajaxReturn($device_result);  
	}

	//首页数据 - 用户信息
	function async_system_usercharts_data(){
		//用户类型=>数量
        $usergroup_result=array();
        //用户组数据

        $usergroupdata = A('Eimbase/Usergroup')->get_usergroup_data();
        //用户数据 - 统计管理员使用 - 返回游标
        $userdata = A('Eimbase/Userlist')->get_user_data();
		//$usergroupstr = "";$usernum ="";
        $usergroup_result=array();
        foreach($userdata as $user){
         if(strval($user['Usertype']) == "1"){
            if(array_key_exists('管理员',$usergroup_result)){
                    $usergroup_result['管理员']['value']+=1;
            }else{
                $usergroup_result['管理员']=array(value=>1,name=>'管理员');
            }
         }else{            
            if(array_key_exists($user['UserGroup'],$usergroup_result)){
                $usergroup_result[$user['UserGroup']]['value']+=1;
            }else{
                $usergroup_result[$user['UserGroup']]=array(value=>1,name=>$usergroupdata[$user['UserGroup']]['groupName']);
            }
          }
        }
        $this->ajaxReturn(array_values($usergroup_result));   
	}









}