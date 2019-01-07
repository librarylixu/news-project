<?php
/*
2018年3月12日 12:07:25 资产设备

*/
namespace Eimdevice\Controller;
use Crmuser\Controller\CommonController;
class DevicelistController extends CommonController {
    //空控制器操作
    public function _empty(){
		//echo "您要访问的页面不存在";
         $this->display(A('Home/Html')->error404());
    }
	public $modalHtmlPath='Eimdevice@Device:modal';//模态框的路径
	function __construct(){  
        parent::__construct();
    }
    function  __destruct(){     
    
    }

	public function index(){
        $this->assign("mainController","eimAssetsdeviceController");
		$this->display('Eimdevice@Device:index-angular');
    }
   

	/*异步查询数据*/
    public function select_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MSelect($_POST);
        $this->ajaxReturn($data);
    }
    /*异步新增数据*/
    public function add_page_data(){		
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }	
		$postdata = $_POST;
		//加密
		$postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
        $data=$this->MInsert($postdata);
        $this->ajaxReturn($data);
    }
    /*异步更新数据*/
    public function update_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		//
		if(!empty($postdata['loginpwd']) && $postdata['loginpwd'] == ""){
			unset($postdata['loginpwd']);			
		}else{
			$postdata['loginpwd'] = F_base64_encryption($postdata['loginpwd']);
		}
        $data=$this->MUpdate($postdata);
        $this->ajaxReturn($data);
    }
    /*异步删除数据*/
    public function del_page_data(){
        if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
        $data=$this->MDelete($_POST);
        $this->ajaxReturn($data);
    }
	//当前设备的会话详细配置
	public function openmodalconfig(){
        $this->display('Eimdevice@Device:config-info'); 
    }
	public function testssh(){
		$this->display('Device/session/ssh');
	}
	//open ssh 
	public function open_session_ssh_page(){		
		if(!IS_POST){
           $this->ajaxReturn(false);
           exit;
        }
		$postdata = $_POST;
		$result = A("Eimaudit/Eimworklog")->add_eimworklog($postdata);
		$this->ajaxReturn($result);
	}
    //同步设备
    /*
        array (size=25)
      'iddpulist' => string '3' (length=1)
      'devicename' => string '测试电源条ssdd' (length=19)
      'ipaddress' => string '192.168.1.163' (length=13)
      'networkstatus' => string '0' (length=1)
      'modeltypeid' => string '55' (length=2)
      'contactpeople' => string 'lixuxu' (length=6)
      'readcommunity' => string 'public' (length=6)
      'writecommunity' => string 'private' (length=7)
      'totalcurrent' => string '0' (length=1)
      'totalvoltage' => string '0' (length=1)
      'totalenergy' => string '0' (length=1)
      'totalpower' => string '0' (length=1)
      'powerfactor' => string '0' (length=1)
      'mincurrent' => string 'null' (length=4)
      'maxcurrent' => string 'null' (length=4)
      'loginuser' => string 'root' (length=4)
      'loginpwd' => string 'admin' (length=5)
      'sn' => string '' (length=0)
      'del' => string '0' (length=1)
      'index' => string '0' (length=1)
      'refusers' => string '2' (length=1)
      'refutype' => string 'null' (length=4)
      'refugroup' => string '2' (length=1)
      'refdgroup' => string '1' (length=1)
      'deviceid' => string '3' (length=1)
    */
    public function synchronization_device(){
        if(!empty($_POST)){
	        try{
                $item = $_POST;
                //var_dump($_POST);exit();
	            /*取sn*/
                $pdumodel=$item['modeltypename'];
                $command='snmpget -v 1 -c '.$item['readcommunity'] .' '. $item['ipaddress'] .' ';
                $parameter = [];
                /*sn序列号数据*/
                $snoid= C('PDUOID')[$pdumodel]['snoid'];
                $parameter['sn'] = F_pdu_snmpget($command.$snoid);
                /*总电流数据*/
                $pducus= C('PDUOID')[$pdumodel]['getpducusoid']['oid'];
                $parameter['totalcurrent'] = F_pdu_snmpget($command.$pducus)/C('PDUOID')[$pdumodel]['getpducusoid']['calculation'];
                /*总电压数据*/
                $portvol= C('PDUOID')[$pdumodel]['getportvoloid']['oid'];
                $parameter['totalvoltage'] = F_pdu_snmpget($command.$portvol)/C('PDUOID')[$pdumodel]['getportvoloid']['calculation'];
                /*总功率数据*/
                $porpower= C('PDUOID')[$pdumodel]['getpower']['oid'];
                $parameter['totalpower'] = F_pdu_snmpget($command.$porpower)/C('PDUOID')[$pdumodel]['getpower']['calculation'];
                /*总电能数据*/
                $energyoid= C('PDUOID')[$pdumodel]['getenergyoid']['oid'];
                $parameter['totalenergy'] = F_pdu_snmpget($command.$energyoid)/C('PDUOID')[$pdumodel]['getenergyoid']['calculation'];
                /*功率因素数据*/
                $powerfactor= C('PDUOID')[$pdumodel]['getpowerfactor']['oid'];
                $parameter['powerfactor'] = F_pdu_snmpget($command.$powerfactor)/C('PDUOID')[$pdumodel]['getpowerfactor']['calculation'];
                //将pdu得数据存储数据库
                $parameter['iddpulist'] = $item['iddpulist'];//把id给它
                //修改状态
                if($parameter['sn'] != false){
                    $parameter['networkstatus']=1;//在线
                }else{
                    $parameter['networkstatus']=0;//离线
                }
                if($parameter['sn'] == false){
                    $this->ajaxReturn(array());
                    exit();
                }
                $updatepdulist = A('Eimdevice/Dpulist')->MUpdate($parameter);
                //判断是否同步设备成功，如果成功继续添加端口
                $updateportresult = [];
                if($updatepdulist>0 && $parameter['sn'] != false){
                    $updateportresult = $this->synchronization_port($item,$pdumodel,$command);
                    $this->ajaxReturn($updateportresult);
                }else{
                    $this->ajaxReturn($updateportresult);
                }
	        }catch(Exception $e){
	            echo "Error:".$e->getMessage();
	        }
        }
    }
    public function synchronization_port($item,$pdumodel,$command){
         //开始同步dpu端口
            /*端口电流数据*/
            $parameter = [];
            $powerfactor= C('PDUOID')[$pdumodel]['getpowerfactor']['oid'];
            $parameter['powerfactor'] = F_pdu_snmpget($command.$powerfactor)/C('PDUOID')[$pdumodel]['getpowerfactor']['calculation'];
            /*端口电能数据*/
            //$powerfactor= C('PDUOID')[$pdumodel]['getpowerfactor']['oid'];
            //$parameter['powerfactor'] = F_pdu_snmpget($command.$powerfactor)/C('PDUOID')[$pdumodel]['getpowerfactor']['calculation'];
            $portnum= C('PDUOID')[$pdumodel]['portnum'];
            $dpuportlist['dpuid'] = $item['iddpulist'];
            $dpuportlistdata = A('Eimdevice/Dpuportlist')->MSelect($dpuportlist);
            $pduportarr = [];
            foreach($dpuportlistdata as $portlistvalue){
                $pduportarr['port'.$portlistvalue['portnum']] = $portlistvalue;
            }
            /*循环取出状态/电流/电能*/
            for ($i= 1; $i < $portnum+1; $i++)
            {
                if(!array_key_exists('port'.$i,$pduportarr)){
                    $pduportarr['port'.$i] = array('portnum'=>$i);
                }
                //取各端口状态
       	        $portstatusoid=sprintf(C('PDUOID')[$pdumodel]['getportstatusoid'],$i);
                $pduportarr['port'.$i]['portstatus'] = F_pdu_snmpget($command.$portstatusoid);
                //取各端口电流值
                $portcusoid=sprintf(C('PDUOID')[$pdumodel]['getportcusoid']['oid'],$i);
                $pduportarr['port'.$i]['currentvalue'] = F_pdu_snmpget($command.$portcusoid)/C('PDUOID')[$pdumodel]['getportcusoid']['calculation'];
                //取各端口电能值
                $portenergyoid=sprintf(C('PDUOID')[$pdumodel]['getportenergyoid']['oid'],$i);
                $pduportarr['port'.$i]['energyvalue'] = F_pdu_snmpget($command.$portenergyoid)/C('PDUOID')[$pdumodel]['getportenergyoid']['calculation'];
            }
            //$keyarr = ['portstatus','portcus','portenergy'];
            $portresult = [];
            //先查询根据dpuid，判断是否有值，如果有则是存在数据，如果没有，则是添加数据
            foreach($pduportarr as $portvalue){
                $parameterport['portstatus'] = $portvalue['portstatus']==C('PDUOID')[$pdumodel]['setportstatusvalue']['on']?1:0;
                //组件电流得参数
                $parameterport['currentvalue'] = $portvalue['currentvalue'];
                //组件电能得参数
                $parameterport['energyvalue'] = $portvalue['energyvalue'];
                //dpu得外键id
                $parameterport['dpuid'] = $item['iddpulist'];
                $parameterport['portnum'] = $portvalue['portnum'];
                if(array_key_exists('iddpuportlist',$portvalue)){
                    $parameterport['iddpuportlist'] = $portvalue['iddpuportlist'];
                    array_push($portresult,A('Eimdevice/Dpuportlist')->MUpdate($parameterport));  
                }else{
                    array_push($portresult,A('Eimdevice/Dpuportlist')->MInsert($parameterport));  
                }
            }
            return $portresult;
    }
    //开关pdu端口
    public function switch_port(){
        /*设置各端口状态
        前端传 型号、pduip,pdu的write值，端口号,要做的动作(on/off)
        */
        if(!empty($_POST)){
            $portitem = $_POST;
            $pdumodel=$portitem['modeltypename'];
            $portoid=C('PDUOID')[$pdumodel];
            $setPortnumber=sprintf($portoid['setportstatusoid'],$portitem['portnum']);
            $setStatus=$portitem['portstatus'];       
            //snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s OFF
            $command=sprintf('snmpset -v 1 -c %s %s .%s %s %s',$portitem['writecommunity'],$portitem['ipaddress'],$setPortnumber,$portoid['setportstatusvalue']['type'],$portoid['setportstatusvalue'][$setStatus]);               
            $result=F_pdu_snmpset($command);   
            //此处开始更新数据库
            $parameter['iddpuportlist'] = $portitem['iddpuportlist'];
            //写日志操作
            $portsystemlog = [];
            $portsystemlog['result'] = '操作失败！';
            //判断是否执行成功
            if($result == C('PDUOID')[$pdumodel]['setportstatusvalue']['on'] || $result == C('PDUOID')[$pdumodel]['setportstatusvalue']['off']){
                $parameter['portstatus'] = $result == C('PDUOID')[$pdumodel]['setportstatusvalue']['on']?1:0;
                $pduportresult = A('Eimdevice/Dpuportlist')->MUpdate($parameter);
                $portsystemlog['result'] = '操作成功！';
            }
            $portsystemlog['dpuid'] = $portitem['iddpulist'];
            $portsystemlog['portnum'] = $portitem['portnum'];
            $portsystemlog['actionstatus'] = $portitem['portstatus'] == 'on'?1:0;
            A('Eimlog/Logportaction')->add_port_action_log($portsystemlog);
            $this->ajaxReturn($pduportresult);
        }
    }
    public function opensessionmodel(){
        $this->display('Eimdevice@Device:opensessions'); 
    }
}