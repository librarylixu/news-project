<?php
/*
	2018.08.1 lsq
	系统设置 - 发送邮件通知	
*/
namespace Eimsystemsetting\Controller;
use Think\Controller;
class MailController extends Controller {	
	function __construct(){  
        parent::__construct();        
    }
    function  __destruct(){   
    }	   //空控制器操作
    public function _empty(){
		$this->display(A('Home/Html')->error404());		
    }
    //工单状态
    var $workStatus=array( 
    0=>'未确认',
    1=>'进行中',
    2=>'待结单',
    3=>'已完成',
    4=>'已中止');
     //工单状态邮件通知模板
     var $workMail_msg='<div>
        <p>您好:</p>
        <p style="padding-left:40.0px;">
            由%s在 <u>%s</u> 发起<b>%s</b>工单,指派给<b>%s</b>处理此项工作,期望完成时间:<u>%s</u><br />
        </p>
        <p style="padding-left:40.0px;">客户:<b>%s</b></p>
        <p style="padding-left:40.0px;">项目:<b>%s</b></p>
        <p style="padding-left:40.0px;">当前工单状态:<b>%s</b></p>
        <p style="padding-left:40.0px;">工单详情请点击登陆CRM查看<a href="http://www.qhoa.net" target="_blank">http://www.qhoa.net</a><br /></p>
        <br>
        <p style="float:right;margin:.0px;">昕辰CRM云办公系统</p><br>
        <p style="float:right;margin:.0px;">%s</p><br />
        <p style="float:right;margin:.0px;">北京昕辰清虹科技有限公司</p><br>
        </div>';
        //工单状态邮件通知补全
      var $workMail_values=array(
                    0=>' 未知创建人 ',
                    1=>' 未知时间 ',
                    2=>' 未知工单名称 ',
                    3=>' 未知执行人 ',
                    4=>' 未指定 ',
                    5=>' 未关联客户 ',
                    6=>' 未关联项目 ',
                    7=>' 未知状态 ',
                    8=> ' 发件时间 ');
   /*
   工单状态变更通知
   $workid工单ID
   */
   function workerStatusNotice($workid=-1){  
           try
           {   
                   //2.通知给创建者、执行者、抄送人
                   //2.1 根据工单id查询工单信息
                   $workInfo=A('Crmschedule/Workorder')->MSelect(array('idworkorder'=>$workid,'$find'=>true));
                   if (!$workInfo)
                   {
                        //工单不存在或已删除
           	            return -1;
                   }
                   //发起时间
                   $this->workMail_values[1]=date("Y年m月d日H时i分",$workInfo['createtime']);   
                   //工单名称
                   $this->workMail_values[2]=$workInfo['title'];       
                   //期望解决时间
                   if ($workInfo['expectationendtime'])
                   {
           	         $this->workMail_values[4]=date("Y年m月d日",$workInfo['expectationendtime']);     
                   }        
                   //工单状态
                   $this->workMail_values[7]=$this->workStatus[$workInfo['status']];
                   //这里要把人员都查出来
                   $userids=array();
                   if ($workInfo['userid'])
                   {
           	            array_push($userids,$workInfo['userid']);
                   }
                   if ($workInfo['assignid'])
                   {
           	            array_push($userids,$workInfo['assignid']);
                   }
                   if ($workInfo['refusers'])
                   {
           	            $userids=array_merge($userids,explode(",",$workInfo['refusers']));
                   }
                   //数组去重
                  $userids= array_unique($userids);
         
                  //得到该工单关联的人
                  $users=A('Crmuser/Users')->MSelect(array('idusers'=>$userids,'$in'=>true,'$json'=>true));
                  //创建人
                  if ($users[$workInfo['userid']])
                  {
          	         $this->workMail_values[0]=$users[$workInfo['userid']]['description'];
                  }
                  //指派人
                  if ($users[$workInfo['assignid']])
                  {
          	         $this->workMail_values[3]=$users[$workInfo['assignid']]['description'];
                  }
                  // var_dump($users);
                   //3.获取工单关联的客户
                   if ($workInfo['refcustomerid'])
                   {
                        $cusids=explode(",",$workInfo['refcustomerid']);
                        $customers=A('Crmcustomerinfo/Customerinfo')->MSelect(array('idcustomerinfo'=>$cusids,'$in'=>true));
                        if ($customers)
                        {
                	        $this->workMail_values[5]='';
                        }                
                        foreach ($customers as $v)
                        {
                	        $this->workMail_values[5].="[".$v['name']."]";
                        }
                   }          
                   //4.获取工单关联的项目 
                   if($workInfo['refprojectid'])
                   {
           	            $projectids=explode(",",$workInfo['refprojectid']);
                        $projects=A('Crmproject/Project')->MSelect(array('idproject'=>$projectids,'$in'=>true));              
                        if ($projects)
                        {
                	        $this->workMail_values[6]='';
                        }                  
                        foreach ($projects as $v)
                        {
                	        $this->workMail_values[6].="[".$v['name']."]";
                        }
                   }
                     //5.收件人
                    $mailTo=array();
                    foreach ($users as $v)
                    {
                        if (!$v['mail'])
                        {
            	            continue;
                        }
                        array_push($mailTo,$v['mail']);
                    }
                    $this->workMail_values[8]=date("Y/m/d H:i:s",time());
                    $_mailTo=implode(",",$mailTo);
                    $_html=vsprintf($this->workMail_msg,$this->workMail_values);
                    $_mailTitle='CRM工单消息:'.$this->workMail_values[2]."----工单状态变更为:".$this->workMail_values[7];     
                    //发送邮件       
                    $r=F_SendMail($_mailTo,$_mailTitle,$_html);  
                   return $r;
           }
           catch (Exception $exception)
           {
                    //遇到错误
                    return -2;
           }

   }
   /*
   工单状态变更通知
   $_POST['id']工单ID
   返回结果解析：
           -1  工单无效
            0  邮件发送失败
            1  邮件发送成功
           -2  服务器无法发送邮件
   */
   function workerstatusmailnotice(){
        if (!IS_POST||!$_POST['id'])
        {
            $this->ajaxReturn(0);
    	    return;
        }
        $result=$this->workerStatusNotice($_POST['id']);
        $this->ajaxReturn($result);
   }
    public function test(){
        $result = F_SendMail('846918463@qq.com','测试邮件','测试邮件内容');
        var_dump($result);
    }
}