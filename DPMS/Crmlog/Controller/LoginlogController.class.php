<?php
namespace Crmlog\Controller;
use Think\Controller;
/*
    登录日志
*/
class LoginlogController extends CommonController {
   public $model;//数据库对象
   public $appid = 45;//页面固定ID
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mLoginlogModel();
   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //登录日志
    public function index(){
        $this->assign("mainController","crmLoginlogController");
        $this->assign("appid",$this->appid);
		$this->display('Crmlog@Loginlog:index-angular');
    }
	//插入数据
    //直接传text = '添加设备[EIM-min];结果：成功'
	function MInsert($parameter){
		$result=parent::MInsert($parameter);
        return $result;
	}
    /*
		查询数据
		$parameter查询参数，这里有两个特殊的key,$findOne\$cursor\$colunms
		$findOne 是否进行一次查询
		$cursor 是否需要返回游标
		$colunms 查询指定的列  array(columnname=>1);
        调用父类，在控制器中规定下类型，并且设定下时间
    */
    function MSelect($parameter=array('$findOne'=>false,'$cursor'=>false,'$colunms'=>array())){
        
        $data = parent::Mselect($parameter);
        return $data;
    }
    /*异步查询数据*/
     /*
    前台传过来的数据
        1.无 stime 无 etime
        2.有 stime 无 etime
        3.有 stime 有 etime
        4.无 stime 有 etime
    */
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        $where = array();
        $where['time'] = F_getWhere($where,$parameter);//根据时间查询
        if($parameter['userid']){
            $where['userid'] = intval($parameter['userid']);  
        }
        if($parameter['result'] != null){
            $where['result'] = intval($parameter['result']);
        }
        if($parameter['type'] != null){
            $where['type'] = intval($parameter['type']); 
        }
        $where['$cursor'] = true;//查询游标
        $data=$this->MSelect($where);
        $limit=intval($parameter['pageCount']);//每页显示多少条
        $pagenow=intval($parameter['thisPageCount']?$parameter['thisPageCount']:1)-1;//当前第几页
        $pagenow=($pagenow>-1)?$pagenow:0;
        $skip=$limit*$pagenow;//数据库中需要跳过多少条
        $result = array();
        $newdata = $data->skip($skip)->limit($limit);
        foreach($newdata as $k=>$v){
            $v['time']=date('Y-m-d H:i:s',$v['time']);
            $result['data'][$k]=$v;
        }
        $result['count'] = $data->count();
        $this->ajaxReturn($result);
    }
    /*异步新增数据*/
    public function add_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $par = $_POST;
        $parameter['text'] = $par['text'];
        $parameter['time'] = time();
        $parameter['username'] = $_SESSION['userinfo']['username'] ;
        $parameter['status'] = $par['status'];//0登录或1登出
        $parameter['ipaddress'] = F_getClientIP();
        $data=$this->MInsert($parameter);
        $this->ajaxReturn($data);
    }
    /*
        控制器新增数据---给控制器使用
        避免到前台还要组件参数，所以这里直接用多个参数的办法
        $message  组件message用的，只传失败的时候的失败原因
        $type  0登录或1登出
        $result 结果
        模板
            时间戳 - 登录成功，登录账号为：lix; 昵称为：李旭
            时间戳 - 退出成功，退出账号为：lix; 昵称为：李旭
            时间戳 - 登录失败，登录账号为：lix; 失败原因：账号或密码不正确
            时间戳 - 退出失败，退出账号为：lix; 失败原因：账号或密码不正确
    */ 
    public function add_control_data($type,$result,$message=''){
        //初始化
        $username = $_SESSION['userinfo']['username'];
        //组件往数据库添加的参数
        $parameter['userid'] = $_SESSION['userinfo']['idusers'];//登录人
        $parameter['username'] = $_SESSION['userinfo']['username'];//记录username
        $parameter['time'] = time();//时间戳
        $parameter['ipaddress'] = F_getClientIP();//访问段IP
        $parameter['result'] = $result;//结果 失败：0 成功：1 未知：2
        $parameter['type'] = $type;//0登录或1登出
        //把message重新附一下值,
        $meg = $message;
        //判断结果
        if(!$result && $type == 0){
            //失败并在登录的时候，记录下当时他填写的username
            $username = $message[0]?$message[0]:'未知';
            $meg = $message[1];
        }
        //组件message的模板
        $parameter['message'] = date('Y-m-d H:i:s',$parameter['time']).' - '.($type==1?'退出':'登录').($result==1?'成功':'失败').','.($type==1?'退出':'登录').'账号为：'.$username.'; '.(($result==1)?'昵称为：'.$_SESSION['userinfo']['description']:'失败原因：'.$meg);
        
        $data=$this->MInsert($parameter);
        return $data;
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
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $parameter = $_POST;
        //如果是根据时间清除日志，则检测
        if(array_key_exists('sTime',$parameter) && array_key_exists('eTime',$parameter)){
            $parameter['sTime'] = date("Y-m-d",$parameter['sTime']);
            $parameter['eTime'] = date("Y-m-d",$parameter['eTime']);
            $stt=strtotime($parameter['sTime']." 00:00:00");
            $ett=strtotime($parameter['eTime']." 23:59:59");   
            $where['time'] = array('$gte'=>intval($parameter['sTime']),'$lte'=>intval($parameter['eTime']));
        }
        $data=$this->MDelete($where);

        $this->ajaxReturn($data);
    }
}