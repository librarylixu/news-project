<html>
<body>
snmpget -v 1 -c public 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0<br/>
snmpwalk -On -c public -v 1 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4<br/>
snmpset -v 1 -c private 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0 s ON<br/>
python /usr/xc/pydpms/api/walkapi.py 192.168.1.64 .1.3.6.1.4.1.30966.1.2.1.1.1.4 public<br/>
python /usr/xc/pydpms/api/setapi.py 192.168.1.64 .1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0 ON public s<br/>
python /usr/xc/pydpms/api/getapi.py 192.168.1.64 .1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0 public<br/>
MPI:1.3.6.1.4.1.13400.3.2.255.4.4.2.1.7<br/>
2012:1.3.6.1.4.1.30966.1.2.1.1.1.4<BR/>
<form action="dpms.php" method="post">
<input type="text" style="width:700" name="command" value="<?php echo $command; ?>"/><br/><br/>
<input type="submit" />
</form>
<?php
if(!empty($_POST)){
	try{
	    $command=$_POST['command'];
	    echo $command."<br/><br/>";	
	    //$a=system("python /usr/xc/pydpms/api/walkapi.py 192.168.1.64 .1.3.6.1.4.1.30966.1.2.1.1.1.4 public");
	    //$a=system("snmpwalk -On -c public -v 1 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4",$reg);	
	    //$a=system("snmpget -v 1 -c public 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0",$reg);	
	    //$a=system("snmpset -v 1 -c private 192.168.1.64 1.3.6.1.4.1.30966.1.2.1.1.1.4.1.0 s ON",$reg);	
	    $reg="";	
    
	    $a=exec($command,$reg,$index);	
       // $a=passthru($command);	
        //$a=system($command,$reg);
	    echo "command:";
	    print_r($a);
	    echo "<br/>"; 
	    echo "output:";	
	    print_r($reg);
        echo "<br/>";

	    echo "init:";	
	    print_r($index);
	}catch(Exception $e){

	    echo "Error:".$e->getMessage();

	}
}
?>
</body>
</html>
