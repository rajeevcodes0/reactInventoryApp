<?php
require 'database.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = (array)json_decode(file_get_contents('php://input'));
}
$username = $data["user_name"];
$password = $data["password"];
$securePass = password_hash($password,PASSWORD_DEFAULT);
$obj = new query_();
$con = $obj->connect();
// echo 'Current PHP version: ' . phpversion();
$tableName = "users";
$query1 = "INSERT INTO $tableName( `user_name`,`password`) VALUES('$username','$securePass')";
echo $username;
echo $password;
$result = $con->query($query1);    
echo $result;
var_dump($con->error);
?>