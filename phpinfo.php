<?php
$db=new PDO('pgsql:host=192.168.7.172;dbname=dsvdbase', "postgres", "Abcd1234");
    var_dump($db);

//$conn_string  =  "host=192.168.7.172 port=5432 dbname=dsvdbase user=postgres password=Abcd1234" ; 
//$dbconn = pg_connect($conn_string);
//if (!$dbconn) 
//    echo "连接失败！！！！！/r/n";
//else 
//    echo "连接成功！！！！！/r/n";
//    pg_close($dbconn);

phpinfo();
?>
