<?php
/*
2018年4月28日 11:42:31	闫绪杰
开启会话

*/
namespace Eimsessiontools\Controller;
use Think\Controller;
class SessiontoolController extends Controller {
    //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    function index(){
        $this->redirect('Home/Login/index', array(), 0, '页面跳转中...');
    }
	//open ssh telnet rdp vnc 
	public function open_session_page(){
		if(!IS_POST || empty($_POST['id'])){
           echo "非法提交";
           exit;
        }
		$postdata = $_POST;
         $this->assign('id',$postdata['id']);       
        	$sessiontype = strtolower($postdata['sessiontype']);
		    $this->display('sessiontool/'.$sessiontype);       
	}

    public function open_playback_page(){
		if(!IS_POST || empty($_POST['file'])){
           echo "非法提交";
           exit;
        }
		$postdata = $_POST;		
        $this->assign('file',$postdata['file']);
        if(array_key_exists('sessioncenterip',$_POST)){
            $this->assign('sessioncenterip',$postdata['sessioncenterip']);	
        }
        $this->assign('type',$postdata['type']);      
        $this->display('sessiontool/playeremote');
        //$this->display('sessiontool/player');
	}
	 public function open_websocket_page(){
     $this->display('sessiontool/websocket');

     }
}