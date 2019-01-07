<?php
namespace Eimlog\Controller;
use Think\Controller;
/*
    DPU运行日志
	2018年2月28日 10:27:22	闫绪杰

*/
class SystemlogController extends CommonController {
   public $model;//数据库对象
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mSystemlogModel();
   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    //系统操作日志
    public function index(){
        $this->assign("mainController","eimSystemlogController");
		$this->display('Eimlog@Systemlog:index-angular');
    }
	//插入数据
    //直接传text = '添加设备[EIM-min];结果：成功'
	function MInsert($text=array()){
        $parameter['text'] = $text;
        $parameter['time'] = time();
        //$_SESSION['userinfo']['idusers']  session暂时没有设置
        $parameter['username'] = 'admin';
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
        //var_dump($where);exit();
        $where['$cursor'] = true;//查询游标
        $data=$this->MSelect($where);
        $limit=intval($parameter['pageCount']);//每页显示多少条
        $pagenow=intval($parameter['thisPageCount']?$parameter['thisPageCount']:1)-1;//当前第几页
        $pagenow=($pagenow>-1)?$pagenow:0;
        $skip=$limit*$pagenow;//数据库中需要跳过多少条
        $result = array();
        $data = $data->skip($skip)->limit($limit);
        foreach($data as $k=>$v){
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
    //测试添加100条数据    86400
    function test(){
        $parameters = array();
        for($i=0;$i<10000;$i++){
            $parameters['text'] = '测试数据---'.$i;
            $parameters['username'] = 'admin';
            $parameters['time'] = time()-86400*$i;
            $data=parent::MInsert($parameters);
        }
        if($data){
            echo '成功';
        }else{
            echo '失败';
        }
    }
}