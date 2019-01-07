<?php
/*
     李旭
   2018/08/27
   文件共享
*/
namespace Crmsetting\Controller;
use Crmuser\Controller\CommonController;
class FileController extends CommonController {
    public $model;//数据库对象
   public $appid = 42;//页面固定ID
   function __construct(){  
       parent::__construct();  
       $this->model=new \Model\mFileModel();
   }
   function  __destruct(){     
      unset($this->model);
   }
    //空控制器操作
    public function _empty(){
		 $this->display(A('Home/Html')->error404());
    }
    /*展示页面*/
    public function index(){  
        $this->assign("MenuName","文件共享");
		$this->assign("PageName","公司文件公共存储及下载");
        $this->assign("mainController","crmFileController");
        //用户名称
        $this->assign("username",$_SESSION['userinfo']['username']);
        //页面固定ID
        $this->assign("appid",$this->appid);
        $data = $this->select_page_data();
        //页面数据
        $this->assign("filedata",$data);
        $this->display('Crmsetting@File:index-angular');
    }
   
    /*查询数据*/
    public function select_page_data(){
        $data=$this->model->select();
        $hisData = array();
        foreach($data as $value){
            $hisData[$value['fileid']] = $value;
        }
        return $hisData;
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $_POST['where'] = json_decode($_POST['where'],true);
        $_POST['time'] = time();
        $data=$this->model->update($_POST,'$set',array(upsert=>true,multiple=>false));
        /*
            _action 0：添加 1：修改  2：删除 3 查询
            _result 0 失败 1成功
        */
        $par['id'] = $_POST['fileid'];
        $par['file'] = $_POST['file'];
        $result = A('Crmlog/Filelog')->add_control_data($par);  
        $this->ajaxReturn($data);
    }
    //异步获取页面组件tree的数据源
    public function select_treefile_data(){
        include_once './doc/file.php';
        //组件tree
        $this->ajaxReturn($treedata);
    }
    //
    public function insert_db($treedata = array()){
        if(empty($treedata)){
            include_once './doc/file.php';
        }
        $parameter['file'] = '';
        $parameter['time'] = time();
        //开始递归循环
        foreach($treedata as $value){
            $parameter['fileid'] = $value['id'];
            if($value['children']){
                $this->insert_db($value['children']);
            }
            $parameter['where'] = array('fileid'=>$value['id']);
            $this->model->update($parameter,'$set',array(upsert=>true,multiple=>false));
        }
    }
}