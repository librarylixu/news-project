<?php
namespace Crmlog\Controller;
use Think\Controller;
/*
    项目操作日志
*/
class ProjectlogController extends CommonController {
   public $model;//数据库对象
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mProjectlogModel();
   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //项目操作日志
    public function index(){
        //$this->assign("mainController","eimSystemlogController");
		$this->display('Crmlog@Projectlog:index'); 
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
    public function select_page_data($parameter = array()){
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
        $parameter = [];
        $parameter = $_POST;
        $parameter['projectid'] = $parameter['id'];
        $parameter['time'] = time();
        $parameter['username'] = $_SESSION['userinfo']['description'] ;
        $parameter['type'] = 0;
        $data=$this->MInsert($parameter);
        $this->ajaxReturn($data);
    }
    /*新增数据控制器使用*/
    public function add_control_data($par){
        $parameter = [];
        $parameter = $par;
        $parameter['projectid'] = $parameter['id'];
        $parameter['time'] = time();
        $parameter['username'] = $_SESSION['userinfo']['description'] ;
        //$parameter['type'] = $parameter['type'];
        $data=$this->MInsert($parameter);
        return $data;
    }
    /*异步更新数据---未处理*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MUpdate($_POST);
        $this->ajaxReturn($data);
    }
    public function test(){
        $p['message'] = '添加项目<北京昕辰清虹科技有限公司>：成功';
        $p['type'] = 1;
        $p['id'] = 1;
        $result = $this->add_control_data($p);
        var_Dump($result);
    }
}