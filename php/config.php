<?php
ini_set("display_errors","1");
ini_set("display_startup_errors","1");
error_reporting (E_ALL);

date_default_timezone_set("Europe/Helsinki");
mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");
mb_http_input("UTF-8");
mb_language("uni");
mb_regex_encoding("UTF-8");

$mysql_db = "sql369405";

mysql_connect( "sql3.freemysqlhosting.net","sql369405","tK8%kK6!", TRUE ) or die ("Error: MySQL not connected, Username or Password incorrect?");
?>