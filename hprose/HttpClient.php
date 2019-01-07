<?php
#require_once "../../../vendor/autoload.php";
 require_once('Hprose.php');
use Hprose\Client;

#$client = Client::create('http://192.168.7.121/index.php/Eimsystemsetting/Eimserverapi', false);
$client = Client::create('http://192.168.7.121/hprose/HttpServer.php', false);

//var_dump($client->select_worklog_data());
var_dump($client->sum(1, 2, 3));
