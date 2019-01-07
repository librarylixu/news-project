<?php
#require_once "../../../vendor/autoload.php";
require_once('../../../hprose/Hprose.php');
use Hprose\Client;

$client = Client::create('http://192.168.7.121/DPMS/Eimsystemsetting/Controller/Eimserverapi.php', false);
var_dump($client->updateworkstatus('2',134));
var_dump($client->selectworkstatus('2'));
