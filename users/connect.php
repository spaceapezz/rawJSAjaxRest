<?php
ini_set("log_errors", 1);

$host = "localhost";
$uName = "csc581";
$pWord = "password";

try{
	$myPDO = new PDO("mysql:host=" . $host . ";dbname=ajaxTest", "csc581", "password");

} catch(PDOException $e){

echo $sql . "<br>" . $error->getMessage();	
}


?>
