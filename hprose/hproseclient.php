<?php
require_once ('Hprose.php');
$test = new HproseHttpClient("http://localhost/hprose/hproseserver.php");
echo '<br/>';
// var_dump($test->invoke("hello", $args, 0, HproseResultMode::Serialized, 0));
 
echo '<br/>';
// var_dump($test->invoke("hello", $args, 0, HproseResultMode::Raw, 0));
 
echo '<br/>';
// var_dump($test->invoke("hello", $args, 0, HproseResultMode::RawWithEndTag, 0));
 
//echo $test->hello("WORLD");
//echo '<br/>';
$test->asyncHello("WORLD", function ($result)
{
    echo "from client result: ";
    var_dump($result);
});
 
echo '<br/>';
/*
$test->dnslookup("www.baidu.com", function($result, $args) {
    echo "result: ";
    var_dump($result);
    echo "args: ";
    var_dump($args);
});
*/


?>