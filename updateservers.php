<?php
/**
 * Created by PhpStorm.
 * User: debasis
 * Date: 6/11/16
 * Time: 12:31 AM
 */
error_reporting(E_ALL);

$output = shell_exec('ls');
print_r( "<pre>$output</pre>");


$output = exec('forever start -o out.log -e err.log  --minUptime 10 --spinSleepTime 10 server.js');
$output = exec("sudo su");
//forever start -o out.log -e err.log  --minUptime 10 --spinSleepTime 10 server.js
//$output = shell_exec('ls');
print_r( "<pre>$output</pre>");