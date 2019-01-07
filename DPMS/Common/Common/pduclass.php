<?php
function F_pdu_Command($command){
	//Timeout: No Response from 192.168.7.13.
	$reg="";
	try{ 	    
		$a=exec($command,$reg,$index);			
	 } catch (Exception $exception) {
		print $exception->getMessage();   
	 }
	 return $reg;
}
function F_pdu_snmpget($command){
	//snmpget -v 1 -c public 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.2.2.0
	//snmpget -v 1 -c public 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.11.2.0
	$reg = F_pdu_Command($command);
	if(count($reg) == 0 || strlen($reg[0]) <= 8){
		return false;
	}
	$start_index = 0;
	$start_length = 0;
	if(strpos($reg[0],"STRING:")){
		$start_index = strpos($reg[0],"STRING:") + 9;//STRING类型有双引号，需要将双引号去掉
		$start_length-=1;
	}else{
		$start_index = strpos($reg[0],"INTEGER:") + 8;
	}
	$start_length += strlen($reg[0]) - $start_index;
	$result = substr($reg[0],$start_index,$start_length);	
	return $result;
	//SNMPv2-SMI::enterprises.23273.3.1.1.2.2.0 = STRING: "1.8"
	//$current = F_pdu_snmpget('snmpget -v 1 -c public 192.168.7.13 .1.3.6.1.4.1.23273.3.1.1.2.2.0');
	//var_dump($current);
	//var_dump(floatval($current));
}
function F_pdu_snmpwalk($command){
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6 #端口状态
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.7 #端口电流
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.8 #端口min电流
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.9 #端口max电流
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.10 #端口电能
	//snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.3.1.4.9.0 #端口电能	
	$reg = F_pdu_Command($command);
	if(count($reg) == 0 || strlen($reg[0]) <= 8){
		return false;
	}	
	$resultarr = array();
	$portindex = 1;
	foreach($reg as $k=>$v){		
		$start_index = 0;
		$start_length = 0;
		if(strpos($v,"STRING:")){
			$start_index = strpos($v,"STRING:") + 9;//STRING类型有双引号，需要将双引号去掉
			$start_length-=1;
		}else{
			$start_index = strpos($v,"INTEGER:") + 8;
		}
		$start_length += strlen($v) - $start_index;
		$result = substr($v,$start_index,$start_length);	
		$resultarr[strval($portindex)]=$result;
		$portindex++;
	}
	return $resultarr;
//    $result = F_pdu_snmpwalk('snmpwalk -On -c public -v 1 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.10');
//var_dump($result);
//var_dump(floatval($current));
}
function F_pdu_snmpset($command){
	//snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s ON
	$reg = F_pdu_Command($command);
	if(count($reg) == 0 || strlen($reg[0]) <= 8){
		return false;
	}	
	$start_index = 0;
	$start_length = 0;
	if(strpos($reg[0],"STRING:")){
		$start_index = strpos($reg[0],"STRING:") + 9;//STRING类型有双引号，需要将双引号去掉
		$start_length-=1;
	}else{
		$start_index = strpos($reg[0],"INTEGER:") + 8;
	}
	$start_length += strlen($reg[0]) - $start_index;
	$result = substr($reg[0],$start_index,$start_length);	
	return $result;
}

//snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s ON
//$d = F_pdu_snmpset('snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s OFF');
//var_dump($d);
//sleep(2);
////snmpget -v 1 -c public 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0
//$c = F_pdu_snmpget('snmpget -v 1 -c public 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0');
//var_dump($c);
//SNMP节点信息
function F_pdu_7000_oids(){
	$snmpnodes = array();
	$snmpnodes['walkoid'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1','value'=>0);
	$snmpnodes['voltagevalue'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.2.1.0','value'=>0);
	$snmpnodes['currentvalue'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.2.2.0','value'=>0);
	$snmpnodes['powervalue'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.2.3.0','value'=>0);
	$snmpnodes['powerfactorvalue'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.2.4.0','value'=>0);
	$snmpnodes['energyvalue'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.2.5.0','value'=>0);	
	$snmpnodes['mac'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.1.4.0','value'=>0);
	$snmpnodes['sn'] = array('oid'=>'.1.3.6.1.4.1.23273.3.1.1.1.4.0','value'=>0);
	//传感器
	$snmpnodes['sensorsoid'] = array(
		"temp1"=>".1.3.6.1.4.1.23273.3.1.1.11.1.0",		
		"temp2"=>".1.3.6.1.4.1.23273.3.1.1.11.2.0",	
		"temp3"=>".1.3.6.1.4.1.23273.3.1.1.11.3.0",
		"temp4"=>".1.3.6.1.4.1.23273.3.1.1.11.4.0",
		"hum1"=>".1.3.6.1.4.1.23273.3.1.1.11.5.0",
		"hum2"=>".1.3.6.1.4.1.23273.3.1.1.11.6.0",
		"hum3"=>".1.3.6.1.4.1.23273.3.1.1.11.7.0",
		"hum4"=>".1.3.6.1.4.1.23273.3.1.1.11.8.0",
		"door1"=>".1.3.6.1.4.1.23273.3.1.1.11.9.0",
		"door1"=>".1.3.6.1.4.1.23273.3.1.1.11.10.0",
		"smoke"=>".1.3.6.1.4.1.23273.3.1.1.11.11.0",
		"water"=>".1.3.6.1.4.1.23273.3.1.1.11.12.0",
	);
	//端口状态节点 get or set
	//snmpset -v 1 -c private 192.168.7.163 .1.3.6.1.4.1.23273.3.1.1.6.1.0 s OFF
	$snmpnodes['portstatusoid'] = array();
	for ($i = 1; $i <= 8; $i++){
	    $snmpnodes['portstatusoid'][strval($i)]['oid'] = sprintf(".1.3.6.1.4.1.23273.3.1.1.6.%d.0",$i);
		$snmpnodes['portstatusoid'][strval($i)]['value'] = 0;
	}
	//端口电流节点
	$snmpnodes['portcurrentoid'] = array();
	for ($i = 1; $i <= 8; $i++){
		$snmpnodes['portcurrentoid'][strval($i)]['oid'] = sprintf(".1.3.6.1.4.1.23273.3.1.1.7.%d.0",$i);
		$snmpnodes['portcurrentoid'][strval($i)]['value'] = 0;
	}
	//端口电能节点 
	$snmpnodes['portenergyoid'] = array();
	for ($i = 1; $i <= 8; $i++){
		$snmpnodes['portenergyoid'][strval($i)]['oid'] = sprintf(".1.3.6.1.4.1.23273.3.1.1.10.%d.0",$i);
		$snmpnodes['portenergyoid'][strval($i)]['value'] = 0;
	}
	return $snmpnodes;	
}
//截取值
function F_format_str($value){
	if(count($value) == 0 || strlen($value) <= 8){
		return 0;
	}
	$start_index = 0;
	$start_length = 0;
	if(strpos($value,"STRING:")){
		$start_index = strpos($value,"STRING:") + 9;//STRING类型有双引号，需要将双引号去掉
		$start_length-=1;
	}else{
		$start_index = strpos($value,"INTEGER:") + 8;
	}
	$start_length += strlen($value) - $start_index;
	$result = substr($value,$start_index,$start_length);	
	return $result;
}
?>
